# greedyamigo-webapp

## (very short) description
Greedy Amigo lets you keep track of your lendings and loans from friends.
A lending can be about money or a thing.

## additionally
If you want to see the application in action, you should visit [greedy-amigo.com](https://www.greedy-amigo.com)

## set up instructions
1. download repository from [github](https://github.com/GreedyAmigo/greedyamigo-webapp)
2. open command-line and navigate to the project root folder
3. execute `npm install`
4. execute `npm run build` (executes webpack in the background and bundles js files)
5. you need a webserver to run the web application (like apache2), since redirection is not working with file paths.
    * [Apache2 installation instructions for Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-the-apache-web-server-on-ubuntu-16-04)
    * [Apache2 installation instructions for osX](https://medium.com/@JohnFoderaro/how-to-set-up-apache-in-macos-sierra-10-12-bca5a5dfffba)
    * [Apache2 installation instructions for Windows](https://httpd.apache.org/docs/2.4/platform/windows.html)

Initially, I wanted to add a npm package that enables local development hosting out of the box without apache2 or third-party webservers, but out ot time pressure and simplicity I did not do this.