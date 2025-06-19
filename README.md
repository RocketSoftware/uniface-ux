# UX Widgets

UX Widgets (or Uniface UX) is referred to a set of widgets that are implemented using the UX Widget Interface. This set is provided by Rocket Software, and is a part of its Uniface product, and it can be used to implement the Web UI widgets in DSP components.

For the detail of UX Widgets, see 
- UX Widgets,  Uniface Library 10.4
  https://docs.rocketsoftware.com/bundle/uniface_104/page/lzi1701171069984.html

## Repo structure

This repo is the home of UX Widgets project. And it has a [NPM](https://www.npmjs.com/) project structure.

Here is its content:

```
ux-widgets/
  (dist/)                   // working folder for bundle build, ignored
  (node_modules/)           // working folder for npm packages, ignored
  src/                      // source folder
    fluentui/
    ux/                     // UX widgets
      framework/            // UX framework sources
      [widget A]/           // UX widget A sources
      loader.js             // load UX widgets and register them to Uniface
      loader.css            // load all the CSS files related to the Uniface UX widgets
  test/                     // test folder
    helper/
      umockup.js            // test mockup and helper module
    modules/                // third party modules used by mocha framework
      chai/
      chai-dom/
      mocha/
      sinon/
    ux/                     // including the test modules for individual widgets
      test_ux_*.js
    index.html              // index page of tests
    test_ux_widgets.html    // test page for ux widget
  testAutomation/           // Prototype of test automation by playwright
    pageobjects/
    tests/
  README.md                 // this file
  CHANGELOG.md              // the change log file [CHANGELOG.md](CHANGELOG.md)
  RELEASE_NOTE.md           // the note on current release;
  eslint.config.js          // ESLint configuration
  package-lock.json         // npm lock file
  package.json              // npm configuration
  webpack.common.js         // webpack common configuration
  webpack.dev.js            // webpack development configuration
  webpack.prod.js           // webpack production configuration
```

## Installation of UX Widgets project

Users can install UX Widgets into their local development environment by the following step:
- Open a command prompt;
- Go to a directory where you want to locate your local UX Widgets project;
- Clone the project by the command: ```git clone <ux_widgets_repository_url>```;

## How to build bundles

- Open a command prompt in your top folder ux-widgets of your local UX Widgets repo;
- Run command: ```npm install```,
  This will install all nessesary npm packages;
- Run command: ```npm run lint```,
  This will run JavaScript lint for several sources;
- Run command: ```npm run build```,
  This will build the bundles for production mode in dist folder;
- Run command: ```npm run build:dev```,
  This will build the bundles for development mode, so with source map;
- Run command: ```npm run serve:dev```,
  This will build the bundles for development mode, start a web server and watch for source changes;
- Run command: ```npm run watch```,
  This will build the bundles for development mode and watch for source changes.

## How to start a HTTP server and open the test page

### Use npm HTTP servers
- Open a command prompt in top folder ux-widgets;
- Run command: ```npm run serve```,
  This will start http-server;
- Or run command: ```npm run serve:dev```,
  This will start webpack-dev-server;
- Open a browser with URL: http://localhost:9000/test/index.html

## How to integrate with the Uniface installation

### Configuration with Tomcat

- Clone this repository to your web server as a WebApp named ux-widgets
- Goto inside the WebApp ux-widgets
- Start your Uniface Tomcat
- Open a browser with URL: http://localhost:8080/ux-widgets/test/index.html

### TODO: more
