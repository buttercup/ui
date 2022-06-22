const webpackConfig = require("./webpack.config.js");

const CI =  !!process.env.CI;

delete webpackConfig.entry;
delete webpackConfig.output;
delete webpackConfig.externals;
webpackConfig.mode = process.env.BUNDLE === "production" ? "production" : "development";

module.exports = config => config.set({

    basePath: __dirname,

    browsers: CI ? ["ChromeHeadless", "FirefoxHeadless"] : ["FirefoxHeadless"],

    captureTimeout: 30000,

    colors: true,

    coverageReporter: {
        dir: "coverage/",
        reporters: [
            { type: "html" },
            { type: "text" },
            { type: "text-summary" }
        ]
    },

    exclude: [],

    files: [
        { pattern: "test/specs/**/*.spec.js" }
    ],

    frameworks: ["mocha", "chai", "sinon", "webpack"],

    plugins: [
        require("karma-chai"),
        require("karma-chrome-launcher"),
        require("karma-firefox-launcher"),
        require("karma-mocha"),
        require("karma-sinon"),
        require("karma-spec-reporter"),
        require("karma-webpack")
    ],

    preprocessors: {
        "*.js": ["webpack"],
        "*.jsx": ["webpack"],
        "test/specs/**/*.spec.js": ["webpack"]
    },

    reporters: ["spec", "progress"],

    singleRun: true,

    webpack: webpackConfig

});
