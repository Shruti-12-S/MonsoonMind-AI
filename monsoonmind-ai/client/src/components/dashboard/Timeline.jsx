import { ArrowDown, History } from "lucide-react";
import GlassCard from "../ui/GlassCard";

const Timeline = ({ timeline = [] }) => (
  <GlassCard className="h-full">
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-field-100 text-field-700">
        <History size={21} />
      </span>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-field-600">
          What changed
        </p>
        <h3 className="text-xl font-extrabold text-slate-950">Previous call vs current call</h3>
      </div>
    </div>
    <div className="mt-5 flex flex-1 flex-col justify-start space-y-3">
      {timeline.length ? (
        timeline.map((item, index) => (
          <div key={`${item.label}-${index}`}>
            <div className="rounded-xl border border-slate-200 bg-white/85 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold text-slate-950">{item.label}</p>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-extrabold text-white ${
                    item.recommendation === "SOW" ? "bg-field-600" : "bg-sunrisk-500"
                  }`}
                >
                  {item.recommendation}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.reason}</p>
            </div>
            {index < timeline.length - 1 ? (
              <div className="flex justify-center py-2 text-slate-400">
                <ArrowDown size={18} />
              </div>
            ) : null}
          </div>
        ))
      ) : (
        <p className="rounded-xl bg-white/70 p-4 text-sm leading-6 text-slate-500">
          After two farm checks, this card will show whether the call improved or became riskier.
        </p>
      )}
    </div>
  </GlassCard>
);

export default Timeline;