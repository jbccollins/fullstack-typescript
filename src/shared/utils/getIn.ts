/* getIn
	target: object
	keyPath: array
	
	Given an object and a path of keys, recursively traverse the nesting of the object.
*/
const getIn = (target: unknown, keyPath: Array<string | number>): any => {
  if (keyPath.length === 0) {
    return target;
  }
  if (keyPath.length === 1) {
    return target[keyPath[0]];
  }
  return getIn(target[keyPath[0]], keyPath.slice(1));
};

export default getIn;
