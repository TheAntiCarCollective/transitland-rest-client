import { EntityType, OnestopId, ParsingError } from "./onestop-id";

describe.each([
  {
    entityType: EntityType.Operator,
    geohash: "9q9",
    name: "BART",
    string: "o-9q9-BART",
  },
  {
    entityType: EntityType.Feed,
    geohash: "9q9",
    name: "bart",
    string: "f-9q9-bart",
  },
  {
    entityType: EntityType.Agency,
    geohash: "9q9",
    name: "bart",
    string: "o-9q9-bart",
  },
  {
    entityType: EntityType.Route,
    geohash: "9q8y",
    name: "red~s",
    string: "r-9q8y-red~s",
  },
  {
    entityType: EntityType.Stop,
    geohash: "9q9jz7jvbh",
    name: "unioncity",
    string: "s-9q9jz7jvbh-unioncity",
  },
  {
    entityType: EntityType.Station,
    geohash: "9q9jz7jvbh",
    name: "unioncity",
    string: "s-9q9jz7jvbh-unioncity",
  },
  {
    entityType: EntityType.Feed,
    geohash: undefined,
    name: "galesburg~il~us",
    string: "f-galesburg~il~us",
  },
  {
    entityType: EntityType.Operator,
    geohash: "ezjm",
    name: "informaciónoficial~consorcioregionaldetransportesdemadrid",
    string: "o-ezjm-informaciónoficial~consorcioregionaldetransportesdemadrid",
  },
  {
    entityType: EntityType.Agency,
    geohash: "xn39",
    name: "瑞浪市",
    string: "o-xn39-瑞浪市",
  },
  {
    entityType: EntityType.Route,
    geohash: "xn39k",
    name: "瑞浪市コミュニティバス釜戸大湫線",
    string: "r-xn39k-瑞浪市コミュニティバス釜戸大湫線",
  },
])("Parse '%s'", ({ entityType, geohash, name, string }) => {
  const onestopId = OnestopId.parse(string);

  test(`entityType equals ${entityType}`, () => {
    expect(onestopId.entityType).toStrictEqual(entityType);
    expect(OnestopId.entityTypeOf(string)).toStrictEqual(entityType);
  });

  test(`geohash equals ${geohash}`, () => {
    expect(onestopId.geohash).toStrictEqual(geohash);
    expect(OnestopId.geohashOf(string)).toStrictEqual(geohash);
  });

  test(`name equals ${name}`, () => {
    expect(onestopId.name).toStrictEqual(name);
    expect(OnestopId.nameOf(string)).toStrictEqual(name);
  });

  test(`string coercion equals ${string}`, () => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    expect(`${onestopId}`).toStrictEqual(string);
  });
});

test.each([
  "",
  "o9q9BART",
  "o-9q9-BART-o-9q9-BART",
  "a-9q9-BART",
  "9q9-BART",
  // TODO invalid geohash "o-a9q9-BART",
  // TODO invalid name "o-9q9-BART.",
  // TODO invalid name "o-9q9-BART ",
])("Throw for '%s'", (string) => {
  expect(() => OnestopId.parse(string)).toThrow(ParsingError);
});
