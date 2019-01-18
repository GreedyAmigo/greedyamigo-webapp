# greedyamigo-webapp

## (very short) description
Greedy Amigo lets you keep track of your lendings and loans from friends.
A lending can be about money or a thing.

## set up
###prerequisites
1. [npm](https://www.npmjs.com/get-npm)

###instructions
1. download repository from [github](https://github.com/GreedyAmigo/greedyamigo-webapp)
2. open command-line and navigate to the project root folder
3. execute `npm install`
4. execute `npm run build`
    + executes webpack in the background and bundles js files
5. a) for local execution: execute `npm run start:dev`
    + starts a local webserver that hosts the website on localhost:8080
5. b) for productive execution you need real a webserver to run the web application (like apache2), since redirection is not working with file paths.
   * [Apache2 installation instructions for Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-the-apache-web-server-on-ubuntu-16-04)
   * [Apache2 installation instructions for osX](https://medium.com/@JohnFoderaro/how-to-set-up-apache-in-macos-sierra-10-12-bca5a5dfffba)
   * [Apache2 installation instructions for Windows](https://httpd.apache.org/docs/2.4/platform/windows.html)

## used libraries
* [apollo-boost](https://www.npmjs.com/package/apollo-boost)
* [graphql](https://www.npmjs.com/package/graphql)
* [vue](https://www.npmjs.com/package/vue)
* [vue-apollo](https://www.npmjs.com/package/vue-apollo)
* [vuejs-datepicker](https://www.npmjs.com/package/vuejs-datepicker)
* [webpack](https://www.npmjs.com/package/webpack)
* [webpack-cli](https://www.npmjs.com/package/webpack-cli)
* [webpack-dev-server](https://www.npmjs.com/package/webpack-dev-server)
* and obviosly all their dependies which I am not going to list here (more info in package-lock.json file).

## additionally
If you want to see the application in action, you should visit [greedy-amigo.com](https://www.greedy-amigo.com)