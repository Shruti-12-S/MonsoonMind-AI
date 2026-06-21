import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, CloudSun, Loader2, Save, Sprout } from "lucide-react";
import { getApiError } from "../api/client";
import {
  getFarmProfile,
  getRecommendationHistory,
  runLiveRecommendation,
  saveFarmProfile
} from "../api/platform";
import ActionPlan from "../components/dashboard/ActionPlan";
import ConfidenceMeter from "../components/dashboard/ConfidenceMeter";
import CopilotPanel from "../components/dashboard/CopilotPanel";
import DataSources from "../components/dashboard/DataSources";
import DecisionSummary from "../components/dashboard/DecisionSummary";
import ExplainabilityPanel from "../components/dashboard/ExplainabilityPanel";
import FinancialImpact from "../components/dashboard/FinancialImpact";
import ForecastChart from "../components/dashboard/ForecastChart";
import RiskCards from "../components/dashboard/RiskCards";
import ScenarioSimulator from "../components/dashboard/ScenarioSimulator";
import Timeline from "../components/dashboard/Timeline";
import WeatherMap from "../components/dashboard/WeatherMap";
import { crops } from "../data/crops";

const numberOrUndefined = (value) => {
  if (value === "" || value === undefined || value === null) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const buildPayload = (values) => {
  const latitude = numberOrUndefined(values.latitude);
  const longitude = numberOrUndefined(values.longitude);

  return {
    farmName: values.farmName,
    city: values.city,
    district: values.district,
    state: values.state,
    pincode: values.pincode,
    coordinates:
      latitude !== undefined && longitude !== undefined
        ? { latitude, longitude }
        : undefined,
    latitude,
    longitude,
    crop: values.crop,
    landSize: Number(values.landSize),
    landUnit: values.landUnit,
    irrigationAvailable: Boolean(values.irrigationAvailable),
    expectedMarketPrice: Number(values.expectedMarketPrice)
  };
};

const SectionHeader = ({ eyebrow, title, text }) => (
  <div className="max-w-3xl">
    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-field-600">
      {eyebrow}
    </p>
    <h2 className="mt-2 text-2xl font-extrabold text-slate-950">{title}</h2>
    {text ? <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p> : null}
  </div>
);

const StepCard = ({ number, title, text }) => (
  <div className="rounded-xl border border-white/15 bg-white/10 p-4 text-white">
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-extrabold text-field-800">
      {number}
    </span>
    <p className="mt-3 font-extrabold">{title}</p>
    <p className="mt-1 text-sm leading-5 text-white/70">{text}</p>
  </div>
);

const FormField = ({ label, children }) => (
  <label className="block">
    <span className="text-sm font-semibold text-slate-700">{label}</span>
    {children}
  </label>
);

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 outline-none transition focus:border-field-500 focus:ring-2 focus:ring-field-100";

const SavedCalls = ({ historyQuery }) => (
  <div className="glass-panel rounded-2xl p-5">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sunrisk-400 text-slate-950">
          <Save size={22} />
        </span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sunrisk-700">
            Recent checks
          </p>
          <h3 className="text-xl font-extrabold text-slate-950">Latest saved calls</h3>
        </div>
      </div>
      <Link
        to="/history"
        className="inline-flex items-center gap-2 self-start rounded-full bg-white px-4 py-2 text-sm font-extrabold text-field-700 ring-1 ring-field-100 transition hover:bg-field-50 sm:self-auto"
      >
        View all records <ArrowRight size={15} />
      </Link>
    </div>
    <div className="mt-5 grid gap-3 lg:grid-cols-3">
      {historyQuery.data?.length ? (
        historyQuery.data.slice(0, 3).map((item) => (
          <div key={item._id} className="rounded-xl bg-white/85 p-4 ring-1 ring-slate-100">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between lg:flex-col">
              <p className="font-bold text-slate-950">{item.decision.recommendation}</p>
              <p className="text-sm text-slate-500">
                {new Date(item.createdAt).toLocaleString("en-IN")}
              </p>
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{item.decision.reason}</p>
          </div>
        ))
      ) : (
        <p className="rounded-xl bg-white/75 p-4 text-sm text-slate-500 lg:col-span-3">
          Your checks will appear here after you run the farm brief.
        </p>
      )}
    </div>
  </div>
);

const DashboardPage = () => {
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState("");
  const farmQuery = useQuery({
    queryKey: ["farm-profile"],
    queryFn: getFarmProfile
  });
  const historyQuery = useQuery({
    queryKey: ["recommendation-history"],
    queryFn: getRecommendationHistory
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting }
  } = useForm({
    defaultValues: {
      farmName: "Monsoon Plot",
      city: "Nagpur",
      district: "",
      state: "Maharashtra",
      pincode: "",
      latitude: "",
      longitude: "",
      crop: "soybean",
      landSize: 5,
      landUnit: "acre",
      irrigationAvailable: false,
      expectedMarketPrice: 4500
    }
  });

  useEffect(() => {
    if (!farmQuery.data) return;
    reset({
      farmName: farmQuery.data.farmName || "",
      city: farmQuery.data.city || "",
      district: farmQuery.data.district || "",
      state: farmQuery.data.state || "",
      pincode: farmQuery.data.pincode || "",
      latitude: farmQuery.data.coordinates?.latitude || "",
      longitude: farmQuery.data.coordinates?.longitude || "",
      crop: farmQuery.data.crop || "soybean",
      landSize: farmQuery.data.landSize || 5,
      landUnit: farmQuery.data.landUnit || "acre",
      irrigationAvailable: farmQuery.data.irrigationAvailable || false,
      expectedMarketPrice: farmQuery.data.expectedMarketPrice || 4500
    });
  }, [farmQuery.data, reset]);

  useEffect(() => {
    const latest = historyQuery.data?.[0]?.decision;
    if (latest && !recommendation) {
      setRecommendation(latest);
    }
  }, [historyQuery.data, recommendation]);

  const saveMutation = useMutation({
    mutationFn: saveFarmProfile
  });
  const decisionMutation = useMutation({
    mutationFn: runLiveRecommendation,
    onSuccess: (data) => {
      setRecommendation(data);
      historyQuery.refetch();
    }
  });

  const watchedValues = watch();
  const farmInput = useMemo(() => {
    const payload = buildPayload(watchedValues);
    return {
      crop: payload.crop,
      landSize: payload.landSize,
      landUnit: payload.landUnit,
      irrigationAvailable: payload.irrigationAvailable,
      expectedMarketPrice: payload.expectedMarketPrice
    };
  }, [watchedValues]);

  const onSubmit = async (values) => {
    setError("");
    const payload = buildPayload(values);
    try {
      await saveMutation.mutateAsync(payload);
      await decisionMutation.mutateAsync(payload);
    } catch (err) {
      setError(getApiError(err));
    }
  };

  const loadingDecision = isSubmitting || saveMutation.isPending || decisionMutation.isPending;

  return (
    <div className="space-y-8 pb-24">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-field-900 p-5 text-white shadow-glow md:p-6"
      >
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-field-100">
              Start here
            </p>
            <h1 className="mt-2 text-3xl font-extrabold">Farm dashboard</h1>
            <p className="mt-3 max-w-2xl leading-7 text-white/70">
              Fill the farm details once, read today's sowing call, then use the checklist,
              rain, money, and map sections only when you need more detail.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-field-50 ring-1 ring-white/10">
            <CheckCircle2 size={17} /> Follow the cards from top to bottom
          </div>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <StepCard
            number="1"
            title="Enter farm details"
            text="PIN code, crop, land size, irrigation, and price."
          />
          <StepCard
            number="2"
            title="Read today's call"
            text="SOW or WAIT, signal strength, best window, and reason."
          />
          <StepCard
            number="3"
            title="Act on the checklist"
            text="Use the next steps before spending on seed, labor, or fertilizer."
          />
        </div>
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr] xl:items-start">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-2xl p-5 xl:sticky xl:top-24"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-field-600 text-white">
              <CloudSun size={24} />
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-field-600">
                Step 1
              </p>
              <h2 className="text-2xl font-extrabold text-slate-950">Farm details</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4">
            <FormField label="Farm name">
              <input className={inputClass} {...register("farmName")} />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="PIN code">
                <input
                  inputMode="numeric"
                  maxLength="6"
                  placeholder="Example: 440001"
                  className={inputClass}
                  {...register("pincode")}
                />
                <span className="mt-1 block text-xs font-medium text-slate-500">
                  Finds the postal area. Use coordinates only if you want field-level precision.
                </span>
              </FormField>

              <FormField label="State">
                <input className={inputClass} {...register("state")} />
              </FormField>
            </div>

            <FormField label="City or nearest town">
              <input className={inputClass} {...register("city")} />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Crop">
                <select className={inputClass} {...register("crop", { required: true })}>
                  {crops.map((crop) => (
                    <option key={crop.value} value={crop.value}>
                      {crop.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Land size">
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  className={inputClass}
                  {...register("landSize", { required: true })}
                />
              </FormField>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Land unit">
                <select className={inputClass} {...register("landUnit")}>
                  <option value="acre">Acre</option>
                  <option value="hectare">Hectare</option>
                </select>
              </FormField>

              <FormField label="Price per quintal">
                <input
                  type="number"
                  min="1"
                  className={inputClass}
                  {...register("expectedMarketPrice", { required: true })}
                />
              </FormField>
            </div>

            <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white/80 px-4 py-3">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 accent-field-600"
                {...register("irrigationAvailable")}
              />
              <span>
                <span className="block font-semibold text-slate-800">
                  Protective irrigation is available
                </span>
                <span className="mt-1 block text-sm text-slate-500">
                  Tick this if you can give one watering while waiting for rain.
                </span>
              </span>
            </label>

            <details className="rounded-xl border border-slate-200 bg-white/70 p-4">
              <summary className="cursor-pointer font-bold text-slate-800">
                Optional: district or exact farm location
              </summary>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <FormField label="District, if different">
                  <input className={inputClass} {...register("district")} />
                </FormField>
                <div className="hidden sm:block" />
                <FormField label="Latitude">
                  <input
                    type="number"
                    step="any"
                    className={inputClass}
                    {...register("latitude")}
                  />
                </FormField>
                <FormField label="Longitude">
                  <input
                    type="number"
                    step="any"
                    className={inputClass}
                    {...register("longitude")}
                  />
                </FormField>
              </div>
            </details>

            {error ? (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loadingDecision}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-field-600 px-5 py-3 font-extrabold text-white transition hover:bg-field-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingDecision ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Checking rain and farm risk...
                </>
              ) : (
                <>
                  <Sprout size={18} /> Save farm and check today
                </>
              )}
            </button>
          </form>
        </motion.section>

        <div className="space-y-6">
          <DecisionSummary recommendation={recommendation} />
          <ActionPlan actions={recommendation?.actionPlan} />
          <DataSources recommendation={recommendation} />
        </div>
      </div>

      <section className="space-y-4">
        <SectionHeader
          eyebrow="Risk check"
          title="Know what needs attention."
          text="These cards keep the main risks in one place instead of spreading them across the dashboard."
        />
        <RiskCards risk={recommendation?.risk} />
      </section>

      <section className="space-y-4">
        <SectionHeader
          eyebrow="Rain and money"
          title="Check the forecast before spending."
          text="Use this section when you want the rainfall trend, signal strength, income range, or delay simulation."
        />
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <ForecastChart forecast={recommendation?.weather?.forecast} />
          <ConfidenceMeter meter={recommendation?.confidenceMeter} />
        </div>
        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <FinancialImpact impact={recommendation?.financialImpact} />
          <ScenarioSimulator farmInput={farmInput} />
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader
          eyebrow="Place and records"
          title="See the farm on the map and review older calls."
          text="These are reference panels, so they sit below the decision and action sections."
        />
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <WeatherMap recommendation={recommendation} />
          <Timeline timeline={recommendation?.timeline} />
        </div>
        <SavedCalls historyQuery={historyQuery} />
      </section>

      <section className="space-y-4">
        <SectionHeader
          eyebrow="Why this call"
          title="Open this when you want the reasoning."
          text="The weights explain which signals influenced the recommendation most."
        />
        <ExplainabilityPanel factors={recommendation?.explainability} />
      </section>

      <CopilotPanel context={{ recommendation, farmInput }} />
    </div>
  );
};

export default DashboardPage;