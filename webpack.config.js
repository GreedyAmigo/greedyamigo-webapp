const path = require('path');

module.exports = {
    entry: {
        login: "./js/login.js"
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