import { getCropProfile } from "./cropCalendar.service.js";
import { getObservedRainfallRange } from "./weather.service.js";

const addDays = (date, days) => {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

const toIsoDate = (date) => date.toISOString().slice(0, 10);

const maxConsecutiveDryDays = (daily = [], dryThresholdMm = 2) => {
  let current = 0;
  let longest = 0;

  for (const day of daily) {
    if (Number(day.rainfall || 0) < dryThresholdMm) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }

  return longest;
};

export const buildInitialVerification = (createdAt = new Date()) => ({
  status: "pending",
  dueAt: addDays(new Date(createdAt), 8),
  method: "7-day observed rainfall check"
});

export const evaluateRecommendationOutcome = ({ recommendation, observedRainfall }) => {
  const cropProfile = getCropProfile(recommendation.request?.crop);
  const daily = observedRainfall.daily || [];
  const totalRainfall = daily.reduce((sum, day) => sum + Number(day.rainfall || 0), 0);
  const triggerRainfallMet = daily.some(
    (day) => Number(day.rainfall || 0) >= cropProfile.triggerRainfall
  );
  const sufficientRainfall = totalRainfall >= cropProfile.idealRainfall7Days * 0.65;
  const longestDrySpell = maxConsecutiveDryDays(daily);
  const earlyDrySpell = longestDrySpell >= 4;
  const sowWouldHaveBeenSupported = sufficientRainfall && triggerRainfallMet && !earlyDrySpell;
  const predicted = recommendation.recommendation;
  const correct = predicted === "SOW" ? sowWouldHaveBeenSupported : !sowWouldHaveBeenSupported;

  return {
    status: "verified",
    verifiedAt: new Date(),
    correct,
    observedRainfall7Days: Number(totalRainfall.toFixed(2)),
    triggerRainfallMet,
    sufficientRainfall,
    longestDrySpell,
    observedWindow: observedRainfall.period,
    observedSource: observedRainfall.source,
    reason: correct
      ? `The ${predicted} call matched the observed 7-day rainfall support.`
      : `The ${predicted} call did not match the observed 7-day rainfall support.`
  };
};

export const verifyRecommendationOutcome = async (recommendation) => {
  const createdAt = recommendation.createdAt || new Date();
  const start = toIsoDate(createdAt);
  const end = toIsoDate(addDays(new Date(createdAt), 7));
  const location = recommendation.decision?.weather?.current?.location ||
    recommendation.decision?.weather?.forecast?.location ||
    recommendation.request;

  const observedRainfall = await getObservedRainfallRange(location, { start, end });
  return evaluateRecommendationOutcome({ recommendation, observedRainfall });
};