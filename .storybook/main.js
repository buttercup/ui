module.exports = {
    addons: ["@storybook/addon-actions", "@storybook/preset-scss"],
    core: {
        builder: "webpack5"
    },
    stories: ["../stories/index.js"],
    webpackFinal: async (config, {
        configType
    }) => {
        return {
            ...config,
            module: {
                ...config.module,
                rules: [
                    ...config.module.rules,
                    {
                        test: /\.m?js$/,
                        exclude: /(node_modules)/,
                        use: {
                            loader: 'babel-loader'
                        }
                    },
                    {
                        test: /\.dat$/,
                        use: [
                            'arraybuffer-loader'
                        ]
                    }
                ]
            },
            resolve: {
                ...config.resolve,
                fallback: {
                    crypto: false,
                    fs: false,
                    ...config.resolve.fallback
                }
            }
        };
    }
};
