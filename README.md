Prototypo Builder
=================

## Making a sense of this code-base

This application is written in JS (ES2015). It's based on:
- [React](https://github.com/facebook/react) for UI components.
- [Redux](https://github.com/reactjs/redux) for state management.
- [Bezierjs](https://github.com/Pomax/bezierjs) for bezier manipulation.

Being familiar with those tools, their underlying concepts and API is recommended before diving into this application.

### Parametric Engine

At the heart of Prototypo-builder is our next generation *Parametric engine*. It's composed of two parts that we'll call *The computer* and *The expander*.

<dl>
  <dt>The computer</dt>
  <dd>
    The computer is in charge of calculating the coordinates as well as any other property of all nodes in a glyph. It works very similarly to a spreadsheet: node properties can have static values, but they can also have formulas, such as `$height * 7`.
  </dd>
  <dt>The expander</dt>
  <dd>
    The expander is a collection of algorithms that stem an outline from a bezier skeleton. Currently, the builder is more of a playground than an application. We are experimenting with different algorithms and hope to keep more than one of them in the future application.
  </dd>
</dl>

### Data Model / State Shape

The data model of the app is described in [src/reducers/index.js](src/reducers/index.js).
We try to keep the state as **normalized** as possible (see Redux docs on [Normalizing State Shape](http://redux.js.org/docs/recipes/reducers/NormalizingStateShape.html)). That means many parts of the Data Model are not stored in the state. This is the case for *expanded nodes* which are calculated and stem from skeleton nodes.
There is a notable exception with *formulas*: since formulas are potentially interdependent with other formulas in the same glyph, all formulas of all descendants of a glyph must be collected to be calculated at the same time. Searching for and gathering all formulas in a glyph is potentially very time-consuming, so we have de-normalized that part and stored it in its own sub-state, grouped by glyph.

#### Font Model

The font model is described in [src/\_utils/FontModel.js](src/_utils/FontModel.js).
We've made the choice to represent paths as flat lists of oncurve and offcurve points, instead of grouping them in bezier curves (e.g. `{start, end, ctrl1, ctrl2}`) or in nodes (e.g. `{node, ctrlBefore, ctrlAfter}`).
[src/\_utils/Path.js](src/_utils/Path.js) offers `forEachCurve` and `forEachNode` methods to iterate over a path, though :-)

### Coding style and conventions

Please install an ESLint and Editorconfig plugin for your code editor.
Most coding rules are enforced by our eslint config. There are additional rules that must be respected.
Note that Atom will report linting errors with root imports (e.g. `from '~/_utils'`). This is due to [a bug](https://github.com/olalonde/eslint-import-resolver-babel-root-import/issues/3) in that eslint plugin.

#### 80 characters max per LOC

After much debate, we have decided not to enforce a strict limit of 80 characters per LOC, as it doesn't necessarily result in more readable code. But you must be mindful of this limit and avoid exceeding it as much as possible. Keeping line shorts greatly improves readability when reading two files side by side on a single screen.
However, the linter will warn when a line exceeds 90 characters.

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

#### Destructuring imports

You must not use destructuring imports for methods in src/\_utils/ files. Keeping methods namespaced helps a lot with readability, and figuring out in which file methods are located.

```js
/* Bad */
import { mapCurve } from '~/_utils/Path';

const node = mapCurve( nodeId, childId, nodes );

/* Good */
import * as Path from '~/_utils/Path';

const node = Path.mapCurve( nodeId, childId, nodes );
```

### Test Coverage

Using `npm run test` will test the code and provide full coverage using Istanbul. All files in `src/_utils`, and `src/reducers` should have 100% coverage at all time!

### Performances

This application uses many algorithms that are inherently slow. Also, all these algorithms are implemented as pure functions, so that results can be memoized to avoid wasting resources calculating the same thing twice.

There are therefore two ways to optimize performances in the app:
- Making sure browser VMs do not deoptimize our most critical algorithms
  - make sure methods are monomorphic (do not memoize )
- Make sure memoization is used appropriately and most efficiently
  - do not include a part of the state that is highly likely to change in the memoization key (e.g. state.nodes)
