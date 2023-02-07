/* eslint-disable */
module.exports = {
  env: {
    browser: false,
    es2021: true
  },
  extends: ['eslint:recommended',  'plugin:@typescript-eslint/recommended', 'prettier', 'plugin:import/recommended', 'plugin:import/typescript'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'import/order': ['error', {
      groups: ['builtin', 'external', 'parent', 'sibling', 'index', 'object', 'type'],
      pathGroups: [{
        pattern: '{react,react-dom/**,react-router-dom}',
        group: 'builtin',
        position: 'before'
      }, {
        pattern: '~/src/**',
        group: 'parent',
        position: 'before'
      }],
      pathGroupsExcludedImportTypes: ['builtin'],
      alphabetize: {
        order: 'asc'
      },
      'newlines-between': 'always'
    }],
  },
};
