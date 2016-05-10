// TODO: this memoize function is a gigantic memory-leak. At some point we'll
// need to find a way to mitigate it.
export default function memoize(fn) {
  const cache = new Map();
  const length = fn.length;

  switch(length) {
    case 1:
      return function() {
        if ( !cache.has(arguments[0]) ) {
          cache.set(arguments[0], fn.apply( this, arguments ));
        }

        return cache.get(arguments[0]);
      };
    case 2:
      return function() {
        if ( !cache.has(arguments[0]) ) {
          const cache1 = new Map();
          cache1.set(arguments[1], fn.apply( this, arguments ));
          cache.set(arguments[0], cache1);
        } else if ( !cache.get(arguments[0]).has(arguments[1]) ) {
          cache.get(arguments[0]).set(arguments[1], fn.apply( this, arguments ));
        }

        return cache.get(arguments[0]).get(arguments[1]);
      };
    case 3:
      return function() {
        if ( !cache.has(arguments[0]) ) {
          const cache1 = new Map();
          const cache2 = new Map();
          cache2.set(arguments[2], fn.apply( this, arguments ));
          cache1.set(arguments[1], cache2);
          cache.set(arguments[0], cache1);
        } else if ( !cache.get(arguments[0]).has(arguments[1]) ) {
          const cache2 = new Map();
          cache2.set(arguments[2], fn.apply( this, arguments ));
          cache.get(arguments[0]).set(arguments[1], cache2);
        } else if (  !cache.get(arguments[0]).get(arguments[1]).has(arguments[2]) ) {
          cache.get(arguments[0]).get(arguments[1]).set(arguments[2], fn.apply( this, arguments ));
        }

        return cache.get(arguments[0]).get(arguments[1]).get(arguments[2]);
      };
  }
}
