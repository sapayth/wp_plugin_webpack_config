const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const isProduction = process.env.NODE_ENV === 'production';

const entryPoint = {
    'main': './src/js/main.js',
    'raw': './src/styles/raw.css',
    'scss-styles': './src/styles/syntactical.scss'
};

const updatedConfig = {
    mode: defaultConfig.mode,
    entry: entryPoint,
    output: {
        path: path.resolve(__dirname, './assets/js'),
        filename: '[name].js',
        clean: true,
    },

    externals: {
        jquery: 'jQuery',
    },

    plugins: [
        new MiniCssExtractPlugin(
            {
                filename: ( { chunk } ) => {
                    if ( chunk.name.match( /\/modules\// ) ) {
                        return `${ chunk.name.replace( '/js/', '/css/' ) }.css`;
                    }

                    return '../css/[name].css';
                },
            }
        ),
    ],

    module: {
        rules: [
            {
                test: /\.(j|t)sx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: require.resolve( 'babel-loader' ),
                        options: {
                            // Babel uses a directory within local node_modules
                            // by default. Use the environment variable option
                            // to enable more persistent caching.
                            cacheDirectory:
                                process.env.BABEL_CACHE_DIRECTORY || true,
                                babelrc: false,
                                configFile: false,
                                presets: [
                                    require.resolve(
                                        '@wordpress/babel-preset-default'
                                    ),
                                ],
                        },
                    },
                ],
            },
            {
                test: /\.(sass|scss|css)$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: ! isProduction,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        "autoprefixer"
                                    ],
                                ],
                            }
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: ! isProduction,
                        },
                    },
                ],
            },
            {
                test: /\.(bmp|png|jpe?g|gif|webp)$/i,
                type: 'asset/resource',
                generator: {
                    filename: '../images/[name][ext][query]'
                },
            },
            {
                test: /\.svg/,
                type: 'asset/inline'
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: '../font/[name].[ext]',
                },
            },
        ]
    },
}

if (!isProduction) {
    updatedConfig.devServer = {
        devMiddleware: {
            writeToDisk: true,
        },
        allowedHosts: 'all',
        host: 'localhost',
        port: 8887,
        proxy: {
            '/assets/dist': {
                pathRewrite: {
                    '^/assets/dist': '',
                },
            },
        },
    };
}

module.exports = updatedConfig;
