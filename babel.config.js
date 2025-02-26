module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    'react-native-reanimated/plugin',
    'babel-plugin-inline-import',
    [
      '@babel/plugin-transform-runtime',
      {
        helpers: true,
        regenerator: true,
      },
    ],
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@app': './src/app',
          '@components': './src/components',
          '@navigation': './src/navigation',
          '@theme': './src/theme',
          '@utils': './src/utils',
          '@assets': './src/assets',
          '@services': './src/services',
        },
      },
    ],
  ],
};
