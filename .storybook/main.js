module.exports = {
    addons: ["@storybook/addon-actions", "@storybook/preset-scss"],
    core: {
        builder: "webpack5"
    },
    stories: ["../stories/index.js"]
};
