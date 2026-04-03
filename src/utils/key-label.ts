export const getKeyFromKeyLabelObject = <T extends string, R extends string>(
  keyLabelObject: Record<T, R>,
  label: R,
): T | undefined => Object.keys(keyLabelObject)
  .find((key: T) => keyLabelObject[key] === label) as T | undefined;
