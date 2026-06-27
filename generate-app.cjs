const fs = require('fs');
const path = require('path');
function w(f,c){fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,c);console.log('Created:',f);}

w('src/main.jsx', `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`);

w('src/index.css', `@import "tailwindcss";

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@media print {
  body { background: white !important; }
  nav, footer { display: none !important; }
  .print-report { display: block !important; }
  main { padding: 0 !important; max-width: 100% !important; }
  .no-print { display: none !important; }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
}
`);

w('src/App.jsx', `import { useState, useEffect } from 'react';
import Home from './pages/Home.jsx';
import Assessment from './pages/Assessment.jsx';
import Results from './pages/Results.jsx';
import Activities from './pages/Activities.jsx';
import Progress from './pages/Progress.jsx';
import Disclaimer from './components/Disclaimer.jsx';

const PAGES = { home: Home, assessment: Assessment, results: Results, activities: Activities, progress: Progress };

function getHashPage() {
  const hash = window.location.hash.replace('#', '');
  return PAGES[hash] ? hash : 'home';
}

export default function App() {
  const [page, setPage] = useState(getHashPage());
  useEffect(() => {
    function handleHash() { setPage(getHashPage()); }
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  function navigate(target) {
    window.location.hash = target;
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const PageComponent = PAGES[page] || Home;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('home')} className="font-bold text-teal-700 text-lg">DevScreen</button>
          <div className="flex gap-1 sm:gap-2 text-sm">
            {[{l:'Home',t:'home'},{l:'Assess',t:'assessment'},{l:'Results',t:'results'},{l:'Activities',t:'activities'},{l:'Progress',t:'progress'}].map(({l,t}) => (
              <button key={t} onClick={() => navigate(t)} className={\`px-2 sm:px-3 py-1.5 rounded-lg font-medium transition-colors \${page === t ? 'bg-teal-100 text-teal-700' : 'text-slate-600 hover:bg-slate-100'}\`}>{l}</button>
            ))}
          </div>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-4 py-8 print:p-0"><PageComponent navigate={navigate} /></main>
      <footer className="border-t border-slate-200 bg-white/50 mt-12 print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-6"><Disclaimer compact /></div>
      </footer>
    </div>
  );
}
`);

w('src/utils/storage.js', `const STORAGE_KEY = 'autism_screening_assessments';

export function saveAssessment(results) {
  const assessments = getAssessments();
  const assessment = { id: Date.now().toString(), timestamp: new Date().toISOString(), domainScores: results.domainScores, responses: results.responses };
  assessments.push(assessment);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments));
  return assessment;
}

export function getAssessments() {
  try { const data = localStorage.getItem(STORAGE_KEY); return data ? JSON.parse(data) : []; }
  catch { return []; }
}

export function getLatestAssessment() {
  const assessments = getAssessments();
  return assessments.length === 0 ? null : assessments[assessments.length - 1];
}

export function clearAssessments() { localStorage.removeItem(STORAGE_KEY); }
`);

w('src/utils/scoring.js', `import { domains } from '../data/questions.js';

export const CONCERN_LEVELS = { NONE: 'no_concern', MILD: 'mild_concern', MODERATE: 'moderate_concern', SIGNIFICANT: 'significant_concern' };
export const CONCERN_LABELS = { [CONCERN_LEVELS.NONE]: 'No Concern', [CONCERN_LEVELS.MILD]: 'Mild Concern', [CONCERN_LEVELS.MODERATE]: 'Moderate Concern', [CONCERN_LEVELS.SIGNIFICANT]: 'Significant Concern' };
export const CONCERN_COLORS = { [CONCERN_LEVELS.NONE]: 'bg-green-100 text-green-800 border-green-300', [CONCERN_LEVELS.MILD]: 'bg-yellow-100 text-yellow-800 border-yellow-300', [CONCERN_LEVELS.MODERATE]: 'bg-orange-100 text-orange-800 border-orange-300', [CONCERN_LEVELS.SIGNIFICANT]: 'bg-red-100 text-red-800 border-red-300' };

export function calculateDomainScore(domainId, responses) {
  const domain = domains.find(d => d.id === domainId);
  if (!domain) return 0;
  const domainResponses = domain.questions.map(q => responses[q.id]).filter(v => v !== undefined);
  if (domainResponses.length === 0) return 0;
  return domainResponses.reduce((sum, val) => sum + val, 0) / (domainResponses.length * 3);
}

export function getConcernLevel(score) {
  if (score <= 0.25) return CONCERN_LEVELS.NONE;
  if (score <= 0.5) return CONCERN_LEVELS.MILD;
  if (score <= 0.75) return CONCERN_LEVELS.MODERATE;
  return CONCERN_LEVELS.SIGNIFICANT;
}

export function calculateAllDomainScores(responses) {
  return domains.map(domain => {
    const score = calculateDomainScore(domain.id, responses);
    return { domainId: domain.id, name: domain.name, score, level: getConcernLevel(score) };
  });
}

export function generateProfileSummary(domainScores) {
  const concerns = domainScores.filter(d => d.level !== CONCERN_LEVELS.NONE);
  if (concerns.length === 0) return 'No significant concerns identified across all domains.';
  const significant = concerns.filter(d => d.level === CONCERN_LEVELS.SIGNIFICANT);
  const moderate = concerns.filter(d => d.level === CONCERN_LEVELS.MODERATE);
  let summary = '';
  if (significant.length > 0) summary += 'Significant concerns in: ' + significant.map(d => d.name).join(', ') + '. ';
  if (moderate.length > 0) summary += 'Moderate concerns in: ' + moderate.map(d => d.name).join(', ') + '. ';
  summary += 'Professional evaluation is recommended for areas of concern.';
  return summary;
}
`);

w('src/components/Disclaimer.jsx', `export default function Disclaimer({ compact = false }) {
  if (compact) return <p className="text-xs text-slate-500 italic text-center py-2">This is a screening tool only, not a clinical diagnosis. Professional evaluation is always recommended.</p>;
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{String.fromCodePoint(0x26A0, 0xFE0F)}</span>
        <div>
          <h4 className="font-semibold text-amber-800 mb-1">Important Disclaimer</h4>
          <p className="text-amber-700 text-sm leading-relaxed">This application is a <strong>screening tool only</strong> and does not provide a clinical diagnosis. It is designed to help parents identify areas where their child may benefit from additional support. Results should always be discussed with a qualified healthcare professional, developmental pediatrician, or licensed psychologist.</p>
        </div>
      </div>
    </div>
  );
}
`);

w('src/components/ProgressBar.jsx', `import { domains } from '../data/questions.js';

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
`);

w('src/components/QuestionCard.jsx', `export default function QuestionCard({ question, selectedValue, onSelect }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-4">
      <p className="text-slate-800 font-medium mb-4 text-lg leading-relaxed">{question.text}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {question.options.map((option) => (
          <button key={option.value + option.label} onClick={() => onSelect(question.id, option.value)}
            className={\`p-3 rounded-lg border-2 text-left transition-all \${selectedValue === option.value ? 'border-teal-500 bg-teal-50 text-teal-800 font-medium' : 'border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 text-slate-700'}\`}>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
`);

w('src/components/DomainResult.jsx', `import { CONCERN_LABELS, CONCERN_COLORS } from '../utils/scoring.js';

export default function DomainResult({ domainScore, icon }) {
  const colorClasses = CONCERN_COLORS[domainScore.level];
  const percentage = Math.round(domainScore.score * 100);
  return (
    <div className={\`rounded-xl border p-5 \${colorClasses}\`}>
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
`);

w('src/components/ActivityCard.jsx', `export default function ActivityCard({ activity }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">{activity.icon || '\\u{1F3AF}'}</span>
        <div>
          <h4 className="font-semibold text-slate-800">{activity.title}</h4>
          <span className="text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">{activity.type}</span>
        </div>
      </div>
      <p className="text-slate-600 text-sm mb-3 leading-relaxed">{activity.description}</p>
      <div className="flex flex-wrap gap-3 text-xs text-slate-500">
        <span className="bg-slate-100 px-2 py-1 rounded">Frequency: {activity.frequency}</span>
        <span className="bg-slate-100 px-2 py-1 rounded">Duration: {activity.duration}</span>
      </div>
      {activity.tips && <p className="mt-3 text-xs text-slate-500 italic border-t pt-3">Tip: {activity.tips}</p>}
    </div>
  );
}
`);

w('src/components/ProgressChart.jsx', `import { CONCERN_LABELS, CONCERN_LEVELS } from '../utils/scoring.js';
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
                  <div className={\`w-full max-w-12 rounded-t \${levelColors[data.level]} transition-all\`} style={{ height: Math.max(data.score * 100, 5) + '%' }} />
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
`);

w('src/components/PrintableReport.jsx', `import { CONCERN_LABELS } from '../utils/scoring.js';
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
`);

console.log('\
=== Part 1 done! Run: node generate-pages.js ===');
