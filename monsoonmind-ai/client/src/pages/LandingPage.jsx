import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CloudRain,
  DatabaseZap,
  Droplets,
  Gauge,
  IndianRupee,
  Layers3,
  LockKeyhole,
  MapPinned,
  MessageSquareText,
  RadioTower,
  ShieldCheck,
  Sprout,
  TimerReset,
  TrendingUp,
  Waves
} from "lucide-react";
import heroImage from "../assets/monsoon-hero.png";
import { useAuth } from "../contexts/AuthContext";

const stats = [
  ["Sow or wait", "Plain recommendation"],
  ["7 days", "Rain window"],
  ["30 days", "Delay planner"],
  ["Farm-level", "Crop and location aware"]
];

const features = [
  {
    icon: Sprout,
    title: "A clear sowing call",
    text: "Get a simple SOW or WAIT call for the crop, land size, irrigation status, and market price you enter."
  },
  {
    icon: Gauge,
    title: "Risk in plain words",
    text: "See rain delay, water stress, drought pressure, crop risk, and the overall level without digging through raw data."
  },
  {
    icon: TimerReset,
    title: "Delay planner",
    text: "Move the rain-delay slider from 0 to 30 days and see how yield, income, and risk may shift."
  },
  {
    icon: IndianRupee,
    title: "Money view",
    text: "Compare sowing now with waiting a few days, so the advice connects back to real input costs and expected income."
  },
  {
    icon: CheckCircle2,
    title: "Next steps",
    text: "Turn the recommendation into small, practical tasks like holding fertilizer, readying seed, or checking moisture."
  },
  {
    icon: MessageSquareText,
    title: "Farm question box",
    text: "Ask focused monsoon, sowing, irrigation, or crop-finance questions when the numbers need a little context."
  },
  {
    icon: MapPinned,
    title: "Location view",
    text: "Pin the farm by city or coordinates and keep the rainfall context tied to the actual place you are deciding for."
  },
  {
    icon: BarChart3,
    title: "Reasons, not magic",
    text: "Every call shows the factors behind it, so a farmer can see why the recommendation changed."
  }
];

const workflow = [
  {
    icon: MapPinned,
    title: "Add the farm",
    text: "Start with city, crop, land size, price, and whether protective irrigation is available."
  },
  {
    icon: CloudRain,
    title: "Check the rain",
    text: "The app refreshes current weather, forecast rainfall, and recent rainfall history for that location."
  },
  {
    icon: Gauge,
    title: "Compare the risk",
    text: "Rainfall deficit, crop timing, irrigation buffer, and income impact are weighed together."
  },
  {
    icon: CheckCircle2,
    title: "Plan the day",
    text: "The result becomes a sow-or-wait call, a best window, and a short field checklist."
  }
];

const dataSources = [
  ["Current weather", "Temperature, humidity, rainfall, wind, and cloud cover"],
  ["Forecast rainfall", "Seven-day outlook for the next sowing window"],
  ["Rainfall history", "Historical comparison for deficit and anomaly checks"],
  ["Farm location", "City lookup, coordinates, and map context"]
];

const decisionCards = [
  ["Recommendation", "WAIT", "91% signal strength"],
  ["Rainfall deficit", "42%", "Still high today"],
  ["Better window", "2 Jul - 5 Jul", "Rain chance improves"],
  ["Expected income", "INR 108,000", "If waiting pays off"]
];

const actionPlan = [
  "Wait before sowing",
  "Hold fertilizer for now",
  "Irrigate once if the topsoil is dry",
  "Keep seed and labor ready",
  "Check the rainfall update tomorrow"
];

const faqs = [
  [
    "What does MonsoonMind actually tell me?",
    "It gives a farm-level SOW or WAIT call with signal strength, risk, expected income, and the next few actions to take."
  ],
  [
    "Why should I trust the recommendation?",
    "The call is based on current weather, forecast rainfall, rainfall history, location, crop, irrigation, and price inputs. The dashboard also shows the reasons behind it."
  ],
  [
    "Can I use just a city name?",
    "Yes. A city is enough to start. Latitude and longitude make the location more precise when you have them."
  ],
  [
    "What can I ask the question box?",
    "Keep it to farming and monsoon decisions: sowing, irrigation, rainfall risk, crop timing, and farm finance."
  ]
];

const SectionHeading = ({ eyebrow, title, text, align = "left" }) => (
  <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-field-600">
      {eyebrow}
    </p>
    <h2 className="mt-3 text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl">
      {title}
    </h2>
    {text ? <p className="mt-4 text-base leading-7 text-slate-600">{text}</p> : null}
  </div>
);

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const ctaLink = isAuthenticated ? "/dashboard" : "/register";

  return (
    <div className="min-h-screen bg-field-50 text-slate-950">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/20 bg-field-900/65 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-field-500">
              <Sprout size={22} />
            </span>
            <span className="text-lg font-extrabold">MonsoonMind</span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {[
              ["What it does", "#features"],
              ["How it works", "#workflow"],
              ["Data", "#data"],
              ["FAQ", "#faq"]
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="rounded-full px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-full px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              Sign in
            </Link>
            <Link
              to={ctaLink}
              className="rounded-full bg-white px-4 py-2 text-sm font-extrabold text-slate-950 transition hover:bg-field-100"
            >
              Check a farm
            </Link>
          </div>
        </div>
      </header>

      <section className="relative min-h-screen overflow-hidden bg-field-900 text-white">
        <img
          src={heroImage}
          alt="Farmer checking a field during monsoon season"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-field-900 via-field-900/72 to-field-900/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-field-900 via-transparent to-field-900/25" />
        <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 pb-16 pt-32 sm:px-6 lg:grid-cols-[1fr_0.82fr] lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-field-100 backdrop-blur-md">
              <CloudRain size={16} /> Built for the week the rain keeps changing
            </div>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-6xl">
              Should I sow this week, or wait for better rain?
            </h1>
            <p className="mt-5 max-w-2xl text-xl font-medium text-white/80">
              MonsoonMind helps farmers turn rainfall, crop timing, water access, and price into one clear call.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70">
              Save the farm once, refresh the weather, and get a grounded brief: sow or wait, why it says so, what the risk is, and what to do before the next update.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={ctaLink}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-field-500 px-6 py-3 font-extrabold text-white shadow-lg shadow-field-500/25 transition hover:bg-field-600"
              >
                Check my farm <ArrowRight size={18} />
              </Link>
              <a
                href="#decision-preview"
                className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur transition hover:bg-white/15"
              >
                See an example brief
              </a>
            </div>
            <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map(([value, label]) => (
                <div
                  key={value}
                  className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-md"
                >
                  <p className="text-lg font-extrabold">{value}</p>
                  <p className="mt-1 text-xs font-medium text-white/60">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12, duration: 0.7 }}
            className="hidden rounded-2xl border border-white/20 bg-white/10 p-4 shadow-glow backdrop-blur-xl lg:block"
          >
            <div className="rounded-xl bg-white p-5 text-slate-950">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Example only: Nagpur soybean
                  </p>
                  <p className="mt-2 text-4xl font-extrabold text-sunrisk-500">
                    WAIT
                  </p>
                </div>
                <span className="rounded-full bg-field-50 px-3 py-1 text-sm font-extrabold text-field-600">
                  91% signal strength
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Rainfall is still short for sowing today, but the next window is improving.
                Keep seed and labor ready, hold fertilizer, and check again after the next update.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {decisionCards.map(([label, value, detail]) => (
                  <div key={label} className="rounded-xl bg-field-50 p-4">
                    <p className="text-xs font-semibold text-slate-500">{label}</p>
                    <p className="mt-2 text-lg font-extrabold">{value}</p>
                    <p className="mt-1 text-xs text-slate-500">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-field-50 py-16" id="features">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="What it does"
            title="A farm brief that is easy to act on."
            text="MonsoonMind does not stop at a forecast. It connects rain, timing, risk, and money so the next field decision is easier to make."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {features.map(({ icon: Icon, title, text }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-xl border border-field-100 bg-white p-6 shadow-sm"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-field-100 text-field-600">
                  <Icon size={23} />
                </span>
                <h3 className="mt-5 text-lg font-extrabold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16" id="decision-preview">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <SectionHeading
              eyebrow="Example brief"
              title="The advice is short because the day is busy."
              text="The real dashboard refreshes live weather and rainfall APIs. This preview only shows how the answer is presented."
            />
            <div className="mt-8 space-y-3">
              {actionPlan.map((action) => (
                <div
                  key={action}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <CheckCircle2 className="text-field-600" size={20} />
                  <span className="font-semibold text-slate-800">{action}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-field-900 p-5 text-white shadow-glow">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                [CloudRain, "Rainfall deficit", "42%", "Too high for a relaxed sowing call"],
                [CalendarDays, "Better window", "2 Jul - 5 Jul", "Forecast starts to line up"],
                [TrendingUp, "Expected yield", "94%", "If rain arrives within 5 days"],
                [ShieldCheck, "Overall risk", "Moderate", "Water stress still needs watching"]
              ].map(([Icon, label, value, detail]) => (
                <div key={label} className="rounded-xl bg-white/10 p-5 ring-1 ring-white/10">
                  <Icon className="text-field-100" size={24} />
                  <p className="mt-4 text-sm text-white/60">{label}</p>
                  <p className="mt-1 text-2xl font-extrabold">{value}</p>
                  <p className="mt-2 text-sm text-white/60">{detail}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-white p-5 text-slate-950">
              <p className="text-sm font-bold text-slate-500">
                Money comparison
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-field-50 p-4">
                  <p className="text-sm text-slate-500">Sow today</p>
                  <p className="mt-1 text-xl font-extrabold">INR 83,000</p>
                </div>
                <div className="rounded-xl bg-sunrisk-50 p-4">
                  <p className="text-sm text-slate-500">Wait 7 days</p>
                  <p className="mt-1 text-xl font-extrabold">INR 108,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-skydata-50 py-16" id="workflow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How it works"
            title="From location to a practical call."
            text="The flow is meant to match a real sowing decision: where the farm is, what the rain is doing, what the crop can handle, and what action makes sense today."
            align="center"
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-4">
            {workflow.map(({ icon: Icon, title, text }, index) => (
              <div key={title} className="relative rounded-xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-skydata-100 text-skydata-700">
                    <Icon size={22} />
                  </span>
                  <span className="text-sm font-extrabold text-slate-300">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-extrabold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16" id="data">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div>
            <SectionHeading
              eyebrow="Data behind the call"
              title="Weather and farm inputs stay visible."
              text="The app refreshes climate and location signals, then turns them into a recommendation without hiding the assumptions."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {dataSources.map(([name, text]) => (
                <div key={name} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-3">
                    <RadioTower className="text-skydata-700" size={21} />
                    <p className="font-extrabold">{name}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-field-900 p-6 text-white">
            {[
              [Layers3, "Dashboard", "Charts, maps, risk, scenarios, and history in one place"],
              [DatabaseZap, "Decision services", "Separate services for rainfall, risk, simulation, actions, and income impact"],
              [LockKeyhole, "Saved records", "Protected accounts, farm profiles, recommendations, and simulation history"],
              [Waves, "Fast refresh", "Frequently used weather and location signals are cached for smoother checks"]
            ].map(([Icon, title, text]) => (
              <div key={title} className="border-b border-white/10 py-5 first:pt-0 last:border-0 last:pb-0">
                <div className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-field-100">
                    <Icon size={20} />
                  </span>
                  <div>
                    <p className="font-extrabold">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-white/60">{text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-field-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Made for field decisions"
            title="The dashboard keeps the hard parts readable."
            text="Every panel answers a practical question: what changed, how risky it is, how income shifts, and what action comes next."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              [Droplets, "Monsoon health", "Rainfall trend, anomaly, rolling average, and deficit become a clear health signal."],
              [BadgeCheck, "Signal strength", "Forecast agreement, historical similarity, and data freshness show how much weight to give the call."],
              [CloudRain, "Mobile-first", "The interface stays clear on the phone someone is likely carrying near the field."]
            ].map(([Icon, title, text]) => (
              <div key={title} className="rounded-xl bg-white p-6 shadow-sm">
                <Icon className="text-field-600" size={26} />
                <h3 className="mt-5 text-lg font-extrabold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16" id="faq">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="FAQ"
            title="A few straight answers."
            align="center"
          />
          <div className="mt-10 space-y-4">
            {faqs.map(([question, answer]) => (
              <details
                key={question}
                className="group rounded-xl border border-slate-200 bg-slate-50 p-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-extrabold text-slate-950">
                  {question}
                  <ChevronRight
                    className="shrink-0 transition group-open:rotate-90"
                    size={20}
                  />
                </summary>
                <p className="mt-4 leading-7 text-slate-600">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-field-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-field-100">
                Ready to check the next sowing window?
              </p>
              <h2 className="mt-3 text-3xl font-extrabold">
                Run the farm brief with your own crop and location.
              </h2>
              <p className="mt-3 max-w-2xl text-white/60">
                Save the farm profile, refresh the rain signals, and get a call with risk, income range, signal strength, and next steps.
              </p>
            </div>
            <Link
              to={ctaLink}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-field-500 px-6 py-3 font-extrabold text-white shadow-lg shadow-field-500/20 transition hover:bg-field-600"
            >
              Check my farm <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-field-900 pb-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 px-4 pt-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-field-500">
              <Sprout size={22} />
            </span>
            <div>
              <p className="font-extrabold">MonsoonMind</p>
              <p className="text-sm text-white/50">Sowing decisions for uncertain rain</p>
            </div>
          </Link>
          <p className="text-sm text-white/50">
            Built for monsoon-sensitive farming decisions.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
