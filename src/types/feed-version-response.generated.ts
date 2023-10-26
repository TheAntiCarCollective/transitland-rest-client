// To parse this data:
//
//   import { Convert, FeedVersionResponse } from "./file";
//
//   const feedVersionResponse = Convert.toFeedVersionResponse(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface FeedVersionResponse {
  feed_versions: FeedVersion[];
  meta?: Meta;
}

export interface FeedVersion {
  earliest_calendar_date: Date;
  feed: Feed;
  feed_infos: FeedInfo[];
  feed_version_gtfs_import: FeedVersionGtfsImport | null;
  fetched_at: Date;
  files: File[];
  geometry: Geometry | null;
  id: number;
  latest_calendar_date: Date;
  service_levels: ServiceLevel[];
  sha1: string;
  url: string;
}

export interface Feed {
  name: null;
  onestop_id: string;
  spec: string;
}

export interface FeedInfo {
  default_lang: null | string;
  feed_contact_email: null | string;
  feed_contact_url: null | string;
  feed_end_date: Date | null;
  feed_lang: string;
  feed_publisher_name: string;
  feed_publisher_url: string;
  feed_start_date: Date | null;
}

export interface FeedVersionGtfsImport {
  exception_log: string;
  in_progress: boolean;
  interpolated_stop_time_count: number;
  skip_entity_error_count: { [key: string]: number } | null;
  skip_entity_filter_count: SkipEntityCount | null;
  skip_entity_marked_count: SkipEntityCount | null;
  success: boolean;
  warning_count: WarningCount | null;
}

export interface SkipEntityCount {}

export interface WarningCount {
  ""?: number;
}

export interface File {
  csv_like: boolean;
  header: string;
  name: string;
  rows: number;
  sha1: string;
  size: number;
}

export interface Geometry {
  coordinates: Array<Array<number[]>>;
  type: string;
}

export interface ServiceLevel {
  end_date: Date;
  friday: number;
  monday: number;
  saturday: number;
  start_date: Date;
  sunday: number;
  thursday: number;
  tuesday: number;
  wednesday: number;
}

export interface Meta {
  after: number;
  next: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toFeedVersionResponse(json: string): FeedVersionResponse {
    return cast(JSON.parse(json), r("FeedVersionResponse"));
  }

  public static feedVersionResponseToJson(value: FeedVersionResponse): string {
    return JSON.stringify(uncast(value, r("FeedVersionResponse")), null, 2);
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
  FeedVersionResponse: o(
    [
      { json: "feed_versions", js: "feed_versions", typ: a(r("FeedVersion")) },
      { json: "meta", js: "meta", typ: u(undefined, r("Meta")) },
    ],
    false,
  ),
  FeedVersion: o(
    [
      {
        json: "earliest_calendar_date",
        js: "earliest_calendar_date",
        typ: Date,
      },
      { json: "feed", js: "feed", typ: r("Feed") },
      { json: "feed_infos", js: "feed_infos", typ: a(r("FeedInfo")) },
      {
        json: "feed_version_gtfs_import",
        js: "feed_version_gtfs_import",
        typ: u(r("FeedVersionGtfsImport"), null),
      },
      { json: "fetched_at", js: "fetched_at", typ: Date },
      { json: "files", js: "files", typ: a(r("File")) },
      { json: "geometry", js: "geometry", typ: u(r("Geometry"), null) },
      { json: "id", js: "id", typ: 0 },
      { json: "latest_calendar_date", js: "latest_calendar_date", typ: Date },
      {
        json: "service_levels",
        js: "service_levels",
        typ: a(r("ServiceLevel")),
      },
      { json: "sha1", js: "sha1", typ: "" },
      { json: "url", js: "url", typ: "" },
    ],
    false,
  ),
  Feed: o(
    [
      { json: "name", js: "name", typ: null },
      { json: "onestop_id", js: "onestop_id", typ: "" },
      { json: "spec", js: "spec", typ: "" },
    ],
    false,
  ),
  FeedInfo: o(
    [
      { json: "default_lang", js: "default_lang", typ: u(null, "") },
      {
        json: "feed_contact_email",
        js: "feed_contact_email",
        typ: u(null, ""),
      },
      { json: "feed_contact_url", js: "feed_contact_url", typ: u(null, "") },
      { json: "feed_end_date", js: "feed_end_date", typ: u(Date, null) },
      { json: "feed_lang", js: "feed_lang", typ: "" },
      { json: "feed_publisher_name", js: "feed_publisher_name", typ: "" },
      { json: "feed_publisher_url", js: "feed_publisher_url", typ: "" },
      { json: "feed_start_date", js: "feed_start_date", typ: u(Date, null) },
    ],
    false,
  ),
  FeedVersionGtfsImport: o(
    [
      { json: "exception_log", js: "exception_log", typ: "" },
      { json: "in_progress", js: "in_progress", typ: true },
      {
        json: "interpolated_stop_time_count",
        js: "interpolated_stop_time_count",
        typ: 0,
      },
      {
        json: "skip_entity_error_count",
        js: "skip_entity_error_count",
        typ: u(m(0), null),
      },
      {
        json: "skip_entity_filter_count",
        js: "skip_entity_filter_count",
        typ: u(r("SkipEntityCount"), null),
      },
      {
        json: "skip_entity_marked_count",
        js: "skip_entity_marked_count",
        typ: u(r("SkipEntityCount"), null),
      },
      { json: "success", js: "success", typ: true },
      {
        json: "warning_count",
        js: "warning_count",
        typ: u(r("WarningCount"), null),
      },
    ],
    false,
  ),
  SkipEntityCount: o([], false),
  WarningCount: o([{ json: "", js: "", typ: u(undefined, 0) }], false),
  File: o(
    [
      { json: "csv_like", js: "csv_like", typ: true },
      { json: "header", js: "header", typ: "" },
      { json: "name", js: "name", typ: "" },
      { json: "rows", js: "rows", typ: 0 },
      { json: "sha1", js: "sha1", typ: "" },
      { json: "size", js: "size", typ: 0 },
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
  ServiceLevel: o(
    [
      { json: "end_date", js: "end_date", typ: Date },
      { json: "friday", js: "friday", typ: 0 },
      { json: "monday", js: "monday", typ: 0 },
      { json: "saturday", js: "saturday", typ: 0 },
      { json: "start_date", js: "start_date", typ: Date },
      { json: "sunday", js: "sunday", typ: 0 },
      { json: "thursday", js: "thursday", typ: 0 },
      { json: "tuesday", js: "tuesday", typ: 0 },
      { json: "wednesday", js: "wednesday", typ: 0 },
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
