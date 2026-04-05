# AWS Setup Guide

## 1. VPC
- CIDR: 10.0.0.0/16
- Public + Private subnets

## 2. Networking
- IGW → public access
- NAT → private outbound

## 3. EC2
- Frontend → Public subnet
- Backend → Private subnet

## 4. RDS
- Private subnet only
- No public access

## 5. Security Groups
- Strict communication rules
