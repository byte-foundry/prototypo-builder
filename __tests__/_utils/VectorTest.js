import deepFreeze from 'deep-freeze';
import * as Vector from '~/_utils/Vector';

describe('Vector', () => {
  let a = {x: 12, y: 34};
  let b = {x: 56, y: 78};
  let c = {x: 12, y: 34};

  deepFreeze(a);
  deepFreeze(b);
  deepFreeze(c);

  describe('.add', () => {
    it('should add two vectors', (done) => {
      expect(Vector.add(a, b)).toEqual({x: 68, y: 112});

      done();
    });
  });

  describe('.subtract', () => {
    it('should subtract two vectors', (done) => {
      expect(Vector.subtract(a, b)).toEqual({x: -44, y: -44});

      done();
    });
  });

  describe('.multiply', () => {
    it('should multipy a vector by a factor', (done) => {
      expect(Vector.multiply(a, 3)).toEqual({x: 36, y: 102});

      done();
    });
  });

  describe('.isEqual', () => {
    it('should test if two vector coordinates are equal', (done) => {
      expect(Vector.isEqual(a, c)).toEqual(true);

      done();
    });
  });

  describe('.normalize', () => {
    it('should normalize a vector', (done) => {
      const result = Vector.normalize(a);

      // I never verified if the result of this operation was correct
      // This is more a snapshot than an actual test
      expect(result.x).toBeCloseTo(0.33, 0.01);
      expect(result.y).toBeCloseTo(0.94, 0.01);

      done();
    });
  });

  describe('.dot', () => {
    it('should calculate the dot product of two vectors', (done) => {
      // I never verified if the result of this operation was correct
      // This is more a snapshot than an actual test
      expect(Vector.dot(a, b)).toEqual(3324);

      done();
    });
  });
});
