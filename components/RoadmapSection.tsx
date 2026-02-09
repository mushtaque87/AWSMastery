
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
  FireIcon
} from '@heroicons/react/24/outline';
import { RoadmapDetail } from '../types';

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
            summary: "Mastering the distinction between human users and machine identities. For SAA-C03, focus on IAM Roles for EC2/Lambda and why long-term access keys are an anti-pattern. Learn the evaluation logic of Allow vs Deny."
          },
          {
            level: 'associate',
            title: "Identity Federation & STS",
            summary: "How to connect your on-prem Active Directory or Google Workspace to AWS. Understanding the Security Token Service (STS) flow for temporary credentials—a core component for almost every exam question involving hybrid identity."
          },
          {
            level: 'associate',
            title: "Resource-Based vs Identity-Based Policies",
            summary: "Deep dive into S3 Bucket Policies and KMS Key Policies. Understanding how an explicit 'Deny' in a resource-based policy overrides an 'Allow' in an IAM policy."
          },
          {
            level: 'principal',
            title: "Service Control Policies (SCPs) at Scale",
            summary: "Implementing centralized governance across hundreds of accounts. Using SCPs to disable regions, prevent the root user from acting, and enforcing encrypted storage across the entire organization."
          },
          {
            level: 'principal',
            title: "ABAC: Attribute-Based Access Control",
            summary: "The future of scaling identity. Instead of managing thousands of roles, use session tags. A user can only access resources where 'ResourceTag/Project == PrincipalTag/Project'. This is the 'Secret Sauce' for Lead Architects managing massive teams."
          },
          {
            level: 'principal',
            title: "IAM Roles Anywhere & Private CA",
            summary: "Extending AWS IAM to on-prem servers and IoT devices without static keys. Using short-lived X.509 certificates to assume IAM roles from external environments."
          },
          {
            level: 'principal',
            title: "Permission Boundaries & Governance",
            summary: "How to safely delegate IAM administration to developers without letting them escalate their own privileges. A critical pattern for large-scale enterprise landing zones."
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
        summary: "Compute is the engine of your architecture. Week 2 focuses on transient, right-sized compute using Lambda (Serverless) and Fargate (Containerless).",
        topics: [
          { level: 'associate', title: "EC2 vs Lambda vs Fargate", summary: "Choosing the right compute based on memory, execution time, and operational overhead." },
          { level: 'principal', title: "Step Functions for Microservices", summary: "Orchestrating long-running workflows with distributed state machines." }
        ],
        useCases: [
          { title: "Peak-Traffic E-commerce Processing", description: "Scale from 10 to 100k requests/sec instantly using Lambda and SQS." }
        ],
        resources: [
          { type: 'video', title: "Serverless Land: Event-Driven Architectures", url: "https://serverlessland.com/" }
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
      days: ["Day 15-17: Relational Mastery", "Day 18-19: NoSQL Data Modeling", "Day 20-21: Data Lake Modernization"]
    },
    {
      week: "Week 4",
      title: "IaC & Operational Excellence",
      focus: "CDK, CloudFormation, & Observability",
      artifact: "Production-Ready IaC Repository",
      icon: WrenchScrewdriverIcon,
      status: "pending",
      days: ["Day 22-24: Infrastructure as Code", "Day 25-27: CloudWatch & X-Ray", "Day 28-30: Final Mock Review"]
    }
  ];

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
                  <div key={i} className="glass p-8 rounded-3xl border border-white/5 hover:border-blue-500/20 transition-all group">
                    <h4 className="text-white font-bold text-lg mb-2 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:animate-ping" />
                      {topic.title}
                    </h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{topic.summary}</p>
                  </div>
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
                  <div key={i} className="glass p-8 rounded-[2.5rem] border border-indigo-500/10 bg-indigo-500/[0.02] hover:bg-indigo-500/[0.05] hover:border-indigo-500/40 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                      <StarIcon className="w-12 h-12 text-indigo-400" />
                    </div>
                    <h4 className="text-white font-black text-xl mb-4 leading-tight group-hover:text-indigo-300 transition-colors">{topic.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed font-light">{topic.summary}</p>
                  </div>
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
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
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
