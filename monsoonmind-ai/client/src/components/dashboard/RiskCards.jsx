import {
  CloudRain,
  Droplets,
  Gauge,
  ShieldAlert,
  Sprout,
  Waves
} from "lucide-react";
import MetricCard from "../ui/MetricCard";

const riskItems = [
  {
    label: "Monsoon health",
    key: "monsoonHealth",
    icon: CloudRain,
    inverted: true,
    good: "Rain support looks healthy",
    watch: "Rain support is uneven",
    bad: "Rain support is weak"
  },
  {
    label: "Rain delay risk",
    key: "rainDelay",
    icon: Gauge,
    good: "Rain delay is manageable",
    watch: "Delay needs watching",
    bad: "Delay can hurt germination"
  },
  {
    label: "Crop risk",
    key: "cropRisk",
    icon: Sprout,
    good: "Crop timing looks okay",
    watch: "Crop timing needs care",
    bad: "Crop timing is risky"
  },
  {
    label: "Water stress",
    key: "waterStress",
    icon: Droplets,
    good: "Soil water stress is low",
    watch: "Keep moisture in mind",
    bad: "Water stress is high"
  },
  {
    label: "Drought risk",
    key: "droughtRisk",
    icon: Waves,
    good: "Drought risk is low",
    watch: "Dry spell risk is present",
    bad: "Dry spell risk is high"
  },
  {
    label: "Overall risk",
    key: "overallRiskScore",
    icon: ShieldAlert,
    good: "Decision looks safer",
    watch: "Decide carefully",
    bad: "Avoid rushing inputs"
  }
];

const riskLevel = (value, inverted = false) => {
  if (value === undefined || value === null) {
    return {
      badge: "Check needed",
      tone: "dark",
      detail: "Run a farm check first."
    };
  }

  const score = Number(value);
  if (inverted) {
    if (score >= 70) return { badge: "Good", tone: "green" };
    if (score >= 45) return { badge: "Watch", tone: "yellow" };
    return { badge: "High concern", tone: "red" };
  }

  if (score < 35) return { badge: "Low", tone: "green" };
  if (score < 65) return { badge: "Watch", tone: "yellow" };
  return { badge: "High", tone: "red" };
};

const riskMessage = (item, value) => {
  if (value === undefined || value === null) return "This will update after the farm check.";
  const score = Number(value);

  if (item.inverted) {
    if (score >= 70) return item.good;
    if (score >= 45) return item.watch;
    return item.bad;
  }

  if (score < 35) return item.good;
  if (score < 65) return item.watch;
  return item.bad;
};

const RiskCards = ({ risk }) => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    {riskItems.map((item) => {
      const value = risk?.[item.key];
      const level = riskLevel(value, item.inverted);
      const displayValue = value !== undefined && value !== null ? `${value}/100` : "--";
      const detail =
        item.key === "overallRiskScore" && risk?.level
          ? `${risk.level} overall risk. ${riskMessage(item, value)}`
          : riskMessage(item, value);

      return (
        <MetricCard
          key={item.key}
          icon={item.icon}
          label={item.label}
          value={displayValue}
          badge={level.badge}
          detail={detail}
          hint={item.inverted ? "Higher score is better" : "Lower score is better"}
          tone={level.tone}
        />
      );
    })}
  </div>
);

export default RiskCards;