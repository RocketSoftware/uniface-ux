/* global chai, describe, it, beforeEach, afterEach, sinon, UNIFACE */

/**
 * AttributeTheme is retrieved from the webpack bundle via the registered
 * HeaderFooter widget's structure, rather than importing the source file
 * directly. Direct source imports fail in CI because the import chain
 * reaches bare-specifier npm packages (@fluentui/web-components,
 * @microsoft/fast-colors, @microsoft/fast-components) that resolve via
 * the importmap to node_modules paths not served in CI environments.
 */
const HeaderFooter = UNIFACE.ClassRegistry.get("UX.HeaderFooter");
const AttributeTheme = HeaderFooter.structure.childWorkers
  .find(w => w.styleClass === "u-header").childWorkers
  .find(w => w.theme !== undefined).constructor;

(function () {
  "use strict";

  const expect = chai.expect;

  /**
   * MockWidgetClass - mimics a widget class with static registries
   * that workers register into during construction.
   */
  class MockWidgetClass {
    static defaultValues = {};
    static setters = {};
    static getters = {};
    static triggers = {};
    static structure = {
      "childWorkers": []
    };
  }

  /**
   * Creates a mock design token with setValueFor stub.
   * @returns {object} Mock design token.
   */
  function createMockToken() {
    return {
      "setValueFor": sinon.stub()
    };
  }

  describe("AttributeTheme", function () {

    let worker;
    const testTheme = {
      "light": {
        "neutral": "#808080",
        "accent": "#0078d4",
        "luminance": 0.95
      },
      "dark": {
        "neutral": "#b0b0b0",
        "accent": "#4fc3f7",
        "luminance": 0.18
      }
    };

    beforeEach(function () {
      worker = new AttributeTheme(MockWidgetClass, testTheme);
    });

    afterEach(function () {
      delete document.documentElement.dataset.uColorMode;
      sinon.restore();
    });

    describe("constructor()", function () {

      it("should store the theme configuration", function () {
        const w = new AttributeTheme(MockWidgetClass, testTheme);
        expect(w.theme, "Theme should be stored on the worker.").to.equal(testTheme);
      });

      it("should keep a reference to the widget class", function () {
        const w = new AttributeTheme(MockWidgetClass, testTheme);
        expect(w.widgetClass, "Widget class should be retained by WorkerBase.").to.equal(MockWidgetClass);
      });

    });

    describe("setColorToken()", function () {

      it("should set the token value on the target element", function () {
        const element = document.createElement("div");
        const mockToken = createMockToken();
        worker.setColorToken(element, mockToken, "#ff0000");
        expect(mockToken.setValueFor.calledOnce, "setValueFor should be called once for valid hex.").to.be.true;
        expect(mockToken.setValueFor.firstCall.args[0], "First arg should be the element.").to.equal(element);
      });

      it("should not set the token value for invalid hex", function () {
        const element = document.createElement("div");
        const mockToken = createMockToken();
        const warnSpy = sinon.spy(worker, "warn");
        const consoleSpy = sinon.spy(console, "warn");
        worker.setColorToken(element, mockToken, "invalid");
        expect(mockToken.setValueFor.called, "setValueFor should not be called for invalid hex.").to.be.false;
        expect(warnSpy.calledOnce, "warn should be called once for invalid hex.").to.be.true;
        expect(consoleSpy.called, "console.warn should be called for invalid hex.").to.be.true;
        expect(consoleSpy.lastCall.args.join(" "), "console.warn output should contain the expected message.").to.include("Invalid hex color 'invalid'");
        expect(consoleSpy.lastCall.args.join(" "), "console.warn output should contain the action.").to.include("Ignored");
      });

    });

    describe("resolveColorMode()", function () {

      it("should return dark when html data-u-color-mode is dark", function () {
        document.documentElement.dataset.uColorMode = "dark";
        expect(worker.resolveColorMode(), "Resolved mode should be dark.").to.equal("dark");
      });

      it("should return light when html data-u-color-mode is light", function () {
        document.documentElement.dataset.uColorMode = "light";
        expect(worker.resolveColorMode(), "Resolved mode should be light.").to.equal("light");
      });

      it("should resolve auto mode to dark when media query matches", function () {
        document.documentElement.dataset.uColorMode = "auto";
        sinon.stub(window, "matchMedia").returns({ "matches": true });
        expect(worker.resolveColorMode(), "Auto mode should resolve to dark.").to.equal("dark");
      });

      it("should resolve auto mode to light when media query does not match", function () {
        document.documentElement.dataset.uColorMode = "auto";
        sinon.stub(window, "matchMedia").returns({ "matches": false });
        expect(worker.resolveColorMode(), "Auto mode should resolve to light.").to.equal("light");
      });

      it("should return light for unknown html data-u-color-mode value", function () {
        document.documentElement.dataset.uColorMode = "unknown";
        expect(worker.resolveColorMode(), "Unknown value should fallback to light.").to.equal("light");
      });

      it("should return light when html data-u-color-mode is absent", function () {
        delete document.documentElement.dataset.uColorMode;
        expect(worker.resolveColorMode(), "Absent attribute should fallback to light.").to.equal("light");
      });

    });

    describe("applyTokens()", function () {

      it("should return early when element is null", function () {
        const spy = sinon.spy(worker, "setColorToken");
        worker.applyTokens(null, { "neutral": "#808080" });
        expect(spy.called, "setColorToken should not be called when element is null.").to.be.false;
      });

      it("should return early when theme is null", function () {
        const element = document.createElement("div");
        const spy = sinon.spy(worker, "setColorToken");
        worker.applyTokens(element, null);
        expect(spy.called, "setColorToken should not be called when theme is null.").to.be.false;
      });

      it("should return early when element is undefined", function () {
        const spy = sinon.spy(worker, "setColorToken");
        worker.applyTokens(undefined, { "neutral": "#808080" });
        expect(spy.called, "setColorToken should not be called when element is undefined.").to.be.false;
      });

      it("should return early when theme is undefined", function () {
        const element = document.createElement("div");
        const spy = sinon.spy(worker, "setColorToken");
        worker.applyTokens(element, undefined);
        expect(spy.called, "setColorToken should not be called when theme is undefined.").to.be.false;
      });

      it("should call setColorToken for neutral when theme has neutral", function () {
        const element = document.createElement("div");
        const spy = sinon.spy(worker, "setColorToken");
        worker.applyTokens(element, { "neutral": "#808080" });
        expect(spy.calledOnce, "setColorToken should be called once for neutral.").to.be.true;
        expect(spy.firstCall.args[0], "First arg should be the element.").to.equal(element);
        expect(spy.firstCall.args[1], "Second arg should be a token object.").to.exist;
        expect(spy.firstCall.args[1].setValueFor, "Token should have setValueFor method.").to.be.a("function");
        expect(spy.firstCall.args[2], "Third arg should be the neutral hex.").to.equal("#808080");
      });

      it("should call setColorToken for accent when theme has accent", function () {
        const element = document.createElement("div");
        const spy = sinon.spy(worker, "setColorToken");
        worker.applyTokens(element, { "accent": "#0078d4" });
        expect(spy.calledOnce, "setColorToken should be called once for accent.").to.be.true;
        expect(spy.firstCall.args[0], "First arg should be the element.").to.equal(element);
        expect(spy.firstCall.args[1], "Second arg should be a token object.").to.exist;
        expect(spy.firstCall.args[1].setValueFor, "Token should have setValueFor method.").to.be.a("function");
        expect(spy.firstCall.args[2], "Third arg should be the accent hex.").to.equal("#0078d4");
      });

      it("should call setColorToken for both neutral and accent when theme has both", function () {
        const element = document.createElement("div");
        const spy = sinon.spy(worker, "setColorToken");
        worker.applyTokens(element, {
          "neutral": "#808080",
          "accent": "#0078d4"
        });
        expect(spy.calledTwice, "setColorToken should be called twice for neutral and accent.").to.be.true;
        expect(spy.firstCall.args[1], "First call should pass a token object.").to.exist;
        expect(spy.firstCall.args[1].setValueFor, "First token should have setValueFor method.").to.be.a("function");
        expect(spy.firstCall.args[2], "First call should use neutral hex.").to.equal("#808080");
        expect(spy.secondCall.args[1], "Second call should pass a token object.").to.exist;
        expect(spy.secondCall.args[1].setValueFor, "Second token should have setValueFor method.").to.be.a("function");
        expect(spy.secondCall.args[2], "Second call should use accent hex.").to.equal("#0078d4");
      });

      it("should not call setColorToken when theme has no neutral or accent", function () {
        const element = document.createElement("div");
        const spy = sinon.spy(worker, "setColorToken");
        worker.applyTokens(element, { "luminance": 0.5 });
        expect(spy.called, "setColorToken should not be called for luminance-only theme.").to.be.false;
      });

      it("should accept a numeric luminance value", function () {
        const element = document.createElement("div");
        expect(() => worker.applyTokens(element, { "luminance": 0.95 }), "Should not throw for numeric luminance.").to.not.throw();
      });

      it("should handle a theme with no luminance property", function () {
        const element = document.createElement("div");
        expect(() => worker.applyTokens(element, { "neutral": "#808080" }), "Should not throw when luminance is absent.").to.not.throw();
      });

      it("should not call setColorToken when theme is an empty object", function () {
        const element = document.createElement("div");
        const spy = sinon.spy(worker, "setColorToken");
        expect(() => worker.applyTokens(element, {}), "Should not throw for empty theme object.").to.not.throw();
        expect(spy.called, "setColorToken should not be called for empty theme.").to.be.false;
      });

    });

    describe("initializeLayout()", function () {

      it("should call applyTokens with the widget element and the resolved theme", function () {
        const widgetElement = document.createElement("div");
        const applyTokensSpy = sinon.spy(worker, "applyTokens");
        worker.initializeLayout(widgetElement);
        expect(applyTokensSpy.calledOnce, "applyTokens should be called once.").to.be.true;
        expect(applyTokensSpy.firstCall.args[0], "First arg should be the widget element.").to.equal(widgetElement);
        expect(applyTokensSpy.firstCall.args[1], "Second arg should be the light theme.").to.equal(testTheme.light);
      });

      it("should use dark theme when html data-u-color-mode is dark", function () {
        document.documentElement.setAttribute("data-u-color-mode", "dark");
        const widgetElement = document.createElement("div");
        const applyTokensSpy = sinon.spy(worker, "applyTokens");
        worker.initializeLayout(widgetElement);
        expect(applyTokensSpy.firstCall.args[1], "Second arg should be the dark theme.").to.equal(testTheme.dark);
      });

      it("should use querySelector result when elementQuerySelector is set", function () {
        const widgetElement = document.createElement("div");
        const childElement = document.createElement("section");
        childElement.classList.add("u-main");
        widgetElement.appendChild(childElement);
        worker.setElementQuerySelector(".u-main");
        const applyTokensSpy = sinon.spy(worker, "applyTokens");
        worker.initializeLayout(widgetElement);
        expect(applyTokensSpy.calledOnce, "applyTokens should be called once.").to.be.true;
        expect(applyTokensSpy.firstCall.args[0], "First arg should be the queried child element.").to.equal(childElement);
      });

      it("should return early when querySelector returns null", function () {
        const widgetElement = document.createElement("div");
        worker.setElementQuerySelector(".nonexistent");
        const applyTokensSpy = sinon.spy(worker, "applyTokens");
        worker.initializeLayout(widgetElement);
        expect(applyTokensSpy.called, "applyTokens should not be called when element is null.").to.be.false;
      });

      // widgetElement is always expected; if not present, the widget is expected to crash.
      it("should throw when widgetElement is null and elementQuerySelector is set", function () {
        worker.setElementQuerySelector(".u-main");
        expect(function () {
          worker.initializeLayout(null);
        }).to.throw(TypeError);
      });

      it("should re-apply tokens when color-mode-change event resolves to dark", function () {
        const widgetElement = document.createElement("div");
        const applyTokensSpy = sinon.spy(worker, "applyTokens");
        worker.initializeLayout(widgetElement);

        document.documentElement.dispatchEvent(new window.CustomEvent("color-mode-change", {
          "detail": {
            "resolvedMode": "dark"
          }
        }));

        expect(applyTokensSpy.callCount, "applyTokens should run for init and event.").to.equal(2);
        expect(applyTokensSpy.lastCall.args[0], "Event should target the same element.").to.equal(widgetElement);
        expect(applyTokensSpy.lastCall.args[1], "Event should apply dark theme.").to.equal(testTheme.dark);
      });

      it("should ignore color-mode-change event when resolved mode is unsupported", function () {
        const widgetElement = document.createElement("div");
        const applyTokensSpy = sinon.spy(worker, "applyTokens");
        worker.initializeLayout(widgetElement);
        const callsAfterInit = applyTokensSpy.callCount;

        document.documentElement.dispatchEvent(new window.CustomEvent("color-mode-change", {
          "detail": {
            "resolvedMode": "sepia"
          }
        }));

        expect(applyTokensSpy.callCount, "Call count should stay unchanged for unsupported mode.").to.equal(callsAfterInit);
      });
    });
  });
})();

