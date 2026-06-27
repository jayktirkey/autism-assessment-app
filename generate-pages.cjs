const fs = require('fs');
const path = require('path');
function w(f,c){fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,c);console.log('Created:',f);}

w('src/pages/Home.jsx', `import Disclaimer from '../components/Disclaimer.jsx';
import { getLatestAssessment, getAssessments } from '../utils/storage.js';

export default function Home({ navigate }) {
  const latest = getLatestAssessment();
  const assessments = getAssessments();
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">Developmental Screening Tool</h1>
        <p className="text-slate-600 text-lg leading-relaxed">A comprehensive screening tool to help identify areas where your 4-year-old may benefit from additional support across 8 developmental domains.</p>
      </div>
      <Disclaimer />
      <div className="grid gap-4 mt-8">
        <button onClick={() => navigate('assessment')} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all text-lg">Start New Assessment</button>
        {latest && (<><button onClick={() => navigate('results')} className="w-full bg-white hover:bg-slate-50 text-teal-700 font-semibold py-4 px-6 rounded-xl border-2 border-teal-200 hover:border-teal-300 transition-all">View Latest Results</button><button onClick={() => navigate('activities')} className="w-full bg-white hover:bg-slate-50 text-teal-700 font-semibold py-4 px-6 rounded-xl border-2 border-teal-200 hover:border-teal-300 transition-all">Activity Recommendations</button></>)}
        {assessments.length > 1 && (<button onClick={() => navigate('progress')} className="w-full bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 px-6 rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all">View Progress ({assessments.length} assessments)</button>)}
      </div>
      <div className="mt-12 bg-slate-50 rounded-xl p-6">
        <h3 className="font-semibold text-slate-700 mb-3">What This Tool Covers</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
          <li className="flex items-center gap-2"><span>\\u{1F44B}</span> Social Interaction & Communication</li>
          <li className="flex items-center gap-2"><span>\\u{1F504}</span> Repetitive Behaviors & Interests</li>
          <li className="flex items-center gap-2"><span>\\u{1F3A8}</span> Sensory Processing</li>
          <li className="flex items-center gap-2"><span>\\u{1F4AC}</span> Language Development</li>
          <li className="flex items-center gap-2"><span>\\u270B</span> Motor Skills (Fine & Gross)</li>
          <li className="flex items-center gap-2"><span>\\u{1F3E0}</span> Daily Living / Adaptive Skills</li>
          <li className="flex items-center gap-2"><span>\\u{1F9D8}</span> Emotional Regulation</li>
          <li className="flex items-center gap-2"><span>\\u{1F9F8}</span> Play Skills</li>
        </ul>
      </div>
    </div>
  );
}
`);

w('src/pages/Assessment.jsx', `import { useState } from 'react';
import { domains } from '../data/questions.js';
import { calculateAllDomainScores } from '../utils/scoring.js';
import { saveAssessment } from '../utils/storage.js';
import ProgressBar from '../components/ProgressBar.jsx';
import QuestionCard from '../components/QuestionCard.jsx';

export default function Assessment({ navigate }) {
  const [currentDomainIdx, setCurrentDomainIdx] = useState(0);
  const [responses, setResponses] = useState({});
  const currentDomain = domains[currentDomainIdx];
  const isLastDomain = currentDomainIdx === domains.length - 1;
  const allCurrentAnswered = currentDomain.questions.every(q => responses[q.id] !== undefined);

  function handleSelect(questionId, value) { setResponses(prev => ({ ...prev, [questionId]: value })); }
  function handleNext() {
    if (isLastDomain) { const domainScores = calculateAllDomainScores(responses); saveAssessment({ domainScores, responses }); navigate('results'); }
    else { setCurrentDomainIdx(prev => prev + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  }
  function handlePrevious() { if (currentDomainIdx > 0) { setCurrentDomainIdx(prev => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } }

  return (
    <div className="max-w-2xl mx-auto">
      <ProgressBar currentDomainIndex={currentDomainIdx} />
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2"><span className="text-3xl">{currentDomain.icon}</span><h2 className="text-2xl font-bold text-slate-800">{currentDomain.name}</h2></div>
        <p className="text-slate-600 text-sm">{currentDomain.description}</p>
      </div>
      <div className="space-y-4">{currentDomain.questions.map(question => (<QuestionCard key={question.id} question={question} selectedValue={responses[question.id]} onSelect={handleSelect} />))}</div>
      <div className="flex justify-between mt-8 gap-4">
        <button onClick={handlePrevious} disabled={currentDomainIdx === 0} className="px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-slate-200 hover:bg-slate-300 text-slate-700">Previous</button>
        <button onClick={handleNext} disabled={!allCurrentAnswered} className="px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-teal-600 hover:bg-teal-700 text-white shadow-md">{isLastDomain ? 'Complete Assessment' : 'Next Domain'}</button>
      </div>
      {!allCurrentAnswered && <p className="text-center text-sm text-slate-400 mt-3">Please answer all questions to continue.</p>}
    </div>
  );
}
`);

w('src/pages/Results.jsx', `import { getLatestAssessment } from '../utils/storage.js';
import { generateProfileSummary } from '../utils/scoring.js';
import { domains } from '../data/questions.js';
import DomainResult from '../components/DomainResult.jsx';
import Disclaimer from '../components/Disclaimer.jsx';
import PrintableReport from '../components/PrintableReport.jsx';

export default function Results({ navigate }) {
  const assessment = getLatestAssessment();
  if (!assessment) return (<div className="text-center py-12"><p className="text-slate-500 mb-4">No assessment results found.</p><button onClick={() => navigate('assessment')} className="bg-teal-600 text-white px-6 py-3 rounded-xl font-medium">Start Assessment</button></div>);
  const summary = generateProfileSummary(assessment.domainScores);
  const date = new Date(assessment.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6"><h2 className="text-2xl font-bold text-slate-800 mb-2">Assessment Results</h2><p className="text-sm text-slate-500">Completed: {date}</p></div>
      <div className="bg-slate-50 rounded-xl p-5 mb-6"><h3 className="font-semibold text-slate-700 mb-2">Summary</h3><p className="text-slate-600 text-sm leading-relaxed">{summary}</p></div>
      <div className="grid gap-4 sm:grid-cols-2">{assessment.domainScores.map(ds => { const domain = domains.find(d => d.id === ds.domainId); return (<DomainResult key={ds.domainId} domainScore={ds} icon={domain?.icon || '\\u{1F4CA}'} />); })}</div>
      <Disclaimer compact />
      <div className="flex flex-wrap gap-3 mt-8 justify-center">
        <button onClick={() => navigate('activities')} className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-medium shadow-md transition-all">View Recommended Activities</button>
        <button onClick={() => window.print()} className="bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-medium transition-all">Print Results</button>
        <button onClick={() => navigate('assessment')} className="bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-medium transition-all">Retake Assessment</button>
      </div>
      <PrintableReport assessment={assessment} />
    </div>
  );
}
`);

w('src/pages/Activities.jsx', `import { getLatestAssessment, getAssessments } from '../utils/storage.js';
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
        <div className="text-center py-8 bg-green-50 rounded-xl border border-green-200"><span className="text-4xl mb-3 block">\\u{1F389}</span><p className="text-green-700 font-medium">No areas of concern identified!</p><p className="text-green-600 text-sm mt-2">Continue enriching your child's environment with varied play and social opportunities.</p></div>
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
`);

w('src/pages/Progress.jsx', `import { getAssessments, clearAssessments } from '../utils/storage.js';
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
`);

console.log('\
=== Pages created! Run: node generate-data.cjs ===');
