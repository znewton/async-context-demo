module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'eslint-config-airbnb-base',
    'plugin:prettier/recommended',
  ],
  rules: {
    'no-console': 'off',
  },
};
