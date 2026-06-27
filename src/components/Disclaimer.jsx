export default function Disclaimer({ compact = false }) {
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
