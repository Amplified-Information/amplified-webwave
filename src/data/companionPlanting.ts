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
    avoids: ["potato", "cabbage", "fennel"],
    benefits: "Basil improves flavor and repels pests. Marigolds deter nematodes."
  },
  "carrot": {
    plant: "carrot",
    companions: ["tomato", "onion", "leek", "rosemary", "sage"],
    avoids: ["dill", "parsley", "celery"],
    benefits: "Onions and leeks help repel carrot flies."
  },
  "lettuce": {
    plant: "lettuce",
    companions: ["carrot", "radish", "cucumber", "strawberry"],
    avoids: ["celery", "parsley", "broccoli"],
    benefits: "Tall companions provide shade in hot weather."
  },
  "cucumber": {
    plant: "cucumber",
    companions: ["beans", "corn", "peas", "radish", "sunflowers"],
    avoids: ["potato", "aromatic herbs"],
    benefits: "Radishes deter cucumber beetles. Sunflowers provide support."
  },
  "pepper": {
    plant: "pepper",
    companions: ["basil", "onion", "carrot", "tomato"],
    avoids: ["fennel", "kohlrabi", "beans"],
    benefits: "Basil improves flavor and growth. Onions deter pests."
  }
};

export const findCompanionData = (plantName: string): CompanionPlantData | null => {
  const normalizedName = plantName.toLowerCase();
  return companionPlantingData[normalizedName] || null;
};