import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import R from 'ramda';

import fontModel from './../../_utils/fontModel';

import { getCalculatedNode } from './../_utils';

import {
  mapDispatchToProps
} from './_utils';

import NodeProperty from 'components/text/NodePropertyComponent';

class NodeProperties extends Component {
  constructor(props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleUpdate(e) {
    const { updateProp, updatePropMeta } = this.props.actions;
    const { id, type } = this.props;
    const { name } = e.target;
    const propType = fontModel[type].properties[name];

    // This handler is used for both 'input' and 'change event' but we
    // want to filter out 'change' events for anything but boolean properties
    if ( e.type === 'change' && propType !== 'boolean' ) {
      return;
    }

    if ( propType === 'boolean' ) {
      return updateProp(id, name, e.target.checked);
    }

    let { value } = e.target;
    let updater;
    let usedParams = e.target.value.match(/(\$[a-z]+)/ig);
    try {
      updater = new Function( ...usedParams, 'return ' + value );
    } catch(e) {
      return updatePropMeta(id, name, {
        formula: value,
        isInvalid: true
      });
    }

    return updatePropMeta(id, name, {
      formula: value,
      params: usedParams,
      updater: R.memoize(updater),
      isInvalid: false
    });
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
          const { formula, isInvalid } = ( this.props[propName + 'Meta'] || {} );
          const propType = properties[propName];

          return (
            <NodeProperty
              key={propName}
              name={propName}
              value={value}
              formula={formula}
              type={propType}
              isInvalid={isInvalid}
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

function mapStateToProps(state, props) {
  return getCalculatedNode(state.nodes[props.id], state.nodes['font-initial'].params);
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeProperties);
