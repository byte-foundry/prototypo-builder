import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from '~/actions';
import { DEFAULT_EXPAND } from '~/const';

require('styles/ui/onboarding.scss');

class OnBoarding extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      thickness: DEFAULT_EXPAND,
      xHeight: 500,
      capHeight: 700,
      hidden: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  submitOnboarding(){
    this.props.actions.setBaseExpand(this.state.thickness);
    this.setState({hidden: true});
  }

  render() {
    return (
      <div className={this.state.hidden ? 'onboarding hidden' : 'onboarding'}>
        <div className="container">
          <h1>Hey there!</h1>
          <h2>Welcome to the Prototypo builder</h2>
          <hr/>
          <h4>Before starting, please set your default parameters</h4>
            <div className="form-elem">
              <label htmlFor="thickness">Thickness</label>
              <input type="number" id="thickness" value={this.state.thickness}  onChange={this.handleChange}/>
            </div>
            <div className="form-elem">
              <label htmlFor="xheight">x Height</label>
              <input type="number" id="xheight" value={this.state.xHeight}  onChange={this.handleChange}/>
            </div>
            <div className="form-elem">
              <label htmlFor="capheight">capital Height</label>
              <input type="number" id="capheight" value={this.state.capHeight} onChange={this.handleChange}/>
            </div>
            <div className='submit' onClick={() => this.submitOnboarding()}> Let&apos;s try it ! </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(OnBoarding);
