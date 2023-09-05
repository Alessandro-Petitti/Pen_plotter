const path = require('path');
const webpack = require('webpack')

module.exports = {
	mode: 'development',
	devtool: 'eval-source-map',
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname,'dist'),
		filename: 'main2.js'
	},
	resolve: {
		fallback: {
		  fs: false,
		  http: false,
		  assert: require.resolve("assert/"),
		  https: require.resolve("https-browserify"),
		  querystring: require.resolve("querystring-es3"),
		  zlib: require.resolve("browserify-zlib"),
		  child_process: false
		}
	  },
	plugins: [
	// fix "process is not defined" error:
	new webpack.ProvidePlugin({
		process: 'process/browser',
	}),
	// Work around for Buffer is undefined:
	// https://github.com/webpack/changelog-v5/issues/10
	new webpack.ProvidePlugin({
		Buffer: ['buffer', 'Buffer'],
	}),
	]
}
