
import React, { useState } from 'react';
import { ShieldCheckIcon, SparklesIcon, ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { reviewArchitecture } from '../services/gemini';
import { ArchitectureReview } from '../types';

const ArchitectureReviewer: React.FC = () => {
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<ArchitectureReview | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    
    setLoading(true);
    setResult(null);
    try {
      const review = await reviewArchitecture(description);
      setResult(review);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      <div className="glass p-10 rounded-[2.5rem] border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <ShieldCheckIcon className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Well-Architected AI Reviewer</h2>
          </div>
          
          <p className="text-slate-400 mb-8 text-lg leading-relaxed">
            Paste your current or proposed architecture description. Our Lead Solutions Architect AI will score it across the 6 pillars and identify single points of failure.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Example: My stack uses a single EC2 instance in us-east-1a running MySQL and Node.js. It connects to an S3 bucket with public access for images..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[160px] transition-all font-mono text-sm"
            />
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setDescription("Multi-region Lambda-based API using DynamoDB Global Tables, API Gateway with WAF, and CloudFront for CDN.")}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest font-bold"
                >
                  Load Serverless Template
                </button>
              </div>
              <button
                type="submit"
                disabled={loading || !description.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white px-8 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 font-bold flex items-center gap-2"
              >
                {loading ? (
                  <>Analyzing Stack <ArrowPathIcon className="w-5 h-5 animate-spin" /></>
                ) : (
                  <>Run Architecture Review <SparklesIcon className="w-5 h-5" /></>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Pillar Ratings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass p-8 rounded-[2rem] border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6">Pillar Performance</h3>
              <div className="space-y-6">
                {result.pillarRatings.map((rating, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-semibold text-slate-300">{rating.pillar}</span>
                      <span className="text-sm font-bold text-blue-400">{rating.rating}/10</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${rating.rating >= 8 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : rating.rating >= 5 ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'}`}
                        style={{ width: `${rating.rating * 10}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed italic">{rating.feedback}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass p-8 rounded-[2rem] border border-rose-500/20 bg-rose-500/[0.02]">
              <div className="flex items-center gap-3 mb-6">
                <ExclamationTriangleIcon className="w-6 h-6 text-rose-500" />
                <h3 className="text-xl font-bold text-white">Critical Fixes Needed</h3>
              </div>
              <ul className="space-y-4">
                {result.criticalFixes.map((fix, idx) => (
                  <li key={idx} className="flex gap-3 text-slate-300 text-sm leading-relaxed">
                    <span className="text-rose-500 font-bold">!</span>
                    {fix}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Cost Score & Metadata */}
          <div className="space-y-6">
            <div className="glass p-8 rounded-[2rem] border border-emerald-500/20 flex flex-col items-center justify-center text-center py-12">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">Cost Efficiency</h4>
              <div className="text-6xl font-black text-white mb-4">{result.costOptimizationScore}</div>
              <p className="text-sm text-slate-400">Projected savings potential compared to legacy architectures.</p>
            </div>

            <div className="glass p-8 rounded-[2rem] border border-white/10">
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Recommendation Level</h4>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-white text-sm font-bold mb-1">Architecture Maturity</p>
                  <p className="text-xs text-slate-400">Enterprise Grade 2026 Compliant</p>
                </div>
                <button 
                  onClick={() => {setResult(null); setDescription('');}}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all"
                >
                  Start New Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchitectureReviewer;
