import createNode from 'actions/nodes/createNode';

describe('action: createNode', () => {
  let firstAction;
  let secondAction;

  beforeEach(() => {
    // make sure tests are stateless by reseting the node id increment;
    createNode.nextId = 0;
  });

  before(() => {
    firstAction = createNode();
    secondAction = createNode();
  });

  it('should return an action and add a unique nodeId to the parameter', () => {
    expect(firstAction.type).to.equal('CREATE_NODE');
    expect(firstAction.nodeId).to.equal('node-0');
    expect(secondAction.nodeId).to.equal('node-1');
  });
});
