/**
 * Entity types for Onestop IDs.
 *
 * @see OnestopId.entityType
 */
/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
export enum EntityType {
  Agency = "o",
  Feed = "f",
  Operator = "o",
  Route = "r",
  Station = "s",
  Stop = "s",
}
/* eslint-enable @typescript-eslint/no-duplicate-enum-values */

/** Thrown when parsing an invalid Onestop ID string. */
export class ParsingError extends Error {
  /**
   * Creates a new `ParsingError`.
   *
   * @param string The invalid Onestop ID string.
   * @param reason The reason `string` is invalid.
   */
  constructor(string: string, reason: string) {
    super(`${reason}: ${string}`);
  }
}

/**
 * An Onestop ID is an alphanumeric, global, immutable identifier for transit
 * feeds, operators/agencies, stops/stations, and routes provided by
 * authoritative sources that contain timetable and geographic information for
 * transit networks.
 *
 * Every Onestop ID includes two or three components, separated by hyphens.
 *
 * Do not use this class for (de)serialization of Onestop ID strings; instead,
 * use the string returned by {@link toString}.
 *
 * @link https://www.transit.land/documentation/concepts/onestop-id-scheme/#what-is-in-a-onestop-id
 */
export class OnestopId {
  /**
   * The first component of an Onestop ID is its entity type.
   *
   * @link https://www.transit.land/documentation/concepts/onestop-id-scheme/#entity-types
   */
  readonly entityType: EntityType;

  /**
   * The second component of an Onestop ID is an optional geohash.
   *
   * A geohash is a set of characters that can be translated into a geographic
   * bounding box around the service area of the operator/agency, the location
   * of the stop/station, or the coverage of a route. The more characters, the
   * more precise and smaller the bounding box.
   *
   * Sometimes, an operator's service area won't fit exactly inside a geohash's
   * bounding box. The most extreme example is London, where the tube network
   * crosses the prime meridian. No one geohash can be used to effectively
   * identify the extent of Transport for London's service area.
   *
   * Therefore, the geohash in an Onestop ID is used to refer to a focal point.
   * In the case of feeds and operators, their coverage/service area can extend
   * out to any of the eight neighboring geohash bounding boxes. In the case of
   * routes, they can extend into any of the eight neighbors. The centroid of
   * the feed, operator, or route will always be located in the geohash that's
   * included in the Onestop ID—the focal point, that is—but the lines or
   * polygons could extend out into neighbors.
   *
   * @link https://www.transit.land/documentation/concepts/onestop-id-scheme/#geohash
   */
  readonly geohash?: string;

  /**
   * The final component of an Onestop ID is a name. This is the third
   * component when a geohash is the second component; or the name is the
   * second component, when the geohash is skipped.
   *
   * An abbreviated name that is short but understandable. The only punctuation
   * that is allowed are tildes (~) to indicate word breaks within the name
   * component.
   *
   * When using in a "three part" Onestop ID with a geohash, the name doesn't
   * have to be unique across the whole world, but it must be unique within the
   * bounding box of the particular geohash.
   *
   * When using in a "two part" Onestop ID for a feed or an operator (without a
   * geohash), the name does have to be globally unique.
   *
   * The name component may include UTF-8 characters, including accented
   * letters and Japanese letters. For example:
   * * o-ezjm-informaciónoficial~consorcioregionaldetransportesdemadrid
   * * o-xn39-瑞浪市
   * * r-xn39k-瑞浪市コミュニティバス釜戸大湫線
   *
   * Onestop IDs are case-insensitive. It is recommended to use lower case
   * internally in your systems. When displaying IDs for users, you can
   * capitalize for readability.
   *
   * @link https://www.transit.land/documentation/concepts/onestop-id-scheme/#name
   */
  readonly name: string;

  private constructor(
    entityType: EntityType,
    geohash: string | undefined,
    name: string,
  ) {
    this.entityType = entityType;
    this.geohash = geohash;
    this.name = name;
  }

  /**
   * Parses a string argument and returns its {@link OnestopId.entityType}
   * component.
   *
   * @param string The Onestop ID string to parse.
   * @throws ParsingError If `string` is an invalid Onestop ID.
   */
  static entityTypeOf(string: string) {
    const { entityType } = OnestopId.parse(string);
    return entityType;
  }

  /**
   * Parses a string argument and returns its {@link OnestopId.geohash}
   * component.
   *
   * @param string The Onestop ID string to parse.
   * @throws ParsingError If `string` is an invalid Onestop ID.
   */
  static geohashOf(string: string) {
    const { geohash } = OnestopId.parse(string);
    return geohash;
  }

  /**
   * Parses a string argument and returns its {@link OnestopId.name}
   * component.
   *
   * @param string The Onestop ID string to parse.
   * @throws ParsingError If `string` is an invalid Onestop ID.
   */
  static nameOf(string: string) {
    const { name } = OnestopId.parse(string);
    return name;
  }

  /**
   * Parses a string argument and returns an {@link OnestopId}.
   *
   * @param string The Onestop ID string to parse.
   * @throws ParsingError If `string` is an invalid Onestop ID.
   */
  static parse(string: string) {
    // region Components
    const components = string.split("-");
    const { length } = components;
    if (length < 2 || length > 3)
      // prettier-ignore
      throw new ParsingError(string, `Expected 2 or 3 components, but parsed ${length}`);
    // endregion

    // region Entity Type
    const entityTypeComponent = components[0];
    if (entityTypeComponent === undefined)
      throw new ParsingError(string, "Missing entity type");
    const validEntityTypes = Object.values(EntityType) as string[];
    if (!validEntityTypes.includes(entityTypeComponent))
      // prettier-ignore
      throw new ParsingError(string, `Invalid entity type "${entityTypeComponent}"`);
    const entityType = entityTypeComponent as EntityType;
    // endregion

    // region Geohash
    const geohash = length === 2 ? undefined : components[1];
    if (geohash !== undefined) {
      // TODO Validate geohash
    }
    // endregion

    // region Name
    const name = geohash === undefined ? components[1] : components[2];
    if (name === undefined) throw new ParsingError(string, "Missing name");
    // TODO Validate name
    // endregion

    return new OnestopId(entityType, geohash, name);
  }

  /** @inheritDoc */
  toString() {
    const { entityType, geohash, name } = this;
    return geohash === undefined
      ? `${entityType}-${name}`
      : `${entityType}-${geohash}-${name}`;
  }
}
