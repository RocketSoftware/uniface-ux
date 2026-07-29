/* global chai, describe, it, UNIFACE */

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

      it("should define defaultTheme for header, main, and footer", function () {
        expect(HeaderFooter.defaultTheme, "defaultTheme should be an object.").to.be.an("object");
        expect(HeaderFooter.defaultTheme, "defaultTheme should define header, main, and footer themes.").to.include.all.keys("header", "main", "footer");
      });

      it("should have correct default theme values for header light mode", function () {
        const headerTheme = HeaderFooter.defaultTheme.header;
        expect(headerTheme.light, "Header should have light mode configuration.").to.exist;
        expect(headerTheme.dark, "Header should have dark mode configuration.").to.exist;
        expect(headerTheme.light.neutral).to.equal("#0078d4");
        expect(headerTheme.light.accent).to.equal("#4A9EFF");
        expect(headerTheme.light.luminance).to.equal(0.23);
      });

      it("should have correct default theme values for header dark mode", function () {
        const headerTheme = HeaderFooter.defaultTheme.header;
        expect(headerTheme.dark, "Header should have dark mode configuration.").to.exist;
        expect(headerTheme.dark.neutral).to.equal("#0078d4");
        expect(headerTheme.dark.accent).to.equal("#4A9EFF");
        expect(headerTheme.dark.luminance).to.equal(0.16);
      });

      it("should have correct default theme values for main light mode", function () {
        const mainTheme = HeaderFooter.defaultTheme.main;
        expect(mainTheme.light, "Main should have light mode configuration.").to.exist;
        expect(mainTheme.dark, "Main should have dark mode configuration.").to.exist;
        expect(mainTheme.light.luminance).to.equal(0.98);
      });

      it("should have correct default theme values for main dark mode", function () {
        const mainTheme = HeaderFooter.defaultTheme.main;
        expect(mainTheme.dark, "Main should have dark mode configuration.").to.exist;
        expect(mainTheme.dark.neutral).to.equal("#52565d");
        expect(mainTheme.dark.luminance).to.equal(0.12);
      });

      it("should have correct default theme values for footer light mode", function () {
        const footerTheme = HeaderFooter.defaultTheme.footer;
        expect(footerTheme.light, "Footer should have light mode configuration.").to.exist;
        expect(footerTheme.dark, "Footer should have dark mode configuration.").to.exist;
        expect(footerTheme.light.luminance).to.equal(0.9);
      });

      it("should have correct default theme values for footer dark mode", function () {
        const footerTheme = HeaderFooter.defaultTheme.footer;
        expect(footerTheme.dark, "Footer should have dark mode configuration.").to.exist;
        expect(footerTheme.dark.neutral).to.equal("#52565d");
        expect(footerTheme.dark.luminance).to.equal(0.10);
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
  });
})();
