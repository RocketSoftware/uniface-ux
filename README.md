# Prototype for UX-Widget Unit Test
- by Ming
- 2024-03-28

## Configuration with Tomcat

- Clone this repository to your web server as a WebApp named uxunittest
- Goto inside the WebApp uxunittest
- Link your UX source folder as a symbolic link inside the WebApp: e.g.: mklink /j /d ux c:\USYS\10dev\uniface\webapps\uniface\ux
- Start your Uniface Tomcat
- Open a browser with URL: http://localhost:8080/uxunittest/unitest/test/testux01.html

## Files included

- README.md
- unittest/node_modules/chai
- unittest/node_modules/chai/chai.js
- unittest/node_modules/chai/LICENSE
- unittest/node_modules/mocha
- unittest/node_modules/mocha/LICENSE
- unittest/node_modules/mocha/mocha.css
- unittest/node_modules/mocha/mocha.js
- unittest/test/testux01.html
- unittest/test/test_ux_button.js
- unittest/test/umockup.js
