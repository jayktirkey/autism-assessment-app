import { getLatestAssessment, getAssessments } from '../utils/storage.js';
import { CONCERN_LEVELS, CONCERN_LABELS } from '../utils/scoring.js';
import { getAdjustedActivities, getActivitiesForDomain } from '../data/activities.js';
import { domains } from '../data/questions.js';
import ActivityCard from '../components/ActivityCard.jsx';
import PrintableReport from '../components/PrintableReport.jsx';

export default function Activities({ navigate }) {
  const latest = getLatestAssessment();
  const allAssessments = getAssessments();
  if (!latest) return (<div className="text-center py-12"><p className="text-slate-500 mb-4">Complete an assessment to get activity recommendations.</p><button onClick={() => navigate('assessment')} className="bg-teal-600 text-white px-6 py-3 rounded-xl font-medium">Start Assessment</button></div>);

  const previous = allAssessments.length > 1 ? allAssessments[allAssessments.length - 2] : null;
  const domainActivities = latest.domainScores.filter(ds => ds.level !== CONCERN_LEVELS.NONE).map(ds => {
    const domain = domains.find(d => d.id === ds.domainId);
    const prevScore = previous ? previous.domainScores.find(p => p.domainId === ds.domainId) : null;
    const acts = prevScore ? getAdjustedActivities(ds.domainId, ds.level, prevScore.level) : getActivitiesForDomain(ds.domainId, ds.level);
    return { domain, domainScore: ds, activities: acts };
  });
  const allActivitiesFlat = domainActivities.flatMap(d => d.activities);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-6"><h2 className="text-2xl font-bold text-slate-800 mb-2">Activity Recommendations</h2><p className="text-slate-600 text-sm">Tailored activities based on your child's profile.{previous && ' Adjusted based on progress.'}</p></div>
      {domainActivities.length === 0 ? (
        <div className="text-center py-8 bg-green-50 rounded-xl border border-green-200"><span className="text-4xl mb-3 block">🎉</span><p className="text-green-700 font-medium">No areas of concern identified!</p><p className="text-green-600 text-sm mt-2">Continue enriching your child's environment with varied play and social opportunities.</p></div>
      ) : (
        <div className="space-y-8">{domainActivities.map(({ domain, domainScore, activities }) => (
          <div key={domainScore.domainId}>
            <div className="flex items-center gap-3 mb-4"><span className="text-2xl">{domain?.icon}</span><div><h3 className="font-semibold text-slate-800">{domain?.name}</h3><span className="text-xs text-slate-500">{CONCERN_LABELS[domainScore.level]}</span></div></div>
            <div className="grid gap-4 sm:grid-cols-2">{activities.map((activity, idx) => (<ActivityCard key={idx} activity={activity} />))}</div>
          </div>
        ))}</div>
      )}
      <div className="mt-8 flex justify-center"><button onClick={() => window.print()} className="bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-medium transition-all">Print Activity Plan</button></div>
      <PrintableReport assessment={latest} activities={allActivitiesFlat} />
    </div>
  );
}
