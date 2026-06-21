import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { runSimulator } from "../../api/platform";
import GlassCard from "../ui/GlassCard";

const recommendationText = (recommendation) => {
  if (recommendation === "SOW") return "Delay still looks manageable.";
  if (recommendation === "WAIT_AND_PREPARE") return "Wait, but keep seed and labor ready.";
  if (recommendation === "DELAY_HIGH_RISK") return "Long delay can hurt yield. Avoid rushing inputs.";
  return "Move the slider to see delay impact.";
};

const ScenarioSimulator = ({ farmInput }) => {
  const [rainDelay, setRainDelay] = useState(5);

  const simulatorMutation = useMutation({
    mutationFn: runSimulator
  });

  useEffect(() => {
    if (!farmInput?.crop || !farmInput?.landSize || !farmInput?.expectedMarketPrice) {
      return;
    }

    const id = window.setTimeout(() => {
      simulatorMutation.mutate({ ...farmInput, rainDelay });
    }, 250);

    return () => window.clearTimeout(id);
  }, [farmInput, rainDelay]);

  const simulation = simulatorMutation.data;
  const selected = simulation?.selected;

  return (
    <GlassCard className="min-h-[420px]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-field-600">
            If rain is delayed
          </p>
          <h3 className="mt-2 text-xl font-extrabold text-slate-950">
            What happens after {rainDelay} days?
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {recommendationText(selected?.recommendation)}
          </p>
        </div>
        <div className="rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-200">
          {simulatorMutation.isPending ? "Updating..." : selected ? selected.recommendation.replaceAll("_", " ") : "Needs farm details"}
        </div>
      </div>

      <input
        type="range"
        min="0"
        max="30"
        value={rainDelay}
        onChange={(event) => setRainDelay(Number(event.target.value))}
        className="mt-6 w-full accent-field-600"
      />
      <div className="mt-2 flex justify-between text-xs font-semibold text-slate-500">
        <span>No delay</span>
        <span>15 days</span>
        <span>30 days</span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-white/85 p-4 ring-1 ring-slate-100">
          <p className="text-sm font-semibold text-slate-500">Likely yield</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-950">
            {selected ? `${selected.yieldPercent}%` : "--"}
          </p>
          <p className="mt-1 text-xs text-slate-500">Higher is better</p>
        </div>
        <div className="rounded-xl bg-white/85 p-4 ring-1 ring-slate-100">
          <p className="text-sm font-semibold text-slate-500">Possible income</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-950">
            {selected ? `INR ${selected.income.toLocaleString("en-IN")}` : "--"}
          </p>
          <p className="mt-1 text-xs text-slate-500">Based on entered price</p>
        </div>
        <div className="rounded-xl bg-white/85 p-4 ring-1 ring-slate-100">
          <p className="text-sm font-semibold text-slate-500">Risk if delayed</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-950">
            {selected ? `${selected.risk}%` : "--"}
          </p>
          <p className="mt-1 text-xs text-slate-500">Lower is better</p>
        </div>
      </div>

      <div className="mt-5 h-48">
        {simulation?.curve?.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={simulation.curve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="rainDelay" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #ccfbf1"
                }}
              />
              <Line dataKey="yieldPercent" stroke="#0d9488" strokeWidth={3} dot={false} />
              <Line dataKey="risk" stroke="#fb7185" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-2xl bg-white/70 p-4 text-center text-sm leading-6 text-slate-500">
            Complete the farm form to see how waiting may change yield, income, and risk.
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default ScenarioSimulator;