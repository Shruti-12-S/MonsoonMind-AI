import { GaugeCircle } from "lucide-react";
import GlassCard from "../ui/GlassCard";

const signalLabel = (signal) => {
  if (!signal) return "Run a check first";
  if (signal >= 80) return "Weather signal is strong";
  if (signal >= 60) return "Weather signal is usable";
  return "Use extra caution";
};

const ConfidenceMeter = ({ meter }) => {
  const signalStrength = meter?.signalStrength ?? meter?.confidence ?? 0;

  return (
    <GlassCard>
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-skydata-500 text-white">
          <GaugeCircle size={24} />
        </span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-skydata-700">
            How strong is this signal?
          </p>
          <h3 className="text-xl font-extrabold text-slate-950">
            {signalLabel(signalStrength)}
          </h3>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-white/80 p-4 ring-1 ring-slate-100">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-500">Signal strength</p>
            <p className="mt-1 text-4xl font-extrabold text-slate-950">{signalStrength}%</p>
          </div>
          <span className="rounded-full bg-skydata-50 px-3 py-1 text-sm font-extrabold text-skydata-700 ring-1 ring-skydata-100">
            {meter?.recommendation || "No call yet"}
          </span>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sunrisk-400 via-skydata-500 to-field-500"
            style={{ width: `${signalStrength}%` }}
          />
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-500">
          {meter?.calibrationMessage || "This score is not yet a calibrated probability."}
        </p>
      </div>

      <dl className="mt-5 grid gap-3 text-sm">
        <div className="rounded-xl bg-white/70 px-4 py-3">
          <dt className="font-semibold text-slate-500">Forecast agreement</dt>
          <dd className="mt-1 font-extrabold text-slate-950">{meter?.forecastAgreement || "--"}</dd>
        </div>
        <div className="rounded-xl bg-white/70 px-4 py-3">
          <dt className="font-semibold text-slate-500">Matches past rainfall pattern</dt>
          <dd className="mt-1 font-extrabold text-slate-950">{meter?.historicalSimilarity || "--"}</dd>
        </div>
        <div className="rounded-xl bg-white/70 px-4 py-3">
          <dt className="font-semibold text-slate-500">Last weather refresh</dt>
          <dd className="mt-1 font-extrabold text-slate-950">{meter?.dataFreshness || "--"}</dd>
        </div>
      </dl>
    </GlassCard>
  );
};

export default ConfidenceMeter;