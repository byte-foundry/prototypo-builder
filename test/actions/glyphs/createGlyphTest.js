import createNode from 'actions/nodes/createNode';
import createGlyph from 'actions/glyphs/createGlyph';

describe('action: createGlyph', () => {
  let firstAction;
  let secondAction;

  beforeEach(() => {
    // make sure tests are stateless by reseting the node id increment;
    createNode.nextId = 0;
  });

  before(() => {
    firstAction = createGlyph();
    secondAction = createGlyph();
  });

  it('should return an action and add a unique nodeId to the parameter', () => {
    expect(firstAction.type).to.equal('CREATE_GLYPH');
    expect(firstAction.args.nodeType).to.equal('glyph');
    expect(firstAction.nodeId).to.equal('node-0');
    expect(secondAction.nodeId).to.equal('node-1');
  });
});
