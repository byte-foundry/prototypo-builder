/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/
'use strict';

// Uncomment the following lines to use the react test utilities
// import TestUtils from 'react-addons-test-utils';
import createComponent from 'helpers/shallowRenderHelper';

import NodePropertyComponent from 'components/text/NodePropertyComponent.js';

describe('NodePropertyComponent', () => {
  let component;

  beforeEach(() => {
    component = createComponent(NodePropertyComponent);
  });

  it('should have its default className formatted as CEM ', () => {
    expect(component.props.className).to.equal('text-node__item');
  });
});
