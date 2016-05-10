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
      _isPropsUnfolded: 'boolean'
    }
  },
  glyph: {
    children: { guideline: true, anchor: true, contour: true, group: true },
    propertyOrder: [],
    properties: {
      _isChildrenUnfolded: 'boolean',
      _isPropsUnfolded: 'boolean'
    }
  },
  guideline: {
    children: {},
    propertyOrder: [ 'x', 'y', 'angle' ],
    properties: {
      _isChildrenUnfolded: 'boolean',
      _isPropsUnfolded: 'boolean',
      x: 'number',
      y: 'number',
      angle: 'number'
    }
  },
  anchor: {
    children: {},
    propertyOrder: [ 'x', 'y' ],
    properties: {
      _isChildrenUnfolded: 'boolean',
      _isPropsUnfolded: 'boolean',
      x: 'number',
      y: 'number'
    }
  },
  contour: {
    children: { path: true },
    propertyOrder: ['isClosed'],
    properties: {
      _isChildrenUnfolded: 'boolean',
      _isPropsUnfolded: 'boolean',
      isClosed: 'boolean'
    }
  },
  group: {
    children: { group: true, contour: true },
    propertyOrder: [],
    properties: {
      _isChildrenUnfolded: 'boolean',
      _isPropsUnfolded: 'boolean'
    }
  },
  component: {
    children: {},
    propertyOrder: [],
    properties: {
      _isChildrenUnfolded: 'boolean',
      _isPropsUnfolded: 'boolean'
    }
  },
  path: {
    children: { oncurve: true, offcurve: true },
    propertyOrder: [ 'isClosed', 'isSkeleton' ],
    properties: {
      _isChildrenUnfolded: 'boolean',
      _isPropsUnfolded: 'boolean',
      isClosed: 'boolean',
      isSkeleton: 'boolean'
    }
  },
  point: {
    children: {},
    propertyOrder: [ 'x', 'y' ],
    properties: {
      _isChildrenUnfolded: 'boolean',
      _isPropsUnfolded: 'boolean',
      x: 'number',
      y: 'number'
    }
  },
  oncurve: {
    children: {},
    propertyOrder: [ 'x', 'y', 'expand', 'distrib', 'selected', 'state', 'isSmoothSkeleton' ],
    properties: {
      _isChildrenUnfolded: 'boolean',
      _isPropsUnfolded: 'boolean',
      x: 'text',
      y: 'text',
      selected: 'boolean',
      state: 'number',
      expand: 'number',
      distrib: 'number',
      isSmoothSkeleton: 'boolean'
    }
  },
  offcurve: {
    children: {},
    propertyOrder: [ 'x', 'y', 'selected' ],
    properties: {
      _isGhost: 'boolean',
      _ghost: 'object',
      _isChildrenUnfolded: 'boolean',
      _isPropsUnfolded: 'boolean',
      x: 'number',
      y: 'number',
      selected: 'boolean'
    }
  }
};
