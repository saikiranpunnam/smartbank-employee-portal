pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKER_IMAGE         = 'YOUR_DOCKERHUB_USERNAME/smartbank-portal'
        GIT_REPO_URL         = 'https://github.com/YOUR_GITHUB_USERNAME/smartbank-employee-portal.git'
        GIT_CREDENTIALS_ID   = 'github-credentials'
        SONAR_PROJECT_KEY    = 'smartbank-portal'
    }

    tools {
        nodejs 'NodeJS-18'
    }

    stages {

        // ─── STAGE 1: Checkout ───────────────────────
        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: "${GIT_CREDENTIALS_ID}",
                    url: "${GIT_REPO_URL}"
                echo 'Source code checked out successfully'
            }
        }

        // ─── STAGE 2: Build (npm install) ────────────
        stage('Build') {
            steps {
                dir('backend') {
                    sh 'npm install'
                    sh 'npm run build --if-present'
                }
                echo 'Build stage completed'
            }
        }

        // ─── STAGE 3: Code Coverage ──────────────────
        stage('Code Coverage') {
            steps {
                dir('backend') {
                    sh 'npm install --save-dev jest @jest/coverage-provider'
                    sh 'npx jest --coverage --coverageReporters=lcov --passWithNoTests'
                }
            }
            post {
                always {
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'backend/coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }

        // ─── STAGE 4: SonarQube Analysis ─────────────
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube-Server') {
                    sh """
                        sonar-scanner \
                          -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                          -Dsonar.projectName='SmartBank Employee Portal' \
                          -Dsonar.sources=backend,frontend \
                          -Dsonar.javascript.lcov.reportPaths=backend/coverage/lcov.info \
                          -Dsonar.exclusions=**/node_modules/**
                    """
                }
            }
        }

        // ─── STAGE 5: Quality Gate ───────────────────
        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        // ─── STAGE 6: Docker Build ───────────────────
        stage('Docker Build') {
            steps {
                sh """
                    docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} \
                                 -t ${DOCKER_IMAGE}:latest \
                                 --build-arg BUILD_NUM=${BUILD_NUMBER} .
                """
                echo "Docker image built: ${DOCKER_IMAGE}:${BUILD_NUMBER}"
            }
        }

        // ─── STAGE 7: Push to DockerHub ──────────────
        stage('Push to DockerHub') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                sh "docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}"
                sh "docker push ${DOCKER_IMAGE}:latest"
                sh 'docker logout'
            }
        }

        // ─── STAGE 8: Update deployment.yaml ─────────
        stage('Update Deployment Manifest') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'github-credentials',
                    usernameVariable: 'GIT_USER',
                    passwordVariable: 'GIT_TOKEN'
                )]) {
                    sh """
                        git config user.email "jenkins@smartbank.com"
                        git config user.name "Jenkins CI"

                        sed -i 's|image: ${DOCKER_IMAGE}:.*|image: ${DOCKER_IMAGE}:${BUILD_NUMBER}|g' \\
                            k8s/deployment.yaml

                        git add k8s/deployment.yaml
                        git commit -m "ci: update image to build ${BUILD_NUMBER} [skip ci]"
                        git push https://${GIT_USER}:${GIT_TOKEN}@github.com/YOUR_GITHUB_USERNAME/smartbank-employee-portal.git main
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline succeeded! Image: ${DOCKER_IMAGE}:${BUILD_NUMBER}"
            sh "docker rmi ${DOCKER_IMAGE}:${BUILD_NUMBER} || true"
        }
        failure {
            echo 'Pipeline failed. Check stage logs above.'
        }
        always {
            cleanWs()
        }
    }
}
