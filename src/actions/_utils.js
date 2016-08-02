// pliz note: the absence of 0 is purposeful.
const chars = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ&$';

// Generate a unique node id with 6 characters suffix
// Chances of collisions are 1 in 2 billions
// (we used to use an auto-incrementing id but it was incompatible with loading
// a snapshot of the state from the network or from a file)
export function getNodeId(prefix) {
  return (`${prefix}_XXXXXX`).replace(/X/g, function() {
    return chars[Math.floor( Math.random() * chars.length )];
  });
}
