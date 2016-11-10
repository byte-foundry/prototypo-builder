import React, { PureComponent} from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actions from '~/actions';

require('styles/text/FontSettings.scss');

class TextRoot extends PureComponent {
  constructor(props) {
    super(props);
  }

  saveNodes() {
    const json = JSON.stringify({
      nodes: this.props.nodes,
      formulas: this.props.formulas,
    });

    const blob = new Blob([json], {type: 'octet/stream'});
    const url = window.URL.createObjectURL(blob);

    const a = this.refs.downloadLink;
    a.href = url;
    a.download = 'prototypo-json-save.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  render() {
    return (
      <div className="fontSettings">
        <button className="exportButton" onClick={() => this.saveNodes()}>
          Export JSON
        </button>
        <a ref="downloadLink" style={{display: 'none'}}></a>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(TextRoot);
