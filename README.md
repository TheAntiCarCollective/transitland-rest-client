# transitland-rest-client

Easy to use, minimal, and simple implementation of the [Transitland v2 REST API](https://www.transit.land/documentation/rest-api/) for fetching [GTFS](https://gtfs.org/schedule/), [GTFS Realtime](https://gtfs.org/realtime/), [GBFS](https://www.gbfs.org/), and [MDS](https://www.openmobilityfoundation.org/about-mds/) data in Javascript and/or Typescript.

## Features

### 📦 Zero Dependencies

### ✅ Typed Responses

### 📃 Automatic Pagination

### 🚦 Automatic Rate Limiting

### 🆔 Onestop ID Utilities

## Getting Started

### Install

`npm install transitland-rest-client`

### Example

```typescript
import type { FeedResponse } from "transitland-rest-client";
import Client, { EntityType, OnestopId } from "transitland-rest-client";

const client = new Client("YOUR_API_KEY_HERE");
// or
// const client = new Client({
//   apiKey: "YOUR_API_KEY_HERE",
//   baseUrl: "https://transit.land/api/v2/rest"
// });

const { feeds } = await client.fetch<FeedResponse>("feeds");
// or
// const { feeds } = await client.fetch<FeedResponse>("/feeds");
// const { feeds } = await client.fetch<FeedResponse>({
//   path: "feeds",
//   query: {
//     limit: "100",
//     spec: "gbfs",
//   }
// });

// Automatically paginate with the same options as above
const pages = client.paginateFetch<FeedResponse>("feeds");
for await (const { feeds } of pages) {
}

// Onestop ID Utilities
const { onestop_id } = feeds[0]; // f-9q9-caltrain

OnestopId.entityTypeOf(onestop_id) === EntityType.Feed;
OnestopId.geohashOf(onestop_id) === "9q9";
OnestopId.nameof(onestop_id) === "caltrain";

const onestopId = OnestopId.parse(onestop_id);
onestopId.entityType === EntityType.Feed;
onestopId.geohash === "9q9";
onestopId.name === "caltrain";
```
