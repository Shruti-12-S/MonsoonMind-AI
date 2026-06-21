import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Database,
  Loader2,
  PlusCircle,
  RefreshCw,
  XCircle
} from "lucide-react";
import {
  getCalibrationSummary,
  getRecommendationHistory,
  seedDemoCalibrationData,
  verifyPendingRecommendations
} from "../api/platform";
import { getApiError } from "../api/client";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : "No date";

const money = (value) =>
  value === undefined || value === null ? "--" : `INR ${Number(value).toLocaleString("en-IN")}`;

const statusStyle = {
  SOW: "bg-field-600 text-white",
  WAIT: "bg-sunrisk-500 text-white"
};

const outcomeBadge = (item) => {
  if (item.outcome?.status === "verified") {
    return item.outcome.correct
      ? { icon: CheckCircle2, text: "Verified correct", className: "bg-field-50 text-field-700 ring-field-100" }
      : { icon: XCircle, text: "Verified mismatch", className: "bg-red-50 text-red-700 ring-red-100" };
  }

  if (item.verification?.status === "failed") {
    return { icon: AlertTriangle, text: "Verification failed", className: "bg-red-50 text-red-700 ring-red-100" };
  }

  return { icon: Clock, text: "Awaiting rainfall check", className: "bg-slate-100 text-slate-700 ring-slate-200" };
};

const CalibrationCard = ({ summaryQuery, verifyMutation, seedMutation }) => {
  const summary = summaryQuery.data;
  const progress = summary
    ? Math.min(100, (summary.verifiedRecommendations / summary.minimumForCalibration) * 100)
    : 0;

  return (
    <section className="glass-panel rounded-2xl p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-field-600 text-white">
            <Database size={23} />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-field-600">
              Calibration
            </p>
            <h1 className="mt-2 text-2xl font-extrabold text-slate-950">
              Farm records build real accuracy
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Saved calls are checked later against observed rainfall. Until enough checks are verified, the app shows signal strength instead of claiming a true probability.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
          {import.meta.env.DEV ? (
            <button
              type="button"
              onClick={() => seedMutation.mutate()}
              disabled={seedMutation.isPending}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-sunrisk-500 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-sunrisk-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {seedMutation.isPending ? (
                <Loader2 className="animate-spin" size={17} />
              ) : (
                <PlusCircle size={17} />
              )}
              Add demo data
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => verifyMutation.mutate()}
            disabled={verifyMutation.isPending}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-field-600 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-field-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {verifyMutation.isPending ? (
              <Loader2 className="animate-spin" size={17} />
            ) : (
              <RefreshCw size={17} />
            )}
            Verify due calls
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl bg-white/80 p-4 ring-1 ring-slate-100">
          <p className="text-sm font-semibold text-slate-500">Verified records</p>
          <p className="mt-1 text-3xl font-extrabold text-slate-950">
            {summary?.verifiedRecommendations ?? "--"}
          </p>
        </div>
        <div className="rounded-xl bg-white/80 p-4 ring-1 ring-slate-100">
          <p className="text-sm font-semibold text-slate-500">Needed for calibration</p>
          <p className="mt-1 text-3xl font-extrabold text-slate-950">
            {summary?.minimumForCalibration ?? 500}
          </p>
        </div>
        <div className="rounded-xl bg-white/80 p-4 ring-1 ring-slate-100">
          <p className="text-sm font-semibold text-slate-500">Observed accuracy</p>
          <p className="mt-1 text-3xl font-extrabold text-slate-950">
            {summary?.observedAccuracy !== null && summary?.observedAccuracy !== undefined
              ? `${summary.observedAccuracy}%`
              : "--"}
          </p>
        </div>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-field-500" style={{ width: `${progress}%` }} />
      </div>

      {seedMutation.isError ? (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-100">
          {getApiError(seedMutation.error)}
        </p>
      ) : null}
      {seedMutation.data ? (
        <p className="mt-4 rounded-xl bg-sunrisk-50 px-4 py-3 text-sm font-semibold text-sunrisk-700 ring-1 ring-sunrisk-100">
          Added {seedMutation.data.inserted} demo records with {seedMutation.data.observedAccuracy}% observed accuracy.
        </p>
      ) : null}
      {verifyMutation.isError ? (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-100">
          {getApiError(verifyMutation.error)}
        </p>
      ) : null}
      {verifyMutation.data ? (
        <p className="mt-4 rounded-xl bg-field-50 px-4 py-3 text-sm font-semibold text-field-700 ring-1 ring-field-100">
          Checked {verifyMutation.data.checked} due calls. Verified {verifyMutation.data.verified.length}.
        </p>
      ) : null}
    </section>
  );
};

const HistoryCard = ({ item }) => {
  const decision = item.decision || {};
  const badge = outcomeBadge(item);
  const BadgeIcon = badge.icon;
  const signalStrength = decision.signalStrength ?? decision.confidence;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-4 py-2 text-sm font-extrabold ${
                statusStyle[item.recommendation] || "bg-slate-700 text-white"
              }`}
            >
              {item.recommendation}
            </span>
            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold ring-1 ${badge.className}`}>
              <BadgeIcon size={14} /> {badge.text}
            </span>
          </div>
          <h2 className="mt-4 text-xl font-extrabold text-slate-950">
            {decision.bestSowingWindow || "Farm check"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {decision.reason || "No reason saved for this call."}
          </p>
        </div>
        <p className="shrink-0 text-sm font-semibold text-slate-500 lg:text-right">
          {formatDate(item.createdAt)}
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-500">Signal</p>
          <p className="mt-1 font-extrabold text-slate-950">
            {signalStrength !== undefined ? `${signalStrength}%` : "--"}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-500">Rain gap</p>
          <p className="mt-1 font-extrabold text-slate-950">
            {decision.rainfallDeficit !== undefined && decision.rainfallDeficit !== null
              ? `${decision.rainfallDeficit}%`
              : "--"}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-500">Income estimate</p>
          <p className="mt-1 font-extrabold text-slate-950">{money(decision.expectedIncome)}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-500">Observed rain</p>
          <p className="mt-1 font-extrabold text-slate-950">
            {item.outcome?.observedRainfall7Days !== undefined
              ? `${item.outcome.observedRainfall7Days} mm`
              : "Pending"}
          </p>
        </div>
      </div>

      {item.outcome?.reason ? (
        <p className="mt-4 rounded-xl bg-white/70 px-4 py-3 text-sm leading-6 text-slate-600 ring-1 ring-slate-100">
          {item.outcome.reason}
        </p>
      ) : null}
    </article>
  );
};

const HistoryPage = () => {
  const queryClient = useQueryClient();
  const historyQuery = useQuery({
    queryKey: ["recommendation-history"],
    queryFn: getRecommendationHistory
  });
  const summaryQuery = useQuery({
    queryKey: ["recommendation-calibration"],
    queryFn: getCalibrationSummary
  });
  const refreshRecords = () => {
    queryClient.invalidateQueries({ queryKey: ["recommendation-history"] });
    queryClient.invalidateQueries({ queryKey: ["recommendation-calibration"] });
  };
  const verifyMutation = useMutation({
    mutationFn: verifyPendingRecommendations,
    onSuccess: refreshRecords
  });
  const seedMutation = useMutation({
    mutationFn: seedDemoCalibrationData,
    onSuccess: refreshRecords
  });

  const history = historyQuery.data || [];

  return (
    <div className="space-y-6 pb-24">
      <CalibrationCard summaryQuery={summaryQuery} verifyMutation={verifyMutation} seedMutation={seedMutation} />

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-field-600">
              Farm records
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-950">
              Saved calls history
            </h2>
          </div>
          <span className="self-start rounded-full bg-white px-4 py-2 text-sm font-extrabold text-slate-700 ring-1 ring-slate-200 sm:self-auto">
            {history.length} saved checks
          </span>
        </div>

        {historyQuery.isLoading ? (
          <div className="glass-panel flex items-center gap-3 rounded-2xl p-5 text-sm font-semibold text-slate-600">
            <Loader2 className="animate-spin text-field-600" size={18} /> Loading records...
          </div>
        ) : null}

        {historyQuery.isError ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-100">
            {getApiError(historyQuery.error)}
          </p>
        ) : null}

        {!historyQuery.isLoading && !history.length ? (
          <div className="glass-panel rounded-2xl p-5 text-sm leading-6 text-slate-600">
            Run a farm check from the dashboard and saved calls will appear here.
          </div>
        ) : null}

        <div className="space-y-4">
          {history.map((item) => (
            <HistoryCard key={item._id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HistoryPage;