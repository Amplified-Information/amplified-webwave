export interface GardenVegetable {
  id: string;
  name: string;
  binomialName: string;
  description: string;
  sunRequirements: string;
  sowingMethod: string;
  height?: number;
}

export const gardenVegetables: GardenVegetable[] = [
  {
    id: "1",
    name: "tomato",
    binomialName: "Solanum lycopersicum",
    description: "A warm-season crop and popular garden vegetable",
    sunRequirements: "Full sun",
    sowingMethod: "Direct seed or transplant",
    height: 150
  },
  {
    id: "2",
    name: "carrot",
    binomialName: "Daucus carota",
    description: "Root vegetable, perfect for most gardens",
    sunRequirements: "Full sun to partial shade",
    sowingMethod: "Direct seed",
    height: 30
  },
  {
    id: "3",
    name: "lettuce",
    binomialName: "Lactuca sativa",
    description: "Cool-season crop, easy to grow",
    sunRequirements: "Partial shade to full sun",
    sowingMethod: "Direct seed",
    height: 25
  },
  {
    id: "4",
    name: "cucumber",
    binomialName: "Cucumis sativus",
    description: "Climbing vine producing crisp vegetables",
    sunRequirements: "Full sun",
    sowingMethod: "Direct seed or transplant",
    height: 200
  },
  {
    id: "5",
    name: "pepper",
    binomialName: "Capsicum annuum",
    description: "Warm-season vegetable with various varieties",
    sunRequirements: "Full sun",
    sowingMethod: "Transplant",
    height: 100
  },
  {
    id: "6",
    name: "beans",
    binomialName: "Phaseolus vulgaris",
    description: "Nitrogen-fixing legume, available in bush or pole varieties",
    sunRequirements: "Full sun",
    sowingMethod: "Direct seed",
    height: 180
  },
  {
    id: "7",
    name: "onion",
    binomialName: "Allium cepa",
    description: "Essential root vegetable with strong flavor",
    sunRequirements: "Full sun",
    sowingMethod: "Direct seed or transplant",
    height: 45
  },
  {
    id: "8",
    name: "broccoli",
    binomialName: "Brassica oleracea var. italica",
    description: "Nutritious cole crop with edible flowers",
    sunRequirements: "Full sun",
    sowingMethod: "Transplant",
    height: 60
  },
  {
    id: "9",
    name: "cabbage",
    binomialName: "Brassica oleracea var. capitata",
    description: "Hardy cole crop with compact heads",
    sunRequirements: "Full sun",
    sowingMethod: "Transplant",
    height: 40
  },
  {
    id: "10",
    name: "peas",
    binomialName: "Pisum sativum",
    description: "Cool-season legume, great for early planting",
    sunRequirements: "Full sun to partial shade",
    sowingMethod: "Direct seed",
    height: 180
  },
  {
    id: "11",
    name: "potato",
    binomialName: "Solanum tuberosum",
    description: "Starchy tuber, staple food crop",
    sunRequirements: "Full sun",
    sowingMethod: "Direct seed",
    height: 60
  },
  {
    id: "12",
    name: "squash",
    binomialName: "Cucurbita species",
    description: "Sprawling vine with variety of fruit types",
    sunRequirements: "Full sun",
    sowingMethod: "Direct seed",
    height: 90
  },
  {
    id: "13",
    name: "basil",
    binomialName: "Ocimum basilicum",
    description: "Aromatic herb, great companion plant",
    sunRequirements: "Full sun",
    sowingMethod: "Direct seed or transplant",
    height: 60
  },
  {
    id: "14",
    name: "corn",
    binomialName: "Zea mays",
    description: "Tall grain crop, heavy feeder",
    sunRequirements: "Full sun",
    sowingMethod: "Direct seed",
    height: 240
  },
  {
    id: "15",
    name: "eggplant",
    binomialName: "Solanum melongena",
    description: "Warm-season crop from nightshade family",
    sunRequirements: "Full sun",
    sowingMethod: "Transplant",
    height: 90
  }
];