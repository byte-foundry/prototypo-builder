export default {
  root: {
    children: { font: true },
    propertyOrder: [],
    properties: {}
  },
  font: {
    children: { glyph: true },
    propertyOrder: [],
    properties: {}
  },
  glyph: {
    children: { guideline: true, anchor: true, contour: true, group: true },
    propertyOrder: [],
    properties: {}
  },
  guideline: {
    children: { point: true },
    propertyOrder: [],
    properties: {}
  },
  anchor: {
    children: {},
    propertyOrder: [ 'x', 'y' ],
    properties: {
      x: 'number',
      y: 'number'
    }
  },
  contour: {
    children: { path: true },
    propertyOrder: [],
    properties: {}
  },
  group: {
    children: { group: true, contour: true },
    propertyOrder: [],
    properties: {}
  },
  component: {
    children: {},
    propertyOrder: [],
    properties: {}
  },
  path: {
    children: { oncurve: true, offcurve: true },
    propertyOrder: [ 'closed' ],
    properties: {
      closed: 'boolean'
    }
  },
  point: {
    children: {},
    propertyOrder: [ 'x', 'y' ],
    properties: {
      x: 'number',
      y: 'number'
    }
  },
  oncurve: {
    children: {},
    propertyOrder: [ 'x', 'y' ],
    properties: {
      x: 'number',
      y: 'number'
    }
  },
  offcurve: {
    children: {},
    propertyOrder: [ 'x', 'y' ],
    properties: {
      x: 'number',
      y: 'number'
    }
  }
};
