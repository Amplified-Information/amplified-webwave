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
  }
];