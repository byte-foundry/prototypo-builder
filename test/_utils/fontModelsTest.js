import {
  populateFlatModelRecurs,
  validateAdd
} from '../../src/_utils/fontModels';

describe('fontModels', () => {
  describe('populateFlatModelRecurs', () => {
    it('should walk the tree recursively to build the flatModel', (done) => {
      const treeModel = {
        root: { font: { glyph: { contour: {}, group: {} } } }
      };
      const expectedFlatModel = {
        root: { font: true },
        font: { glyph: true },
        glyph: { contour: true, group: true },
        contour: {},
        group: {}
      };

      expect( populateFlatModelRecurs( {}, treeModel ) )
        .to.deep.equal( expectedFlatModel );

      done();
    });

    it('should support types present more than once in the tree', (done) => {
      const treeModel = {
        group: {
          group: {},
          contour: {}
        },
        contour: { glyph: {} }
      };
      const expectedFlatModel = {
        group: { group: true, contour: true },
        contour: { glyph: true },
        glyph: {}
      };

      expect( populateFlatModelRecurs( {}, treeModel ) )
        .to.deep.equal( expectedFlatModel );

      done();
    });
  });
});
