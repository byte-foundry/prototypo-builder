import * as TwoD from '../../src/_utils/2D';

describe('TwoD', () => {
  describe('lineLineAngle', () => {
    it('should calculate the angle between two lines', (done) => {
      const result = TwoD.lineLineAngle(
        {x: 0, y: 0},
        {x: 100, y: 100},
        {x: 80, y: 120},
        {x: 120, y: 80},
      );

      expect(result).toEqual(Math.PI / 2);

      done();
    });
  });

  describe('rayRayIntersection', () => {
    it('should find the intersection of two rays', (done) => {
      const result = TwoD.rayRayIntersection(
        {x: 0, y: 0},
        Math.PI / 4,
        {x: 80, y: 120},
        -Math.PI / 4,
      );

      expect(result.x).toBeCloseTo(100);
      expect(result.y).toBeCloseTo(100);

      done();
    });
  });

  describe('rotate', () => {
    it('should return a new vector rotated by the provided angle', (done) => {
      let {x, y} = TwoD.rotate({ x:10, y:100 }, Math.PI / 2);

      expect(y).toBeCloseTo(10, 0.0000001);
      expect(x).toEqual(-100);
      done();
    });
  });

  describe('rotateDeg', () => {
    it('should return a new vector rotated by the provided angle', (done) => {
      let {x, y} = TwoD.rotateDeg({ x:10, y:100 }, 90);

      expect(y).toBeCloseTo(10, 0.0000001);
      expect(x).toEqual(-100);
      done();
    });
  });

  describe('rotateAround', () => {
    it('should return a new vector rotated by <angle>, around <center>', (done) => {
      let {x, y} = TwoD.rotateAround({ x:0, y:0 }, -Math.PI / 2, {x: 50, y: 50});

      expect(y).toBeCloseTo(100, 0.0000001);
      expect(x).toBeCloseTo(0);
      done();
    });
  });

  describe('rotateAroundDeg', () => {
    it('should return a new vector rotated by <angle>, around <center>', (done) => {
      let {x, y} = TwoD.rotateAroundDeg({ x:0, y:0 }, -90, {x: 50, y: 50});

      expect(y).toBeCloseTo(100, 0.0000001);
      expect(x).toBeCloseTo(0);
      done();
    });
  });
});
