const toneMap = {
  green: "from-field-500 to-field-600",
  blue: "from-skydata-500 to-skydata-700",
  yellow: "from-sunrisk-400 to-sunrisk-500",
  dark: "from-field-900 to-skydata-900",
  red: "from-red-500 to-rose-600"
};

const badgeToneMap = {
  green: "bg-field-50 text-field-700 ring-field-100",
  blue: "bg-skydata-50 text-skydata-700 ring-skydata-100",
  yellow: "bg-amber-50 text-amber-700 ring-amber-100",
  dark: "bg-slate-100 text-slate-700 ring-slate-200",
  red: "bg-red-50 text-red-700 ring-red-100"
};

const MetricCard = ({
  icon: Icon,
  label,
  value,
  detail,
  hint,
  badge,
  tone = "green",
  valueClassName = ""
}) => (
  <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-4 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <p className="min-w-0 text-sm font-semibold leading-5 text-slate-500">{label}</p>
      {Icon ? (
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${toneMap[tone]} text-white shadow-lg`}
        >
          <Icon size={21} />
        </span>
      ) : null}
    </div>
    <p className={`mt-3 max-w-full break-words text-3xl font-extrabold leading-tight tracking-tight text-slate-950 ${valueClassName}`}>
      {value}
    </p>
    {badge ? (
      <span
        className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-extrabold ring-1 ${badgeToneMap[tone]}`}
      >
        {badge}
      </span>
    ) : null}
    {detail ? <p className="mt-3 text-sm leading-5 text-slate-600">{detail}</p> : null}
    {hint ? <p className="mt-2 text-xs font-semibold text-slate-500">{hint}</p> : null}
  </div>
);

export default MetricCard;