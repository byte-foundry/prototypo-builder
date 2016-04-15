import createNode from 'actions/nodes/createNode';
import createFont from 'actions/fonts/createFont';

describe('action: createFont', () => {
  let firstAction;
  let secondAction;

  beforeEach(() => {
    // make sure tests are stateless by reseting the node id increment;
    createNode.nextId = 0;
  });

  before(() => {
    firstAction = createFont();
    secondAction = createFont();
  });

  it('should return an action and add a unique nodeId to the parameter', () => {
    expect(firstAction.type).to.equal('CREATE_FONT');
    expect(firstAction.args.nodeType).to.equal('font');
    expect(firstAction.nodeId).to.equal('node-0');
    expect(secondAction.nodeId).to.equal('node-1');
  });
});
