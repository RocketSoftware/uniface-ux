# UX widget sources & tests

## How to start a HTTP server and open the test page

### Use npm HTTP servers
- Open a command prompt in top folder ux-widgets;
- Run command: ```npm run serve```,
  This will start http-server;
- Or run command: ```npm run serve:dev```,
  This will start webpack-dev-server;
- Open a browser with URL: http://localhost:9000/test/index.html

### Configuration with Tomcat

- Clone this repository to your web server as a WebApp named ux-widgets
- Goto inside the WebApp ux-widgets
- Start your Uniface Tomcat
- Open a browser with URL: http://localhost:8080/ux-widgets/test/index.html

## Folder structure

```
ux-widgets/
  (dist/)                   // working folder for bundle build, ignored
  (node_modules/)           // working folder for npm packages, ignored
  src/                      // source folder
    fluentui/
    ux/                     // Each UX widget source is organized into its own folder
      button/               // UX button sources
      checkbox/             // UX checkbox sources
      data_grid/
      ...
      framework/            // UX framework related sources
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
  eslint.config.js          // ESLint configuration
  package-lock.json         // npm lock file
  package.json              // npm configuration
  webpack.common.js         // webpack common configuration
  webpack.dev.js            // webpack development configuration
  webpack.prod.js           // webpack production configuration
```

## How to build bundles

- Open a command prompt in top folder ux-widgets;
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
