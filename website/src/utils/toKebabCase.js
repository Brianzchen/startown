// @flow
export default (value: string): string => (
  value.toLowerCase().replace(/ /g, '-')
);
