'use strict';

import React from 'react';

require('styles/text/NodeProperty.scss');

const typeMap = {
  number: 'number',
  string: 'text',
  boolean: 'checkbox'
}

class NodePropertyComponent extends React.Component {
  render() {
    const { name, value, type, disabled } = this.props;
    const inputType = typeMap[type];
    const checked = type === 'boolean' && value === true;

    return (
      <li className="text-node__item">
        <span className="text-node__property-name">{name}</span>
        <input
          type={inputType}
          name={name}
          value={value}
          disabled={disabled}
          checked={checked} />
      </li>
    );
  }
}

NodePropertyComponent.displayName = 'NodePropertyComponent';

// Uncomment properties you need
// NodePropertyComponent.propTypes = {};
// NodePropertyComponent.defaultProps = {};

export default NodePropertyComponent;
