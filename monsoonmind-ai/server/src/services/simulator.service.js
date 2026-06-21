import { getCropProfile } from "./cropCalendar.service.js";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const toAcres = (landSize, landUnit = "acre") =>
  landUnit === "hectare" ? Number(landSize) * 2.47105 : Number(landSize);

export const simulateRainDelay = ({
  crop,
  landSize,
  landUnit,
  irrigationAvailable,
  expectedMarketPrice,
  rainDelay = 0
}) => {
  const profile = getCropProfile(crop);
  const acres = toAcres(landSize || 1, landUnit);
  const delay = clamp(Number(rainDelay || 0), 0, 30);
  const irrigationBuffer = irrigationAvailable ? 0.45 : 0;
  const delayImpact =
    Math.pow(delay / 30, 1.25) * profile.waterSensitivity * (1 - irrigationBuffer);
  const yieldPercent = clamp(100 - delayImpact * 58, 35, 100);
  const risk = clamp(delay * 2.25 + (irrigationAvailable ? -12 : 8), 5, 95);
  const yieldAmount =
    profile.baseYieldPerAcre * acres * (yieldPercent / 100);
  const income = yieldAmount * Number(expectedMarketPrice || 0);

  return {
    rainDelay: delay,
    crop: profile.label,
    yieldPercent: Math.round(yieldPercent),
    yield: Number(yieldAmount.toFixed(2)),
    income: Math.round(income),
    risk: Math.round(risk),
    recommendation:
      delay <= 7
        ? "SOW"
        : delay <= 15
          ? "WAIT_AND_PREPARE"
          : "DELAY_HIGH_RISK"
  };
};

export const generateScenarioCurve = (input) => ({
  selected: simulateRainDelay(input),
  curve: Array.from({ length: 31 }, (_, day) =>
    simulateRainDelay({ ...input, rainDelay: day })
  ).filter((_, index) => index % 5 === 0 || index === Number(input.rainDelay || 0))
});
