import * as fs from "node:fs/promises";
import * as path from "node:path";
import pino from "pino";
import {
  InputData,
  jsonInputForTargetLanguage,
  quicktype,
} from "quicktype-core";

import type {
  AgencyResponse,
  FeedResponse,
  FeedVersionResponse,
  FetchOptions,
  Page,
  RouteResponse,
  StopResponse,
} from "../src";

import Client from "../src";
import { sample } from "./shared/array";
import Environment from "./shared/environment";
import { isNonNullable } from "./shared/nullable";

const logger = pino({
  level: Environment.PinoLevel,
  name: __filename,
});

const DefaultMinuteLimit = 60;

// region client
const client = new Client(Environment.TransitlandApiKey);

const paginateFetch = async <P extends Page>(
  options: FetchOptions,
  limit = DefaultMinuteLimit,
) => {
  if (typeof options === "object" && "query" in options) {
    const query = new URLSearchParams(options.query);
    query.set("limit", "100");
    options.query = query;
  }

  const childLogger = logger.child({
    limit,
    options,
    rateLimit: client.rateLimit,
  });

  childLogger.info("Fetching...");

  const pages = [];
  for await (const page of client.paginateFetch<P>(options)) {
    childLogger.debug(page, "Fetched...");
    pages.push(page);
    if (pages.length >= limit) break;
  }

  return pages;
};

const fetchWith = async <P extends Page>(
  array: string[],
  path: (element: string) => string,
) => {
  const pages = [];
  for (const element of array) {
    const page = await paginateFetch<P>({ path: path(element) }, 1);
    pages.push(page);
  }

  return pages.flat();
};
// endregion

// region generate
const generateType = async (objects: unknown[], name: string) => {
  const jsonInput = jsonInputForTargetLanguage("typescript");
  const samples = objects.map((object) => JSON.stringify(object));
  await jsonInput.addSource({ name, samples });

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  const { lines } = await quicktype({
    inferEnums: false,
    inputData,
  });

  const filename = name
    .split(/(?=[A-Z])/)
    .map((word) => word.toLowerCase())
    .join("-");

  const directory = path.join(process.cwd(), "src", "types");
  await fs.mkdir(directory, { recursive: true });
  const file = path.join(directory, `${filename}.generated.ts`);
  await fs.writeFile(file, lines.join("\n"));
  logger.info(`Generated ${name} type in ${file}`);
};

const generateFeedResponse = async () => {
  const feedResponses = await paginateFetch<FeedResponse>("feeds");
  const feedKeys = feedResponses
    .flatMap(({ feeds }) => feeds)
    .map(({ onestop_id }) => onestop_id);

  feedResponses.push(
    ...(await fetchWith<FeedResponse>(
      sample(feedKeys, DefaultMinuteLimit),
      (feedKey) => `feeds/${feedKey}`,
    )),
  );

  await generateType(feedResponses, "FeedResponse");
  return feedKeys;
};

const generateFeedVersionResponse = async (feedKeys: string[]) => {
  const feedVersionResponses =
    await paginateFetch<FeedVersionResponse>("feed_versions");
  const feedVersionKey = feedVersionResponses
    .flatMap(({ feed_versions }) => feed_versions)
    .map(({ sha1 }) => sha1);

  feedVersionResponses.push(
    ...(await fetchWith<FeedVersionResponse>(
      sample(feedVersionKey, DefaultMinuteLimit),
      (feedVersionKey) => `feed_versions/${feedVersionKey}`,
    )),
    ...(await fetchWith<FeedVersionResponse>(
      sample(feedKeys, DefaultMinuteLimit),
      (feedKey) => `feeds/${feedKey}/feed_versions`,
    )),
  );

  await generateType(feedVersionResponses, "FeedVersionResponse");
};

const generateAgencyResponse = async () => {
  const agencyResponses = await paginateFetch<AgencyResponse>("agencies");
  const agencyKeys = agencyResponses
    .flatMap(({ agencies }) => agencies)
    .map(({ onestop_id }) => onestop_id);

  agencyResponses.push(
    ...(await fetchWith<AgencyResponse>(
      sample(agencyKeys, DefaultMinuteLimit),
      (agencyKey) => `agencies/${agencyKey}`,
    )),
  );

  await generateType(agencyResponses, "AgencyResponse");
};

const generateRouteResponse = async () => {
  const routeResponses = await paginateFetch<RouteResponse>("routes");
  const routeKeys = routeResponses
    .flatMap(({ routes }) => routes)
    .map(({ onestop_id }) => onestop_id)
    .filter(isNonNullable);

  routeResponses.push(
    ...(await fetchWith<RouteResponse>(
      sample(routeKeys, DefaultMinuteLimit),
      (routeKey) => `routes/${routeKey}`,
    )),
  );

  await generateType(routeResponses, "RouteResponse");
  return routeKeys;
};

const generateStopResponse = async () => {
  const stopResponses = await paginateFetch<StopResponse>("stops");
  const stopKeys = stopResponses
    .flatMap(({ stops }) => stops)
    .map(({ onestop_id }) => onestop_id);

  stopResponses.push(
    ...(await fetchWith<StopResponse>(
      sample(stopKeys, DefaultMinuteLimit),
      (stopKey) => `stops/${stopKey}`,
    )),
  );

  await generateType(stopResponses, "StopResponse");
  return stopKeys;
};

const generateDepartureResponse = async (stopKeys: string[]) => {
  const departureResponses = await fetchWith(
    sample(stopKeys, DefaultMinuteLimit),
    (stopKey) => `stops/${stopKey}/departures`,
  );

  await generateType(departureResponses, "DepartureResponse");
};

const generateTripResponse = async (routeKeys: string[]) => {
  const tripResponses = await fetchWith(
    sample(routeKeys, DefaultMinuteLimit),
    (routeKey) => `routes/${routeKey}/trips`,
  );

  // TODO routes/{route_key}/trips/{id}
  await generateType(tripResponses, "TripResponse");
};
// endregion

const main = async () => {
  const feedKeys = await generateFeedResponse();
  await generateFeedVersionResponse(feedKeys);
  await generateAgencyResponse();
  const routeKeys = await generateRouteResponse();
  const stopKeys = await generateStopResponse();
  await generateDepartureResponse(stopKeys);
  await generateTripResponse(routeKeys);
};

void main();
