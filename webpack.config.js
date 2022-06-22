const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CSSMinimizerPlugin = require('css-minimizer-webpack-plugin');
const sass = require("sass");
const pkg = require('./package.json');

module.exports = {
    entry: {
        index: './src/index.js',
        styles: './src/styles/index.scss'
    },
    devtool: false,
    externals: [
        ...Object.keys(pkg.dependencies),
        ...Object.keys(pkg.peerDependencies),
        "react",
        "react-dom"
    ],
    mode: 'production',
    module: {
        rules: [{
                test: /\.m?jsx?$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader'
                },
                resolve: {
                    fullySpecified: false
                }
            },
            {
                test: /\.scss$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader
                    },
                    'css-loader', // translates CSS into CommonJS
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: sass
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader
                    },
                    'css-loader' // translates CSS into CommonJS
                ]
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'icons'
                    }
                }]
            },
            {
                test: /\.(ttf|otf|woff|woff2|eot)$/i,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts'
                    }
                }]
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                exclude: /\/node_modules/,
                parallel: true
            }),
            new CSSMinimizerPlugin()
        ]
    },
    output: {
        libraryTarget: 'commonjs2',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css',
            chunkFilename: '[id].css'
        })
    ],
    resolve: {
        alias: {
            "react-dnd": path.resolve("node_modules/react-dnd"),
            "react/jsx-runtime": "react/jsx-runtime.js",
            "react/jsx-dev-runtime": "react/jsx-dev-runtime.js"
        },
        extensions: [".js", ".jsx"],
        fallback: {
            crypto: false,
            fs: false,
            path: false
        }
    }
};
