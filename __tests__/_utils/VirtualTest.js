import * as Graph from '~/_utils/Graph';
import Virtual from '~/_utils/Virtual';

describe('virtual', () => {
  it('should return a virtual graph and associated action', () => {
    const { state, actions } = Virtual();

    expect( state ).toEqual({ nodes: {} });

    const { nodeId } = actions.createOncurve();

    expect( Object.keys(state.nodes).length ).toEqual( 1 );
    expect( state.nodes[nodeId].type ).toEqual( 'oncurve' );
  });
});
