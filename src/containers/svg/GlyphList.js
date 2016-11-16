import React, { PureComponent} from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actions from '~/actions';

require('styles/svg/GlyphList.scss');

class GlyphList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      allGlyphFolded: false,
    }
  }
  toggleAllGlyphView(){
    if (this.state.allGlyphFolded) {
      this.setState({allGlyphFolded: false})
    }
    else {
      this.setState({allGlyphFolded: true})
    }
  }
  openGlyph(glyph){
    this.props.actions.setActiveTab('single', glyph);
  }
  render() {
    let first = '!'.charCodeAt(0);
    let last = '~'.charCodeAt(0)+1;
    let glyphs = [];
    for (var i = first; i < last; i++) {
      glyphs.push(String.fromCharCode(i))
    }
    glyphs = glyphs.filter(entry => entry.trim() !== '');
    glyphs = glyphs.filter(entry => entry.trim() !== ' ');
    return (
      <div className="glyphList">
        <div className={`category ${this.state.allGlyphFolded ? 'folded': ''}`} onClick={() => this.toggleAllGlyphView()}>
          All glyphs <span>▼</span>
        </div>
        <div className={`glyphs ${this.state.allGlyphFolded ? 'folded': ''}`}>
          {glyphs.map((glyph, index) => <span className="glyph" key={index} onClick={() => this.openGlyph(glyph)} >{glyph}</span>)}
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(GlyphList);
