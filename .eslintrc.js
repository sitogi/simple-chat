/* eslint-disable */
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'newline-before-return': 'error',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index', 'object', 'type'],
        pathGroups: [
          {
            pattern: '{react,react-dom/**,react-router-dom}',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: '~/src/**',
            group: 'parent',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: {
          order: 'asc',
        },
        'newlines-between': 'always',
      },
    ],
    'import/no-unresolved': 'off', // REVISIT: ~/App などのパスを解析させる方法がわからなかった
    // LocalStorage の直接呼び出しを禁止する
    'no-restricted-syntax': [
      'error',
      {
        selector: "CallExpression[callee.object.name='localStorage']",
        message: 'Do not use `localStorage` directly, use src/common/localStorage/TypeSafeLocalStorage.ts instead',
      },
    ],
  },
};
