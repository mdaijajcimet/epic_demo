module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'no-unused-expressions': [
      2,
      {
        allowTaggedTemplates: true,
      },
    ],
    'no-param-reassign': [
      2,
      {
        props: false,
      },
    ],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'comma-dangle': [2, 'always-multiline'],
    'no-multiple-empty-lines': [2, { max: 1 }],
    quotes: [
      2,
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
  },
}
