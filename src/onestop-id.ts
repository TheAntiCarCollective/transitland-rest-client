/**
 * An Onestop ID is an alphanumeric, global, immutable identifier for transit
 * feeds, operators/agencies, stops/stations, and routes provided by
 * authoritative sources that contain timetable and geographic information for
 * transit networks.
 *
 * Every Onestop ID includes two or three components, separated by hyphens.
 *
 * @link https://www.transit.land/documentation/concepts/onestop-id-scheme/#what-is-in-a-onestop-id
 */
export type OnestopId = string;

/**
 * Entity types for Onestop IDs. See {@link OnestopIdWrapper.entityType}
 * for more details.
 */
/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
export enum OnestopIdEntityType {
  Agency = "o",
  Feed = "f",
  Operator = "o",
  Route = "r",
  Station = "s",
  Stop = "s",
}
/* eslint-enable @typescript-eslint/no-duplicate-enum-values */

/** Thrown when parsing an invalid Onestop ID. */
export class InvalidOnestopIdError extends Error {
  /**
   * Creates a new {@link InvalidOnestopIdError}.
   *
   * @param value The invalid Onestop ID.
   * @param reason The reason why "value" is invalid.
   */
  constructor(value: string, reason: string) {
    super(`${value} is not a valid OnestopId: ${reason}`);
  }
}

/**
 * A convenient wrapper for parsing Onestop ID values and getting their
 * components.
 *
 * Do not use this class for (de)serialization; instead, use {@link OnestopId}.
 */
export class OnestopIdWrapper {
  /**
   * The first component of an Onestop ID is its entity type.
   *
   * @link https://www.transit.land/documentation/concepts/onestop-id-scheme/#entity-types
   */
  readonly entityType: OnestopIdEntityType;

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

  /** The parsed Onestop ID. */
  readonly value: OnestopId;

  /**
   * Parses an Onestop ID then creates a new {@link OnestopIdWrapper}.
   *
   * @param value The Onestop ID.
   * @throws InvalidOnestopIdError If "value" is an invalid Onestop ID.
   */
  constructor(value: string) {
    const components = value.split("-");
    const { length } = components;
    if (length < 2 || length > 3)
      // prettier-ignore
      throw new InvalidOnestopIdError(value, `${length} components; expected 2 or 3`);

    const entityType = components[0];
    if (entityType === undefined)
      throw new InvalidOnestopIdError(value, "Missing entityType");
    const validEntityTypes = Object.values(OnestopIdEntityType) as string[];
    if (!validEntityTypes.includes(entityType))
      throw new InvalidOnestopIdError(value, "Invalid entityType");
    this.entityType = entityType as OnestopIdEntityType;

    const geohash = length === 2 ? undefined : components[1];
    if (geohash !== undefined) {
      // TODO Validate geohash
      this.geohash = geohash;
    }

    const name = geohash === undefined ? components[1] : components[2];
    if (name === undefined)
      throw new InvalidOnestopIdError(value, "Missing name");
    // TODO Validate name
    this.name = name;

    this.value = value;
  }

  /**
   * Parses an Onestop ID then gets its {@link entityType} component.
   *
   * @param id The Onestop ID.
   * @throws InvalidOnestopIdError If "id" is an invalid Onestop ID.
   */
  static entityTypeOf(id: OnestopId) {
    const { entityType } = new OnestopIdWrapper(id);
    return entityType;
  }

  /**
   * Parses an Onestop ID then gets its {@link geohash} component.
   *
   * @param id The Onestop ID.
   * @throws InvalidOnestopIdError If "id" is an invalid Onestop ID.
   */
  static geohashOf(id: OnestopId) {
    const { geohash } = new OnestopIdWrapper(id);
    return geohash;
  }

  /**
   * Parses an Onestop ID then gets its {@link name} component.
   *
   * @param id The Onestop ID.
   * @throws InvalidOnestopIdError If "id" is an invalid Onestop ID.
   */
  static nameOf(id: OnestopId) {
    const { name } = new OnestopIdWrapper(id);
    return name;
  }
}
