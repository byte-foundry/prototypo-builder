import fontModel from '_utils/fontModel';

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

        expect( publicProps ).to.deep.equal( nodeDesc.propertyOrder.sort() );
      });

      done();
    });
  });

});
