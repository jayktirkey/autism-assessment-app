export default function QuestionCard({ question, selectedValue, onSelect }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-4">
      <p className="text-slate-800 font-medium mb-4 text-lg leading-relaxed">{question.text}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {question.options.map((option) => (
          <button key={option.value + option.label} onClick={() => onSelect(question.id, option.value)}
            className={`p-3 rounded-lg border-2 text-left transition-all ${selectedValue === option.value ? 'border-teal-500 bg-teal-50 text-teal-800 font-medium' : 'border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 text-slate-700'}`}>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
