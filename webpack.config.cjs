const path = require('path');

module.exports = {
  entry: './index.js', // This path might differ based on your project structure
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
    },
    {
      test: /\.png$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'images/',
            publicPath: 'images/'
          }
        }
      ]
    }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: { 
      "path": require.resolve("path-browserify"),
      "fs": require.resolve("browserify-fs"),
      "os": require.resolve("os-browserify/browser"),
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util/")
     }
  },
  
};
