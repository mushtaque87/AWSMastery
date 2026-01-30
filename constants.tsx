
import React from 'react';
import { AWSModule } from './types';

export const MODULES: Record<string, AWSModule[]> = {
  fundamentals: [
    {
      title: "IAM & Zero Trust Governance",
      architectWhy: "Granular control ensures your blast radius is minimized while enabling cross-functional agility. It is the bedrock of the 'Security by Design' principle in 2026 architectures.",
      serviceSynergy: "Integrates with AWS Organizations (SCPs) and resource-based policies in S3/KMS to create a defense-in-depth posture.",
      costTip: "Leverage IAM Access Analyzer to prune unused permissions; least-privilege reduces security overhead and expensive remediation cycles.",
      tags: ["Security", "Identity", "Governance"]
    },
    {
      title: "The Well-Architected Framework",
      architectWhy: "Provides a structured baseline to evaluate architectures across 6 pillars, ensuring sustainability and operational excellence. It prevents technical debt from accruing during rapid scaling.",
      serviceSynergy: "Acts as the blueprint for using Trusted Advisor and Config to automate compliance and reliability checks.",
      costTip: "Prioritize the Sustainability Pillar to reduce resource waste, which naturally aligns with lowering your compute/storage bill by up to 40%.",
      tags: ["Best Practices", "Strategy", "Compliance"]
    }
  ],
  'core-services': [
    {
      title: "Lambda & Serverless Compute",
      architectWhy: "Removes infrastructure management to focus entirely on code and business value. Scales effortlessly from zero to peak demand with no idle resource costs.",
      serviceSynergy: "Pairs with EventBridge for event-driven flows and DynamoDB for low-latency state management.",
      costTip: "Switch to Graviton3 (ARM64) runtimes for 25% better performance at 20% lower cost than traditional x86 instances.",
      tags: ["Compute", "Serverless", "Scaling"]
    },
    {
      title: "Aurora Serverless v3",
      architectWhy: "A high-performance relational database that scales compute capacity instantly based on application demand. Perfect for unpredictable workloads requiring SQL consistency.",
      serviceSynergy: "Works with RDS Proxy to handle high-concurrency Lambda connections and Secrets Manager for automated credential rotation.",
      costTip: "Utilize I/O-Optimized storage for write-heavy workloads to cap unpredictable I/O costs and save up to 40% on total database spend.",
      tags: ["Database", "SQL", "High Availability"]
    },
    {
      title: "S3 Express One Zone",
      architectWhy: "High-performance storage designed for the most latency-sensitive data processing workloads. Ideal for ML training and real-time analytics.",
      serviceSynergy: "Integrates with SageMaker for high-speed data feeding and Mountpoint for S3 to simplify data access patterns.",
      costTip: "Use Lifecycle Policies to transition data to Glacier Deep Archive for long-term retention, reducing costs by 95% compared to S3 Standard.",
      tags: ["Storage", "Performance", "Data Lake"]
    }
  ],
  architecture: [
    {
      title: "Event-Driven Modernization",
      architectWhy: "Decouples services to improve fault tolerance and enable independent scaling of microservices. It is the gold standard for resilient 2026 cloud applications.",
      serviceSynergy: "Centered around EventBridge as the backbone, connecting SNS, SQS, and Step Functions for complex orchestrations.",
      costTip: "Replace constant polling with event-driven triggers to eliminate 100% of 'idle check' costs in your application logic.",
      tags: ["Patterns", "Events", "Decoupling"]
    },
    {
      title: "Multi-Region Active-Active",
      architectWhy: "Provides business continuity for mission-critical apps by serving traffic from two or more regions simultaneously. Minimizes RTO/RPO to seconds.",
      serviceSynergy: "Requires Route 53 Health Checks, Global Accelerator, and DynamoDB Global Tables for cross-region data sync.",
      costTip: "Use intelligent routing to serve users from the nearest region, reducing data transfer costs (egress) while improving latency.",
      tags: ["Reliability", "Global", "Disaster Recovery"]
    },
    {
      title: "Modern Data Mesh",
      architectWhy: "Decentralizes data ownership to domain teams, removing the central data engineering bottleneck while maintaining centralized governance and discoverability.",
      serviceSynergy: "Leverages AWS Lake Formation for cross-account permissioning and Amazon DataZone for a business-ready data catalog.",
      costTip: "Utilize Glue Flex jobs for non-critical batch processing to save up to 34% compared to standard Glue interactive sessions.",
      tags: ["Data", "Governance", "Scale"]
    }
  ]
};

export const CLOUDFORMATION_VPC = `
# AWS Architect Masterclass: Production-Ready Multi-Tier VPC
# Features: Public, Private, and Database Subnets across 2 AZs.
AWSTemplateFormatVersion: '2010-09-09'
Description: 'VPC with Multi-Tier Isolation and High Availability'

Parameters:
  VpcCIDR:
    Type: String
    Default: 10.0.0.0/16
  ProjectName:
    Type: String
    Default: ArchitectMasterclass

Resources:
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: !Ref VpcCIDR
      EnableDnsSupport: true
      EnableDnsHostnames: true
      Tags:
        - Key: Name
          Value: !Sub \`\${ProjectName}-VPC\`

  # --- NETWORK ISOLATION LOGIC ---
  # Tier 1: Public Subnet (ALBs, NAT Gateways)
  PublicSubnetA:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      AvailabilityZone: !Select [ 0, !GetAZs '' ]
      CidrBlock: 10.0.1.0/24
      MapPublicIpOnLaunch: true

  # Tier 2: App Subnet (Private - Fargate/EC2)
  PrivateSubnetA:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      AvailabilityZone: !Select [ 0, !GetAZs '' ]
      CidrBlock: 10.0.2.0/24

  # Tier 3: Data Subnet (Strict Private - Aurora/RDS)
  DataSubnetA:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      AvailabilityZone: !Select [ 0, !GetAZs '' ]
      CidrBlock: 10.0.3.0/24

  # --- SECURITY GROUP LOGIC ---
  # Logic: Only allow traffic from Tier 1 to Tier 2, and Tier 2 to Tier 3.
  # This prevents direct access to the database from the public internet.
  
  AppSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Allow traffic from Public Tier only
      VpcId: !Ref VPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          CidrIp: 10.0.1.0/24 # Restricted to Public Subnet range

  DatabaseSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Allow traffic from App Tier only
      VpcId: !Ref VPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 5432
          ToPort: 5432
          SourceSecurityGroupId: !Ref AppSecurityGroup # Only the App Tier can talk to DB

Outputs:
  VPCId:
    Description: The VPC ID
    Value: !Ref VPC
`;
