// To parse this data:
//
//   import { Convert, AgencyResponse } from "./file";
//
//   const agencyResponse = Convert.toAgencyResponse(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AgencyResponse {
  agencies: Agency[];
  meta?: Meta;
}

export interface Agency {
  agency_email: string;
  agency_fare_url: string;
  agency_id: string;
  agency_lang: string;
  agency_name: string;
  agency_phone: string;
  agency_timezone: string;
  agency_url: string;
  feed_version: FeedVersion;
  geometry: Geometry | null;
  id: number;
  onestop_id: string;
  operator: Operator | null;
  places: Place[] | null;
  routes?: Route[];
}

export interface FeedVersion {
  feed: FeedVersionFeed;
  fetched_at: Date;
  id: number;
  sha1: string;
}

export interface FeedVersionFeed {
  id: number;
  onestop_id: string;
}

export interface Geometry {
  coordinates: Array<Array<number[]>>;
  type: string;
}

export interface Operator {
  feeds: FeedElement[];
  name: string;
  onestop_id: string;
  short_name: null | string;
  tags: Tags | null;
}

export interface FeedElement {
  id: number;
  name: null;
  onestop_id: string;
  spec: string;
}

export interface Tags {
  twitter_general?: string;
  us_ntd_id?: string;
  wikidata_id?: string;
  needs_agency_id?: string;
  managed_by?: string;
  developer_site?: string;
}

export interface Place {
  adm0_name: string;
  adm1_name: string;
  city_name: null | string;
}

export interface Route {
  id: number;
  route_id: string;
  route_long_name: string;
  route_short_name: string;
}

export interface Meta {
  after: number;
  next: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toAgencyResponse(json: string): AgencyResponse {
    return cast(JSON.parse(json), r("AgencyResponse"));
  }

  public static agencyResponseToJson(value: AgencyResponse): string {
    return JSON.stringify(uncast(value, r("AgencyResponse")), null, 2);
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
  AgencyResponse: o(
    [
      { json: "agencies", js: "agencies", typ: a(r("Agency")) },
      { json: "meta", js: "meta", typ: u(undefined, r("Meta")) },
    ],
    false,
  ),
  Agency: o(
    [
      { json: "agency_email", js: "agency_email", typ: "" },
      { json: "agency_fare_url", js: "agency_fare_url", typ: "" },
      { json: "agency_id", js: "agency_id", typ: "" },
      { json: "agency_lang", js: "agency_lang", typ: "" },
      { json: "agency_name", js: "agency_name", typ: "" },
      { json: "agency_phone", js: "agency_phone", typ: "" },
      { json: "agency_timezone", js: "agency_timezone", typ: "" },
      { json: "agency_url", js: "agency_url", typ: "" },
      { json: "feed_version", js: "feed_version", typ: r("FeedVersion") },
      { json: "geometry", js: "geometry", typ: u(r("Geometry"), null) },
      { json: "id", js: "id", typ: 0 },
      { json: "onestop_id", js: "onestop_id", typ: "" },
      { json: "operator", js: "operator", typ: u(r("Operator"), null) },
      { json: "places", js: "places", typ: u(a(r("Place")), null) },
      { json: "routes", js: "routes", typ: u(undefined, a(r("Route"))) },
    ],
    false,
  ),
  FeedVersion: o(
    [
      { json: "feed", js: "feed", typ: r("FeedVersionFeed") },
      { json: "fetched_at", js: "fetched_at", typ: Date },
      { json: "id", js: "id", typ: 0 },
      { json: "sha1", js: "sha1", typ: "" },
    ],
    false,
  ),
  FeedVersionFeed: o(
    [
      { json: "id", js: "id", typ: 0 },
      { json: "onestop_id", js: "onestop_id", typ: "" },
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
  Operator: o(
    [
      { json: "feeds", js: "feeds", typ: a(r("FeedElement")) },
      { json: "name", js: "name", typ: "" },
      { json: "onestop_id", js: "onestop_id", typ: "" },
      { json: "short_name", js: "short_name", typ: u(null, "") },
      { json: "tags", js: "tags", typ: u(r("Tags"), null) },
    ],
    false,
  ),
  FeedElement: o(
    [
      { json: "id", js: "id", typ: 0 },
      { json: "name", js: "name", typ: null },
      { json: "onestop_id", js: "onestop_id", typ: "" },
      { json: "spec", js: "spec", typ: "" },
    ],
    false,
  ),
  Tags: o(
    [
      { json: "twitter_general", js: "twitter_general", typ: u(undefined, "") },
      { json: "us_ntd_id", js: "us_ntd_id", typ: u(undefined, "") },
      { json: "wikidata_id", js: "wikidata_id", typ: u(undefined, "") },
      { json: "needs_agency_id", js: "needs_agency_id", typ: u(undefined, "") },
      { json: "managed_by", js: "managed_by", typ: u(undefined, "") },
      { json: "developer_site", js: "developer_site", typ: u(undefined, "") },
    ],
    false,
  ),
  Place: o(
    [
      { json: "adm0_name", js: "adm0_name", typ: "" },
      { json: "adm1_name", js: "adm1_name", typ: "" },
      { json: "city_name", js: "city_name", typ: u(null, "") },
    ],
    false,
  ),
  Route: o(
    [
      { json: "id", js: "id", typ: 0 },
      { json: "route_id", js: "route_id", typ: "" },
      { json: "route_long_name", js: "route_long_name", typ: "" },
      { json: "route_short_name", js: "route_short_name", typ: "" },
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
