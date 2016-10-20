module.exports = {
  entry: './entry.js',
  output: {
    filename: 'bundle.js'
  },
  loaders: [
    {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel', // 'babel-loader' is also a valid name to reference
      query: {
        presets: ['es2015', 'react']
      }
    }
  ]
};
