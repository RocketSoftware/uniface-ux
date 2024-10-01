# UX widget sources & tests

## Configuration with Tomcat

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
    ux/
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
  package-lock.json         // npm lock file
  package.json              // npm configuration file
  webpack.config.js         // webpack configuration file
```

## How to build bundles

- Open a command prompt in top folder ux-widgets/;
- Run command: ```npm install```,
  This will install all nessesary npm packages;
- Run command: ```npm run build```,
  This will build the bundles in dist/ folder.
  
## Template and Guideline

See wiki page:
- UX Unit Test Templates/Guidelines - Uniface UX-Integration - Rocket Software Wiki
  https://wiki.rocketsoftware.com/pages/viewpage.action?pageId=458704944