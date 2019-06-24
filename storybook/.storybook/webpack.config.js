
module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.less$/,
    use: [{
      loader: 'style-loader'
    }, {
      loader: 'css-loader'
    }, {
      loader: 'less-loader',
      options: {
        javascriptEnabled: true
      }
    }]
  });

  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve('awesome-typescript-loader'),
      },
      // // Optional
      // {
      //   loader: require.resolve('react-docgen-typescript-loader'),
      // },
    ],
  });

  config.resolve.extensions.push('.ts', '.tsx');
  config.resolve.mainFields = ['main:src', 'main'];

  return config;
};
