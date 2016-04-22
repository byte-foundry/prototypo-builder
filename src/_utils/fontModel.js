// This describes the object model of the font Tree in Prototypo
// Each type of node in the tree are described below, and informs on:
// - the type of children it can have
// - the properties it can have
// - the order in which those properties are displayed in Text view
//   (properties taht shouldn't appear in the ui should be  prefixed with '_'
export default {
  root: {
    children: { font: true },
    propertyOrder: [],
    properties: {}
  },
  font: {
    children: { glyph: true },
    propertyOrder: [],
    properties: {
      _isUnfolded: 'boolean'
    }
  },
  glyph: {
    children: { guideline: true, anchor: true, contour: true, group: true },
    propertyOrder: [],
    properties: {
      _isUnfolded: 'boolean'
    }
  },
  guideline: {
    children: {},
    propertyOrder: [ 'x', 'y', 'angle' ],
    properties: {
      _isUnfolded: 'boolean',
      x: 'number',
      y: 'number',
      angle: 'number'
    }
  },
  anchor: {
    children: {},
    propertyOrder: [ 'x', 'y' ],
    properties: {
      _isUnfolded: 'boolean',
      x: 'number',
      y: 'number'
    }
  },
  contour: {
    children: { path: true },
    propertyOrder: [],
    properties: {
      _isUnfolded: 'boolean'
    }
  },
  group: {
    children: { group: true, contour: true },
    propertyOrder: [],
    properties: {
      _isUnfolded: 'boolean'
    }
  },
  component: {
    children: {},
    propertyOrder: [],
    properties: {
      _isUnfolded: 'boolean'
    }
  },
  path: {
    children: { oncurve: true, offcurve: true },
    propertyOrder: [ 'isClosed' ],
    properties: {
      _isUnfolded: 'boolean',
      isClosed: 'boolean'
    }
  },
  point: {
    children: {},
    propertyOrder: [ 'x', 'y' ],
    properties: {
      _isUnfolded: 'boolean',
      x: 'number',
      y: 'number'
    }
  },
  oncurve: {
    children: {},
    propertyOrder: [ 'x', 'y' ],
    properties: {
      _isUnfolded: 'boolean',
      x: 'number',
      y: 'number'
    }
  },
  offcurve: {
    children: {},
    propertyOrder: [ 'x', 'y' ],
    properties: {
      _isUnfolded: 'boolean',
      x: 'number',
      y: 'number'
    }
  }
};
