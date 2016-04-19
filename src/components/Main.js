require('styles/knacss/knacss.scss');
require('styles/App.css');

import React from 'react';
import TextRoot from './../containers/text/TextRoot';

class AppComponent extends React.Component {
  render() {
    return (
      <TextRoot id={'root'} />
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
