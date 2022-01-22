const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const path = require("path");

module.exports = (env) => {

    const {mode = 'development'} = env;

    const isProd = mode === 'production';
    const isDev = mode === 'development';

    const getStyleLoaders = () => {
        return [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader'
        ]
    }

    const getPlugins = () => {
        const plugins = [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                title: 'Hello React World',
                buildTime: new Date().toString(),
                template: 'public/index.html'
            }),

        ];
        if (isProd) {
            plugins.push(
                new MiniCssExtractPlugin({
                    filename: 'main-[chunkhash:8].css'
                })
            );
        }

        return plugins;
    }

    return {
        mode: isProd ? 'production' : isDev && 'development',
        output: {
            path: path.resolve("dist"),
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.(s[ca]ss)$/,
                    use: [...getStyleLoaders(), 'sass-loader']
                },
                {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader']
                },
                // load images
                {
                    test: /\.(png|jpg|jpeg|gif|ico)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: 'images',
                                name: '[name]-[sha1:chunkhash:7].[ext]'
                            }
                        }
                    ]
                },
                // load fonts
                {
                    test: /\.(ttf|otf|eot|woff|woff2)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: 'fonts',
                                name: '[name].[ext]'
                            }
                        }
                    ]
                }
            ]
        },
        plugins: getPlugins(),
        "devServer": {
            open: true,
            hot: true
        }
    }
};