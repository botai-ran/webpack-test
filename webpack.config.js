const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'my-first-webpack.bundle.js',
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        client: {
            progress: true,
        },
        compress: true,
        port: 9000,
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './public/index.html' })
    ],
}