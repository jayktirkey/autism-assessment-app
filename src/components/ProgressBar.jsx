import { domains } from '../data/questions.js';

export default function ProgressBar({ currentDomainIndex }) {
  const total = domains.length;
  const percent = ((currentDomainIndex + 1) / total) * 100;
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between text-sm text-slate-600 mb-2">
        <span>Domain {currentDomainIndex + 1} of {total}</span>
        <span>{Math.round(percent)}% complete</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-3">
        <div className="bg-teal-500 h-3 rounded-full transition-all duration-300" style={{ width: percent + '%' }} />
      </div>
    </div>
  );
}
