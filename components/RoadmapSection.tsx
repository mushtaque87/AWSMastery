
import React from 'react';
import { 
  ShieldCheckIcon, 
  CpuChipIcon, 
  CircleStackIcon, 
  WrenchScrewdriverIcon,
  AcademicCapIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const RoadmapSection: React.FC = () => {
  const roadmap = [
    {
      week: "Week 1",
      title: "Identity & Security Foundations",
      focus: "IAM, Organizations, SCPs, & Zero Trust",
      artifact: "Global Identity Governance Blueprint",
      icon: ShieldCheckIcon,
      status: "completed",
      days: ["Day 1-2: Advanced IAM Policies", "Day 3-4: Multi-Account Management", "Day 5-7: AWS Organizations & Guardrails"]
    },
    {
      week: "Week 2",
      title: "Resilient Compute Patterns",
      focus: "Lambda, Fargate, & Event-Driven Design",
      artifact: "Auto-scaling Event-Driven Stack",
      icon: CpuChipIcon,
      status: "in-progress",
      days: ["Day 8-10: Serverless Best Practices", "Day 11-12: Container Orchestration", "Day 13-14: Decoupling with EventBridge"]
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

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roadmap.map((phase, idx) => (
          <div key={idx} className={`glass p-8 rounded-[2rem] border transition-all duration-500 relative flex flex-col h-full
            ${phase.status === 'completed' ? 'border-emerald-500/30' : 
              phase.status === 'in-progress' ? 'border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 
              'border-white/10 opacity-60'}`}
          >
            {phase.status === 'completed' && (
              <CheckCircleIcon className="absolute top-4 right-4 w-6 h-6 text-emerald-500" />
            )}
            
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 
              ${phase.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 
                phase.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' : 
                'bg-white/10 text-slate-500'}`}
            >
              <phase.icon className="w-6 h-6" />
            </div>

            <div className="mb-6">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{phase.week}</span>
              <h3 className="text-lg font-bold text-white mt-1 leading-tight">{phase.title}</h3>
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

            <div className="pt-6 border-t border-white/5">
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Final Artifact</p>
              <p className="text-sm font-semibold text-slate-300">{phase.artifact}</p>
            </div>
          </div>
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
          <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 transition-all flex items-center gap-3">
            Download Study Pack <AcademicCapIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoadmapSection;
