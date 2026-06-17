/* global chai, describe, it, beforeEach, afterEach, sinon, UNIFACE */

(function () {
  "use strict";

  const expect = chai.expect;
  const HeaderFooter = UNIFACE.ClassRegistry.get("UX.HeaderFooter");

  function getSectionSlotConfig(styleClass) {
    const section = HeaderFooter.structure.childWorkers.find(w => w.styleClass === styleClass);
    return section?.childWorkers.find(w => w.slotConfig !== undefined)?.slotConfig;
  }

  function getSlotConfig() {
    return getSectionSlotConfig("u-main");
  }

  function getIndexRules() {
    const slotConfig = getSlotConfig();
    expect(slotConfig, "slotConfig should be available to read indexRules.").to.exist;
    expect(slotConfig.indexRules, "slotConfig.indexRules should be available.").to.exist;
    return slotConfig.indexRules;
  }

  function createHeaderFooterShell() {
    const shell = document.createElement("uf-shell");
    shell.className = "u-header-footer";

    const header = document.createElement("uf-header");
    header.className = "u-header";
    shell.appendChild(header);

    const main = document.createElement("uf-main");
    main.className = "u-main";
    shell.appendChild(main);

    const footer = document.createElement("uf-footer");
    footer.className = "u-footer";
    footer.setAttribute("placement", "sticky");
    shell.appendChild(footer);

    return {
      shell,
      header,
      main,
      footer
    };
  }

  describe("HeaderFooter", function () {

    describe("Class registration", function () {

      it("should load the HeaderFooter widget class", function () {
        expect(HeaderFooter, "HeaderFooter widget class should be registered.").to.exist;
      });
    });

    describe("Static members", function () {

      it("should have subWidgets as an empty object", function () {
        expect(HeaderFooter.subWidgets, "subWidgets should be an empty object.").to.deep.equal({});
      });

      it("should have subWidgetWorkers as an empty array", function () {
        expect(HeaderFooter.subWidgetWorkers, "subWidgetWorkers should be an empty array.").to.deep.equal([]);
      });

      it("should have a structure property", function () {
        expect(HeaderFooter.structure, "structure should be defined.").to.exist;
      });

      it("should have defaultValues as a non-empty object", function () {
        expect(HeaderFooter.defaultValues, "defaultValues should be a non-empty object.").to.not.be.empty;
      });

      it("should have setters as a non-empty object", function () {
        expect(HeaderFooter.setters, "setters should be a non-empty object.").to.not.be.empty;
      });

      it("should have getters as an object", function () {
        expect(HeaderFooter.getters, "getters should be an object.").to.be.an("object");
      });

      it("should have triggers as an object", function () {
        expect(HeaderFooter.triggers, "triggers should be an object.").to.be.an("object");
      });

      it("should have uiBlocking as an empty string", function () {
        expect(HeaderFooter.uiBlocking, "uiBlocking should be an empty string.").to.equal("");
      });

      it("should define defaultTheme for header and footer", function () {
        expect(HeaderFooter.defaultTheme, "defaultTheme should be an object.").to.be.an("object");
        expect(HeaderFooter.defaultTheme, "defaultTheme should define both header and footer themes.").to.include.all.keys("header", "footer");
      });

      it("should define expected defaultTheme values", function () {
        expect(HeaderFooter.defaultTheme.header).to.deep.equal({
          "neutral": "#0078d4",
          "accent": "#4A9EFF",
          "luminance": 0.23
        });
        expect(HeaderFooter.defaultTheme.footer).to.deep.equal({
          "neutral": "#808080",
          "accent": "#0078d4",
          "luminance": 0.9
        });
      });
    });

    describe("Static #slotConfig configuration", function () {

      it("should expose expected #slotConfig shape via HeaderFooter structure", function () {
        const slotConfig = getSlotConfig();

        expect(slotConfig, "#slotConfig should exist in HeaderFooter structure (indirectly).").to.exist;
        expect(slotConfig.propertyName, "#slotConfig.propertyName should match expected property mapping.").to.equal("area-slot");
        expect(slotConfig.defaultSlot, "#slotConfig.defaultSlot should match expected fallback slot.").to.equal("main");
        expect(slotConfig.validSlots, "#slotConfig.validSlots should include all supported slots.").to.deep.equal(["header", "main", "footer"]);
        expect(slotConfig.indexRules, "#slotConfig.indexRules should be defined.").to.be.an("object");
      });
    });

    describe("generateIndexRule() and createDynamicIndexRules()", function () {

      it("should expose indexRules as a proxy object from createDynamicIndexRules()", function () {
        const indexRules = getIndexRules();
        expect(indexRules, "indexRules should be an object.").to.be.an("object");
      });

      [
        {
          "count": 1,
          "expected": { "main": [0] }
        },
        {
          "count": 2,
          "expected": {
            "header": [0],
            "main": [1]
          }
        },
        {
          "count": 3,
          "expected": {
            "header": [0],
            "main": [1],
            "footer": [2]
          }
        },
        {
          "count": 4,
          "expected": {
            "header": [0],
            "main": [1, 2],
            "footer": [3]
          }
        }
      ].forEach(function ({ count, expected }) {
        it(`should generate the correct rule (generateIndexRule() logic) for ${count} child(ren)`, function () {
          const rule = getIndexRules()[count];
          expect(rule).to.deep.equal(expected);
        });
      });

      it("should generate the correct boundary rule for 10 children", function () {
        const rule = getIndexRules()[10];
        expect(rule).to.have.property("header").that.deep.equals([0]);
        expect(rule).to.have.property("main").that.deep.equals([1, 2, 3, 4, 5, 6, 7, 8]);
        expect(rule).to.have.property("footer").that.deep.equals([9]);
      });

      it("should generate the correct boundary rule for 100 children", function () {
        const rule = getIndexRules()[100];
        expect(rule).to.have.property("header").that.deep.equals([0]);
        expect(rule).to.have.property("main").that.is.an("array").with.lengthOf(98);
        expect(rule).to.have.property("footer").that.deep.equals([99]);
        expect(rule.main[0]).to.equal(1);
        expect(rule.main[97]).to.equal(98);
      });

      it("should create a fresh rule object on every proxy read", function () {
        const indexRules = getIndexRules();
        const first = indexRules[4];
        const second = indexRules[4];

        expect(first, "Repeated reads should return equivalent rule content.").to.deep.equal(second);
        expect(first, "Repeated reads should not return the same object instance.").to.not.equal(second);
      });

      it("should return undefined for invalid child counts", function () {
        const indexRules = getIndexRules();

        expect(indexRules[0], "Rule for 0 children should be undefined.").to.equal(undefined);
        expect(indexRules[-1], "Rule for negative child counts should be undefined.").to.equal(undefined);
      });

      it("should return undefined for non-numeric keys", function () {
        const indexRules = getIndexRules();

        expect(indexRules.foo, "Rule for non-numeric key should be undefined.").to.equal(undefined);
        expect(indexRules["header"], "Rule for string section key should be undefined.").to.equal(undefined);
      });

      it("should support has-trap checks only for positive numeric counts", function () {
        const indexRules = getIndexRules();

        expect("1" in indexRules, "Proxy should report true for valid positive count.").to.equal(true);
        expect("10" in indexRules, "Proxy should report true for another valid positive count.").to.equal(true);
        expect("0" in indexRules, "Proxy should report false for zero.").to.equal(false);
        expect("-2" in indexRules, "Proxy should report false for negative count.").to.equal(false);
        expect("main" in indexRules, "Proxy should report false for non-numeric keys.").to.equal(false);
      });
    });

    describe("Instance methods", function () {
      describe("applyColorPalette()", function () {

        it("should not throw for valid colors", function () {
          const element = document.createElement("div");
          expect(function () {
            HeaderFooter.prototype.applyColorPalette.call({}, element, "#0078d4", "#4A9EFF", 0.5);
          }, "applyColorPalette() should not throw for valid colors.").to.not.throw();
        });

        it("should not throw for invalid hex color", function () {
          const element = document.createElement("div");
          expect(function () {
            HeaderFooter.prototype.applyColorPalette.call({}, element, "not-a-color", "#4A9EFF", 0.5);
          }, "applyColorPalette() should handle invalid neutral color gracefully.").to.not.throw();
        });
      });

      describe("applyDefaultTheme()", function () {
        let fixture;

        beforeEach(function () {
          fixture = createHeaderFooterShell();
        });

        afterEach(function () {
          fixture.shell.remove();
        });

        it("should call applyColorPalette() for themed header section", function () {
          const applyColorPaletteSpy = sinon.spy();
          const context = {
            "applyColorPalette": applyColorPaletteSpy
          };

          HeaderFooter.prototype.applyDefaultTheme.call(context, fixture.shell, "header");

          expect(applyColorPaletteSpy.calledOnce, "applyColorPalette() should be called exactly once for header.").to.equal(true);
          expect(applyColorPaletteSpy.firstCall.args[0].classList.contains("u-header"), "Target element should be header section.").to.equal(true);
          expect(applyColorPaletteSpy.firstCall.args[1], "Header neutral color should match default theme.").to.equal("#0078d4");
          expect(applyColorPaletteSpy.firstCall.args[2], "Header accent color should match default theme.").to.equal("#4A9EFF");
          expect(applyColorPaletteSpy.firstCall.args[3], "Header luminance should match default theme.").to.equal(0.23);
        });

        it("should not call applyColorPalette() for section without theme", function () {
          const applyColorPaletteSpy = sinon.spy();
          const context = {
            "applyColorPalette": applyColorPaletteSpy
          };

          HeaderFooter.prototype.applyDefaultTheme.call(context, fixture.shell, "main");

          expect(applyColorPaletteSpy.notCalled, "applyColorPalette() should not be called for non-themed section.").to.equal(true);
        });

        it("should not call applyColorPalette() when themed section element does not exist", function () {
          const applyColorPaletteSpy = sinon.spy();
          const context = {
            "applyColorPalette": applyColorPaletteSpy
          };

          fixture.header.remove();
          HeaderFooter.prototype.applyDefaultTheme.call(context, fixture.shell, "header");

          expect(applyColorPaletteSpy.notCalled, "applyColorPalette() should not be called when section element is missing.").to.equal(true);
        });
      });

      describe("handleStickyPlacement()", function () {
        let fixture;
        let parentHeaderFooter;

        function createWindowStubs(options = {}) {
          const {
            onAddEventListener,
            onGetComputedStyle,
            onObserve
          } = options;

          const addEventListenerStub = sinon.stub(window, "addEventListener").callsFake(function (eventName, callback) {
            if (typeof onAddEventListener === "function") {
              onAddEventListener(eventName, callback);
            }
          });

          const getComputedStyleStub = sinon.stub(window, "getComputedStyle").callsFake(function (element) {
            if (typeof onGetComputedStyle === "function") {
              return onGetComputedStyle(element);
            }
            return { "height": "0px" };
          });

          const observeSpy = sinon.spy();

          const mutationObserverStub = sinon.stub(window, "MutationObserver").callsFake(function (callback) {
            this.callback = callback;
            this.observe = function (target, config) {
              observeSpy(target, config);
              if (typeof onObserve === "function") {
                onObserve(target, config);
              }
            };
          });

          return {
            addEventListenerStub,
            getComputedStyleStub,
            mutationObserverStub,
            observeSpy
          };
        }

        beforeEach(function () {
          fixture = createHeaderFooterShell();
          parentHeaderFooter = null;
        });

        afterEach(function () {
          if (parentHeaderFooter) {
            parentHeaderFooter.remove();
          } else if (fixture?.shell) {
            fixture.shell.remove();
          }

          fixture = null;
          parentHeaderFooter = null;
        });

        it("should set footer data-behavior and register resize/mutation observers", function () {
          let resizeHandler = null;
          const {
            addEventListenerStub,
            getComputedStyleStub,
            mutationObserverStub,
            observeSpy
          } = createWindowStubs({
            onAddEventListener(eventName, callback) {
              if (eventName === "resize") {
                resizeHandler = callback;
              }
            },
            onGetComputedStyle(element) {
              if (element === fixture.shell) {
                return { "height": "300px" };
              }
              if (element === fixture.footer) {
                return { "height": "50px" };
              }
              return { "height": "0px" };
            }
          });

          try {
            const mockInstance = { "elements": { "widget": fixture.shell } };
            HeaderFooter.prototype.handleStickyPlacement.call(mockInstance);

            expect(fixture.footer.getAttribute("data-behavior"), "Footer sticky placement should resolve to fixed when content does not overflow.").to.equal("fixed");
            expect(typeof resizeHandler, "Resize handler should be registered.").to.equal("function");
            expect(observeSpy.calledOnce, "MutationObserver.observe() should be called once.").to.equal(true);
            expect(observeSpy.firstCall.args[0], "observeSpy should capture widget container as first argument.").to.equal(fixture.shell);
            expect(observeSpy.firstCall.args[1].childList, "observeSpy should capture childList=true in observe options.").to.equal(true);
            expect(observeSpy.firstCall.args[1].subtree, "observeSpy should capture subtree=true in observe options.").to.equal(true);
            expect(mockInstance._mutationObserver, "MutationObserver instance should be stored on widget instance.").to.exist;
            expect(addEventListenerStub.calledOnce, "addEventListener() should be called once.").to.equal(true);
            expect(getComputedStyleStub.called, "getComputedStyle() should be called.").to.equal(true);
            expect(mutationObserverStub.calledOnce, "MutationObserver constructor should be called once.").to.equal(true);
          } finally {
            addEventListenerStub.restore();
            getComputedStyleStub.restore();
            mutationObserverStub.restore();
          }
        });

        it("should remove data-behavior when footer placement is not sticky", function () {
          fixture.footer.setAttribute("placement", "scroll");
          fixture.footer.setAttribute("data-behavior", "sticky");

          const {
            addEventListenerStub,
            getComputedStyleStub,
            mutationObserverStub
          } = createWindowStubs({
            onGetComputedStyle() {
              return { "height": "300px" };
            }
          });

          try {
            const mockInstance = { "elements": { "widget": fixture.shell } };
            HeaderFooter.prototype.handleStickyPlacement.call(mockInstance);

            expect(fixture.footer.hasAttribute("data-behavior"), "data-behavior should be removed when placement is not sticky.").to.equal(false);
            expect(addEventListenerStub.calledOnce, "addEventListener() should still be registered.").to.equal(true);
            expect(mutationObserverStub.calledOnce, "MutationObserver constructor should be called once.").to.equal(true);
          } finally {
            addEventListenerStub.restore();
            getComputedStyleStub.restore();
            mutationObserverStub.restore();
          }
        });

        it("should update behavior on resize callback when content transitions from fitting to overflowing", function () {
          let resizeHandler = null;
          let callCount = 0;

          const {
            addEventListenerStub,
            getComputedStyleStub,
            mutationObserverStub
          } = createWindowStubs({
            onAddEventListener(eventName, callback) {
              if (eventName === "resize") {
                resizeHandler = callback;
              }
            },
            onGetComputedStyle(element) {
              if (element === fixture.shell) {
                callCount += 1;
                return { "height": callCount === 1 ? "300px" : "2000px" };
              }
              if (element === fixture.footer) {
                return { "height": "50px" };
              }
              return { "height": "0px" };
            }
          });

          try {
            const mockInstance = { "elements": { "widget": fixture.shell } };
            HeaderFooter.prototype.handleStickyPlacement.call(mockInstance);
            expect(fixture.footer.getAttribute("data-behavior")).to.equal("fixed");

            resizeHandler();
            expect(fixture.footer.getAttribute("data-behavior"), "Resize should recompute to sticky when content overflows.").to.equal("sticky");
            expect(addEventListenerStub.calledOnce, "addEventListener() should be called once.").to.equal(true);
            expect(mutationObserverStub.calledOnce, "MutationObserver constructor should be called once.").to.equal(true);
          } finally {
            addEventListenerStub.restore();
            getComputedStyleStub.restore();
            mutationObserverStub.restore();
          }
        });
      });

      describe("onConnect()", function () {

        it("should call super.onConnect() and applyDefaultTheme() plus handleStickyPlacement()", function () {
          const { shell } = createHeaderFooterShell();
          const superPrototype = Object.getPrototypeOf(HeaderFooter.prototype);
          const originalSuperOnConnect = superPrototype.onConnect;
          const expectedUpdaters = ["value-updater"];

          superPrototype.onConnect = function () {
            return expectedUpdaters;
          };

          try {
            const applyDefaultThemeSpy = sinon.spy();
            const handleStickyPlacementSpy = sinon.spy();
            const mockInstance = {
              "applyDefaultTheme": applyDefaultThemeSpy,
              "handleStickyPlacement": handleStickyPlacementSpy
            };

            const returned = HeaderFooter.prototype.onConnect.call(mockInstance, shell, {});

            expect(returned, "onConnect() should return value updaters from super.onConnect().").to.equal(expectedUpdaters);
            expect(applyDefaultThemeSpy.callCount, "onConnect() should call applyDefaultTheme() twice.").to.equal(2);
            expect(applyDefaultThemeSpy.firstCall.args, "First applyDefaultTheme() call should target header.").to.deep.equal([shell, "header"]);
            expect(applyDefaultThemeSpy.secondCall.args, "Second applyDefaultTheme() call should target footer.").to.deep.equal([shell, "footer"]);
            expect(handleStickyPlacementSpy.calledOnce, "onConnect() should call handleStickyPlacement() once.").to.equal(true);
          } finally {
            superPrototype.onConnect = originalSuperOnConnect;
            shell.remove();
          }
        });
      });
    });
  });
})();
