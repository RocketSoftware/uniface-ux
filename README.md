# Uniface UX

Uniface UX (for more specific, also called UX Widgets) is referred to a repository and a project for a set of widgets that are implemented using the UX Widget Interface. This set is provided by Rocket Software, as part of its Uniface product, and can be used to 
implement the Web UI widgets in DSP components.

Its public repository is available on GitHub at the following URL: https://github.com/RocketSoftware/uniface-ux.

UX Widgets is published under the BSD 3-Clause [License](LICENSE).

For the detail of UX Widgets, see 
- UX Widgets, Uniface Library 10.4
  https://docs.rocketsoftware.com/bundle/uniface_104/page/lzi1701171069984.html

For current release, see [RELEASENOTE.md](RELEASENOTE.md).

For a record of changes in earlier versions, please refer to the CHANGELOG.md file, see [CHANGELOG.md](CHANGELOG.md).

For the detail of UX Widgets, see 
- UX Widgets, Uniface Library 10.4
  https://docs.rocketsoftware.com/bundle/uniface_104/page/lzi1701171069984.html

## Repo structure

This repo is the home of UX Widgets project and has a [NPM](https://www.npmjs.com/) project structure.

Here is its content:

```
ux-widgets/
  (dist/)                   // working folder for bundle build, ignored
  (node_modules/)           // working folder for npm packages, ignored
  src/                      // source folder
    fluentui/
    ux/                     // UX widgets
      framework/            // UX framework sources
        workers/            // UX framework workers sources
          [worker A]        // UX framework worker A source
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
  RELEASENOTE.md            // the note on current release;
  eslint.config.js          // ESLint configuration
  package-lock.json         // npm lock file
  package.json              // npm configuration
  webpack.common.js         // webpack common configuration
  webpack.dev.js            // webpack development configuration
  webpack.prod.js           // webpack production configuration
```

## Installation of UX Widgets project

First, users need install npm, the Node.js package manager. For installation instructions See:
- Downloading and installing Node.js and npm | npm Docs
  https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-version-manager-to-install-nodejs-and-npm

Next, users can install UX Widgets into their local development environment by the following these steps:
- Open a command prompt;
- Navigate to the directory where you want to set up your local UX Widgets project;
- Clone the project by the command: ```git clone https://github.com/RocketSoftware/uniface-ux```;
- Optionally, you can checkout a specific tag of older version from this repo;
- Run command: ```npm install```,
  This will install all nessesary npm packages;

## How to build bundles

- Open a command prompt in your top folder ux-widgets of your local UX Widgets repo;
- Run command: ```npm run build```,
  This will build the bundles for production mode in dist folder, including:
    - unifaceux.min.js, minimized unifaceux JavaScript bundle file
    - unifaceux.min.css, minimized UnifaceUX CSS bundle file
    - *.woff, Icon image file
  
### Other commands for builds
- Run command: ```npm run lint```,
  This will run JavaScript lint for several sources;
- Run command: ```npm run build:dev```,
  This will build the bundles for development mode, including source map for easier debugging;
- Run command: ```npm run serve:dev```,
  This will start a web server with a dynamic development bundles;
- Run command: ```npm run watch```,
  This will build the bundles for development mode and watch for source changes.


## How to start a HTTP server and open the test page in project

### Use npm HTTP servers
- Open a command prompt in top folder ux-widgets;
- Run command: ```npm run serve```,
  This will start http-server;
- Or run command: ```npm run serve:dev```,
  This will start webpack-dev-server;
- Open a browser with URL: http://localhost:9000/test/index.html

### Configuration with Tomcat as a standalone web application

- Clone this repository to your web server as a WebApp named ux-widgets
- Goto inside the WebApp ux-widgets
- Start your Uniface Tomcat
- Open a browser with URL: http://localhost:8080/ux-widgets/test/index.html

## How to run the automated tests

See [testAutomation/README.md](testAutomation/README.md).


## How to integrate with the Uniface installation
As outlined above, developers can build the Uniface UX bundles themselves. The resulting bundles will be generated in the dist subdirectory and include the following files:
    - unifaceux.min.js, minimized unifaceux JavaScript bundle file
    - unifaceux.min.css, minimized UnifaceUX CSS bundle file
    - *.woff, Icon image file

Users can use these Uniface UX bundle files to update or replace the existing bundles in their Uniface installation.

Users should ensure that the UX Widget Interface Version (web.ini) of Uniface UX matches the version in their Uniface installation. Both versions should be identical. If they differ, users are strongly adviced to verify compatibility. Using mismatched versions may lead to unexpected errors or unstable behaviors.

### How to deploy the self-built bundle files into the Uniface installation

Suppose your Uniface installation is located in ${UNIFACE_INSTALLATION_DIR} - for example "C:\Program Files\Uniface\Uniface10403". By default, the Uniface UX bundles are located in ${UNIFACE_INSTALLATION_DIR}\uniface\webapps\uniface\common\ux.

To deploy your self-built unifaceux bundles, copy the content of unifaceux\dist to ${UNIFACE_INSTALLATION_DIR}\uniface\webapps\uniface\common\ux, replacing the existing files.

