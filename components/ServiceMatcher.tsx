
import React, { useState, useEffect } from 'react';
import { 
  SparklesIcon, 
  ArrowPathIcon, 
  ChatBubbleBottomCenterTextIcon,
  QueueListIcon,
  BoltIcon, 
  QuestionMarkCircleIcon, 
  ArrowLongRightIcon, 
  ArchiveBoxIcon, 
  ArrowLeftIcon, 
  DocumentArrowDownIcon,
  ClipboardIcon,
  CheckIcon,
  CommandLineIcon,
  CodeBracketIcon,
  EyeIcon,
  EyeSlashIcon
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

const MermaidDiagram: React.FC<{ definition: string; onRendered?: (svg: string) => void }> = ({ definition, onRendered }) => {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showRaw, setShowRaw] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setError(false);
    setSvg('');
    // Slight delay to allow DOM to clear before re-attempting render
    setTimeout(() => {
      setRefreshKey(prev => prev + 1);
      setIsRefreshing(false);
    }, 500);
  };

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(definition);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      <div className="bg-slate-900/50 rounded-[2rem] p-8 border border-rose-500/20 flex flex-col items-center justify-center text-center min-h-[400px] relative overflow-hidden">
        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-4">
          <BoltIcon className="w-8 h-8 text-rose-500" />
        </div>
        <p className="text-rose-400 font-bold mb-6">Topology Rendering Interrupted</p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <button 
            onClick={handleRefresh}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
          >
            <ArrowPathIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} /> {isRefreshing ? 'Re-syncing...' : 'Force Re-sync'}
          </button>
          <button 
            onClick={() => setShowRaw(!showRaw)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-black uppercase tracking-widest border border-white/10 transition-all"
          >
            {showRaw ? <EyeSlashIcon className="w-4 h-4" /> : <CodeBracketIcon className="w-4 h-4" />}
            {showRaw ? 'Hide Definition' : 'View Source'}
          </button>
        </div>

        {showRaw && (
          <div className="mt-8 w-full animate-fadeIn">
            <div className="flex justify-between items-center mb-2 px-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mermaid Specification</span>
              <button onClick={handleCopyRaw} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-bold">
                {copied ? <CheckIcon className="w-3 h-3" /> : <ClipboardIcon className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy Logic'}
              </button>
            </div>
            <textarea 
              readOnly 
              value={definition}
              className="w-full h-32 bg-black/40 border border-white/5 rounded-xl p-4 text-[11px] font-mono text-slate-400 outline-none resize-none"
            />
            <p className="mt-2 text-[10px] text-slate-500 leading-relaxed italic">
              Tip: You can paste this code into the <a href="https://mermaid.live" target="_blank" className="text-indigo-400 underline">Mermaid Live Editor</a> to visualize it manually.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative group/diagram" id="diagram-container">
      <div className="absolute top-4 right-4 z-20 opacity-0 group-hover/diagram:opacity-100 transition-opacity flex gap-2">
        <button 
          onClick={() => setShowRaw(!showRaw)}
          title="Toggle Source Code"
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-md border border-white/10 text-slate-400 hover:text-white transition-all"
        >
          {showRaw ? <EyeSlashIcon className="w-4 h-4" /> : <CodeBracketIcon className="w-4 h-4" />}
        </button>
        <button 
          onClick={handleRefresh}
          title="Refresh Rendering"
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-md border border-white/10 text-slate-400 hover:text-white transition-all"
        >
          <ArrowPathIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {showRaw ? (
        <div className="bg-slate-900/50 rounded-[2rem] p-8 border border-white/5 min-h-[400px] flex flex-col animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
             <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Mermaid Source Definition</h5>
             <button onClick={handleCopyRaw} className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1">
                {copied ? <CheckIcon className="w-3 h-3" /> : <ClipboardIcon className="w-3 h-3" />}
                {copied ? 'Success' : 'Copy'}
             </button>
          </div>
          <pre className="flex-1 bg-black/30 p-6 rounded-2xl text-[12px] font-mono text-slate-300 overflow-auto whitespace-pre-wrap leading-relaxed">
            <code>{definition}</code>
          </pre>
        </div>
      ) : (
        <div 
          className="bg-slate-900/50 rounded-[2rem] p-8 border border-white/5 overflow-x-auto min-h-[400px] flex items-center justify-center shadow-inner transition-all"
          dangerouslySetInnerHTML={{ __html: svg || '<div class="animate-pulse flex flex-col items-center space-y-4"><div class="rounded-full bg-slate-800 h-12 w-12"></div><div class="h-2 bg-slate-800 rounded w-32"></div></div>' }}
        />
      )}
    </div>
  );
};

const MiniCodeSnippet: React.FC<{ snippet: { title: string; language: string; code: string } }> = ({ snippet }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-black/60 rounded-2xl border border-white/10 overflow-hidden group/code shadow-2xl">
      <div className="px-5 py-3 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <span className="text-[11px] font-bold text-slate-200 uppercase tracking-widest">{snippet.title}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 uppercase tracking-tighter">
            {snippet.language}
          </span>
          <button 
            onClick={handleCopy} 
            className="text-slate-500 hover:text-white transition-colors p-1 hover:bg-white/5 rounded"
            title="Copy Code"
          >
            {copied ? <CheckIcon className="w-4 h-4 text-emerald-400" /> : <ClipboardIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <div className="relative">
        <pre className="p-6 overflow-x-auto text-[12px] font-mono leading-relaxed text-slate-300 custom-scrollbar whitespace-pre">
          <code>{snippet.code}</code>
        </pre>
        <div className="absolute bottom-2 right-4 opacity-0 group-hover/code:opacity-100 transition-opacity">
           <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Read-Only Blueprint</span>
        </div>
      </div>
    </div>
  );
};

const ServiceMatcher: React.FC = () => {
  const [mode, setMode] = useState<MatchMode>('conversational');
  const [scenario, setScenario] = useState('');
  const [brief, setBrief] = useState<Brief>({ workload: '', traffic: '', latency: '', persistence: '', security: '' });
  const [result, setResult] = useState<ScenarioMatch | null>(null);
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [history, setHistory] = useState<SavedMatch[]>([]);

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

  const handleDownloadReport = async () => {
    if (!result) return;
    setIsExporting(true);

    let diagramImageUrl = '';
    try {
      const svgElement = document.querySelector('#diagram-container svg') as SVGSVGElement;
      if (svgElement) {
        const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
        clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        
        const styles = Array.from(document.querySelectorAll('style')).map(style => style.innerHTML).join('\n');
        const styleElement = document.createElementNS('http://www.w3.org/2000/svg', 'style');
        styleElement.textContent = styles;
        clonedSvg.prepend(styleElement);

        const svgData = new XMLSerializer().serializeToString(clonedSvg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        const scale = 2;
        const rect = svgElement.getBBox();
        canvas.width = (rect.width + 40) * scale;
        canvas.height = (rect.height + 40) * scale;
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        await new Promise((resolve, reject) => {
          img.onload = () => {
            if (ctx) {
              ctx.fillStyle = '#1e293b'; 
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.scale(scale, scale);
              ctx.drawImage(img, 20, 20);
            }
            diagramImageUrl = canvas.toDataURL('image/png');
            resolve(null);
          };
          img.onerror = reject;
          img.src = url;
        });
        URL.revokeObjectURL(url);
      }
    } catch (err) { console.error(err); }

    const dateStr = new Date().toLocaleDateString();
    const htmlContent = `
      <html>
      <head><meta charset="utf-8"><title>AWS Architecture Design Record</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.5; color: #1e293b; max-width: 800px; margin: 0 auto; padding: 40px; }
        .header { border-bottom: 3px solid #2563eb; padding-bottom: 10px; margin-bottom: 30px; }
        .title { font-size: 26pt; font-weight: bold; color: #1e3a8a; margin: 0; }
        .section { margin-top: 25px; margin-bottom: 25px; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; }
        .hero-recommendation { font-size: 20pt; font-weight: 800; color: #1e293b; background: #f1f5f9; padding: 20px; text-align: center; border-radius: 8px; margin: 10px 0; border: 1px solid #cbd5e1; }
        .diagram-wrap { background: #1e293b; border-radius: 8px; padding: 20px; text-align: center; }
      </style>
      </head>
      <body>
        <div class="header"><h1 class="title">Architectural Decision Record</h1><p>Date: ${dateStr}</p></div>
        <div class="section"><h2>I. Recommendation</h2><div class="hero-recommendation">${result.recommendedService}</div><p>${result.justification}</p></div>
        <div class="section"><h2>II. Topology</h2><div class="diagram-wrap">${diagramImageUrl ? `<img src="${diagramImageUrl}" width="100%" />` : '[Visual Capture Failed]'}</div></div>
        <div class="section"><h2>III. Roadmap</h2>${result.implementationSteps.map((s, i) => `<p><strong>Phase ${i+1}: ${s.phase}</strong><br/>${s.details}</p>`).join('')}</div>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AWS-Board-Report-${result.recommendedService.replace(/\s+/g, '-')}.doc`;
    link.click();
    setIsExporting(false);
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
    } catch (error) { alert("Architecture design failed."); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fadeIn pb-24">
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
              <textarea value={scenario} onChange={(e) => setScenario(e.target.value)} placeholder="Pitch your system requirement to the board..." className="w-full bg-black/30 border border-white/10 rounded-3xl p-8 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 min-h-[220px] transition-all text-xl" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <input value={brief.workload} onChange={(e) => setBrief({...brief, workload: e.target.value})} placeholder="Primary objective" className="md:col-span-2 w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-lg" />
                <input value={brief.traffic} onChange={(e) => setBrief({...brief, traffic: e.target.value})} placeholder="Throughput needs" className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-slate-600" />
                <input value={brief.latency} onChange={(e) => setBrief({...brief, latency: e.target.value})} placeholder="Latency SLA" className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-slate-600" />
                <input value={brief.persistence} onChange={(e) => setBrief({...brief, persistence: e.target.value})} placeholder="Database Strategy" className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-slate-600" />
                <input value={brief.security} onChange={(e) => setBrief({...brief, security: e.target.value})} placeholder="Security Posture" className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-slate-600" />
              </div>
            )}
            <div className="flex justify-end">
              <button type="submit" disabled={loading} className="flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-[2rem] font-black text-lg transition-all disabled:opacity-50">
                {loading ? <>Analyzing Architecture <ArrowPathIcon className="w-7 h-7 animate-spin" /></> : <>Consult the Board <SparklesIcon className="w-7 h-7" /></>}
              </button>
            </div>
          </form>
        </div>
      )}

      {mode === 'history' && !result && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {history.map((item) => (
            <button key={item.id} onClick={() => setResult(item.match)} className="glass group p-8 rounded-[2.5rem] border border-white/5 hover:border-indigo-500/40 transition-all text-left flex flex-col h-full relative overflow-hidden">
              <h4 className="text-xl font-black text-white mb-4 leading-tight">{item.match.recommendedService}</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-3 mb-8 flex-grow italic">"{item.prompt}"</p>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400">Recall Analysis <ArrowLongRightIcon className="w-4 h-4" /></div>
            </button>
          ))}
        </div>
      )}

      {result && (
        <div className="space-y-12 animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <button onClick={() => setResult(null)} className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors group">
              <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Workspace
            </button>
            <button onClick={handleDownloadReport} disabled={isExporting} className="flex items-center gap-3 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg disabled:opacity-50">
              {isExporting ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <DocumentArrowDownIcon className="w-5 h-5" />} Export Board Briefing
            </button>
          </div>

          <div className="glass p-12 rounded-[4rem] border border-emerald-500/20 bg-emerald-500/[0.02] relative overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-16 relative z-10">
              <div className="flex-1 space-y-10">
                <div><h4 className="text-xs font-black text-emerald-400 uppercase tracking-[0.4em] mb-6">Master Recommendation</h4><p className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-8">{result.recommendedService}</p></div>
                <div className="space-y-4"><h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.4em]">Architectural Justification</h4><p className="text-slate-300 leading-relaxed text-xl font-light italic border-l-[6px] border-blue-500/30 pl-8 py-2">{result.justification}</p></div>
              </div>
              <div className="w-full lg:w-1/2 space-y-6">
                 <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-4 text-center">System Topology</h4>
                 <MermaidDiagram definition={result.mermaidDiagram} />
              </div>
            </div>
          </div>

          <div className="glass p-12 rounded-[4rem] border border-indigo-500/20">
            <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em] mb-12 text-center">Implementation Roadmap</h4>
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
    } catch (err) { alert("Detailed consult failed."); } finally { setLoading(false); }
  };

  return (
    <div className="relative flex flex-col md:flex-row gap-8 items-start group">
      <div className="hidden md:flex w-16 h-16 rounded-2xl bg-slate-900 border border-indigo-500/40 items-center justify-center z-10 shrink-0 group-hover:bg-indigo-600 transition-all">
        <span className="text-xl font-black text-white">{index + 1}</span>
      </div>
      <div className="flex-1 space-y-4">
        <div className="bg-white/5 border border-white/5 rounded-3xl p-8 group-hover:bg-white/10 transition-all">
          <h5 className="text-xl font-bold text-indigo-300 mb-3">{phase}</h5>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">{details}</p>
          <button onClick={handleDeepDive} disabled={loading} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 disabled:opacity-50">
            {loading ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : isOpen ? <>Hide Review <BoltIcon className="w-4 h-4" /></> : <>Consult Architect <QuestionMarkCircleIcon className="w-4 h-4" /></>}
          </button>
        </div>
        {isOpen && explanation && (
          <div className="animate-fadeIn p-8 bg-blue-500/5 rounded-3xl border border-blue-500/20 space-y-10">
            <div>
              <h6 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Tactical Explanation</h6>
              <p className="text-slate-300 text-sm leading-relaxed italic">{explanation.explanation}</p>
            </div>

            {explanation.codeSnippets && explanation.codeSnippets.length > 0 && (
              <div className="space-y-6">
                <h6 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Developer Execution Blueprint (Sample Code)</h6>
                <div className="grid grid-cols-1 gap-6">
                  {explanation.codeSnippets.map((snippet, sIdx) => (
                    <MiniCodeSnippet key={sIdx} snippet={snippet} />
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4 text-xs">
                <h6 className="font-black text-indigo-400 uppercase">Core Terms</h6>
                {explanation.keyTerms.map((item, idx) => <div key={idx} className="bg-black/20 p-3 rounded-lg"><p className="text-white font-bold">{item.term}</p><p className="text-slate-400">{item.definition}</p></div>)}
              </div>
              <div className="space-y-4 text-xs">
                <h6 className="font-black text-emerald-400 uppercase">External Specs</h6>
                {explanation.documentationLinks.map((link, idx) => <a key={idx} href={link.url} target="_blank" className="flex items-center justify-between p-3 bg-emerald-500/5 rounded-lg text-slate-300 hover:bg-emerald-500/10"><span className="truncate">{link.title}</span><ArrowLongRightIcon className="w-4 h-4" /></a>)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceMatcher;
