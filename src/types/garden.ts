
export interface BotanicalFamily {
  name: string;
  description: string;
}

export interface Plant {
  id: string;
  name: string;
  binomial_name: string;
  description: string;
  sun_requirements: string;
  sowing_method: string;
  height: number | null;
  botanical_family: BotanicalFamily | null;
  genus: string;
  species: string;
}

export interface PlantsByFamily {
  [familyName: string]: Plant[];
}

