var path = require('path')
var webpack = require('webpack');
module.exports = {
    entry: [
        'react-hot-loader/patch',
        'webpack-dev-server/client?http://localhost:9876',
        'webpack/hot/only-dev-server',
        './src/app.js'
    ],
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    module:{
        rules:[{
            test: /\.jsx?$/,
            include:[path.resolve(__dirname, 'src')],
            exclude: [path.resolve(__dirname,"node_modules")],
            loader: "babel-loader"
        },{
        test: /\.scss$/,
        use: [{
            loader: "style-loader" // creates style nodes from JS strings
        }, {
            loader: "css-loader", options: {
              sourceMap: true,
              modules: true
            }
        }, {
            loader: "sass-loader", options: {
              sourceMap: true
          }
        }]
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
    ],
}