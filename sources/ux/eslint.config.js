/* global module */

module.exports = [
  {
    "languageOptions": {
      "ecmaVersion": 2022,
      "sourceType": "module",
      "globals": {
        // Manually adding necessary browser globals
        "console": "readonly",
        "window": "readonly",
        "document": "readonly",
        "HTMLElement": "readonly",
        "HTMLInputElement": "readonly"
      }
    },
    "rules": {
      // loosen eslint:recommended
      "no-prototype-builtins": "off",
      "no-unused-vars": [
        "warn",
        {
          "argsIgnorePattern": "^_"
        }
      ],
      "indent": [
        "error",
        2,
        {
          "SwitchCase": 1,
          "ObjectExpression": "first"
        }
      ],
      "no-console": "off",
      "no-const-assign": "warn",
      "no-extra-semi": "warn",
      "semi": 2,
      "no-fallthrough": "warn",
      "no-eval": "error",
      "no-redeclare": "off",
      "no-this-before-super": "error",
      "no-undef": "warn",
      "no-unreachable": "error",
      "no-use-before-define": "off",
      "constructor-super": "error",
      "curly": "warn",
      "eqeqeq": ["warn", "smart"],
      "func-names": "off",
      "valid-typeof": "error",
      "object-property-newline": "warn",
      "brace-style": [
        "warn",
        "1tbs",
        {
          "allowSingleLine": false
        }
      ],
      "space-before-function-paren": [
        "warn",
        {
          "anonymous": "ignore",
          "named": "never",
          "asyncArrow": "always"
        }
      ],
      "space-in-parens": ["warn", "never"],
      "no-tabs": "warn",
      "no-trailing-spaces": "warn",
      "one-var-declaration-per-line": "warn",
      "quote-props": ["error", "always"], // Forces quotes around all object keys
      "lines-around-comment": [
        "warn",
        {
          "beforeBlockComment": true
        }
      ],
      "spaced-comment": [
        "warn",
        "always",
        {
          "exceptions": ["*", "-", "/"]
        }
      ],
      "comma-dangle": ["warn", "never"]
    }
  },
  {
    "files": ["utest/widgets/*.js"],
    "parserOptions": {
      "ecmaVersion": 2022
    }
  }
];