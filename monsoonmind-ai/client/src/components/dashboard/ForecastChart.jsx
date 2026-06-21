import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import GlassCard from "../ui/GlassCard";

const ForecastChart = ({ forecast }) => {
  const data =
    forecast?.daily?.map((day) => ({
      date: new Date(day.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short"
      }),
      Rainfall: day.rainfall,
      Probability: day.rainProbability
    })) || [];

  const totalRain = data.reduce((sum, day) => sum + (Number(day.Rainfall) || 0), 0);
  const rainyDays = data.filter((day) => Number(day.Rainfall) > 2).length;
  const rainTakeaway = data.length
    ? rainyDays >= 3
      ? "Several rainy days are expected. Check the sowing call before acting."
      : rainyDays >= 1
        ? "Some rain is expected, but the window may still be uneven."
        : "Little rain is expected in the next week. Be careful with sowing."
    : "Run a farm check to see the next 7 days of rain.";

  return (
    <GlassCard className="min-h-[340px]">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-skydata-700">
            Rain forecast
          </p>
          <h3 className="mt-2 text-xl font-extrabold text-slate-950">
            Will rain support sowing?
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{rainTakeaway}</p>
        </div>
        <div className="rounded-xl bg-skydata-50 px-4 py-3 text-right ring-1 ring-skydata-100">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-skydata-700">7-day rain</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-950">
            {data.length ? `${totalRain.toFixed(1)} mm` : "--"}
          </p>
          <p className="text-xs font-semibold text-slate-500">
            {data.length ? `${rainyDays} likely rainy days` : "No data yet"}
          </p>
        </div>
      </div>

      <div className="mt-5 h-64">
        {data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="rainfallGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0.06} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#cffafe" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #cffafe"
                }}
              />
              <Area
                type="monotone"
                dataKey="Rainfall"
                stroke="#06b6d4"
                strokeWidth={3}
                fill="url(#rainfallGradient)"
              />
              <Area
                type="monotone"
                dataKey="Probability"
                stroke="#0d9488"
                strokeWidth={2}
                fill="transparent"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-2xl bg-white/70 p-4 text-center text-sm leading-6 text-slate-500">
            Run a farm check to plot forecast rainfall and likely rainy days.
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default ForecastChart;