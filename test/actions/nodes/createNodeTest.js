import createNode from 'actions/nodes/createNode';

describe('action: createNode', () => {
  let firstAction;
  let secondAction;

  beforeEach(() => {
    // make sure tests are stateless by reseting the node id increment;
    createNode.nextId = 0;
  });

  it('should return an action and add a unique nodeId to the parameter', () => {
    firstAction = createNode();
    secondAction = createNode();

    expect(firstAction.type).to.equal('CREATE_NODE');
    expect(firstAction.nodeId).to.equal('node-0');
    expect(secondAction.nodeId).to.equal('node-1');
  });

  it('should return an action and use the provided nodeType arg as a prefix for the id', () => {
    firstAction = createNode({ nodeType: 'root' });
    secondAction = createNode({ nodeType: 'glyph' });

    expect(firstAction.nodeId).to.equal('root-0');
    expect(secondAction.nodeId).to.equal('glyph-1');
  });
});
