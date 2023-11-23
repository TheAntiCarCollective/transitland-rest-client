export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Any: { input: any; output: any; }
  Bool: { input: any; output: any; }
  Counts: { input: any; output: any; }
  Date: { input: any; output: any; }
  Geometry: { input: any; output: any; }
  Key: { input: any; output: any; }
  LineString: { input: any; output: any; }
  Map: { input: any; output: any; }
  Point: { input: any; output: any; }
  Polygon: { input: any; output: any; }
  Seconds: { input: any; output: any; }
  Strings: { input: any; output: any; }
  Tags: { input: any; output: any; }
  Time: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

/** See https://gtfs.org/schedule/reference/#agencytxt */
export type Agency = {
  __typename?: 'Agency';
  agency_email: Scalars['String']['output'];
  agency_fare_url: Scalars['String']['output'];
  agency_id: Scalars['String']['output'];
  agency_lang: Scalars['String']['output'];
  agency_name: Scalars['String']['output'];
  agency_phone: Scalars['String']['output'];
  agency_timezone: Scalars['String']['output'];
  agency_url: Scalars['String']['output'];
  alerts: Maybe<Array<Alert>>;
  census_geographies: Maybe<Array<CensusGeography>>;
  feed_onestop_id: Maybe<Scalars['String']['output']>;
  feed_version: FeedVersion;
  feed_version_sha1: Maybe<Scalars['String']['output']>;
  geometry: Maybe<Scalars['Polygon']['output']>;
  id: Scalars['Int']['output'];
  onestop_id: Scalars['String']['output'];
  operator: Maybe<Operator>;
  places: Maybe<Array<AgencyPlace>>;
  routes: Array<Route>;
  search_rank: Maybe<Scalars['String']['output']>;
};


/** See https://gtfs.org/schedule/reference/#agencytxt */
export type AgencyAlertsArgs = {
  active: InputMaybe<Scalars['Boolean']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
};


/** See https://gtfs.org/schedule/reference/#agencytxt */
export type AgencyCensus_GeographiesArgs = {
  layer: Scalars['String']['input'];
  limit: InputMaybe<Scalars['Int']['input']>;
  radius: InputMaybe<Scalars['Float']['input']>;
};


/** See https://gtfs.org/schedule/reference/#agencytxt */
export type AgencyPlacesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<AgencyPlaceFilter>;
};


/** See https://gtfs.org/schedule/reference/#agencytxt */
export type AgencyRoutesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<RouteFilter>;
};

export type AgencyFilter = {
  /** Search by country 2 letter ISO 3166 code (provided by Natural Earth) */
  adm0_iso: InputMaybe<Scalars['String']['input']>;
  /** Search by country name (provided by Natural Earth) */
  adm0_name: InputMaybe<Scalars['String']['input']>;
  /** Search by state/province/division ISO 3166-2 code (provided by Natural Earth) */
  adm1_iso: InputMaybe<Scalars['String']['input']>;
  /** Search by state/province/division name (provided by Natural Earth) */
  adm1_name: InputMaybe<Scalars['String']['input']>;
  agency_id: InputMaybe<Scalars['String']['input']>;
  /** Search for records with this GTFS agency_name */
  agency_name: InputMaybe<Scalars['String']['input']>;
  bbox: InputMaybe<BoundingBox>;
  /** Search by city name (provided by Natural Earth) */
  city_name: InputMaybe<Scalars['String']['input']>;
  feed_onestop_id: InputMaybe<Scalars['String']['input']>;
  feed_version_sha1: InputMaybe<Scalars['String']['input']>;
  license: InputMaybe<LicenseFilter>;
  /** Search for agencies within a radius */
  near: InputMaybe<PointRadius>;
  onestop_id: InputMaybe<Scalars['String']['input']>;
  /** Full text search */
  search: InputMaybe<Scalars['String']['input']>;
  within: InputMaybe<Scalars['Polygon']['input']>;
};

export type AgencyPlace = {
  __typename?: 'AgencyPlace';
  adm0_iso: Maybe<Scalars['String']['output']>;
  adm0_name: Maybe<Scalars['String']['output']>;
  adm1_iso: Maybe<Scalars['String']['output']>;
  adm1_name: Maybe<Scalars['String']['output']>;
  city_name: Maybe<Scalars['String']['output']>;
  rank: Maybe<Scalars['Float']['output']>;
};

export type AgencyPlaceFilter = {
  min_rank: InputMaybe<Scalars['Float']['input']>;
};

/** [Alert](https://gtfs.org/reference/realtime/v2/#message-alert) message, also called a service alert, provided by a source GTFS Realtime feed. */
export type Alert = {
  __typename?: 'Alert';
  active_period: Maybe<Array<RtTimeRange>>;
  cause: Maybe<Scalars['String']['output']>;
  description_text: Array<RtTranslation>;
  effect: Maybe<Scalars['String']['output']>;
  header_text: Array<RtTranslation>;
  severity_level: Maybe<Scalars['String']['output']>;
  tts_description_text: Maybe<Array<RtTranslation>>;
  tts_header_text: Maybe<Array<RtTranslation>>;
  url: Maybe<Array<RtTranslation>>;
};

export type BoundingBox = {
  max_lat: Scalars['Float']['input'];
  max_lon: Scalars['Float']['input'];
  min_lat: Scalars['Float']['input'];
  min_lon: Scalars['Float']['input'];
};

/** Record from a static GTFS [calendars.txt](https://gtfs.org/schedule/reference/#calendarstxt) file. */
export type Calendar = {
  __typename?: 'Calendar';
  added_dates: Array<Scalars['Date']['output']>;
  end_date: Scalars['Date']['output'];
  friday: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  monday: Scalars['Int']['output'];
  removed_dates: Array<Scalars['Date']['output']>;
  saturday: Scalars['Int']['output'];
  service_id: Scalars['String']['output'];
  start_date: Scalars['Date']['output'];
  sunday: Scalars['Int']['output'];
  thursday: Scalars['Int']['output'];
  tuesday: Scalars['Int']['output'];
  wednesday: Scalars['Int']['output'];
};


/** Record from a static GTFS [calendars.txt](https://gtfs.org/schedule/reference/#calendarstxt) file. */
export type CalendarAdded_DatesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
};


/** Record from a static GTFS [calendars.txt](https://gtfs.org/schedule/reference/#calendarstxt) file. */
export type CalendarRemoved_DatesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
};

export type CalendarDateFilter = {
  date: InputMaybe<Scalars['Date']['input']>;
  exception_type: InputMaybe<Scalars['Int']['input']>;
};

export type CensusGeography = {
  __typename?: 'CensusGeography';
  aland: Maybe<Scalars['Float']['output']>;
  awater: Maybe<Scalars['Float']['output']>;
  geoid: Maybe<Scalars['String']['output']>;
  geometry: Maybe<Scalars['Polygon']['output']>;
  id: Scalars['Int']['output'];
  layer_name: Scalars['String']['output'];
  name: Maybe<Scalars['String']['output']>;
  values: Array<Maybe<CensusValue>>;
};


export type CensusGeographyValuesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  table_names: Array<Scalars['String']['input']>;
};

export type CensusTable = {
  __typename?: 'CensusTable';
  id: Scalars['Int']['output'];
  table_group: Scalars['String']['output'];
  table_name: Scalars['String']['output'];
  table_title: Scalars['String']['output'];
};

export type CensusValue = {
  __typename?: 'CensusValue';
  table: CensusTable;
  values: Scalars['Any']['output'];
};

export type DirectionRequest = {
  depart_at: InputMaybe<Scalars['Time']['input']>;
  from: WaypointInput;
  mode: StepMode;
  to: WaypointInput;
};

export type Directions = {
  __typename?: 'Directions';
  data_source: Maybe<Scalars['String']['output']>;
  destination: Maybe<Waypoint>;
  distance: Maybe<Distance>;
  duration: Maybe<Duration>;
  end_time: Maybe<Scalars['Time']['output']>;
  exception: Maybe<Scalars['String']['output']>;
  itineraries: Maybe<Array<Itinerary>>;
  origin: Maybe<Waypoint>;
  start_time: Maybe<Scalars['Time']['output']>;
  success: Scalars['Boolean']['output'];
};

export type Distance = {
  __typename?: 'Distance';
  distance: Scalars['Float']['output'];
  units: DistanceUnit;
};

export enum DistanceUnit {
  Kilometers = 'KILOMETERS',
  Miles = 'MILES'
}

export type Duration = {
  __typename?: 'Duration';
  duration: Scalars['Float']['output'];
  units: DurationUnit;
};

export enum DurationUnit {
  Seconds = 'SECONDS'
}

/** Feeds contain details on how to access transit information, including URLs to data sources in various formats (GTFS, GTFS-RT, GBFS, etc), license information, related feeds, details on how to make authorized requests, and feed version archives. Feed versions are archived (as `.zip` files) and imported into the Transitland database for querying agencies, stops, routes, trips, etc. */
export type Feed = {
  __typename?: 'Feed';
  associated_operators: Maybe<Array<Operator>>;
  authorization: Maybe<FeedAuthorization>;
  feed_fetches: Maybe<Array<FeedFetch>>;
  feed_state: Maybe<FeedState>;
  /** Versions of this feed that have been fetched, archived, and imported by Transitland */
  feed_versions: Array<FeedVersion>;
  file: Scalars['String']['output'];
  /** Unique integer ID */
  id: Scalars['Int']['output'];
  /** Language(s) included in this feed */
  languages: Maybe<Array<Scalars['String']['output']>>;
  license: Maybe<FeedLicense>;
  /** A common name for this feed. Optional. Alternatively use `associated_operators[].name` */
  name: Maybe<Scalars['String']['output']>;
  /** Onestop ID for this feed */
  onestop_id: Scalars['String']['output'];
  search_rank: Maybe<Scalars['String']['output']>;
  spec: Maybe<FeedSpecTypes>;
  tags: Maybe<Scalars['Tags']['output']>;
  urls: Maybe<FeedUrls>;
};


/** Feeds contain details on how to access transit information, including URLs to data sources in various formats (GTFS, GTFS-RT, GBFS, etc), license information, related feeds, details on how to make authorized requests, and feed version archives. Feed versions are archived (as `.zip` files) and imported into the Transitland database for querying agencies, stops, routes, trips, etc. */
export type FeedFeed_FetchesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<FeedFetchFilter>;
};


/** Feeds contain details on how to access transit information, including URLs to data sources in various formats (GTFS, GTFS-RT, GBFS, etc), license information, related feeds, details on how to make authorized requests, and feed version archives. Feed versions are archived (as `.zip` files) and imported into the Transitland database for querying agencies, stops, routes, trips, etc. */
export type FeedFeed_VersionsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<FeedVersionFilter>;
};

/** Details on how to construct an HTTP request to access a protected resource */
export type FeedAuthorization = {
  __typename?: 'FeedAuthorization';
  /** Website to visit to sign up for an account */
  info_url: Scalars['String']['output'];
  /** When `type=query_param`, this specifies the name of the query parameter. When `type=header`, this specifies the name of the header */
  param_name: Scalars['String']['output'];
  /** Method for inserting authorization secret into request */
  type: Scalars['String']['output'];
};

export type FeedFetch = {
  __typename?: 'FeedFetch';
  fetch_error: Maybe<Scalars['String']['output']>;
  fetched_at: Maybe<Scalars['Time']['output']>;
  id: Scalars['Int']['output'];
  response_code: Maybe<Scalars['Int']['output']>;
  response_sha1: Maybe<Scalars['String']['output']>;
  response_size: Maybe<Scalars['Int']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
  url: Maybe<Scalars['String']['output']>;
  url_type: Maybe<Scalars['String']['output']>;
};

export type FeedFetchFilter = {
  success: InputMaybe<Scalars['Boolean']['input']>;
};

export type FeedFilter = {
  bbox: InputMaybe<BoundingBox>;
  /** Search for feeds with or without a fetch error */
  fetch_error: InputMaybe<Scalars['Boolean']['input']>;
  /** Search for feeds by their import status */
  import_status: InputMaybe<ImportStatus>;
  license: InputMaybe<LicenseFilter>;
  near: InputMaybe<PointRadius>;
  /** Search for feed with a specific Onestop ID */
  onestop_id: InputMaybe<Scalars['String']['input']>;
  /** Full text search */
  search: InputMaybe<Scalars['String']['input']>;
  /** Search for feeds by their source URLs */
  source_url: InputMaybe<FeedSourceUrl>;
  /** Search for feeds of certain data types */
  spec: InputMaybe<Array<FeedSpecTypes>>;
  /** Search for feeds with a tag */
  tags: InputMaybe<Scalars['Tags']['input']>;
  within: InputMaybe<Scalars['Polygon']['input']>;
};

/** Record from a static GTFS [feed_info.txt](https://gtfs.org/schedule/reference/#feed_infotxt) file. */
export type FeedInfo = {
  __typename?: 'FeedInfo';
  default_lang: Maybe<Scalars['String']['output']>;
  feed_contact_email: Maybe<Scalars['String']['output']>;
  feed_contact_url: Maybe<Scalars['String']['output']>;
  feed_end_date: Maybe<Scalars['Date']['output']>;
  feed_lang: Scalars['String']['output'];
  feed_publisher_name: Scalars['String']['output'];
  feed_publisher_url: Scalars['String']['output'];
  feed_start_date: Maybe<Scalars['Date']['output']>;
  feed_version: Scalars['String']['output'];
  id: Scalars['Int']['output'];
};

/** License information for this feed, curated by Interline and contributors to the Transitland Atlas feed registry. Note that this does not constitute legal advice. Users are advised to review and confirm any terms and conditions attached to a source feed. */
export type FeedLicense = {
  __typename?: 'FeedLicense';
  /** Feed consumers must follow these instructions for how to provide attribution */
  attribution_instructions: Scalars['String']['output'];
  /** Feed consumers must include this particular text when using this feed */
  attribution_text: Scalars['String']['output'];
  /** Are feed consumers allowed to use the feed for commercial purposes? */
  commercial_use_allowed: Scalars['String']['output'];
  /** Are feed consumers allowed to create and share derived products from the feed? */
  create_derived_product: Scalars['String']['output'];
  /** Are feed consumers allowed to redistribute the feed in its entirety? */
  redistribution_allowed: Scalars['String']['output'];
  /** Are feed consumers allowed to keep their modifications of this feed private? */
  share_alike_optional: Scalars['String']['output'];
  /** SPDX identifier for a common license. See https://spdx.org/licenses/ */
  spdx_identifier: Scalars['String']['output'];
  /** URL for a custom license */
  url: Scalars['String']['output'];
  /** Are feed consumers allowed to use the feed contents without including attribution text in their app or map? */
  use_without_attribution: Scalars['String']['output'];
};

export type FeedSourceUrl = {
  case_sensitive: InputMaybe<Scalars['Boolean']['input']>;
  type: InputMaybe<FeedSourceUrlTypes>;
  url: InputMaybe<Scalars['String']['input']>;
};

export enum FeedSourceUrlTypes {
  GbfsAutoDiscovery = 'gbfs_auto_discovery',
  MdsProvider = 'mds_provider',
  RealtimeAlerts = 'realtime_alerts',
  RealtimeTripUpdates = 'realtime_trip_updates',
  RealtimeVehiclePositions = 'realtime_vehicle_positions',
  StaticCurrent = 'static_current',
  StaticHistoric = 'static_historic',
  StaticHypothetical = 'static_hypothetical',
  StaticPlanned = 'static_planned'
}

/** Type of data contained in a source feed */
export enum FeedSpecTypes {
  Gbfs = 'GBFS',
  Gtfs = 'GTFS',
  GtfsRt = 'GTFS_RT',
  Mds = 'MDS'
}

/** Details on the current state of this feed, such as active version, last fetch time, etc. */
export type FeedState = {
  __typename?: 'FeedState';
  /** The active feed version for this feed */
  feed_version: Maybe<FeedVersion>;
  id: Scalars['Int']['output'];
};

/** URL(s) from which Transitland sources a feed */
export type FeedUrls = {
  __typename?: 'FeedUrls';
  /** URL for GBFS feed `gbfs.json` auto-discovery file */
  gbfs_auto_discovery: Scalars['String']['output'];
  /** URL for MDS feed provider endpoint */
  mds_provider: Scalars['String']['output'];
  /** URL for GTFS Realtime Alert messages */
  realtime_alerts: Scalars['String']['output'];
  /** URL for GTFS Realtime TripUpdate messages */
  realtime_trip_updates: Scalars['String']['output'];
  /** URL for GTFS Realtime VehiclePosition messages */
  realtime_vehicle_positions: Scalars['String']['output'];
  /** URL for the static feed that represents today's service */
  static_current: Scalars['String']['output'];
  /** URLs for static feeds that represent past service that is no longer in effect  */
  static_historic: Array<Scalars['String']['output']>;
  /** URLs for static feeds that represent service planned for upcoming dates. Typically used to represent calendar/service changes that will take effect few weeks or months in the future */
  static_planned: Scalars['String']['output'];
};

/** Feed versions represent a specific static GTFS file that was published at a particular point in time, and are generally accessed and referenced using the [SHA1 checksum](https://en.wikipedia.org/wiki/SHA-1) of the GTFS archive. */
export type FeedVersion = {
  __typename?: 'FeedVersion';
  agencies: Array<Agency>;
  created_by: Maybe<Scalars['String']['output']>;
  description: Maybe<Scalars['String']['output']>;
  earliest_calendar_date: Scalars['Date']['output'];
  feed: Feed;
  feed_infos: Array<FeedInfo>;
  feed_version_gtfs_import: Maybe<FeedVersionGtfsImport>;
  fetched_at: Scalars['Time']['output'];
  file: Maybe<Scalars['String']['output']>;
  /** Metadata for each text file present in the main directory of the zip archive  */
  files: Array<FeedVersionFileInfo>;
  /** Convex hull around all active stops in the feed version */
  geometry: Maybe<Scalars['Polygon']['output']>;
  id: Scalars['Int']['output'];
  latest_calendar_date: Scalars['Date']['output'];
  name: Maybe<Scalars['String']['output']>;
  routes: Array<Route>;
  service_levels: Array<FeedVersionServiceLevel>;
  sha1: Scalars['String']['output'];
  stops: Array<Stop>;
  trips: Array<Trip>;
  updated_by: Maybe<Scalars['String']['output']>;
  url: Scalars['String']['output'];
};


/** Feed versions represent a specific static GTFS file that was published at a particular point in time, and are generally accessed and referenced using the [SHA1 checksum](https://en.wikipedia.org/wiki/SHA-1) of the GTFS archive. */
export type FeedVersionAgenciesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<AgencyFilter>;
};


/** Feed versions represent a specific static GTFS file that was published at a particular point in time, and are generally accessed and referenced using the [SHA1 checksum](https://en.wikipedia.org/wiki/SHA-1) of the GTFS archive. */
export type FeedVersionFeed_InfosArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
};


/** Feed versions represent a specific static GTFS file that was published at a particular point in time, and are generally accessed and referenced using the [SHA1 checksum](https://en.wikipedia.org/wiki/SHA-1) of the GTFS archive. */
export type FeedVersionFilesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
};


/** Feed versions represent a specific static GTFS file that was published at a particular point in time, and are generally accessed and referenced using the [SHA1 checksum](https://en.wikipedia.org/wiki/SHA-1) of the GTFS archive. */
export type FeedVersionRoutesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<RouteFilter>;
};


/** Feed versions represent a specific static GTFS file that was published at a particular point in time, and are generally accessed and referenced using the [SHA1 checksum](https://en.wikipedia.org/wiki/SHA-1) of the GTFS archive. */
export type FeedVersionService_LevelsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<FeedVersionServiceLevelFilter>;
};


/** Feed versions represent a specific static GTFS file that was published at a particular point in time, and are generally accessed and referenced using the [SHA1 checksum](https://en.wikipedia.org/wiki/SHA-1) of the GTFS archive. */
export type FeedVersionStopsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<StopFilter>;
};


/** Feed versions represent a specific static GTFS file that was published at a particular point in time, and are generally accessed and referenced using the [SHA1 checksum](https://en.wikipedia.org/wiki/SHA-1) of the GTFS archive. */
export type FeedVersionTripsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<TripFilter>;
};

export type FeedVersionDeleteResult = {
  __typename?: 'FeedVersionDeleteResult';
  success: Scalars['Boolean']['output'];
};

export type FeedVersionFetchResult = {
  __typename?: 'FeedVersionFetchResult';
  feed_version: Maybe<FeedVersion>;
  fetch_error: Maybe<Scalars['String']['output']>;
  found_dir_sha1: Scalars['Boolean']['output'];
  found_sha1: Scalars['Boolean']['output'];
};

export type FeedVersionFileInfo = {
  __typename?: 'FeedVersionFileInfo';
  csv_like: Scalars['Boolean']['output'];
  header: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  rows: Scalars['Int']['output'];
  sha1: Scalars['String']['output'];
  size: Scalars['Int']['output'];
  values_count: Scalars['Counts']['output'];
  values_unique: Scalars['Counts']['output'];
};

export type FeedVersionFilter = {
  bbox: InputMaybe<BoundingBox>;
  covers: InputMaybe<ServiceCoversFilter>;
  feed_ids: InputMaybe<Array<Scalars['Int']['input']>>;
  feed_onestop_id: InputMaybe<Scalars['String']['input']>;
  file: InputMaybe<Scalars['String']['input']>;
  import_status: InputMaybe<ImportStatus>;
  near: InputMaybe<PointRadius>;
  sha1: InputMaybe<Scalars['String']['input']>;
  within: InputMaybe<Scalars['Polygon']['input']>;
};

export type FeedVersionGtfsImport = {
  __typename?: 'FeedVersionGtfsImport';
  created_at: Maybe<Scalars['Time']['output']>;
  entity_count: Maybe<Scalars['Any']['output']>;
  exception_log: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  in_progress: Scalars['Boolean']['output'];
  interpolated_stop_time_count: Maybe<Scalars['Int']['output']>;
  schedule_removed: Scalars['Boolean']['output'];
  skip_entity_error_count: Maybe<Scalars['Any']['output']>;
  skip_entity_filter_count: Maybe<Scalars['Any']['output']>;
  skip_entity_marked_count: Maybe<Scalars['Any']['output']>;
  skip_entity_reference_count: Maybe<Scalars['Any']['output']>;
  success: Scalars['Boolean']['output'];
  updated_at: Maybe<Scalars['Time']['output']>;
  warning_count: Maybe<Scalars['Any']['output']>;
};

export type FeedVersionImportResult = {
  __typename?: 'FeedVersionImportResult';
  success: Scalars['Boolean']['output'];
};

export type FeedVersionServiceLevel = {
  __typename?: 'FeedVersionServiceLevel';
  end_date: Scalars['Date']['output'];
  friday: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  monday: Scalars['Int']['output'];
  saturday: Scalars['Int']['output'];
  start_date: Scalars['Date']['output'];
  sunday: Scalars['Int']['output'];
  thursday: Scalars['Int']['output'];
  tuesday: Scalars['Int']['output'];
  wednesday: Scalars['Int']['output'];
};

export type FeedVersionServiceLevelFilter = {
  end_date: InputMaybe<Scalars['Date']['input']>;
  start_date: InputMaybe<Scalars['Date']['input']>;
};

export type FeedVersionSetInput = {
  description: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
};

export type FeedVersionUnimportResult = {
  __typename?: 'FeedVersionUnimportResult';
  success: Scalars['Boolean']['output'];
};

/** Record from a static GTFS [frequencies.txt](https://gtfs.org/schedule/reference/#frequenciestxt) file. */
export type Frequency = {
  __typename?: 'Frequency';
  end_time: Scalars['Seconds']['output'];
  exact_times: Scalars['Int']['output'];
  headway_secs: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  start_time: Scalars['Seconds']['output'];
};

export type GbfsAlertTime = {
  __typename?: 'GbfsAlertTime';
  end: Maybe<Scalars['Int']['output']>;
  start: Maybe<Scalars['Int']['output']>;
};

export type GbfsBikeRequest = {
  near: InputMaybe<PointRadius>;
};

export type GbfsBrandAsset = {
  __typename?: 'GbfsBrandAsset';
  brand_image_url: Maybe<Scalars['String']['output']>;
  brand_image_url_dark: Maybe<Scalars['String']['output']>;
  brand_last_modified: Maybe<Scalars['Date']['output']>;
  brand_terms_url: Maybe<Scalars['String']['output']>;
  color: Maybe<Scalars['String']['output']>;
};

export type GbfsDockRequest = {
  near: InputMaybe<PointRadius>;
};

export type GbfsFeed = {
  __typename?: 'GbfsFeed';
  alerts: Maybe<Array<GbfsSystemAlert>>;
  calendars: Maybe<Array<GbfsSystemCalendar>>;
  rental_hours: Maybe<Array<GbfsSystemHour>>;
  station_information: Maybe<Array<GbfsStationInformation>>;
  system_information: Maybe<GbfsSystemInformation>;
};

export type GbfsFreeBikeStatus = {
  __typename?: 'GbfsFreeBikeStatus';
  available_until: Maybe<Scalars['Int']['output']>;
  bike_id: Maybe<Scalars['String']['output']>;
  current_fuel_percent: Maybe<Scalars['Float']['output']>;
  current_range_meters: Maybe<Scalars['Float']['output']>;
  feed: Maybe<GbfsFeed>;
  home_station: Maybe<GbfsStationInformation>;
  is_disabled: Maybe<Scalars['Bool']['output']>;
  is_reserved: Maybe<Scalars['Bool']['output']>;
  last_reported: Maybe<Scalars['Int']['output']>;
  lat: Maybe<Scalars['Float']['output']>;
  lon: Maybe<Scalars['Float']['output']>;
  pricing_plan: Maybe<GbfsSystemPricingPlan>;
  rental_uris: Maybe<GbfsRentalUris>;
  station: Maybe<GbfsStationInformation>;
  vehicle_equipment: Maybe<Scalars['Strings']['output']>;
  vehicle_type: Maybe<GbfsVehicleType>;
};

export type GbfsGeofenceFeature = {
  __typename?: 'GbfsGeofenceFeature';
  geometry: Maybe<Scalars['Geometry']['output']>;
  type: Maybe<Scalars['String']['output']>;
};

export type GbfsGeofenceProperty = {
  __typename?: 'GbfsGeofenceProperty';
  end: Maybe<Scalars['Int']['output']>;
  name: Maybe<Scalars['String']['output']>;
  rules: Maybe<Array<Maybe<GbfsGeofenceRule>>>;
  start: Maybe<Scalars['Int']['output']>;
};

export type GbfsGeofenceRule = {
  __typename?: 'GbfsGeofenceRule';
  maximum_speed_kph: Maybe<Scalars['Int']['output']>;
  ride_allowed: Maybe<Scalars['Bool']['output']>;
  ride_through_allowed: Maybe<Scalars['Bool']['output']>;
  station_parking: Maybe<Scalars['Bool']['output']>;
  vehicle_type: Maybe<GbfsVehicleType>;
};

export type GbfsGeofenceZone = {
  __typename?: 'GbfsGeofenceZone';
  features: Maybe<Array<GbfsGeofenceFeature>>;
  type: Maybe<Scalars['String']['output']>;
};

export type GbfsPlanPrice = {
  __typename?: 'GbfsPlanPrice';
  end: Maybe<Scalars['Int']['output']>;
  interval: Maybe<Scalars['Int']['output']>;
  rate: Maybe<Scalars['Float']['output']>;
  start: Maybe<Scalars['Int']['output']>;
};

export type GbfsRentalApp = {
  __typename?: 'GbfsRentalApp';
  discovery_uri: Maybe<Scalars['String']['output']>;
  store_uri: Maybe<Scalars['String']['output']>;
};

export type GbfsRentalApps = {
  __typename?: 'GbfsRentalApps';
  android: Maybe<GbfsRentalApp>;
  ios: Maybe<GbfsRentalApp>;
};

export type GbfsRentalUris = {
  __typename?: 'GbfsRentalUris';
  android: Maybe<Scalars['String']['output']>;
  ios: Maybe<Scalars['String']['output']>;
  web: Maybe<Scalars['String']['output']>;
};

export type GbfsStationInformation = {
  __typename?: 'GbfsStationInformation';
  address: Maybe<Scalars['String']['output']>;
  capacity: Maybe<Scalars['Int']['output']>;
  contact_phone: Maybe<Scalars['String']['output']>;
  cross_street: Maybe<Scalars['String']['output']>;
  feed: Maybe<GbfsFeed>;
  is_charging_station: Maybe<Scalars['Bool']['output']>;
  is_valet_station: Maybe<Scalars['Bool']['output']>;
  is_virtual_station: Maybe<Scalars['Bool']['output']>;
  lat: Maybe<Scalars['Float']['output']>;
  lon: Maybe<Scalars['Float']['output']>;
  name: Maybe<Scalars['String']['output']>;
  parking_hoop: Maybe<Scalars['Int']['output']>;
  parking_type: Maybe<Scalars['String']['output']>;
  post_code: Maybe<Scalars['String']['output']>;
  region: Maybe<GbfsSystemRegion>;
  rental_methods: Maybe<Scalars['Strings']['output']>;
  short_name: Maybe<Scalars['String']['output']>;
  station_area: Maybe<Scalars['Geometry']['output']>;
  station_id: Maybe<Scalars['String']['output']>;
  status: Maybe<GbfsStationStatus>;
};

export type GbfsStationStatus = {
  __typename?: 'GbfsStationStatus';
  is_installed: Maybe<Scalars['Bool']['output']>;
  is_renting: Maybe<Scalars['Bool']['output']>;
  is_returning: Maybe<Scalars['Bool']['output']>;
  last_reported: Maybe<Scalars['Int']['output']>;
  num_bikes_available: Maybe<Scalars['Int']['output']>;
  num_bikes_disabled: Maybe<Scalars['Int']['output']>;
  num_docks_available: Maybe<Scalars['Int']['output']>;
  num_docks_disabled: Maybe<Scalars['Int']['output']>;
  station_id: Maybe<Scalars['String']['output']>;
  vehicle_docks_available: Maybe<Array<GbfsVehicleDockAvailable>>;
  vehicle_types_available: Maybe<Array<GbfsVehicleTypeAvailable>>;
};

export type GbfsSystemAlert = {
  __typename?: 'GbfsSystemAlert';
  alert_id: Maybe<Scalars['String']['output']>;
  description: Maybe<Scalars['String']['output']>;
  last_updated: Maybe<Scalars['Int']['output']>;
  summary: Maybe<Scalars['String']['output']>;
  times: Maybe<Array<GbfsAlertTime>>;
  type: Maybe<Scalars['String']['output']>;
  url: Maybe<Scalars['String']['output']>;
};

export type GbfsSystemCalendar = {
  __typename?: 'GbfsSystemCalendar';
  end_day: Maybe<Scalars['Int']['output']>;
  end_month: Maybe<Scalars['Int']['output']>;
  end_year: Maybe<Scalars['Int']['output']>;
  start_day: Maybe<Scalars['Int']['output']>;
  start_month: Maybe<Scalars['Int']['output']>;
  start_year: Maybe<Scalars['Int']['output']>;
};

export type GbfsSystemHour = {
  __typename?: 'GbfsSystemHour';
  days: Maybe<Scalars['Strings']['output']>;
  end_time: Maybe<Scalars['String']['output']>;
  start_time: Maybe<Scalars['String']['output']>;
  user_types: Maybe<Scalars['Strings']['output']>;
};

export type GbfsSystemInformation = {
  __typename?: 'GbfsSystemInformation';
  brand_assets: Maybe<GbfsBrandAsset>;
  email: Maybe<Scalars['String']['output']>;
  feed_contact_email: Maybe<Scalars['String']['output']>;
  language: Maybe<Scalars['String']['output']>;
  license_url: Maybe<Scalars['String']['output']>;
  name: Maybe<Scalars['String']['output']>;
  operator: Maybe<Scalars['String']['output']>;
  phone_number: Maybe<Scalars['String']['output']>;
  privacy_last_updated: Maybe<Scalars['Date']['output']>;
  privacy_url: Maybe<Scalars['String']['output']>;
  purchase_url: Maybe<Scalars['String']['output']>;
  rental_apps: Maybe<GbfsRentalApps>;
  short_name: Maybe<Scalars['String']['output']>;
  start_date: Maybe<Scalars['Date']['output']>;
  system_id: Maybe<Scalars['String']['output']>;
  terms_last_updated: Maybe<Scalars['Date']['output']>;
  terms_url: Maybe<Scalars['String']['output']>;
  timezone: Maybe<Scalars['String']['output']>;
  url: Maybe<Scalars['String']['output']>;
};

export type GbfsSystemPricingPlan = {
  __typename?: 'GbfsSystemPricingPlan';
  currency: Maybe<Scalars['String']['output']>;
  description: Maybe<Scalars['String']['output']>;
  is_taxable: Maybe<Scalars['Bool']['output']>;
  name: Maybe<Scalars['String']['output']>;
  per_km_pricing: Maybe<Array<GbfsPlanPrice>>;
  per_min_pricing: Maybe<Array<GbfsPlanPrice>>;
  plan_id: Maybe<Scalars['String']['output']>;
  price: Maybe<Scalars['Float']['output']>;
  surge_pricing: Maybe<Scalars['Bool']['output']>;
  url: Maybe<Scalars['String']['output']>;
};

export type GbfsSystemRegion = {
  __typename?: 'GbfsSystemRegion';
  name: Maybe<Scalars['String']['output']>;
  region_id: Maybe<Scalars['String']['output']>;
};

export type GbfsSystemVersion = {
  __typename?: 'GbfsSystemVersion';
  url: Maybe<Scalars['String']['output']>;
  version: Maybe<Scalars['String']['output']>;
};

export type GbfsVehicleAssets = {
  __typename?: 'GbfsVehicleAssets';
  icon_last_modified: Maybe<Scalars['Date']['output']>;
  icon_url: Maybe<Scalars['String']['output']>;
  icon_url_dark: Maybe<Scalars['String']['output']>;
};

export type GbfsVehicleDockAvailable = {
  __typename?: 'GbfsVehicleDockAvailable';
  count: Maybe<Scalars['Int']['output']>;
  vehicle_types: Maybe<Array<GbfsVehicleType>>;
};

export type GbfsVehicleType = {
  __typename?: 'GbfsVehicleType';
  cargo_load_capacity: Maybe<Scalars['Int']['output']>;
  cargo_volume_capacity: Maybe<Scalars['Int']['output']>;
  color: Maybe<Scalars['String']['output']>;
  country_code: Maybe<Scalars['String']['output']>;
  default_pricing_plan: Maybe<GbfsSystemPricingPlan>;
  default_reserve_time: Maybe<Scalars['Int']['output']>;
  eco_label: Maybe<Scalars['String']['output']>;
  eco_sticker: Maybe<Scalars['String']['output']>;
  form_factor: Maybe<Scalars['String']['output']>;
  gco_2_km: Maybe<Scalars['Int']['output']>;
  make: Maybe<Scalars['String']['output']>;
  max_permitted_speed: Maybe<Scalars['Int']['output']>;
  max_range_meters: Maybe<Scalars['Float']['output']>;
  model: Maybe<Scalars['String']['output']>;
  name: Maybe<Scalars['String']['output']>;
  pricing_plans: Maybe<Array<GbfsSystemPricingPlan>>;
  propulsion_type: Maybe<Scalars['String']['output']>;
  rated_power: Maybe<Scalars['Int']['output']>;
  rental_uris: Maybe<GbfsRentalUris>;
  return_constraint: Maybe<Scalars['String']['output']>;
  rider_capacity: Maybe<Scalars['Int']['output']>;
  vehicle_accessories: Maybe<Scalars['Strings']['output']>;
  vehicle_assets: Maybe<GbfsVehicleAssets>;
  vehicle_image: Maybe<Scalars['String']['output']>;
  vehicle_type_id: Maybe<Scalars['String']['output']>;
  wheel_count: Maybe<Scalars['Int']['output']>;
};

export type GbfsVehicleTypeAvailable = {
  __typename?: 'GbfsVehicleTypeAvailable';
  count: Maybe<Scalars['Int']['output']>;
  num_bikes_disabled: Maybe<Scalars['Int']['output']>;
  num_docks_available: Maybe<Scalars['Int']['output']>;
  vehicle_type: Maybe<GbfsVehicleType>;
};

export enum ImportStatus {
  Error = 'ERROR',
  InProgress = 'IN_PROGRESS',
  Success = 'SUCCESS'
}

export type Itinerary = {
  __typename?: 'Itinerary';
  distance: Distance;
  duration: Duration;
  end_time: Scalars['Time']['output'];
  from: Waypoint;
  legs: Maybe<Array<Leg>>;
  start_time: Scalars['Time']['output'];
  to: Waypoint;
};

export type Leg = {
  __typename?: 'Leg';
  distance: Distance;
  duration: Duration;
  end_time: Scalars['Time']['output'];
  from: Maybe<Waypoint>;
  geometry: Scalars['LineString']['output'];
  start_time: Scalars['Time']['output'];
  steps: Maybe<Array<Step>>;
  to: Maybe<Waypoint>;
};

/** Describe the different levels of a station. Is mostly useful when used in conjunction with pathways. See https://gtfs.org/reference/static/#levelstxt */
export type Level = {
  __typename?: 'Level';
  geometry: Scalars['Polygon']['output'];
  id: Scalars['Int']['output'];
  level_id: Scalars['String']['output'];
  level_index: Scalars['Float']['output'];
  level_name: Scalars['String']['output'];
  stops: Maybe<Array<Stop>>;
};

export type LicenseFilter = {
  commercial_use_allowed: InputMaybe<LicenseValue>;
  create_derived_product: InputMaybe<LicenseValue>;
  redistribution_allowed: InputMaybe<LicenseValue>;
  share_alike_optional: InputMaybe<LicenseValue>;
  use_without_attribution: InputMaybe<LicenseValue>;
};

export enum LicenseValue {
  ExcludeNo = 'EXCLUDE_NO',
  No = 'NO',
  Unknown = 'UNKNOWN',
  Yes = 'YES'
}

export type Me = {
  __typename?: 'Me';
  email: Maybe<Scalars['String']['output']>;
  external_data: Maybe<Scalars['Map']['output']>;
  id: Scalars['String']['output'];
  name: Maybe<Scalars['String']['output']>;
  roles: Maybe<Array<Scalars['String']['output']>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  feed_version_delete: FeedVersionDeleteResult;
  feed_version_fetch: Maybe<FeedVersionFetchResult>;
  feed_version_import: FeedVersionImportResult;
  feed_version_unimport: FeedVersionUnimportResult;
  feed_version_update: Maybe<FeedVersion>;
  validate_gtfs: Maybe<ValidationResult>;
};


export type MutationFeed_Version_DeleteArgs = {
  id: Scalars['Int']['input'];
};


export type MutationFeed_Version_FetchArgs = {
  feed_onestop_id: Scalars['String']['input'];
  file: InputMaybe<Scalars['Upload']['input']>;
  url: InputMaybe<Scalars['String']['input']>;
};


export type MutationFeed_Version_ImportArgs = {
  id: Scalars['Int']['input'];
};


export type MutationFeed_Version_UnimportArgs = {
  id: Scalars['Int']['input'];
};


export type MutationFeed_Version_UpdateArgs = {
  id: Scalars['Int']['input'];
  set: FeedVersionSetInput;
};


export type MutationValidate_GtfsArgs = {
  file: InputMaybe<Scalars['Upload']['input']>;
  realtime_urls: InputMaybe<Array<Scalars['String']['input']>>;
  url: InputMaybe<Scalars['String']['input']>;
};

/**
 * An agency represents a single GTFS `agencies.txt` entity that was imported from a single feed version. The metadata, routes, etc., for an agency include only the data for that specific agency in that specific feed version.
 *
 * Operators are a higher-level abstraction over agencies, with each operator defined by an entry in the [Transitland Atlas](/documentation/atlas). Operators provide a method for enriching the basic GTFS agency data, as well as grouping agencies that span across multiple source feeds. Operators are matched with GTFS agencies using `associated_feeds`, a simple list of Feed OnestopIDs and GTFS `agency_id`s. For instance, the [Atlas operator record](https://github.com/transitland/transitland-atlas/blob/master/operators/o-dr5r-nyct.json) for the [New York City MTA](/operators/o-dr5r-nyct) has `associated_feeds` values for 8 different GTFS feeds. A query for this operator OnestopID thus represents the union of data from all 8 feeds, and includes routes for the subway, bus service for all 5 boroughs, commuter rail agencies, etc., operated by the MTA. This record also includes additional metadata about the MTA, such as the United States National Transit Database ID, Wikidata IDs, and alternate names for the agency. Operator records are created and maintained through pull requests to the Atlas json files and synchronized with the Transitland database on each commit.
 */
export type Operator = {
  __typename?: 'Operator';
  agencies: Maybe<Array<Agency>>;
  feeds: Maybe<Array<Feed>>;
  file: Maybe<Scalars['String']['output']>;
  generated: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  name: Maybe<Scalars['String']['output']>;
  onestop_id: Maybe<Scalars['String']['output']>;
  search_rank: Maybe<Scalars['String']['output']>;
  short_name: Maybe<Scalars['String']['output']>;
  tags: Maybe<Scalars['Tags']['output']>;
  website: Maybe<Scalars['String']['output']>;
};


/**
 * An agency represents a single GTFS `agencies.txt` entity that was imported from a single feed version. The metadata, routes, etc., for an agency include only the data for that specific agency in that specific feed version.
 *
 * Operators are a higher-level abstraction over agencies, with each operator defined by an entry in the [Transitland Atlas](/documentation/atlas). Operators provide a method for enriching the basic GTFS agency data, as well as grouping agencies that span across multiple source feeds. Operators are matched with GTFS agencies using `associated_feeds`, a simple list of Feed OnestopIDs and GTFS `agency_id`s. For instance, the [Atlas operator record](https://github.com/transitland/transitland-atlas/blob/master/operators/o-dr5r-nyct.json) for the [New York City MTA](/operators/o-dr5r-nyct) has `associated_feeds` values for 8 different GTFS feeds. A query for this operator OnestopID thus represents the union of data from all 8 feeds, and includes routes for the subway, bus service for all 5 boroughs, commuter rail agencies, etc., operated by the MTA. This record also includes additional metadata about the MTA, such as the United States National Transit Database ID, Wikidata IDs, and alternate names for the agency. Operator records are created and maintained through pull requests to the Atlas json files and synchronized with the Transitland database on each commit.
 */
export type OperatorFeedsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<FeedFilter>;
};

export type OperatorFilter = {
  adm0_iso: InputMaybe<Scalars['String']['input']>;
  adm0_name: InputMaybe<Scalars['String']['input']>;
  adm1_iso: InputMaybe<Scalars['String']['input']>;
  adm1_name: InputMaybe<Scalars['String']['input']>;
  agency_id: InputMaybe<Scalars['String']['input']>;
  bbox: InputMaybe<BoundingBox>;
  city_name: InputMaybe<Scalars['String']['input']>;
  feed_onestop_id: InputMaybe<Scalars['String']['input']>;
  license: InputMaybe<LicenseFilter>;
  merged: InputMaybe<Scalars['Boolean']['input']>;
  near: InputMaybe<PointRadius>;
  onestop_id: InputMaybe<Scalars['String']['input']>;
  search: InputMaybe<Scalars['String']['input']>;
  tags: InputMaybe<Scalars['Tags']['input']>;
  within: InputMaybe<Scalars['Polygon']['input']>;
};

/** The GTFS-Pathways extension uses a graph representation to describe subway or train, with nodes (the locations) and edges (the pathways). See https://gtfs.org/reference/static/#pathwaystxt */
export type Pathway = {
  __typename?: 'Pathway';
  from_stop: Stop;
  id: Scalars['Int']['output'];
  is_bidirectional: Scalars['Int']['output'];
  length: Scalars['Float']['output'];
  max_slope: Scalars['Float']['output'];
  min_width: Scalars['Float']['output'];
  pathway_id: Scalars['String']['output'];
  pathway_mode: Scalars['Int']['output'];
  reverse_signposted_as: Scalars['String']['output'];
  signposted_as: Scalars['String']['output'];
  stair_count: Scalars['Int']['output'];
  to_stop: Stop;
  traversal_time: Scalars['Int']['output'];
};

export type PathwayFilter = {
  pathway_mode: InputMaybe<Scalars['Int']['input']>;
};

export type Place = {
  __typename?: 'Place';
  adm0_name: Maybe<Scalars['String']['output']>;
  adm1_name: Maybe<Scalars['String']['output']>;
  city_name: Maybe<Scalars['String']['output']>;
  count: Scalars['Int']['output'];
  operators: Maybe<Array<Operator>>;
};

export enum PlaceAggregationLevel {
  Adm0 = 'ADM0',
  Adm0Adm1 = 'ADM0_ADM1',
  Adm0Adm1City = 'ADM0_ADM1_CITY',
  Adm0City = 'ADM0_CITY',
  Adm1City = 'ADM1_CITY',
  City = 'CITY'
}

export type PlaceFilter = {
  adm0_name: InputMaybe<Scalars['String']['input']>;
  adm1_name: InputMaybe<Scalars['String']['input']>;
  city_name: InputMaybe<Scalars['String']['input']>;
  min_rank: InputMaybe<Scalars['Float']['input']>;
};

export type PointRadius = {
  lat: Scalars['Float']['input'];
  lon: Scalars['Float']['input'];
  radius: Scalars['Float']['input'];
};

export type Query = {
  __typename?: 'Query';
  agencies: Array<Agency>;
  bikes: Maybe<Array<GbfsFreeBikeStatus>>;
  directions: Directions;
  docks: Maybe<Array<GbfsStationInformation>>;
  feed_versions: Array<FeedVersion>;
  feeds: Array<Feed>;
  me: Me;
  operators: Array<Operator>;
  places: Maybe<Array<Place>>;
  routes: Array<Route>;
  stops: Array<Stop>;
  trips: Array<Trip>;
};


export type QueryAgenciesArgs = {
  after: InputMaybe<Scalars['Int']['input']>;
  ids: InputMaybe<Array<Scalars['Int']['input']>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<AgencyFilter>;
};


export type QueryBikesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<GbfsBikeRequest>;
};


export type QueryDirectionsArgs = {
  where: DirectionRequest;
};


export type QueryDocksArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<GbfsDockRequest>;
};


export type QueryFeed_VersionsArgs = {
  after: InputMaybe<Scalars['Int']['input']>;
  ids: InputMaybe<Array<Scalars['Int']['input']>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<FeedVersionFilter>;
};


export type QueryFeedsArgs = {
  after: InputMaybe<Scalars['Int']['input']>;
  ids: InputMaybe<Array<Scalars['Int']['input']>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<FeedFilter>;
};


export type QueryOperatorsArgs = {
  after: InputMaybe<Scalars['Int']['input']>;
  ids: InputMaybe<Array<Scalars['Int']['input']>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<OperatorFilter>;
};


export type QueryPlacesArgs = {
  after: InputMaybe<Scalars['Int']['input']>;
  level: InputMaybe<PlaceAggregationLevel>;
  limit: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<PlaceFilter>;
};


export type QueryRoutesArgs = {
  after: InputMaybe<Scalars['Int']['input']>;
  ids: InputMaybe<Array<Scalars['Int']['input']>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<RouteFilter>;
};


export type QueryStopsArgs = {
  after: InputMaybe<Scalars['Int']['input']>;
  ids: InputMaybe<Array<Scalars['Int']['input']>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<StopFilter>;
};


export type QueryTripsArgs = {
  after: InputMaybe<Scalars['Int']['input']>;
  ids: InputMaybe<Array<Scalars['Int']['input']>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<TripFilter>;
};

/** See https://gtfs.org/reference/realtime/v2/#message-timerange */
export type RtTimeRange = {
  __typename?: 'RTTimeRange';
  end: Maybe<Scalars['Int']['output']>;
  start: Maybe<Scalars['Int']['output']>;
};

/** See https://gtfs.org/reference/realtime/v2/#message-translatedstring */
export type RtTranslation = {
  __typename?: 'RTTranslation';
  language: Maybe<Scalars['String']['output']>;
  text: Scalars['String']['output'];
};

/** See https://gtfs.org/reference/realtime/v2/#message-tripdescriptor */
export type RtTripDescriptor = {
  __typename?: 'RTTripDescriptor';
  direction_id: Maybe<Scalars['Int']['output']>;
  route_id: Maybe<Scalars['String']['output']>;
  schedule_relationship: Maybe<Scalars['String']['output']>;
  start_date: Maybe<Scalars['Date']['output']>;
  start_time: Maybe<Scalars['Seconds']['output']>;
  trip_id: Maybe<Scalars['String']['output']>;
};

/** See https://gtfs.org/reference/realtime/v2/#message-vehicledescriptor */
export type RtVehicleDescriptor = {
  __typename?: 'RTVehicleDescriptor';
  id: Maybe<Scalars['String']['output']>;
  label: Maybe<Scalars['String']['output']>;
  license_plate: Maybe<Scalars['String']['output']>;
};

export enum Role {
  Admin = 'ADMIN',
  Anon = 'ANON',
  User = 'USER'
}

/** See https://gtfs.org/schedule/reference/#routestxt */
export type Route = {
  __typename?: 'Route';
  agency: Agency;
  alerts: Maybe<Array<Alert>>;
  census_geographies: Maybe<Array<CensusGeography>>;
  continuous_drop_off: Maybe<Scalars['Int']['output']>;
  continuous_pickup: Maybe<Scalars['Int']['output']>;
  feed_onestop_id: Scalars['String']['output'];
  feed_version: FeedVersion;
  feed_version_sha1: Scalars['String']['output'];
  geometries: Array<RouteGeometry>;
  geometry: Maybe<Scalars['Geometry']['output']>;
  headways: Array<RouteHeadway>;
  id: Scalars['Int']['output'];
  onestop_id: Maybe<Scalars['String']['output']>;
  patterns: Maybe<Array<RouteStopPattern>>;
  route_attribute: Maybe<RouteAttribute>;
  route_color: Scalars['String']['output'];
  route_desc: Scalars['String']['output'];
  route_id: Scalars['String']['output'];
  route_long_name: Scalars['String']['output'];
  route_short_name: Scalars['String']['output'];
  route_sort_order: Scalars['Int']['output'];
  route_stop_buffer: RouteStopBuffer;
  route_stops: Array<RouteStop>;
  route_text_color: Scalars['String']['output'];
  route_type: Scalars['Int']['output'];
  route_url: Scalars['String']['output'];
  search_rank: Maybe<Scalars['String']['output']>;
  stops: Array<Stop>;
  trips: Array<Trip>;
};


/** See https://gtfs.org/schedule/reference/#routestxt */
export type RouteAlertsArgs = {
  active: InputMaybe<Scalars['Boolean']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
};


/** See https://gtfs.org/schedule/reference/#routestxt */
export type RouteCensus_GeographiesArgs = {
  layer: Scalars['String']['input'];
  limit: InputMaybe<Scalars['Int']['input']>;
  radius: InputMaybe<Scalars['Float']['input']>;
};


/** See https://gtfs.org/schedule/reference/#routestxt */
export type RouteGeometriesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
};


/** See https://gtfs.org/schedule/reference/#routestxt */
export type RouteHeadwaysArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
};


/** See https://gtfs.org/schedule/reference/#routestxt */
export type RouteRoute_Stop_BufferArgs = {
  radius: InputMaybe<Scalars['Float']['input']>;
};


/** See https://gtfs.org/schedule/reference/#routestxt */
export type RouteRoute_StopsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
};


/** See https://gtfs.org/schedule/reference/#routestxt */
export type RouteStopsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<StopFilter>;
};


/** See https://gtfs.org/schedule/reference/#routestxt */
export type RouteTripsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<TripFilter>;
};

/** MTC GTFS+ Extension: route_attributes.txt */
export type RouteAttribute = {
  __typename?: 'RouteAttribute';
  category: Maybe<Scalars['Int']['output']>;
  running_way: Maybe<Scalars['Int']['output']>;
  subcategory: Maybe<Scalars['Int']['output']>;
};

export type RouteFilter = {
  agency_ids: InputMaybe<Array<Scalars['Int']['input']>>;
  allow_previous_onestop_ids: InputMaybe<Scalars['Boolean']['input']>;
  bbox: InputMaybe<BoundingBox>;
  feed_onestop_id: InputMaybe<Scalars['String']['input']>;
  feed_version_sha1: InputMaybe<Scalars['String']['input']>;
  license: InputMaybe<LicenseFilter>;
  near: InputMaybe<PointRadius>;
  onestop_id: InputMaybe<Scalars['String']['input']>;
  onestop_ids: InputMaybe<Array<Scalars['String']['input']>>;
  operator_onestop_id: InputMaybe<Scalars['String']['input']>;
  route_id: InputMaybe<Scalars['String']['input']>;
  route_type: InputMaybe<Scalars['Int']['input']>;
  search: InputMaybe<Scalars['String']['input']>;
  serviced: InputMaybe<Scalars['Boolean']['input']>;
  within: InputMaybe<Scalars['Polygon']['input']>;
};

export type RouteGeometry = {
  __typename?: 'RouteGeometry';
  combined_geometry: Maybe<Scalars['Geometry']['output']>;
  first_point_max_distance: Maybe<Scalars['Float']['output']>;
  /** If true, the source GTFS feed provides no shapes. This route geometry is based on straight lines between stop points. */
  generated: Scalars['Boolean']['output'];
  geometry: Maybe<Scalars['LineString']['output']>;
  length: Maybe<Scalars['Float']['output']>;
  max_segment_length: Maybe<Scalars['Float']['output']>;
};

export type RouteHeadway = {
  __typename?: 'RouteHeadway';
  departures: Maybe<Array<Scalars['Seconds']['output']>>;
  direction_id: Maybe<Scalars['Int']['output']>;
  dow_category: Maybe<Scalars['Int']['output']>;
  headway_secs: Maybe<Scalars['Int']['output']>;
  service_date: Maybe<Scalars['Date']['output']>;
  stop: Stop;
  stop_trip_count: Maybe<Scalars['Int']['output']>;
};

export type RouteStop = {
  __typename?: 'RouteStop';
  agency: Agency;
  agency_id: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  route: Route;
  route_id: Scalars['Int']['output'];
  stop: Stop;
  stop_id: Scalars['Int']['output'];
};

export type RouteStopBuffer = {
  __typename?: 'RouteStopBuffer';
  stop_buffer: Maybe<Scalars['Geometry']['output']>;
  stop_convexhull: Maybe<Scalars['Polygon']['output']>;
  stop_points: Maybe<Scalars['Geometry']['output']>;
};

export type RouteStopPattern = {
  __typename?: 'RouteStopPattern';
  count: Scalars['Int']['output'];
  direction_id: Scalars['Int']['output'];
  stop_pattern_id: Scalars['Int']['output'];
  trips: Maybe<Array<Trip>>;
};


export type RouteStopPatternTripsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
};

export enum ScheduleRelationship {
  Added = 'ADDED',
  Canceled = 'CANCELED',
  Scheduled = 'SCHEDULED',
  Unscheduled = 'UNSCHEDULED'
}

export type ServiceCoversFilter = {
  end_date: InputMaybe<Scalars['Date']['input']>;
  fetched_after: InputMaybe<Scalars['Time']['input']>;
  fetched_before: InputMaybe<Scalars['Time']['input']>;
  start_date: InputMaybe<Scalars['Date']['input']>;
};

/** Record from a static GTFS [shapes.txt](https://gtfs.org/schedule/reference/#shapestxt) file. */
export type Shape = {
  __typename?: 'Shape';
  generated: Scalars['Boolean']['output'];
  geometry: Scalars['LineString']['output'];
  id: Scalars['Int']['output'];
  shape_id: Scalars['String']['output'];
};

export type Step = {
  __typename?: 'Step';
  distance: Distance;
  duration: Duration;
  end_time: Scalars['Time']['output'];
  geometry_offset: Scalars['Int']['output'];
  instruction: Scalars['String']['output'];
  mode: StepMode;
  start_time: Scalars['Time']['output'];
  to: Maybe<Waypoint>;
};

export enum StepMode {
  Auto = 'AUTO',
  Bicycle = 'BICYCLE',
  Line = 'LINE',
  Transit = 'TRANSIT',
  Walk = 'WALK'
}

/** See https://gtfs.org/reference/static/#stopstxt */
export type Stop = {
  __typename?: 'Stop';
  alerts: Maybe<Array<Alert>>;
  arrivals: Array<StopTime>;
  census_geographies: Maybe<Array<CensusGeography>>;
  children: Maybe<Array<Stop>>;
  departures: Array<StopTime>;
  directions: Directions;
  external_reference: Maybe<StopExternalReference>;
  feed_onestop_id: Scalars['String']['output'];
  feed_version: FeedVersion;
  feed_version_sha1: Scalars['String']['output'];
  geometry: Scalars['Point']['output'];
  id: Scalars['Int']['output'];
  level: Maybe<Level>;
  location_type: Scalars['Int']['output'];
  nearby_stops: Maybe<Array<Stop>>;
  observations: Maybe<Array<StopObservation>>;
  onestop_id: Scalars['String']['output'];
  parent: Maybe<Stop>;
  pathways_from_stop: Array<Pathway>;
  pathways_to_stop: Array<Pathway>;
  place: Maybe<StopPlace>;
  platform_code: Maybe<Scalars['String']['output']>;
  route_stops: Array<RouteStop>;
  search_rank: Maybe<Scalars['String']['output']>;
  stop_code: Scalars['String']['output'];
  stop_desc: Scalars['String']['output'];
  stop_id: Scalars['String']['output'];
  stop_name: Scalars['String']['output'];
  stop_times: Array<StopTime>;
  stop_timezone: Scalars['String']['output'];
  stop_url: Scalars['String']['output'];
  tts_stop_name: Maybe<Scalars['String']['output']>;
  wheelchair_boarding: Scalars['Int']['output'];
  zone_id: Scalars['String']['output'];
};


/** See https://gtfs.org/reference/static/#stopstxt */
export type StopAlertsArgs = {
  active: InputMaybe<Scalars['Boolean']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
};


/** See https://gtfs.org/reference/static/#stopstxt */
export type StopArrivalsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<StopTimeFilter>;
};


/** See https://gtfs.org/reference/static/#stopstxt */
export type StopCensus_GeographiesArgs = {
  layer: Scalars['String']['input'];
  limit: InputMaybe<Scalars['Int']['input']>;
  radius: InputMaybe<Scalars['Float']['input']>;
};


/** See https://gtfs.org/reference/static/#stopstxt */
export type StopChildrenArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
};


/** See https://gtfs.org/reference/static/#stopstxt */
export type StopDeparturesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<StopTimeFilter>;
};


/** See https://gtfs.org/reference/static/#stopstxt */
export type StopDirectionsArgs = {
  depart_at: InputMaybe<Scalars['Time']['input']>;
  from: InputMaybe<WaypointInput>;
  mode: InputMaybe<StepMode>;
  to: InputMaybe<WaypointInput>;
};


/** See https://gtfs.org/reference/static/#stopstxt */
export type StopNearby_StopsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  radius: InputMaybe<Scalars['Float']['input']>;
};


/** See https://gtfs.org/reference/static/#stopstxt */
export type StopObservationsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<StopObservationFilter>;
};


/** See https://gtfs.org/reference/static/#stopstxt */
export type StopPathways_From_StopArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
};


/** See https://gtfs.org/reference/static/#stopstxt */
export type StopPathways_To_StopArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
};


/** See https://gtfs.org/reference/static/#stopstxt */
export type StopRoute_StopsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
};


/** See https://gtfs.org/reference/static/#stopstxt */
export type StopStop_TimesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<StopTimeFilter>;
};

export type StopExternalReference = {
  __typename?: 'StopExternalReference';
  id: Scalars['Int']['output'];
  inactive: Maybe<Scalars['Boolean']['output']>;
  target_active_stop: Maybe<Stop>;
  target_feed_onestop_id: Maybe<Scalars['String']['output']>;
  target_stop_id: Maybe<Scalars['String']['output']>;
};

export type StopFilter = {
  agency_ids: InputMaybe<Array<Scalars['Int']['input']>>;
  allow_previous_onestop_ids: InputMaybe<Scalars['Boolean']['input']>;
  bbox: InputMaybe<BoundingBox>;
  feed_onestop_id: InputMaybe<Scalars['String']['input']>;
  feed_version_sha1: InputMaybe<Scalars['String']['input']>;
  license: InputMaybe<LicenseFilter>;
  location_type: InputMaybe<Scalars['Int']['input']>;
  near: InputMaybe<PointRadius>;
  onestop_id: InputMaybe<Scalars['String']['input']>;
  onestop_ids: InputMaybe<Array<Scalars['String']['input']>>;
  search: InputMaybe<Scalars['String']['input']>;
  served_by_onestop_ids: InputMaybe<Array<Scalars['String']['input']>>;
  served_by_route_type: InputMaybe<Scalars['Int']['input']>;
  serviced: InputMaybe<Scalars['Boolean']['input']>;
  stop_code: InputMaybe<Scalars['String']['input']>;
  stop_id: InputMaybe<Scalars['String']['input']>;
  within: InputMaybe<Scalars['Polygon']['input']>;
};

export type StopObservation = {
  __typename?: 'StopObservation';
  agency_id: Maybe<Scalars['String']['output']>;
  from_stop_id: Maybe<Scalars['String']['output']>;
  observed_arrival_time: Maybe<Scalars['Seconds']['output']>;
  observed_departure_time: Maybe<Scalars['Seconds']['output']>;
  route_id: Maybe<Scalars['String']['output']>;
  schedule_relationship: Maybe<Scalars['String']['output']>;
  scheduled_arrival_time: Maybe<Scalars['Seconds']['output']>;
  scheduled_departure_time: Maybe<Scalars['Seconds']['output']>;
  source: Maybe<Scalars['String']['output']>;
  stop_sequence: Maybe<Scalars['Int']['output']>;
  to_stop_id: Maybe<Scalars['String']['output']>;
  trip_id: Maybe<Scalars['String']['output']>;
  trip_start_date: Maybe<Scalars['Date']['output']>;
  trip_start_time: Maybe<Scalars['Seconds']['output']>;
};

export type StopObservationFilter = {
  feed_version_id: Scalars['Int']['input'];
  source: Scalars['String']['input'];
  trip_start_date: Scalars['Date']['input'];
};

export type StopPlace = {
  __typename?: 'StopPlace';
  adm0_iso: Maybe<Scalars['String']['output']>;
  adm0_name: Maybe<Scalars['String']['output']>;
  adm1_iso: Maybe<Scalars['String']['output']>;
  adm1_name: Maybe<Scalars['String']['output']>;
};

/** Record from a static GTFS [stop_times.txt](https://gtfs.org/schedule/reference/#stop_timestxt) file. */
export type StopTime = {
  __typename?: 'StopTime';
  arrival: StopTimeEvent;
  arrival_time: Scalars['Seconds']['output'];
  continuous_drop_off: Maybe<Scalars['Int']['output']>;
  continuous_pickup: Maybe<Scalars['Int']['output']>;
  departure: StopTimeEvent;
  departure_time: Scalars['Seconds']['output'];
  drop_off_type: Maybe<Scalars['Int']['output']>;
  interpolated: Maybe<Scalars['Int']['output']>;
  pickup_type: Maybe<Scalars['Int']['output']>;
  service_date: Maybe<Scalars['Date']['output']>;
  shape_dist_traveled: Maybe<Scalars['Float']['output']>;
  stop: Stop;
  stop_headsign: Maybe<Scalars['String']['output']>;
  stop_sequence: Scalars['Int']['output'];
  timepoint: Maybe<Scalars['Int']['output']>;
  trip: Trip;
};

export type StopTimeEvent = {
  __typename?: 'StopTimeEvent';
  delay: Maybe<Scalars['Int']['output']>;
  estimated: Maybe<Scalars['Seconds']['output']>;
  estimated_utc: Maybe<Scalars['Time']['output']>;
  scheduled: Maybe<Scalars['Seconds']['output']>;
  stop_timezone: Scalars['String']['output'];
  uncertainty: Maybe<Scalars['Int']['output']>;
};

export type StopTimeFilter = {
  allow_previous_route_onestop_ids: InputMaybe<Scalars['Boolean']['input']>;
  end: InputMaybe<Scalars['Seconds']['input']>;
  end_time: InputMaybe<Scalars['Int']['input']>;
  exclude_first: InputMaybe<Scalars['Boolean']['input']>;
  exclude_last: InputMaybe<Scalars['Boolean']['input']>;
  next: InputMaybe<Scalars['Int']['input']>;
  route_onestop_ids: InputMaybe<Array<Scalars['String']['input']>>;
  service_date: InputMaybe<Scalars['Date']['input']>;
  start: InputMaybe<Scalars['Seconds']['input']>;
  start_time: InputMaybe<Scalars['Int']['input']>;
  use_service_window: InputMaybe<Scalars['Boolean']['input']>;
};

/** Record from a static GTFS [trips.txt](https://gtfs.org/schedule/reference/#tripstxt) file optionally enriched with by GTFS Realtime [TripUpdate](https://gtfs.org/reference/realtime/v2/#message-tripupdate) and [Alert](https://gtfs.org/reference/realtime/v2/#message-alert) messages. */
export type Trip = {
  __typename?: 'Trip';
  alerts: Maybe<Array<Alert>>;
  bikes_allowed: Scalars['Int']['output'];
  block_id: Scalars['String']['output'];
  calendar: Calendar;
  direction_id: Scalars['Int']['output'];
  feed_version: FeedVersion;
  frequencies: Array<Frequency>;
  id: Scalars['Int']['output'];
  route: Route;
  schedule_relationship: Maybe<ScheduleRelationship>;
  shape: Maybe<Shape>;
  stop_pattern_id: Scalars['Int']['output'];
  stop_times: Array<Maybe<StopTime>>;
  timestamp: Maybe<Scalars['Time']['output']>;
  trip_headsign: Scalars['String']['output'];
  trip_id: Scalars['String']['output'];
  trip_short_name: Scalars['String']['output'];
  wheelchair_accessible: Scalars['Int']['output'];
};


/** Record from a static GTFS [trips.txt](https://gtfs.org/schedule/reference/#tripstxt) file optionally enriched with by GTFS Realtime [TripUpdate](https://gtfs.org/reference/realtime/v2/#message-tripupdate) and [Alert](https://gtfs.org/reference/realtime/v2/#message-alert) messages. */
export type TripAlertsArgs = {
  active: InputMaybe<Scalars['Boolean']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
};


/** Record from a static GTFS [trips.txt](https://gtfs.org/schedule/reference/#tripstxt) file optionally enriched with by GTFS Realtime [TripUpdate](https://gtfs.org/reference/realtime/v2/#message-tripupdate) and [Alert](https://gtfs.org/reference/realtime/v2/#message-alert) messages. */
export type TripFrequenciesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
};


/** Record from a static GTFS [trips.txt](https://gtfs.org/schedule/reference/#tripstxt) file optionally enriched with by GTFS Realtime [TripUpdate](https://gtfs.org/reference/realtime/v2/#message-tripupdate) and [Alert](https://gtfs.org/reference/realtime/v2/#message-alert) messages. */
export type TripStop_TimesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<TripStopTimeFilter>;
};

export type TripFilter = {
  feed_onestop_id: InputMaybe<Scalars['String']['input']>;
  feed_version_sha1: InputMaybe<Scalars['String']['input']>;
  license: InputMaybe<LicenseFilter>;
  route_ids: InputMaybe<Array<Scalars['Int']['input']>>;
  route_onestop_ids: InputMaybe<Array<Scalars['String']['input']>>;
  service_date: InputMaybe<Scalars['Date']['input']>;
  stop_pattern_id: InputMaybe<Scalars['Int']['input']>;
  trip_id: InputMaybe<Scalars['String']['input']>;
};

export type TripStopTimeFilter = {
  end: InputMaybe<Scalars['Seconds']['input']>;
  start: InputMaybe<Scalars['Seconds']['input']>;
};

export type ValidationRealtimeResult = {
  __typename?: 'ValidationRealtimeResult';
  json: Maybe<Scalars['Map']['output']>;
  url: Scalars['String']['output'];
};

export type ValidationResult = {
  __typename?: 'ValidationResult';
  agencies: Array<Agency>;
  earliest_calendar_date: Maybe<Scalars['Date']['output']>;
  errors: Array<ValidationResultErrorGroup>;
  failure_reason: Scalars['String']['output'];
  feed_infos: Array<FeedInfo>;
  files: Array<FeedVersionFileInfo>;
  latest_calendar_date: Maybe<Scalars['Date']['output']>;
  realtime: Maybe<Array<ValidationRealtimeResult>>;
  routes: Array<Route>;
  service_levels: Array<FeedVersionServiceLevel>;
  sha1: Scalars['String']['output'];
  stops: Array<Stop>;
  success: Scalars['Boolean']['output'];
  warnings: Array<ValidationResultErrorGroup>;
};


export type ValidationResultAgenciesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
};


export type ValidationResultFeed_InfosArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
};


export type ValidationResultRoutesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
};


export type ValidationResultService_LevelsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  route_id: InputMaybe<Scalars['String']['input']>;
};


export type ValidationResultStopsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
};

export type ValidationResultError = {
  __typename?: 'ValidationResultError';
  entity_id: Scalars['String']['output'];
  error_type: Scalars['String']['output'];
  field: Scalars['String']['output'];
  filename: Scalars['String']['output'];
  message: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ValidationResultErrorGroup = {
  __typename?: 'ValidationResultErrorGroup';
  count: Scalars['Int']['output'];
  error_type: Scalars['String']['output'];
  errors: Array<ValidationResultError>;
  filename: Scalars['String']['output'];
  limit: Scalars['Int']['output'];
};

/** [Vehicle Position](https://gtfs.org/reference/realtime/v2/#message-vehicleposition) message provided by a source GTFS Realtime feed. */
export type VehiclePosition = {
  __typename?: 'VehiclePosition';
  congestion_level: Maybe<Scalars['String']['output']>;
  current_status: Maybe<Scalars['String']['output']>;
  current_stop_sequence: Maybe<Scalars['Int']['output']>;
  position: Maybe<Scalars['Point']['output']>;
  stop_id: Maybe<Stop>;
  timestamp: Maybe<Scalars['Time']['output']>;
  vehicle: Maybe<RtVehicleDescriptor>;
};

export type Waypoint = {
  __typename?: 'Waypoint';
  lat: Scalars['Float']['output'];
  lon: Scalars['Float']['output'];
  name: Maybe<Scalars['String']['output']>;
};

export type WaypointInput = {
  lat: Scalars['Float']['input'];
  lon: Scalars['Float']['input'];
  name: InputMaybe<Scalars['String']['input']>;
};
