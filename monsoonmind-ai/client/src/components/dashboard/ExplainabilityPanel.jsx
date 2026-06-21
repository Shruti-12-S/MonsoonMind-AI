import GlassCard from "../ui/GlassCard";
import ProgressBar from "../ui/ProgressBar";

const colors = ["bg-field-500", "bg-skydata-500", "bg-sunrisk-500", "bg-slate-700"];

const factorMeaning = (factor) => {
  const text = factor.toLowerCase();
  if (text.includes("rainfall deficit")) return "How much rain is missing right now.";
  if (text.includes("historical")) return "How this season compares with past rainfall.";
  if (text.includes("soil")) return "A rough moisture signal from weather conditions.";
  if (text.includes("forecast")) return "How steady the next rain window looks.";
  if (text.includes("irrigation")) return "Whether water access gives you a safety buffer.";
  return "This signal influenced the sowing call.";
};

const ExplainabilityPanel = ({ factors = [] }) => (
  <GlassCard>
    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-field-600">
      Why this call
    </p>
    <h3 className="mt-2 text-xl font-extrabold text-slate-950">
      The biggest reasons, in plain words
    </h3>
    <p className="mt-2 text-sm leading-6 text-slate-600">
      Farmers should not have to guess why the app said SOW or WAIT. These bars show which signals mattered most.
    </p>
    <div className="mt-5 space-y-5">
      {factors.length ? (
        factors.map((factor, index) => (
          <ProgressBar
            key={factor.factor}
            label={factor.factor}
            value={factor.value}
            detail={`Weight in decision: ${factor.weight}%. ${factorMeaning(factor.factor)}`}
            color={colors[index % colors.length]}
          />
        ))
      ) : (
        <p className="rounded-xl bg-white/70 p-4 text-sm leading-6 text-slate-500">
          After the farm check, this card will explain the strongest reasons behind the call.
        </p>
      )}
    </div>
  </GlassCard>
);

export default ExplainabilityPanel;