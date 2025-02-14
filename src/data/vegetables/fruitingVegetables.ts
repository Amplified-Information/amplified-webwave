
import { GardenVegetable } from "@/types/gardenTypes";

export const fruitingVegetables: GardenVegetable[] = [
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
  }
];
