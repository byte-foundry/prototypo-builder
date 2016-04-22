import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import fontModel from './../../_utils/fontModel';

import {
  mapStateToProps,
  mapDispatchToProps
} from './_utils';

import NodeProperty from 'components/text/NodePropertyComponent';

class NodeProperties extends Component {
  constructor(props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleUpdate(e) {
    const { updateProp } = this.props.actions;
    const { id, type } = this.props;
    const { name } = e.target;
    const propType = fontModel[type].properties[name];
    let value;

    // This handler is used for both 'input' and 'change event' but we
    // want to filter out 'change' events for anything but boolean properties
    if ( e.type === 'change' && propType !== 'boolean' ) {
      return;
    }

    switch( propType ) {
      case 'number':
        value = +e.target.value;
        break;
      case 'boolean':
        value = e.target.checked;
        break;
      default:
        value = e.target.value;
    }

    updateProp(id, name, value);
  }

  render() {
    const { type } = this.props;
    const { propertyOrder, properties } = fontModel[type];

    return (
      <ul className="text-node__property-list unstyled"
        onInput={this.handleUpdate}
        onChange={this.handleUpdate}
      >
        { propertyOrder.map((propName) => {
          const value = this.props[propName];
          const propType = properties[propName];

          return (
            <NodeProperty
              key={propName}
              name={propName}
              value={value}
              type={propType}
            />
          );
        }) }
      </ul>
    );
  }
}

NodeProperties.propTypes = {
  actions: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(NodeProperties);
