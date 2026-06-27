import { CONCERN_LABELS, CONCERN_COLORS } from '../utils/scoring.js';

export default function DomainResult({ domainScore, icon }) {
  const colorClasses = CONCERN_COLORS[domainScore.level];
  const percentage = Math.round(domainScore.score * 100);
  return (
    <div className={`rounded-xl border p-5 ${colorClasses}`}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <h3 className="font-semibold text-lg">{domainScore.name}</h3>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm">{CONCERN_LABELS[domainScore.level]}</span>
        <span className="text-sm opacity-75">Score: {percentage}%</span>
      </div>
      <div className="mt-3 w-full bg-white/50 rounded-full h-2">
        <div className="h-2 rounded-full bg-current opacity-60 transition-all" style={{ width: percentage + '%' }} />
      </div>
    </div>
  );
}
