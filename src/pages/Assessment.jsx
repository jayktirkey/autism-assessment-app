import { useState } from 'react';
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
