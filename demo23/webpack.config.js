var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

const checkHost = {
  "mock": { // 本地 mock 数据使用
    "A_HOST": "http://localhost:8080",
    "B_HOST": "http://localhost:8080",
  },
  "prod": { // 线上环境使用
    "A_HOST": "http://a.com",
    "B_HOST": "http://b.com",
  }
}

// 检查 process.env.NODE_ENV 是否和 checkHost 里的对应
var checkHostKey = checkHost[process.env.NODE_ENV] ? process.env.NODE_ENV : 'mock';

// checkHostContent 相当于是 checkHost.mock 或 checkHost.prod
var checkHostContent = checkHost[checkHostKey];

// 如果 DefinePlugin 键值是是一个字符串，它会被当作一个代码片段来使用，需要 JSON.stringify() 处理
for (i in checkHostContent) {
  checkHostContent[i] = JSON.stringify(checkHostContent[i]);
}

module.exports = {
  entry: { // 入口文件地址
    index: './src/index.js'
  },
  output: { // 出口
    path: __dirname + "/build", // 打包后的文件存放路径
    filename: '[name].js' // 文件名，name即为entry的key
  },
  externals: {
    'jquery': 'jQuery', // 不打包jquery
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,  // js-loader
        loader: 'babel-loader?presets[]=es2015&presets[]=react'
      },
      {
        test: /\.less/, // less-loader
        loaders: ExtractTextPlugin.extract('css-loader!less-loader')
      },
      {
        test: /\.(png|jpg|ttf)$/, // img-loader
        loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
      }
    ],
  },
  devServer: {
    contentBase: './build',
    inline: true,
    hot: true,
    before: (app) =>{
      app.get('/init.json', function(req, res) {
        res.json({ title: 'webpack' });
      });
    }
  },
  plugins: [
    new webpack.DefinePlugin(checkHostContent), // 将处理好的 checkHostContent 放入
    new webpack.HotModuleReplacementPlugin(), // 启用热替换模块
    new HtmlWebpackPlugin({
      filename: 'index.html', // 生成的的html文件名
      template: './src/index.html', // 被打包的html路径
      chunks: ['index'] // 需要引入的js，对应entry的key
    }),
    new ExtractTextPlugin({ // 单独打包css
      filename: '[name].css'
    })
  ]
}