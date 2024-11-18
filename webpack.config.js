const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

module.exports = {
	...defaultConfig,
	entry: {
		...defaultConfig.entry,
		index: path.resolve( __dirname, 'src/index.ts' ),
		'front-style': path.resolve( __dirname, 'src/front-style.css' ),
	},
};
