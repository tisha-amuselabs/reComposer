import { feature } from "topojson-client";
import {
  geoEquirectangular,
  geoGraticule,
  geoPath,
  type GeoPath,
  type GeoProjection,
} from "d3-geo";
import type { GeometryCollection, Topology } from "topojson-specification";
import worldAtlasData from "world-atlas/countries-110m.json";

const WIDTH = 960;
const HEIGHT = 500;

const topology = worldAtlasData as unknown as Topology;
const countriesObject = topology.objects.countries as GeometryCollection;
const countries = feature(topology, countriesObject);

const projection: GeoProjection = geoEquirectangular().fitSize(
  [WIDTH, HEIGHT],
  countries as GeoJSON.GeoJSON
);
const pathGenerator: GeoPath = geoPath(projection);

export const MAP_WIDTH = WIDTH;
export const MAP_HEIGHT = HEIGHT;

export const COUNTRY_PATHS: { id: string; d: string }[] = countries.features
  .map((f, index) => ({ id: `${f.id ?? "country"}-${index}`, d: pathGenerator(f) ?? "" }))
  .filter((p) => p.d.length > 0);

export const OUTLINE_PATH: string = pathGenerator({ type: "Sphere" }) ?? "";
export const GRATICULE_PATH: string = pathGenerator(geoGraticule().step([20, 20])()) ?? "";

export function pixelToLatLng(x: number, y: number): { lat: number; lng: number } | null {
  const inverted = projection.invert?.([x, y]);
  if (!inverted) return null;
  const [lng, lat] = inverted;
  return { lat, lng };
}

export function latLngToPixel(lat: number, lng: number): { x: number; y: number } | null {
  const projected = projection([lng, lat]);
  if (!projected) return null;
  const [x, y] = projected;
  return { x, y };
}
