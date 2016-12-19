import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import NodeProperties from './NodeProperties';

import * as Graph from '~/_utils/Graph';

import {
  renderTextChild,
  validateChildTypes,
  mapStateToProps,
  mapDispatchToProps,
} from './_utils';

require('styles/text/TextRoot.scss');

class TextRoot extends PureComponent {
  constructor(props) {
    super(props);
    this.renderTextChild = renderTextChild.bind(this);
  }

  render() {
    const { childIds } = this.props;
    let nodeSelected = false;
    if (this.props.ui.selected.nodeOptions) {
      const id = this.props.ui.selected.nodeOptions;
      const type = Graph.getNodeType(id);
      nodeSelected = (
        <div className="unstyled">
          <p>{id}</p>
          <NodeProperties id={id} type={type} />
        </div>
      );
    }

    return (
      <div className="textRoot">
        <div className="nodeList">
          <ul className="unstyled">
            {childIds.map(this.renderTextChild)}
          </ul>
        </div>
        <div className="inspector">
          {nodeSelected}
        </div>
      </div>
    );
  }
}

TextRoot.propTypes = {
  actions: PropTypes.object.isRequired,
  childTypes: validateChildTypes,
};

export default connect(mapStateToProps, mapDispatchToProps)(TextRoot);
