export interface GardenVegetable {
  id: string;
  name: string;
  binomialName: string;
  description: string;
  sunRequirements: string;
  sowingMethod: string;
  height?: number;
  sowingDates: {
    [key: string]: string;
  };
}

export const gardenVegetables: GardenVegetable[] = [
  {
    id: "1",
    name: "tomato",
    binomialName: "Solanum lycopersicum",
    description: "A warm-season crop and popular garden vegetable",
    sunRequirements: "Full sun",
    sowingMethod: "Direct seed or transplant",
    height: 150,
    sowingDates: {
      "3": "Late May to early June",
      "4": "Mid-May to early June",
      "5": "Early to mid-May",
      "6": "April to early May",
      "7": "March to April",
      "8": "February to March",
      "9": "January to February"
    }
  },
  {
    id: "2",
    name: "carrot",
    binomialName: "Daucus carota",
    description: "Root vegetable, perfect for most gardens",
    sunRequirements: "Full sun to partial shade",
    sowingMethod: "Direct seed",
    height: 30,
    sowingDates: {
      "3": "April to May",
      "4": "March to April",
      "5": "February to March",
      "6": "N/A",
      "7": "N/A",
      "8": "N/A",
      "9": "N/A"
    }
  },
  {
    id: "3",
    name: "lettuce",
    binomialName: "Lactuca sativa",
    description: "Cool-season crop, easy to grow",
    sunRequirements: "Partial shade to full sun",
    sowingMethod: "Direct seed",
    height: 25,
    sowingDates: {
      "3": "March to April",
      "4": "February to March",
      "5": "N/A",
      "6": "N/A",
      "7": "N/A",
      "8": "N/A",
      "9": "N/A"
    }
  },
  {
    id: "4",
    name: "cucumber",
    binomialName: "Cucumis sativus",
    description: "Climbing vine producing crisp vegetables",
    sunRequirements: "Full sun",
    sowingMethod: "Direct seed or transplant",
    height: 200,
    sowingDates: {
      "3": "Late May to early June",
      "4": "Mid-May to early June",
      "5": "Early to mid-May",
      "6": "April to early May",
      "7": "March to April",
      "8": "February to March",
      "9": "January to February"
    }
  },
  {
    id: "5",
    name: "pepper",
    binomialName: "Capsicum annuum",
    description: "Warm-season vegetable with various varieties",
    sunRequirements: "Full sun",
    sowingMethod: "Transplant",
    height: 100,
    sowingDates: {
      "3": "N/A",
      "4": "Late May to early June",
      "5": "Mid-May to early June",
      "6": "April to early May",
      "7": "March to April",
      "8": "February to March",
      "9": "January to February"
    }
  },
  {
    id: "6",
    name: "beans",
    binomialName: "Phaseolus vulgaris",
    description: "Nitrogen-fixing legume, available in bush or pole varieties",
    sunRequirements: "Full sun",
    sowingMethod: "Direct seed",
    height: 180,
    sowingDates: {
      "3": "Late May to early June",
      "4": "Mid-May to early June",
      "5": "Early to mid-May",
      "6": "April to early May",
      "7": "March to April",
      "8": "February to March",
      "9": "January to February"
    }
  },
  {
    id: "7",
    name: "onion",
    binomialName: "Allium cepa",
    description: "Essential root vegetable with strong flavor",
    sunRequirements: "Full sun",
    sowingMethod: "Direct seed or transplant",
    height: 45,
    sowingDates: {
      "3": "March to April",
      "4": "February to March",
      "5": "N/A",
      "6": "N/A",
      "7": "N/A",
      "8": "N/A",
      "9": "N/A"
    }
  },
  {
    id: "8",
    name: "broccoli",
    binomialName: "Brassica oleracea var. italica",
    description: "Nutritious cole crop with edible flowers",
    sunRequirements: "Full sun",
    sowingMethod: "Transplant",
    height: 60,
    sowingDates: {
      "3": "April to May",
      "4": "March to April",
      "5": "February to March",
      "6": "N/A",
      "7": "N/A",
      "8": "N/A",
      "9": "N/A"
    }
  },
  {
    id: "9",
    name: "cabbage",
    binomialName: "Brassica oleracea var. capitata",
    description: "Hardy cole crop with compact heads",
    sunRequirements: "Full sun",
    sowingMethod: "Transplant",
    height: 40,
    sowingDates: {
      "3": "April to May",
      "4": "March to April",
      "5": "February to March",
      "6": "N/A",
      "7": "N/A",
      "8": "N/A",
      "9": "N/A"
    }
  },
  {
    id: "10",
    name: "peas",
    binomialName: "Pisum sativum",
    description: "Cool-season legume, great for early planting",
    sunRequirements: "Full sun to partial shade",
    sowingMethod: "Direct seed",
    height: 180,
    sowingDates: {
      "3": "March to April",
      "4": "February to March",
      "5": "N/A",
      "6": "N/A",
      "7": "N/A",
      "8": "N/A",
      "9": "N/A"
    }
  },
  {
    id: "11",
    name: "potato",
    binomialName: "Solanum tuberosum",
    description: "Starchy tuber, staple food crop",
    sunRequirements: "Full sun",
    sowingMethod: "Direct seed",
    height: 60,
    sowingDates: {
      "3": "April to May",
      "4": "March to April",
      "5": "February to March",
      "6": "N/A",
      "7": "N/A",
      "8": "N/A",
      "9": "N/A"
    }
  },
  {
    id: "12",
    name: "squash",
    binomialName: "Cucurbita species",
    description: "Sprawling vine with variety of fruit types",
    sunRequirements: "Full sun",
    sowingMethod: "Direct seed",
    height: 90,
    sowingDates: {
      "3": "Late May to early June",
      "4": "Mid-May to early June",
      "5": "Early to mid-May",
      "6": "April to early May",
      "7": "March to April",
      "8": "February to March",
      "9": "January to February"
    }
  },
  {
    id: "13",
    name: "basil",
    binomialName: "Ocimum basilicum",
    description: "Aromatic herb, great companion plant",
    sunRequirements: "Full sun",
    sowingMethod: "Direct seed or transplant",
    height: 60,
    sowingDates: {
      "3": "N/A",
      "4": "Late May to early June",
      "5": "Mid-May to early June",
      "6": "April to early May",
      "7": "March to April",
      "8": "February to March",
      "9": "January to February"
    }
  },
  {
    id: "14",
    name: "corn",
    binomialName: "Zea mays",
    description: "Tall grain crop, heavy feeder",
    sunRequirements: "Full sun",
    sowingMethod: "Direct seed",
    height: 240,
    sowingDates: {
      "3": "N/A",
      "4": "Late May to early June",
      "5": "Mid-May to early June",
      "6": "April to early May",
      "7": "March to April",
      "8": "February to March",
      "9": "January to February"
    }
  },
  {
    id: "15",
    name: "eggplant",
    binomialName: "Solanum melongena",
    description: "Warm-season crop from nightshade family",
    sunRequirements: "Full sun",
    sowingMethod: "Transplant",
    height: 90,
    sowingDates: {
      "3": "N/A",
      "4": "Late May to early June",
      "5": "Mid-May to early June",
      "6": "April to early May",
      "7": "March to April",
      "8": "February to March",
      "9": "January to February"
    }
  }
];

export const hardinessZones = [
  { value: "3", label: "Zone 3 (-40°F to -30°F)" },
  { value: "4", label: "Zone 4 (-30°F to -20°F)" },
  { value: "5", label: "Zone 5 (-20°F to -10°F)" },
  { value: "6", label: "Zone 6 (-10°F to 0°F)" },
  { value: "7", label: "Zone 7 (0°F to 10°F)" },
  { value: "8", label: "Zone 8 (10°F to 20°F)" },
  { value: "9", label: "Zone 9 (20°F to 30°F)" }
];
