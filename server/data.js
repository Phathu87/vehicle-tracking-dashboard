import axios from "axios";

export const CITIES = [ 
  { name: "Johannesburg", lat: -26.2041, lng: 28.0473, province: "Gauteng" },
  { name: "Cape Town", lat: -33.9249, lng: 18.4241, province: "Western Cape" },
  { name: "Durban", lat: -29.8587, lng: 31.0218, province: "KwaZulu-Natal" },
  { name: "Pretoria", lat: -25.7479, lng: 28.2293, province: "Gauteng" },
  { name: "Thohoyandou", lat: -22.9513, lng: 30.4856, province: "Limpopo" },
  { name: "Polokwane", lat: -23.8981, lng: 29.4500, province: "Limpopo" },
  { name: "Gqeberha", lat: -33.9137, lng: 25.5827, province: "Eastern Cape" },
  { name: "Bloemfontein", lat: -29.1129, lng: 26.2149, province: "Free State" },
  { name: "Phalaborwa", lat: -23.9386, lng: 31.1440, province: "Limpopo" },
  { name: "Mahikeng", lat: -25.8570, lng: 25.6393, province: "North West" },
  { name: "Mafikeng", lat: -25.8522, lng: 25.6386, province: "North West" },
  { name: "Louis Trichardt", lat: -23.0955, lng: 29.9000, province: "Limpopo" },
  { name: "Rustenburg", lat: -25.6670, lng: 27.2420, province: "North West" },
  { name: "Kimberley", lat: -28.7294, lng: 24.7706, province: "Northern Cape" },
];

const VEHICLES_PER_CITY = 25;

const DRIVER_NAMES = [
  "M Dlamini","S Naidoo","T Mokoena","L Nkosi","A Khumalo",
  "R Ahmed","J Smith","Z Daniels","K Patel","N Ndlovu",
  "F Makhale","P Mthembu","C Van der Merwe","L Van Wyk","T Tshivhase",
  "S Sithole","R Mokoena","U Netswera","D Naidoo","M Botha",
  "G Mabena","H Radebe","I Mthembu","J Jacobs","K Petersen"
];

const VEHICLES = {
  "Volvo": ["XC90", "S60", "XC60"],
  "Mercedes Benz": ["C-Class", "E-Class", "Sprinter"],
  "Isuzu": ["D-Max", "KB"],
  "Hyundai": ["H1", "Tucson", "Elantra"],
  "Scania": ["R-Series", "S-Series"],
  "Toyota": ["Hilux", "Corolla", "Fortuner"],
  "Ford": ["Ranger", "EcoSport", "Focus"],
  "Nissan": ["NP200", "Navara", "X-Trail"],
  "BMW": ["X5", "320i", "X3"],
  "Audi": ["Q7", "A4", "A6"],
  "Kia": ["Seltos", "Sportage"],
  "Mazda": ["CX-5", "3", "6"],
  "Chevrolet": ["Trailblazer", "Spark", "Cruze"],
  "Honda": ["CR-V", "Civic", "Jazz"],
  "Volkswagen": ["Polo", "Golf", "Passat"]
};

const PROVINCES = {
  "Gauteng": "GP",
  "Western Cape": "WC",
  "KwaZulu-Natal": "KZN",
  "Eastern Cape": "EC",
  "Free State": "FS",
  "Mpumalanga": "MP",
  "Limpopo": "LP",
  "North West": "NW",
  "Northern Cape": "NC"
};

function generatePlate(province) {
  const prefix = PROVINCES[province] || "GP";
  const number = Math.floor(1000 + Math.random() * 9000);
  const suffix = String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
                 String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `${prefix} ${number} ${suffix}`;
}

function getRandomVehicle() {
  const makes = Object.keys(VEHICLES);
  const make = makes[Math.floor(Math.random() * makes.length)];
  const models = VEHICLES[make];
  const model = models[Math.floor(Math.random() * models.length)];
  return { make, model };
}

// Create simple dummy roads for each city
const DUMMY_ROADS = {};
CITIES.forEach(city => {
  DUMMY_ROADS[city.name] = [
    [{ lat: city.lat, lng: city.lng }],
    [{ lat: city.lat + 0.01, lng: city.lng + 0.01 }],
    [{ lat: city.lat - 0.01, lng: city.lng - 0.01 }],
  ];
});

export const vehicles = [];

CITIES.forEach(city => {
  const roads = DUMMY_ROADS[city.name];
  for (let i = 0; i < VEHICLES_PER_CITY; i++) {
    const id = `VH-${city.name.slice(0,2).toUpperCase()}-${100+i}`;
    const driver = DRIVER_NAMES[Math.floor(Math.random() * DRIVER_NAMES.length)];
    const { make, model } = getRandomVehicle();
    const plate = generatePlate(city.province);
    const road = roads[Math.floor(Math.random() * roads.length)];
    const startIndex = 0; // just use the first point

    vehicles.push({
      id,
      driver,
      make,
      model,
      plate,
      city: city.name,
      province: city.province,
      road,
      roadIndex: startIndex,
      lat: road[startIndex].lat,
      lng: road[startIndex].lng,
      speed: Math.floor(Math.random() * 60) + 20,
      status: "Online",
      lastSeen: Date.now(),
      history: [],
      progress: 0,
    });
  }
});

export { VEHICLES, PROVINCES, getRandomVehicle, generatePlate };

