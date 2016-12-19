/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/

/*eslint import/no-unresolved: 0*/
import config from 'config';

describe('appEnvConfigTests', () => {
  it('should load app config file depending on current --env', () => {
    expect(config.appEnv).toEqual('test');
  });
});
