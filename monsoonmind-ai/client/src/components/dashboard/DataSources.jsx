import { CloudRain, Database, History, MapPinned } from "lucide-react";
import GlassCard from "../ui/GlassCard";

const formatTime = (value) => {
  if (!value) return "No timestamp";
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
};

const SourceRow = ({ icon: Icon, title, value, detail, ok = true }) => (
  <div className="rounded-xl border border-slate-200 bg-white/85 p-4">
    <div className="flex items-start gap-3">
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          ok ? "bg-field-100 text-field-700" : "bg-sunrisk-50 text-sunrisk-700"
        }`}
      >
        <Icon size={20} />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-500">{title}</p>
        <p className="mt-1 break-words font-extrabold leading-snug text-slate-950">
          {value}
        </p>
        {detail ? (
          <p className="mt-1 break-words text-sm leading-5 text-slate-600">
            {detail}
          </p>
        ) : null}
      </div>
    </div>
  </div>
);

const DataSources = ({ recommendation }) => {
  const current = recommendation?.weather?.current;
  const forecast = recommendation?.weather?.forecast;
  const historical = recommendation?.weather?.historical;
  const location = recommendation?.weather?.current?.location || forecast?.location || historical?.location;

  return (
    <GlassCard>
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-field-600">
        Real data check
      </p>
      <h3 className="mt-2 text-xl font-extrabold text-slate-950">
        Sources used for this farm brief
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Weather and rainfall come from live external APIs. Yield, income, and risk are estimates calculated from those readings plus your crop, land, irrigation, and price inputs.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <SourceRow
          icon={MapPinned}
          title="Location"
          value={location?.label || "Run a farm check"}
          detail={location?.source ? `Source: ${location.source}` : "PIN code, city/state, or exact coordinates will be used."}
          ok={Boolean(location)}
        />
        <SourceRow
          icon={CloudRain}
          title="Current weather"
          value={current?.source || "Not loaded yet"}
          detail={current ? `Updated: ${formatTime(current.generatedAt)}` : "Used for temperature, humidity, rain, wind, and cloud cover."}
          ok={Boolean(current)}
        />
        <SourceRow
          icon={Database}
          title="7-day forecast"
          value={forecast?.source || "Not loaded yet"}
          detail={forecast ? `${forecast.daily?.length || 0} forecast days received.` : "Used for rainfall window and rain-delay risk."}
          ok={Boolean(forecast?.daily?.length)}
        />
        <SourceRow
          icon={History}
          title="Historical rainfall"
          value={historical?.available ? historical.source : "Unavailable"}
          detail={historical?.available ? `${historical.period?.start} to ${historical.period?.end}` : historical?.reason || "Used only when NASA POWER returns data."}
          ok={Boolean(historical?.available)}
        />
      </div>
    </GlassCard>
  );
};

export default DataSources;