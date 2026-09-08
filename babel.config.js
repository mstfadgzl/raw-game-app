module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
      },
    ],
    [
      'module-resolver',
      {
        root: ['./app'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@components': './app/components',
          '@services': './app/api',
          '@screens': './app/screens',
          '@assets': './app/assets',
          '@navigators': './app/navigators',
          '@utils': './app/utils',
          '@hooks': './app/hooks',
          '@types': './app/types',
          '@api': './app/services',
          '@theme': './app/theme',
          '@redux': './app/redux',
          '@actions': './app/redux/actions',
        },
      },
    ],
  ],
};