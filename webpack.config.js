const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
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
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.scss$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader
                    },
                    'css-loader', // translates CSS into CommonJS
                    // 'sass-loader' // compiles Sass to CSS, using Node Sass by default
                    {
                        loader: 'sass-loader',
                        options: {
                            indentedSyntax: true,
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
            new OptimizeCSSAssetsPlugin({})
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
        fallback: {
            crypto: false,
            fs: false,
            path: false
        }
    }
};
