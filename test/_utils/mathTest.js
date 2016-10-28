import { lerp, rotateVector } from '../../src/_utils/math';

describe('math', () => {
  describe('lerp', () => {
    it('should return the interpolated value at t', (done) => {
      expect(lerp(0, 1, 0.5)).to.equal(0.5);
      done();
    });
  });
  describe('rotateVector', () => {
    it('should return a new vector rotated by the provided angle', (done) => {
      let {x, y} = rotateVector(10, 100, 90);
      expect(y).to.be.closeTo(10, 0.0000001);
      expect(x).to.be.equal(-100);
      done();
    });
  });
});
