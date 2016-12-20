import * as Utils from '~/_utils';

describe('Utils', () => {
  describe('lerpValues', () => {
    it('should interpolate between two values', (done) => {
      expect( Utils.lerpValues(0.2, 1.2, 0.5) ).toEqual( 0.7 );

      done();
    });
  });

  describe('getCurveOutline', () => {
    it('should ...', (done) => {
      expect(false).toEqual(true);

      done();
    });
  });

  describe('getCurvePoints', () => {
    it('should ...', (done) => {
      expect(false).toEqual(true);

      done();
    });
  });
});
