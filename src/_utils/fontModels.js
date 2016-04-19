// describe the model of the font tree in Prototypo
export const treeModel = {
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

export function populateFlatModelRecurs( flatModel, node, parentType ) {
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

export const flatModel = populateFlatModelRecurs( {}, treeModel );
