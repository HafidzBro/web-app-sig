const toneClasses = {
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
  teal: "bg-teal-50 text-teal-700 ring-teal-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
};

export default function SummaryCard({ title, value, unit, icon, tone = "blue" }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {value}
            {unit && <span className="ml-1 text-base font-semibold text-slate-500">{unit}</span>}
          </h3>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ring-1 ${toneClasses[tone]}`}>
          <span className="material-symbols-outlined text-[22px]">{icon}</span>
        </div>
      </div>
    </div>
  );
}
