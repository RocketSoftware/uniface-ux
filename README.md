# Uniface UX

[Uniface UX](https://docs.rocketsoftware.com/bundle/uniface_104/page/cdk1701320618627.html) (also called UX Widgets) is a repository containing a set of widgets that are implemented using the [UX Widget Interface](https://docs.rocketsoftware.com/bundle/uniface_104/page/eeu1700028296908.html). This widget set is provided by Rocket Software as part of its Uniface product and can be used to implement the Web UI widgets in DSP components.

Its public repository is available on GitHub at the following URL: https://github.com/RocketSoftware/uniface-ux.

UX Widgets is published under the BSD 3-Clause [License](LICENSE).

For more details, See [UX Widgets](https://docs.rocketsoftware.com/bundle/uniface_104/page/lzi1701171069984.html) 

For current release, see [RELEASENOTE.md](RELEASENOTE.md).

For a record of changes in earlier versions, see [CHANGELOG.md](CHANGELOG.md).

## Repository structure

This repository is the home of UX Widgets project and has a [NPM](https://www.npmjs.com/) project structure.

Here is its content:

```
uniface-ux/
  (dist/)                   // working folder for bundle build, ignored
  (node_modules/)           // working folder for npm packages, ignored
  src/                      // source folder
    fluentui/
    ux/                     // UX widgets
      framework/            // UX framework
        README.md           // framework documentation
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
  CHANGELOG.md              // the change log file
  RELEASENOTE.md            // the note on current release
  eslint.config.js          // ESLint configuration
  package-lock.json         // npm lock file
  package.json              // npm configuration
  webpack.common.js         // webpack common configuration
  webpack.dev.js            // webpack development configuration
  webpack.prod.js           // webpack production configuration
```

## Installation of UX Widgets project

First, users need to install npm, the Node.js package manager. For installation instructions See:
- [Downloading and installing Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-version-manager-to-install-nodejs-and-npm)

Next, users can install UX Widgets into their local development environment by the following these steps:
- Open a command prompt;
- Navigate to the directory where you want to set up your local Uniface UX project;
- Clone the project by the command: ```git clone git@github.com:RocketSoftware/uniface-ux.git```;
- Optionally, you can checkout a specific tag of older version from this repository;
- Run the command: ```npm install```, this will install all nessesary npm packages;

## How to build bundles

- Open a command prompt in your top folder uniface-ux of your local repository;
- Run command: ```npm run build```,
  This will build the bundles for production mode in the dist folder, including:
    - unifaceux.min.js, minimized unifaceux JavaScript bundle file
    - unifaceux.min.css, minimized UnifaceUX CSS bundle file
    - *.woff, icon font file
  
### Other commands for builds
- Run command: ```npm run lint```,
  This will run JavaScript lint for several sources.
- Run command: ```npm run build:dev```,
  This will build the bundles for development mode, including source map for easier debugging.
- Run command: ```npm run serve:dev```,
  This will start a web server with the dynamic development bundles.
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

## How to run the automated tests

See [testAutomation/README.md](testAutomation/README.md).

## How to integrate with the Uniface installation
As outlined above, developers can build the Uniface UX bundles themselves. Users can use these Uniface UX bundle files to update or replace the existing bundles in their Uniface installation.

Users can use these Uniface UX bundle files to update or replace the existing bundles in their Uniface installation.

Users should ensure that the UX Widget Interface Version (web.ini) of Uniface UX matches the version in their Uniface installation. If the versions differ, users are strongly adviced to verify compatibility, as mismatched versions may cause unexpected errors or unstable behaviors.

### How to deploy the self-built bundle files into the Uniface installation

Assume your Uniface installation is located in <UNIFACE_INSTALLATION_DIR> - for example "C:\Program Files\Uniface\Uniface 10 10.4.03". By default, the Uniface UX bundles are located in <UNIFACE_INSTALLATION_DIR>\uniface\webapps\uniface\common\ux.

To deploy your self-built unifaceux bundles, copy the content of unifaceux\dist to <UNIFACE_INSTALLATION_DIR>\uniface\webapps\uniface\common\ux, replacing the existing files.


## How the UX Widget Interface Version is related to the Uniface Version

### UX Widget Interface Version

With UX Widget Interface Version, Uniface informs UX Widgets what format of its API it communicates with the UX Widgets. UX Widgets must implement and be compatible with this version of the API. UX Widgets need to inform Uniface that they are compatible by specifying uxInterfaceVersion setting in the physical widget definition section of the web.ini file to the correct version. If the setting does not specify the expected version, Uniface can and will not invoke the UX widget and an $procerror is generated by the webdefinitions statement.

When the UX Widget Interface is updated, its version will be mentioned in the Uniface release note.
 

### Uniface Version

The current version of the uxInterfaceVersion setting is 2 introduced in Uniface 10.4.03.015. 

This overview represents the minimum Uniface patch/version required to maintain compatibility between UX Interface versions and Uniface versions.

| UX Interface Version  | Uniface Version |
| :--- | :--- |
| 1 (or absent)| 10.4.03.000 to 10.4.03.014 |
| 2 |  10.4.03.015 and higher |

When installing a patch that introduces a new uxInterfaceVersion, you need to update all existing UX Widgets according the new specification of the API and indicate that this is done by setting uxInterfaceVersion number in the physical widget definition section of the web.ini file accordingly.

To ease the transition, a compatibility utility is available that allows UX widgets of UX Interface Version 1 to work with version 2. For more information, see [UX Widget Interface Version 2](https://docs.rocketsoftware.com/bundle/uniface_104/page/hzv1743437471930.html) and [Compatibility Utility](https://docs.rocketsoftware.com/bundle/uniface_104/page/vlh1743437921753.html).


