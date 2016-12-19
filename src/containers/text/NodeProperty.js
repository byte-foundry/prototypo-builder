import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';

import * as Parametric from '~/_utils/Parametric';

import {
  mapDispatchToProps,
} from './_utils';

import Formula from './Formula';

const typeMap = {
  number: 'text',
  boolean: 'checkbox',
};

require('styles/text/NodeProperty.scss');

class NodeProperties extends PureComponent {
  constructor(props) {
    super(props);

    this.handleBaseChange = this.handleBaseChange.bind(this);
    this.handleFormulaUpdate = this.handleFormulaUpdate.bind(this);
  }

  handleBaseChange(e) {
    const { baseInput } = this.refs;
    const { nodeId, type, actions } = this.props;
    const { updateProp } = actions;

    if ( e.type === 'change' && type === 'boolean' ) {
      return updateProp(nodeId, baseInput.name, baseInput.checked);
    }

    return updateProp(nodeId, baseInput.name, +baseInput.value);
  }

  handleFormulaUpdate(name, value) {
    const { glyphId, actions } = this.props;
    const { updateFormula } = actions;

    return updateFormula(glyphId, name, value);
  }

  render() {
    const { nodeId, name, type, base, formula, result } = this.props;
    const inputType = typeMap[type] || 'text';

    return (
      <div key={name} className="text-node__item">
        <span className="text-node__property-name">{name}</span>
        <input ref="baseInput"
          className={'text-node__property-value--' + inputType}
          type={inputType}
          name={name}
          value={base}
          checked={type === 'boolean' && base === true}
          onChange={this.handleBaseChange} />
        <Formula
          name={`${nodeId}.${name}`}
          value={formula}
          handleFormulaUpdate={this.handleFormulaUpdate} />
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

NodeProperties.propTypes = {
  actions: PropTypes.object.isRequired,
};

function mapStateToProps(state, ownProps) {
  const formulaName = `${ownProps.nodeId}.${ownProps.name}`;

  return {
    base: state.nodes[ownProps.nodeId][ownProps.name],
    formula: (state.formulas[ownProps.glyphId] || {})[formulaName],
    result: Parametric.getCalculatedGlyph(
      state,
      Parametric.getCalculatedParams(state.nodes.font_initial.params),
      ownProps.glyphId
    )[ownProps.nodeId][ownProps.name],
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeProperties);
