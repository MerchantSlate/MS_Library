const
    path = require('path'),
    webpack = require('webpack'),
    { CleanWebpackPlugin } = require('clean-webpack-plugin'),
    TerserPlugin = require('terser-webpack-plugin');

// Common configuration
const commonConfig = {
    entry: './src/index.ts', // Entry point for your library
    output: {
        path: path.resolve(__dirname, 'dist'),
        library: 'merchant',         // Global variable for browsers
        libraryExport: 'default',    // Ensure default export is accessible
        globalObject: 'this',        // Fix for UMD in Node.js
    },
    resolve: {
        extensions: ['.ts', '.js'], // Resolve .ts and .js files
    },
    module: {
        rules: [
            {
                test: /\.ts$/,         // Match .ts files
                use: 'ts-loader',      // Use ts-loader for TypeScript
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(), // Clean output directory before each build
        new webpack.BannerPlugin({
            banner: `/*! MIT License. MerchantSlate Contract SDK. https://opensource.org/licenses/MIT */`,
            raw: true, // Ensures the comment appears as-is without being wrapped
        }),
    ],
    optimization: {
        minimize: true,           // Minify the output
        minimizer: [new TerserPlugin({
            terserOptions: {
                sourceMap: true,  // Enable source maps for debugging
            },
        })],
        usedExports: false, // Disable tree-shaking
        sideEffects: true,  // Preserve all code
    },
    mode: 'production',          // Ensure output is optimized
    devtool: 'source-map',       // Generate source maps for better debugging
};

module.exports = [{
    // Browser configuration
    ...commonConfig,
    target: 'web',
    output: {
        ...commonConfig.output,
        path: path.resolve(__dirname, 'dist/browser'), // Separate output directory
        filename: 'merchant.min.js',
        libraryTarget: 'umd', // UMD for browser
    },
}, {
    // Node.js configuration
    ...commonConfig,
    target: 'node',
    output: {
        ...commonConfig.output,
        path: path.resolve(__dirname, 'dist/node'), // Separate output directory
        filename: 'merchant.node.min.js',
        libraryTarget: 'commonjs2', // CommonJS for Node.js
    },
    externals: [
        // Handle Node.js built-in modules
        ({ request }, callback) => {
            if (/^(fs|path|crypto)$/.test(request)) {
                return callback(null, `commonjs ${request}`);
            }
            callback();
        },
    ],
    node: {
        __dirname: false, // Prevent Webpack from mocking __dirname
        __filename: false, // Prevent Webpack from mocking __filename
    },
}];