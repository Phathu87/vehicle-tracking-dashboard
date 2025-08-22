import axios from "axios";

export const CITIES = [ 
  { name: "Johannesburg", lat: -26.2041, lng: 28.0473 },
  { name: "Cape Town", lat: -33.9249, lng: 18.4241 },
  { name: "Durban", lat: -29.8587, lng: 31.0218 },
  { name: "Pretoria", lat: -25.7479, lng: 28.2293 },
  { name: "Thohoyandou", lat: -22.9513, lng: 30.4856 },
  { name: "Polokwane", lat: -23.8981, lng: 29.4500 },
  { name: "Gqeberha", lat: -33.9137, lng: 25.5827 },
  { name: "Bloemfontein", lat: -29.1129, lng: 26.2149 },
  { name: "Phalaborwa", lat: -23.9386, lng: 31.1440 },
  { name: "Mahikeng", lat: -25.8570, lng: 25.6393 },
  { name: "Mafikeng", lat: -25.8522, lng: 25.6386 },
  { name: "Louis Trichardt", lat: -23.0955, lng: 29.9000 },
  { name: "Rustenburg", lat: -25.6670, lng: 27.2420 },
  { name: "Kimberley", lat: -28.7294, lng: 24.7706 },
];

const VEHICLES_PER_CITY = 25;

const DRIVER_NAMES = [
  "M Dlamini","S Naidoo","T Mokoena","L Nkosi","A Khumalo",
  "R Ahmed","J Smith","Z Daniels","K Patel","N Ndlovu",
  "F Makhale","P Mthembu","C Van der Merwe","L Van Wyk","T Tshivhase",
  "S Sithole","R Mokoena","U Netswera","D Naidoo","M Botha",
  "G Mabena","H Radebe","I Mthembu","J Jacobs","K Petersen"
];

const VEHICLES = [
  "Volvo","Mercedes Benz","Isuzu","Hyundai H1","Scania",
  "Toyota Hilux","Ford Ranger","Nissan NP200","BMW X5","Audi Q7",
  "Kia Seltos","Mazda CX-5","Chevrolet Trailblazer","Honda CR-V","Volkswagen Polo",
  "Hyundai Tucson","Renault Duster","Ford EcoSport","Toyota Corolla","Volkswagen Golf",
  "Mercedes Sprinter","Isuzu D-Max","Toyota Fortuner","BMW 320i","Audi A4"
];

// Loopable roads: each road loops back to the start
const CITY_ROADS = {
  Johannesburg: [
    [
      {lat:-26.2045,lng:28.0450},{lat:-26.2050,lng:28.0465},{lat:-26.2055,lng:28.0480},
      {lat:-26.2060,lng:28.0495},{lat:-26.2065,lng:28.0510},{lat:-26.2070,lng:28.0525},
      {lat:-26.2045,lng:28.0450} // loop back
    ],
    [
      {lat:-26.2030,lng:28.0440},{lat:-26.2035,lng:28.0455},{lat:-26.2040,lng:28.0470},
      {lat:-26.2045,lng:28.0485},{lat:-26.2050,lng:28.0500},{lat:-26.2055,lng:28.0515},
      {lat:-26.2030,lng:28.0440} // loop back
    ]
  ],
  "Cape Town": [
    [
      {lat:-33.9245,lng:18.4230},{lat:-33.9250,lng:18.4240},{lat:-33.9255,lng:18.4250},
      {lat:-33.9260,lng:18.4260},{lat:-33.9265,lng:18.4270},{lat:-33.9270,lng:18.4280},
      {lat:-33.9245,lng:18.4230} // loop back
    ]
  ],
  Durban: [
    [
      {lat:-29.8585,lng:31.0200},{lat:-29.8590,lng:31.0210},{lat:-29.8595,lng:31.0220},
      {lat:-29.8600,lng:31.0230},{lat:-29.8605,lng:31.0240},{lat:-29.8610,lng:31.0250},
      {lat:-29.8585,lng:31.0200} // loop back
    ]
  ],
  Pretoria: [
    [
      {lat:-25.7480,lng:28.2270},{lat:-25.7485,lng:28.2280},{lat:-25.7490,lng:28.2290},
      {lat:-25.7495,lng:28.2300},{lat:-25.7500,lng:28.2310},{lat:-25.7505,lng:28.2320},
      {lat:-25.7480,lng:28.2270} // loop back
    ]
  ],
  Thohoyandou: [
    [
      {lat:-22.9540,lng:30.4850},{lat:-22.9545,lng:30.4860},{lat:-22.9550,lng:30.4870},
      {lat:-22.9555,lng:30.4880},{lat:-22.9560,lng:30.4890},{lat:-22.9565,lng:30.4900},
      {lat:-22.9540,lng:30.4850} // loop back
    ]
  ],
  Polokwane: [
    [
      {lat:-23.8985,lng:29.4490},{lat:-23.8990,lng:29.4500},{lat:-23.8995,lng:29.4510},
      {lat:-23.9000,lng:29.4520},{lat:-23.9005,lng:29.4530},{lat:-23.9010,lng:29.4540},
      {lat:-23.8985,lng:29.4490} // loop back
    ]
  ],
  Gqeberha: [
    [
      {lat:-33.9140,lng:25.5810},{lat:-33.9145,lng:25.5820},{lat:-33.9150,lng:25.5830},
      {lat:-33.9155,lng:25.5840},{lat:-33.9160,lng:25.5850},{lat:-33.9165,lng:25.5860},
      {lat:-33.9140,lng:25.5810} // loop back
    ]
  ],
  Bloemfontein: [
    [
      {lat:-29.1130,lng:26.2130},{lat:-29.1135,lng:26.2140},{lat:-29.1140,lng:26.2150},
      {lat:-29.1145,lng:26.2160},{lat:-29.1150,lng:26.2170},{lat:-29.1155,lng:26.2180},
      {lat:-29.1130,lng:26.2130} // loop back
    ]
  ],
  Phalaborwa: [
    [
      {lat:-23.9386,lng:31.1440},{lat:-23.9390,lng:31.1450},{lat:-23.9395,lng:31.1460},
      {lat:-23.9400,lng:31.1470},{lat:-23.9405,lng:31.1480},{lat:-23.9410,lng:31.1490},
      {lat:-23.9386,lng:31.1440} // loop back
    ]
  ],
  Mahikeng: [
    [
      {lat:-25.8575,lng:25.6380},{lat:-25.8570,lng:25.6390},{lat:-25.8565,lng:25.6400},
      {lat:-25.8560,lng:25.6410},{lat:-25.8555,lng:25.6420},{lat:-25.8550,lng:25.6430},
      {lat:-25.8575,lng:25.6380} // loop back
    ]
  ],
  Mafikeng: [
    [
      {lat:-25.8525,lng:25.6380},{lat:-25.8522,lng:25.6386},{lat:-25.8518,lng:25.6395},
      {lat:-25.8515,lng:25.6405},{lat:-25.8510,lng:25.6415},{lat:-25.8505,lng:25.6425},
      {lat:-25.8525,lng:25.6380} // loop back
    ]
  ],
  "Louis Trichardt": [
    [
      {lat:-23.0960,lng:29.8990},{lat:-23.0955,lng:29.9000},{lat:-23.0950,lng:29.9010},
      {lat:-23.0945,lng:29.9020},{lat:-23.0940,lng:29.9030},{lat:-23.0935,lng:29.9040},
      {lat:-23.0960,lng:29.8990} // loop back
    ]
  ],
  Rustenburg: [
    [
      {lat:-25.6675,lng:27.2410},{lat:-25.6670,lng:27.2420},{lat:-25.6665,lng:27.2430},
      {lat:-25.6660,lng:27.2440},{lat:-25.6655,lng:27.2450},{lat:-25.6650,lng:27.2460},
      {lat:-25.6675,lng:27.2410} // loop back
    ]
  ],
  Kimberley: [
    [
      {lat:-28.7300,lng:24.7690},{lat:-28.7294,lng:24.7706},{lat:-28.7288,lng:24.7720},
      {lat:-28.7282,lng:24.7730},{lat:-28.7276,lng:24.7740},{lat:-28.7270,lng:24.7750},
      {lat:-28.7300,lng:24.7690} // loop back
    ]
  ]
};

// Vehicle initialization and tick functions remain the same as before
export const vehicles = [];

CITIES.forEach(city => {
  const roads = CITY_ROADS[city.name];
  if (!roads) return;

  for (let i = 0; i < VEHICLES_PER_CITY; i++) {
    const id = `VH-${city.name.slice(0,2).toUpperCase()}-${100+i}`;
    const driver = DRIVER_NAMES[Math.floor(Math.random() * DRIVER_NAMES.length)];
    const vehicle = VEHICLES[Math.floor(Math.random() * VEHICLES.length)];
    const road = roads[Math.floor(Math.random() * roads.length)];
    const startIndex = Math.floor(Math.random() * road.length);

    vehicles.push({
      id,
      driver,
      vehicle,
      city: city.name,
      road,
      roadIndex: startIndex,
      lat: road[startIndex].lat,
      lng: road[startIndex].lng,
      speed: Math.floor(Math.random() * 60) + 20,
      status: "Online",
      lastSeen: Date.now(),
      history: [],
      progress: 0, // progress between points (0–1)
    });
  }
});

// Linear interpolation helper
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Tick function with smooth movement
export function tick(deltaTime = 1000) { // deltaTime in ms
  const now = Date.now();

  vehicles.forEach(v => {
    const offline = Math.random() < 0.05;
    if (offline) {
      v.status = "Offline";
      v.speed = 0;
    } else {
      const idle = Math.random() < 0.15;
      v.speed = idle ? 0 : Math.floor(Math.random() * 61) + 20;
      v.status = v.speed === 0 ? "Idle" : "Online";
    }

    if (v.speed > 0) {
      // Calculate distance to move this tick
      const roadLength = 1; // normalized unit between points
      const moveProgress = (v.speed / 3600) * (deltaTime / 1000); // km/h -> fraction per tick

      v.progress += moveProgress;

      while (v.progress >= 1) {
        v.progress -= 1;
        v.roadIndex = (v.roadIndex + 1) % v.road.length;
      }

      // Interpolate position between current point and next
      const nextIndex = (v.roadIndex + 1) % v.road.length;
      const curr = v.road[v.roadIndex];
      const next = v.road[nextIndex];

      v.lat = lerp(curr.lat, next.lat, v.progress);
      v.lng = lerp(curr.lng, next.lng, v.progress);
    }

    v.lastSeen = now;
    v.history.push({ lat: v.lat, lng: v.lng, t: now });
    v.history = v.history.filter(p => now - p.t <= 3600000);
  });
}
