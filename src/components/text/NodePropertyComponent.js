import React, { PureComponent } from 'react';

import * as Parametric from '~/_utils/Parametric';

const typeMap = {
  number: 'text',
  boolean: 'checkbox',
}

require('styles/text/NodeProperty.scss');

class NodePropertyComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.handleBaseChange = this.handleBaseChange.bind(this);
    this.handleFormulaClick = this.handleFormulaClick.bind(this);
    this.handleFormulaChange = this.handleFormulaChange.bind(this);
    this.handleFormulaKeyDown = this.handleFormulaKeyDown.bind(this);
    this.handleFormulaFocusout = this.handleFormulaFocusout.bind(this);
  }

  handleBaseChange(e) {
    const { baseInput } = this.refs;
    const { updateProp } = this.props.actions;
    const { id, type } = this.props;

    if ( e.type === 'change' && type === 'boolean' ) {
      return updateProp(id, baseInput.name, baseInput.checked);
    }

    return updateProp(id, baseInput.name, +baseInput.value);
  }

  handleFormulaClick() {
    const { formulaInput } = this.refs;

    formulaInput.disabled = false;
    formulaInput.focus();
  }

  handleFormulaChange() {
    const { formulaInput } = this.refs;
    const { updateTmpFormula } = this.props.actions;
    const { id, name } = this.props;
    const updater = Parametric.getUpdater(formulaInput.value.trim());

    updateTmpFormula(`${id}.${name}`, formulaInput.value);

    formulaInput.className = updater.isInvalid ?
      'text-node__property-formula--invalid':
      '';
  }

  handleFormulaKeyDown(e) {
    const { updateFormulaAlt, deleteTmpFormula } = this.props.actions;
    const { id, name } = this.props;
    const { formulaInput } = this.refs;

    // <Enter>
    if ( e.keyCode === 13 ) {
      const updater = Parametric.getUpdater(formulaInput.value);

      if ( !updater.isInvalid ) {
        updateFormulaAlt(id, name, formulaInput.value.trim());
        deleteTmpFormula();
        formulaInput.disabled = true;
      }
    }

    // <Escape>
    if ( e.keyCode === 27 ) {
      deleteTmpFormula();
      formulaInput.disabled = true;
    }
  }

  handleFormulaFocusout() {
    const { formulaInput } = this.refs;
    const { deleteTmpFormula } = this.props.actions;

    deleteTmpFormula();
    formulaInput.disabled = true;
  }

  render() {
    const { id, name, type, value, formula, result } = this.props;
    const inputType = typeMap[type] || 'text';

    return (
      <div key={name} className="text-node__item">
        <span className="text-node__property-name">{name}</span>
        { 'value' in this.props ? (
          <input ref="baseInput"
            className={'text-node__property-value--' + inputType}
            type={inputType}
            name={name}
            value={
              typeof value === 'number' && value % 1 !== 0 ?
                value.toFixed(2) : value
            }
            checked={type === 'boolean' && value === true}
            onChange={this.handleBaseChange} />
          ) : ''
        }
        <span className="text-node__property-formula"
          onClick={this.handleFormulaClick} >
          &nbsp;⨍<input ref="formulaInput"
            type="text"
            name={id + '.' + name}
            value={formula || ''}
            disabled={true}
            onChange={this.handleFormulaChange}
            onKeyDown={this.handleFormulaKeyDown}
            onBlur={this.handleFormulaFocusout} />
        </span>
        <span className={'text-node__property-result--' + inputType}>
          &nbsp;→{
            type === 'boolean' ?
              ( result ? 'true' : 'false' ):
              ( typeof result === 'number' && result % 1 !== 0 ?
                result.toFixed(2) : result )
          }
        </span>
      </div>
    );
  }
}

NodePropertyComponent.displayName = 'NodePropertyComponent';

export default NodePropertyComponent;
