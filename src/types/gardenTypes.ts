
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

export interface HardinessZone {
  value: string;
  label: string;
}
