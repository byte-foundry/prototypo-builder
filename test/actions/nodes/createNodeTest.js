import createNode from 'actions/nodes/createNode';
import {getNodeId} from 'actions/_utils';

describe('action: createNode', () => {
  let firstAction;
  let secondAction;

  beforeEach(() => {
    // make sure tests are stateless by reseting the node id increment;
    getNodeId.nextId = 0;
  });

  it('should return an action and add a unique nodeId to the parameter', () => {
    firstAction = createNode();
    secondAction = createNode();

    expect(firstAction.type).to.equal('CREATE_NODE');
    expect(firstAction.nodeId).to.equal('node_0');
    expect(secondAction.nodeId).to.equal('node_1');
  });

  it('should return an action and use the provided nodeType arg as a prefix for the id', () => {
    firstAction = createNode('root');
    secondAction = createNode('glyph');

    expect(firstAction.nodeId).to.equal('root_0');
    expect(secondAction.nodeId).to.equal('glyph_1');
  });
});
