export default function ActivityCard({ activity }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">{activity.icon || '\u{1F3AF}'}</span>
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
