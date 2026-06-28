"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap, Circle, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Application } from "@/lib/types";
import { statusColor } from "@/lib/planit";
import { useEffect } from "react";

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 15);
  }, [lat, lng, map]);
  return null;
}

export default function MapView({
  center,
  applications,
  selectedId,
  onSelect,
}: {
  center: { lat: number; lng: number };
  applications: Application[];
  selectedId: string | null;
  onSelect: (a: Application) => void;
}) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={15}
      scrollWheelZoom
      zoomControl={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />
      <Recenter lat={center.lat} lng={center.lng} />
      {/* "You are here" */}
      <Circle
        center={[center.lat, center.lng]}
        radius={40}
        pathOptions={{ color: "#2b2620", fillColor: "#2b2620", fillOpacity: 0.9, weight: 1 }}
      />
      {applications.map((a) => {
        const c = statusColor(a.state);
        const selected = a.id === selectedId;
        return (
          <CircleMarker
            key={a.id}
            center={[a.lat, a.lng]}
            radius={selected ? 11 : 7}
            pathOptions={{
              color: selected ? "#2b2620" : c.dot,
              weight: selected ? 3 : 1,
              fillColor: c.dot,
              fillOpacity: 0.85,
            }}
            eventHandlers={{ click: () => onSelect(a) }}
          >
            <Tooltip>{a.type} — {a.address}</Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
