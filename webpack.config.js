const path = require('path');

module.exports = {
    entry: {
        index: "./js/index.js",
        login: "./js/login.js",
        signup: "./js/signup.js",
        dashboard: "./js/dashboard.js"
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].bundle.js"
    },
    resolve: {
        alias: {
          vue: 'vue/dist/vue.js'
        }
    }
};