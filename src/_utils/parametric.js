import R from 'ramda';
import DepTree from 'deptree';

import memoize from '~/_utils/memoize';
import { getAllDescendants, getSegmentIds } from '~/_utils/graph';

// parse a text formula and return an updater function, while detecting refs
// and params used in the formula. Note that this function isn't aware of the
// context of the formula, so refs is incomplete when parsing the formula of an
// 'on' param (the segment ids are missing)
export const getUpdater = memoize(( _strFormula ) => {
  const strFormula = _strFormula.trim();
  const usedParams = strFormula.match(/(\$[a-z0-9_]+)/ig) || [];
  /*eslint no-useless-escape: "warn"*/
  const usedRefs = (strFormula.match(/glyph\.[a-z0-9_\.]+/ig) || []).map((id) => {
    return id.replace('glyph.', '');
  });

  let fn;
  try  {
    fn = new Function( 'glyph', ...usedParams, 'return ' + strFormula );
  }
  catch(e) {
    return {
      formula: _strFormula,
      isInvalid: true,
    };
  }

  return {
    formula: _strFormula,
    fn: memoize(fn),
    params: usedParams,
    refs: usedRefs,
    isInvalid: false,
  };
});

export const buildArgs = (nodes, params, usedParams) => {
  return [nodes].concat( usedParams.map((name) => {
    if ( !(name in params) ) {
      throw new Error(`Param '${name}' doesn't exist`);
    }

    return params[name];
  }));
};
const buildArgsMemoized = memoize(buildArgs);

// recursively parse formulas
// Note that this function is aware of the context of the formula.
// So when the propName is 'on', it's able to append all segment ids to the refs.
// TODO: I can't remember what the nodes argument is for. For memoization purpose?
export const getUpdaters = memoize((nodes, formulas) => {
  return R.mapObjIndexed((formula, propName) => {
    const updater = getUpdater(formula);

    if ( propName === 'on' ) {
      return {
        ...updater,
        refs: [...updater.refs, ...getSegmentIds()],
      };
    }

    return updater;
  }, formulas);
});

export const getCalculatedParams = memoize((params, parentParams) => {
  const calculatedParams = parentParams ? { ...parentParams } : {};

  Object.keys(params).forEach((paramName) => {
    const param = params[paramName];

    if ( 'formula' in param ) {
      const updater = getUpdater( param.formula );
      // we don't check isInvalid after parsing the formula here as no invalid
      // formulas should be stored in the state and reach that point

      try {
        const tmp = (
          updater.fn.apply(
            // we don't want to use the memoized version of buildArgs here,
            // as the content of calculatedParams will change after calculating
            // each param
            null, buildArgs(null, calculatedParams, updater.params)
          )
        );
        if ( Number.isNaN(tmp) ) {
          throw new Error('result is NaN');
        }
        else {
          calculatedParams[paramName] = tmp;
        }
      }
      catch(e) {
        e.message = `Calculating prop '${paramName}' errored: ${e.message}`;
        calculatedParams[paramName] = e;
      }
    }
    else if ( 'value' in param ) {
      // copy properties that don't have any meta as is
      calculatedParams[paramName] = param.value;
    }
  });

  return calculatedParams;
});

// This function is quite expensive but it's memoized based on an isolated part
// of the state, so it's cool.
export const getSolvingOrder = memoize((glyphUpdaters = {}) => {
  const depTree = new DepTree();

  Object.keys(glyphUpdaters).forEach((strPath) => {
    const propUpdater = glyphUpdaters[strPath];
    if ( typeof propUpdater !== 'object' || !('refs' in propUpdater) ) {
      return;
    }

    depTree.add(strPath, glyphUpdaters[strPath].refs);
  });

  return depTree.resolve();
}, { useOneObjArg: true });

export const getOncurveCoordsSolvingOrder = getSolvingOrder;

export const getCalculatedGlyph = memoize((state, parentParams, glyphId) => {
  // TODO: glyphs should be able to have local parameters
  // const params = getCalculatedParams(state, parentParams, glyphId);
  const glyphUpdaters = getUpdaters(state.nodes, state.formulas[glyphId]);
  const solvingOrder = getSolvingOrder(glyphUpdaters);
  const calculatedGlyph = R.map((node) => {
    // copy static properties of the node as is
    const staticNode = {};
    Object.keys(node).forEach((propName) => {
      const propType = typeof node[propName];
      if (
        // TODO: remove _ghost from here once it's removed from the state
        propName === '_ghost' ||
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
      const tmp = (
        glyphUpdaters[strPath].fn.apply(
          calculatedGlyph[path[0]],
          buildArgsMemoized(calculatedGlyph, parentParams, glyphUpdaters[strPath].params)
        )
      );
      if ( Number.isNaN(tmp) ) {
        throw new Error('result is NaN');
      }
      else {
        calculatedGlyph[path[0]][path[1]] = tmp;
      }
    }
    catch(e) {
      e.message = `Calculating prop '${path[1]}' of node '${path[0]}' errored: ${e.message}`;
      calculatedGlyph[path[0]][path[1]] = e;
    }

  });

  return calculatedGlyph;
});
