'use strict';

import React from 'react';

require('styles/text/TextNodeProperty.scss');

class TextNodePropertyComponent extends React.Component {
  render() {
    const { name, value, inputHandler, disabled } = this.props;
    return (
      <li className="text-node__item">
        <span className="text-node__property-name">{name}</span>
        <input value={value} disabled={disabled} onInput={inputHandler} />
      </li>
    );
  }
}

TextNodePropertyComponent.displayName = 'TextNodePropertyComponent';

// Uncomment properties you need
// TextNodePropertyComponent.propTypes = {};
// TextNodePropertyComponent.defaultProps = {};

export default TextNodePropertyComponent;
