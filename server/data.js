import axios from "axios";

export const CITIES = [ 
  { name: "Johannesburg", lat: -26.2041, lng: 28.0473 },
  { name: "Cape Town", lat: -33.9249, lng: 18.4241 },
  { name: "Durban", lat: -29.8587, lng: 31.0218 },
  { name: "Pretoria", lat: -25.7479, lng: 28.2293 },
];

const VEHICLES_PER_CITY = 25; // more vehicles per city

const DRIVER_NAMES = [
  "M Dlamini","S Naidoo","T Mokoena","L Nkosi","A Khumalo",
  "R Ahmed","J Smith","Z Daniels","K Patel","N Ndlovu",
  "F Makhale","P Mthembu","C Van der Merwe","L Van Wyk","T Tshivhase",
  "S Sithole","R Mokoena","U Netswera","D Naidoo","M Botha",
  "G Mabena","H Radebe","I Mthembu","J Jacobs","K Petersen"
];

// Example road polylines (mocked, can be expanded)
const CITY_ROADS = {
  Johannesburg: [
    [{lat:-26.2050,lng:28.0460},{lat:-26.2055,lng:28.0480},{lat:-26.2060,lng:28.0490}],
    [{lat:-26.2030,lng:28.0450},{lat:-26.2040,lng:28.0470},{lat:-26.2050,lng:28.0485}],
  ],
  "Cape Town": [
    [{lat:-33.9250,lng:18.4230},{lat:-33.9260,lng:18.4250},{lat:-33.9270,lng:18.4260}]
  ],
  Durban: [
    [{lat:-29.8590,lng:31.0200},{lat:-29.8600,lng:31.0220},{lat:-29.8610,lng:31.0240}]
  ],
  Pretoria: [
    [{lat:-25.7485,lng:28.2280},{lat:-25.7475,lng:28.2300},{lat:-25.7465,lng:28.2315}]
  ]
};

export const vehicles = [];

// Initialize vehicles along city roads
CITIES.forEach(city => {
  for (let i = 0; i < VEHICLES_PER_CITY; i++) {
    const id = `VH-${city.name.slice(0,2).toUpperCase()}-${100+i}`;
    const driver = DRIVER_NAMES[Math.floor(Math.random() * DRIVER_NAMES.length)];
    const roads = CITY_ROADS[city.name];
    const road = roads[Math.floor(Math.random() * roads.length)];
    const startIndex = Math.floor(Math.random() * road.length);

    vehicles.push({
      id,
      driver,
      city: city.name,
      lat: road[startIndex].lat,
      lng: road[startIndex].lng,
      road,
      roadIndex: startIndex,
      speed: Math.floor(Math.random() * 60) + 20, // realistic speed 20–80 km/h
      status: "Online",
      lastSeen: Date.now(),
      history: [],
    });
  }
});

// Seed 1-hour history
export function seedHistory() {
  const now = Date.now();
  vehicles.forEach(v => {
    v.history = [];
    let idx = v.roadIndex;
    for (let m = 60; m >= 1; m--) {
      idx = (idx + 1) % v.road.length;
      v.history.push({ lat: v.road[idx].lat, lng: v.road[idx].lng, t: now - m*60000 });
    }
  });
}

// Tick: advance vehicles along road
export function tick() {
  const now = Date.now();
  vehicles.forEach(v => {
    const offline = Math.random() < 0.05;
    if (offline) {
      v.status = "Offline";
      v.speed = 0;
    } else {
      const idle = Math.random() < 0.15;
      v.speed = idle ? 0 : Math.round(Math.random() * 80) + 20;
      v.status = v.speed === 0 ? "Idle" : "Online";

      if (v.speed > 0) {
        // move along the road polyline
        v.roadIndex = (v.roadIndex + 1) % v.road.length;
        v.lat = v.road[v.roadIndex].lat;
        v.lng = v.road[v.roadIndex].lng;
      }
    }

    v.lastSeen = now;
    v.history.push({ lat: v.lat, lng: v.lng, t: now });
    v.history = v.history.filter(p => now - p.t <= 3600000); // keep 1h
  });
}

