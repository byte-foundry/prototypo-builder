import R from 'ramda';

export function parseFormula( strFormula ) {
  const usedParams = strFormula.match(/(\$[a-z]+)/ig);
  let updater;
  try  {
    updater = new Function( 'self', ...usedParams, 'return ' + strFormula );
  } catch(e) {
    return {
      formula: strFormula,
      isInvalid: true
    }
  }

  return {
    formula: strFormula,
    params: usedParams,
    updater: R.memoize(updater),
    isInvalid: false
  }
}

export const buildArgs = (node, params, usedParams) => {
  return [node].concat( usedParams.map((name) => params[name]) );
};
const memoizedBuildArgs = R.memoize(buildArgs);

export const getCalculatedProps = R.memoize((node, params) => {
  const calculatedProps = {};

  Object.keys(node).forEach((propName) => {
    if ( typeof node[propName] === 'object' && '_for' in node[propName] ) {
      if ( !('updater' in node[propName]) ) {
        return;
      }

      const propMeta = node[propName];
      try {
        calculatedProps[propMeta._for] = (
          propMeta.updater.apply( node, memoizedBuildArgs(node, params, propMeta.params) )
        );
      } catch(e) {
        /* eslint-disable no-console */
        console.error(`Calculating prop '${propMeta._for}' of node '${node.id}' errored`, e);
        /* eslint-enable no-console */
      }
    }
    else if ( !((propName + 'Meta') in node) ) {
      // copy properties that don't have any meta as is
      calculatedProps[propName] = node[propName];
    }
  });

  return calculatedProps;
});

export const getCalculatedNodes = R.memoize((nodes, params) => {
  return R.map((node) => {
    return getCalculatedProps( node, params );
  }, nodes);
});

export const getCalculatedParams = R.memoize((node, parentParams) => {
  const calculatedParams = parentParams ? { ...parentParams } : {};
  const { params, paramsMeta } = node;

  paramsMeta._order.forEach((paramName) => {
    if ( 'updater' in paramsMeta[paramName] ) {
      const paramMeta = paramsMeta[paramName];
      try {
        calculatedParams[paramName] = (
          paramMeta.updater.apply(
            // we don't want to use the memoized version of buildArgs here,
            // as the content of calculatedParams will change after calculating
            // each param
            null, buildArgs(null, calculatedParams, paramMeta.params)
          )
        );
      } catch(e) {
        /* eslint-disable no-console */
        console.error(`Calculating prop '${paramName}' of node '${node.id}' errored`, e);
        /* eslint-enable no-console */
      }
    }
    else {
      // copy properties that don't have any meta as is
      calculatedParams[paramName] = params[paramName];
    }
  });

  return calculatedParams;
});
