const sum = (values) => values.reduce((total, value) => total + value, 0);

export const calculateRainfallTrend = (dailyForecast = []) => {
  if (dailyForecast.length < 4) return "insufficient-data";

  const firstHalf = dailyForecast.slice(0, 3).map((day) => day.rainfall || 0);
  const secondHalf = dailyForecast.slice(3, 7).map((day) => day.rainfall || 0);
  const firstAverage = sum(firstHalf) / firstHalf.length;
  const secondAverage = sum(secondHalf) / secondHalf.length;
  const delta = secondAverage - firstAverage;

  if (delta > 3) return "improving";
  if (delta < -3) return "weakening";
  return "stable";
};

export const rollingAverage = (dailyForecast = [], windowSize = 3) =>
  dailyForecast.map((day, index) => {
    const window = dailyForecast
      .slice(Math.max(0, index - windowSize + 1), index + 1)
      .map((item) => item.rainfall || 0);
    return {
      date: day.date,
      rainfall: day.rainfall || 0,
      rollingAverage: Number((sum(window) / window.length).toFixed(2))
    };
  });

export const calculateRainfallMetrics = ({
  forecast,
  historical,
  idealRainfall7Days
}) => {
  const daily = forecast?.daily || [];
  const forecastRainfall7Days = sum(daily.map((day) => day.rainfall || 0));
  const cropDeficit =
    idealRainfall7Days > 0
      ? Math.max(
          0,
          ((idealRainfall7Days - forecastRainfall7Days) / idealRainfall7Days) *
            100
        )
      : null;

  const historical7DayNormal =
    historical?.available && historical.averageDailyRainfall !== null
      ? historical.averageDailyRainfall * 7
      : null;

  const anomaly =
    historical7DayNormal && historical7DayNormal > 0
      ? ((forecastRainfall7Days - historical7DayNormal) / historical7DayNormal) *
        100
      : null;

  const trend = calculateRainfallTrend(daily);
  const nextRainIndex = daily.findIndex((day) => (day.rainfall || 0) >= 8);

  return {
    rainfallDeficit: cropDeficit === null ? null : Number(cropDeficit.toFixed(1)),
    forecastRainfall7Days: Number(forecastRainfall7Days.toFixed(2)),
    historical7DayNormal:
      historical7DayNormal === null
        ? null
        : Number(historical7DayNormal.toFixed(2)),
    rainfallAnomaly: anomaly === null ? null : Number(anomaly.toFixed(1)),
    rainfallTrend: trend,
    rollingAverage: rollingAverage(daily),
    expectedRainfallWindow:
      nextRainIndex === -1
        ? "No reliable 7-day rainfall window"
        : `${nextRainIndex}-${Math.min(nextRainIndex + 2, 7)} Days`,
    rainDelayDays: nextRainIndex === -1 ? 30 : nextRainIndex
  };
};
