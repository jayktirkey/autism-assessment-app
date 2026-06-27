import { getLatestAssessment } from '../utils/storage.js';
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
      <div className="grid gap-4 sm:grid-cols-2">{assessment.domainScores.map(ds => { const domain = domains.find(d => d.id === ds.domainId); return (<DomainResult key={ds.domainId} domainScore={ds} icon={domain?.icon || '\u{1F4CA}'} />); })}</div>
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
