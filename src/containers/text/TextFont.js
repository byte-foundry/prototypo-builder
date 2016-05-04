import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {
  renderTextChild,
  validateChildTypes,
  mapStateToProps,
  mapDispatchToProps
} from './_utils';

import Foldable from './Foldable';

require('styles/text/TextProplist.scss');

class TextFont extends Component {
  constructor(props) {
    super(props);
    this.renderTextChild = renderTextChild.bind(this);
    this.renderTextParams = this.renderTextParams.bind(this);
    this.handleAddParamClick = this.handleAddParamClick.bind(this);
    this.handleParamChange = this.handleParamChange.bind(this);
  }

  handleAddParamClick(e) {
    e.preventDefault();

    const { id } = this.props;
    const { addParam } = this.props.actions;

    addParam(id, this.refs.name.value, {
      min: +this.refs.min.value,
      max: +this.refs.max.value,
      value: +this.refs.value.value
    });

    ['name', 'min', 'max', 'value'].forEach((refName) => {
      this.refs[refName].value = '';
    });
  }

  handleParamChange(e) {
    e.preventDefault();

    const { id } = this.props;
    const { updateParam } = this.props.actions;

    updateParam(id, e.target.name, +e.target.value);
  }

  renderTextParams() {
    const { _isPropsUnfolded, params, paramsMeta } = this.props;
    const listClass = classNames({
      'unstyled': true,
      'text-proplist': true,
      'text-proplist--unfolded': _isPropsUnfolded
    });

    return (
      <ul className={listClass}>
        {paramsMeta._order.map((name) => {
          const value = params[name];
          const { min, max } = paramsMeta[name];

          return (
            <li key={name}>
              <label>
                {name}:
                <input type="range" value={value} name={name} min={min} max={max} onChange={this.handleParamChange} />
                <input type="number" value={value} name={name} onChange={this.handleParamChange} />
              </label>
            </li>
          );
        })}
        <li>
          <input type="text"   ref="name" placeholder="name" />
          <input type="number" ref="min" placeholder="min" />
          <input type="number" ref="max" placeholder="max" />
          <input type="number" ref="value" placeholder="initial value" />
          <input type="button" defaultValue="Add param" onClick={this.handleAddParamClick} />
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

export default connect(mapStateToProps, mapDispatchToProps)(TextFont);
