import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {
  getUpdater,
  getCalculatedParams,
} from '~/_utils/parametric';

import {
  renderTextChild,
  validateChildTypes,
  mapDispatchToProps,
} from './_utils';

import Foldable from './Foldable';

require('styles/text/TextProplist.scss');

import Formula from './Formula';

class TextFont extends PureComponent {
  constructor(props) {
    super(props);
    this.renderTextChild = renderTextChild.bind(this);
    this.renderTextParams = this.renderTextParams.bind(this);
    this.renderParamSlider = this.renderParamSlider.bind(this);
    this.renderParamFormula = this.renderParamFormula.bind(this);
    this.handleAddParamClick = this.handleAddParamClick.bind(this);
    this.handleAddFormulaClick = this.handleAddFormulaClick.bind(this);
    this.handleParamChange = this.handleParamChange.bind(this);
    this.handleDeleteParamClick = this.handleDeleteParamClick.bind(this);
    this.handleFormulaChange = this.handleFormulaChange.bind(this);
    this.handleFormulaUpdate = this.handleFormulaUpdate.bind(this);
  }

  handleAddParamClick(e) {
    e.preventDefault();

    const { id, actions } = this.props;
    const { addParam } = actions;

    addParam(id, this.refs.paramName.value, {
      value: +this.refs.paramValue.value,
      min: +this.refs.paramMin.value,
      max: +this.refs.paramMax.value,
    });

    this.refs.paramName.value = '$';
    ['paramMin', 'paramMax', 'paramValue'].forEach((refName) => {
      this.refs[refName].value = '';
    });
  }

  handleFormulaChange() {
    const { formulaValue } = this.refs;
    const updater = getUpdater(formulaValue.value);

    formulaValue.className = updater.isInvalid ?
      'text-node__param-formula--invalid':
      '';
  }

  handleAddFormulaClick(e) {
    e.preventDefault();

    const { id, actions } = this.props;
    const { addParam } = actions;
    const updater = getUpdater( this.refs.formulaValue.value );

    if ( updater.isInvalid ) {
      return;
    }

    addParam(id, this.refs.formulaName.value, {
      formula: this.refs.formulaValue.value,
    });

    this.refs.formulaName.value = '$';
    this.refs.formulaValue.value = '';
  }

  handleFormulaUpdate(name, value) {
    const { id, actions } = this.props;
    const { updateParam } = actions;

    return updateParam(id, name, { formula: value });
  }

  handleParamChange(e) {
    e.preventDefault();

    const { id, actions } = this.props;
    const { updateParam } = actions;

    updateParam(id, e.target.name, { value: +e.target.value });
  }

  handleDeleteParamClick(e) {
    e.preventDefault();

    const { id, actions } = this.props;
    const { deleteParam } = actions;

    deleteParam(id, e.target.name);
  }

  renderParamSlider(name) {
    const { params } = this.props;
    const { value, min, max } = params[name];
    const step = Math.abs(max - min) / 100;

    return (
      <label>
        {name}:
        <input
          type="range"
          value={value}
          name={name}
          min={min} max={max} step={step}
          onChange={this.handleParamChange} />
        <input
          type="number"
          value={value}
          name={name}
          onChange={this.handleParamChange} />
      </label>
    );
  }

  renderParamFormula(name) {
    const { params, calculatedParams } = this.props;
    const result = calculatedParams[name];

    return (
      <span>
        {name}:
        <Formula
          name={name}
          value={params[name].formula}
          handleFormulaUpdate={this.handleFormulaUpdate} />
        &nbsp;→{
          typeof result === 'number' && result % 1 !== 0 ?
            result.toFixed(2) : result
        }
      </span>
    );
  }

  renderTextParams() {
    const { _isPropsUnfolded, params } = this.props;
    const listClass = classNames({
      'unstyled': true,
      'text-proplist': true,
      'text-proplist--unfolded': _isPropsUnfolded,
    });

    return (
      <ul className={listClass}>
        {Object.keys(params).map((name) => {
          return (
            <li key={name}>
              {this[(
                'formula' in params[name] ?
                  'renderParamFormula' :
                  'renderParamSlider'
              )](name)}
              <input type="button" defaultValue="✕" name={name} onClick={this.handleDeleteParamClick} />
            </li>
          );
        })}
        <li>
          <input type="text"   ref="paramName" placeholder="name" defaultValue="$" />
          <input type="number" ref="paramMin" placeholder="min" />
          <input type="number" ref="paramMax" placeholder="max" />
          <input type="number" ref="paramValue" placeholder="initial value" />
          <input type="button" defaultValue="Add param" onClick={this.handleAddParamClick} />
        </li>
        <li>
          <input type="text" ref="formulaName" placeholder="name" defaultValue="$" />
          <input type="text" ref="formulaValue" placeholder="formula" onChange={this.handleFormulaChange} />
          <input type="button" defaultValue="Add formula" onClick={this.handleAddFormulaClick} />
        </li>
      </ul>
    );
  }

  render() {
    const { id, childIds } = this.props;

    return (
      <ul className="unstyled">
        <li>
          <Foldable id={id} name="parameters" switchProp="_isPropsUnfolded">
            {this.renderTextParams()}
          </Foldable>
        </li>
        <li>
          <ul className="unstyled">
            {childIds.map(this.renderTextChild)}
          </ul>
        </li>
      </ul>
    );
  }
}

TextFont.propTypes = {
  actions: PropTypes.object.isRequired,
  childTypes: validateChildTypes,
}

function mapStateToProps(state, ownProps) {
  return {
    ...state.nodes[ownProps.id],
    calculatedParams: getCalculatedParams(state.nodes[ownProps.id].params),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TextFont);
