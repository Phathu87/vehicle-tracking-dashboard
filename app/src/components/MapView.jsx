import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet default icons for bundlers
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

export default function MapView({ vehicles, selected, onSelect, history }) {
  const center = selected ? [selected.lat, selected.lng] : DEFAULT_CENTER;
  const positions = history?.map(p => [p.lat, p.lng]) || [];

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
        {vehicles.map(v => (
          <Marker
            key={v.id}
            position={[v.lat, v.lng]}
            eventHandlers={{ click: () => onSelect(v) }}
          >
            <Popup>
              <div style={{ minWidth: 180 }}>
                <strong>{v.id}</strong><br />
                Driver: {v.driver}<br />
                Speed: {v.speed} km/h<br />
                Status: {v.status}<br />
                Last Seen: {new Date(v.lastSeen).toLocaleTimeString()}
              </div>
            </Popup>
          </Marker>
        ))}
        {positions.length > 1 && <Polyline positions={positions} />}
      </MapContainer>
    </div>
  );
}



