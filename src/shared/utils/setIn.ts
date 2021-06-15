/* setIn
	target: object
	keyPath: array
	value: any

	Given an object and a path of keys, recursively traverse the nesting of the object and insert the value.
*/
const setIn = (target: unknown, keyPath: Array<string | number>, value: unknown): void => {
  if (keyPath.length === 0) {
    throw new Error('No keys provided in "keyPath" for "setIn"');
  }
  let i = 0;
  while (i < keyPath.length - 1) {
    target = target[keyPath[i]];
    i++;
  }
  target[keyPath[i]] = value;
};

export default setIn;
