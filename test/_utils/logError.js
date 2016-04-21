import logError from '_utils/logError';

describe('logError', () => {
  it('should pass errors to the provided logger function', (done) => {
    let nbErrors = 0;
    const logger = function(error) {
      nbErrors++;
      expect(error).to.be.an('error');
    }

    logError(new Error(), logger);
    logError(true, logger);

    expect(nbErrors).to.equal(1);

    done();
  });
});
