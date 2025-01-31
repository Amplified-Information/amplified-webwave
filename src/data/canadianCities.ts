import { City } from "@/types/weather";

export const CANADIAN_CITIES: City[] = [
  // Ontario
  { name: "Toronto", province: "Ontario", latitude: 43.6532, longitude: -79.3832 },
  { name: "Ottawa", province: "Ontario", latitude: 45.4215, longitude: -75.6972 },
  { name: "Hamilton", province: "Ontario", latitude: 43.2557, longitude: -79.8711 },
  { name: "London", province: "Ontario", latitude: 42.9849, longitude: -81.2453 },
  { name: "Mississauga", province: "Ontario", latitude: 43.5890, longitude: -79.6441 },

  // Quebec
  { name: "Montreal", province: "Quebec", latitude: 45.5017, longitude: -73.5673 },
  { name: "Quebec City", province: "Quebec", latitude: 46.8139, longitude: -71.2080 },
  { name: "Laval", province: "Quebec", latitude: 45.5749, longitude: -73.6915 },
  { name: "Gatineau", province: "Quebec", latitude: 45.4765, longitude: -75.7013 },
  { name: "Sherbrooke", province: "Quebec", latitude: 45.4040, longitude: -71.8929 },

  // British Columbia
  { name: "Vancouver", province: "British Columbia", latitude: 49.2827, longitude: -123.1207 },
  { name: "Victoria", province: "British Columbia", latitude: 48.4284, longitude: -123.3656 },
  { name: "Surrey", province: "British Columbia", latitude: 49.1913, longitude: -122.8490 },
  { name: "Burnaby", province: "British Columbia", latitude: 49.2488, longitude: -122.9805 },
  { name: "Richmond", province: "British Columbia", latitude: 49.1666, longitude: -123.1336 },

  // Alberta
  { name: "Calgary", province: "Alberta", latitude: 51.0447, longitude: -114.0719 },
  { name: "Edmonton", province: "Alberta", latitude: 53.5461, longitude: -113.4938 },
  { name: "Red Deer", province: "Alberta", latitude: 52.2690, longitude: -113.8116 },
  { name: "Lethbridge", province: "Alberta", latitude: 49.6956, longitude: -112.8451 },
  { name: "Medicine Hat", province: "Alberta", latitude: 50.0421, longitude: -110.6768 },

  // Manitoba
  { name: "Winnipeg", province: "Manitoba", latitude: 49.8951, longitude: -97.1384 },
  { name: "Brandon", province: "Manitoba", latitude: 49.8437, longitude: -99.9516 },
  { name: "Thompson", province: "Manitoba", latitude: 55.7435, longitude: -97.8558 },
  { name: "Steinbach", province: "Manitoba", latitude: 49.5261, longitude: -96.6851 },
  { name: "Portage la Prairie", province: "Manitoba", latitude: 49.9735, longitude: -98.2921 },

  // Saskatchewan
  { name: "Regina", province: "Saskatchewan", latitude: 50.4452, longitude: -104.6189 },
  { name: "Saskatoon", province: "Saskatchewan", latitude: 52.1332, longitude: -106.6700 },
  { name: "Prince Albert", province: "Saskatchewan", latitude: 53.2033, longitude: -105.7530 },
  { name: "Moose Jaw", province: "Saskatchewan", latitude: 50.3917, longitude: -105.5347 },
  { name: "Swift Current", province: "Saskatchewan", latitude: 50.2853, longitude: -107.7933 },

  // Nova Scotia
  { name: "Halifax", province: "Nova Scotia", latitude: 44.6488, longitude: -63.5752 },
  { name: "Sydney", province: "Nova Scotia", latitude: 46.1351, longitude: -60.1831 },
  { name: "Dartmouth", province: "Nova Scotia", latitude: 44.6658, longitude: -63.5669 },
  { name: "Truro", province: "Nova Scotia", latitude: 45.3657, longitude: -63.2870 },
  { name: "New Glasgow", province: "Nova Scotia", latitude: 45.5917, longitude: -62.6486 },

  // New Brunswick
  { name: "Fredericton", province: "New Brunswick", latitude: 45.9636, longitude: -66.6431 },
  { name: "Saint John", province: "New Brunswick", latitude: 45.2733, longitude: -66.0633 },
  { name: "Moncton", province: "New Brunswick", latitude: 46.0878, longitude: -64.7782 },
  { name: "Bathurst", province: "New Brunswick", latitude: 47.6184, longitude: -65.6513 },
  { name: "Edmundston", province: "New Brunswick", latitude: 47.3737, longitude: -68.3251 },

  // Newfoundland and Labrador
  { name: "St. John's", province: "Newfoundland", latitude: 47.5615, longitude: -52.7126 },
  { name: "Corner Brook", province: "Newfoundland", latitude: 48.9489, longitude: -57.9522 },
  { name: "Mount Pearl", province: "Newfoundland", latitude: 47.5189, longitude: -52.8058 },
  { name: "Grand Falls-Windsor", province: "Newfoundland", latitude: 48.9373, longitude: -55.6632 },
  { name: "Labrador City", province: "Newfoundland", latitude: 52.9419, longitude: -66.9178 },

  // Prince Edward Island
  { name: "Charlottetown", province: "Prince Edward Island", latitude: 46.2382, longitude: -63.1311 },
  { name: "Summerside", province: "Prince Edward Island", latitude: 46.3951, longitude: -63.7870 },
  { name: "Stratford", province: "Prince Edward Island", latitude: 46.2168, longitude: -63.0885 },
  { name: "Cornwall", province: "Prince Edward Island", latitude: 46.2505, longitude: -63.2384 },
  { name: "Montague", province: "Prince Edward Island", latitude: 46.1650, longitude: -62.6486 },

  // Territories (fewer cities due to smaller population)
  { name: "Yellowknife", province: "Northwest Territories", latitude: 62.4540, longitude: -114.3718 },
  { name: "Whitehorse", province: "Yukon", latitude: 60.7212, longitude: -135.0568 },
  { name: "Iqaluit", province: "Nunavut", latitude: 63.7467, longitude: -68.5170 }
];