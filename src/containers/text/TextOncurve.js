import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  mapStateToProps,
  mapDispatchToProps
} from './_utils';

class TextOncurve extends Component {
  constructor(props) {
    super(props);
    // this.handleXInput = handleXInput.bind(this);
    // this.handleYInput = handleYInput.bind(this);
  }

  handleXInput(e) {

  }

  handleYInput(e) {

  }

  render() {
    const { id, type, x, y } = this.props;
    return (
      <ul className="unstyled">
        <li>{id}: {type}</li>
        <li>
          <label>x: <input type="number" value={x || ''} onInput={this.handleXInput} /></label>
          <label>y: <input type="number" value={y || ''} onInput={this.handleYInput} /></label>
        </li>
      </ul>
    );
  }
}

TextOncurve.propTypes = {
  actions: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(TextOncurve);
