import { supabase } from "@/integrations/supabase/client";

export type PlantCategory = 
  | 'root_vegetable'
  | 'leafy_green'
  | 'fruiting_vegetable'
  | 'brassica'
  | 'legume'
  | 'allium'
  | 'herb'
  | 'fruit_bush'
  | 'climbing_vegetable';

export interface Plant {
  id: string;
  name: string;
  binomialName: string;
  category: PlantCategory;
  description: string;
  sunRequirements: string;
  sowingMethod: string;
  height?: number;
}

export interface PlantingDate {
  id: string;
  plantId: string;
  zone: string;
  sowingDates: string;
}

export const fetchPlants = async () => {
  const { data: plants, error } = await supabase
    .from('plants')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching plants:', error);
    return [];
  }
  
  return plants.map(plant => ({
    id: plant.id,
    name: plant.name,
    binomialName: plant.binomial_name,
    category: plant.category,
    description: plant.description,
    sunRequirements: plant.sun_requirements,
    sowingMethod: plant.sowing_method,
    height: plant.height
  }));
};

export const fetchPlantingDates = async () => {
  const { data: plantingDates, error } = await supabase
    .from('planting_dates')
    .select('*');
  
  if (error) {
    console.error('Error fetching planting dates:', error);
    return [];
  }
  
  return plantingDates;
};

export const insertInitialPlantData = async () => {
  const { error } = await supabase.from('plants').insert([
    // Root Vegetables
    {
      name: "carrot",
      binomial_name: "Daucus carota",
      category: "root_vegetable",
      description: "Common root vegetable, rich in beta carotene",
      sun_requirements: "Full sun to partial shade",
      sowing_method: "Direct seed",
      height: 30
    },
    {
      name: "potato",
      binomial_name: "Solanum tuberosum",
      category: "root_vegetable",
      description: "Starchy tuber, staple food crop",
      sun_requirements: "Full sun",
      sowing_method: "Direct seed",
      height: 60
    },
    {
      name: "beetroot",
      binomial_name: "Beta vulgaris",
      category: "root_vegetable",
      description: "Sweet root vegetable, edible leaves",
      sun_requirements: "Full sun",
      sowing_method: "Direct seed",
      height: 40
    },
    {
      name: "parsnip",
      binomial_name: "Pastinaca sativa",
      category: "root_vegetable",
      description: "Sweet winter root vegetable",
      sun_requirements: "Full sun",
      sowing_method: "Direct seed",
      height: 45
    },
    
    // Leafy Greens
    {
      name: "lettuce",
      binomial_name: "Lactuca sativa",
      category: "leafy_green",
      description: "Cool-season crop, various varieties",
      sun_requirements: "Partial shade to full sun",
      sowing_method: "Direct seed",
      height: 25
    },
    {
      name: "spinach",
      binomial_name: "Spinacia oleracea",
      category: "leafy_green",
      description: "Nutrient-rich leafy green",
      sun_requirements: "Full sun to partial shade",
      sowing_method: "Direct seed",
      height: 30
    },
    {
      name: "swiss chard",
      binomial_name: "Beta vulgaris subsp. vulgaris",
      category: "leafy_green",
      description: "Hardy leafy green with colorful stems",
      sun_requirements: "Full sun to partial shade",
      sowing_method: "Direct seed",
      height: 60
    },
    
    // Fruiting Vegetables
    {
      name: "tomato",
      binomial_name: "Solanum lycopersicum",
      category: "fruiting_vegetable",
      description: "Popular garden fruit, many varieties",
      sun_requirements: "Full sun",
      sowing_method: "Direct seed or transplant",
      height: 150
    },
    {
      name: "pepper",
      binomial_name: "Capsicum annuum",
      category: "fruiting_vegetable",
      description: "Wide variety of sweet and hot peppers",
      sun_requirements: "Full sun",
      sowing_method: "Transplant",
      height: 100
    },
    {
      name: "eggplant",
      binomial_name: "Solanum melongena",
      category: "fruiting_vegetable",
      description: "Warm-season crop from nightshade family",
      sun_requirements: "Full sun",
      sowing_method: "Transplant",
      height: 90
    },
    
    // Brassicas
    {
      name: "broccoli",
      binomial_name: "Brassica oleracea var. italica",
      category: "brassica",
      description: "Nutritious flowering head vegetable",
      sun_requirements: "Full sun",
      sowing_method: "Transplant",
      height: 60
    },
    {
      name: "cabbage",
      binomial_name: "Brassica oleracea var. capitata",
      category: "brassica",
      description: "Hardy cole crop with compact heads",
      sun_requirements: "Full sun",
      sowing_method: "Transplant",
      height: 40
    },
    {
      name: "cauliflower",
      binomial_name: "Brassica oleracea var. botrytis",
      category: "brassica",
      description: "Delicate cole crop with white heads",
      sun_requirements: "Full sun",
      sowing_method: "Transplant",
      height: 50
    },
    
    // Legumes
    {
      name: "peas",
      binomial_name: "Pisum sativum",
      category: "legume",
      description: "Cool-season nitrogen-fixing crop",
      sun_requirements: "Full sun to partial shade",
      sowing_method: "Direct seed",
      height: 180
    },
    {
      name: "green beans",
      binomial_name: "Phaseolus vulgaris",
      category: "legume",
      description: "Warm-season nitrogen-fixing crop",
      sun_requirements: "Full sun",
      sowing_method: "Direct seed",
      height: 180
    },
    {
      name: "broad beans",
      binomial_name: "Vicia faba",
      category: "legume",
      description: "Hardy nitrogen-fixing crop",
      sun_requirements: "Full sun",
      sowing_method: "Direct seed",
      height: 100
    },
    
    // Alliums
    {
      name: "onion",
      binomial_name: "Allium cepa",
      category: "allium",
      description: "Essential bulb vegetable",
      sun_requirements: "Full sun",
      sowing_method: "Direct seed or transplant",
      height: 45
    },
    {
      name: "garlic",
      binomial_name: "Allium sativum",
      category: "allium",
      description: "Hardy bulb, fall planting",
      sun_requirements: "Full sun",
      sowing_method: "Direct seed",
      height: 60
    },
    {
      name: "leek",
      binomial_name: "Allium ampeloprasum",
      category: "allium",
      description: "Hardy winter vegetable",
      sun_requirements: "Full sun",
      sowing_method: "Transplant",
      height: 90
    },
    
    // Climbing Vegetables
    {
      name: "cucumber",
      binomial_name: "Cucumis sativus",
      category: "climbing_vegetable",
      description: "Climbing vine with crisp fruit",
      sun_requirements: "Full sun",
      sowing_method: "Direct seed or transplant",
      height: 200
    },
    {
      name: "squash",
      binomial_name: "Cucurbita species",
      category: "climbing_vegetable",
      description: "Vigorous vines with variety of fruits",
      sun_requirements: "Full sun",
      sowing_method: "Direct seed",
      height: 90
    },
    
    // Herbs
    {
      name: "basil",
      binomial_name: "Ocimum basilicum",
      category: "herb",
      description: "Aromatic herb, companion plant",
      sun_requirements: "Full sun",
      sowing_method: "Direct seed or transplant",
      height: 60
    },
    {
      name: "parsley",
      binomial_name: "Petroselinum crispum",
      category: "herb",
      description: "Biennial herb, common garnish",
      sun_requirements: "Full sun to partial shade",
      sowing_method: "Direct seed",
      height: 30
    },
    {
      name: "mint",
      binomial_name: "Mentha species",
      category: "herb",
      description: "Vigorous spreading herb",
      sun_requirements: "Full sun to partial shade",
      sowing_method: "Transplant",
      height: 60
    },
    {
      name: "oregano",
      binomial_name: "Origanum vulgare",
      category: "herb",
      description: "Perennial Mediterranean herb",
      sun_requirements: "Full sun",
      sowing_method: "Transplant",
      height: 45
    },
    {
      name: "thyme",
      binomial_name: "Thymus vulgaris",
      category: "herb",
      description: "Low-growing aromatic herb",
      sun_requirements: "Full sun",
      sowing_method: "Transplant",
      height: 30
    },
    
    // Fruit Bushes
    {
      name: "raspberry",
      binomial_name: "Rubus idaeus",
      category: "fruit_bush",
      description: "Perennial cane fruit",
      sun_requirements: "Full sun",
      sowing_method: "Bare root or container",
      height: 150
    },
    {
      name: "blueberry",
      binomial_name: "Vaccinium corymbosum",
      category: "fruit_bush",
      description: "Acid-loving perennial bush",
      sun_requirements: "Full sun",
      sowing_method: "Container",
      height: 180
    },
    {
      name: "gooseberry",
      binomial_name: "Ribes uva-crispa",
      category: "fruit_bush",
      description: "Thorny bush with tart fruits",
      sun_requirements: "Full sun to partial shade",
      sowing_method: "Bare root",
      height: 120
    },
    {
      name: "currant",
      binomial_name: "Ribes species",
      category: "fruit_bush",
      description: "Hardy bush with clustered fruits",
      sun_requirements: "Full sun to partial shade",
      sowing_method: "Bare root",
      height: 150
    }
  ]);

  if (error) {
    console.error('Error inserting plants:', error);
    return;
  }

  console.log('Successfully inserted initial plant data');
};
