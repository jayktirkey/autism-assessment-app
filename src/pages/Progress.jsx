import { getAssessments, clearAssessments } from '../utils/storage.js';
import { CONCERN_LABELS } from '../utils/scoring.js';
import { domains } from '../data/questions.js';
import ProgressChart from '../components/ProgressChart.jsx';
import { useState } from 'react';

export default function Progress({ navigate }) {
  const [assessments, setAssessments] = useState(getAssessments());
  const [showConfirm, setShowConfirm] = useState(false);
  if (assessments.length === 0) return (<div className="text-center py-12"><p className="text-slate-500 mb-4">No assessment history available.</p><button onClick={() => navigate('assessment')} className="bg-teal-600 text-white px-6 py-3 rounded-xl font-medium">Start First Assessment</button></div>);

  function handleClear() { clearAssessments(); setAssessments([]); setShowConfirm(false); }
  const latest = assessments[assessments.length - 1];
  const previous = assessments.length > 1 ? assessments[assessments.length - 2] : null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-6"><h2 className="text-2xl font-bold text-slate-800 mb-2">Progress Tracking</h2><p className="text-slate-600 text-sm">{assessments.length} assessment{assessments.length !== 1 ? 's' : ''} recorded</p></div>
      {previous && (
        <div className="bg-slate-50 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-slate-700 mb-3">Changes Since Last Assessment</h3>
          <div className="space-y-2">{latest.domainScores.map(ds => {
            const prevDs = previous.domainScores.find(p => p.domainId === ds.domainId);
            const domain = domains.find(d => d.id === ds.domainId);
            const improved = prevDs && ds.score < prevDs.score;
            const worsened = prevDs && ds.score > prevDs.score;
            return (<div key={ds.domainId} className="flex items-center justify-between py-2 border-b border-slate-200 last:border-0"><div className="flex items-center gap-2"><span>{domain?.icon}</span><span className="text-sm text-slate-700">{domain?.name}</span></div><div className="flex items-center gap-2">{improved && <span className="text-green-600 text-sm font-medium">Improved</span>}{worsened && <span className="text-orange-600 text-sm font-medium">Needs attention</span>}{!improved && !worsened && <span className="text-slate-400 text-sm">No change</span>}<span className="text-xs text-slate-500">{CONCERN_LABELS[ds.level]}</span></div></div>);
          })}</div>
        </div>
      )}
      <ProgressChart assessments={assessments} />
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <button onClick={() => navigate('assessment')} className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-medium shadow-md transition-all">New Assessment</button>
        {!showConfirm ? (<button onClick={() => setShowConfirm(true)} className="bg-white border-2 border-red-200 hover:border-red-300 text-red-600 px-6 py-3 rounded-xl font-medium transition-all">Clear History</button>) : (<div className="flex gap-2"><button onClick={handleClear} className="bg-red-600 text-white px-4 py-3 rounded-xl font-medium">Confirm Clear</button><button onClick={() => setShowConfirm(false)} className="bg-slate-200 text-slate-700 px-4 py-3 rounded-xl font-medium">Cancel</button></div>)}
      </div>
    </div>
  );
}
