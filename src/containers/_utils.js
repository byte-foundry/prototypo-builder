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

export const buildArgs = R.memoize((node, params, usedParams) => {
  return [node].concat( usedParams.map((name) => params[name]) );
});

export const getCalculatedNode = R.memoize((node, params) => {
  const calculatedNode = {};

  Object.keys(node).forEach((propName) => {
    if ( /Meta$/.test(propName) ) {
      if ( !('updater' in node[propName]) ) {
        return;
      }

      const propMeta = node[propName];
      try {
        calculatedNode[propName.replace('Meta', '')] = (
          propMeta.updater.apply( node, buildArgs(node, params, propMeta.params) )
        );
      } catch(e) {
        /* eslint-disable no-console */
        console.error(`Calculating prop '${propName}' of node '${node.id}' errored`, e);
        /* eslint-enable no-console */
      }
    }
    else if ( !((propName + 'Meta') in node) ) {
      // copy properties that don't have any meta as is
      calculatedNode[propName] = node[propName];
    }
  });

  return calculatedNode;
});

export const getCalculatedNodes = R.memoize((nodes, params) => {
  return R.map((node) => {
    return getCalculatedNode( node, params );
  }, nodes);
});
