
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
      architectWhy: "The VPC is your digital fortress. Tiered isolation (Public, Private, and Database subnets) and the elimination of public IPs via PrivateLink are essential for modern security.",
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
        }
      ],
      useCases: [
        {
          title: "PCI-DSS Payment Processing",
          description: "Host the payment processor in a private subnet with no NAT Gateway, using VPC Endpoints to upload logs directly to CloudWatch."
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
        }
      ],
      useCases: [
        {
          title: "Healthcare Medical Imaging Archive",
          description: "Store X-ray images in S3 Standard, lifecycle them to Glacier Instant Retrieval for 7 years, and use Object Lock to prevent tampering."
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
            "Security: Protecting information, systems, and assets.",
            "Reliability: Recovering from infrastructure or service disruptions.",
            "Performance Efficiency: Using IT and computing resources efficiently.",
            "Cost Optimization: Avoiding unnecessary costs.",
            "Operational Excellence & Sustainability: Running workloads for value and planet-friendly efficiency."
          ],
          resources: [
            { type: 'doc', title: "The Well-Architected Pillars", url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/pillars.html" }
          ]
        }
      ],
      useCases: [
        {
          title: "Production Readiness Review (PRR)",
          description: "Before launching a new bank core, the architect performs a review to find 'High Risk Issues' (HRIs)."
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
            "Sustainability: Designing architectures that consume less carbon by reducing unused compute cycles."
          ],
          resources: [
            { type: 'video', title: "FinOps on AWS Masterclass", url: "https://www.youtube.com/results?search_query=aws+finops+tutorial" }
          ]
        }
      ],
      useCases: [
        {
          title: "Reducing Cloud Bill by 30%",
          description: "Identifying idle development environments and scheduling them to turn off after hours."
        }
      ]
    }
  ],
  'core-services': [
    {
      id: "relational-db",
      title: "1. Relational Mastery (RDS & Aurora)",
      architectWhy: "Choosing between standard RDS and cloud-native Aurora is a critical decision for performance, availability, and cost. Aurora's storage architecture is a fundamental departure from traditional SQL hosting.",
      serviceSynergy: "Pairs with RDS Proxy to handle high-concurrency Lambda connections and Secrets Manager for automatic credential rotation.",
      costTip: "Use Aurora Serverless v2 for unpredictable workloads and Reserved Instances for steady-state production nodes to save up to 60%.",
      tags: ["Database", "SQL", "High-Availability"],
      documentationUrl: "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.html",
      detailedTopics: [
        {
          title: "Aurora vs. Standard RDS",
          description: "Deep dive into the Aurora distributed storage layer vs standard block storage (EBS) used by RDS.",
          keyPoints: [
            "Replication: Aurora replicates 6 copies of data across 3 AZs by default.",
            "Self-Healing: Aurora storage nodes automatically repair segments without impacting DB performance.",
            "Read Replicas: Aurora supports up to 15 replicas with sub-10ms lag.",
            "Global Database: Cross-region replication with <1 second typical latency."
          ],
          resources: [
            { type: 'video', title: "Amazon Aurora Deep Dive", url: "https://www.youtube.com/results?search_query=amazon+aurora+deep+dive" },
            { type: 'doc', title: "RDS High Availability (Multi-AZ)", url: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html" }
          ]
        }
      ],
      useCases: [
        {
          title: "Mission-Critical Banking Ledger",
          description: "Utilize Aurora Multi-Master or Multi-AZ with Global Database for 99.99% availability and regional failover compliance."
        }
      ]
    },
    {
      id: "nosql-persistence",
      title: "2. NoSQL Persistence (DynamoDB)",
      architectWhy: "DynamoDB offers 'single-digit millisecond' performance at any scale. Mastering Partition Keys and Global Secondary Indexes is the difference between a fast system and a bottlenecked one.",
      serviceSynergy: "Streams data to Lambda for real-time event processing or Kinesis for downstream analytics.",
      costTip: "Use On-Demand capacity for spiky workloads and Provisioned with Auto Scaling for predictable traffic to minimize costs.",
      tags: ["NoSQL", "Performance", "Serverless"],
      documentationUrl: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html",
      detailedTopics: [
        {
          title: "Data Modeling: Keys & Indexes",
          description: "Moving from Relational thinking to Single-Table Design.",
          keyPoints: [
            "Partition Key (PK): Used to spread data across physical shards.",
            "Global Secondary Indexes (GSI): Querying data on non-key attributes across all partitions.",
            "DAX: In-memory caching for 10x read performance (microseconds).",
            "TTL: Automatically purging transient data (e.g., session tokens) to save storage costs."
          ],
          resources: [
            { type: 'video', title: "Rick Houlihan: DynamoDB Advanced Modeling", url: "https://www.youtube.com/results?search_query=rick+houlihan+dynamodb" }
          ]
        }
      ],
      useCases: [
        {
          title: "Social Media Feed & User Profiles",
          description: "Using DynamoDB Global Tables to provide low-latency reads/writes for a globally distributed user base."
        }
      ]
    },
    {
      id: "advanced-compute",
      title: "3. Elastic Compute & Containers (ECS/Fargate)",
      architectWhy: "While EC2 provides full control, ECS/Fargate removes the 'undifferentiated heavy lifting' of server management, allowing you to focus on the container lifecycle.",
      serviceSynergy: "Integrates with App Mesh for service-discovery and CloudWatch Container Insights for granular monitoring.",
      costTip: "Run non-critical workloads on Fargate Spot to reduce compute costs by up to 70% compared to On-Demand.",
      tags: ["Compute", "Containers", "Orchestration"],
      documentationUrl: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html",
      detailedTopics: [
        {
          title: "ECS vs EKS vs Fargate",
          description: "Navigating the container orchestration landscape on AWS.",
          keyPoints: [
            "ECS: The native, integrated AWS orchestrator. Simple and powerful.",
            "EKS: Managed Kubernetes for those requiring open-source compatibility.",
            "Fargate: The serverless compute engine for containers. No instances to manage.",
            "Task Definitions: The JSON blueprint for your application (vCPU, Memory, Ports)."
          ],
          resources: [
            { type: 'doc', title: "ECS Best Practices", url: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/best-practices.html" }
          ]
        }
      ],
      useCases: [
        {
          title: "Microservices Modernization",
          description: "Breaking a monolith into 50+ Fargate-based microservices behind an Application Load Balancer."
        }
      ]
    },
    {
      id: "storage-efs-ebs",
      title: "4. File & Block Storage (EFS & EBS)",
      architectWhy: "Not all data belongs in S3. EBS provides low-latency block storage for databases, while EFS offers shared, concurrent file access for distributed web fleets.",
      serviceSynergy: "EFS mounts directly to Lambda functions or Fargate tasks for shared state across serverless execution.",
      costTip: "Use EBS Snapshots and EFS Lifecycle Management (Infrequent Access) to move older files to cheaper tiers automatically.",
      tags: ["Storage", "Block", "FileSystem"],
      documentationUrl: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AmazonEBS.html",
      detailedTopics: [
        {
          title: "Throughput & Performance Modes",
          description: "Understanding IOPS vs Throughput for storage performance.",
          keyPoints: [
            "EBS gp3: Provision throughput and IOPS independently. The modern standard.",
            "EBS io2 Block Express: SAN-in-the-cloud performance for SAP/Oracle.",
            "EFS Elastic Throughput: Automatically scales to meet spikes without pre-provisioning.",
            "Mount Targets: Creating localized access points in each AZ for low-latency EFS access."
          ],
          resources: [
            { type: 'video', title: "EBS vs EFS vs S3: When to use what?", url: "https://www.youtube.com/results?search_query=aws+ebs+efs+s3+comparison" }
          ]
        }
      ],
      useCases: [
        {
          title: "Shared Media CMS",
          description: "Using EFS to provide a shared file system for a fleet of WordPress servers, allowing simultaneous file edits."
        }
      ]
    },
    {
      id: "messaging-patterns",
      title: "5. Messaging & Decoupling (SQS & SNS)",
      architectWhy: "Decoupling is the key to resilience. SQS provides asynchronous buffer zones, while SNS enables massive-scale fan-out for notification-driven architectures.",
      serviceSynergy: "Pairs with Lambda for automatic polling (SQS) and EventBridge for sophisticated routing logic.",
      costTip: "Use SQS Long Polling (WaitTimeSeconds > 0) to reduce empty receives and significantly lower API costs.",
      tags: ["Messaging", "Decoupling", "Serverless"],
      documentationUrl: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html",
      detailedTopics: [
        {
          title: "Fan-out & Asynchronous Processing",
          description: "Architecting for reliability through asynchronous buffers.",
          keyPoints: [
            "SNS: Pub/Sub pattern. One event, 100,000+ subscribers (Email, SQS, Lambda).",
            "SQS: Producer/Consumer pattern. Decouples processing speed from ingestion speed.",
            "Dead Letter Queues (DLQ): Safely capturing failed messages for manual inspection.",
            "FIFO Queues: Ensuring strict ordering and deduplication for financial transactions."
          ],
          resources: [
            { type: 'doc', title: "SNS Topic Filtering", url: "https://docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html" }
          ]
        }
      ],
      useCases: [
        {
          title: "Order Fulfillment Workflow",
          description: "App pushes to SNS; SNS fan-outs to SQS 'Inventory', SQS 'Shipping', and SQS 'Billing' for parallel processing."
        }
      ]
    },
    {
      id: "api-management",
      title: "6. API Gateway & Logic Layer",
      architectWhy: "API Gateway is the front door to your microservices. It handles throttling, authentication, and caching so your compute layer doesn't have to.",
      serviceSynergy: "Works with Cognito for user authentication and WAF to block SQL injection and cross-site scripting attacks.",
      costTip: "Use HTTP APIs instead of REST APIs for simple proxy use cases to save up to 70% in costs and improve latency.",
      tags: ["API", "Security", "Serverless"],
      documentationUrl: "https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html",
      detailedTopics: [
        {
          title: "Throttling & Usage Plans",
          description: "Protecting your backend from 'The Thundering Herd'.",
          keyPoints: [
            "Throttling: Setting requests-per-second (RPS) limits per stage or per API key.",
            "Usage Plans: Monetizing or restricting access for different customer tiers.",
            "Custom Authorizers: Using Lambda to validate JWT tokens before hitting the endpoint.",
            "VPC Integration: Securely calling private endpoints inside your VPC without IGW."
          ],
          resources: [
            { type: 'video', title: "API Gateway Best Practices", url: "https://www.youtube.com/results?search_query=aws+api+gateway+best+practices" }
          ]
        }
      ],
      useCases: [
        {
          title: "Public Facing SaaS API",
          description: "Deliver a RESTful API with Cognito Auth, WAF protection, and tiered usage plans for Free vs Premium users."
        }
      ]
    },
    {
      id: "secrets-encryption",
      title: "7. Secret Management & Encryption (KMS)",
      architectWhy: "Never hardcode keys. KMS provides centralized management of cryptographic keys, while Secrets Manager handles the automatic rotation of DB credentials.",
      serviceSynergy: "Integrated into almost every AWS service (S3, RDS, EBS) for transparent data-at-rest encryption.",
      costTip: "Use KMS Alias names to simplify key rotation and management in your application code.",
      tags: ["Security", "Identity", "Governance"],
      documentationUrl: "https://docs.aws.amazon.com/kms/latest/developerguide/overview.html",
      detailedTopics: [
        {
          title: "KMS & Secrets Manager Deep Dive",
          description: "Protecting the data plane through modern cryptography.",
          keyPoints: [
            "Customer Managed Keys (CMK): Keys where you control the rotation and policy.",
            "Automatic Rotation: Secrets Manager can automatically update RDS passwords and notify apps.",
            "KMS Grant Policies: Fine-grained access control for who can decrypt data.",
            "CloudHSM: Dedicated hardware modules for FIPS 140-2 Level 3 compliance."
          ],
          resources: [
            { type: 'doc', title: "KMS Best Practices", url: "https://docs.aws.amazon.com/kms/latest/developerguide/best-practices.html" }
          ]
        }
      ],
      useCases: [
        {
          title: "PCI-DSS Data Protection",
          description: "Encrypting Credit Card data in RDS using a CMK that is rotated every 90 days automatically by Secrets Manager."
        }
      ]
    },
    {
      id: "cache-elasticache",
      title: "8. Cache-Aside & Performance (ElastiCache)",
      architectWhy: "Speed is a feature. ElastiCache (Redis/Memcached) reduces database load and improves application response times by orders of magnitude for hot data.",
      serviceSynergy: "Often placed in front of RDS or DynamoDB to cache session states or frequent query results.",
      costTip: "Use ElastiCache Serverless to pay only for the storage and compute you consume, avoiding over-provisioned node costs.",
      tags: ["Performance", "Caching", "In-Memory"],
      documentationUrl: "https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html",
      detailedTopics: [
        {
          title: "Redis vs Memcached Strategy",
          description: "Choosing the right in-memory engine.",
          keyPoints: [
            "Redis: Supports complex data structures (Lists, Sets, Hashes) and persistence.",
            "Memcached: Simple, multi-threaded, and highly efficient for plain object caching.",
            "Global Datastore: Low-latency cross-region replication for Redis.",
            "Auto-Failover: Multi-AZ support with primary/replica nodes for high availability."
          ],
          resources: [
            { type: 'video', title: "Caching Strategies for SAA-C03", url: "https://www.youtube.com/results?search_query=aws+elasticache+redis+vs+memcached" }
          ]
        }
      ],
      useCases: [
        {
          title: "Leaderboards & Session Store",
          description: "Using Redis Sorted Sets for a real-time gaming leaderboard with sub-millisecond updates."
        }
      ]
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
