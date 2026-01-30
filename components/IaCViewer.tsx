
import React, { useState } from 'react';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';

interface IaCViewerProps {
  code: string;
}

const IaCViewer: React.FC<IaCViewerProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="absolute right-4 top-4 z-10">
        <button
          onClick={handleCopy}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-slate-400 hover:text-white transition-all backdrop-blur-md border border-white/10"
        >
          {copied ? <CheckIcon className="w-5 h-5 text-emerald-400" /> : <ClipboardIcon className="w-5 h-5" />}
        </button>
      </div>
      
      <div className="bg-[#0b0e14] rounded-2xl p-6 overflow-x-auto border border-white/5">
        <pre className="text-sm font-mono leading-relaxed">
          <code>
            {code.split('\n').map((line, i) => (
              <div key={i} className="flex">
                <span className="w-10 text-slate-600 select-none text-right pr-4">{i + 1}</span>
                <span className={`
                  ${line.trim().startsWith('#') ? 'text-slate-500 italic' : ''}
                  ${line.includes(':') ? 'text-blue-400' : 'text-slate-300'}
                  ${line.trim().startsWith('AWS::') || line.trim().startsWith('!Ref') ? 'text-orange-400' : ''}
                `}>
                  {line}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default IaCViewer;
