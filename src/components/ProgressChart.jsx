import { CONCERN_LABELS, CONCERN_LEVELS } from '../utils/scoring.js';
import { domains } from '../data/questions.js';

const levelColors = { [CONCERN_LEVELS.NONE]: 'bg-green-400', [CONCERN_LEVELS.MILD]: 'bg-yellow-400', [CONCERN_LEVELS.MODERATE]: 'bg-orange-400', [CONCERN_LEVELS.SIGNIFICANT]: 'bg-red-400' };

export default function ProgressChart({ assessments }) {
  if (!assessments || assessments.length === 0) return <p className="text-slate-500 text-center py-8">No assessment data available yet.</p>;
  return (
    <div className="space-y-6">
      {domains.map(domain => {
        const domainData = assessments.map(a => { const ds = a.domainScores.find(s => s.domainId === domain.id); return ds || { score: 0, level: CONCERN_LEVELS.NONE }; });
        return (
          <div key={domain.id} className="bg-white rounded-xl border border-slate-200 p-4">
            <h4 className="font-medium text-slate-700 mb-3 flex items-center gap-2"><span>{domain.icon}</span> {domain.name}</h4>
            <div className="flex items-end gap-2 h-20">
              {domainData.map((data, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className={`w-full max-w-12 rounded-t ${levelColors[data.level]} transition-all`} style={{ height: Math.max(data.score * 100, 5) + '%' }} />
                  <span className="text-[10px] text-slate-400 mt-1">#{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
