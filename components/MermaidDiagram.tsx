
import React, { useState, useEffect } from 'react';
import { 
  ArrowPathIcon, 
  BoltIcon, 
  CodeBracketIcon, 
  EyeSlashIcon,
  ClipboardIcon,
  CheckIcon
} from '@heroicons/react/24/solid';

declare global {
  interface Window {
    mermaid: any;
  }
}

interface MermaidDiagramProps {
  definition: string;
  onRendered?: (svg: string) => void;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ definition, onRendered }) => {
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
      <div className="bg-slate-900/50 rounded-[2rem] p-8 border border-rose-500/20 flex flex-col items-center justify-center text-center min-h-[400px] w-full relative overflow-hidden">
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
              className="w-full h-32 bg-black/40 border border-white/5 rounded-xl p-4 text-[11px] font-mono text-slate-400 outline-none resize-none shadow-inner"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative group/diagram w-full flex justify-center" id="diagram-container">
      <div className="absolute top-4 right-4 z-20 opacity-0 group-hover/diagram:opacity-100 transition-opacity flex gap-2">
        <button 
          onClick={() => setShowRaw(!showRaw)}
          title="Toggle Source Code"
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-md border border-white/10 text-slate-400 hover:text-white transition-all shadow-xl"
        >
          {showRaw ? <EyeSlashIcon className="w-4 h-4" /> : <CodeBracketIcon className="w-4 h-4" />}
        </button>
        <button 
          onClick={handleRefresh}
          title="Refresh Rendering"
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-md border border-white/10 text-slate-400 hover:text-white transition-all shadow-xl"
        >
          <ArrowPathIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div 
        className={`w-full flex justify-center overflow-x-auto p-4 custom-scrollbar transition-all ${showRaw ? 'blur-sm grayscale opacity-30 select-none pointer-events-none' : ''}`}
        dangerouslySetInnerHTML={{ __html: svg }}
      />

      {showRaw && (
        <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 z-30 animate-fadeInUp">
          <div className="glass p-8 rounded-3xl border border-indigo-500/30 shadow-2xl bg-slate-950/80 backdrop-blur-xl">
             <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <CodeBracketIcon className="w-4 h-4 text-indigo-400" />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Source Specification</span>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={handleCopyRaw} className="text-[10px] uppercase tracking-widest font-black text-blue-400 hover:text-white transition-colors flex items-center gap-2">
                  {copied ? <CheckIcon className="w-3 h-3 text-emerald-400" /> : <ClipboardIcon className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button onClick={() => setShowRaw(false)} className="text-slate-500 hover:text-white">
                  <EyeSlashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            <textarea 
              readOnly 
              value={definition}
              className="w-full h-48 bg-black/60 border border-white/10 rounded-2xl p-6 text-[12px] font-mono text-indigo-100/70 outline-none resize-none custom-scrollbar"
            />
            <p className="mt-4 text-[10px] text-slate-500 text-center font-medium">
              Copy and paste this into <a href="https://mermaid.live" target="_blank" className="text-indigo-400 hover:underline">Mermaid Live Editor</a> for manual debugging.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MermaidDiagram;
