interface CompanionPlantData {
  plant: string;
  companions: string[];
  avoids: string[];
  benefits: string;
}

export const companionPlantingData: Record<string, CompanionPlantData> = {
  "tomato": {
    plant: "tomato",
    companions: ["basil", "marigold", "carrot", "onion", "parsley"],
    avoids: ["potato", "corn", "cabbage", "broccoli"],
    benefits: "Basil improves flavor and repels pests. Marigolds deter nematodes."
  },
  "carrot": {
    plant: "carrot",
    companions: ["tomato", "onion", "leek", "rosemary", "peas"],
    avoids: ["dill", "parsley", "celery"],
    benefits: "Onions and leeks help repel carrot flies. Peas provide nitrogen."
  },
  "lettuce": {
    plant: "lettuce",
    companions: ["carrot", "radish", "cucumber", "onion"],
    avoids: ["broccoli", "cabbage", "beans"],
    benefits: "Tall companions provide shade in hot weather."
  },
  "cucumber": {
    plant: "cucumber",
    companions: ["beans", "corn", "peas", "radish", "sunflowers"],
    avoids: ["potato", "squash"],
    benefits: "Corn and sunflowers provide support. Radishes deter cucumber beetles."
  },
  "pepper": {
    plant: "pepper",
    companions: ["basil", "onion", "carrot", "tomato"],
    avoids: ["beans", "cabbage", "broccoli"],
    benefits: "Basil improves flavor and growth. Onions deter pests."
  },
  "beans": {
    plant: "beans",
    companions: ["corn", "cucumber", "potato", "squash"],
    avoids: ["onion", "garlic", "pepper"],
    benefits: "Fixes nitrogen in soil. Corn provides support for climbing."
  },
  "onion": {
    plant: "onion",
    companions: ["tomato", "pepper", "lettuce", "carrot"],
    avoids: ["beans", "peas", "squash"],
    benefits: "Deters many garden pests with strong scent."
  },
  "broccoli": {
    plant: "broccoli",
    companions: ["potato", "onion", "cucumber"],
    avoids: ["tomato", "pepper", "squash"],
    benefits: "Benefits from onion's pest-deterrent properties."
  },
  "cabbage": {
    plant: "cabbage",
    companions: ["potato", "onion", "herbs"],
    avoids: ["tomato", "pepper", "beans"],
    benefits: "Herbs help deter cabbage moths and other pests."
  },
  "peas": {
    plant: "peas",
    companions: ["carrot", "cucumber", "corn", "radish"],
    avoids: ["onion", "garlic", "potato"],
    benefits: "Fixes nitrogen in soil. Supports beneficial insects."
  },
  "potato": {
    plant: "potato",
    companions: ["beans", "corn", "cabbage", "peas"],
    avoids: ["tomato", "cucumber", "squash"],
    benefits: "Benefits from nitrogen-fixing beans and peas."
  },
  "squash": {
    plant: "squash",
    companions: ["corn", "beans", "radish"],
    avoids: ["potato", "cucumber"],
    benefits: "Part of Three Sisters planting with corn and beans."
  },
  "basil": {
    plant: "basil",
    companions: ["tomato", "pepper", "lettuce"],
    avoids: ["cucumber", "squash"],
    benefits: "Improves growth and flavor of tomatoes and peppers."
  },
  "corn": {
    plant: "corn",
    companions: ["beans", "squash", "cucumber", "peas"],
    avoids: ["tomato"],
    benefits: "Provides support for climbing plants. Part of Three Sisters."
  },
  "eggplant": {
    plant: "eggplant",
    companions: ["beans", "pepper", "potato"],
    avoids: ["tomato"],
    benefits: "Benefits from similar growing conditions as peppers."
  }
};

export const findCompanionData = (plantName: string): CompanionPlantData | null => {
  const normalizedName = plantName.toLowerCase();
  return companionPlantingData[normalizedName] || null;
};