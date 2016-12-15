Prototypo Builder
=================

## Making a sense of this code-base

This application is written in JS (ES2015). It's based on [React](https://github.com/facebook/react) and [Redux](https://github.com/reactjs/redux). Being familiar with those tools and the underlying concepts is recommended before diving into this application.

### Data Model / State Shape

The data model of the app is described in [src/reducers/index.js](tree/master/src/reducers/index.js).
We try to keep the state as **normalized** as possible (see Redux docs on [Normalizing State Shape](http://redux.js.org/docs/recipes/reducers/NormalizingStateShape.html)). That means many parts of the Data Model are not stored in the state. This is the case for *expanded nodes* which are calculated and stem from skeleton nodes.
There is a notable exception with *formulas*:

#### Font Model

The font model is described in [src/\_utils/FontModel.js](tree/master/src/_utils/FontModel.js).
We've made the choice to represent paths as flat lists of oncurve and offcurve points, instead of grouping them in bezier curves (e.g. `{start, end, ctrl1, ctrl2}`) or in nodes (e.g. `{node, ctrlBefore, ctrlAfter}`).
[src/\_utils/Path.js](tree/master/src/_utils/Path.js) offers `forEachCurve` and `forEachNode` methods to iterate over a path, though :-)

### Coding style and conventions

Please install an ESLint and Editorconfig plugin for your code editor.
Most coding rules are enforced by our eslint config. There are additional rules that must be respected.

#### 80 characters max per LOC

After much debate, we have decided not to enforce a strict limit of 80 characters per LOC, as it doesn't necessarily result in more readable code. But you must be mindful of this limit and avoid exceeding it as much as possible. Keeping line shorts greatly improves readability when reading two files side by side on a single screen.

#### Destructuring assignment

Destructuring assignment is good! It helps a lot keeping your LOCs under 80 chars and improves readability. However, keeping properties and methods namespaced often results in optimal readability.

```js
/* Bad */
this.props.actions.updateProp(oncurveId, 'x', coord.x);
this.props.actions.updateProp(oncurveId, 'y', coord.y);
this.props.actions.addOncurve(pathId, oncurveId);

/* Avoid */
const { updateProp, addOncurve } = this.props.actions;

updateProp(oncurveId, 'x', coord.x);
updateProp(oncurveId, 'y', coord.y);
addOncurve(pathId, oncurveId);

/* Good */
const { actions } = this.props;

actions.updateProp(oncurveId, 'x', coord.x);
actions.updateProp(oncurveId, 'y', coord.y);
actions.addOncurve(pathId, oncurveId);
```

#### Imports

Every container in the app uses a lot of imports. Please group them and sort them logically to make this part of the file easier to read and modify.
Here's a good example of the import section of a container.

```js
// Import npm modules
import React from 'react';
    // line break
// Import from ~/
import * as Path from '~/_utils/Path';
import * as actions from '~/actions';
    // line break
// Import from relative paths
import { mapStateToProps } from './_utils';
import SvgRoot from './SvgRoot';
    // line break
// Require CSS
require('styles/text/TextProplist.scss');
```

#### Destructuring imports

You must not use destructuring imports for methods in src/\_utils/ files. Keeping methods namespaced helps a lot with readability, and figuring out in which file methods are located.

```js
/* Bad */
import { mapCurve } from '~/_utils/Path';

const node = mapCurve( nodeId, childId, nodes );

/* Good */
import Path from '~/_utils/Path';

const node = Path.mapCurve( nodeId, childId, nodes );
```

### Test Coverage

Using `npm run test` will test the code and provide full coverage using Istanbul. All files in `src/_utils`, and `src/reducers` should have 100% coverage at all time!
