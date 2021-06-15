export default (o: unknown): string => {
  return JSON.stringify(o, null, 2);
};
