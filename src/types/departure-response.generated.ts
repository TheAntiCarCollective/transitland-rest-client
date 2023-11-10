// To parse this data:
//
//   import { Convert, DepartureResponse } from "./file";
//
//   const departureResponse = Convert.toDepartureResponse(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface DepartureResponse {
  stops: Stop[];
}

export interface Stop {
  departures: Departure[];
  feed_version: FeedVersion;
  geometry: Geometry;
  id: number;
  location_type: number;
  onestop_id: string;
  parent: null;
  platform_code: null;
  stop_code: string;
  stop_desc: string;
  stop_id: string;
  stop_name: string;
  stop_timezone: string;
  stop_url: string;
  tts_stop_name: null;
  wheelchair_boarding: number;
  zone_id: string;
}

export interface Departure {
  arrival: Arrival;
  arrival_time: string;
  continuous_drop_off: null;
  continuous_pickup: null;
  departure: Arrival;
  departure_time: string;
  drop_off_type: number | null;
  interpolated: null;
  pickup_type: number | null;
  service_date: Date;
  shape_dist_traveled: number;
  stop_headsign: null | string;
  stop_sequence: number;
  timepoint: null;
  trip: Trip;
}

export interface Arrival {
  delay: null;
  estimated: null;
  estimated_utc: null;
  scheduled: string;
  uncertainty: null;
}

export interface Trip {
  bikes_allowed: number;
  block_id: string;
  direction_id: number;
  frequencies: any[];
  id: number;
  route: Route;
  shape: Shape;
  stop_pattern_id: number;
  timestamp: null;
  trip_headsign: string;
  trip_id: string;
  trip_short_name: string;
  wheelchair_accessible: number;
}

export interface Route {
  agency: Agency;
  continuous_drop_off: null;
  continuous_pickup: null;
  id: number;
  onestop_id: string;
  route_color: string;
  route_desc: string;
  route_id: string;
  route_long_name: string;
  route_short_name: string;
  route_text_color: string;
  route_type: number;
  route_url: string;
}

export interface Agency {
  agency_id: string;
  agency_name: string;
  id: number;
  onestop_id: string;
}

export interface Shape {
  generated: boolean;
  id: number;
  shape_id: string;
}

export interface FeedVersion {
  feed: Feed;
  fetched_at: Date;
  id: number;
  sha1: string;
}

export interface Feed {
  id: number;
  onestop_id: string;
}

export interface Geometry {
  coordinates: number[];
  type: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toDepartureResponse(json: string): DepartureResponse {
    return cast(JSON.parse(json), r("DepartureResponse"));
  }

  public static departureResponseToJson(value: DepartureResponse): string {
    return JSON.stringify(uncast(value, r("DepartureResponse")), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ""): never {
  const prettyTyp = prettyTypeName(typ);
  const parentText = parent ? ` on ${parent}` : "";
  const keyText = key ? ` for key "${key}"` : "";
  throw Error(
    `Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(
      val,
    )}`,
  );
}

function prettyTypeName(typ: any): string {
  if (Array.isArray(typ)) {
    if (typ.length === 2 && typ[0] === undefined) {
      return `an optional ${prettyTypeName(typ[1])}`;
    } else {
      return `one of [${typ
        .map((a) => {
          return prettyTypeName(a);
        })
        .join(", ")}]`;
    }
  } else if (typeof typ === "object" && typ.literal !== undefined) {
    return typ.literal;
  } else {
    return typeof typ;
  }
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(
  val: any,
  typ: any,
  getProps: any,
  key: any = "",
  parent: any = "",
): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key, parent);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val, key, parent);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(
      cases.map((a) => {
        return l(a);
      }),
      val,
      key,
      parent,
    );
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
    return val.map((el) => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue(l("Date"), val, key, parent);
    }
    return d;
  }

  function transformObject(
    props: { [k: string]: any },
    additional: any,
    val: any,
  ): any {
    if (val === null || typeof val !== "object" || Array.isArray(val)) {
      return invalidValue(l(ref || "object"), val, key, parent);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, key, ref);
    });
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key, ref);
      }
    });
    return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val, key, parent);
  }
  if (typ === false) return invalidValue(typ, val, key, parent);
  let ref: any = undefined;
  while (typeof typ === "object" && typ.ref !== undefined) {
    ref = typ.ref;
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
    return typ.hasOwnProperty("unionMembers")
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty("arrayItems")
      ? transformArray(typ.arrayItems, val)
      : typ.hasOwnProperty("props")
      ? transformObject(getProps(typ), typ.additional, val)
      : invalidValue(typ, val, key, parent);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
  return { literal: typ };
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  DepartureResponse: o(
    [{ json: "stops", js: "stops", typ: a(r("Stop")) }],
    false,
  ),
  Stop: o(
    [
      { json: "departures", js: "departures", typ: a(r("Departure")) },
      { json: "feed_version", js: "feed_version", typ: r("FeedVersion") },
      { json: "geometry", js: "geometry", typ: r("Geometry") },
      { json: "id", js: "id", typ: 0 },
      { json: "location_type", js: "location_type", typ: 0 },
      { json: "onestop_id", js: "onestop_id", typ: "" },
      { json: "parent", js: "parent", typ: null },
      { json: "platform_code", js: "platform_code", typ: null },
      { json: "stop_code", js: "stop_code", typ: "" },
      { json: "stop_desc", js: "stop_desc", typ: "" },
      { json: "stop_id", js: "stop_id", typ: "" },
      { json: "stop_name", js: "stop_name", typ: "" },
      { json: "stop_timezone", js: "stop_timezone", typ: "" },
      { json: "stop_url", js: "stop_url", typ: "" },
      { json: "tts_stop_name", js: "tts_stop_name", typ: null },
      { json: "wheelchair_boarding", js: "wheelchair_boarding", typ: 0 },
      { json: "zone_id", js: "zone_id", typ: "" },
    ],
    false,
  ),
  Departure: o(
    [
      { json: "arrival", js: "arrival", typ: r("Arrival") },
      { json: "arrival_time", js: "arrival_time", typ: "" },
      { json: "continuous_drop_off", js: "continuous_drop_off", typ: null },
      { json: "continuous_pickup", js: "continuous_pickup", typ: null },
      { json: "departure", js: "departure", typ: r("Arrival") },
      { json: "departure_time", js: "departure_time", typ: "" },
      { json: "drop_off_type", js: "drop_off_type", typ: u(0, null) },
      { json: "interpolated", js: "interpolated", typ: null },
      { json: "pickup_type", js: "pickup_type", typ: u(0, null) },
      { json: "service_date", js: "service_date", typ: Date },
      { json: "shape_dist_traveled", js: "shape_dist_traveled", typ: 3.14 },
      { json: "stop_headsign", js: "stop_headsign", typ: u(null, "") },
      { json: "stop_sequence", js: "stop_sequence", typ: 0 },
      { json: "timepoint", js: "timepoint", typ: null },
      { json: "trip", js: "trip", typ: r("Trip") },
    ],
    false,
  ),
  Arrival: o(
    [
      { json: "delay", js: "delay", typ: null },
      { json: "estimated", js: "estimated", typ: null },
      { json: "estimated_utc", js: "estimated_utc", typ: null },
      { json: "scheduled", js: "scheduled", typ: "" },
      { json: "uncertainty", js: "uncertainty", typ: null },
    ],
    false,
  ),
  Trip: o(
    [
      { json: "bikes_allowed", js: "bikes_allowed", typ: 0 },
      { json: "block_id", js: "block_id", typ: "" },
      { json: "direction_id", js: "direction_id", typ: 0 },
      { json: "frequencies", js: "frequencies", typ: a("any") },
      { json: "id", js: "id", typ: 0 },
      { json: "route", js: "route", typ: r("Route") },
      { json: "shape", js: "shape", typ: r("Shape") },
      { json: "stop_pattern_id", js: "stop_pattern_id", typ: 0 },
      { json: "timestamp", js: "timestamp", typ: null },
      { json: "trip_headsign", js: "trip_headsign", typ: "" },
      { json: "trip_id", js: "trip_id", typ: "" },
      { json: "trip_short_name", js: "trip_short_name", typ: "" },
      { json: "wheelchair_accessible", js: "wheelchair_accessible", typ: 0 },
    ],
    false,
  ),
  Route: o(
    [
      { json: "agency", js: "agency", typ: r("Agency") },
      { json: "continuous_drop_off", js: "continuous_drop_off", typ: null },
      { json: "continuous_pickup", js: "continuous_pickup", typ: null },
      { json: "id", js: "id", typ: 0 },
      { json: "onestop_id", js: "onestop_id", typ: "" },
      { json: "route_color", js: "route_color", typ: "" },
      { json: "route_desc", js: "route_desc", typ: "" },
      { json: "route_id", js: "route_id", typ: "" },
      { json: "route_long_name", js: "route_long_name", typ: "" },
      { json: "route_short_name", js: "route_short_name", typ: "" },
      { json: "route_text_color", js: "route_text_color", typ: "" },
      { json: "route_type", js: "route_type", typ: 0 },
      { json: "route_url", js: "route_url", typ: "" },
    ],
    false,
  ),
  Agency: o(
    [
      { json: "agency_id", js: "agency_id", typ: "" },
      { json: "agency_name", js: "agency_name", typ: "" },
      { json: "id", js: "id", typ: 0 },
      { json: "onestop_id", js: "onestop_id", typ: "" },
    ],
    false,
  ),
  Shape: o(
    [
      { json: "generated", js: "generated", typ: true },
      { json: "id", js: "id", typ: 0 },
      { json: "shape_id", js: "shape_id", typ: "" },
    ],
    false,
  ),
  FeedVersion: o(
    [
      { json: "feed", js: "feed", typ: r("Feed") },
      { json: "fetched_at", js: "fetched_at", typ: Date },
      { json: "id", js: "id", typ: 0 },
      { json: "sha1", js: "sha1", typ: "" },
    ],
    false,
  ),
  Feed: o(
    [
      { json: "id", js: "id", typ: 0 },
      { json: "onestop_id", js: "onestop_id", typ: "" },
    ],
    false,
  ),
  Geometry: o(
    [
      { json: "coordinates", js: "coordinates", typ: a(3.14) },
      { json: "type", js: "type", typ: "" },
    ],
    false,
  ),
};
