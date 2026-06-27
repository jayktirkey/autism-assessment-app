import { CONCERN_LABELS } from '../utils/scoring.js';
import { domains } from '../data/questions.js';

export default function PrintableReport({ assessment, activities }) {
  if (!assessment) return null;
  const date = new Date(assessment.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <div className="print-report hidden print:block p-8">
      <h1 className="text-2xl font-bold text-center mb-2">Developmental Screening Report</h1>
      <p className="text-center text-sm text-slate-500 mb-6">Assessment Date: {date}</p>
      <div className="border-t pt-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Domain Results</h2>
        <table className="w-full text-sm">
          <thead><tr className="border-b"><th className="text-left py-2">Domain</th><th className="text-left py-2">Concern Level</th><th className="text-left py-2">Score</th></tr></thead>
          <tbody>{assessment.domainScores.map(ds => { const domain = domains.find(d => d.id === ds.domainId); return (<tr key={ds.domainId} className="border-b"><td className="py-2">{domain?.name || ds.domainId}</td><td className="py-2">{CONCERN_LABELS[ds.level]}</td><td className="py-2">{Math.round(ds.score * 100)}%</td></tr>); })}</tbody>
        </table>
      </div>
      {activities && activities.length > 0 && (
        <div className="border-t pt-4"><h2 className="text-lg font-semibold mb-3">Recommended Activities</h2>
          {activities.map((act, idx) => (<div key={idx} className="mb-3 pb-3 border-b last:border-0"><h4 className="font-medium">{act.title}</h4><p className="text-sm text-slate-600">{act.description}</p><p className="text-xs text-slate-500 mt-1">{act.frequency} | {act.duration}</p></div>))}
        </div>
      )}
      <div className="border-t pt-4 mt-6 text-xs text-slate-500"><p className="italic">Disclaimer: This is a screening tool only. Please consult a qualified healthcare professional.</p></div>
    </div>
  );
}
