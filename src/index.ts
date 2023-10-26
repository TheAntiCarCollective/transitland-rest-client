export { default } from "./client";
export * from "./client";
export * from "./onestop-id";

// region Generate Types
export {
  AgencyResponse,
  FeedElement,
  FeedVersionFeed,
  Operator,
  Tags,
} from "./types/agency-response.generated";
import type * as AgencyResponse from "./types/agency-response.generated";

export {
  Arrival,
  Departure,
  DepartureResponse,
} from "./types/departure-response.generated";
import type * as DepartureResponse from "./types/departure-response.generated";

export {
  Authorization,
  FeedResponse,
  FeedState,
  FeedStateFeedVersion,
  FeedVersionElement,
  License,
  Urls,
} from "./types/feed-response.generated";
import type * as FeedResponse from "./types/feed-response.generated";

export {
  FeedInfo,
  FeedVersionResponse,
  File,
  ServiceLevel,
  SkipEntityCount,
  WarningCount,
} from "./types/feed-version-response.generated";
import type * as FeedVersionResponse from "./types/feed-version-response.generated";

export {
  RouteGeometry,
  RouteResponse,
  StopGeometry,
} from "./types/route-response.generated";
import type * as RouteResponse from "./types/route-response.generated";

export { Parent, StopResponse } from "./types/stop-response.generated";
import type * as StopResponse from "./types/stop-response.generated";

export {
  Calendar,
  Frequency,
  TripResponse,
} from "./types/trip-response.generated";
import type * as TripResponse from "./types/trip-response.generated";

/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
export type Agency =
  | AgencyResponse.Agency
  | DepartureResponse.Agency
  | RouteResponse.Agency
  | StopResponse.Agency;

export type Feed =
  | DepartureResponse.Feed
  | FeedResponse.Feed
  | FeedVersionResponse.Feed
  | RouteResponse.Feed
  | StopResponse.Feed
  | TripResponse.Feed;

export type FeedVersion =
  | AgencyResponse.FeedVersion
  | DepartureResponse.FeedVersion
  | FeedVersionResponse.FeedVersion
  | RouteResponse.FeedVersion
  | StopResponse.FeedVersion
  | TripResponse.FeedVersion;

export type FeedVersionGtfsImport =
  | FeedResponse.FeedVersionGtfsImport
  | FeedVersionResponse.FeedVersionGtfsImport;

export type Geometry =
  | AgencyResponse.Geometry
  | DepartureResponse.Geometry
  | FeedResponse.Geometry
  | StopResponse.Geometry;

export type Meta =
  | AgencyResponse.Meta
  | FeedResponse.Meta
  | FeedVersionResponse.Meta
  | RouteResponse.Meta
  | StopResponse.Meta
  | TripResponse.Meta;

export type Place = AgencyResponse.Place | StopResponse.Place;

export type Route =
  | AgencyResponse.Route
  | DepartureResponse.Route
  | RouteResponse.Route
  | StopResponse.Route;

export type RouteStop = RouteResponse.RouteStop | StopResponse.RouteStop;

export type Shape = DepartureResponse.Shape | TripResponse.Shape;

export type Stop =
  | DepartureResponse.Stop
  | RouteResponse.Stop
  | StopResponse.Stop;

export type Trip = DepartureResponse.Trip | TripResponse.Trip;
/* eslint-enable @typescript-eslint/no-redundant-type-constituents */
// endregion
