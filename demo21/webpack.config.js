var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: {
    // 入口文件地址
    index: './src/index.js',
  },
  output: {
    // 出口
    path: __dirname + '/build', // 打包后的文件存放路径
    filename: '[name].js', // 文件名，name即为entry的key
  },
  externals: {
    jquery: 'jQuery', // 不打包jquery
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/, // js-loader
        loader: 'babel-loader?presets[]=es2015&presets[]=react',
      },
      {
        test: /\.less/, // less-loader
        loaders: ExtractTextPlugin.extract('css-loader!less-loader'),
      },
      {
        test: /\.(png|jpg|ttf)$/, // img-loader
        loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]',
      },
    ],
  },
  devServer: {
    contentBase: './build',
    inline: true,
    hot: true,
    open: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 启用热替换模块
    new HtmlWebpackPlugin({
      filename: 'index.html', // 生成的的html文件名
      template: './src/index.html', // 被打包的html路径
      chunks: ['index'], // 需要引入的js，对应entry的key
    }),
    new ExtractTextPlugin({
      // 单独打包css
      filename: '[name].css',
    }),
  ],
}
