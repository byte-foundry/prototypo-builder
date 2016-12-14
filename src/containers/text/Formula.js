import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';

import * as Parametric from '~/_utils/Parametric';

import {
  mapDispatchToProps,
} from './_utils';

require('styles/text/NodeProperty.scss');

class Formula extends PureComponent {
  constructor(props) {
    super(props);

    this.handleFormulaClick = this.handleFormulaClick.bind(this);
    this.handleFormulaChange = this.handleFormulaChange.bind(this);
    this.handleFormulaKeyDown = this.handleFormulaKeyDown.bind(this);
    this.handleFormulaFocusout = this.handleFormulaFocusout.bind(this);
  }

  handleFormulaClick() {
    const { formulaInput } = this.refs;

    formulaInput.disabled = false;
    formulaInput.focus();
  }

  handleFormulaChange() {
    const { name, actions } = this.props;
    const { updateTmpFormula } = actions;
    const { formulaInput } = this.refs;
    const updater = Parametric.getUpdater(formulaInput.value.trim());

    formulaInput.className = updater.isInvalid ?
      'text-node__property-formula--invalid':
      '';

    return updateTmpFormula(name, formulaInput.value);
  }

  handleFormulaKeyDown(e) {
    const { name, handleFormulaUpdate, actions } = this.props;
    const { deleteTmpFormula } = actions;
    const { formulaInput } = this.refs;

    // <Enter>
    if ( e.keyCode === 13 ) {
      const updater = Parametric.getUpdater(formulaInput.value);

      if ( !updater.isInvalid ) {
        handleFormulaUpdate(name, formulaInput.value.trim());
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
    const { name, value, tmpFormula } = this.props;
    const formula = tmpFormula && tmpFormula.name === name ?
      tmpFormula.value:
      value;

    return (
      <span className="text-formula"
        onClick={this.handleFormulaClick} >
        &nbsp;⨍<input ref="formulaInput"
          type="text"
          value={formula || ''}
          disabled={true}
          onChange={this.handleFormulaChange}
          onKeyDown={this.handleFormulaKeyDown}
          onBlur={this.handleFormulaFocusout} />
      </span>
    );
  }
}

Formula.propTypes = {
  actions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    tmpFormula: state.ui.tmpFormula,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Formula);
