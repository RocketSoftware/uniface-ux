# UX widget sources & tests

## Configuration with Tomcat

- Clone this repository to your web server as a WebApp named ux-widgets
- Goto inside the WebApp ux-widgets
- Start your Uniface Tomcat
- Open a browser with URL: http://localhost:8080/ux-widgets/test/index.html

## Folder structure

```
ux-widgets/
  (dist/)          //working folder for bundle build, ignored
  (node_modules/)  //working folder for npm packages, ignored
  src/
    fluentui/
    ux/
    ux-old/   
  test/
    helper/
      umockup.js
    modules/
    ux/
      test_ux_*.js
    index.html
    test_ux_widgets.html
  testAutomation/
    pageobjects/
    tests/
  README.md   // this file
```

## How to build bundles

- Open a command prompt in top folder ux-widgets/;
- Run command: npm install
  This will install all nessesary npm packages;
- Run command: npm run build
  This will build the bundles in dist/ folder.
  
## Template and Guideline

See wiki page:
- UX Unit Test Templates/Guidelines - Uniface UX-Integration - Rocket Software Wiki
  https://wiki.rocketsoftware.com/pages/viewpage.action?pageId=458704944