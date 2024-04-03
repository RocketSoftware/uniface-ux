# Prototype for UX-Widget Unit Test
- by Ming
- 2024-03-28

## Configuration with Uniface Tomcat

- Copy this directory unittest as $(Your Uniface Dir)\uniface\webapps\uniface\unittesting;
- Check if there exists $(Your Uniface Dir)\uniface\webapps\uniface\unittesting\test\testux01.html;
- Start your Uniface Tomcat;
- Open a browser with URL: http://localhost:8080/uniface/unittesting/test/testux01.html

### Remark

- Your need have UX Widgets implementation JS files at $(Your Uniface Dir)
  \uniface\webapps\uniface\ux, (minimum, need ux/base.js and ux/button.js);
  This is the standard location of ux.

## Files included

- README.md
- node_modules/chai
- node_modules/chai/chai.js
- node_modules/chai/LICENSE
- node_modules/mocha
- node_modules/mocha/LICENSE
- node_modules/mocha/mocha.css
- node_modules/mocha/mocha.js
- test/testux01.html
- test/test_ux_button.js
- test/umockup.js

