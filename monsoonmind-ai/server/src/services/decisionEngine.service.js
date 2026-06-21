import { calculateRainfallMetrics } from "./rainfall.service.js";
import { getCropProfile } from "./cropCalendar.service.js";
import { simulateRainDelay } from "./simulator.service.js";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const formatShortDate = (date) =>
  date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

const toAcres = (landSize, landUnit = "acre") =>
  landUnit === "hectare" ? Number(landSize) * 2.47105 : Number(landSize);

const temperatureScore = (temperature) => {
  if (temperature === undefined || Number.isNaN(temperature)) return 70;
  if (temperature >= 24 && temperature <= 32) return 100;
  if (temperature >= 20 && temperature <= 36) return 78;
  return 55;
};

const getBestWindow = (rainDelayDays, recommendation) => {
  const startOffset = recommendation === "SOW" ? Math.max(0, rainDelayDays) : 7;
  const start = addDays(new Date(), startOffset);
  const end = addDays(start, 3);
  return `${formatShortDate(start)} - ${formatShortDate(end)}`;
};

const buildActionPlan = ({ recommendation, metrics, risk, irrigationAvailable }) => {
  const actions = [];

  if (recommendation === "WAIT") {
    actions.push({
      title: "Wait before sowing",
      why: `The 7-day rainfall outlook is below the crop threshold with ${metrics.rainfallDeficit}% deficit.`
    });
    actions.push({
      title: "Keep seeds and labor ready",
      why: `The expected rainfall window is ${metrics.expectedRainfallWindow}, so readiness matters more than early sowing.`
    });
    actions.push({
      title: "Avoid fertilizer application today",
      why: "Weak soil moisture can waste fertilizer and increase input loss before germination."
    });
  } else {
    actions.push({
      title: "Sow in the recommended window",
      why: "Forecast rainfall and current monsoon readiness support germination risk."
    });
    actions.push({
      title: "Apply basal nutrients after soil wetting",
      why: "Nutrient uptake improves when the seedbed has reliable moisture."
    });
  }

  if (irrigationAvailable && risk.waterStress > 35) {
    actions.push({
      title: "Irrigate once before sowing",
      why: "Available irrigation can bridge the rainfall gap and reduce water stress."
    });
  }

  actions.push({
    title: "Monitor rainfall update daily",
    why: "Forecast signals change quickly during monsoon onset and can change the decision."
  });

  return actions;
};

const buildRisk = ({ metrics, rainDelayDays, irrigationAvailable }) => {
  const rainfallDeficit = metrics.rainfallDeficit ?? 50;
  const rainDelay = clamp((rainDelayDays / 30) * 100, 0, 100);
  const cropRisk = clamp(rainfallDeficit * 0.65 + rainDelay * 0.35, 0, 100);
  const waterStress = clamp(
    rainfallDeficit * (irrigationAvailable ? 0.55 : 1.05),
    0,
    100
  );
  const droughtRisk = clamp(
    (metrics.rainfallAnomaly !== null ? -metrics.rainfallAnomaly : rainfallDeficit) *
      0.75,
    0,
    100
  );
  const monsoonHealth = clamp(100 - rainfallDeficit * 0.8 - rainDelay * 0.25, 0, 100);
  const overallRiskScore = clamp(
    cropRisk * 0.35 + waterStress * 0.25 + droughtRisk * 0.2 + rainDelay * 0.2,
    0,
    100
  );

  return {
    monsoonHealth: Math.round(monsoonHealth),
    rainDelay: Math.round(rainDelay),
    cropRisk: Math.round(cropRisk),
    waterStress: Math.round(waterStress),
    droughtRisk: Math.round(droughtRisk),
    overallRiskScore: Math.round(overallRiskScore),
    level:
      overallRiskScore < 35 ? "Low" : overallRiskScore < 65 ? "Moderate" : "High"
  };
};

const buildFinancialImpact = (input) => {
  const sowToday = simulateRainDelay({ ...input, rainDelay: 0 });
  const waitSevenDays = simulateRainDelay({ ...input, rainDelay: 7 });
  return {
    optionA: {
      label: "Sow Today",
      yield: sowToday.yield,
      income: sowToday.income
    },
    optionB: {
      label: "Wait 7 Days",
      yield: waitSevenDays.yield,
      income: waitSevenDays.income
    },
    potentialAdditionalIncome: waitSevenDays.income - sowToday.income,
    recommendation:
      waitSevenDays.income >= sowToday.income
        ? "Wait 7 days to reduce germination risk."
        : "Sow today if field moisture is adequate."
  };
};

export const generateDecision = ({
  weatherBundle,
  crop,
  landSize,
  landUnit = "acre",
  irrigationAvailable,
  expectedMarketPrice
}) => {
  const profile = getCropProfile(crop);
  const acres = toAcres(landSize || 1, landUnit);
  const irrigationCredit = irrigationAvailable ? 18 : 0;
  const metrics = calculateRainfallMetrics({
    forecast: weatherBundle.forecast,
    historical: weatherBundle.historical,
    idealRainfall7Days: profile.idealRainfall7Days
  });

  const tempScore = temperatureScore(weatherBundle.current?.temperature);
  const rainDelayDays = metrics.rainDelayDays;
  const risk = buildRisk({ metrics, rainDelayDays, irrigationAvailable });
  const readinessScore = clamp(
    (100 - (metrics.rainfallDeficit ?? 55)) * 0.55 +
      tempScore * 0.2 +
      (100 - risk.waterStress) * 0.15 +
      irrigationCredit,
    0,
    100
  );

  const recommendation =
    readinessScore >= 68 && rainDelayDays <= 7 && risk.overallRiskScore < 68
      ? "SOW"
      : "WAIT";

  const yieldFactor = clamp(
    1 - risk.overallRiskScore / 160 + (irrigationAvailable ? 0.08 : 0),
    0.42,
    1.05
  );
  const expectedYield = profile.baseYieldPerAcre * acres * yieldFactor;
  const expectedIncome = expectedYield * Number(expectedMarketPrice || 0);
  const historicalSignal = weatherBundle.historical?.available ? 12 : 0;
  const dataFreshnessSignal = weatherBundle.current?.generatedAt ? 10 : 4;
  const signalStrength = clamp(
    58 +
      historicalSignal +
      dataFreshnessSignal +
      (100 - risk.overallRiskScore) * 0.22,
    35,
    96
  );
  const uncertaintyFactor = clamp(
    0.18 +
      risk.overallRiskScore / 1000 +
      (weatherBundle.historical?.available ? 0 : 0.08),
    0.16,
    0.38
  );
  const expectedYieldRange = {
    low: Number((expectedYield * (1 - uncertaintyFactor)).toFixed(2)),
    high: Number((expectedYield * (1 + uncertaintyFactor)).toFixed(2))
  };
  const expectedIncomeRange = {
    low: Math.round(expectedIncome * (1 - uncertaintyFactor)),
    high: Math.round(expectedIncome * (1 + uncertaintyFactor))
  };
  const confidenceCalibration = {
    status: "uncalibrated",
    displayLabel: "Signal strength",
    message:
      "This is not a proven probability yet. It becomes calibrated after enough recommendations are verified against observed rainfall.",
    minimumVerifiedRecommendations: 500
  };

  const baseInput = {
    crop,
    landSize,
    landUnit,
    irrigationAvailable,
    expectedMarketPrice
  };

  return {
    recommendation,
    confidence: Math.round(signalStrength),
    signalStrength: Math.round(signalStrength),
    confidenceCalibration,
    rainfallDeficit: metrics.rainfallDeficit,
    rainfallTrend: metrics.rainfallTrend,
    rainfallAnomaly: metrics.rainfallAnomaly,
    expectedRainfallWindow: metrics.expectedRainfallWindow,
    bestSowingWindow: getBestWindow(rainDelayDays, recommendation),
    reason:
      recommendation === "SOW"
        ? "Rainfall timing, temperature, and field water risk are aligned for sowing."
        : "The current rainfall window is not strong enough to protect germination and early crop establishment.",
    alternativeRecommendation:
      recommendation === "SOW"
        ? "If rainfall slips by more than 7 days, pause sowing and irrigate before resuming."
        : irrigationAvailable
          ? "Use one protective irrigation and reassess after the next forecast update."
          : "Wait for a stronger rainfall signal before sowing.",
    expectedYield: Number(expectedYield.toFixed(2)),
    expectedYieldRange,
    expectedIncome: Math.round(expectedIncome),
    expectedIncomeRange,
    cropUnit: profile.priceUnit,
    weather: {
      current: weatherBundle.current,
      forecast: weatherBundle.forecast,
      historical: weatherBundle.historical
    },
    risk: {
      ...risk,
      confidence: Math.round(signalStrength),
      signalStrength: Math.round(signalStrength)
    },
    actionPlan: buildActionPlan({
      recommendation,
      metrics,
      risk,
      irrigationAvailable
    }),
    financialImpact: buildFinancialImpact(baseInput),
    explainability: [
      {
        factor: "Rainfall Deficit",
        weight: 35,
        value: metrics.rainfallDeficit ?? 0
      },
      {
        factor: "Historical Pattern",
        weight: 20,
        value: weatherBundle.historical?.available
          ? clamp(100 + (metrics.rainfallAnomaly ?? 0), 0, 100)
          : 0
      },
      {
        factor: "Soil Moisture Proxy",
        weight: 15,
        value: clamp(
          (weatherBundle.current?.humidity || 50) * 0.6 +
            metrics.forecastRainfall7Days,
          0,
          100
        )
      },
      {
        factor: "Forecast Signal",
        weight: 20,
        value: clamp(
          100 - Math.abs((metrics.rainfallAnomaly ?? 0) * 0.3) - rainDelayDays,
          35,
          100
        )
      },
      {
        factor: "Irrigation Buffer",
        weight: 10,
        value: irrigationAvailable ? 100 : 25
      }
    ],
    confidenceMeter: {
      recommendation,
      confidence: Math.round(signalStrength),
      signalStrength: Math.round(signalStrength),
      calibrationStatus: confidenceCalibration.status,
      calibrationMessage: confidenceCalibration.message,
      forecastAgreement:
        risk.overallRiskScore < 35
          ? "High"
          : risk.overallRiskScore < 65
            ? "Medium"
            : "Low",
      historicalSimilarity:
        metrics.rainfallAnomaly === null
          ? "Unavailable"
          : `${clamp(100 - Math.abs(metrics.rainfallAnomaly), 0, 100).toFixed(0)}%`,
      dataFreshness: weatherBundle.current?.generatedAt
        ? `Updated ${Math.max(
            1,
            Math.round(
              (Date.now() - new Date(weatherBundle.current.generatedAt).getTime()) /
                60000
            )
          )} minutes ago`
        : "Updated from live API cache"
    },
    simulatorPreview: simulateRainDelay({
      ...baseInput,
      rainDelay: rainDelayDays
    })
  };
};

export const buildDecisionTimeline = (previousDecision, currentDecision) => {
  const previous = previousDecision?.decision || null;
  return [
    {
      label: previousDecision ? "Previous Run" : "Baseline",
      recommendation: previous?.recommendation || "WAIT",
      reason: previous?.reason || "Earlier rainfall signal was weaker.",
      changedAt: previousDecision?.createdAt || null
    },
    {
      label: "Current Run",
      recommendation: currentDecision.recommendation,
      reason: currentDecision.reason,
      changedAt: new Date().toISOString()
    }
  ];
};
