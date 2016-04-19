export default {
  root: {
    children: { font: true },
    properties: {}
  },
  font: {
    children: { glyph: true },
    properties: {}
  },
  glyph: {
    children: { guideline: true, anchor: true, contour: true, group: true },
    properties: {}
  },
  guideline: {
    children: { point: true },
    properties: {}
  },
  anchor: {
    children: {},
    properties: { x: true, y: true }
  },
  contour: {
    children: { path: true },
    properties: {}
  },
  group: {
    children: { group: true, contour: true },
    properties: {}
  },
  component: {
    children: {},
    properties: {}
  },
  path: {
    children: { oncurve: true, offcurve: true },
    properties: {}
  },
  point: {
    children: {},
    properties: { x: true, y: true }
  },
  oncurve: {
    children: {},
    properties: { x: true, y: true }
  },
  offcurve: {
    children: {},
    properties: { x: true, y: true }
  }
};
