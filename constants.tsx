
import { AWSModule } from './types';

export const MODULES: Record<string, AWSModule[]> = {
  fundamentals: [
    {
      id: "global-foundation",
      title: "1. The Global Architecture Foundation",
      architectWhy: "Architecture starts with the physical. Designing for high availability requires a deep understanding of Availability Zone (AZ) isolation, Regional fault domains, and Edge Location latency optimization.",
      serviceSynergy: "Utilizes Route 53 health checks and Global Accelerator to route traffic around regional outages while leveraging CloudFront for the Edge.",
      costTip: "Minimize inter-AZ data transfer costs by keeping high-traffic service talk within the same AZ using VPC peering or Transit Gateway strategically.",
      tags: ["Global", "High-Availability", "Infrastructure"],
      documentationUrl: "https://aws.amazon.com/about-aws/global-infrastructure/",
      detailedTopics: [
        {
          title: "Physical Infrastructure: Multi-AZ vs. Multi-Region",
          description: "Understanding the blast radius. AZs provide synchronous replication and local failover, while Regions provide geographic isolation and disaster recovery.",
          keyPoints: [
            "AZ Isolation: Separate power and networking, but low-latency (<10ms).",
            "Regional Selection: Based on compliance (Data Residency), latency, and cost.",
            "High Availability: Always deploy across at least 3 AZs for critical workloads.",
            "Fault Domains: Treating each Region as a completely independent instance of your stack."
          ],
          resources: [
            { type: 'video', title: "AWS Global Infrastructure Deep Dive", url: "https://www.youtube.com/results?search_query=aws+global+infrastructure+deep+dive" },
            { type: 'doc', title: "Regions and Availability Zones", url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html" }
          ]
        },
        {
          title: "The Edge: CloudFront & Global Accelerator",
          description: "Moving the front door closer to the user to eliminate the 'speed of light' bottleneck.",
          keyPoints: [
            "CloudFront: CDN for static/dynamic content caching at Edge Locations.",
            "Global Accelerator: Anycast IP routing over the AWS private backbone.",
            "Latency Reduction: Bypassing the public internet as quickly as possible.",
            "DDoS Shield: Leveraging the scale of the edge to absorb volumetric attacks."
          ],
          resources: [
            { type: 'doc', title: "AWS Global Accelerator vs CloudFront", url: "https://aws.amazon.com/global-accelerator/faqs/" }
          ]
        }
      ],
      useCases: [
        {
          title: "Global E-Commerce Static Content",
          description: "Serve product images from S3 via CloudFront with price-class-all to ensure sub-100ms load times in Tokyo, London, and New York."
        }
      ]
    },
    {
      id: "shared-responsibility",
      title: "2. Shared Responsibility & Trust",
      architectWhy: "Trust is a shared contract. Architects must identify where AWS's platform duty ends and their own responsibility for encryption, patching, and data integrity begins.",
      serviceSynergy: "Leverages AWS Artifact for compliance evidence and CloudTrail + Config for continuous auditing of the shared boundary.",
      costTip: "Automation of security checks via AWS Config reduces the human 'audit tax' and prevents expensive data breaches due to misconfiguration.",
      tags: ["Security", "Compliance", "Trust"],
      documentationUrl: "https://aws.amazon.com/compliance/shared-responsibility-model/",
      detailedTopics: [
        {
          title: "The Line of Demarcation",
          description: "Distinguishing between Security OF the Cloud (AWS) and Security IN the Cloud (Customer).",
          keyPoints: [
            "AWS Responsibility: Physical security, global infrastructure, and managed service software.",
            "Customer Responsibility: Patching guest OS, encrypting data at rest/transit, and IAM.",
            "Inherited Controls: How your SOC2/PCI compliance sits on top of AWS's existing certifications.",
            "The Demarcation Shift: How moving from EC2 to Lambda shifts more responsibility to AWS."
          ],
          resources: [
            { type: 'video', title: "Shared Responsibility in 2026", url: "https://www.youtube.com/results?search_query=aws+shared+responsibility+model+2025" }
          ]
        }
      ],
      useCases: [
        {
          title: "Auditing a Hybrid Cloud Setup",
          description: "Clearly defining that the local admin team patches the on-prem servers, while AWS handles the patching of the underlying RDS host."
        }
      ]
    },
    {
      id: "iam-governance",
      title: "3. IAM & Identity Governance",
      architectWhy: "Moving beyond simple users to Attribute-Based Access Control (ABAC). It allows scaling permissions without policy bloat, using session tags as the primary authorization criteria.",
      serviceSynergy: "Integrates with AWS Organizations for Service Control Policies (SCPs) to set global guardrails that even account admins cannot bypass.",
      costTip: "Leverage IAM Access Analyzer to prune unused permissions; least-privilege reduces security overhead and risk-related costs.",
      tags: ["Security", "Identity", "Zero-Trust"],
      documentationUrl: "https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html",
      detailedTopics: [
        {
          title: "Zero Trust: Identity as the Perimeter",
          description: "Never trust, always verify. Every request must be authenticated and authorized, regardless of network location.",
          keyPoints: [
            "Identity-Centric: Moving away from IP-based allowlists to IAM-based verification.",
            "Least Privilege: Granting only what is necessary, for as long as it's necessary.",
            "Service-Linked Roles: Allowing AWS services to securely interact on your behalf.",
            "MFA Everywhere: Enforcing multi-factor authentication for every human access point."
          ],
          resources: [
            { type: 'doc', title: "Zero Trust on AWS Whitepaper", url: "https://d1.awsstatic.com/whitepapers/Architecture/zero-trust-architecture-on-aws.pdf" }
          ]
        },
        {
          title: "ABAC & SCPs",
          description: "Scaling authorization through tags and centralized guardrails.",
          keyPoints: [
            "ABAC: Using ${aws:PrincipalTag/project} to match resource tags automatically.",
            "SCPs: Maximum permission guardrails that can block Root and deny unauthorized regions.",
            "Governance at Scale: Using AWS Organizations to automate account creation and baseline security."
          ],
          resources: [
            { type: 'video', title: "Advanced ABAC Patterns", url: "https://www.youtube.com/results?search_query=aws+abac+deep+dive" }
          ]
        }
      ],
      useCases: [
        {
          title: "FinTech Developer Sandbox",
          description: "Use SCPs to ensure no developer can create expensive p4d instances, while ABAC allows them to manage only the S3 buckets tagged with their UserID."
        }
      ]
    },
    {
      id: "vpc-networking",
      title: "4. VPC Networking Foundations",
      architectWhy: "The VPC is your digital fortress. Tiered isolation (Public/Private/Data) and the elimination of public IPs via PrivateLink are essential for modern security.",
      serviceSynergy: "Uses VPC Endpoints (Interface and Gateway) to communicate with S3 or DynamoDB without traversing the public internet.",
      costTip: "Avoid high NAT Gateway data processing charges by using VPC Gateway Endpoints for S3 and DynamoDB—they are free.",
      tags: ["Networking", "VPC", "Security"],
      documentationUrl: "https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html",
      detailedTopics: [
        {
          title: "Tiered Isolation Strategies",
          description: "Designing a 3-tier architecture with Public, Private, and Database subnets for maximum depth-of-defense.",
          keyPoints: [
            "Public Subnet: Internet-facing resources like ALBs and NAT Gateways.",
            "Private Subnet: Application servers, no direct route to the IGW.",
            "Data Subnet: Fully isolated subnet for DBs, only accessible from the App tier.",
            "Security Group Chaining: Referencing the App SG as the source for the DB SG inbound rules."
          ],
          resources: [
            { type: 'doc', title: "VPC Subnetting Basics", url: "https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Subnets.html" }
          ]
        },
        {
          title: "VPC Endpoints & PrivateLink",
          description: "Connecting to AWS services or 3rd party APIs without internet exposure.",
          keyPoints: [
            "Interface Endpoints: ENIs powered by PrivateLink for internal service access.",
            "Gateway Endpoints: Routing-based access for S3 and DynamoDB (free).",
            "Privacy: Traffic never leaves the Amazon network backbone.",
            "Transit Gateway: Centralized routing for multi-VPC and hybrid-cloud connectivity."
          ],
          resources: [
            { type: 'video', title: "Deep Dive on AWS PrivateLink", url: "https://www.youtube.com/results?search_query=aws+privatelink+deep+dive" }
          ]
        }
      ],
      useCases: [
        {
          title: "PCI-DSS Payment Processing",
          description: "Host the payment processor in a private subnet with no NAT Gateway, using VPC Endpoints to upload logs directly to CloudWatch without any internet route."
        }
      ]
    },
    {
      id: "s3-backbone",
      title: "5. S3: The Data Backbone",
      architectWhy: "S3 is more than a bucket; it's the foundation for data lakes. Architects must master strong consistency, object locking for WORM compliance, and lifecycle governance.",
      serviceSynergy: "Feeds data into Athena for serverless SQL queries and Glue for cataloging decentralized data sets.",
      costTip: "Enable S3 Intelligent-Tiering to automatically move data to lower-cost tiers based on access patterns without any management overhead.",
      tags: ["Storage", "Data-Lake", "Analytics"],
      documentationUrl: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html",
      detailedTopics: [
        {
          title: "Consistency Models & Security Posture",
          description: "Understanding Strong Consistency for distributed systems and securing objects against accidental exposure.",
          keyPoints: [
            "Strong Consistency: Immediate read-after-write for new objects and overwrites.",
            "Block Public Access: The organization-level switch to prevent data leaks.",
            "Object Lock: WORM (Write Once Read Many) for compliance-heavy industries.",
            "Versioning: Protection against accidental deletions or logic errors."
          ],
          resources: [
            { type: 'doc', title: "S3 Consistency Model", url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel" }
          ]
        },
        {
          title: "Storage Tiers & Lifecycle Management",
          description: "Optimizing for cost without sacrificing the 11 9's of durability.",
          keyPoints: [
            "S3 Standard vs Glacier: Trade-offs in retrieval time vs storage cost.",
            "Lifecycle Policies: Automating transitions to cheaper tiers (Standard-IA, OneZone-IA).",
            "Intelligent Tiering: The 'Set and Forget' tier for unpredictable workloads.",
            "Multi-Region Replication: Syncing data across buckets in different continents."
          ],
          resources: [
            { type: 'video', title: "S3 Storage Classes Explained", url: "https://www.youtube.com/results?search_query=aws+s3+storage+classes" }
          ]
        }
      ],
      useCases: [
        {
          title: "Healthcare Medical Imaging Archive",
          description: "Store X-ray images in S3 Standard for 30 days, lifecycle them to Glacier Instant Retrieval for 7 years, and use Object Lock to prevent tampering."
        }
      ]
    },
    {
      id: "compute-foundations",
      title: "6. Compute Foundations (EC2 to Lambda)",
      architectWhy: "Selecting between EC2 (Full Control), ECS/EKS (Container Orchestration), and Lambda (Serverless) depends on the workload's volatility and execution profile.",
      serviceSynergy: "Combines Auto Scaling Groups with Application Load Balancers (ALB) to ensure the compute layer breathes with traffic demand.",
      costTip: "Leverage Compute Optimizer to find the 'goldilocks' instance size; under-provisioned hurts performance, over-provisioned wastes capital.",
      tags: ["Compute", "Serverless", "Scaling"],
      documentationUrl: "https://aws.amazon.com/products/compute/",
      detailedTopics: [
        {
          title: "Compute Selection: Right-Sizing",
          description: "Choosing the right engine for the right job (Memory vs. Compute vs. Storage optimized).",
          keyPoints: [
            "Instance Families: C-series (Compute), R-series (RAM), T-series (Burstable).",
            "Purchasing Models: On-Demand, Savings Plans, and Spot Instances (up to 90% savings).",
            "Auto Scaling: Dynamically matching capacity to demand using metrics like CPU or RequestCount.",
            "Graviton: ARM-based processors providing better price-performance."
          ],
          resources: [
            { type: 'doc', title: "EC2 Instance Types", url: "https://aws.amazon.com/ec2/instance-types/" }
          ]
        },
        {
          title: "The Serverless Mindset",
          description: "Decoupling execution from long-lived infrastructure to focus on value.",
          keyPoints: [
            "Lambda: Event-driven execution without managing a single server.",
            "Event Sources: API Gateway, S3 triggers, SQS polling, and EventBridge.",
            "Cold Starts: Managing initialization latency for customer-facing APIs.",
            "Stateless Design: Why serverless requires external state (DynamoDB/ElastiCache)."
          ],
          resources: [
            { type: 'video', title: "Serverless Architectural Patterns", url: "https://www.youtube.com/results?search_query=aws+serverless+patterns" }
          ]
        }
      ],
      useCases: [
        {
          title: "Viral Marketing Burst Workload",
          description: "Use Lambda to handle sudden surges of 100k requests/min during a Super Bowl ad, scaling from 0 to peak in seconds."
        }
      ]
    },
    {
      id: "well-architected",
      title: "7. The Well-Architected Framework",
      architectWhy: "Provides a structured baseline to evaluate architectures across 6 pillars, ensuring durability, efficiency, and operational excellence.",
      serviceSynergy: "Acts as the blueprint for using AWS Well-Architected Tool and Trusted Advisor to maintain production health.",
      costTip: "Prioritize the Sustainability Pillar to reduce resource waste, which directly aligns with lower monthly AWS bills.",
      tags: ["Strategy", "Framework", "Governance"],
      documentationUrl: "https://aws.amazon.com/architecture/well-architected/",
      detailedTopics: [
        {
          title: "The 6 Pillars of Excellence",
          description: "The core framework used to review every major architecture on AWS.",
          keyPoints: [
            "Operational Excellence: Running and monitoring systems for value.",
            "Security: Protecting information, systems, and assets.",
            "Reliability: Recovering from infrastructure or service disruptions.",
            "Performance Efficiency: Using IT and computing resources efficiently.",
            "Cost Optimization: Avoiding unnecessary costs.",
            "Sustainability: Minimizing the environmental impacts of running workloads."
          ],
          resources: [
            { type: 'doc', title: "The Well-Architected Pillars", url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/pillars.html" }
          ]
        }
      ],
      useCases: [
        {
          title: "Production Readiness Review (PRR)",
          description: "Before launching a new bank core, the architect performs a review to find 'High Risk Issues' (HRIs) like missing Multi-AZ for the database."
        }
      ]
    },
    {
      id: "finops-sustainability",
      title: "8. Architectural FinOps & Sustainability",
      architectWhy: "Architects are now fiscal owners. Designing for sustainability (carbon reduction) naturally leads to designing for cost efficiency.",
      serviceSynergy: "Uses AWS Budgets and the Customer Carbon Footprint Tool to visualize the impact of technical decisions on spend and the planet.",
      costTip: "Tag resources by 'Project' and 'Owner'. Without cost-allocation tags, you cannot identify which architectural choice is driving costs.",
      tags: ["FinOps", "Cost", "Sustainability"],
      documentationUrl: "https://docs.aws.amazon.com/wellarchitected/latest/sustainability-pillar/sustainability-pillar.html",
      detailedTopics: [
        {
          title: "Visibility: Cost Explorer & Budgets",
          description: "You cannot manage what you cannot measure.",
          keyPoints: [
            "Cost Explorer: Visualizing trends and identifying spikes.",
            "AWS Budgets: Setting custom alerts before you exceed your spend.",
            "Compute Optimizer: AI-driven recommendations to reduce instance waste.",
            "Unit Metrics: Measuring the cost per 1,000 requests or per active user."
          ],
          resources: [
            { type: 'video', title: "FinOps on AWS Masterclass", url: "https://www.youtube.com/results?search_query=aws+finops+tutorial" }
          ]
        },
        {
          title: "Sustainability Pillar",
          description: "Designing architectures that consume less carbon and cost.",
          keyPoints: [
            "Rightsizing: Reducing unused compute cycles.",
            "Energy Efficient Hardware: Moving to Graviton processors.",
            "Data Lifecycle: Not storing 'garbage data' forever.",
            "Shared Resources: Using Multi-tenant services to maximize utilization."
          ],
          resources: [
            { type: 'doc', title: "Sustainability Design Principles", url: "https://docs.aws.amazon.com/wellarchitected/latest/sustainability-pillar/design-principles-for-sustainability-in-the-cloud.html" }
          ]
        }
      ],
      useCases: [
        {
          title: "Reducing Cloud Bill by 30%",
          description: "Identifying idle development environments using Cost Explorer and scheduling them to turn off after 6 PM using Instance Scheduler."
        }
      ]
    }
  ],
  'core-services': [
    {
      id: "lambda-serverless",
      title: "Lambda & Serverless Compute",
      architectWhy: "Removes infrastructure management to focus entirely on code and business value. Scales effortlessly from zero to peak demand.",
      serviceSynergy: "Pairs with EventBridge for event-driven flows and DynamoDB for low-latency state management.",
      costTip: "Switch to Graviton3 (ARM64) runtimes for 25% better performance at 20% lower cost.",
      tags: ["Compute", "Serverless", "Scaling"],
      documentationUrl: "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html"
    }
  ],
  architecture: [
    {
      id: "event-driven",
      title: "Event-Driven Modernization",
      architectWhy: "Decouples services to improve fault tolerance and enable independent scaling. The gold standard for resilient, extensible microservices.",
      serviceSynergy: "Centered around EventBridge as the backbone, connecting SNS, SQS, and Step Functions for complex orchestration.",
      costTip: "Replace constant API polling with EventBridge event-driven triggers to eliminate costs associated with idle compute cycles.",
      tags: ["Patterns", "Events", "Decoupling"],
      documentationUrl: "https://aws.amazon.com/event-driven-architecture/"
    }
  ]
};

export const CLOUDFORMATION_VPC = `AWSTemplateFormatVersion: '2010-09-09'
Description: 'Architect Masterclass: Multi-Tier Isolated Network'

Parameters:
  VpcCIDR:
    Type: String
    Default: 10.0.0.0/16

Resources:
  # VPC Definition
  MasterVPC:
    Type: 'AWS::EC2::VPC'
    Properties:
      CidrBlock: !Ref VpcCIDR
      EnableDnsSupport: true
      EnableDnsHostnames: true
      Tags:
        - Key: Name
          Value: ArchitectureMasterclassVPC

  # Subnets
  PublicSubnet:
    Type: 'AWS::EC2::Subnet'
    Properties:
      VpcId: !Ref MasterVPC
      CidrBlock: 10.0.1.0/24
      MapPublicIpOnLaunch: true
      AvailabilityZone: !Select [ 0, !GetAZs '' ]
      Tags:
        - Key: Tier
          Value: Public

  PrivateSubnet:
    Type: 'AWS::EC2::Subnet'
    Properties:
      VpcId: !Ref MasterVPC
      CidrBlock: 10.0.2.0/24
      AvailabilityZone: !Select [ 0, !GetAZs '' ]
      Tags:
        - Key: Tier
          Value: Application

  IsolatedSubnet:
    Type: 'AWS::EC2::Subnet'
    Properties:
      VpcId: !Ref MasterVPC
      CidrBlock: 10.0.3.0/24
      AvailabilityZone: !Select [ 0, !GetAZs '' ]
      Tags:
        - Key: Tier
          Value: Database

  # Internet Gateway for Public Tier
  InternetGateway:
    Type: 'AWS::EC2::InternetGateway'

  VPCGatewayAttachment:
    Type: 'AWS::EC2::VPCGatewayAttachment'
    Properties:
      VpcId: !Ref MasterVPC
      InternetGatewayId: !Ref InternetGateway

  # Route Tables
  PublicRouteTable:
    Type: 'AWS::EC2::RouteTable'
    Properties:
      VpcId: !Ref MasterVPC

  DefaultPublicRoute:
    Type: 'AWS::EC2::Route'
    DependsOn: VPCGatewayAttachment
    Properties:
      RouteTableId: !Ref PublicRouteTable
      DestinationCidrBlock: 0.0.0.0/0
      GatewayId: !Ref InternetGateway

  PublicSubnetAssociation:
    Type: 'AWS::EC2::SubnetRouteTableAssociation'
    Properties:
      SubnetId: !Ref PublicSubnet
      RouteTableId: !Ref PublicRouteTable

Outputs:
  VpcId:
    Description: 'ID of the newly created VPC'
    Value: !Ref MasterVPC
`;
