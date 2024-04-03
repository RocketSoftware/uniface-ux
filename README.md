# Prototype for UX-Widget Unit Test
- by Ming
- 2024-03-28

## Directory "unittest"
Packaged as unittest.zip.

## Configuration with Uniface Tomcat

- Copy this directory unittest as $(Your Uniface Dir)\uniface\webapps\uniface\unittest;
- Check if there exists $(Your Uniface Dir)\uniface\webapps\uniface\unittest\test\testux01.html;
- Start your Uniface Tomcat;
- Open a browser with URL: http://localhost:8080/uniface/unittest/test/testux01.html

### Remark
- Your need have UX Widgets implementation JS files at $(Your Uniface Dir)
  \uniface\webapps\uniface\ux, (minimum, need ux/base.js and ux/button.js);
  This is the standard location of ux.

## Files included

unittest\Readme.md
unittest\node_modules\chai
unittest\node_modules\mocha
unittest\node_modules\chai\chai.js
unittest\node_modules\chai\LICENSE
unittest\node_modules\mocha\LICENSE
unittest\node_modules\mocha\mocha.css
unittest\node_modules\mocha\mocha.js
unittest\test\testux01.html
unittest\test\test_ux_button.js
unittest\test\umockup.js

