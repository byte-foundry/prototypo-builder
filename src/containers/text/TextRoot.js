import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import NodeProperties from './NodeProperties';

import getNodeType from '~/_utils/graph';

import {
  renderTextChild,
  validateChildTypes,
  mapStateToProps,
  mapDispatchToProps,
} from './_utils';

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
      const type = getNodeType(id);
      nodeSelected = (
        <div className="unstyled">
          <p>{id}</p>
          <NodeProperties id={id} type={type} />
        </div>
      );
    }

    return (
      <div>
        <ul className="unstyled">
          {childIds.map(this.renderTextChild)}
        </ul>
        <br/>
        {nodeSelected}
      </div>

    );
  }
}

TextRoot.propTypes = {
  actions: PropTypes.object.isRequired,
  childTypes: validateChildTypes,
}

export default connect(mapStateToProps, mapDispatchToProps)(TextRoot);
