module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    browser: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    semi: ['error', 'never'],
    'no-console': 'off',
    'no-restricted-syntax': 'off',
    'no-underscore-dangle': 'off',
    'no-nested-ternary': 'off',
  },
}
