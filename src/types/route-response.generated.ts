// To parse this data:
//
//   import { Convert, RouteResponse } from "./file";
//
//   const routeResponse = Convert.toRouteResponse(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface RouteResponse {
  meta?: Meta;
  routes: Route[];
}

export interface Meta {
  after: number;
  next: string;
}

export interface Route {
  agency: Agency;
  continuous_drop_off: null;
  continuous_pickup: null;
  feed_version: FeedVersion;
  id: number;
  onestop_id: null | string;
  route_color: string;
  route_desc: string;
  route_id: string;
  route_long_name: string;
  route_short_name: string;
  route_sort_order: number;
  route_text_color: string;
  route_type: number;
  route_url: string;
  geometry?: RouteGeometry;
  route_stops?: RouteStop[];
}

export interface Agency {
  agency_id: string;
  agency_name: string;
  id: number;
  onestop_id: string;
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

export interface RouteGeometry {
  coordinates: Array<Array<number[]>>;
  type: string;
}

export interface RouteStop {
  stop: Stop;
}

export interface Stop {
  geometry: StopGeometry;
  id: number;
  stop_id: string;
  stop_name: string;
}

export interface StopGeometry {
  coordinates: number[];
  type: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toRouteResponse(json: string): RouteResponse {
    return cast(JSON.parse(json), r("RouteResponse"));
  }

  public static routeResponseToJson(value: RouteResponse): string {
    return JSON.stringify(uncast(value, r("RouteResponse")), null, 2);
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
  RouteResponse: o(
    [
      { json: "meta", js: "meta", typ: u(undefined, r("Meta")) },
      { json: "routes", js: "routes", typ: a(r("Route")) },
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
  Route: o(
    [
      { json: "agency", js: "agency", typ: r("Agency") },
      { json: "continuous_drop_off", js: "continuous_drop_off", typ: null },
      { json: "continuous_pickup", js: "continuous_pickup", typ: null },
      { json: "feed_version", js: "feed_version", typ: r("FeedVersion") },
      { json: "id", js: "id", typ: 0 },
      { json: "onestop_id", js: "onestop_id", typ: u(null, "") },
      { json: "route_color", js: "route_color", typ: "" },
      { json: "route_desc", js: "route_desc", typ: "" },
      { json: "route_id", js: "route_id", typ: "" },
      { json: "route_long_name", js: "route_long_name", typ: "" },
      { json: "route_short_name", js: "route_short_name", typ: "" },
      { json: "route_sort_order", js: "route_sort_order", typ: 0 },
      { json: "route_text_color", js: "route_text_color", typ: "" },
      { json: "route_type", js: "route_type", typ: 0 },
      { json: "route_url", js: "route_url", typ: "" },
      {
        json: "geometry",
        js: "geometry",
        typ: u(undefined, r("RouteGeometry")),
      },
      {
        json: "route_stops",
        js: "route_stops",
        typ: u(undefined, a(r("RouteStop"))),
      },
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
  RouteGeometry: o(
    [
      { json: "coordinates", js: "coordinates", typ: a(a(a(3.14))) },
      { json: "type", js: "type", typ: "" },
    ],
    false,
  ),
  RouteStop: o([{ json: "stop", js: "stop", typ: r("Stop") }], false),
  Stop: o(
    [
      { json: "geometry", js: "geometry", typ: r("StopGeometry") },
      { json: "id", js: "id", typ: 0 },
      { json: "stop_id", js: "stop_id", typ: "" },
      { json: "stop_name", js: "stop_name", typ: "" },
    ],
    false,
  ),
  StopGeometry: o(
    [
      { json: "coordinates", js: "coordinates", typ: a(3.14) },
      { json: "type", js: "type", typ: "" },
    ],
    false,
  ),
};
