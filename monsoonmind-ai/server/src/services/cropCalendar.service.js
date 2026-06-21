export const cropProfiles = {
  rice: {
    label: "Rice",
    idealRainfall7Days: 55,
    triggerRainfall: 12,
    baseYieldPerAcre: 22,
    sowingStartMonth: 6,
    sowingEndMonth: 7,
    priceUnit: "quintal",
    waterSensitivity: 0.95
  },
  cotton: {
    label: "Cotton",
    idealRainfall7Days: 35,
    triggerRainfall: 8,
    baseYieldPerAcre: 10,
    sowingStartMonth: 6,
    sowingEndMonth: 7,
    priceUnit: "quintal",
    waterSensitivity: 0.8
  },
  soybean: {
    label: "Soybean",
    idealRainfall7Days: 32,
    triggerRainfall: 8,
    baseYieldPerAcre: 9,
    sowingStartMonth: 6,
    sowingEndMonth: 7,
    priceUnit: "quintal",
    waterSensitivity: 0.75
  },
  maize: {
    label: "Maize",
    idealRainfall7Days: 30,
    triggerRainfall: 7,
    baseYieldPerAcre: 24,
    sowingStartMonth: 6,
    sowingEndMonth: 7,
    priceUnit: "quintal",
    waterSensitivity: 0.7
  },
  groundnut: {
    label: "Groundnut",
    idealRainfall7Days: 28,
    triggerRainfall: 7,
    baseYieldPerAcre: 11,
    sowingStartMonth: 6,
    sowingEndMonth: 7,
    priceUnit: "quintal",
    waterSensitivity: 0.7
  },
  pulses: {
    label: "Pulses",
    idealRainfall7Days: 22,
    triggerRainfall: 5,
    baseYieldPerAcre: 7,
    sowingStartMonth: 6,
    sowingEndMonth: 8,
    priceUnit: "quintal",
    waterSensitivity: 0.6
  }
};

export const getCropProfile = (crop = "soybean") => {
  const key = String(crop).toLowerCase();
  return cropProfiles[key] || {
    label: crop || "Crop",
    idealRainfall7Days: 30,
    triggerRainfall: 8,
    baseYieldPerAcre: 10,
    sowingStartMonth: 6,
    sowingEndMonth: 7,
    priceUnit: "quintal",
    waterSensitivity: 0.75
  };
};
