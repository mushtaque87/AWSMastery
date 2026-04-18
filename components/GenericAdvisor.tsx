
import React, { useState, useEffect, useRef } from 'react';
import { 
  SparklesIcon, 
  ArrowPathIcon, 
  GlobeAltIcon, 
  CpuChipIcon, 
  BeakerIcon,
  CloudIcon,
  CheckCircleIcon,
  CodeBracketIcon,
  LightBulbIcon,
  Square3Stack3DIcon
} from '@heroicons/react/24/solid';
import { designGenericArchitecture, mapToCloudProvider } from '../services/gemini';
import { GenericArchitecture, CloudMapping } from '../types';
import IaCViewer from './IaCViewer';
import MermaidDiagram from './MermaidDiagram';

const GenericAdvisor: React.FC = () => {
  const [scenario, setScenario] = useState('');
  const [genericDesign, setGenericDesign] = useState<GenericArchitecture | null>(null);
  const [cloudMapping, setCloudMapping] = useState<CloudMapping | null>(null);
  const [loading, setLoading] = useState(false);
  const [mappingLoading, setMappingLoading] = useState(false);

  const handleDesign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenario.trim()) return;
    
    setLoading(true);
    setGenericDesign(null);
    setCloudMapping(null);
    try {
      const design = await designGenericArchitecture(scenario);
      setGenericDesign(design);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMapProvider = async (provider: 'AWS' | 'Azure' | 'GCP') => {
    if (!genericDesign) return;
    
    setMappingLoading(true);
    try {
      const mapping = await mapToCloudProvider(genericDesign, provider);
      setCloudMapping(mapping);
    } catch (error) {
      console.error(error);
    } finally {
      setMappingLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fadeIn pb-24">
      {/* Search Section */}
      <div className="glass p-10 rounded-[3rem] border border-blue-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <GlobeAltIcon className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Cloud-Agnostic Design Engine</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Agnostic Strategy First, Cloud Native Second</p>
            </div>
          </div>
          
          <p className="text-slate-400 mb-8 text-lg leading-relaxed">
            Enter your problem scenario. We'll design a pure architecture solution using generic concepts and best-in-class industry tools, independent of cloud lock-in.
          </p>

          <form onSubmit={handleDesign} className="space-y-6">
            <textarea
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              placeholder="Example: I need a high-frequency trading platform with sub-millisecond latency, persistent storage for audit logs, and a real-time analytics dashboard..."
              className="w-full bg-black/30 border border-white/10 rounded-2xl p-6 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[140px] transition-all text-lg leading-relaxed"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !scenario.trim()}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white px-10 py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 font-black flex items-center gap-3 text-lg"
              >
                {loading ? (
                  <>Architecting Solution <ArrowPathIcon className="w-6 h-6 animate-spin" /></>
                ) : (
                  <>Generate Agnostic Design <SparklesIcon className="w-6 h-6 text-amber-400" /></>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {genericDesign && (
        <div className="space-y-16 animate-fadeIn">
          {/* Solution Overview */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <header>
                <h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.4em] mb-4">Strategic Framework</h4>
                <h1 className="text-4xl font-black text-white tracking-tighter leading-tight mb-6">
                  {genericDesign.solutionName}
                </h1>
                <p className="text-slate-300 text-lg leading-relaxed font-light italic border-l-4 border-blue-500/30 pl-6 py-2">
                  "{genericDesign.conceptJustification}"
                </p>
              </header>

              <div className="space-y-6">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Agnostic Component Stack</h4>
                <div className="grid grid-cols-1 gap-4">
                  {genericDesign.genericComponents.map((comp, idx) => (
                    <div key={idx} className="glass p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-6 hover:border-blue-500/30 transition-all group">
                      <div className="w-full md:w-32 shrink-0">
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">{comp.category}</span>
                        <h5 className="text-white font-bold text-sm leading-tight">{comp.bestFitType}</h5>
                      </div>
                      <div className="flex-1 space-y-3">
                        <p className="text-slate-400 text-xs leading-relaxed">{comp.purpose}</p>
                        <div className="flex flex-wrap gap-2">
                          {comp.marketPreferredTools.map(tool => (
                            <span key={tool} className="px-2 py-0.5 bg-white/5 rounded text-[10px] font-bold text-slate-300 border border-white/10 uppercase tracking-tighter">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest text-center">Conceptual Topology</h4>
              <div className="glass p-8 rounded-[3rem] border border-white/5 bg-black/20 min-h-[400px] flex items-center justify-center">
                <MermaidDiagram definition={genericDesign.mermaidDiagram} />
              </div>
            </div>
          </section>

          {/* Cloud Mapping Trigger */}
          <section className="glass p-12 rounded-[4rem] border border-indigo-500/20 bg-indigo-500/[0.02] text-center space-y-10">
            <div className="max-w-2xl mx-auto space-y-4">
              <h3 className="text-2xl font-bold text-white">Ready for Implementation?</h3>
              <p className="text-slate-400 leading-relaxed">
                Select your preferred cloud provider to see how this agnostic architecture maps to native services and infrastructure automation.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              <button 
                onClick={() => handleMapProvider('AWS')}
                disabled={mappingLoading}
                className="flex items-center gap-3 px-8 py-4 bg-orange-600/10 hover:bg-orange-600/20 text-orange-400 border border-orange-500/30 rounded-2xl font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50"
              >
                <CloudIcon className="w-5 h-5" /> AWS Blueprint
              </button>
              <button 
                onClick={() => handleMapProvider('Azure')}
                disabled={mappingLoading}
                className="flex items-center gap-3 px-8 py-4 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-2xl font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50"
              >
                <Square3Stack3DIcon className="w-5 h-5" /> Azure Blueprint
              </button>
              <button 
                onClick={() => handleMapProvider('GCP')}
                disabled={mappingLoading}
                className="flex items-center gap-3 px-8 py-4 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/30 rounded-2xl font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50"
              >
                <BeakerIcon className="w-5 h-5" /> GCP Blueprint
              </button>
            </div>

            {mappingLoading && (
              <div className="flex items-center justify-center gap-3 text-indigo-400 animate-pulse">
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                <span className="text-xs font-black uppercase tracking-widest">Translating to Provider Primitive...</span>
              </div>
            )}
          </section>

          {/* Mapping Results */}
          {cloudMapping && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-fadeInUp">
              <div className="lg:col-span-1 space-y-8">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    cloudMapping.provider === 'AWS' ? 'bg-orange-600/20 text-orange-400' :
                    cloudMapping.provider === 'Azure' ? 'bg-blue-600/20 text-blue-400' :
                    'bg-red-600/20 text-red-400'
                  }`}>
                    <CpuChipIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{cloudMapping.provider} Service Mapping</h3>
                </div>

                <div className="space-y-4">
                  {cloudMapping.serviceMap.map((map, i) => (
                    <div key={i} className="glass p-5 rounded-xl border border-white/5 space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-500">{map.genericPath}</span>
                        <span className="text-emerald-400">Mapped</span>
                      </div>
                      <h5 className="text-white font-bold">{map.targetService}</h5>
                      <p className="text-[10px] text-slate-400 italic">"{map.specificBenefit}"</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-2">
                  <CodeBracketIcon className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Native Cloud Provisioning (IaC)</h3>
                </div>
                <div className="h-[500px] overflow-hidden rounded-[2.5rem] border border-white/5 shadow-2xl">
                  <IaCViewer code={cloudMapping.iascSnippet} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GenericAdvisor;
