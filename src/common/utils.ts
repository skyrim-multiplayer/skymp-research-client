/**
 * Extracts a set of keys from the type
 * @template FromType type for extract keys
 * @template KeepType filter type (string, number, function ...)
 * @template Include if false then invert result for {@link KeepType} (NOT this type)
 * @example type stringKeys = getNames<SomeClass, string>;
 */
type getNames<FromType, KeepType = any, Include = true> = {
  [K in keyof FromType]:
  FromType[K] extends KeepType ?
  Include extends true ? K :
  never : Include extends true ?
  never : K
}[keyof FromType];

/**
 * Gets key name of some class, interface
 * @param key 
 * @returns 
 * @example nameOf<SomeClass>("someProperty")
 */
export function nameOf<T>(key: keyof T): keyof T {
  return key;
}
