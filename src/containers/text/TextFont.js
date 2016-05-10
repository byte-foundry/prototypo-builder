import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {
  parseFormula,
  getCalculatedParams
} from './../_utils';

import {
  renderTextChild,
  validateChildTypes,
  mapDispatchToProps
} from './_utils';

import Foldable from './Foldable';

require('styles/text/TextProplist.scss');

import NodeProperty from 'components/text/NodePropertyComponent';

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

    const { id } = this.props;
    const { addParam } = this.props.actions;

    addParam(id, this.refs.paramName.value, +this.refs.paramValue.value, {
      min: +this.refs.paramMin.value,
      max: +this.refs.paramMax.value
    });

    this.refs.paramName.value = '$';
    ['paramMin', 'paramMax', 'paramValue'].forEach((refName) => {
      this.refs[refName].value = '';
    });
  }

  handleAddFormulaClick(e) {
    e.preventDefault();

    const { id } = this.props;
    const { addParam } = this.props.actions;
    const formula = parseFormula( this.refs.formulaValue.value );

    if ( !formula.updater ) {
      return this.refs.formulaValue.pattern = '^$';
    }

    this.refs.formulaValue.pattern = null;
    // TODO: this 0 value by default is wrong. Ideally we should try to run the
    // updater once. That would allow detecting problematic formulas at the same
    // time
    addParam(id, this.refs.formulaName.value, 0, formula);

    this.refs.formulaName.value = '$';
    this.refs.formulaValue.value = '';
  }

  handleParamChange(e) {
    e.preventDefault();

    const { id } = this.props;
    const { updateParam } = this.props.actions;

    updateParam(id, e.target.name, +e.target.value);
  }

  handleDeleteParamClick(e) {
    e.preventDefault();

    const { id } = this.props;
    const { deleteParam } = this.props.actions;

    deleteParam(id, e.target.name);
  }

  handleFormulaChange(e) {
    e.preventDefault();

    const { id, paramsMeta } = this.props;
    const { updateParamMeta } = this.props.actions;
    const { name } = e.target;

    if ( !(name in paramsMeta) || !('formula' in paramsMeta[name]) ) {
      return;
    }

    updateParamMeta(id, name, parseFormula(e.target.value));
  }

  renderParamSlider(name) {
    const { params, paramsMeta } = this.props;
    const value = params[name];
    const { min, max } = paramsMeta[name];
    const step = Math.abs(max - min) / 100;

    return (
      <label>
        {name}:
        <input type="range" value={value} name={name} min={min} max={max} step={step} onChange={this.handleParamChange} />
        <input type="number" value={value} name={name} onChange={this.handleParamChange} />
      </label>
    );
  }

  renderParamFormula(name) {
    const { params, paramsMeta } = this.props;
    const value = params[name];
    const { formula, isInvalid } = paramsMeta[name];

    return (
      <NodeProperty
        name={name}
        value={value}
        formula={formula}
        isInvalid={isInvalid}
      />
    );
  }

  renderTextParams() {
    const { _isPropsUnfolded, paramsMeta } = this.props;
    const listClass = classNames({
      'unstyled': true,
      'text-proplist': true,
      'text-proplist--unfolded': _isPropsUnfolded
    });

    return (
      <ul className={listClass} onChange={this.handleFormulaChange}>
        {paramsMeta._order.map((name) => {
          return (
            <li key={name}>
              {this[(
                'formula' in paramsMeta[name] ?
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
          <input type="text" ref="formulaValue" placeholder="formula" />
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
  childTypes: validateChildTypes
}

function mapStateToProps(state, props) {
  return {
    ...state.nodes[props.id],
    params: getCalculatedParams(state, null, 'font_initial')
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TextFont);
