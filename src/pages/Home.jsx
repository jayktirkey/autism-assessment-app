import Disclaimer from '../components/Disclaimer.jsx';
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
          <li className="flex items-center gap-2"><span>👋</span> Social Interaction & Communication</li>
          <li className="flex items-center gap-2"><span>🔄</span> Repetitive Behaviors & Interests</li>
          <li className="flex items-center gap-2"><span>🎨</span> Sensory Processing</li>
          <li className="flex items-center gap-2"><span>💬</span> Language Development</li>
          <li className="flex items-center gap-2"><span>✋</span> Motor Skills (Fine & Gross)</li>
          <li className="flex items-center gap-2"><span>🏠</span> Daily Living / Adaptive Skills</li>
          <li className="flex items-center gap-2"><span>🧘</span> Emotional Regulation</li>
          <li className="flex items-center gap-2"><span>🧸</span> Play Skills</li>
        </ul>
      </div>
    </div>
  );
}
