import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  mapStateToProps,
  mapDispatchToProps
} from './_utils';

class Foldable extends Component {
  constructor(props) {
    super(props);
    this.handleFoldClick = this.handleFoldClick.bind(this);
  }

  handleFoldClick(e) {
    e.preventDefault();

    const { id, _isUnfolded } = this.props;
    const { updateProp } = this.props.actions;

    updateProp(id, '_isUnfolded', !_isUnfolded);
  }

  render() {
    const { id, _isUnfolded } = this.props;

    return (
      <div className="text-node__foldable-wrapper">
        <a id={id} className="text-node__fold-button" onClick={this.handleFoldClick}>
          { _isUnfolded ? '⏷' : '⏵' } <small><i>{id}</i></small>
        </a>
        {this.props.children}
      </div>
    );
  }
}

Foldable.propTypes = {
  actions: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Foldable);
