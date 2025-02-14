
import { GardenVegetable } from "@/types/gardenTypes";
import { rootVegetables } from "./rootVegetables";
import { leafyGreens } from "./leafyGreens";
import { fruitingVegetables } from "./fruitingVegetables";
import { alliums } from "./alliums";

export const gardenVegetables: GardenVegetable[] = [
  ...rootVegetables,
  ...leafyGreens,
  ...fruitingVegetables,
  ...alliums
];

export * from "./rootVegetables";
export * from "./leafyGreens";
export * from "./fruitingVegetables";
export * from "./alliums";
