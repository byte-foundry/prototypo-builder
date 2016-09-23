import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  mapStateToProps,
  mapDispatchToProps,
  shouldBeUnfolded,
} from './_utils';

class Foldable extends PureComponent {
  constructor(props) {
    super(props);
    this.handleFoldClick = this.handleFoldClick.bind(this);
    this.renderArrow = this.renderArrow.bind(this);
    this.shouldBeUnfolded = shouldBeUnfolded.bind(this);
  }

  handleFoldClick(e) {
    e.preventDefault();

    const { id, parentId, switchProp } = this.props;
    const { updateProp, setNodeSelected, setNodeOptionsSelected } = this.props.actions;

    if (this.props[switchProp]) {
      setNodeSelected();
    }
    else {
      setNodeSelected(id, parentId);
      setNodeOptionsSelected(id);
    }
    if (!this.isOffCurve(id)) {
      updateProp(id, switchProp, !this.props[switchProp]);
    }
  }

  isOffCurve(id) {
    return /^offcurve[-_]/.test(id);
  }

  renderArrow() {
    const { id, switchProp } = this.props;
    let arrow = '';

    if (!this.isOffCurve(id)) {
      arrow = (this.shouldBeUnfolded() || this.props[switchProp]) ? '▼' : '▶';
    }
    return arrow;
  }

  render() {
    const { id, name } = this.props;
    const { nodeOptions } = this.props.ui.selected;

    return (
      <div className="text-node__foldable-wrapper">
        <a id={id} className={`text-node__fold-button${nodeOptions === id ? '--highlighted' : ''}`} onClick={this.handleFoldClick}>
          {this.renderArrow()} <small><i>{name || id}</i></small>
        </a>
        {this.props.children}
      </div>
    );
  }
}

Foldable.propTypes = {
  actions: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Foldable);
