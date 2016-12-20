import fontModel from '../../src/_utils/FontModel';

describe('fontModel', () => {
  describe('propertyOrder', () => {
    it('should include all keys of the `properties` prop', (done) => {
      Object.keys(fontModel).forEach((nodeType) => {
        const nodeDesc = fontModel[nodeType];
        const publicProps = (
          Object.keys( nodeDesc.properties )
            // properties whose name is prefixed with '_' are ignored
            .filter((propName) => {
              return !/^_/.test(propName);
            })
            .sort()
        );

        expect( publicProps ).toEqual( nodeDesc.propertyOrder.sort() );
      });

      done();
    });
  });

});
