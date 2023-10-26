import {
  InvalidOnestopIdError,
  OnestopIdEntityType,
  OnestopIdWrapper,
} from "./onestop-id";

describe.each([
  {
    entityType: OnestopIdEntityType.Operator,
    geohash: "9q9",
    name: "BART",
    value: "o-9q9-BART",
  },
  {
    entityType: OnestopIdEntityType.Feed,
    geohash: "9q9",
    name: "bart",
    value: "f-9q9-bart",
  },
  {
    entityType: OnestopIdEntityType.Agency,
    geohash: "9q9",
    name: "bart",
    value: "o-9q9-bart",
  },
  {
    entityType: OnestopIdEntityType.Route,
    geohash: "9q8y",
    name: "red~s",
    value: "r-9q8y-red~s",
  },
  {
    entityType: OnestopIdEntityType.Stop,
    geohash: "9q9jz7jvbh",
    name: "unioncity",
    value: "s-9q9jz7jvbh-unioncity",
  },
  {
    entityType: OnestopIdEntityType.Station,
    geohash: "9q9jz7jvbh",
    name: "unioncity",
    value: "s-9q9jz7jvbh-unioncity",
  },
  {
    entityType: OnestopIdEntityType.Feed,
    geohash: undefined,
    name: "galesburg~il~us",
    value: "f-galesburg~il~us",
  },
  {
    entityType: OnestopIdEntityType.Operator,
    geohash: "ezjm",
    name: "informaciónoficial~consorcioregionaldetransportesdemadrid",
    value: "o-ezjm-informaciónoficial~consorcioregionaldetransportesdemadrid",
  },
  {
    entityType: OnestopIdEntityType.Agency,
    geohash: "xn39",
    name: "瑞浪市",
    value: "o-xn39-瑞浪市",
  },
  {
    entityType: OnestopIdEntityType.Route,
    geohash: "xn39k",
    name: "瑞浪市コミュニティバス釜戸大湫線",
    value: "r-xn39k-瑞浪市コミュニティバス釜戸大湫線",
  },
])("Parse '%s'", ({ entityType, geohash, name, value }) => {
  const wrapper = new OnestopIdWrapper(value);

  test(`entityType equals ${entityType}`, () => {
    expect(wrapper.entityType).toStrictEqual(entityType);
    expect(OnestopIdWrapper.entityTypeOf(value)).toStrictEqual(entityType);
  });

  test(`geohash equals ${geohash}`, () => {
    expect(wrapper.geohash).toStrictEqual(geohash);
    expect(OnestopIdWrapper.geohashOf(value)).toStrictEqual(geohash);
  });

  test(`name equals ${name}`, () => {
    expect(wrapper.name).toStrictEqual(name);
    expect(OnestopIdWrapper.nameOf(value)).toStrictEqual(name);
  });

  test(`value equals ${value}`, () => {
    expect(wrapper.value).toStrictEqual(value);
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
])("Throw for '%s'", (value) => {
  expect(() => new OnestopIdWrapper(value)).toThrow(InvalidOnestopIdError);
});
