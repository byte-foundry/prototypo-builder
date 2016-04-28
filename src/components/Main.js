require('styles/knacss/knacss.scss');
require('styles/App.css');

import React from 'react';
import TextRoot from './../containers/text/TextRoot';
import SvgContainer from './../containers/svg/SvgContainer';

class AppComponent extends React.Component {
  render() {
    return (
      <div className="grid-2">
        <div>
          <TextRoot id={'root'} />
        </div>
        <div>
          <SvgContainer />
        </div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
