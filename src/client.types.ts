import type { FeatureCollection, Geometry, Polygon } from "geojson";

import type { Feed } from "./__generated__/schema";

// region Entities
export type Meta = {
  after: number;
  next: string;
};

export type Page = Partial<Record<"meta", Meta>>;

export type Json<K extends string, T> = Record<K, T> & Page;

export type GeoJson<G extends Geometry, P> = FeatureCollection<G, P> & Page;

export type Stream = ReadableStream<Uint8Array>;

export type Format = "geojson" | "geojsonl" | "json" | "png" | "stream";

export type Entities<
  F extends Format,
  T,
  K extends string,
  G extends Geometry,
> = F extends "json"
  ? Json<K, T>
  : F extends "geojson"
    ? GeoJson<G, T>
    : // TODO F extends "geojsonl"
      Stream; // geojsonl, png, stream
// endregion

// prettier-ignore
export type Feeds<F extends Format = "json"> = Entities<F, Feed, "feeds", Polygon>;
