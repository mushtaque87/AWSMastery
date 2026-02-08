
import React, { useState, useEffect } from 'react';
import { 
  SparklesIcon, 
  ArrowPathIcon, 
  DocumentTextIcon, 
  ChatBubbleBottomCenterTextIcon,
  QueueListIcon,
  BoltIcon, 
  ShieldCheckIcon,
  CircleStackIcon,
  CpuChipIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
  LinkIcon,
  ArrowLongRightIcon,
  ArchiveBoxIcon,
  TrashIcon,
  ClockIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/solid';
import { matchAWSService, explainStepDetail } from '../services/gemini';
import { ScenarioMatch, StepExplanation, SavedMatch } from '../types';

declare global {
  interface Window {
    mermaid: any;
  }
}

type MatchMode = 'conversational' | 'structured' | 'history';

interface Brief {
  workload: string;
  traffic: string;
  latency: string;
  persistence: string;
  security: string;
}

const BLUEPRINTS = [
  {
    name: "Real-time Gaming State",
    brief: {
      workload: "Synchronization of player positions and inventory for a multiplayer RPG.",
      traffic: "Highly spiky, 1M+ concurrent users at peak.",
      latency: "Sub-10ms required for state updates.",
      persistence: "Key-value, session-based storage.",
      security: "Public-facing API with DDoS protection."
    }
  },
  {
    name: "Financial Audit Ledger",
    brief: {
      workload: "Immutable storage of transaction logs for regulatory compliance.",
      traffic: "Steady stream of batch uploads every hour.",
      latency: "Near real-time not required; consistency is priority.",
      persistence: "Relational/ACID compliant, cryptographically verifiable.",
      security: "Encryption at rest/transit, strict IAM, VPC isolated."
    }
  },
  {
    name: "Global Video Streaming",
    brief: {
      workload: "VOD content delivery and transcoding for a global audience.",
      traffic: "High throughput, global distribution.",
      latency: "Low time-to-first-byte (TTFB).",
      persistence: "Massive binary objects (MP4/HLS).",
      security: "Signed URLs, Geo-blocking, WAF protection."
    }
  }
];

const MermaidDiagram: React.FC<{ definition: string }> = ({ definition }) => {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!definition || !window.mermaid) return;

      try {
        setError(false);
        window.mermaid.initialize({ 
          startOnLoad: false, 
          theme: 'dark',
          securityLevel: 'loose',
          fontFamily: 'Inter',
          themeVariables: {
            primaryColor: '#3b82f6',
            primaryTextColor: '#fff',
            lineColor: '#6366f1',
            secondaryColor: '#1e293b',
            tertiaryColor: '#0f172a',
            mainBkg: '#1e293b',
            nodeBorder: '#3b82f6',
            clusterBkg: '#0f172a',
            clusterBorder: '#1e293b',
            defaultLinkColor: '#6366f1'
          }
        });

        const id = `mermaid-diag-${Math.random().toString(36).substring(2, 9)}`;
        const { svg: svgCode } = await window.mermaid.render(id, definition);
        setSvg(svgCode);
      } catch (err) {
        console.error("Mermaid rendering failed:", err);
        setError(true);
      }
    };

    renderDiagram();
  }, [definition]);

  if (error) {
    return (
      <div className="bg-slate-900/50 rounded-2xl p-8 border border-rose-500/20 flex flex-col items-center justify-center text-center">
        <p className="text-rose-400 font-bold mb-2">Diagram Rendering Error</p>
        <p className="text-slate-500 text-[10px] font-mono max-w-xs break-all opacity-50">{definition}</p>
      </div>
    );
  }

  return (
    <div 
      className="bg-slate-900/50 rounded-[2rem] p-8 border border-white/5 overflow-x-auto min-h-[400px] flex items-center justify-center shadow-inner"
      dangerouslySetInnerHTML={{ __html: svg || '<div class="animate-pulse flex space-y-4 flex-col items-center"><div class="rounded-full bg-slate-800 h-10 w-10"></div><div class="h-2 bg-slate-800 rounded w-32"></div></div>' }}
    />
  );
};

interface StepProps {
  index: number;
  phase: string;
  details: string;
  context: string;
}

const ImplementationStep: React.FC<StepProps> = ({ index, phase, details, context }) => {
  const [explanation, setExplanation] = useState<StepExplanation | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDeepDive = async () => {
    if (explanation) {
      setIsOpen(!isOpen);
      return;
    }
    
    setLoading(true);
    try {
      const result = await explainStepDetail(phase, details, context);
      setExplanation(result);
      setIsOpen(true);
    } catch (err) {
      alert("Consulting architect failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col md:flex-row gap-8 items-start group">
      <div className="hidden md:flex w-16 h-16 rounded-2xl bg-slate-900 border border-indigo-500/40 items-center justify-center z-10 shrink-0 group-hover:bg-indigo-600 group-hover:border-indigo-400 transition-all">
        <span className="text-xl font-black text-white">{index + 1}</span>
      </div>
      <div className="flex-1 space-y-4">
        <div className="bg-white/5 border border-white/5 rounded-3xl p-8 group-hover:bg-white/10 transition-all relative">
          <h5 className="text-xl font-bold text-indigo-300 mb-3">{phase}</h5>
          <p className="text-slate-400 leading-relaxed mb-6">{details}</p>
          
          <button 
            onClick={handleDeepDive}
            disabled={loading}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <ArrowPathIcon className="w-4 h-4 animate-spin" />
            ) : isOpen ? (
              <>Hide Architect Review <BoltIcon className="w-4 h-4" /></>
            ) : (
              <>Ask Architect: Analyze Jargon & Patterns <QuestionMarkCircleIcon className="w-4 h-4" /></>
            )}
          </button>
        </div>

        {/* Deep Dive Content */}
        {isOpen && explanation && (
          <div className="animate-fadeIn p-8 bg-blue-500/5 rounded-3xl border border-blue-500/20 space-y-8">
            <div className="space-y-3">
              <h6 className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                <SparklesIcon className="w-4 h-4" /> Architect's Breakdown
              </h6>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line italic">
                {explanation.explanation}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h6 className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                  <BookOpenIcon className="w-4 h-4" /> Technical Glossary
                </h6>
                <div className="space-y-3">
                  {explanation.keyTerms.map((item, idx) => (
                    <div key={idx} className="bg-black/20 p-4 rounded-xl border border-white/5">
                      <p className="text-white text-xs font-bold mb-1">{item.term}</p>
                      <p className="text-slate-400 text-[11px] leading-snug">{item.definition}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h6 className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                  <LinkIcon className="w-4 h-4" /> Official References
                </h6>
                <div className="flex flex-col gap-2">
                  {explanation.documentationLinks.map((link, idx) => (
                    <a 
                      key={idx} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 rounded-xl group/link transition-all"
                    >
                      <span className="text-xs text-slate-300 font-medium">{link.title}</span>
                      <ArrowLongRightIcon className="w-4 h-4 text-emerald-400 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ServiceMatcher: React.FC = () => {
  const [mode, setMode] = useState<MatchMode>('conversational');
  const [scenario, setScenario] = useState('');
  const [brief, setBrief] = useState<Brief>({
    workload: '',
    traffic: '',
    latency: '',
    persistence: '',
    security: ''
  });
  const [result, setResult] = useState<ScenarioMatch | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<SavedMatch[]>([]);

  // Load history from local storage
  useEffect(() => {
    const saved = localStorage.getItem('aws_matcher_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveToHistory = (match: ScenarioMatch, prompt: string) => {
    const newEntry: SavedMatch = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      prompt,
      match
    };
    const updatedHistory = [newEntry, ...history].slice(0, 50); // Keep last 50
    setHistory(updatedHistory);
    localStorage.setItem('aws_matcher_history', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear your architecture vault?")) {
      setHistory([]);
      localStorage.removeItem('aws_matcher_history');
    }
  };

  const handleApplyBlueprint = (blueprint: typeof BLUEPRINTS[0]) => {
    setMode('structured');
    setBrief(blueprint.brief);
    setResult(null);
  };

  const selectHistoryItem = (item: SavedMatch) => {
    setResult(item.match);
    // When viewing history, we stay in result mode. To go back, user can use the back button.
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalPrompt = '';
    if (mode === 'conversational') {
      if (!scenario.trim()) return;
      finalPrompt = scenario;
    } else {
      if (!brief.workload.trim()) return;
      finalPrompt = `
        WORKLOAD: ${brief.workload}
        TRAFFIC PROFILE: ${brief.traffic}
        LATENCY REQ: ${brief.latency}
        PERSISTENCE: ${brief.persistence}
        SECURITY POSTURE: ${brief.security}
      `;
    }
    
    setLoading(true);
    setResult(null);
    try {
      const match = await matchAWSService(finalPrompt);
      setResult(match);
      saveToHistory(match, finalPrompt);
    } catch (error) {
      console.error(error);
      alert("Failed to generate architecture. Please check your prompt and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fadeIn pb-24">
      {/* Tab Selector & Blueprints */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
          <button
            onClick={() => { setMode('conversational'); setResult(null); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'conversational' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white'}`}
          >
            <ChatBubbleBottomCenterTextIcon className="w-5 h-5" /> Quick Pitch
          </button>
          <button
            onClick={() => { setMode('structured'); setResult(null); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'structured' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white'}`}
          >
            <QueueListIcon className="w-5 h-5" /> Architect's Brief
          </button>
          <button
            onClick={() => { setMode('history'); setResult(null); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'history' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white'}`}
          >
            <ArchiveBoxIcon className="w-5 h-5" /> Design Vault
          </button>
        </div>

        {mode !== 'history' && (
          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest self-center mr-2">Blueprints:</span>
            {BLUEPRINTS.map((bp) => (
              <button
                key={bp.name}
                onClick={() => handleApplyBlueprint(bp)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-slate-300 transition-all"
              >
                {bp.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {!result && mode !== 'history' && (
        <div className="glass p-8 md:p-12 rounded-[3rem] border border-blue-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <form onSubmit={handleSubmit} className="relative space-y-10">
            {mode === 'conversational' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <DocumentTextIcon className="w-6 h-6 text-blue-400" />
                  <h3 className="text-2xl font-bold text-white tracking-tight">Enterprise Requirement</h3>
                </div>
                <textarea
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                  placeholder="Describe your enterprise workload requirements..."
                  className="w-full bg-black/30 border border-white/10 rounded-3xl p-8 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 min-h-[220px] transition-all text-xl leading-relaxed shadow-inner"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 space-y-3">
                  <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                    <BoltIcon className="w-4 h-4 text-blue-400" /> Core Workload Logic
                  </label>
                  <input
                    value={brief.workload}
                    onChange={(e) => setBrief({...brief, workload: e.target.value})}
                    placeholder="Primary objective of this system"
                    className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-lg"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                    <CpuChipIcon className="w-4 h-4 text-indigo-400" /> Scalability Profile
                  </label>
                  <input
                    value={brief.traffic}
                    onChange={(e) => setBrief({...brief, traffic: e.target.value})}
                    placeholder="Requests/sec, global spread"
                    className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                    <BoltIcon className="w-4 h-4 text-amber-400" /> SLA & Latency
                  </label>
                  <input
                    value={brief.latency}
                    onChange={(e) => setBrief({...brief, latency: e.target.value})}
                    placeholder="User experience requirements"
                    className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                    <CircleStackIcon className="w-4 h-4 text-emerald-400" /> Storage Strategy
                  </label>
                  <input
                    value={brief.persistence}
                    onChange={(e) => setBrief({...brief, persistence: e.target.value})}
                    placeholder="Consistency, Volume, Type"
                    className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                    <ShieldCheckIcon className="w-4 h-4 text-rose-400" /> Compliance & Security
                  </label>
                  <input
                    value={brief.security}
                    onChange={(e) => setBrief({...brief, security: e.target.value})}
                    placeholder="IAM, VPC, Regulatory needs"
                    className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="group relative flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <>Analyzing Stack <ArrowPathIcon className="w-7 h-7 animate-spin" /></>
                ) : (
                  <>Submit to Architect Board <SparklesIcon className="w-7 h-7" /></>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {mode === 'history' && !result && (
        <div className="space-y-8 animate-fadeIn">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <ArchiveBoxIcon className="w-8 h-8 text-indigo-400" /> Architecture Vault
            </h3>
            {history.length > 0 && (
              <button 
                onClick={clearHistory}
                className="flex items-center gap-2 text-xs font-black text-rose-400 uppercase tracking-widest hover:text-rose-300 transition-colors"
              >
                <TrashIcon className="w-4 h-4" /> Clear Vault
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="glass p-20 rounded-[3rem] border border-white/5 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <ClockIcon className="w-10 h-10 text-slate-600" />
              </div>
              <p className="text-slate-400 text-lg">Your architecture vault is empty.</p>
              <p className="text-slate-600 text-sm mt-2">Generate your first design to see it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => selectHistoryItem(item)}
                  className="glass group p-8 rounded-[2.5rem] border border-white/5 hover:border-indigo-500/40 hover:bg-white/[0.04] transition-all text-left flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                    <ArchiveBoxIcon className="w-5 h-5 text-white/10 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  
                  <h4 className="text-xl font-black text-white mb-4 line-clamp-2 leading-tight">
                    {item.match.recommendedService}
                  </h4>
                  
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 mb-8 flex-grow">
                    {item.prompt}
                  </p>

                  <div className="flex items-center gap-2 text-xs font-bold text-blue-400 group-hover:gap-4 transition-all">
                    Recall Design <ArrowLongRightIcon className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {result && (
        <div className="space-y-12 animate-fadeIn">
          {/* Result Controls */}
          <div className="flex justify-start">
            <button 
              onClick={() => { setResult(null); }}
              className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" /> Back to Workspace
            </button>
          </div>

          {/* Main Hero Result */}
          <div className="glass p-12 rounded-[4rem] border border-emerald-500/20 bg-emerald-500/[0.02]">
            <div className="flex flex-col lg:flex-row gap-16">
              <div className="flex-1 space-y-10">
                <div>
                  <h4 className="text-xs font-black text-emerald-400 uppercase tracking-[0.4em] mb-6">Principal Recommendation</h4>
                  <p className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-8">
                    {result.recommendedService}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.4em]">Strategic Justification</h4>
                  <p className="text-slate-300 leading-relaxed text-xl md:text-2xl font-light italic border-l-[6px] border-blue-500/30 pl-8 py-2">
                    {result.justification}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
                  <div>
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Alternatives Considered</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.alternatives?.map(alt => (
                        <span key={alt} className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-xs text-slate-400 font-bold uppercase tracking-wider">{alt}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-2">Architectural Confidence</span>
                    <span className="text-4xl font-black text-white">98%</span>
                  </div>
                </div>
              </div>

              {/* Diagram Section */}
              <div className="w-full lg:w-1/2 space-y-6">
                 <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-4 text-center">Service Architecture Flow</h4>
                 <MermaidDiagram definition={result.mermaidDiagram} />
              </div>
            </div>
          </div>

          {/* Detailed Implementation Roadmap */}
          <div className="glass p-12 rounded-[4rem] border border-indigo-500/20">
            <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em] mb-12 text-center">Step-by-Step Implementation Plan</h4>
            <div className="space-y-10 relative">
              <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-indigo-500/20 hidden md:block" />
              {result.implementationSteps.map((step, idx) => (
                <ImplementationStep 
                  key={idx} 
                  index={idx} 
                  phase={step.phase} 
                  details={step.details} 
                  context={result.justification}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceMatcher;
