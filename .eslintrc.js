module.exports = {
  root: true,
  extends: [
    '@react-native',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks', 'prettier'],
  rules: {
    'react-native/no-inline-styles': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': [
      'warn',
      {allowExpressions: true},
    ],
    'no-console': ['warn', {allow: ['warn', 'error']}],
    'prettier/prettier': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'react/react-in-jsx-scope': 'off',
    'react-native/no-raw-text': ['error', {skip: ['Button']}],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
