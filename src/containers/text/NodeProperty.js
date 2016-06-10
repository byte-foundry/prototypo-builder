import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {
  getUpdater
} from '~/containers/_utils';

import {
  mapDispatchToProps
} from './_utils';

const typeMap = {
  number: 'text',
  boolean: 'checkbox'
}

require('styles/text/NodeProperty.scss');

class NodeProperty extends Component {
  constructor(props) {
    super(props);

    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleFormulaClick = this.handleFormulaClick.bind(this);
    this.handleFormulaChange = this.handleFormulaChange.bind(this);
    this.handleFormulaKeyDown = this.handleFormulaKeyDown.bind(this);
    this.handleFormulaFocusout = this.handleFormulaFocusout.bind(this);
  }

  handleValueChange(e) {
    const { updateProp } = this.props.actions;
    const { id, type } = this.props;
    const { name } = e.target;

    if ( e.type === 'change' && type === 'boolean' ) {
      return updateProp(id, name, e.target.checked);
    }

    return updateProp(id, name, +e.target.value);
  }

  handleFormulaClick(e) {
    const input = e.target.nodeName === 'INPUT' ?
      e.target:
      e.target.firstElementChild;

    input.disabled = false;
    input.focus();
  }

  handleFormulaChange(e) {
    const updater = getUpdater(e.target.value);

    e.target.className = updater.isInvalid ?
      'text-node__property-formula--invalid':
      '';
  }

  handleFormulaKeyDown(e) {
    const { glyphId, id, name } = this.props;
    const { updateFormula } = this.props.actions;

    // <Enter>
    if ( e.keyCode === 13 ) {
      const updater = getUpdater(e.target.value);

      if ( !updater.isInvalid ) {
        updateFormula(glyphId, id + '.' + name, e.target.value.trim());
        e.target.disabled = true;
      }
    }

    // <Escape>
    if ( e.keyCode === 27 ) {
      e.target.value = this.props.formula;
      e.target.disabled = true;
    }
  }

  handleFormulaFocusout(e) {
    e.target.value = this.props.formula;
    e.target.disabled = true;
  }

  render() {
    const { id, name, type, value, formula, result } = this.props;
    const inputType = typeMap[type] || 'text';

    return (
      <div key={name} className="text-node__item">
        <span className="text-node__property-name">{name}</span>
        <input className={'text-node__property-value--' + inputType}
          type={inputType}
          name={name}
          value={value}
          checked={type === 'boolean' && value === true}
          onChange={this.handleValueChange} />
        <span className="text-node__property-formula"
          onClick={this.handleFormulaClick} >
          &nbsp;⨍<input
            type="text"
            name={id + '.' + name}
            defaultValue={formula || ''}
            disabled={true}
            onChange={this.handleFormulaChange}
            onKeyDown={this.handleFormulaKeyDown}
            onFocusout={this.handleFormulaFocusout} />
        </span>
        <span className={'text-node__property-result--' + inputType}>
          &nbsp;→{
            type === 'boolean' ?
              ( result ? 'true' : 'false' ):
              ( typeof result === 'number' ? result.toFixed(2) : result )
          }
        </span>
      </div>
    );
  }
}

NodeProperty.propTypes = {
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  const { glyphId } = ownProps;

  return {
    value: state.nodes[ownProps.id][ownProps.name],
    formula: glyphId in state.formulas &&
      state.formulas[glyphId][ownProps.id + '.' + ownProps.name]
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeProperty);
