import { CalendarDays, IndianRupee, Sprout, TrendingUp } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import MetricCard from "../ui/MetricCard";

const money = (value) =>
  value === undefined || value === null ? "--" : `INR ${Number(value).toLocaleString("en-IN")}`;

const moneyRange = (range, fallback) => {
  if (range?.low !== undefined && range?.high !== undefined) {
    return `${money(range.low)} to ${money(range.high)}`;
  }
  return money(fallback);
};

const yieldRange = (range, fallback) => {
  if (range?.low !== undefined && range?.high !== undefined) {
    return `${range.low} to ${range.high} q`;
  }
  return fallback !== undefined && fallback !== null ? `${fallback} q` : "--";
};

const signalText = (signal = 0) => {
  if (signal >= 80) return "Strong signal";
  if (signal >= 60) return "Usable signal";
  return "Needs caution";
};

const deficitText = (deficit) => {
  if (deficit === undefined || deficit === null) return "Rainfall gap will appear after checking.";
  if (deficit < 25) return "Rainfall gap is small.";
  if (deficit < 50) return "Rainfall gap needs watching.";
  return "Rainfall gap is high. Be careful before sowing.";
};

const DecisionSummary = ({ recommendation }) => {
  if (!recommendation) {
    return (
      <GlassCard className="flex min-h-[320px] flex-col justify-center border-dashed border-field-200 bg-field-50/70">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-field-600">
          Step 2
        </p>
        <h2 className="mt-3 text-3xl font-extrabold text-slate-950">
          Today's answer will appear here.
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Fill the farm details on the left and press "Save farm and check today".
          This card will show SOW or WAIT, the reason, signal strength, and best sowing window.
        </p>
      </GlassCard>
    );
  }

  const isSow = recommendation.recommendation === "SOW";
  const callText = isSow ? "SOW" : "WAIT";
  const callTone = isSow ? "bg-field-600" : "bg-sunrisk-500";
  const signalStrength = recommendation.signalStrength ?? recommendation.confidence ?? 0;
  const callMessage = isSow
    ? "Rain and timing look supportive enough to start."
    : "Hold the main sowing spend until the rain window improves.";

  return (
    <GlassCard className="overflow-hidden p-0">
      <div className={`${isSow ? "bg-field-900" : "bg-slate-950"} p-5 text-white md:p-6`}>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/65">
          Step 2: Today's answer
        </p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-6 py-3 text-3xl font-extrabold text-white ${callTone}`}>
                {callText}
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-extrabold text-slate-950">
                {signalStrength}% signal strength
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/15">
                {signalText(signalStrength)}
              </span>
            </div>
            <h2 className="mt-5 max-w-3xl text-2xl font-extrabold leading-snug">
              {callMessage}
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-white/72">{recommendation.reason}</p>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/58">
              Signal strength is not yet a calibrated probability. The app will calibrate it after enough recommendations are verified against observed rainfall.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 lg:min-w-72">
            <p className="text-sm text-white/65">Best sowing window</p>
            <p className="mt-2 text-2xl font-extrabold">{recommendation.bestSowingWindow}</p>
            <p className="mt-2 text-sm text-white/65">
              Rain expected in {recommendation.expectedRainfallWindow}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 md:p-6">
        {recommendation.alternativeRecommendation ? (
          <div className="mb-5 rounded-xl bg-sunrisk-50 px-4 py-3 text-sm font-semibold leading-6 text-sunrisk-700 ring-1 ring-sunrisk-100">
            Backup plan: {recommendation.alternativeRecommendation}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <MetricCard
            icon={TrendingUp}
            label="Rainfall gap"
            value={`${recommendation.rainfallDeficit ?? "NA"}%`}
            detail={deficitText(recommendation.rainfallDeficit)}
            hint={`Trend: ${recommendation.rainfallTrend || "not available"}`}
            badge={(recommendation.rainfallDeficit ?? 100) < 35 ? "Manageable" : "Watch rain"}
            tone={(recommendation.rainfallDeficit ?? 100) < 35 ? "green" : "yellow"}
          />
          <MetricCard
            icon={CalendarDays}
            label="Rain window"
            value={recommendation.expectedRainfallWindow}
            detail="Use this before arranging labor or opening fertilizer."
            badge="Timing"
            tone="blue"
          />
          <MetricCard
            icon={Sprout}
            label="Expected yield range"
            value={yieldRange(recommendation.expectedYieldRange, recommendation.expectedYield)}
            detail={`Planning range based on entered ${recommendation.cropUnit || "quintal"} price and current water risk.`}
            badge="Estimate"
            tone="green"
            valueClassName="text-2xl sm:text-3xl"
          />
          <MetricCard
            icon={IndianRupee}
            label="Expected income range"
            value={moneyRange(recommendation.expectedIncomeRange, recommendation.expectedIncome)}
            detail="Use this as a planning range, not a guaranteed sale price."
            badge="Planning"
            tone="dark"
            valueClassName="text-xl sm:text-2xl"
          />
        </div>
      </div>
    </GlassCard>
  );
};

export default DecisionSummary;