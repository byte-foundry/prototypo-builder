import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {
  getUpdater,
  getCalculatedParams
} from '~/containers/_utils';

import {
  renderTextChild,
  validateChildTypes,
  mapDispatchToProps
} from './_utils';

import Foldable from './Foldable';

require('styles/text/TextProplist.scss');

import NodeProperty from '~/components/text/NodePropertyComponent';

class TextFont extends Component {
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
  }

  handleAddParamClick(e) {
    e.preventDefault();

    const { id } = this.props.node;
    const { addParam } = this.props.actions;

    addParam(id, this.refs.paramName.value, {
      value: +this.refs.paramValue.value,
      min: +this.refs.paramMin.value,
      max: +this.refs.paramMax.value
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

    const { id } = this.props.node;
    const { addParam } = this.props.actions;
    const updater = getUpdater( this.refs.formulaValue.value );

    if ( updater.isInvalid ) {
      return;
    }

    addParam(id, this.refs.formulaName.value, {
      formula: this.refs.formulaValue.value
    });

    this.refs.formulaName.value = '$';
    this.refs.formulaValue.value = '';
  }

  handleParamChange(e) {
    e.preventDefault();

    const { id } = this.props.node;
    const { updateParam } = this.props.actions;

    updateParam(id, e.target.name, { value: +e.target.value });
  }

  handleDeleteParamClick(e) {
    e.preventDefault();

    const { id } = this.props.node;
    const { deleteParam } = this.props.actions;

    deleteParam(id, e.target.name);
  }

  renderParamSlider(name) {
    const { params } = this.props.node;
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
    const { node, calculatedParams, tmpFormula, actions } = this.props;
    const { updateParam, updateTmpFormula, deleteTmpFormula } = actions;
    const { id, params } = node;
    // if the formula is currently being edited, use value from state.ui.tmpFormula
    const propPath = `${id}.${name}`;
    const formula = tmpFormula && tmpFormula.propPath === propPath ?
      tmpFormula.formula:
      params[name].formula;

    return (
      <NodeProperty
        id={id}
        name={name}
        formula={formula}
        result={calculatedParams[name]}
        actions={{
          updateTmpFormula,
          deleteTmpFormula,
          updateFormulaAlt: (id, name, value) => {
            updateParam(id, name, { formula: value })
          }
        }}
      />
    );
  }

  renderTextParams() {
    const { _isPropsUnfolded, params } = this.props.node;
    const listClass = classNames({
      'unstyled': true,
      'text-proplist': true,
      'text-proplist--unfolded': _isPropsUnfolded
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
    const { id, childIds } = this.props.node;

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
  childTypes: validateChildTypes
}

function mapStateToProps(state, ownProps) {
  return {
    node: state.nodes[ownProps.id],
    calculatedParams: getCalculatedParams(state.nodes[ownProps.id].params),
    tmpFormula: state.ui.tmpFormula
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TextFont);
