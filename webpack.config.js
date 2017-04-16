'use strict'

const path = require('path');
const webpackStream = require('webpack-stream');
const webpack = webpackStream.webpack;


const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';



let config = {
    entry: {
        app: './src/app/main.ts'
    },
    output: {
        publicPath: '/js/',
        filename: 'bundle.js'
    },
    resolve: {
        // root:[path.join(__dirname,'node_modules')],
        extensions: ['', '.ts', '.webpack.js', '.web.js', '.js']
    },
    watch: isDevelopment,
    devtool: isDevelopment ? 'cheap-module-inline-source-map' : null,
    module: {
        loaders: [
                { test: /\.ts$/, loader: 'awesome-typescript-loader' }
            ]
            // loaders: [
            //         {
            //             test: /\.js$/,
            //             include: path.join(__dirname, "src"),
            //             loader: 'babel?presets[]=es2015'
            //         }
            //     ]
    },
    plugins: [
        new webpack.NoErrorsPlugin()
    ]
};

module.exports = config;