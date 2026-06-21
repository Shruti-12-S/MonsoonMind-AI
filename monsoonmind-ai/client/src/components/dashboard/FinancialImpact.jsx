import { IndianRupee } from "lucide-react";
import GlassCard from "../ui/GlassCard";

const money = (value = 0) => `INR ${Number(value).toLocaleString("en-IN")}`;

const FinancialImpact = ({ impact }) => {
  const optionA = impact?.optionA;
  const optionB = impact?.optionB;
  const gain = impact?.potentialAdditionalIncome || 0;
  const waitLooksBetter = gain > 0;

  return (
    <GlassCard>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-skydata-700">
            Money impact
          </p>
          <h3 className="mt-2 text-xl font-extrabold text-slate-950">
            Which choice protects income?
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {impact
              ? waitLooksBetter
                ? "Waiting may protect more income than sowing today."
                : "Sowing today does not look worse in this comparison."
              : "Run a farm check to compare sowing today with waiting 7 days."}
          </p>
        </div>
        <span
          className={`rounded-full px-4 py-2 text-sm font-extrabold ring-1 ${
            waitLooksBetter
              ? "bg-sunrisk-50 text-sunrisk-700 ring-sunrisk-100"
              : "bg-field-50 text-field-700 ring-field-100"
          }`}
        >
          {impact ? (waitLooksBetter ? "Wait may pay" : "Sow is competitive") : "Check needed"}
        </span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {[optionA, optionB].map((option, index) => (
          <div
            key={option?.label || index}
            className="rounded-xl border border-slate-200 bg-white/85 p-4"
          >
            <p className="text-sm font-semibold text-slate-500">
              {option?.label || (index === 0 ? "Sow today" : "Wait 7 days")}
            </p>
            <p className="mt-2 text-2xl font-extrabold text-slate-950">
              {option?.yield || "--"} q yield
            </p>
            <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-field-700">
              <IndianRupee size={15} /> {money(option?.income || 0)} income
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-field-900 p-4 text-white">
        <p className="text-sm text-slate-300">Possible income difference</p>
        <p className="mt-1 text-3xl font-extrabold">{money(gain)}</p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          {impact?.recommendation || "This will update after the farm check."}
        </p>
      </div>
    </GlassCard>
  );
};

export default FinancialImpact;