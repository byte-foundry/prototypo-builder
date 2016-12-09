import logError from '../../src/_utils/logError';

describe('logError', () => {
  it('should pass errors to the provided logger function', (done) => {
    let nbErrors = 0;
    const logger = function(error) {
      nbErrors++;
      expect(error).toBeInstanceOf(Error);
    }

    logError(new Error(), logger);
    logError(true, logger);

    expect(nbErrors).toEqual(1);

    done();
  });
});
