import R from 'ramda';
import DepTree from 'deptree';

import { getAllDescendants } from './../_utils/graph';

export function parseFormula( _strFormula ) {
  const strFormula = _strFormula.trim();
  const usedParams = strFormula.match(/(\$[a-z0-9_]+)/ig) || [];
  const usedRefs = (strFormula.match(/glyph\.[a-z0-9_\.]+/ig) || []).map((id) => {
    return id.replace('glyph.', '');
  });

  let updater;
  try  {
    updater = new Function( 'glyph', ...usedParams, 'return ' + strFormula );
  } catch(e) {
    return {
      formula: strFormula,
      isInvalid: true
    }
  }

  return {
    formula: strFormula,
    params: usedParams,
    refs: usedRefs,
    updater: R.memoize(updater),
    isInvalid: false
  };
}

export const buildArgs = (nodes, params, usedParams) => {
  return [nodes].concat( usedParams.map((name) => params[name]) );
};
const buildArgsMemoized = R.memoize(buildArgs);
buildArgsMemoized.displayName = 'buildArgsMemoized';

// export const getCalculatedProps = R.memoize((nodes, params, nodeId) => {
//   const calculatedProps = {};
//   const node = nodes[nodeId];
//
//   Object.keys(node).forEach((propName) => {
//     if ( typeof node[propName] === 'object' && '_for' in node[propName] ) {
//       if ( !('updater' in node[propName]) ) {
//         return;
//       }
//
//       const propMeta = node[propName];
//       try {
//         calculatedProps[propMeta._for] = (
//           propMeta.updater.apply( node, buildArgsMemoized(nodes, params, propMeta.params) )
//         );
//       } catch(e) {
//         /* eslint-disable no-console */
//         console.error(`Calculating prop '${propMeta._for}' of node '${node.id}' errored`, e);
//         /* eslint-enable no-console */
//       }
//     }
//     else if ( !((propName + 'Meta') in node) ) {
//       // copy properties that don't have any meta as is
//       calculatedProps[propName] = node[propName];
//     }
//   });
//
//   return calculatedProps;
// });
//
// export const getCalculatedNodes = R.memoize((nodes, params) => {
//   return R.map((node) => {
//     return getCalculatedProps( nodes, params, node.id );
//   }, nodes);
// });

// TODO: the first argument should be updaters, and we should move all necessary
// info to calculate the params into that part of the state (e.g. _order),
// so that memoization is only dependant of the updaters and the parentParams
export const getCalculatedParams = R.memoize((state, parentParams, nodeId) => {
  const calculatedParams = parentParams ? { ...parentParams } : {};
  const { params, paramsMeta } = state.nodes[nodeId];
  const updaters = state.updaters[nodeId];

  paramsMeta._order.forEach((paramName) => {
    if ( paramName in updaters ) {
      const formula = updaters[paramName];
      try {
        calculatedParams[paramName] = (
          formula.updater.apply(
            // we don't want to use the memoized version of buildArgs here,
            // as the content of calculatedParams will change after calculating
            // each param
            null, buildArgs(null, calculatedParams, formula.params)
          )
        );
      } catch(e) {
        /* eslint-disable no-console */
        console.error(`Calculating prop '${paramName}' of node '${nodeId}' errored`, e);
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
getCalculatedParams.displayName = 'getCalculatedParamsMemoized';

// This function is quite expensive but it's memoized based on the .updaters part
// of the state so it's cool.
export const getSolvingOrder = R.memoize((glyphUpdaters = {}) => {
  const depTree = new DepTree();

  Object.keys(glyphUpdaters).forEach((strPath) => {
    const propUpdater = glyphUpdaters[strPath];
    if ( typeof propUpdater !== 'object' || !('refs' in propUpdater) ) {
      return;
    }

    depTree.add(strPath, glyphUpdaters[strPath].refs);
  });

  return depTree.resolve();
});
getSolvingOrder.displayName = 'getSolvingOrderMemoized';

export const getCalculatedGlyph = R.memoize((state, parentParams, glyphId) => {
  // TODO: glyphs should be able to have local parameters
  // const params = getCalculatedParams(state, parentParams, glyphId);
  const glyphUpdaters = state.updaters[glyphId];
  const solvingOrder = getSolvingOrder(glyphUpdaters);
  const calculatedGlyph = R.map((node) => {
    // copy static properties of the node as is
    const staticNode = {};
    Object.keys(node).forEach((propName) => {
      const propType = typeof node[propName];
      if (
        propName === 'childIds' ||
        ( propType !== 'object' && propType !== 'function' )
      ) {
        staticNode[propName] = node[propName];
      }
    });
    return staticNode;

  }, getAllDescendants(state.nodes, glyphId));

  solvingOrder.forEach((strPath) => {
    const path = strPath.split('.');

    try {
      calculatedGlyph[path[0]][path[1]] = (
        glyphUpdaters[strPath].updater.apply(
          calculatedGlyph[path[0]],
          buildArgsMemoized(calculatedGlyph, parentParams, glyphUpdaters[strPath].params)
        )
      );
    } catch(e) {
      /* eslint-disable no-console */
      console.error(`Calculating prop '${path[1]}' of node '${path[0]}' errored`, e);
      /* eslint-enable no-console */
    }

  });

  return calculatedGlyph;
});
getCalculatedGlyph.displayName = 'getCalculatedGlyphMemoized';
