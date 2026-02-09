
import React, { useState } from 'react';
import { 
  CloudIcon, 
  BookOpenIcon, 
  CpuChipIcon, 
  Square3Stack3DIcon, 
  BeakerIcon, 
  MagnifyingGlassIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
  Bars3Icon,
  ArrowLeftIcon,
  PlayIcon,
  CheckCircleIcon,
  BriefcaseIcon,
  LightBulbIcon,
  LinkIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { SectionId, AWSModule } from './types';
import { MODULES, CLOUDFORMATION_VPC } from './constants';
import ServiceMatcher from './components/ServiceMatcher';
import IaCViewer from './components/IaCViewer';
import ArchitectureReviewer from './components/ArchitectureReviewer';
import RoadmapSection from './components/RoadmapSection';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('fundamentals');
  const [selectedModule, setSelectedModule] = useState<AWSModule | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { id: 'fundamentals', name: 'Fundamentals', icon: BookOpenIcon },
    { id: 'core-services', name: 'Core Services', icon: CpuChipIcon },
    { id: 'architecture', name: 'Architecture Patterns', icon: Square3Stack3DIcon },
    { id: 'labs', name: 'Hands-on Labs', icon: BeakerIcon },
    { id: 'matcher', name: 'Service Matcher', icon: MagnifyingGlassIcon },
    { id: 'review', name: 'Architecture Review', icon: ShieldCheckIcon },
    { id: 'roadmap', name: '30-Day Roadmap', icon: CalendarDaysIcon },
  ];

  const handleSectionChange = (id: SectionId) => {
    setActiveSection(id);
    setSelectedModule(null);
    setIsSidebarOpen(false);
  };

  const renderModuleDetail = (module: AWSModule) => (
    <div className="max-w-6xl mx-auto space-y-12 animate-fadeIn pb-20">
      <button 
        onClick={() => setSelectedModule(null)}
        className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors group"
      >
        <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to {activeSection.replace('-', ' ')}
      </button>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-12">
          <header className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center border border-blue-500/20">
                <LightBulbIcon className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <div className="flex gap-2 mb-2">
                  {module.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-white/5 rounded text-[10px] uppercase font-black tracking-widest text-slate-500 border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">{module.title}</h1>
              </div>
            </div>
            
            <section className="glass p-8 rounded-[2.5rem] border-l-4 border-l-indigo-500 border-white/5">
              <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">The Architect's Strategic 'Why'</h4>
              <p className="text-slate-300 text-xl font-light leading-relaxed italic">
                "{module.architectWhy}"
              </p>
            </section>
          </header>

          {module.masterSummary && (
            <section className="glass p-10 rounded-[3rem] border border-blue-500/10 bg-blue-500/[0.01] space-y-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.4em] flex items-center gap-2">
                  <AcademicCapIcon className="w-5 h-5" /> Masterclass Executive Briefing
                </h3>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Est. Reading: 3 Minutes</span>
              </div>
              <div className="prose prose-invert max-w-none">
                <div className="text-slate-300 text-lg leading-relaxed space-y-6 font-light">
                  {module.masterSummary.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            </section>
          )}

          <div className="space-y-10">
            {module.detailedTopics?.map((topic, i) => (
              <div key={i} className="glass p-10 rounded-[3rem] border border-white/5 hover:border-blue-500/20 transition-all group">
                <div className="flex flex-col md:flex-row gap-10">
                  <div className="flex-1 space-y-6">
                    <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                      {topic.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {topic.keyPoints.map((point, pi) => (
                        <div key={pi} className="flex gap-3 text-sm text-slate-300">
                          <CheckCircleIcon className="w-5 h-5 text-emerald-500 shrink-0" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="w-full md:w-64 space-y-4">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Learning Assets</h4>
                    {topic.resources.map((res, ri) => (
                      <a 
                        key={ri} 
                        href={res.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-blue-500/30 transition-all group/link"
                      >
                        {res.type === 'video' ? <PlayIcon className="w-4 h-4 text-rose-500" /> : <BookOpenIcon className="w-4 h-4 text-emerald-500" />}
                        <span className="text-xs font-bold text-slate-400 group-hover/link:text-white truncate">{res.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {module.useCases && (
            <section className="space-y-6 pt-12 border-t border-white/5">
              <h3 className="text-xs font-black text-emerald-400 uppercase tracking-[0.4em] flex items-center gap-2">
                <BriefcaseIcon className="w-5 h-5" /> Real-World Solution Architectures
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {module.useCases.map((uc, i) => (
                  <div key={i} className="glass p-8 rounded-3xl border border-emerald-500/10 bg-emerald-500/[0.01] hover:bg-emerald-500/[0.03] transition-all">
                    <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
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
              <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-6">Synergy & Cost</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Service Synergy</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{module.serviceSynergy}</p>
                </div>
                <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Architect Tip</p>
                  <p className="text-xs text-emerald-200/80 italic font-medium">"{module.costTip}"</p>
                </div>
              </div>
            </div>

            <div className="glass p-8 rounded-[2.5rem] border border-white/5">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Official Specs</h3>
              <a 
                href={module.documentationUrl}
                target="_blank"
                className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <LinkIcon className="w-5 h-5 text-indigo-400" />
                  <span className="text-xs font-bold text-slate-300">AWS Documentation</span>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-slate-600 group-hover:text-white" />
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );

  const renderContent = () => {
    if (selectedModule) return renderModuleDetail(selectedModule);

    switch (activeSection) {
      case 'matcher':
        return <ServiceMatcher />;
      case 'review':
        return <ArchitectureReviewer />;
      case 'roadmap':
        return <RoadmapSection />;
      case 'labs':
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="glass p-8 rounded-3xl border border-blue-500/20">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Lab 01: Multi-Tier Network Isolation
              </h2>
              <p className="text-slate-400 mb-6">
                In this lab, you will deploy a multi-tier VPC using CloudFormation. This architecture follows strict 
                isolation patterns where the database tier is inaccessible even from the public subnet, only allowing 
                inbound traffic from the application tier.
              </p>
              <IaCViewer code={CLOUDFORMATION_VPC} />
            </div>
            
            <div className="glass p-8 rounded-3xl">
              <h3 className="text-xl font-semibold mb-2 text-white">Lab Objective</h3>
              <p className="text-slate-400 text-sm mb-4">Master the flow of traffic between subnets and the configuration of security group chaining.</p>
              <div className="flex gap-4">
                <div className="px-4 py-2 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">Deploying in us-east-1</div>
                <div className="px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">Estimated Cost: &lt;$0.01</div>
              </div>
            </div>
          </div>
        );
      default:
        const currentModules = MODULES[activeSection as keyof typeof MODULES] || [];
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            {currentModules.map((module, idx) => (
              <button 
                key={idx} 
                onClick={() => setSelectedModule(module)}
                className="glass group hover:bg-white/[0.05] transition-all duration-300 p-8 rounded-3xl border border-white/10 flex flex-col text-left"
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">{module.title}</h3>
                  <div className="flex gap-2">
                    {module.tags.map(tag => (
                      <span key={tag} className="text-[10px] uppercase tracking-widest px-2 py-1 bg-white/10 rounded-md text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-6 flex-grow">
                  <section>
                    <h4 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-2">The Architect's Why</h4>
                    <p className="text-slate-300 leading-relaxed italic border-l-2 border-indigo-500/30 pl-4 line-clamp-2">
                      {module.architectWhy}
                    </p>
                  </section>

                  <section>
                    <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">Service Synergy</h4>
                    <p className="text-slate-400 text-sm line-clamp-2">
                      {module.serviceSynergy}
                    </p>
                  </section>
                </div>
                
                <div className="mt-8 flex items-center justify-between text-sm font-medium text-slate-400 group-hover:text-white transition-colors">
                  <span className="flex items-center gap-2">Consult Design Deep-Dive <ChevronRightIcon className="w-4 h-4" /></span>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-blue-500/20 group-hover:border-blue-500/40 transition-all">
                    <ChevronRightIcon className="w-4 h-4" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 glass-dark border-r border-white/10 
        transform transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <CloudIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">AWS Masterclass</h1>
              <p className="text-[10px] text-orange-400 uppercase font-bold tracking-widest">Solutions Architect</p>
            </div>
          </div>

          <nav className="space-y-1 flex-grow overflow-y-auto">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id as SectionId)}
                className={`
                  w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${activeSection === item.id 
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'}
                `}
              >
                <item.icon className={`w-5 h-5 ${activeSection === item.id ? 'text-blue-400' : 'text-slate-500 group-hover:text-white'}`} />
                <span className="font-medium text-sm">{item.name}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-white/5">
            <div className="glass p-4 rounded-2xl">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Next Milestone</p>
              <p className="text-xs font-semibold text-white mb-3">SAA-C03 Certification</p>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-12 md:py-10">
        <header className="flex justify-between items-center mb-10">
          <button 
            className="lg:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          
          <div className="hidden md:flex items-center gap-4 glass px-5 py-2 rounded-full border border-white/5">
            <MagnifyingGlassIcon className="w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search services, patterns, labs..." 
              className="bg-transparent border-none outline-none text-sm text-slate-300 w-64"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white">Cloud Architect</p>
              <p className="text-[10px] text-emerald-400 uppercase tracking-widest">Level 12 • Tier 1</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 border-2 border-white/10 p-0.5">
              <img src="https://picsum.photos/40/40?seed=architect" className="w-full h-full rounded-full" alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="mb-10">
          <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            {selectedModule ? selectedModule.title : navigation.find(n => n.id === activeSection)?.name}
          </h2>
          <p className="text-slate-400 max-w-2xl text-lg">
            {selectedModule ? `Advanced architectural drill-down into ${selectedModule.title}.` : activeSection === 'roadmap' ? 'Your comprehensive guide to mastering AWS architecture in 30 days.' : `Deep dive into the ${activeSection.replace('-', ' ')} that power global, hyper-scale AWS architectures in 2026.`}
          </p>
        </div>

        {renderContent()}
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
