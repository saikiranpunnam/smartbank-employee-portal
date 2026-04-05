# SmartBank 3-Tier Architecture

## Flow
User → Route53 → CloudFront → WAF → ALB → EC2 → RDS

## Layers

### Web Tier
- Frontend EC2
- Public subnet

### App Tier
- Backend EC2
- Private subnet

### DB Tier
- RDS MySQL
- Private subnet

## Key Features
- High availability
- Auto scaling
- Secure network isolation
