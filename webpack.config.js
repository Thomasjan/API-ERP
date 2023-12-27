const path = require('path');

module.exports = {
  mode: 'production', // or 'development'
  entry: './src/server.js', // Entry point of your application
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.js', // Output filename
  },
};