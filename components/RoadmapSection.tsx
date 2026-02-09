
import React, { useState } from 'react';
import { 
  ShieldCheckIcon, 
  CpuChipIcon, 
  CircleStackIcon, 
  WrenchScrewdriverIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  PlayIcon,
  BookOpenIcon,
  LinkIcon,
  BriefcaseIcon,
  StarIcon,
  LockClosedIcon,
  FireIcon,
  LightBulbIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { RoadmapDetail, RoadmapTopic } from '../types';

interface Phase {
  week: string;
  title: string;
  focus: string;
  artifact: string;
  icon: any;
  status: 'completed' | 'in-progress' | 'pending';
  days: string[];
  details?: RoadmapDetail;
}

const RoadmapSection: React.FC = () => {
  const [selectedPhaseIdx, setSelectedPhaseIdx] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<RoadmapTopic | null>(null);

  const roadmap: Phase[] = [
    {
      week: "Week 1",
      title: "Identity & Security Foundations",
      focus: "IAM, Organizations, SCPs, & Zero Trust",
      artifact: "Global Identity Governance Blueprint",
      icon: ShieldCheckIcon,
      status: "completed",
      days: ["Day 1-2: Advanced IAM Policies", "Day 3-4: Multi-Account Management", "Day 5-7: AWS Organizations & Guardrails"],
      details: {
        summary: "In Week 1, we transcend basic 'Users and Groups' to master Identity Governance. As a Principal Architect, you aren't just creating users; you are designing a Zero-Trust ecosystem that balances developer velocity with rigid security guardrails.",
        topics: [
          {
            level: 'associate',
            title: "The IAM Hierarchy: Users, Groups, & Roles",
            summary: "Mastering the distinction between human users and machine identities.",
            tutorial: {
              content: "IAM is the global foundation of AWS security. For the Associate level, you must understand the 'Principal' (who), the 'Action' (what), and the 'Resource' (where). The core philosophy is 'Least Privilege'. Never use the Root user for daily tasks. Roles are short-lived credentials used by services like EC2 or Lambda to interact with other AWS services safely.",
              keyPoints: [
                "Root User: Full access, keep MFA locked in a physical vault.",
                "IAM Users vs Roles: Roles use temporary tokens (STS), Users use long-term keys (Bad Practice).",
                "Policy Evaluation: Explicit Deny > Explicit Allow > Default Deny.",
                "IAM Groups: Do not assign policies to users; assign them to groups for scalability."
              ],
              resources: [
                { type: 'doc', title: "IAM User Guide", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html" },
                { type: 'video', title: "IAM Explained for Beginners", url: "https://www.youtube.com/results?search_query=aws+iam+explained" }
              ]
            }
          },
          {
            level: 'associate',
            title: "Identity Federation & STS",
            summary: "Connecting your on-prem AD or Google Workspace to AWS.",
            tutorial: {
              content: "Federation allows users to sign in to AWS using their existing corporate credentials. AWS uses SAML 2.0 or OIDC. The Security Token Service (STS) is the invisible glue that issues the temporary credentials after successful authentication.",
              keyPoints: [
                "SAML 2.0: The enterprise standard for SSO.",
                "Web Identity Federation: Using Amazon, Google, or Facebook logins.",
                "STS AssumeRole: The API call that exchanges identity for cloud access.",
                "Identity Providers (IdP): Managing the trust relationship between AWS and your source of truth."
              ],
              resources: [
                { type: 'doc', title: "Identity Providers and Federation", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers.html" },
                { type: 'blog', title: "AWS SSO vs IAM Federation", url: "https://aws.amazon.com/blogs/security/how-to-centralize-identity-management-for-your-multi-account-environment/" }
              ]
            }
          },
          {
            level: 'principal',
            title: "ABAC: Attribute-Based Access Control",
            summary: "The future of scaling identity. Using session tags to manage access dynamically.",
            tutorial: {
              content: "As organizations grow, managing hundreds of IAM roles becomes an operational nightmare. ABAC solves this by using 'Tags' as the authorization criteria. Instead of saying 'User A can access Bucket X', you say 'Users with Tag Project:A can access buckets with Tag Project:A'. This allows you to onboard new users and resources without ever touching an IAM policy.",
              keyPoints: [
                "Scalability: One policy can handle thousands of resources.",
                "Dynamic Authorization: Access changes automatically when resource tags change.",
                "Principal Tags: Passing attributes during STS AssumeRole.",
                "Condition Keys: Using ${aws:PrincipalTag/Key} in policy JSON."
              ],
              resources: [
                { type: 'video', title: "Advanced ABAC Patterns at re:Invent", url: "https://www.youtube.com/results?search_query=aws+abac+advanced+patterns" },
                { type: 'doc', title: "ABAC for AWS Strategy", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction_attribute-based-access-control.html" }
              ]
            }
          },
          {
            level: 'principal',
            title: "Service Control Policies (SCPs)",
            summary: "Implementing centralized governance across hundreds of accounts.",
            tutorial: {
              content: "SCPs are the ultimate guardrail. They live in AWS Organizations and set the maximum possible permissions for an account. An SCP can even block the Root user. Use them to enforce compliance (e.g., 'No one can use regions outside of Europe') or security standards (e.g., 'No one can delete CloudTrail logs').",
              keyPoints: [
                "Max Permissions: SCPs do not grant; they only filter.",
                "Root Account: Does not apply to the Organization Management account itself.",
                "Inheritance: Policies flow down from the Root OU to specific accounts.",
                "Standardization: Preventing 'Shadow IT' by disabling unapproved services."
              ],
              resources: [
                { type: 'doc', title: "AWS Organizations SCP Guide", url: "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html" },
                { type: 'video', title: "Scaling Governance with SCPs", url: "https://www.youtube.com/results?search_query=aws+scp+best+practices" }
              ]
            }
          }
        ],
        useCases: [
          {
            title: "Regulated FinTech Multi-Account Isolation",
            description: "A digital bank scaling to 50+ AWS accounts needs PCI-DSS compliance. Use AWS Control Tower and custom SCPs to enforce data residency and prevent any S3 bucket from being public."
          },
          {
            title: "Zero-Trust SaaS Tenant Isolation",
            description: "A multi-tenant B2B platform requires strict data siloing. Implement IAM Dynamic Policy generation using ABAC where session tags match tenant IDs."
          }
        ],
        resources: [
          { type: 'doc', title: "AWS IAM Best Practices - Official Guide", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html" },
          { type: 'video', title: "re:Invent 2024: Advanced IAM Policy Design Patterns", url: "https://www.youtube.com/results?search_query=aws+reinvent+advanced+iam+policies" },
          { type: 'blog', title: "Netflix Tech Blog: How we manage IAM at Scale", url: "https://netflixtechblog.com/" }
        ]
      }
    },
    {
      week: "Week 2",
      title: "Resilient Compute Patterns",
      focus: "Lambda, Fargate, & Event-Driven Design",
      artifact: "Auto-scaling Event-Driven Stack",
      icon: CpuChipIcon,
      status: "in-progress",
      days: ["Day 8-10: Serverless Best Practices", "Day 11-12: Container Orchestration", "Day 13-14: Decoupling with EventBridge"],
      details: {
        summary: "Compute is the engine of your architecture. Week 2 focuses on transient, right-sized compute using Lambda (Serverless) and Fargate (Containerless). Learn to select compute based on cold-start tolerance, execution time, and memory overhead.",
        topics: [
          {
            level: 'associate',
            title: "Lambda Foundations & Cold Starts",
            summary: "The basics of serverless execution and handling the first-invocation latency.",
            tutorial: {
              content: "AWS Lambda allows you to run code without provisioning servers. For the SAA-C03, you must understand the pricing model (duration x memory), maximum execution time (15 mins), and the concept of cold starts. Cold starts occur when Lambda initializes a new execution environment. Choosing lightweight runtimes like Go or Python over Java can minimize this.",
              keyPoints: [
                "Execution Context: Reuse database connections outside the handler.",
                "Ephemeral Storage: /tmp space (up to 10GB).",
                "Versioning & Aliases: Safe deployments with traffic shifting (Canary/Linear).",
                "Event Source Mapping: How Lambda polls SQS or Kinesis behind the scenes."
              ],
              resources: [
                { type: 'doc', title: "Lambda Documentation", url: "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html" },
                { type: 'blog', title: "Operating Lambda: Performance Optimization", url: "https://aws.amazon.com/blogs/compute/operating-lambda-performance-optimization-part-1/" }
              ]
            }
          },
          {
            level: 'associate',
            title: "Containers on AWS: ECS & Fargate",
            summary: "Running Dockerized microservices without managing EC2 instances.",
            tutorial: {
              content: "Elastic Container Service (ECS) is the native AWS orchestrator. Fargate is the 'serverless' engine for ECS—you pay for vCPU and Memory per task. This eliminates the need to manage EC2 patching or scaling. Use Fargate for long-running processes that exceed Lambda's 15-minute limit.",
              keyPoints: [
                "Task Definition: The blueprint for your container (image, ports, env).",
                "Services vs Tasks: Tasks are ephemeral; Services maintain the desired count.",
                "Networking: AWSVPC mode assigns each task its own Private IP.",
                "Graviton Support: Run Fargate on ARM for significantly lower costs."
              ],
              resources: [
                { type: 'doc', title: "ECS Fargate Launch Type", url: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_types.html" },
                { type: 'video', title: "Fargate Deep Dive (re:Invent)", url: "https://www.youtube.com/results?search_query=aws+fargate+deep+dive" }
              ]
            }
          },
          {
            level: 'principal',
            title: "Step Functions: Distributed State Machines",
            summary: "Orchestrating complex microservice workflows with built-in retry logic.",
            tutorial: {
              content: "When microservices need to coordinate (e.g., an order flow that includes payment, inventory, and shipping), Step Functions is the architect's choice. It manages the state, handles errors/retries automatically, and integrates with over 200 AWS services. It's the difference between 'Spaghetti Code' and a managed 'Workflow Engine'.",
              keyPoints: [
                "Standard vs Express: Standard for long-running auditability; Express for high-volume latency.",
                "Wait States: Pausing execution for human approval or external callbacks.",
                "Error Handling: Sophisticated Catch and Retry blocks at the infrastructure level.",
                "Direct Integrations: Calling DynamoDB or SQS directly without Lambda 'glue'."
              ],
              resources: [
                { type: 'doc', title: "Step Functions Developer Guide", url: "https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html" },
                { type: 'video', title: "Building Resilient Workflows with Step Functions", url: "https://www.youtube.com/results?search_query=aws+step+functions+best+practices" }
              ]
            }
          },
          {
            level: 'principal',
            title: "Event-Driven Architecture with EventBridge",
            summary: "Decoupling microservices using a serverless event bus.",
            tutorial: {
              content: "Amazon EventBridge is the central nervous system of modern AWS apps. It allows services to communicate without knowing about each other. A 'OrderPlaced' event can trigger a dozen different downstream actions. EventBridge Pipes and Discovery are essential tools for a Lead Architect to build truly decoupled systems.",
              keyPoints: [
                "Default vs Custom Bus: Separating AWS system events from your application logic.",
                "Schema Registry: Enforcing event structure between teams.",
                "EventBridge Pipes: Point-to-point integration with built-in filtering and transformation.",
                "Archive & Replay: Debugging systems by re-playing historical event streams."
              ],
              resources: [
                { type: 'video', title: "EventBridge Advanced Patterns", url: "https://www.youtube.com/results?search_query=aws+eventbridge+advanced+patterns" },
                { type: 'doc', title: "EventBridge Documentation", url: "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html" }
              ]
            }
          }
        ],
        useCases: [
          {
            title: "Global Video Transcoding Pipeline",
            description: "S3 upload triggers an EventBridge event. Step Functions orchestrates Fargate tasks for transcoding across multiple regions, with Lambda updating a DynamoDB metadata store upon completion."
          },
          {
            title: "Serverless Real-Time Analytics",
            description: "IoT sensors push data to API Gateway. Lambda processes the stream, applies business logic, and pipes the result into Kinesis Firehose for S3 Data Lake storage."
          }
        ],
        resources: [
          { type: 'video', title: "Serverless Land: Event-Driven Architectures", url: "https://serverlessland.com/" },
          { type: 'blog', title: "AWS Compute Blog: Lambda Performance Tips", url: "https://aws.amazon.com/blogs/compute/" },
          { type: 'doc', title: "AWS Well-Architected Serverless Lens", url: "https://docs.aws.amazon.com/wellarchitected/latest/serverless-lens/wellarchitected-serverless-lens.pdf" }
        ]
      }
    },
    {
      week: "Week 3",
      title: "Modern Data Architectures",
      focus: "Aurora Serverless, DynamoDB Global, S3 Express",
      artifact: "Multi-Region Data Strategy",
      icon: CircleStackIcon,
      status: "pending",
      days: ["Day 15-17: Relational Mastery", "Day 18-19: NoSQL Data Modeling", "Day 20-21: Data Lake Modernization"],
      details: {
        summary: "Week 3 focuses on the 'Persistence' pillar. You will master the trade-offs between ACID-compliant relational databases and the planet-scale performance of NoSQL. Learn to architect for 99.999% availability using multi-region data replication and high-performance storage classes.",
        topics: [
          {
            level: 'associate',
            title: "RDS vs Aurora: Relational Strategy",
            summary: "Choosing the right SQL engine for performance, scaling, and recovery.",
            tutorial: {
              content: "For SAA-C03, you must know when to use standard RDS (Postgres, MySQL, SQL Server) vs the cloud-native Aurora. Aurora is up to 5x faster than standard MySQL because it uses a specialized distributed storage layer. Understand Multi-AZ for high availability and Read Replicas for scaling horizontal read throughput.",
              keyPoints: [
                "Multi-AZ Deployment: Synchronous replication for failover (DR).",
                "Read Replicas: Asynchronous replication for performance scaling.",
                "Aurora Serverless v2: Instant scaling of compute units (ACUs) to save costs.",
                "Backtrack: Point-in-time recovery for Aurora without restoring from backup."
              ],
              resources: [
                { type: 'doc', title: "Amazon Aurora Features", url: "https://aws.amazon.com/rds/aurora/features/" },
                { type: 'video', title: "RDS vs Aurora: What to choose?", url: "https://www.youtube.com/results?search_query=aws+rds+vs+aurora+architect" }
              ]
            }
          },
          {
            level: 'associate',
            title: "DynamoDB Foundations & Keys",
            summary: "The basics of planet-scale NoSQL data modeling.",
            tutorial: {
              content: "DynamoDB is a key-value and document database that delivers single-digit millisecond performance at any scale. The key to success is understanding your 'Partition Key' (PK) and 'Sort Key' (SK). For the exam, focus on the difference between LSI (Local Secondary Index) and GSI (Global Secondary Index).",
              keyPoints: [
                "On-Demand vs Provisioned: Scaling model based on predictable throughput.",
                "GSI (Global Secondary Index): Query on any attribute across partitions.",
                "DAX (DynamoDB Accelerator): In-memory cache for 10x read performance.",
                "TTL (Time to Live): Automatically delete old data for cost savings."
              ],
              resources: [
                { type: 'doc', title: "DynamoDB Developer Guide", url: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html" },
                { type: 'video', title: "DynamoDB in 10 Minutes", url: "https://www.youtube.com/results?search_query=aws+dynamodb+basics" }
              ]
            }
          },
          {
            level: 'principal',
            title: "DynamoDB Single Table Design",
            summary: "Advanced NoSQL modeling for complex relational-style queries at scale.",
            tutorial: {
              content: "As a Lead Architect, you should avoid the 'one table per entity' trap in NoSQL. Single Table Design uses clever PK/SK patterns to fetch multiple related entities in a single request. This reduces latency and simplifies data consistency across your application.",
              keyPoints: [
                "Overloading Keys: Using Generic names like PK and SK for multiple entity types.",
                "Sparse Indexes: Optimizing queries for only a subset of data.",
                "Global Tables: Active-Active multi-region replication with conflict resolution.",
                "Transaction Support: Using TransactWriteItems for multi-item atomic operations."
              ],
              resources: [
                { type: 'video', title: "Rick Houlihan: Advanced DynamoDB Modeling", url: "https://www.youtube.com/results?search_query=rick+houlihan+dynamodb+advanced" },
                { type: 'blog', title: "The Power of Single Table Design", url: "https://www.alexdebrie.com/posts/dynamodb-single-table-design/" }
              ]
            }
          },
          {
            level: 'principal',
            title: "S3 Express One Zone & Data Mesh",
            summary: "Architecting for ultra-low latency and decentralized data ownership.",
            tutorial: {
              content: "S3 Express One Zone is a new storage class designed for high-performance compute tasks (ML, Batch). It offers 10x better performance than S3 Standard. In a Modern Data Mesh architecture, you use S3 alongside Lake Formation to provide domain-driven data ownership while maintaining central governance.",
              keyPoints: [
                "One Zone Storage: Lowest latency, but localized to one AZ (Availability Zone).",
                "Lake Formation: Managing fine-grained access (columns/rows) across accounts.",
                "S3 Object Lambda: Transforming data on-the-fly as it is retrieved.",
                "Storage Lens: Analytics for cost and security optimizations across millions of objects."
              ],
              resources: [
                { type: 'doc', title: "S3 Express One Zone Overview", url: "https://aws.amazon.com/s3/storage-classes/express-one-zone/" },
                { type: 'video', title: "Implementing a Data Mesh on AWS", url: "https://www.youtube.com/results?search_query=aws+data+mesh+architect" }
              ]
            }
          }
        ],
        useCases: [
          {
            title: "Global Gaming Leaderboard",
            description: "Using DynamoDB Global Tables to provide sub-10ms leaderboard updates for players across Tokyo, London, and New York, with DAX caching for massive read spikes during tournament events."
          },
          {
            title: "Financial Ledger Consolidation",
            description: "Aurora Serverless v2 handles millions of transactions daily with strict ACID compliance. During month-end closing, it scales from 2 to 64 ACUs automatically, ensuring no performance degradation for reporting tasks."
          }
        ],
        resources: [
          { type: 'video', title: "AWS Database Deep Dives (re:Invent)", url: "https://www.youtube.com/results?search_query=aws+reinvent+database+deep+dive" },
          { type: 'blog', title: "AWS Storage Blog", url: "https://aws.amazon.com/blogs/storage/" },
          { type: 'doc', title: "Database Migration Service (DMS) Best Practices", url: "https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html" }
        ]
      }
    },
    {
      week: "Week 4",
      title: "IaC & Operational Excellence",
      focus: "CDK, CloudFormation, & Observability",
      artifact: "Production-Ready IaC Repository",
      icon: WrenchScrewdriverIcon,
      status: "pending",
      days: ["Day 22-24: Infrastructure as Code", "Day 25-27: CloudWatch & X-Ray", "Day 28-30: Final Mock Review"],
      details: {
        summary: "Week 4 is the culmination of your architectural journey. We focus on 'Operational Excellence' and 'Sustainability'. As a Principal Architect, you never build manually; you define everything as code. This week covers high-level abstractions like AWS CDK and the visibility required to run mission-critical systems in production.",
        topics: [
          {
            level: 'associate',
            title: "CloudFormation: Declarative Foundations",
            summary: "Mastering the JSON/YAML language of AWS infrastructure.",
            tutorial: {
              content: "CloudFormation allows you to model entire environments in a single text file. For the exam, focus on Stacks, Change Sets (previewing changes), and Deletion Policies (retaining databases even if the stack is deleted). StackSets are critical for multi-account deployments.",
              keyPoints: [
                "Intrinsic Functions: Using !Ref, !GetAtt, and !Sub to link resources.",
                "Custom Resources: Triggering Lambda during stack lifecycle for custom logic.",
                "Nested Stacks: Creating reusable modules for complex architectures.",
                "Drift Detection: Identifying when manual changes violate your code."
              ],
              resources: [
                { type: 'doc', title: "CloudFormation Concepts", url: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/concepts.html" },
                { type: 'video', title: "CloudFormation for SAA-C03", url: "https://www.youtube.com/results?search_query=aws+cloudformation+certification+guide" }
              ]
            }
          },
          {
            level: 'associate',
            title: "CloudWatch & Unified Observability",
            summary: "Monitoring health, performance, and application logs in one place.",
            tutorial: {
              content: "CloudWatch isn't just for logs. It's a suite of tools including Metrics (performance), Alarms (actions), and Dashboards (visualization). Understand the difference between standard and high-resolution metrics for mission-critical monitoring.",
              keyPoints: [
                "Metric Filters: Extracting valuable data from text logs.",
                "CloudWatch Logs Insights: A SQL-like query engine for gigabytes of logs.",
                "Alarm Actions: Auto-scaling EC2 or notifying SNS on threshold breach.",
                "Log Retention: Managing costs by expiring logs in non-prod environments."
              ],
              resources: [
                { type: 'doc', title: "CloudWatch User Guide", url: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html" },
                { type: 'blog', title: "CloudWatch Best Practices", url: "https://aws.amazon.com/blogs/mt/cloudwatch-best-practices/" }
              ]
            }
          },
          {
            level: 'principal',
            title: "AWS CDK: The Power of Constructs",
            summary: "Using modern programming languages to define your cloud.",
            tutorial: {
              content: "The Cloud Development Kit (CDK) represents a paradigm shift. Instead of writing 1,000 lines of YAML, you write 50 lines of TypeScript. CDK translates your high-level logic into valid CloudFormation. It's the standard for large-scale enterprise development in 2026.",
              keyPoints: [
                "L1/L2/L3 Constructs: From raw CloudFormation mapping to full patterns.",
                "CDK Pipelines: Self-mutating CI/CD for your infrastructure.",
                "Aspects: Enforcing security policies (like 'All S3 buckets must be encrypted') at synthesis time.",
                "Testing: Writing unit tests for your infrastructure logic using Jest."
              ],
              resources: [
                { type: 'doc', title: "AWS CDK Workshop", url: "https://cdkworkshop.com/" },
                { type: 'video', title: "Advanced CDK Patterns (re:Invent)", url: "https://www.youtube.com/results?search_query=aws+reinvent+advanced+cdk+patterns" }
              ]
            }
          },
          {
            level: 'principal',
            title: "Distributed Tracing with X-Ray",
            summary: "Visualizing request flow across complex microservice graphs.",
            tutorial: {
              content: "In a world of microservices, finding a bottleneck is like finding a needle in a haystack. X-Ray provides end-to-end tracing. You can see a request travel from an API Gateway to Lambda, then to DynamoDB, and back. It's the ultimate tool for debugging latency and failures.",
              keyPoints: [
                "Segments & Subsegments: Breaking down local vs. external execution time.",
                "Sampling Rules: Managing trace volume and cost in high-traffic apps.",
                "Service Map: Visualizing dependencies and identifying failure nodes automatically.",
                "CloudWatch ServiceLens: Integrating logs, metrics, and traces into a single glass pane."
              ],
              resources: [
                { type: 'video', title: "Mastering Distributed Tracing with X-Ray", url: "https://www.youtube.com/results?search_query=aws+xray+deep+dive" },
                { type: 'doc', title: "AWS X-Ray Concepts", url: "https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html" }
              ]
            }
          }
        ],
        useCases: [
          {
            title: "Self-Healing Infrastructure Ops",
            description: "A CloudWatch Alarm detects high error rates in a Fargate cluster. It triggers an SSM Automation document that performs a canary rollback of the last CDK deployment automatically, with a detailed summary sent to Slack via EventBridge."
          },
          {
            title: "Compliance-as-Code Enforcer",
            description: "A developer manually creates an unencrypted EBS volume. AWS Config detects the violation and triggers a Lambda function that immediately encrypts and re-attaches the volume, ensuring 100% compliance without manual audits."
          }
        ],
        resources: [
          { type: 'doc', title: "AWS DevOps Whitepaper", url: "https://d1.awsstatic.com/whitepapers/DevOps/practicing-continuous-integration-continuous-delivery-on-AWS.pdf" },
          { type: 'video', title: "Modernizing with IaC (re:Invent)", url: "https://www.youtube.com/results?search_query=aws+reinvent+modern+iac" },
          { type: 'blog', title: "CDK Design Patterns", url: "https://cdkpatterns.com/" }
        ]
      }
    }
  ];

  if (selectedTopic) {
    return (
      <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn pb-20">
        <button 
          onClick={() => setSelectedTopic(null)}
          className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors group"
        >
          <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Phase View
        </button>

        <article className="glass p-12 rounded-[3rem] border border-blue-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5">
            <LightBulbIcon className="w-64 h-64 text-blue-400" />
          </div>

          <div className="relative z-10 space-y-10">
            <header className="space-y-4">
              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${selectedTopic.level === 'associate' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>
                {selectedTopic.level} track
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">{selectedTopic.title}</h1>
            </header>

            <div className="prose prose-invert max-w-none">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Deep Dive Tutorial</h3>
              <p className="text-slate-300 text-lg leading-relaxed font-light">
                {selectedTopic.tutorial?.content || "Detailed tutorial content for this specific concept is being drafted by our Lead Architects."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                 <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                   <CheckCircleIcon className="w-5 h-5" /> Key Architecture Points
                 </h3>
                 <ul className="space-y-4">
                   {selectedTopic.tutorial?.keyPoints.map((point, i) => (
                     <li key={i} className="flex items-start gap-3 text-slate-400 text-sm">
                       <span className="text-emerald-500 font-black">•</span>
                       {point}
                     </li>
                   )) || <p className="text-slate-500 italic">No key points defined.</p>}
                 </ul>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                  <PlayIcon className="w-5 h-5" /> Recommended Tutorials
                </h3>
                <div className="space-y-3">
                  {selectedTopic.tutorial?.resources.map((res, i) => (
                    <a 
                      key={i} 
                      href={res.url} 
                      target="_blank" 
                      className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-blue-500/30 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        {res.type === 'video' ? <PlayIcon className="w-4 h-4 text-rose-500" /> : <BookOpenIcon className="w-4 h-4 text-emerald-500" />}
                        <span className="text-xs font-bold text-slate-200">{res.title}</span>
                      </div>
                      <ChevronRightIcon className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                    </a>
                  )) || <p className="text-slate-500 italic text-sm">Curation in progress...</p>}
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    );
  }

  if (selectedPhaseIdx !== null) {
    const phase = roadmap[selectedPhaseIdx];
    const associateTopics = phase.details?.topics?.filter(t => t.level === 'associate') || [];
    const principalTopics = phase.details?.topics?.filter(t => t.level === 'principal') || [];

    return (
      <div className="max-w-6xl mx-auto space-y-12 animate-fadeIn pb-20">
        <button 
          onClick={() => setSelectedPhaseIdx(null)}
          className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors group"
        >
          <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Roadmap
        </button>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 space-y-12">
            <header className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${phase.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                  <phase.icon className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">{phase.week}</span>
                  <h2 className="text-4xl font-black text-white">{phase.title}</h2>
                </div>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed font-light italic border-l-4 border-white/5 pl-6">
                {phase.details?.summary}
              </p>
            </header>

            {/* Associate Certification Path */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.4em] flex items-center gap-2">
                  <AcademicCapIcon className="w-5 h-5" /> Associate Architect Path (SAA-C03)
                </h3>
                <span className="px-3 py-1 bg-blue-500/10 rounded-full text-[10px] text-blue-400 font-black uppercase">Standard Track</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {associateTopics.map((topic, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedTopic(topic)}
                    className="glass p-8 rounded-3xl border border-white/5 hover:border-blue-500/40 transition-all group text-left relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start relative z-10">
                      <div className="space-y-2 flex-1">
                        <h4 className="text-white font-bold text-lg flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:animate-ping" />
                          {topic.title}
                        </h4>
                        <p className="text-slate-400 text-sm leading-relaxed">{topic.summary}</p>
                      </div>
                      <ChevronRightIcon className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <div className="absolute inset-0 bg-blue-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </section>

            {/* Principal / Lead Architect Path */}
            <section className="space-y-6">
               <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em] flex items-center gap-2">
                  <FireIcon className="w-5 h-5" /> Principal Architect Mastery
                </h3>
                <div className="flex items-center gap-2">
                   <LockClosedIcon className="w-3 h-3 text-slate-500" />
                   <span className="px-3 py-1 bg-indigo-500/10 rounded-full text-[10px] text-indigo-400 font-black uppercase tracking-widest border border-indigo-500/20">Advanced Unlock</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {principalTopics.map((topic, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedTopic(topic)}
                    className="glass p-8 rounded-[2.5rem] border border-indigo-500/10 bg-indigo-500/[0.02] hover:bg-indigo-500/[0.05] hover:border-indigo-500/60 transition-all group text-left relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                      <StarIcon className="w-12 h-12 text-indigo-400" />
                    </div>
                    <div className="relative z-10 space-y-4">
                      <h4 className="text-white font-black text-xl leading-tight group-hover:text-indigo-300 transition-colors">{topic.title}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed font-light">{topic.summary}</p>
                      <div className="pt-2 flex items-center gap-2 text-[10px] font-black uppercase text-indigo-400 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                         View Masterclass <ChevronRightIcon className="w-3 h-3" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {phase.details?.useCases && (
              <section className="space-y-6 pt-12 border-t border-white/5">
                <h3 className="text-xs font-black text-emerald-400 uppercase tracking-[0.4em] flex items-center gap-2">
                  <BriefcaseIcon className="w-4 h-4" /> Real-World Execution Blueprint
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {phase.details.useCases.map((uc, i) => (
                    <div key={i} className="glass p-8 rounded-3xl border border-white/5 bg-emerald-500/[0.01] hover:bg-emerald-500/[0.03] transition-all">
                      <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                        {uc.title}
                      </h4>
                      <p className="text-slate-400 text-sm leading-relaxed italic">"{uc.description}"</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="w-full lg:w-80 space-y-8">
            <div className="sticky top-10 space-y-8">
              <div className="glass p-8 rounded-[2.5rem] border border-blue-500/20 bg-blue-500/[0.02]">
                <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-6">Expert Resources</h3>
                <div className="space-y-4">
                  {phase.details?.resources?.map((res, i) => (
                    <a 
                      key={i} 
                      href={res.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-blue-500/30 transition-all group"
                    >
                      <div className="shrink-0">
                        {res.type === 'video' ? <PlayIcon className="w-5 h-5 text-rose-500" /> : 
                         res.type === 'doc' ? <BookOpenIcon className="w-5 h-5 text-emerald-500" /> : 
                         <LinkIcon className="w-5 h-5 text-blue-500" />}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-white text-xs font-bold truncate">{res.title}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">{res.type}</p>
                      </div>
                    </a>
                  )) || <p className="text-slate-500 text-xs italic">No resources available for this phase yet.</p>}
                </div>
              </div>

              <div className="glass p-8 rounded-[2.5rem] border border-white/5">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Milestone Target</h3>
                <p className="text-white text-sm font-bold mb-2">{phase.artifact}</p>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full ${phase.status === 'completed' ? 'w-full bg-emerald-500' : phase.status === 'in-progress' ? 'w-1/2 bg-blue-500' : 'w-0'}`} />
                </div>
                <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/5">
                   <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Architect Tip</p>
                   <p className="text-xs text-slate-300 italic">"Security is a day-zero priority. Never assume the default settings are secure enough for enterprise."</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fadeIn pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roadmap.map((phase, idx) => (
          <button 
            key={idx} 
            onClick={() => setSelectedPhaseIdx(idx)}
            className={`glass p-8 rounded-[2rem] border transition-all duration-500 relative flex flex-col h-full text-left group
            ${phase.status === 'completed' ? 'border-emerald-500/30 hover:border-emerald-500/60' : 
              phase.status === 'in-progress' ? 'border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:border-blue-500/80' : 
              'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'}`}
          >
            {phase.status === 'completed' && (
              <CheckCircleIcon className="absolute top-4 right-4 w-6 h-6 text-emerald-500" />
            )}
            
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110
              ${phase.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 
                phase.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' : 
                'bg-white/10 text-slate-500'}`}
            >
              <phase.icon className="w-6 h-6" />
            </div>

            <div className="mb-6">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{phase.week}</span>
              <h3 className="text-lg font-bold text-white mt-1 leading-tight group-hover:text-blue-400 transition-colors">{phase.title}</h3>
            </div>

            <div className="space-y-4 mb-8 flex-grow">
              <div>
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Daily Roadmap</p>
                <div className="space-y-2">
                  {phase.days.map((day, dIdx) => (
                    <p key={dIdx} className="text-xs text-slate-400 leading-relaxed">• {day}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 mt-auto">
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Final Artifact</p>
              <p className="text-sm font-semibold text-slate-300">{phase.artifact}</p>
            </div>

            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] pointer-events-none" />
          </button>
        ))}
      </div>

      <div className="glass p-10 rounded-[2.5rem] border border-blue-500/20 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-4">Certification Strategy (SAA-C03)</h3>
          <p className="text-slate-400 leading-relaxed mb-6">
            Combine this roadmap with active-recall training. Focus 70% of your time on <strong>Compute, Networking, and Storage</strong> as they represent the majority of exam weight. Spend the remaining 30% on Database and Security nuances.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm text-emerald-400 font-bold">
              <CheckCircleIcon className="w-5 h-5" /> Mock Exam Ready
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-400 font-bold">
              <CheckCircleIcon className="w-5 h-5" /> Lab Completion Verified
            </div>
          </div>
        </div>
        <div className="w-full md:w-auto">
          <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 transition-all flex items-center gap-3 active:scale-95">
            Download Study Pack <AcademicCapIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoadmapSection;
