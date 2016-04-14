require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import TextNode from '../containers/TextNode';

class AppComponent extends React.Component {
  render() {
    const actions = this.props.actions;
    return (
      <TextNode actions={actions} id={'root'} />
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
