const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');

module.exports = {
    entry: [
        'react-hot-loader/patch',
        'webpack/hot/only-dev-server',
        './src/app.js'
    ],
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'dist'),
        //publicPath: '/'
    },
    module:{
        rules:[{
            test: /\.jsx?$/,
            include:[path.resolve(__dirname, 'src')],
            exclude: [path.resolve(__dirname,"node_modules")],
            loader: "babel-loader"
        },{
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
            use: [{
                loader: "css-loader", options: {
                  sourceMap: true,
                  modules: true
                }
            }, {
                loader: "sass-loader", options: {
                  sourceMap: true
                }
            }],
            // use style-loader in development
            fallback: "style-loader"
          })
    }]},
    devtool: "source-map",
    devServer: {
        hot: true,
        contentBase: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        port:9876
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new CleanWebpackPlugin(['dist']),
        new ExtractTextPlugin('style.css'),
        new HtmlWebpackPlugin({
            template: 'src/index.ejs',
            inject: 'body',
        }),new UglifyJSPlugin({
            test: /\.js($|\?)/i,
            sourceMap: true,
            uglifyOptions: {
                compress: true
            }
        })
    ]
}