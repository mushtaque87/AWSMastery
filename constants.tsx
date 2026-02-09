import { AWSModule } from './types';

export const MODULES: Record<string, AWSModule[]> = {
  fundamentals: [
    {
      id: "global-foundation",
      title: "1. The Global Architecture Foundation",
      architectWhy: "Architecture starts with the physical. Designing for high availability requires a deep understanding of Availability Zone (AZ) isolation, Regional fault domains, and Edge Location latency optimization.",
      masterSummary: "AWS Global Infrastructure is the foundational bedrock of all cloud-native applications. As a Lead Architect, you must distinguish between Availability Zones (AZs) and Regions not as mere terminology, but as the core components of disaster recovery and performance strategy. Regions are physical locations around the world where AWS clusters data centers. Each Region consists of multiple, isolated, and physically separate AZs within a geographic area. AZs are connected with low-latency, high-throughput, and highly redundant networking, allowing for synchronous replication. In 2026, the strategy has shifted towards leveraging Local Zones for ultra-low latency (<10ms) and Wavelength for 5G edge compute.\n\nKey architectural pillars include:\n• High Availability (HA): Utilizing at least 3 AZs to ensure that a single data center failure does not impact the system uptime.\n• Disaster Recovery (DR): Designing Multi-Region failover strategies (Pilot Light, Warm Standby) to survive regional outages.\n• Edge Computing: Using the 600+ CloudFront Points of Presence to move compute and caching to the edge, reducing the 'speed-of-light' bottleneck for global users.\n• Data Residency: Choosing regions based on compliance requirements like GDPR or CCPA to ensure data stays within specific geographic borders.",
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
            "High Availability: Always deploy across at least 3 AZs for critical workloads."
          ],
          resources: [
            { type: 'video', title: "AWS Global Infrastructure Deep Dive", url: "https://www.youtube.com/results?search_query=aws+global+infrastructure+deep+dive" },
            { type: 'doc', title: "Regions and Availability Zones", url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html" }
          ]
        }
      ],
      useCases: [{ title: "Global E-Commerce Static Content", description: "Serve product images from S3 via CloudFront with price-class-all to ensure sub-100ms load times in Tokyo, London, and New York." }]
    },
    {
      id: "shared-responsibility",
      title: "2. Shared Responsibility & Trust",
      architectWhy: "Trust is a shared contract. Architects must identify where AWS's platform duty ends and their own responsibility for encryption, patching, and data integrity begins.",
      masterSummary: "The Shared Responsibility Model is the essential security framework that defines the demarcation line between what AWS protects and what the customer protects. In simplest terms, AWS is responsible for security 'OF' the cloud (physical hardware, global infrastructure, and managed services software), while the customer is responsible for security 'IN' the cloud (data, IAM, guest OS patching, and network configuration).\n\nKey takeaways for architects:\n• Transitioning Responsibility: Moving from EC2 (Infrastructure) to Lambda (Serverless) shifts more responsibility to AWS (patching, runtime management), allowing teams to focus on business logic.\n• Inheritance: Customers inherit the security controls of AWS's global compliance certifications (SOC, PCI, ISO), significantly reducing the audit burden.\n• Zero Trust Baseline: Even though AWS secures the physical layer, the architect must assume 'Zero Trust' and implement end-to-end encryption (KMS) and strict identity governance (IAM).\n• Automation: Using services like AWS Artifact to download compliance reports and AWS Config to continuously monitor the customer's side of the boundary.",
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
            "Inherited Controls: How your SOC2/PCI compliance sits on top of AWS's existing certifications."
          ],
          resources: [
            { type: 'video', title: "Shared Responsibility Model Explained", url: "https://www.youtube.com/results?search_query=aws+shared+responsibility+model" }
          ]
        }
      ],
      useCases: [{ title: "Auditing a Hybrid Cloud Setup", description: "Clearly defining that the local admin team patches the on-prem servers, while AWS handles the patching of the underlying RDS host." }]
    },
    {
      id: "iam-governance",
      title: "3. IAM & Identity Governance",
      architectWhy: "Moving beyond simple users to Attribute-Based Access Control (ABAC). It allows scaling permissions without policy bloat, using session tags as the primary authorization criteria.",
      masterSummary: "IAM is the central nervous system of AWS security. In the modern cloud landscape, identity is the primary perimeter. A Lead Architect must master the logic of IAM Policy Evaluation: Explicit Deny always wins, followed by Explicit Allow, with Default Deny being the baseline state. The transition from Role-Based Access Control (RBAC) to Attribute-Based Access Control (ABAC) is a major trend in 2026, where access is granted based on tags (e.g., Project=Alpha) rather than static group memberships.\n\nStrategic Architecture Points:\n• Least Privilege: Never granting more permission than absolutely necessary for the task at hand.\n• Temporary Credentials: Using STS (Security Token Service) to issue short-lived tokens instead of long-lived access keys.\n• Service Control Policies (SCPs): Centralized guardrails at the AWS Organizations level that can override even local account admins.\n• Federation: Integrating with external providers like Google Workspace or Azure AD using SAML 2.0 or OIDC to eliminate siloed identities.",
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
            "MFA Everywhere: Enforcing multi-factor authentication for every human access point."
          ],
          resources: [
            { type: 'doc', title: "IAM User Guide", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html" }
          ]
        }
      ],
      useCases: [{ title: "FinTech Developer Sandbox", description: "Use SCPs to ensure no developer can create expensive p4d instances, while ABAC allows them to manage only the S3 buckets tagged with their UserID." }]
    },
    {
      id: "vpc-networking",
      title: "4. VPC Networking Foundations",
      architectWhy: "The VPC is your digital fortress. Tiered isolation (Public, Private, and Database subnets) and the elimination of public IPs via PrivateLink are essential for modern security.",
      masterSummary: "The Virtual Private Cloud (VPC) is the networking foundation that gives you full control over your virtual network environment. Designing a modern VPC involves more than just setting up subnets; it requires a tiered approach to security. The standard architecture includes Public subnets (for ALBs and NAT Gateways), Private subnets (for application compute), and Isolated subnets (for databases with no route to the internet).\n\nAdvanced Networking Tactics:\n• PrivateLink: Connecting to AWS services or your own microservices over the AWS backbone without using the public internet.\n• Transit Gateway: A central hub to connect dozens of VPCs and on-premise networks, replacing the mess of peer-to-peer peering.\n• VPC Endpoints: Using Gateway Endpoints (for S3/DynamoDB) to keep traffic internal and avoid NAT Gateway processing costs.\n• Security Groups vs NACLs: Security Groups are stateful and operate at the instance level; NACLs are stateless and operate at the subnet boundary. A Lead Architect uses both for 'defense-in-depth'.",
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
            "Security Group Chaining: Referencing the App SG as the source for the DB SG inbound rules."
          ],
          resources: [
            { type: 'video', title: "VPC Deep Dive", url: "https://www.youtube.com/results?search_query=aws+vpc+deep+dive" }
          ]
        }
      ],
      useCases: [{ title: "PCI-DSS Payment Processing", description: "Host the payment processor in a private subnet with no NAT Gateway, using VPC Endpoints to upload logs directly to CloudWatch." }]
    },
    {
      id: "s3-backbone",
      title: "5. S3: The Data Backbone",
      architectWhy: "S3 is more than a bucket; it's the foundation for data lakes. Architects must master strong consistency, object locking for WORM compliance, and lifecycle governance.",
      masterSummary: "Amazon S3 is the industry-standard object storage service, offering 99.999999999% (11 9's) of durability. It is the core of modern data lakes. In recent years, S3 has transitioned to 'Strong Consistency' for all operations, making it suitable for high-throughput transactional metadata storage. For architects, the primary task is optimizing for both security and cost across the storage lifecycle.\n\nKey Strategic Areas:\n• Storage Classes: Moving from S3 Standard to S3 Intelligent-Tiering or Glacier Deep Archive based on access patterns.\n• Object Locking: Enabling 'Write Once Read Many' (WORM) for legal and compliance data retention.\n• Access Control: Using S3 Access Points for large-scale multi-tenant environments and blocking all public access by default.\n• Performance: S3 Express One Zone provides 10x lower latency for performance-critical analytics and machine learning workloads.",
      serviceSynergy: "Feeds data into Athena for serverless SQL queries and Glue for cataloging decentralized data sets.",
      costTip: "Enable S3 Intelligent-Tiering to automatically move data to lower-cost tiers based on access patterns without any management overhead.",
      tags: ["Storage", "Data-Lake", "Analytics"],
      documentationUrl: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html",
      detailedTopics: [
        {
          title: "Storage Tiers & Lifecycle Management",
          description: "Optimizing for cost without sacrificing the 11 9's of durability.",
          keyPoints: [
            "S3 Standard vs Glacier: Trade-offs in retrieval time vs storage cost.",
            "Intelligent Tiering: The 'Set and Forget' tier for unpredictable workloads.",
            "Multi-Region Replication: Syncing data across buckets globally."
          ],
          resources: [
            { type: 'video', title: "S3 Storage Classes Explained", url: "https://www.youtube.com/results?search_query=aws+s3+storage+classes" }
          ]
        }
      ],
      useCases: [{ title: "Healthcare Medical Imaging Archive", description: "Store X-ray images in S3 Standard, lifecycle them to Glacier Instant Retrieval for 7 years, and use Object Lock to prevent tampering." }]
    },
    {
      id: "compute-foundations",
      title: "6. Compute Foundations (EC2 to Lambda)",
      architectWhy: "Selecting between EC2 (Full Control), ECS/EKS (Container Orchestration), and Lambda (Serverless) depends on the workload's volatility and execution profile.",
      masterSummary: "AWS Compute offers a spectrum of control and abstraction. EC2 (Infrastructure as a Service) provides raw OS-level control, while Lambda (Function as a Service) provides the ultimate abstraction where you only manage code. The 'missing middle' is fulfilled by ECS and EKS on Fargate, which provides 'Containerless' container orchestration. As an architect, your choice is driven by the 'Undifferentiated Heavy Lifting' you are willing to accept.\n\nCore Decision Matrix:\n• EC2: For legacy workloads, custom kernels, or high-performance HPC needing specific hardware.\n• ECS/EKS on Fargate: For modern microservices that benefit from Docker packaging but don't want to manage EC2 fleets.\n• Lambda: For event-driven, short-lived tasks (15 min limit) and bursty traffic that needs to scale to zero.\n• Graviton: Always look to ARM-based Graviton instances first to achieve up to 40% better price-performance over x86 counterparts.",
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
            "Auto Scaling: Dynamically matching capacity to demand.",
            "Lambda: Event-driven execution without managing servers."
          ],
          resources: [
            { type: 'video', title: "AWS Compute Overview", url: "https://www.youtube.com/results?search_query=aws+compute+options" }
          ]
        }
      ],
      useCases: [{ title: "Viral Marketing Burst Workload", description: "Use Lambda to handle sudden surges of 100k requests/min during a Super Bowl ad, scaling from 0 to peak in seconds." }]
    },
    {
      id: "well-architected",
      title: "7. The Well-Architected Framework",
      architectWhy: "Provides a structured baseline to evaluate architectures across 6 pillars, ensuring durability, efficiency, and operational excellence.",
      masterSummary: "The AWS Well-Architected Framework is the 'Architect's Bible'. It provides a consistent set of principles for evaluating architectures and implementing scalable designs. It is organized into 6 Pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability. For a Lead Architect, the Framework is not a checkbox; it is a conversation starter for risk management.\n\nPillar Highlights:\n• Reliability: Designing for failure using Multi-AZ and loose coupling.\n• Security: Using the Principle of Least Privilege and automated incident response.\n• Cost Optimization: Transitioning from 'Pay for Provisioned' to 'Pay for Usage'.\n• Sustainability: Minimizing the environmental impact of cloud workloads by maximizing resource utilization.\n• Performance Efficiency: Using serverless and managed services to scale without linear management effort.",
      serviceSynergy: "Acts as the blueprint for using AWS Well-Architected Tool and Trusted Advisor to maintain production health.",
      costTip: "Prioritize the Sustainability Pillar to reduce resource waste, which directly aligns with lower monthly AWS bills.",
      tags: ["Strategy", "Framework", "Governance"],
      documentationUrl: "https://aws.amazon.com/architecture/well-architected/",
      detailedTopics: [
        {
          title: "The 6 Pillars of Excellence",
          description: "The core framework used to review every major architecture on AWS.",
          keyPoints: [
            "Security: Protecting information and systems.",
            "Reliability: Recovering from infrastructure or service disruptions.",
            "Cost Optimization: Avoiding unnecessary costs."
          ],
          resources: [
            { type: 'doc', title: "The Well-Architected Pillars", url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/pillars.html" }
          ]
        }
      ],
      useCases: [{ title: "Production Readiness Review (PRR)", description: "Before launching a new bank core, the architect performs a review to find 'High Risk Issues' (HRIs)." }]
    },
    {
      id: "finops-sustainability",
      title: "8. Architectural FinOps & Sustainability",
      architectWhy: "Architects are now fiscal owners. Designing for sustainability (carbon reduction) naturally leads to designing for cost efficiency.",
      masterSummary: "In 2026, the Lead Architect is also a 'Financial Architect'. FinOps is the practice of bringing financial accountability to the variable spend model of cloud. This involves shifting from central procurement to distributed ownership, where engineering teams are responsible for the cost impact of their code. Parallel to this is the Sustainability pillar, which focuses on the shared responsibility for the environment.\n\nStrategic FinOps Steps:\n• Cost Allocation: Using 'Business Unit' and 'Project' tags to identify precisely who is spending what.\n• Rightsizing: Continuously using Compute Optimizer to match resources to actual demand.\n• Purchasing Models: Moving from On-Demand to Savings Plans and Spot Instances for non-critical workloads.\n• Carbon Tracking: Using the Customer Carbon Footprint Tool to report on the CO2 impact of your architectural decisions.",
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
            "Sustainability: Designing architectures that consume less carbon."
          ],
          resources: [
            { type: 'video', title: "FinOps on AWS Masterclass", url: "https://www.youtube.com/results?search_query=aws+finops+tutorial" }
          ]
        }
      ],
      useCases: [{ title: "Reducing Cloud Bill by 30%", description: "Identifying idle development environments and scheduling them to turn off after hours." }]
    }
  ],
  'core-services': [
    {
      id: "relational-db",
      title: "1. Relational Mastery (RDS & Aurora)",
      architectWhy: "Choosing between standard RDS and cloud-native Aurora is a critical decision for performance, availability, and cost. Aurora's storage architecture is a fundamental departure from traditional SQL hosting.",
      masterSummary: "Relational databases in the cloud have evolved from managed servers to distributed storage clusters. Amazon Aurora is the cloud-native flagship, offering 5x the performance of MySQL and 3x of PostgreSQL at 1/10th the cost of commercial engines. Aurora uses a log-structured storage system that replicates data 6 times across 3 AZs by default, providing unparalleled durability and zero-downtime failover.\n\nArchitectural Considerations:\n• Aurora Serverless v2: Instant scaling for unpredictable workloads, scaling compute capacity in 0.5 ACU increments.\n• Read Scaling: Up to 15 read replicas with sub-10ms replication lag.\n• Global Database: One-second cross-region replication for disaster recovery and local reads.\n• RDS Proxy: Essential for serverless (Lambda) architectures to manage thousands of concurrent SQL connections without exhausting database resources.",
      serviceSynergy: "Pairs with RDS Proxy to handle high-concurrency Lambda connections and Secrets Manager for automatic credential rotation.",
      costTip: "Use Aurora Serverless v2 for unpredictable workloads and Reserved Instances for steady-state production nodes to save up to 60%.",
      tags: ["Database", "SQL", "High-Availability"],
      documentationUrl: "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.html",
      detailedTopics: [
        {
          title: "Aurora Cloud-Native Architecture",
          description: "Deep dive into the Aurora distributed storage layer vs standard block storage (EBS).",
          keyPoints: [
            "6-Way Replication: Data is replicated 6 times across 3 AZs by default.",
            "Log-Structured Storage: Only log records travel the network, not data pages.",
            "Read Replicas: Up to 15 replicas with sub-10ms lag."
          ],
          resources: [
            { type: 'video', title: "Amazon Aurora Deep Dive", url: "https://www.youtube.com/results?search_query=amazon+aurora+deep+dive" }
          ]
        }
      ],
      useCases: [{ title: "Global Banking Transactional Core", description: "Use Aurora Global Database with Multi-Region failover for 99.99% availability." }]
    },
    {
      id: "nosql-persistence",
      title: "2. NoSQL Persistence (DynamoDB)",
      architectWhy: "DynamoDB offers 'single-digit millisecond' performance at any scale. Mastering Partition Keys and Global Secondary Indexes is the difference between a fast system and a bottlenecked one.",
      masterSummary: "DynamoDB is the 'Gold Standard' for high-scale NoSQL. It is a key-value and document database that delivers single-digit millisecond performance at any scale. Unlike relational databases that struggle with horizontal scaling, DynamoDB is designed to scale infinitely. To succeed as an architect, you must unlearn relational normalization and embrace 'Single-Table Design'.\n\nKey Concepts:\n• Partition Key (PK) & Sort Key (SK): The foundation of your data modeling. PK determines physical location; SK determines ordering within the partition.\n• GSI & LSI: Global and Local Secondary Indexes allow you to query data using non-key attributes without performing expensive 'Scans'.\n• Streams & Lambda: Triggering downstream events whenever data changes (CDC - Change Data Capture).\n• Global Tables: Active-active multi-region replication for truly global applications.",
      serviceSynergy: "Streams data to Lambda for real-time event processing or Kinesis for downstream analytics.",
      costTip: "Use On-Demand capacity for spiky workloads and Provisioned with Auto Scaling for predictable traffic to minimize costs.",
      tags: ["NoSQL", "Performance", "Serverless"],
      documentationUrl: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html",
      detailedTopics: [
        {
          title: "Data Modeling: Single-Table Design",
          description: "Consolidating relational entities into a single DynamoDB table for performance.",
          keyPoints: [
            "PK and SK: Designing composite keys to support multiple query patterns.",
            "GSI vs LSI: Global vs Local Secondary Indexes for non-key queries.",
            "Query vs Scan: Why Scans should be avoided in production."
          ],
          resources: [
            { type: 'video', title: "Rick Houlihan: DynamoDB Modeling", url: "https://www.youtube.com/results?search_query=rick+houlihan+dynamodb" }
          ]
        }
      ],
      useCases: [{ title: "High-Traffic Leaderboards", description: "Using DAX for microsecond response times during peak gaming tournaments." }]
    },
    {
      id: "advanced-compute",
      title: "3. Elastic Compute & Containers (ECS/Fargate)",
      architectWhy: "While EC2 provides full control, ECS/Fargate removes the 'undifferentiated heavy lifting' of server management, allowing you to focus on the container lifecycle.",
      masterSummary: "Modern compute is container-centric. Amazon ECS is the AWS-native container orchestrator, while EKS is the managed Kubernetes alternative. For most architects, ECS on Fargate is the 'Sweet Spot'—providing the power of Docker without the overhead of managing EC2 fleets or patching servers.\n\nOrchestration Deep Dive:\n• Fargate: A serverless compute engine for containers. You pay for the vCPU and Memory your container actually uses.\n• ECS Task Definitions: The blueprint that defines CPU, memory, IAM roles, and logging for your container.\n• Capacity Providers: Automatically mixing On-Demand and Spot Fargate tasks to optimize cost and availability.\n• Service Discovery: Using Cloud Map or App Mesh to allow microservices to find and talk to each other securely within the VPC.",
      serviceSynergy: "Integrates with App Mesh for service-discovery and CloudWatch Container Insights for granular monitoring.",
      costTip: "Run non-critical workloads on Fargate Spot to reduce compute costs by up to 70% compared to On-Demand.",
      tags: ["Compute", "Containers", "Orchestration"],
      documentationUrl: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html",
      detailedTopics: [
        {
          title: "ECS vs. EKS Strategy",
          description: "AWS-native orchestration vs. Managed Kubernetes.",
          keyPoints: [
            "ECS: Simple, deep AWS integration, AWSVPC networking.",
            "Fargate: Serverless compute engine for containers.",
            "Task Definitions: The blueprint for container execution."
          ],
          resources: [
            { type: 'video', title: "ECS vs EKS: Which to choose?", url: "https://www.youtube.com/results?search_query=aws+ecs+vs+eks" }
          ]
        }
      ],
      useCases: [{ title: "Microservices Modernization", description: "Breaking a monolith into Fargate-based services for independent scaling." }]
    },
    {
      id: "storage-efs-ebs",
      title: "4. File & Block Storage (EFS & EBS)",
      architectWhy: "Not all data belongs in S3. EBS provides low-latency block storage for databases, while EFS offers shared, concurrent file access for distributed web fleets.",
      masterSummary: "Storage beyond S3 involves block and file-based systems. Amazon EBS is the persistent block storage for EC2, functioning like a physical SSD. Amazon EFS is a managed NFS file system that can be shared across thousands of instances and Lambda functions simultaneously.\n\nArchitectural Distinctions:\n• EBS Performance: Using gp3 volumes to provision IOPS and Throughput independently, or io2 Block Express for SAN-level performance (up to 256k IOPS).\n• EFS Scaling: A truly elastic system that scales storage and throughput automatically. Ideal for shared media repositories and content management systems.\n• Persistence in Containers: Mounting EFS volumes to Fargate tasks to maintain state across container restarts.\n• Backup & Recovery: Using AWS Backup for centralized management of EBS snapshots and EFS backups across multiple regions.",
      serviceSynergy: "EFS mounts directly to Lambda functions or Fargate tasks for shared state across serverless execution.",
      costTip: "Use EBS Snapshots and EFS Lifecycle Management (Infrequent Access) to move older files to cheaper tiers automatically.",
      tags: ["Storage", "Block", "FileSystem"],
      documentationUrl: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AmazonEBS.html",
      detailedTopics: [
        {
          title: "EBS: Block Level Performance",
          description: "Configuring IOPS and Throughput for intensive workloads.",
          keyPoints: [
            "gp3 Volumes: Separate performance from capacity.",
            "io2 Block Express: SAN-like performance for SQL Server.",
            "Encryption: KMS-integrated protection for data-at-rest."
          ],
          resources: [
            { type: 'video', title: "EBS Volume Types Explained", url: "https://www.youtube.com/results?search_query=aws+ebs+volume+types" }
          ]
        }
      ],
      useCases: [{ title: "High-Availability CMS", description: "Using EFS to provide a shared media folder for a fleet of web servers." }]
    },
    {
      id: "messaging-patterns",
      title: "5. Messaging & Decoupling (SQS & SNS)",
      architectWhy: "Decoupling is the key to resilience. SQS provides asynchronous buffer zones, while SNS enables massive-scale fan-out for notification-driven architectures.",
      masterSummary: "Decoupling is the secret to building resilient, distributed systems. By inserting a message queue (SQS) or a notification topic (SNS) between microservices, you ensure that failures in one service do not cascade to others. This 'Loose Coupling' is a fundamental requirement for the Reliability pillar of Well-Architected.\n\nMessaging Patterns:\n• SQS (Queueing): Point-to-point communication where a message is processed by exactly one consumer. Use FIFO queues for strict ordering.\n• SNS (Pub/Sub): One-to-many fan-out. A single event (like 'Order Placed') can trigger Email, Billing, and Shipping services simultaneously.\n• EventBridge: The modern event bus that replaces complex SNS filtering logic with schema-based routing.\n• Dead Letter Queues (DLQ): Capturing failed messages for manual investigation without blocking the entire production pipeline.",
      serviceSynergy: "Pairs with Lambda for automatic polling (SQS) and EventBridge for sophisticated routing logic.",
      costTip: "Use SQS Long Polling (WaitTimeSeconds > 0) to reduce empty receives and significantly lower API costs.",
      tags: ["Messaging", "Decoupling", "Serverless"],
      documentationUrl: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html",
      detailedTopics: [
        {
          title: "SQS: Queue Buffering",
          description: "Architecting for reliability via asynchronous message queues.",
          keyPoints: [
            "Visibility Timeout: Preventing dual-processing of messages.",
            "DLQs: Capturing failed messages for re-processing.",
            "FIFO Queues: Ensuring order and exactly-once processing."
          ],
          resources: [
            { type: 'video', title: "SNS vs SQS Patterns", url: "https://www.youtube.com/results?search_query=aws+sns+vs+sqs+patterns" }
          ]
        }
      ],
      useCases: [{ title: "Order Fulfillment Workflow", description: "SNS broadcasting order events to independent Shipping and Billing microservices." }]
    },
    {
      id: "api-management",
      title: "6. API Gateway & Logic Layer",
      architectWhy: "API Gateway is the front door to your microservices. It handles throttling, authentication, and caching so your compute layer doesn't have to.",
      masterSummary: "Amazon API Gateway is a fully managed service that makes it easy for developers to create, publish, maintain, secure, and monitor APIs. It acts as the 'Front Door' for your microservices, handling the difficult tasks of authentication, throttling, and request validation so your compute layer (Lambda/Fargate) stays lean.\n\nAPI Strategy:\n• REST vs HTTP APIs: Use HTTP APIs for lower latency and 70% lower cost for simple proxy use cases. Use REST APIs for complex needs like Request Transformation and API Keys.\n• Security: Using Lambda Authorizers or Cognito User Pools to secure endpoints with JWT tokens.\n• Throttling & Caching: Protecting backends from 'Thundering Herd' spikes and reducing latency for frequently requested data.\n• Private APIs: Exposing internal services securely within a VPC without ever touching the public internet.",
      serviceSynergy: "Works with Cognito for user authentication and WAF to block SQL injection and cross-site scripting attacks.",
      costTip: "Use HTTP APIs instead of REST APIs for simple proxy use cases to save up to 70% in costs and improve latency.",
      tags: ["API", "Security", "Serverless"],
      documentationUrl: "https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html",
      detailedTopics: [
        {
          title: "API Lifecycle & Security",
          description: "Managing the front door of your cloud architecture.",
          keyPoints: [
            "Throttling & Quotas: Protecting backends from request spikes.",
            "Custom Authorizers: Using Lambda to validate JWT/OAuth tokens.",
            "Canary Deployments: Gradual rollout of new API versions."
          ],
          resources: [
            { type: 'video', title: "API Gateway Best Practices", url: "https://www.youtube.com/results?search_query=aws+api+gateway+best+practices" }
          ]
        }
      ],
      useCases: [{ title: "Serverless SaaS Front-End", description: "Exposing Lambda microservices to web clients with built-in WAF protection." }]
    },
    {
      id: "secrets-encryption",
      title: "7. Security & Secrets (KMS & Secrets Manager)",
      architectWhy: "Data protection is non-negotiable. KMS provides centralized key management, while Secrets Manager automates the difficult task of rotating database credentials without application downtime.",
      masterSummary: "Security is built on encryption and secret management. AWS KMS is the centralized service for managing cryptographic keys, integrated with almost every AWS service. Secrets Manager goes a step further by providing a vault for application secrets like database passwords and API keys, with the ability to rotate them automatically.\n\nArchitectural Deep Dive:\n• Envelop Encryption: Using a Master Key to encrypt Data Keys, which then encrypt the actual data. This minimizes network traffic for encryption operations.\n• Key Policies: The primary way to control access to KMS keys, independent of IAM users.\n• Automated Rotation: Secrets Manager can automatically update the password in an RDS database and update the secret vault simultaneously, ensuring credentials never go stale.\n• Multi-Region Secrets: Replicating secrets across regions to support global disaster recovery strategies.",
      serviceSynergy: "Secrets Manager integrates directly with RDS to update passwords and notify Lambda of the new secret.",
      costTip: "Consolidate keys where possible. Each KMS Customer Managed Key (CMK) has a monthly flat fee.",
      tags: ["Security", "Encryption", "Secrets"],
      documentationUrl: "https://docs.aws.amazon.com/kms/latest/developerguide/overview.html",
      detailedTopics: [
        {
          title: "KMS: Key Management Mastery",
          description: "Enveloping data in layers of cloud-native encryption.",
          keyPoints: [
            "Symmetric vs Asymmetric: Choosing the right key type for your logic.",
            "Key Rotation: Automating the replacement of key material annually.",
            "Secrets Manager: Automating credential rotation without downtime."
          ],
          resources: [
            { type: 'video', title: "AWS KMS Deep Dive", url: "https://www.youtube.com/results?search_query=aws+kms+deep+dive" }
          ]
        }
      ],
      useCases: [{ title: "PCI-DSS Database Protection", description: "Rotating RDS credentials every 30 days automatically without ever stopping the application." }]
    },
    {
      id: "cache-elasticache",
      title: "8. Caching & Performance (ElastiCache)",
      architectWhy: "Speed is a competitive feature. ElastiCache reduces database load by keeping hot data in memory (Redis/Memcached), enabling sub-millisecond responses.",
      masterSummary: "The most performant query is the one that never hits your database. Amazon ElastiCache is an in-memory data store that provides sub-millisecond latency for hot data. As a Lead Architect, caching is your primary tool for reducing database costs and improving user experience.\n\nCaching Strategies:\n• Redis vs Memcached: Use Redis for complex data structures (leaderboards, pub/sub) and persistence. Use Memcached for simple, multi-threaded object caching.\n• Cache-Aside Pattern: The application checks the cache; if a miss, it queries the DB and updates the cache.\n• Global Datastore: Replicating Redis clusters across regions for local, low-latency reads globally.\n• ElastiCache Serverless: In 2026, we utilize serverless caching to avoid provisioning nodes and scale based on actual workload throughput.",
      serviceSynergy: "Often used in tandem with RDS to implement the 'Cache-Aside' pattern or as a fast session store.",
      costTip: "Use ElastiCache Serverless for small/volatile workloads to avoid paying for idle node capacity.",
      tags: ["Performance", "Caching", "In-Memory"],
      documentationUrl: "https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html",
      detailedTopics: [
        {
          title: "Redis vs. Memcached Strategy",
          description: "Choosing the right in-memory engine for your specific data structure.",
          keyPoints: [
            "Redis: Complex structures (Sets, Hashes), persistence, and pub/sub.",
            "Cluster Mode: Partitioning data across multiple shards for extreme scale.",
            "Global Datastore: Localized sub-millisecond reads in multiple regions."
          ],
          resources: [
            { type: 'video', title: "ElastiCache Overview", url: "https://www.youtube.com/results?search_query=aws+elasticache+overview" }
          ]
        }
      ],
      useCases: [{ title: "Real-time Gaming Leaderboard", description: "Using Redis Sorted Sets to maintain instant global rankings for millions of players." }]
    }
  ],
  architecture: [
    {
      id: "event-driven",
      title: "Event-Driven Modernization",
      architectWhy: "Decouples services to improve fault tolerance and enable independent scaling. The gold standard for resilient, extensible microservices.",
      masterSummary: "Event-Driven Architecture (EDA) is the ultimate realization of cloud-native design. In an EDA, services communicate by emitting events—immutable facts about what has happened. This is the opposite of the synchronous 'Request-Response' pattern, which often leads to distributed monoliths where failures cascade. Amazon EventBridge is the core of EDA on AWS, providing a serverless event bus that routes events based on sophisticated rules.\n\nWhy Architects Choose EDA:\n• Independent Scaling: The producer doesn't care how many consumers process the event or how fast they do it.\n• Resilience: If a consumer service is down, the event can be stored in a queue (SQS) and replayed later.\n• Extensibility: Adding a new feature (like sending a push notification after an order) only requires adding a new consumer rule, with zero changes to the original order-processing code.\n• Real-time Analytics: Events can be branched off to Kinesis for real-time dashboarding without impacting the production transaction flow.",
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
