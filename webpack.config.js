const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: './src/index.ts', // Entry point for your library
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.min.js', // Output file name
        library: 'merchant',         // Global variable for browsers
        libraryTarget: 'umd',         // Universal Module Definition
        globalObject: 'this',         // Fix for UMD in Node.js
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
    ],
    optimization: {
        minimize: true,           // Minify the output
        minimizer: [new TerserPlugin()],
        usedExports: true,        // Enable tree-shaking
        sideEffects: false        // Mark the project as free of side effects
    },
    mode: 'production',          // Ensure output is optimised
};