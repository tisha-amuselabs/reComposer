"use client";

import { useEffect, useRef, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import worldAtlasData from "world-atlas/countries-110m.json";

export interface GlobeMarker {
  lat: number;
  lng: number;
  color: string;
  label: string;
}

interface GlobeConnection {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  colors: string[];
}

interface CameraTarget {
  lat: number;
  lng: number;
  altitude: number;
}

const topology = worldAtlasData as unknown as Topology;
const countriesObject = topology.objects.countries as GeometryCollection;
const COUNTRY_FEATURES = feature(topology, countriesObject).features;

function toUnitVector(marker: GlobeMarker): [number, number, number] {
  const lat = (marker.lat * Math.PI) / 180;
  const lng = (marker.lng * Math.PI) / 180;
  return [Math.cos(lat) * Math.cos(lng), Math.cos(lat) * Math.sin(lng), Math.sin(lat)];
}

function resultCamera(markers: GlobeMarker[]): CameraTarget {
  const first = toUnitVector(markers[0]);
  const second = toUnitVector(markers[1]);
  const dot = Math.min(1, Math.max(-1, first[0] * second[0] + first[1] * second[1] + first[2] * second[2]));
  const separation = Math.acos(dot);

  let midpoint: [number, number, number] = [
    first[0] + second[0],
    first[1] + second[1],
    first[2] + second[2],
  ];
  let length = Math.hypot(...midpoint);

  // Antipodal points have no unique midpoint. Aim at a perpendicular vector so
  // both markers sit on opposite edges of the visible hemisphere.
  if (length < 0.001) {
    const reference: [number, number, number] =
      Math.abs(first[2]) < 0.9 ? [0, 0, 1] : [0, 1, 0];
    midpoint = [
      first[1] * reference[2] - first[2] * reference[1],
      first[2] * reference[0] - first[0] * reference[2],
      first[0] * reference[1] - first[1] * reference[0],
    ];
    length = Math.hypot(...midpoint);
  }

  const [x, y, z] = midpoint.map((value) => value / length) as [number, number, number];
  const separationRatio = separation / Math.PI;

  return {
    lat: (Math.asin(z) * 180) / Math.PI,
    lng: (Math.atan2(y, x) * 180) / Math.PI,
    altitude: Math.min(2.75, 0.72 + Math.pow(separationRatio, 0.72) * 2.03),
  };
}

export function GlobeCanvas({
  markers,
  onGuess,
  focusOnMarkers = false,
}: {
  markers: GlobeMarker[];
  onGuess?: (lat: number, lng: number) => void;
  focusOnMarkers?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [size, setSize] = useState({ width: 760, height: 500 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      setSize({
        width: Math.max(container.clientWidth, 320),
        height: Math.max(container.clientHeight, 360),
      });
    };
    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  function configureGlobe() {
    const globe = globeRef.current;
    if (!globe) return;

    const controls = globe.controls();
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 140;
    controls.maxDistance = 380;

    if (focusOnMarkers && markers.length >= 2) {
      globe.pointOfView(resultCamera(markers), 1600);
    } else {
      globe.pointOfView({ lat: 18, lng: 42, altitude: 1.78 }, 0);
    }
  }

  function handleCoordinatePick({ lat, lng }: { lat: number; lng: number }) {
    onGuess?.(lat, lng);
  }

  const connections: GlobeConnection[] =
    focusOnMarkers && markers.length >= 2
      ? [
          {
            startLat: markers[0].lat,
            startLng: markers[0].lng,
            endLat: markers[1].lat,
            endLng: markers[1].lng,
            colors: [markers[0].color, markers[1].color],
          },
        ]
      : [];

  return (
    <div ref={containerRef} className="relative h-full min-h-[360px] w-full overflow-hidden">
      <Globe
        ref={globeRef}
        width={size.width}
        height={size.height}
        backgroundColor="rgba(0,0,0,0)"
        showGlobe
        showGraticules
        showAtmosphere
        atmosphereColor="#7bd0ff"
        atmosphereAltitude={0.12}
        globeImageUrl={null}
        polygonsData={COUNTRY_FEATURES}
        polygonCapColor={() => "rgba(102, 117, 143, 0.72)"}
        polygonSideColor={() => "rgba(11, 19, 38, 0.9)"}
        polygonStrokeColor={() => "rgba(123, 208, 255, 0.13)"}
        polygonAltitude={0.008}
        pointsData={markers}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointLabel="label"
        pointAltitude={0.045}
        pointRadius={0.55}
        pointsTransitionDuration={250}
        ringsData={markers}
        ringLat="lat"
        ringLng="lng"
        ringColor={(marker) => [(marker as GlobeMarker).color, "rgba(0,0,0,0)"]}
        ringMaxRadius={3}
        ringPropagationSpeed={1}
        ringRepeatPeriod={900}
        arcsData={connections}
        arcColor="colors"
        arcStroke={0.45}
        arcAltitudeAutoScale={0.24}
        arcDashLength={0.1}
        arcDashGap={0.06}
        arcDashInitialGap={0}
        arcDashAnimateTime={1800}
        arcsTransitionDuration={900}
        onGlobeClick={onGuess ? handleCoordinatePick : undefined}
        onPolygonClick={
          onGuess
            ? (_polygon, _event, coordinates) => {
                handleCoordinatePick(coordinates);
              }
            : undefined
        }
        onGlobeReady={configureGlobe}
      />

      <div className="pointer-events-none absolute left-4 top-4 rounded-sm border border-[#7bd0ff]/25 bg-[#0b1326]/75 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#7bd0ff] backdrop-blur">
        {onGuess ? "Drag to rotate // Click to mark" : "Coordinate comparison"}
      </div>
      <div className="pointer-events-none absolute bottom-4 right-4 font-mono text-[9px] uppercase tracking-[0.12em] text-[#68758e]">
        WebGL spherical projection
      </div>
    </div>
  );
}
