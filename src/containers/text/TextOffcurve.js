import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  mapStateToProps,
  mapDispatchToProps,
} from './_utils';

import Foldable from './Foldable';

require('styles/text/TextNode.scss');

class TextOffcurve extends PureComponent {
  render() {
    const { id, parentId } = this.props;

    return (
      <Foldable id={id} parentId={parentId} switchProp="_isPropsUnfolded">
      </Foldable>
    );
  }
}

TextOffcurve.propTypes = {
  actions: PropTypes.object.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(TextOffcurve);
