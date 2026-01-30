
import React, { useState } from 'react';
import { PaperAirplaneIcon, SparklesIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { matchAWSService } from '../services/gemini';
import { ScenarioMatch } from '../types';

const ServiceMatcher: React.FC = () => {
  const [scenario, setScenario] = useState('');
  const [result, setResult] = useState<ScenarioMatch | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenario.trim()) return;
    
    setLoading(true);
    setResult(null);
    try {
      const match = await matchAWSService(scenario);
      setResult(match);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="glass p-10 rounded-[2.5rem] border border-blue-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <SparklesIcon className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">AI Service Matcher</h2>
          </div>
          
          <p className="text-slate-400 mb-8 text-lg">
            Describe your business requirement or technical bottleneck. Our Lead Architect AI will recommend the 2026-standard AWS service.
          </p>

          <form onSubmit={handleSubmit} className="relative mb-6">
            <textarea
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              placeholder="e.g., I need a global database with sub-millisecond latency for real-time gaming state..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[140px] resize-none transition-all"
            />
            <button
              type="submit"
              disabled={loading || !scenario.trim()}
              className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white p-3 rounded-xl transition-all shadow-lg shadow-blue-600/20"
            >
              {loading ? (
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
              ) : (
                <PaperAirplaneIcon className="w-5 h-5" />
              )}
            </button>
          </form>

          <div className="flex gap-4">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Recommended Samples:</p>
            <button 
              onClick={() => setScenario("I need to run microservices without managing servers, but I need strict hardware isolation.")}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Hardware Isolation
            </button>
            <button 
              onClick={() => setScenario("I need a data lake that automatically categorizes metadata and handles PII scrubbing.")}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Data Lake Metadata
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div className="glass p-10 rounded-[2.5rem] border border-emerald-500/20 animate-fadeIn bg-emerald-500/[0.02]">
          <div className="flex flex-col md:flex-row gap-10">
            <div className="flex-1">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">Recommended Service</h4>
              <p className="text-4xl font-extrabold text-white mb-6 tracking-tight">{result.recommendedService}</p>
              
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Architect's Justification</h4>
              <p className="text-slate-300 leading-relaxed text-lg mb-8">
                {result.justification}
              </p>

              {result.alternatives && result.alternatives.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Alternative Considerations</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.alternatives.map(alt => (
                      <span key={alt} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-400">
                        {alt}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="w-full md:w-64 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-white/10 pt-10 md:pt-0 md:pl-10">
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                <SparklesIcon className="w-10 h-10 text-blue-400" />
              </div>
              <p className="text-center text-sm font-medium text-slate-400">This recommendation is based on AWS 2026 Best Practices</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceMatcher;
