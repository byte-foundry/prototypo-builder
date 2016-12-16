/*
 * A wrapper around Bezier-js that applies appropriate memoizer to each method
 * TODO: this implementation could greatly benefit from the different caches
 *       found in memoize-immutable 3
 * TODO: use this file instead of importing bezier-js module everywhere
 */
import Bezier from 'bezier-js/fp';

import Memoize from '~/_utils/Memoize';

Object.keys(Bezier).forEach((name) => {
  Bezier[name] = Memoize(Bezier[name]);
});

export default Bezier;
