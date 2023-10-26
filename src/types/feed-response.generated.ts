// To parse this data:
//
//   import { Convert, FeedResponse } from "./file";
//
//   const feedResponse = Convert.toFeedResponse(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface FeedResponse {
  feeds: Feed[];
  meta?: Meta;
}

export interface Feed {
  authorization: Authorization;
  feed_state: FeedState;
  feed_versions: FeedVersionElement[];
  id: number;
  languages: string[] | null;
  license: License;
  name: null;
  onestop_id: string;
  spec: string;
  urls: Urls;
}

export interface Authorization {
  info_url: string;
  param_name: string;
  type: string;
}

export interface FeedState {
  feed_version: FeedStateFeedVersion | null;
}

export interface FeedStateFeedVersion {
  feed_version_gtfs_import: FeedVersionGtfsImport;
  fetched_at: Date;
  geometry: Geometry | null;
  id: number;
  sha1: string;
  url: string;
}

export interface FeedVersionGtfsImport {
  exception_log: string;
  id: number;
  in_progress: boolean;
  success: boolean;
}

export interface Geometry {
  coordinates: Array<Array<number[]>>;
  type: string;
}

export interface FeedVersionElement {
  earliest_calendar_date: Date;
  fetched_at: Date;
  id: number;
  latest_calendar_date: Date;
  sha1: string;
  url: string;
}

export interface License {
  attribution_instructions: string;
  attribution_text: string;
  commercial_use_allowed: string;
  create_derived_product: string;
  redistribution_allowed: string;
  share_alike_optional: string;
  spdx_identifier: string;
  url: string;
  use_without_attribution: string;
}

export interface Urls {
  gbfs_auto_discovery: string;
  mds_provider: string;
  realtime_alerts: string;
  realtime_trip_updates: string;
  realtime_vehicle_positions: string;
  static_current: string;
  static_historic: string[];
  static_planned: string;
}

export interface Meta {
  after: number;
  next: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toFeedResponse(json: string): FeedResponse {
    return cast(JSON.parse(json), r("FeedResponse"));
  }

  public static feedResponseToJson(value: FeedResponse): string {
    return JSON.stringify(uncast(value, r("FeedResponse")), null, 2);
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
  FeedResponse: o(
    [
      { json: "feeds", js: "feeds", typ: a(r("Feed")) },
      { json: "meta", js: "meta", typ: u(undefined, r("Meta")) },
    ],
    false,
  ),
  Feed: o(
    [
      { json: "authorization", js: "authorization", typ: r("Authorization") },
      { json: "feed_state", js: "feed_state", typ: r("FeedState") },
      {
        json: "feed_versions",
        js: "feed_versions",
        typ: a(r("FeedVersionElement")),
      },
      { json: "id", js: "id", typ: 0 },
      { json: "languages", js: "languages", typ: u(a(""), null) },
      { json: "license", js: "license", typ: r("License") },
      { json: "name", js: "name", typ: null },
      { json: "onestop_id", js: "onestop_id", typ: "" },
      { json: "spec", js: "spec", typ: "" },
      { json: "urls", js: "urls", typ: r("Urls") },
    ],
    false,
  ),
  Authorization: o(
    [
      { json: "info_url", js: "info_url", typ: "" },
      { json: "param_name", js: "param_name", typ: "" },
      { json: "type", js: "type", typ: "" },
    ],
    false,
  ),
  FeedState: o(
    [
      {
        json: "feed_version",
        js: "feed_version",
        typ: u(r("FeedStateFeedVersion"), null),
      },
    ],
    false,
  ),
  FeedStateFeedVersion: o(
    [
      {
        json: "feed_version_gtfs_import",
        js: "feed_version_gtfs_import",
        typ: r("FeedVersionGtfsImport"),
      },
      { json: "fetched_at", js: "fetched_at", typ: Date },
      { json: "geometry", js: "geometry", typ: u(r("Geometry"), null) },
      { json: "id", js: "id", typ: 0 },
      { json: "sha1", js: "sha1", typ: "" },
      { json: "url", js: "url", typ: "" },
    ],
    false,
  ),
  FeedVersionGtfsImport: o(
    [
      { json: "exception_log", js: "exception_log", typ: "" },
      { json: "id", js: "id", typ: 0 },
      { json: "in_progress", js: "in_progress", typ: true },
      { json: "success", js: "success", typ: true },
    ],
    false,
  ),
  Geometry: o(
    [
      { json: "coordinates", js: "coordinates", typ: a(a(a(3.14))) },
      { json: "type", js: "type", typ: "" },
    ],
    false,
  ),
  FeedVersionElement: o(
    [
      {
        json: "earliest_calendar_date",
        js: "earliest_calendar_date",
        typ: Date,
      },
      { json: "fetched_at", js: "fetched_at", typ: Date },
      { json: "id", js: "id", typ: 0 },
      { json: "latest_calendar_date", js: "latest_calendar_date", typ: Date },
      { json: "sha1", js: "sha1", typ: "" },
      { json: "url", js: "url", typ: "" },
    ],
    false,
  ),
  License: o(
    [
      {
        json: "attribution_instructions",
        js: "attribution_instructions",
        typ: "",
      },
      { json: "attribution_text", js: "attribution_text", typ: "" },
      { json: "commercial_use_allowed", js: "commercial_use_allowed", typ: "" },
      { json: "create_derived_product", js: "create_derived_product", typ: "" },
      { json: "redistribution_allowed", js: "redistribution_allowed", typ: "" },
      { json: "share_alike_optional", js: "share_alike_optional", typ: "" },
      { json: "spdx_identifier", js: "spdx_identifier", typ: "" },
      { json: "url", js: "url", typ: "" },
      {
        json: "use_without_attribution",
        js: "use_without_attribution",
        typ: "",
      },
    ],
    false,
  ),
  Urls: o(
    [
      { json: "gbfs_auto_discovery", js: "gbfs_auto_discovery", typ: "" },
      { json: "mds_provider", js: "mds_provider", typ: "" },
      { json: "realtime_alerts", js: "realtime_alerts", typ: "" },
      { json: "realtime_trip_updates", js: "realtime_trip_updates", typ: "" },
      {
        json: "realtime_vehicle_positions",
        js: "realtime_vehicle_positions",
        typ: "",
      },
      { json: "static_current", js: "static_current", typ: "" },
      { json: "static_historic", js: "static_historic", typ: a("") },
      { json: "static_planned", js: "static_planned", typ: "" },
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
};
