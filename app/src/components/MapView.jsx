import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet default icons
import i2x from 'leaflet/dist/images/marker-icon-2x.png';
import i from 'leaflet/dist/images/marker-icon.png';
import s from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: i2x, iconUrl: i, shadowUrl: s });

const DEFAULT_CENTER = [-26.2041, 28.0473]; // Johannesburg

function FlyTo({ selected }) {
  const map = useMap();
  useEffect(() => {
    if (selected) map.flyTo([selected.lat, selected.lng], 14, { duration: 0.75 });
  }, [selected, map]);
  return null;
}

export default function MapView({ vehicles, selected, onSelect }) {
  const center = selected ? [selected.lat, selected.lng] : DEFAULT_CENTER;

  // Force re-render every second for live updates
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Keep track of popup refs
  const popupRefs = useRef({});

  useEffect(() => {
    if (selected && popupRefs.current[selected.id]) {
      popupRefs.current[selected.id].openPopup();
    }
  }, [selected, vehicles]);

  return (
    <div className="panel map">
      <div className="panel-header">
        <span>Map (OpenStreetMap / Leaflet)</span>
        <span className="muted">{selected ? `Selected: ${selected.id}` : 'Click a vehicle to zoom'}</span>
      </div>

      <MapContainer center={center} zoom={12} className="map-el">
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyTo selected={selected} />

        {vehicles.map(v => {
          const positions = v.history?.map(p => [p.lat, p.lng]) || [];

          return (
            <React.Fragment key={v.id}>
              <Marker
                position={[v.lat, v.lng]}
                eventHandlers={{ click: () => onSelect(v) }}
              >
                <Popup ref={ref => (popupRefs.current[v.id] = ref)}>
                  <div style={{ minWidth: 200 }}>
                    <strong>{v.id}</strong><br />
                    Driver: {v.driver}<br />
                    Vehicle: {v.make} {v.model}<br />
                    Plate: {v.plate}<br />
                    Province: {v.province}<br />
                    Speed: {v.speed} km/h<br />
                    Status: {v.status}<br />
                    Last Seen: {new Date(v.lastSeen).toLocaleTimeString()}
                  </div>
                </Popup>
              </Marker>

              {positions.length > 1 && <Polyline positions={positions} color="blue" />}
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}



