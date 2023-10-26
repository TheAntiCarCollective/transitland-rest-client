// To parse this data:
//
//   import { Convert, TripResponse } from "./file";
//
//   const tripResponse = Convert.toTripResponse(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface TripResponse {
  trips: Trip[];
  meta?: Meta;
}

export interface Meta {
  after: number;
  next: string;
}

export interface Trip {
  bikes_allowed: number;
  block_id: string;
  calendar: Calendar;
  direction_id: number;
  feed_version: FeedVersion;
  frequencies: Frequency[];
  id: number;
  shape: Shape;
  stop_pattern_id: number;
  trip_headsign: string;
  trip_id: string;
  trip_short_name: string;
  wheelchair_accessible: number;
}

export interface Calendar {
  added_dates: Date[];
  end_date: Date;
  friday: number;
  monday: number;
  removed_dates: Date[];
  saturday: number;
  service_id: string;
  start_date: Date;
  sunday: number;
  thursday: number;
  tuesday: number;
  wednesday: number;
}

export interface FeedVersion {
  feed: Feed;
  fetched_at: Date;
  sha1: string;
}

export interface Feed {
  id: number;
  onestop_id: string;
}

export interface Frequency {
  end_time: string;
  exact_times: number;
  headway_secs: number;
  start_time: string;
}

export interface Shape {
  generated: boolean;
  shape_id: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toTripResponse(json: string): TripResponse {
    return cast(JSON.parse(json), r("TripResponse"));
  }

  public static tripResponseToJson(value: TripResponse): string {
    return JSON.stringify(uncast(value, r("TripResponse")), null, 2);
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
  TripResponse: o(
    [
      { json: "trips", js: "trips", typ: a(r("Trip")) },
      { json: "meta", js: "meta", typ: u(undefined, r("Meta")) },
    ],
    false,
  ),
  Meta: o(
    [
      { json: "after", js: "after", typ: 0 },
      { json: "next", js: "next", typ: "" },
    ],
    false,
  ),
  Trip: o(
    [
      { json: "bikes_allowed", js: "bikes_allowed", typ: 0 },
      { json: "block_id", js: "block_id", typ: "" },
      { json: "calendar", js: "calendar", typ: r("Calendar") },
      { json: "direction_id", js: "direction_id", typ: 0 },
      { json: "feed_version", js: "feed_version", typ: r("FeedVersion") },
      { json: "frequencies", js: "frequencies", typ: a(r("Frequency")) },
      { json: "id", js: "id", typ: 0 },
      { json: "shape", js: "shape", typ: r("Shape") },
      { json: "stop_pattern_id", js: "stop_pattern_id", typ: 0 },
      { json: "trip_headsign", js: "trip_headsign", typ: "" },
      { json: "trip_id", js: "trip_id", typ: "" },
      { json: "trip_short_name", js: "trip_short_name", typ: "" },
      { json: "wheelchair_accessible", js: "wheelchair_accessible", typ: 0 },
    ],
    false,
  ),
  Calendar: o(
    [
      { json: "added_dates", js: "added_dates", typ: a(Date) },
      { json: "end_date", js: "end_date", typ: Date },
      { json: "friday", js: "friday", typ: 0 },
      { json: "monday", js: "monday", typ: 0 },
      { json: "removed_dates", js: "removed_dates", typ: a(Date) },
      { json: "saturday", js: "saturday", typ: 0 },
      { json: "service_id", js: "service_id", typ: "" },
      { json: "start_date", js: "start_date", typ: Date },
      { json: "sunday", js: "sunday", typ: 0 },
      { json: "thursday", js: "thursday", typ: 0 },
      { json: "tuesday", js: "tuesday", typ: 0 },
      { json: "wednesday", js: "wednesday", typ: 0 },
    ],
    false,
  ),
  FeedVersion: o(
    [
      { json: "feed", js: "feed", typ: r("Feed") },
      { json: "fetched_at", js: "fetched_at", typ: Date },
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
  Frequency: o(
    [
      { json: "end_time", js: "end_time", typ: "" },
      { json: "exact_times", js: "exact_times", typ: 0 },
      { json: "headway_secs", js: "headway_secs", typ: 0 },
      { json: "start_time", js: "start_time", typ: "" },
    ],
    false,
  ),
  Shape: o(
    [
      { json: "generated", js: "generated", typ: true },
      { json: "shape_id", js: "shape_id", typ: "" },
    ],
    false,
  ),
};
