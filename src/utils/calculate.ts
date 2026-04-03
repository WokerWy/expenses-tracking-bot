// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import calculateString from 'calculate-string';

export const calculateByStringExpression = (
  value: string,
): number => calculateString(value) as number;
