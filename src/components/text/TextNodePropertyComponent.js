'use strict';

import React from 'react';

require('styles/text/TextNodeProperty.scss');

const typeMap = {
  number: 'number',
  string: 'text',
  boolean: 'checkbox'
}

class TextNodePropertyComponent extends React.Component {
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

TextNodePropertyComponent.displayName = 'TextNodePropertyComponent';

// Uncomment properties you need
// TextNodePropertyComponent.propTypes = {};
// TextNodePropertyComponent.defaultProps = {};

export default TextNodePropertyComponent;
