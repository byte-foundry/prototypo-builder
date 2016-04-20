import fontModel from '_utils/fontModel';

describe('fontModel', () => {
  describe('propertyOrder', () => {
    it('should include all keys of the `properties` prop', (done) => {
      Object.keys(fontModel).forEach((nodeType) => {
        const nodeDesc = fontModel[nodeType];

        expect( Object.keys( nodeDesc.properties ).sort() )
          .to.deep.equal( nodeDesc.propertyOrder.sort() );
      });

      done();
    });
  });

});
