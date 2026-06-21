import { CheckCircle2, ClipboardCheck } from "lucide-react";
import GlassCard from "../ui/GlassCard";

const ActionPlan = ({ actions = [] }) => (
  <GlassCard>
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-field-600 text-white">
          <ClipboardCheck size={23} />
        </span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-field-600">
            Step 3
          </p>
          <h3 className="text-xl font-extrabold text-slate-950">Do these first</h3>
        </div>
      </div>
      <span className="rounded-full bg-field-50 px-4 py-2 text-sm font-extrabold text-field-700 ring-1 ring-field-100">
        {actions.length ? `${actions.length} field tasks` : "Waiting for check"}
      </span>
    </div>

    <div className="mt-5 space-y-3">
      {actions.length ? (
        actions.map((action, index) => (
          <div
            key={action.title}
            className="rounded-xl border border-slate-200 bg-white/85 p-4"
          >
            <div className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-field-100 text-sm font-extrabold text-field-700">
                {index + 1}
              </span>
              <div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 text-field-600" size={18} />
                  <p className="font-extrabold text-slate-950">{action.title}</p>
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-600">Why: {action.why}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-xl bg-white/75 p-4 text-sm leading-6 text-slate-600 ring-1 ring-slate-100">
          Run a farm check and this card will become a short field checklist.
          It will tell you what to do before spending on seed, labor, fertilizer, or water.
        </div>
      )}
    </div>
  </GlassCard>
);

export default ActionPlan;