import createNode from 'actions/nodes/createNode';

describe('action: createNode', () => {
  let firstAction;
  let secondAction;

  before(() => {
    firstAction = createNode();
    secondAction = createNode();
  });

  it('should return an action and add a unique nodeId to the parameter', () => {
    expect(firstAction.nodeId).to.equal('node-0');
    expect(secondAction.nodeId).to.equal('node-1');
  });
});
