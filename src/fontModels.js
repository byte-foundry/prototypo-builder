const config = require('config');

// describe the model of the font tree in Prototypo
const treeModel = {
  root: {
    font: {
      glyph: {
        guideline: { point: {} },
        anchor: {},
        contour: {
          path: {
            oncurve: {},
            offcurve: {}
          }
        },
        group: {
          group: {},
          contour: {}
        },
        component: {}
      }
    }
  }
};

function populateFlatModelRecurs( flatModel, node, parentType ) {
  if ( parentType && !(parentType in flatModel) ) {
    flatModel[parentType] = {};
  }

  Object.keys( node ).forEach(( childType ) => {
    if ( parentType ) {
      flatModel[parentType][childType] = true;
    }

    populateFlatModelRecurs( flatModel, node[childType], childType );
  });

  return flatModel;
}

const flatModel = populateFlatModelRecurs( {}, treeModel );

// validating any ADD_ action against the model is useful during development
// and tests, but a waist of ressources in production.
const validateAdd = config.appEnv === 'dev' ?
  function() {} :
  // the 3rd argument is only used to make the function stateless during tests
  function(actionType, parentType, model = flatModel) {
    const suffix = actionType.split('_').pop().toLowerCase();

    if ( !(suffix in model[parentType]) ) {
      throw new Error(`Can't ${actionType} to type ${parentType}.`)
    }

    return true;
  };

export {
  treeModel,
  flatModel,
  populateFlatModelRecurs,
  validateAdd
};
