
import React, { useState, useEffect, useRef } from 'react';
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
  ArrowLeftIcon, 
  CloudArrowUpIcon, 
  ArrowDownTrayIcon, 
  ClipboardDocumentCheckIcon,
  DocumentArrowDownIcon
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

const MermaidDiagram: React.FC<{ definition: string; onRendered?: (svg: string) => void }> = ({ definition, onRendered }) => {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setError(false);
    setSvg('');
    setTimeout(() => {
      setRefreshKey(prev => prev + 1);
      setIsRefreshing(false);
    }, 300);
  };

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
        if (onRendered) onRendered(svgCode);
      } catch (err) {
        console.error("Mermaid rendering failed:", err);
        setError(true);
      }
    };

    renderDiagram();
  }, [definition, refreshKey]);

  if (error) {
    return (
      <div className="bg-slate-900/50 rounded-[2rem] p-8 border border-rose-500/20 flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-4">
          <BoltIcon className="w-8 h-8 text-rose-500" />
        </div>
        <p className="text-rose-400 font-bold mb-2">Diagram Rendering Error</p>
        <button 
          onClick={handleRefresh}
          className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
        >
          <ArrowPathIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} /> Force Re-sync
        </button>
      </div>
    );
  }

  return (
    <div className="relative group/diagram">
      <div className="absolute top-4 right-4 z-20 opacity-0 group-hover/diagram:opacity-100 transition-opacity">
        <button 
          onClick={handleRefresh}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-md border border-white/10 text-slate-400 hover:text-white transition-all"
        >
          <ArrowPathIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div 
        className="bg-slate-900/50 rounded-[2rem] p-8 border border-white/5 overflow-x-auto min-h-[400px] flex items-center justify-center shadow-inner transition-all"
        dangerouslySetInnerHTML={{ __html: svg || '<div class="animate-pulse flex flex-col items-center space-y-4"><div class="rounded-full bg-slate-800 h-12 w-12"></div><div class="h-2 bg-slate-800 rounded w-32"></div></div>' }}
      />
    </div>
  );
};

const ServiceMatcher: React.FC = () => {
  const [mode, setMode] = useState<MatchMode>('conversational');
  const [scenario, setScenario] = useState('');
  const [brief, setBrief] = useState<Brief>({ workload: '', traffic: '', latency: '', persistence: '', security: '' });
  const [result, setResult] = useState<ScenarioMatch | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<SavedMatch[]>([]);
  const [syncKey, setSyncKey] = useState('');
  const [showSyncPanel, setShowSyncPanel] = useState(false);
  const [lastSvg, setLastSvg] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('aws_matcher_history');
    if (saved) { try { setHistory(JSON.parse(saved)); } catch (e) {} }
  }, []);

  const saveToHistory = (match: ScenarioMatch, prompt: string) => {
    const newEntry: SavedMatch = { id: Math.random().toString(36).substring(2, 9), timestamp: Date.now(), prompt, match };
    const updatedHistory = [newEntry, ...history].slice(0, 50);
    setHistory(updatedHistory);
    localStorage.setItem('aws_matcher_history', JSON.stringify(updatedHistory));
  };

  const handleDownloadReport = () => {
    if (!result) return;

    const dateStr = new Date().toLocaleDateString();
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset="utf-8"><title>Executive Architecture Briefing</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 40px auto; padding: 20px; }
        .header { border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 40px; }
        .title { font-size: 28pt; font-weight: bold; color: #1e3a8a; margin: 0; }
        .subtitle { font-size: 12pt; color: #64748b; margin-top: 5px; text-transform: uppercase; letter-spacing: 2px; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 16pt; font-weight: bold; color: #3b82f6; border-left: 5px solid #3b82f6; padding-left: 15px; margin-bottom: 15px; }
        .recommendation { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; font-size: 18pt; font-weight: 800; color: #1e293b; text-align: center; }
        .step { margin-bottom: 15px; padding-left: 20px; }
        .step-phase { font-weight: bold; color: #4f46e5; }
        .diagram-box { background: #0f172a; border-radius: 12px; padding: 20px; margin-top: 20px; text-align: center; color: #fff; }
        .footer { font-size: 9pt; color: #94a3b8; text-align: center; margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
      </style>
      </head>
      <body>
        <div class="header">
          <p class="subtitle">AWS Solutions Architect - Executive Briefing</p>
          <h1 class="title">Architectural Decision Record</h1>
          <p>Generated on: ${dateStr}</p>
        </div>

        <div class="section">
          <div class="section-title">Principal Recommendation</div>
          <div class="recommendation">${result.recommendedService}</div>
        </div>

        <div class="section">
          <div class="section-title">Strategic Justification</div>
          <p>${result.justification}</p>
        </div>

        <div class="section">
          <div class="section-title">Implementation Roadmap</div>
          ${result.implementationSteps.map((s, i) => `
            <div class="step">
              <span class="step-phase">Phase ${i+1}: ${s.phase}</span><br/>
              <span>${s.details}</span>
            </div>
          `).join('')}
        </div>

        <div class="section">
          <div class="section-title">Trade-off Analysis (Alternatives)</div>
          <ul>${result.alternatives?.map(a => `<li>${a}</li>`).join('') || 'None identified'}</ul>
        </div>

        <div class="section">
          <div class="section-title">System Topology Definition</div>
          <div class="diagram-box">
            <p style="font-size: 10px; opacity: 0.6; margin-bottom: 10px;">Mermaid Technical Definition</p>
            <pre style="font-size: 10px; color: #94a3b8; text-align: left; padding: 10px; background: rgba(0,0,0,0.3);">${result.mermaidDiagram}</pre>
          </div>
        </div>

        <div class="footer">
          Confidential Architectural Design Document | AWS Architect Masterclass Portal
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AWS-ADR-${result.recommendedService.replace(/\s+/g, '-')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalPrompt = mode === 'conversational' ? scenario : `WORKLOAD: ${brief.workload} | TRAFFIC: ${brief.traffic} | LATENCY: ${brief.latency} | PERSISTENCE: ${brief.persistence} | SECURITY: ${brief.security}`;
    if (!finalPrompt.trim()) return;
    setLoading(true); setResult(null);
    try {
      const match = await matchAWSService(finalPrompt);
      setResult(match);
      saveToHistory(match, finalPrompt);
    } catch (error) { alert("Failed to generate architecture."); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fadeIn pb-24">
      {/* Navigation Tabs */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
          <button onClick={() => { setMode('conversational'); setResult(null); }} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'conversational' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white'}`}>
            <ChatBubbleBottomCenterTextIcon className="w-5 h-5" /> Quick Pitch
          </button>
          <button onClick={() => { setMode('structured'); setResult(null); }} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'structured' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white'}`}>
            <QueueListIcon className="w-5 h-5" /> Architect's Brief
          </button>
          <button onClick={() => { setMode('history'); setResult(null); }} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'history' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white'}`}>
            <ArchiveBoxIcon className="w-5 h-5" /> Design Vault
          </button>
        </div>
      </div>

      {!result && mode !== 'history' && (
        <div className="glass p-8 md:p-12 rounded-[3rem] border border-blue-500/20 relative overflow-hidden">
          <form onSubmit={handleSubmit} className="relative space-y-10">
            {mode === 'conversational' ? (
              <textarea value={scenario} onChange={(e) => setScenario(e.target.value)} placeholder="Describe your enterprise workload requirements..." className="w-full bg-black/30 border border-white/10 rounded-3xl p-8 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 min-h-[220px] transition-all text-xl" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <input value={brief.workload} onChange={(e) => setBrief({...brief, workload: e.target.value})} placeholder="Primary objective of this system" className="md:col-span-2 w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-lg" />
                <input value={brief.traffic} onChange={(e) => setBrief({...brief, traffic: e.target.value})} placeholder="Requests/sec, global spread" className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-slate-600" />
                <input value={brief.latency} onChange={(e) => setBrief({...brief, latency: e.target.value})} placeholder="User experience requirements" className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-slate-600" />
                <input value={brief.persistence} onChange={(e) => setBrief({...brief, persistence: e.target.value})} placeholder="Consistency, Volume, Type" className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-slate-600" />
                <input value={brief.security} onChange={(e) => setBrief({...brief, security: e.target.value})} placeholder="IAM, VPC, Regulatory needs" className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-slate-600" />
              </div>
            )}
            <div className="flex justify-end">
              <button type="submit" disabled={loading} className="group relative flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-[2rem] font-black text-lg shadow-2xl transition-all disabled:opacity-50">
                {loading ? <>Analyzing Stack <ArrowPathIcon className="w-7 h-7 animate-spin" /></> : <>Submit to Architect Board <SparklesIcon className="w-7 h-7" /></>}
              </button>
            </div>
          </form>
        </div>
      )}

      {mode === 'history' && !result && (
        <div className="space-y-8 animate-fadeIn">
          <div className="flex justify-between items-center">
            <h3 className="text-3xl font-black text-white flex items-center gap-3 tracking-tighter">
              <ArchiveBoxIcon className="w-8 h-8 text-indigo-400" /> Architecture Vault
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item) => (
              <button key={item.id} onClick={() => setResult(item.match)} className="glass group p-8 rounded-[2.5rem] border border-white/5 hover:border-indigo-500/40 transition-all text-left flex flex-col h-full relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">{new Date(item.timestamp).toLocaleDateString()}</span>
                </div>
                <h4 className="text-xl font-black text-white mb-4 line-clamp-2 leading-tight">{item.match.recommendedService}</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-3 mb-8 flex-grow">"{item.prompt}"</p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400 group-hover:gap-4 transition-all">Recall Design State <ArrowLongRightIcon className="w-4 h-4" /></div>
              </button>
            ))}
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-12 animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <button onClick={() => setResult(null)} className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors group">
              <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Workspace
            </button>
            <button 
              onClick={handleDownloadReport} 
              className="flex items-center gap-3 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20"
            >
              <DocumentArrowDownIcon className="w-5 h-5" /> Download Executive Briefing
            </button>
          </div>

          <div className="glass p-12 rounded-[4rem] border border-emerald-500/20 bg-emerald-500/[0.02] relative overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-16 relative z-10">
              <div className="flex-1 space-y-10">
                <div>
                  <h4 className="text-xs font-black text-emerald-400 uppercase tracking-[0.4em] mb-6">Principal Recommendation</h4>
                  <p className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-8">{result.recommendedService}</p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.4em]">Strategic Justification</h4>
                  <p className="text-slate-300 leading-relaxed text-xl md:text-2xl font-light italic border-l-[6px] border-blue-500/30 pl-8 py-2">{result.justification}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
                  <div>
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Alternatives Considered</h4>
                    <div className="flex flex-wrap gap-2">{result.alternatives?.map(alt => <span key={alt} className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-xs text-slate-400 font-bold uppercase tracking-wider">{alt}</span>)}</div>
                  </div>
                  <div className="flex flex-col items-center justify-center p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-2">Confidence Score</span>
                    <span className="text-4xl font-black text-white">98%</span>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 space-y-6">
                 <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-4 text-center">Service Architecture Flow</h4>
                 <MermaidDiagram definition={result.mermaidDiagram} onRendered={(svg) => setLastSvg(svg)} />
              </div>
            </div>
          </div>

          <div className="glass p-12 rounded-[4rem] border border-indigo-500/20">
            <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em] mb-12 text-center">Step-by-Step Implementation Plan</h4>
            <div className="space-y-10 relative">
              <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-indigo-500/20 hidden md:block" />
              {result.implementationSteps.map((step, idx) => (
                <ImplementationStep key={idx} index={idx} phase={step.phase} details={step.details} context={result.justification} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ImplementationStep: React.FC<{ index: number; phase: string; details: string; context: string }> = ({ index, phase, details, context }) => {
  const [explanation, setExplanation] = useState<StepExplanation | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDeepDive = async () => {
    if (explanation) { setIsOpen(!isOpen); return; }
    setLoading(true);
    try {
      const result = await explainStepDetail(phase, details, context);
      setExplanation(result); setIsOpen(true);
    } catch (err) { alert("Failed to fetch detail."); } finally { setLoading(false); }
  };

  return (
    <div className="relative flex flex-col md:flex-row gap-8 items-start group">
      <div className="hidden md:flex w-16 h-16 rounded-2xl bg-slate-900 border border-indigo-500/40 items-center justify-center z-10 shrink-0 group-hover:bg-indigo-600 transition-all">
        <span className="text-xl font-black text-white">{index + 1}</span>
      </div>
      <div className="flex-1 space-y-4">
        <div className="bg-white/5 border border-white/5 rounded-3xl p-8 group-hover:bg-white/10 transition-all">
          <h5 className="text-xl font-bold text-indigo-300 mb-3">{phase}</h5>
          <p className="text-slate-400 leading-relaxed mb-6">{details}</p>
          <button onClick={handleDeepDive} disabled={loading} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 disabled:opacity-50">
            {loading ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : isOpen ? <>Hide Review <BoltIcon className="w-4 h-4" /></> : <>Ask Architect <QuestionMarkCircleIcon className="w-4 h-4" /></>}
          </button>
        </div>
        {isOpen && explanation && (
          <div className="animate-fadeIn p-8 bg-blue-500/5 rounded-3xl border border-blue-500/20 space-y-8">
            <p className="text-slate-300 text-sm italic">{explanation.explanation}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h6 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Glossary</h6>
                {explanation.keyTerms.map((item, idx) => <div key={idx} className="bg-black/20 p-4 rounded-xl"><p className="text-white text-xs font-bold">{item.term}</p><p className="text-slate-400 text-[11px]">{item.definition}</p></div>)}
              </div>
              <div className="space-y-4">
                <h6 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Docs</h6>
                {explanation.documentationLinks.map((link, idx) => <a key={idx} href={link.url} target="_blank" className="flex items-center justify-between p-4 bg-emerald-500/5 rounded-xl text-xs text-slate-300 hover:bg-emerald-500/10"><span className="truncate mr-2">{link.title}</span><ArrowLongRightIcon className="w-4 h-4" /></a>)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceMatcher;
