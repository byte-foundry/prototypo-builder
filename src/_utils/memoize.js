import memoize from 'memoize-immutable';

// A memoize function that clears its cache every thirty minutes
export default function(fn, options = {}) {
  options.cache = new Map();
  setInterval(() => {
    options.cache.clear();
  }, 30 * 60 * 1000);

  return memoize(fn, options);
}
