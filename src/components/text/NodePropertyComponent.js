'use strict';

import React from 'react';
import classNames from 'classnames';

require('styles/text/NodeProperty.scss');

const typeMap = {
  number: 'text',
  string: 'text',
  boolean: 'checkbox'
}

class NodePropertyComponent extends React.Component {
  constructor(props) {
    super(props);

    this.handleFormulaChange = this.handleFormulaChange.bind(this);
    this.handleFormulaKeydown = this.handleFormulaKeydown.bind(this);
    this.handleClearClick = this.handleClearClick.bind(this);
  }

  handleFormulaChange(e) {

  }

  handleFormulaKeydown(e) {

  }

  handleClearClick(e) {
    
  }

  render() {
    const { name, type, value, formula, result } = this.props;
    const inputType = typeMap[type];
    const checked = type === 'boolean' && value === true;
    const formulaClass = classNames({
      'text-node__property-formula': true,
      'text-node__property-formula--invalid': isInvalid === true
    });

    const displayValue = typeof value === 'number' ? value.toFixed(2) : value;

    return (
      <div className="text-node__item">
        <span className="text-node__property-name">{name}</span>
        <input
          className={formulaClass}
          type={inputType}
          name={name}
          value={formula}
          disabled={disabled}
          checked={checked} />
        {type !== 'boolean' && (
          <input
            className="text-node__property-value"
            value={displayValue}
            readOnly
            disabled />
        )}
      </div>
    );
  }
}

NodePropertyComponent.displayName = 'NodePropertyComponent';

export default NodePropertyComponent;
