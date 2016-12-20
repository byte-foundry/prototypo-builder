module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    'ecmaVersion': 6,
    'sourceType': 'module',
    'ecmaFeatures': {
      'jsx': true
    }
  },
  extends: [
    'eslint:recommended'
  ],
  plugins: [
    'react',
    'mocha',
    'import'
  ],
  settings: {
    'import/resolver': 'babel-root-import',
    'import/ignore': [
      'webpack.config.json'
    ]
  },
  env: {
    'browser': true,
    'amd': true,
    'es6': true,
    'node': true,
    'mocha': true
  },
  rules: {
    'global-strict': 0,
    'no-underscore-dangle': 0,
    'no-console': 'warn',
    'no-alert': 'warn',
    'no-unused-vars': 'error',
    'no-trailing-spaces': ['error'],
    'consistent-return': 'error',
    'curly': 'error',
    'default-case': 'error',
    'dot-notation': 'warn',
    'eqeqeq': ['error', 'smart'],
    'no-extra-bind': 'error',
    'no-loop-func': 'warn',
    'no-param-reassign': 'warn',
    'no-proto': 'error',
    'no-unused-expressions': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-useless-call': 'error',
    'no-useless-concat': 'error',
    'no-useless-escape': 'error',
    'semi': ['error', 'always'],
    'one-var': ['error', 'never'],
    // Do not disable max-len. If your code exceeds 90 chars, then there's no arguing that you are making it hard to read for other devs. See?
    'max-len': ['warn', { code: 90, ignoreUrls: true }],
    'newline-after-var': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'quotes': [ 'error', 'single' ],
    'brace-style': [ 'error', 'stroustrup', { 'allowSingleLine': true } ],
    'camelcase': ['error', {properties: 'always'}],

    'react/jsx-uses-react': 1,
    'react/jsx-uses-vars': 1,

    'mocha/no-exclusive-tests': 'error',

    // check import resolution on es6 imports only
    'import/no-unresolved': [2, {commonjs: false, amd: false, }],
    'import/named': 2,
    'import/default': 2,
    'import/namespace': 'warn',
    'import/no-absolute-path': 2,
    'import/no-dynamic-require': 2,
    'import/export': 2,
    'import/no-named-as-default': 2,
    'import/no-named-as-default-member': 2,
    'import/no-deprecated': 2,
    'import/no-mutable-exports': 2,
    'import/no-nodejs-modules': 2,
    'import/first': 2,
    'import/no-duplicates': 2,
    'import/order': 2,
    'import/newline-after-import': 2,
    // surprisingly, thos two rules don't work
    'import/no-webpack-loader-syntax': 'off',
    'import/unambiguous': 'off',
  },
  'globals': {
    expect: false
  }
};
