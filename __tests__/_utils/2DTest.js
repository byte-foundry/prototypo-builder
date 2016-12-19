import * as TwoD from '../../src/_utils/2D';

describe('2D/TwoD', () => {
  describe('rotateDeg', () => {
    it('should return a new vector rotated by the provided angle', (done) => {
      let {x, y} = TwoD.rotateDeg({ x:10, y:100 }, 90);
      expect(y).toBeCloseTo(10, 0.0000001);
      expect(x).toEqual(-100);
      done();
    });
  });
});
