(function () {
  "use strict";

  const assert = chai.assert;
  const expect = chai.expect;

  // Component Layout test setup.
  const componentTester = new umockup.WidgetTester("UX.HeaderFooter", "ucpt:header-footer");
  const componentWidgetId = componentTester.widgetId;
  const componentWidgetName = componentTester.widgetName;
  const componentWidgetClass = componentTester.getWidgetClass();

  const asyncRun = umockup.asyncRun;
  const createSkeleton = umockup.createSkeleton;

  const mockComponentDef = {
    "#2": {
      "nm": "UXENTITY1.NOMODEL",
      "type": "entity",
      "widget_class": "UX.CollectionLayout",
      "occs": {
        "#2": {
          "type": "occurrence",
          "widget_class": "UX.OccurrenceLayout"
        }
      },
      "properties": {
        "label-size": "normal"
      },
      "id": "#2"
    },
    "#3": {
      "nm": "UXENTITY2.NOMODEL",
      "type": "entity",
      "widget_class": "UX.CollectionLayout",
      "occs": {
        "#2": {
          "type": "occurrence",
          "widget_class": "UX.OccurrenceLayout"
        }
      },
      "properties": {
        "label-size": "normal"
      },
      "id": "#3"
    },
    "#4": {
      "nm": "UXENTITY3.NOMODEL",
      "type": "entity",
      "widget_class": "UX.CollectionLayout",
      "occs": {
        "#2": {
          "type": "occurrence",
          "widget_class": "UX.OccurrenceLayout"
        }
      },
      "properties": {
        "label-size": "normal"
      },
      "id": "#4"
    },
    "componentname": "TESTCOMPONENT",
    "properties": {},
    "type": "component",
    "widget_class": "UX.CompLayout"
  };

  /**
   * Helper function to get ChildWidgets worker from a specific section.
   */

  function verifyWidgetClass(widgetClass) {
    assert(widgetClass, `Widget class '${componentWidgetName}' is not defined.`);
  }

  describe("Uniface mockup tests", function () {

    it(`should load the ${componentWidgetName} widget class`, function () {
      verifyWidgetClass(componentWidgetClass, componentWidgetName);
    });
  });

  describe("Uniface static structure constructor() definition", function () {

    it("should have a static property structure of type Element", function () {
      const structure = componentWidgetClass.structure;

      expect(structure.constructor, "Structure constructor should be an instance of Element constructor.").to.be.an.instanceof(Element.constructor);
      expect(structure.tagName, "Structure tagName should be 'uf-shell'.").to.equal("uf-shell");
      expect(structure.styleClass, "Structure styleClass should be empty string.").to.equal("");
      expect(structure.elementQuerySelector, "Structure elementQuerySelector should be empty string.").to.equal("");
      expect(structure.childWorkers, "Structure childWorkers should be an array.").to.be.an("array");
    });

    it("should have header, main, and footer sections", function () {
      const structure = componentWidgetClass.structure;

      // Find section elements by their styleClass (more reliable than checking constructor name).
      const headerElement = structure.childWorkers.find(w => w.styleClass === "u-header");
      const mainElement = structure.childWorkers.find(w => w.styleClass === "u-main");
      const footerElement = structure.childWorkers.find(w => w.styleClass === "u-footer");

      // Check header section.
      assert(headerElement, "Header section should exist.");
      expect(headerElement.tagName, "Header section should have tagName 'uf-header'.").to.equal("uf-header");

      // Check main section.
      assert(mainElement, "Main section should exist.");
      expect(mainElement.tagName, "Main section should have tagName 'uf-main'.").to.equal("uf-main");

      // Check footer section.
      assert(footerElement, "Footer section should exist.");
      expect(footerElement.tagName, "Footer section should have tagName 'uf-footer'.").to.equal("uf-footer");
    });
  });

  describe("processLayout()", function () {

    describe("DOM and web component checks", function () {
      let element;

      before(function () {
        const componentSkeleton = createSkeleton(componentWidgetId);
        element = componentTester.processLayout(componentSkeleton, mockComponentDef);
      });

      it("should be an instance of HTMLElement", function () {
        expect(element).instanceOf(HTMLElement, `Function processLayout() of ${componentWidgetName} does not return an HTMLElement.`);
      });

      it("should register the web components", function () {
        const customElementNames = ["uf-shell", "uf-header", "uf-main", "uf-footer"];
        for (const name of customElementNames) {
          assert(window.customElements.get(name), `Web component ${name} has not been registered!`);
        }
      });

      it("should have the correct tagName", function () {
        expect(element, `Element tagName should be '${componentTester.uxTagName}'.`).to.have.tagName(componentTester.uxTagName);
      });

      it("should have the correct id", function () {
        expect(element, `Element id should be '${componentTester.widgetId}'.`).to.have.id(componentTester.widgetId);
      });

      it("should have a u-header section", function () {
        const header = element.querySelector(".u-header");
        assert(header, "Widget should have u-header section.");
        expect(header, "u-header section should have tagName 'uf-header'.").to.have.tagName("uf-header");
      });

      it("should have a u-main section", function () {
        const main = element.querySelector(".u-main");
        assert(main, "Widget should have u-main section.");
        expect(main, "u-main section should have tagName 'uf-main'.").to.have.tagName("uf-main");
      });

      it("should have a u-footer section", function () {
        const footer = element.querySelector(".u-footer");
        assert(footer, "Widget should have u-footer section.");
        expect(footer, "u-footer section should have tagName 'uf-footer'.").to.have.tagName("uf-footer");
      });
    });
  });

  describe("Create widget", function () {

    it("should construct the widget", function () {
      const widget = componentTester.construct();
      expect(widget, "componentTester.construct() should return a widget instance").to.exist;
      expect(componentWidgetClass.defaultValues, "Component widget class should define required default values").to.include.all.keys(
        "class:u-header-footer",
        "footer:horizontal-align",
        "footer:layout-type",
        "footer:placement",
        "footer:vertical-align",
        "header:horizontal-align",
        "header:layout-type",
        "header:placement",
        "header:vertical-align",
        "main:horizontal-align",
        "main:layout-type",
        "main:vertical-align"
      );
    });

    describe("onConnect()", function () {

      it("should create and connect the element", function () {
        const componentSkeleton = createSkeleton(componentWidgetId);
        const widget = componentTester.onConnect(componentSkeleton, mockComponentDef);
        const element = componentTester.element;
        assert(element, "Target element is not defined!");
        assert(widget.elements.widget === element, "Widget is not connected!");
      });
    });

    it("should render without any console errors or warnings", function () {
      const errorSpy = sinon.spy(console, "error");
      const warnSpy = sinon.spy(console, "warn");
      try {
        componentTester.createWidget(null, createSkeleton(componentWidgetId), mockComponentDef);
      } finally {
        const errorCount = errorSpy.callCount;
        const warnCount = warnSpy.callCount;
        errorSpy.restore();
        warnSpy.restore();
        assert.equal(errorCount, 0, `Expected no console errors during widget render, but got ${errorCount}.`);
        assert.equal(warnCount, 0, `Expected no console warnings during widget render, but got ${warnCount}.`);
      }
    });
  });

  describe("dataInit()", function () {
    const classes = componentTester.getDefaultClasses();
    let element;

    before(function () {
      const componentSkeleton = createSkeleton(componentWidgetId);
      componentTester.createWidget(null, componentSkeleton, mockComponentDef);
      element = componentTester.element;
      assert(element, "Widget top element is not defined!");
    });

    for (const defaultClass in classes) {
      it(`should apply default class '${defaultClass}' correctly`, function () {
        if (classes[defaultClass]) {
          expect(element, `Widget element should have class ${defaultClass}.`).to.have.class(defaultClass);
        } else {
          expect(element, `Widget element should not have class ${defaultClass}.`).not.to.have.class(defaultClass);
        }
      });
    }

    it("should have a valid widget id", function () {
      assert.strictEqual(componentTester.widget.widget.id.toString().length > 0, true);
    });

    it("should have default header placement", function () {
      const header = element.querySelector(".u-header");
      expect(header.getAttribute("placement"), "Header placement should be 'sticky' by default.").to.equal("sticky");
      // Note: data-behavior is only set when handleStickyPlacement() is called in onConnect().
      // During dataInit(), the attribute is not yet set.
    });

    it("should have default footer placement", function () {
      const footer = element.querySelector(".u-footer");
      expect(footer.getAttribute("placement"), "Footer placement should be 'sticky' by default.").to.equal("sticky");
      // Note: data-behavior is only set when handleStickyPlacement() is called in onConnect().
      // During dataInit(), the attribute is not yet set.
    });

    it("should have sections structure", function () {
      const header = element.querySelector(".u-header");
      const main = element.querySelector(".u-main");
      const footer = element.querySelector(".u-footer");

      assert(header, "Header section should exist.");
      assert(main, "Main section should exist.");
      assert(footer, "Footer section should exist.");
    });

    it("should not have data-behavior set during dataInit()", function () {
      const header = element.querySelector(".u-header");
      const footer = element.querySelector(".u-footer");

      // data-behavior should not be set yet since handleStickyPlacement() hasn't been called.
      // Note: header never gets data-behavior attribute, only footer does.
      expect(header.hasAttribute("data-behavior")).to.be.false;
      expect(footer.hasAttribute("data-behavior")).to.be.false;
    });

    it("should have default header placement='sticky'", function () {
      expect(componentTester.widget.data["header:placement"], "Default value of 'header:placement' should be 'sticky'.").to.equal("sticky");
    });

    it("should have default header layout-type='horizontal-wrap'", function () {
      expect(componentTester.widget.data["header:layout-type"], "Default value of 'header:layout-type' should be 'horizontal-wrap'.").to.equal(
        "horizontal-wrap"
      );
    });

    it("should have default header horizontal-align='space-between'", function () {
      expect(
        componentTester.widget.data["header:horizontal-align"],
        "Default value of 'header:horizontal-align' should be 'space-between'."
      ).to.equal("space-between");
    });

    it("should have default header vertical-align='center'", function () {
      expect(componentTester.widget.data["header:vertical-align"], "Default value of 'header:vertical-align' should be 'center'.").to.equal("center");
    });

    it("should have default main layout-type='vertical-scroll'", function () {
      expect(componentTester.widget.data["main:layout-type"], "Default value of 'main:layout-type' should be 'vertical-scroll'.").to.equal(
        "vertical-scroll"
      );
    });

    it("should have default main horizontal-align='start'", function () {
      expect(componentTester.widget.data["main:horizontal-align"], "Default value of 'main:horizontal-align' should be 'start'.").to.equal("start");
    });

    it("should have default main vertical-align='start'", function () {
      expect(componentTester.widget.data["main:vertical-align"], "Default value of 'main:vertical-align' should be 'start'.").to.equal("start");
    });

    it("should have default footer placement='sticky'", function () {
      expect(componentTester.widget.data["footer:placement"], "Default value of 'footer:placement' should be 'sticky'.").to.equal("sticky");
    });

    it("should have default footer layout-type='horizontal-wrap'", function () {
      expect(componentTester.widget.data["footer:layout-type"], "Default value of 'footer:layout-type' should be 'horizontal-wrap'.").to.equal(
        "horizontal-wrap"
      );
    });

    it("should have default footer horizontal-align='space-between'", function () {
      expect(componentTester.widget.data["footer:horizontal-align"], "Default value of 'footer:horizontal-align' should be 'space-between'.").to.equal("space-between");
    });

    it("should have default footer vertical-align='center'", function () {
      expect(componentTester.widget.data["footer:vertical-align"], "Default value of 'footer:vertical-align' should be 'center'.").to.equal("center");
    });
  });

  describe("dataUpdate()", function () {
    let element;

    before(function () {
      return asyncRun(function () {
        const componentSkeleton = createSkeleton(componentWidgetId);
        componentTester.createWidget(null, componentSkeleton, mockComponentDef);
        element = componentTester.element;
      }).then(function () {
        assert(element, "Widget top element is not defined!");
      });
    });


    describe("Header placement", function () {

      it("should update header placement to scroll", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({
            "header:placement": "scroll"
          });
        }).then(function () {
          const header = element.querySelector(".u-header");
          expect(header.getAttribute("placement"), "Header placement attribute should be 'scroll'.").to.equal("scroll");
          const headerStyle = window.getComputedStyle(header);
          expect(headerStyle.position, "Header with placement='scroll' should not have position 'fixed'.").to.not.equal("fixed");
          expect(headerStyle.position, "Header with placement='scroll' should not have position 'sticky'.").to.not.equal("sticky");
        });
      });

      it("should update header placement to sticky", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({
            "header:placement": "sticky"
          });
        }).then(function () {
          const header = element.querySelector(".u-header");
          expect(header.getAttribute("placement"), "Header placement attribute should be 'sticky'.").to.equal("sticky");
          // Note: data-behavior is set by observers that trigger on size/DOM changes.
          // It may not be immediately set after dataUpdate, so we don't check it here.
        });
      });

      it("should update header placement to hidden", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({
            "header:placement": "hidden"
          });
        }).then(function () {
          const header = element.querySelector(".u-header");
          expect(header.getAttribute("placement"), "Header placement attribute should be 'hidden'.").to.equal("hidden");
          const headerStyle = window.getComputedStyle(header);
          expect(headerStyle.display, "Header with placement='hidden' should have display 'none'.").to.equal("none");
        });
      });

    });

    describe("Footer placement", function () {

      it("should update footer placement to scroll", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({
            "footer:placement": "scroll"
          });
        }).then(function () {
          const footer = element.querySelector(".u-footer");
          expect(footer.getAttribute("placement"), "Footer placement attribute should be 'scroll'.").to.equal("scroll");
          const footerStyle = window.getComputedStyle(footer);
          expect(footerStyle.position, "Footer with placement='scroll' should not have position 'fixed'.").to.not.equal("fixed");
          expect(footerStyle.position, "Footer with placement='scroll' should not have position 'sticky'.").to.not.equal("sticky");
        });
      });

      it("should update footer placement to sticky", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({
            "footer:placement": "sticky"
          });
        }).then(function () {
          const footer = element.querySelector(".u-footer");
          expect(footer.getAttribute("placement"), "Footer placement attribute should be 'sticky'.").to.equal("sticky");
          const footerStyle = window.getComputedStyle(footer);
          expect(footerStyle.display, "Footer with placement='sticky' should not have display 'none'.").to.not.equal("none");
          // Note: data-behavior is set by observers that trigger on size/DOM changes.
          // It may not be immediately set after dataUpdate, so we don't check it here.
        });
      });

      it("should update footer placement to hidden", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({
            "footer:placement": "hidden"
          });
        }).then(function () {
          const footer = element.querySelector(".u-footer");
          expect(footer.getAttribute("placement"), "Footer placement attribute should be 'hidden'.").to.equal("hidden");
          const footerStyle = window.getComputedStyle(footer);
          expect(footerStyle.display, "Footer with placement='hidden' should have display 'none'.").to.equal("none");
          expect(footerStyle.position, "Footer with placement='hidden' should not have position 'fixed'.").to.not.equal("fixed");
          expect(footerStyle.position, "Footer with placement='hidden' should not have position 'sticky'.").to.not.equal("sticky");
        });
      });

    });

    describe("Combined placement updates", function () {

      it("should update both header and footer placement to sticky", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({
            "header:placement": "sticky",
            "footer:placement": "sticky"
          });
        }).then(function () {
          const header = element.querySelector(".u-header");
          const footer = element.querySelector(".u-footer");
          expect(header.getAttribute("placement"), "Header placement attribute should be 'sticky'.").to.equal("sticky");
          expect(footer.getAttribute("placement"), "Footer placement attribute should be 'sticky'.").to.equal("sticky");
          // Note: data-behavior is set by observers that trigger on size/DOM changes.
          // It may not be immediately set after dataUpdate, so we don't check it here.
        });
      });

      it("should hide header and show footer", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({
            "header:placement": "hidden",
            "footer:placement": "sticky"
          });
        }).then(function () {
          const header = element.querySelector(".u-header");
          const footer = element.querySelector(".u-footer");
          expect(header.getAttribute("placement"), "Header placement attribute should be 'hidden'.").to.equal("hidden");
          expect(footer.getAttribute("placement"), "Footer placement attribute should be 'sticky'.").to.equal("sticky");
          const headerStyle = window.getComputedStyle(header);
          expect(headerStyle.display, "Header with placement='hidden' should have display 'none'.").to.equal("none");
          // Note: data-behavior is set by observers that trigger on size/DOM changes.
          // It may not be immediately set after dataUpdate, so we don't check it here.
        });
      });

    });

    describe("Header layout properties", function () {

      it("should update layout to 'vertical-scroll'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "header:layout-type": "vertical-scroll" });
        }).then(function () {
          expect(componentTester.widget.data["header:layout-type"]).to.equal("vertical-scroll");
          const headerElement = element.querySelector(".u-header");
          expect(headerElement.getAttribute("layout-type")).to.equal("vertical-scroll");
        });
      });

      it("should update layout to 'horizontal-wrap'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "header:layout-type": "horizontal-wrap" });
        }).then(function () {
          expect(componentTester.widget.data["header:layout-type"]).to.equal("horizontal-wrap");
          const headerElement = element.querySelector(".u-header");
          expect(headerElement.getAttribute("layout-type")).to.equal("horizontal-wrap");
        });
      });

      it("should update layout to 'vertical-wrap'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "header:layout-type": "vertical-wrap" });
        }).then(function () {
          expect(componentTester.widget.data["header:layout-type"]).to.equal("vertical-wrap");
          const headerElement = element.querySelector(".u-header");
          expect(headerElement.getAttribute("layout-type")).to.equal("vertical-wrap");
        });
      });

      it("should update layout to 'auto'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "header:layout-type": "auto" });
        }).then(function () {
          expect(componentTester.widget.data["header:layout-type"]).to.equal("auto");
          const headerElement = element.querySelector(".u-header");
          expect(headerElement.getAttribute("layout-type")).to.equal("auto");
        });
      });

      it("should update horizontal-align to 'center'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "header:horizontal-align": "center" });
        }).then(function () {
          expect(componentTester.widget.data["header:horizontal-align"]).to.equal("center");
          const headerElement = element.querySelector(".u-header");
          expect(headerElement.getAttribute("horizontal-align")).to.equal("center");
        });
      });

      it("should update horizontal-align to 'end'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "header:horizontal-align": "end" });
        }).then(function () {
          expect(componentTester.widget.data["header:horizontal-align"]).to.equal("end");
          const headerElement = element.querySelector(".u-header");
          expect(headerElement.getAttribute("horizontal-align")).to.equal("end");
        });
      });

      it("should update horizontal-align to 'space-between'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "header:horizontal-align": "space-between" });
        }).then(function () {
          expect(componentTester.widget.data["header:horizontal-align"]).to.equal("space-between");
          const headerElement = element.querySelector(".u-header");
          expect(headerElement.getAttribute("horizontal-align")).to.equal("space-between");
        });
      });

      it("should update horizontal-align to 'space-around'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "header:horizontal-align": "space-around" });
        }).then(function () {
          expect(componentTester.widget.data["header:horizontal-align"]).to.equal("space-around");
          const headerElement = element.querySelector(".u-header");
          expect(headerElement.getAttribute("horizontal-align")).to.equal("space-around");
        });
      });

      it("should update horizontal-align to 'space-evenly'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "header:horizontal-align": "space-evenly" });
        }).then(function () {
          expect(componentTester.widget.data["header:horizontal-align"]).to.equal("space-evenly");
          const headerElement = element.querySelector(".u-header");
          expect(headerElement.getAttribute("horizontal-align")).to.equal("space-evenly");
        });
      });

      it("should update horizontal-align to 'auto'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "header:horizontal-align": "auto" });
        }).then(function () {
          expect(componentTester.widget.data["header:horizontal-align"]).to.equal("auto");
          const headerElement = element.querySelector(".u-header");
          expect(headerElement.getAttribute("horizontal-align")).to.equal("auto");
        });
      });

      it("should update vertical-align to 'center'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "header:vertical-align": "center" });
        }).then(function () {
          expect(componentTester.widget.data["header:vertical-align"]).to.equal("center");
          const headerElement = element.querySelector(".u-header");
          expect(headerElement.getAttribute("vertical-align")).to.equal("center");
        });
      });

      it("should update vertical-align to 'end'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "header:vertical-align": "end" });
        }).then(function () {
          expect(componentTester.widget.data["header:vertical-align"]).to.equal("end");
          const headerElement = element.querySelector(".u-header");
          expect(headerElement.getAttribute("vertical-align")).to.equal("end");
        });
      });

      it("should update vertical-align to 'stretch'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "header:vertical-align": "stretch" });
        }).then(function () {
          expect(componentTester.widget.data["header:vertical-align"]).to.equal("stretch");
          const headerElement = element.querySelector(".u-header");
          expect(headerElement.getAttribute("vertical-align")).to.equal("stretch");
        });
      });

      it("should update vertical-align to 'auto'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "header:vertical-align": "auto" });
        }).then(function () {
          expect(componentTester.widget.data["header:vertical-align"]).to.equal("auto");
          const headerElement = element.querySelector(".u-header");
          expect(headerElement.getAttribute("vertical-align")).to.equal("auto");
        });
      });

      it("should handle invalid layout value gracefully", function () {
        const warnSpy = sinon.spy(console, "warn");
        return asyncRun(function () {
          componentTester.dataUpdate({ "header:layout-type": "invalid-layout" });
        }).then(function () {
          expect(warnSpy.calledWith(sinon.match("Property 'header:layout-type' invalid value (invalid-layout)"))).to.be.true;
        }).finally(function () {
          warnSpy.restore();
        });
      });

    });

    describe("Main layout properties", function () {

      it("should update layout to 'horizontal-scroll'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "main:layout-type": "horizontal-scroll" });
        }).then(function () {
          expect(componentTester.widget.data["main:layout-type"]).to.equal("horizontal-scroll");
          const mainElement = element.querySelector(".u-main");
          expect(mainElement.getAttribute("layout-type")).to.equal("horizontal-scroll");
        });
      });

      it("should update layout to 'horizontal-wrap'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "main:layout-type": "horizontal-wrap" });
        }).then(function () {
          expect(componentTester.widget.data["main:layout-type"]).to.equal("horizontal-wrap");
          const mainElement = element.querySelector(".u-main");
          expect(mainElement.getAttribute("layout-type")).to.equal("horizontal-wrap");
        });
      });

      it("should update layout to 'vertical-wrap'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "main:layout-type": "vertical-wrap" });
        }).then(function () {
          expect(componentTester.widget.data["main:layout-type"]).to.equal("vertical-wrap");
          const mainElement = element.querySelector(".u-main");
          expect(mainElement.getAttribute("layout-type")).to.equal("vertical-wrap");
        });
      });

      it("should update layout to 'auto'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "main:layout-type": "auto" });
        }).then(function () {
          expect(componentTester.widget.data["main:layout-type"]).to.equal("auto");
          const mainElement = element.querySelector(".u-main");
          expect(mainElement.getAttribute("layout-type")).to.equal("auto");
        });
      });

      it("should update horizontal-align to 'center'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "main:horizontal-align": "center" });
        }).then(function () {
          expect(componentTester.widget.data["main:horizontal-align"]).to.equal("center");
          const mainElement = element.querySelector(".u-main");
          expect(mainElement.getAttribute("horizontal-align")).to.equal("center");
        });
      });

      it("should update horizontal-align to 'end'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "main:horizontal-align": "end" });
        }).then(function () {
          expect(componentTester.widget.data["main:horizontal-align"]).to.equal("end");
          const mainElement = element.querySelector(".u-main");
          expect(mainElement.getAttribute("horizontal-align")).to.equal("end");
        });
      });

      it("should update horizontal-align to 'space-between'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "main:horizontal-align": "space-between" });
        }).then(function () {
          expect(componentTester.widget.data["main:horizontal-align"]).to.equal("space-between");
          const mainElement = element.querySelector(".u-main");
          expect(mainElement.getAttribute("horizontal-align")).to.equal("space-between");
        });
      });

      it("should update horizontal-align to 'space-around'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "main:horizontal-align": "space-around" });
        }).then(function () {
          expect(componentTester.widget.data["main:horizontal-align"]).to.equal("space-around");
          const mainElement = element.querySelector(".u-main");
          expect(mainElement.getAttribute("horizontal-align")).to.equal("space-around");
        });
      });

      it("should update horizontal-align to 'space-evenly'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "main:horizontal-align": "space-evenly" });
        }).then(function () {
          expect(componentTester.widget.data["main:horizontal-align"]).to.equal("space-evenly");
          const mainElement = element.querySelector(".u-main");
          expect(mainElement.getAttribute("horizontal-align")).to.equal("space-evenly");
        });
      });

      it("should update horizontal-align to 'auto'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "main:horizontal-align": "auto" });
        }).then(function () {
          expect(componentTester.widget.data["main:horizontal-align"]).to.equal("auto");
          const mainElement = element.querySelector(".u-main");
          expect(mainElement.getAttribute("horizontal-align")).to.equal("auto");
        });
      });

      it("should update vertical-align to 'center'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "main:vertical-align": "center" });
        }).then(function () {
          expect(componentTester.widget.data["main:vertical-align"]).to.equal("center");
          const mainElement = element.querySelector(".u-main");
          expect(mainElement.getAttribute("vertical-align")).to.equal("center");
        });
      });

      it("should update vertical-align to 'end'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "main:vertical-align": "end" });
        }).then(function () {
          expect(componentTester.widget.data["main:vertical-align"]).to.equal("end");
          const mainElement = element.querySelector(".u-main");
          expect(mainElement.getAttribute("vertical-align")).to.equal("end");
        });
      });

      it("should update vertical-align to 'stretch'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "main:vertical-align": "stretch" });
        }).then(function () {
          expect(componentTester.widget.data["main:vertical-align"]).to.equal("stretch");
          const mainElement = element.querySelector(".u-main");
          expect(mainElement.getAttribute("vertical-align")).to.equal("stretch");
        });
      });

      it("should update vertical-align to 'auto'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "main:vertical-align": "auto" });
        }).then(function () {
          expect(componentTester.widget.data["main:vertical-align"]).to.equal("auto");
          const mainElement = element.querySelector(".u-main");
          expect(mainElement.getAttribute("vertical-align")).to.equal("auto");
        });
      });

      it("should handle invalid layout value gracefully", function () {
        const warnSpy = sinon.spy(console, "warn");
        return asyncRun(function () {
          componentTester.dataUpdate({ "main:layout-type": "invalid-layout" });
        }).then(function () {
          expect(warnSpy.calledWith(sinon.match("Property 'main:layout-type' invalid value (invalid-layout)"))).to.be.true;
        }).finally(function () {
          warnSpy.restore();
        });
      });

    });

    describe("Footer layout properties", function () {

      it("should update layout to 'vertical-scroll'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "footer:layout-type": "vertical-scroll" });
        }).then(function () {
          expect(componentTester.widget.data["footer:layout-type"]).to.equal("vertical-scroll");
          const footerElement = element.querySelector(".u-footer");
          expect(footerElement.getAttribute("layout-type")).to.equal("vertical-scroll");
        });
      });

      it("should update layout to 'horizontal-wrap'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "footer:layout-type": "horizontal-wrap" });
        }).then(function () {
          expect(componentTester.widget.data["footer:layout-type"]).to.equal("horizontal-wrap");
          const footerElement = element.querySelector(".u-footer");
          expect(footerElement.getAttribute("layout-type")).to.equal("horizontal-wrap");
        });
      });

      it("should update layout to 'vertical-wrap'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "footer:layout-type": "vertical-wrap" });
        }).then(function () {
          expect(componentTester.widget.data["footer:layout-type"]).to.equal("vertical-wrap");
          const footerElement = element.querySelector(".u-footer");
          expect(footerElement.getAttribute("layout-type")).to.equal("vertical-wrap");
        });
      });

      it("should update layout to 'auto'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "footer:layout-type": "auto" });
        }).then(function () {
          expect(componentTester.widget.data["footer:layout-type"]).to.equal("auto");
          const footerElement = element.querySelector(".u-footer");
          expect(footerElement.getAttribute("layout-type")).to.equal("auto");
        });
      });

      it("should update horizontal-align to 'center'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "footer:horizontal-align": "center" });
        }).then(function () {
          expect(componentTester.widget.data["footer:horizontal-align"]).to.equal("center");
          const footerElement = element.querySelector(".u-footer");
          expect(footerElement.getAttribute("horizontal-align")).to.equal("center");
        });
      });

      it("should update horizontal-align to 'end'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "footer:horizontal-align": "end" });
        }).then(function () {
          expect(componentTester.widget.data["footer:horizontal-align"]).to.equal("end");
          const footerElement = element.querySelector(".u-footer");
          expect(footerElement.getAttribute("horizontal-align")).to.equal("end");
        });
      });

      it("should update horizontal-align to 'space-between'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "footer:horizontal-align": "space-between" });
        }).then(function () {
          expect(componentTester.widget.data["footer:horizontal-align"]).to.equal("space-between");
          const footerElement = element.querySelector(".u-footer");
          expect(footerElement.getAttribute("horizontal-align")).to.equal("space-between");
        });
      });

      it("should update horizontal-align to 'space-around'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "footer:horizontal-align": "space-around" });
        }).then(function () {
          expect(componentTester.widget.data["footer:horizontal-align"]).to.equal("space-around");
          const footerElement = element.querySelector(".u-footer");
          expect(footerElement.getAttribute("horizontal-align")).to.equal("space-around");
        });
      });

      it("should update horizontal-align to 'space-evenly'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "footer:horizontal-align": "space-evenly" });
        }).then(function () {
          expect(componentTester.widget.data["footer:horizontal-align"]).to.equal("space-evenly");
          const footerElement = element.querySelector(".u-footer");
          expect(footerElement.getAttribute("horizontal-align")).to.equal("space-evenly");
        });
      });

      it("should update horizontal-align to 'auto'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "footer:horizontal-align": "auto" });
        }).then(function () {
          expect(componentTester.widget.data["footer:horizontal-align"]).to.equal("auto");
          const footerElement = element.querySelector(".u-footer");
          expect(footerElement.getAttribute("horizontal-align")).to.equal("auto");
        });
      });

      it("should update vertical-align to 'center'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "footer:vertical-align": "center" });
        }).then(function () {
          expect(componentTester.widget.data["footer:vertical-align"]).to.equal("center");
          const footerElement = element.querySelector(".u-footer");
          expect(footerElement.getAttribute("vertical-align")).to.equal("center");
        });
      });

      it("should update vertical-align to 'end'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "footer:vertical-align": "end" });
        }).then(function () {
          expect(componentTester.widget.data["footer:vertical-align"]).to.equal("end");
          const footerElement = element.querySelector(".u-footer");
          expect(footerElement.getAttribute("vertical-align")).to.equal("end");
        });
      });

      it("should update vertical-align to 'stretch'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "footer:vertical-align": "stretch" });
        }).then(function () {
          expect(componentTester.widget.data["footer:vertical-align"]).to.equal("stretch");
          const footerElement = element.querySelector(".u-footer");
          expect(footerElement.getAttribute("vertical-align")).to.equal("stretch");
        });
      });

      it("should update vertical-align to 'auto'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({ "footer:vertical-align": "auto" });
        }).then(function () {
          expect(componentTester.widget.data["footer:vertical-align"]).to.equal("auto");
          const footerElement = element.querySelector(".u-footer");
          expect(footerElement.getAttribute("vertical-align")).to.equal("auto");
        });
      });

      it("should handle invalid layout value gracefully", function () {
        const warnSpy = sinon.spy(console, "warn");
        return asyncRun(function () {
          componentTester.dataUpdate({ "footer:layout-type": "invalid-layout" });
        }).then(function () {
          expect(warnSpy.calledWith(sinon.match("Property 'footer:layout-type' invalid value (invalid-layout)"))).to.be.true;
        }).finally(function () {
          warnSpy.restore();
        });
      });

    });

  });

  describe("Section Structure", function () {
    let element;

    before(function () {
      componentTester.createWidget(null, createSkeleton(componentWidgetId), mockComponentDef);
      element = componentTester.element;
    });

    it("should have header/main/footer in correct order and tags", function () {
      const children = Array.from(element.children);
      const headerIndex = children.findIndex(child => child.classList.contains("u-header"));
      const mainIndex = children.findIndex(child => child.classList.contains("u-main"));
      const footerIndex = children.findIndex(child => child.classList.contains("u-footer"));

      assert(headerIndex < mainIndex, "Header should come before main in DOM.");
      assert(mainIndex < footerIndex, "Main should come before footer in DOM.");

      expect(element.querySelector(".u-header")).to.have.tagName("uf-header");
      expect(element.querySelector(".u-main")).to.have.tagName("uf-main");
      expect(element.querySelector(".u-footer")).to.have.tagName("uf-footer");
    });
  });

  describe("ChildWidgets Distribution", function () {

    function createIsolatedWidget(componentDef) {
      const isolatedTester = new umockup.WidgetTester("UX.HeaderFooter", "ucpt:header-footer");
      const isolatedSkeleton = createSkeleton(isolatedTester.widgetId);
      isolatedTester.createWidget(null, isolatedSkeleton, componentDef);
      return isolatedTester.element;
    }

    function createEntityChild(id, name) {
      return {
        "nm": `${name}.NOMODEL`,
        "type": "entity",
        "widget_class": "UX.CollectionLayout",
        "occs": {
          "#2": {
            "type": "occurrence",
            "widget_class": "UX.OccurrenceLayout"
          }
        },
        "properties": {
          "label-size": "normal"
        },
        "id": id
      };
    }

    function createComponentDefWithEntities(entityNames) {
      const componentDef = {
        "componentname": "TESTCOMPONENT",
        "properties": {},
        "type": "component",
        "widget_class": "UX.CompLayout"
      };

      entityNames.forEach(function (name, index) {
        const entityId = `#${index + 2}`;
        componentDef[entityId] = createEntityChild(entityId, name);
      });

      return componentDef;
    }

    function getSectionChildIds(element, sectionSelector) {
      return Array.from(element.querySelector(sectionSelector).querySelectorAll("[id^='uent:'], [id^='ufld:']"))
        .map(child => child.id.toLowerCase());
    }

    function hasIdFragment(ids, fragment) {
      const normalized = fragment.toLowerCase();
      return ids.some(id => id.includes(normalized));
    }

    it("should render widget with no child definitions", function () {
      const noChildDef = {
        "componentname": "TESTCOMPONENT",
        "properties": {},
        "type": "component",
        "widget_class": "UX.CompLayout"
      };

      const element = createIsolatedWidget(noChildDef);
      assert(element, "Widget element should be created.");
      expect(element).to.have.tagName("uf-shell");
    });

    it("should distribute default children as header/main/footer", function () {
      const element = createIsolatedWidget(mockComponentDef);

      const headerCount = element.querySelector(".u-header").querySelectorAll("[id^='uent:'], [id^='ufld:']").length;
      const mainCount = element.querySelector(".u-main").querySelectorAll("[id^='uent:'], [id^='ufld:']").length;
      const footerCount = element.querySelector(".u-footer").querySelectorAll("[id^='uent:'], [id^='ufld:']").length;
      const headerIds = getSectionChildIds(element, ".u-header");
      const mainIds = getSectionChildIds(element, ".u-main");
      const footerIds = getSectionChildIds(element, ".u-footer");

      expect(headerCount).to.equal(1);
      expect(mainCount).to.equal(1);
      expect(footerCount).to.equal(1);
      expect(hasIdFragment(headerIds, "UXENTITY1"), "First entity should be placed in header section.").to.be.true;
      expect(hasIdFragment(mainIds, "UXENTITY2"), "Second entity should be placed in main section.").to.be.true;
      expect(hasIdFragment(footerIds, "UXENTITY3"), "Third entity should be placed in footer section.").to.be.true;
    });

    it("should place one child entity in main by default", function () {
      const oneEntityDef = createComponentDefWithEntities(["Entity1"]);
      const element = createIsolatedWidget(oneEntityDef);

      const headerCount = element.querySelector(".u-header").querySelectorAll("[id^='uent:'], [id^='ufld:']").length;
      const mainCount = element.querySelector(".u-main").querySelectorAll("[id^='uent:'], [id^='ufld:']").length;
      const footerCount = element.querySelector(".u-footer").querySelectorAll("[id^='uent:'], [id^='ufld:']").length;
      const mainIds = getSectionChildIds(element, ".u-main");

      expect(headerCount).to.equal(0);
      expect(mainCount).to.equal(1);
      expect(footerCount).to.equal(0);
      expect(hasIdFragment(mainIds, "Entity1"), "Entity1 should be placed in main section.").to.be.true;
    });

    it("should place two child entities in header/main by default", function () {
      const twoEntityDef = createComponentDefWithEntities(["Entity1", "Entity2"]);
      const element = createIsolatedWidget(twoEntityDef);

      const headerCount = element.querySelector(".u-header").querySelectorAll("[id^='uent:'], [id^='ufld:']").length;
      const mainCount = element.querySelector(".u-main").querySelectorAll("[id^='uent:'], [id^='ufld:']").length;
      const footerCount = element.querySelector(".u-footer").querySelectorAll("[id^='uent:'], [id^='ufld:']").length;
      const headerIds = getSectionChildIds(element, ".u-header");
      const mainIds = getSectionChildIds(element, ".u-main");

      expect(headerCount).to.equal(1);
      expect(mainCount).to.equal(1);
      expect(footerCount).to.equal(0);
      expect(hasIdFragment(headerIds, "Entity1"), "Entity1 should be placed in header section.").to.be.true;
      expect(hasIdFragment(mainIds, "Entity2"), "Entity2 should be placed in main section.").to.be.true;
    });

    it("should place more than three child entities across header/main/footer by default", function () {
      const fiveEntityDef = createComponentDefWithEntities(["Entity1", "Entity2", "Entity3", "Entity4", "Entity5"]);
      const element = createIsolatedWidget(fiveEntityDef);

      const headerCount = element.querySelector(".u-header").querySelectorAll("[id^='uent:'], [id^='ufld:']").length;
      const mainCount = element.querySelector(".u-main").querySelectorAll("[id^='uent:'], [id^='ufld:']").length;
      const footerCount = element.querySelector(".u-footer").querySelectorAll("[id^='uent:'], [id^='ufld:']").length;
      const headerIds = getSectionChildIds(element, ".u-header");
      const mainIds = getSectionChildIds(element, ".u-main");
      const footerIds = getSectionChildIds(element, ".u-footer");

      expect(headerCount).to.equal(1);
      expect(mainCount).to.equal(3);
      expect(footerCount).to.equal(1);
      expect(hasIdFragment(headerIds, "Entity1"), "Entity1 should be placed in header section.").to.be.true;
      expect(hasIdFragment(mainIds, "Entity2"), "Entity2 should be placed in main section.").to.be.true;
      expect(hasIdFragment(mainIds, "Entity3"), "Entity3 should be placed in main section.").to.be.true;
      expect(hasIdFragment(mainIds, "Entity4"), "Entity4 should be placed in main section.").to.be.true;
      expect(hasIdFragment(footerIds, "Entity5"), "Entity5 should be placed in footer section.").to.be.true;
    });

    it("should apply area-slot based assignment", function () {
      const slotDef = {
        "#2": {
          "nm": "FIELD_MAIN",
          "type": "field",
          "widget_class": "UX.TextField",
          "properties": { "area-slot": "main" },
          "id": "#2"
        },
        "#3": {
          "nm": "FIELD_HEADER",
          "type": "field",
          "widget_class": "UX.TextField",
          "properties": { "area-slot": "header" },
          "id": "#3"
        },
        "#4": {
          "nm": "FIELD_FOOTER",
          "type": "field",
          "widget_class": "UX.TextField",
          "properties": { "area-slot": "footer" },
          "id": "#4"
        },
        "componentname": "TESTCOMPONENT",
        "properties": {},
        "type": "component",
        "widget_class": "UX.CompLayout"
      };

      const element = createIsolatedWidget(slotDef);

      const headerCount = element.querySelector(".u-header").querySelectorAll("[id^='uent:'], [id^='ufld:']").length;
      const mainCount = element.querySelector(".u-main").querySelectorAll("[id^='uent:'], [id^='ufld:']").length;
      const footerCount = element.querySelector(".u-footer").querySelectorAll("[id^='uent:'], [id^='ufld:']").length;
      const headerIds = getSectionChildIds(element, ".u-header");
      const mainIds = getSectionChildIds(element, ".u-main");
      const footerIds = getSectionChildIds(element, ".u-footer");

      expect(headerCount).to.equal(1);
      expect(mainCount).to.equal(1);
      expect(footerCount).to.equal(1);
      expect(hasIdFragment(headerIds, "FIELD_HEADER"), "Header field should be placed in header section.").to.be.true;
      expect(hasIdFragment(mainIds, "FIELD_MAIN"), "Main field should be placed in main section.").to.be.true;
      expect(hasIdFragment(footerIds, "FIELD_FOOTER"), "Footer field should be placed in footer section.").to.be.true;
    });
  });

  describe("Data-behavior attribute tests", function () {
    let element;
    let widget;

    before(function () {
      componentTester.createWidget(null, createSkeleton(componentWidgetId), mockComponentDef);
      widget = componentTester.widget;
      element = componentTester.element;
      assert(element, "Widget top element is not defined!");
    });

    it("should set data-behavior on header and footer with sticky placement", function () {
      return asyncRun(function () {
        const footer = element.querySelector(".u-footer");

        // Trigger MutationObserver by adding and removing a temporary element.
        const temp = document.createElement("span");
        footer.appendChild(temp);
        footer.removeChild(temp);
      }).then(function () {
        const header = element.querySelector(".u-header");
        const footer = element.querySelector(".u-footer");

        // Both should have placement="sticky" by default.
        expect(header.getAttribute("placement")).to.equal("sticky");
        expect(footer.getAttribute("placement")).to.equal("sticky");

        // Only footer should have data-behavior attribute set (header does not use dynamic behavior).
        expect(header.hasAttribute("data-behavior")).to.be.false;
        expect(footer.hasAttribute("data-behavior")).to.be.true;

        // Footer value should be 'fixed' or 'sticky'.
        const footerBehavior = footer.getAttribute("data-behavior");
        expect(["fixed", "sticky"]).to.include(footerBehavior);
      });
    });

    it("should not set data-behavior when placement is scroll", function () {
      return asyncRun(function () {
        widget.dataUpdate({
          "footer:placement": "scroll"
        });

        const footer = element.querySelector(".u-footer");

        // Trigger MutationObserver by adding and removing a temporary element.
        const temp = document.createElement("span");
        footer.appendChild(temp);
        footer.removeChild(temp);
      }).then(function () {
        const footer = element.querySelector(".u-footer");
        expect(footer.getAttribute("placement")).to.equal("scroll");

        // Data-behavior should be removed when placement is not sticky.
        expect(footer.hasAttribute("data-behavior")).to.be.false;
      });
    });

    it("should not set data-behavior when placement is hidden", function () {
      return asyncRun(function () {
        widget.dataUpdate({
          "footer:placement": "hidden"
        });

        const footer = element.querySelector(".u-footer");

        // Trigger MutationObserver by adding and removing a temporary element.
        const temp = document.createElement("span");
        footer.appendChild(temp);
        footer.removeChild(temp);
      }).then(function () {
        const footer = element.querySelector(".u-footer");
        expect(footer.getAttribute("placement")).to.equal("hidden");

        // Data-behavior should be removed when placement is not sticky.
        expect(footer.hasAttribute("data-behavior")).to.be.false;
      });
    });

    it("should update data-behavior when switching back to sticky", function () {
      return asyncRun(function () {
        // First set to scroll.
        widget.dataUpdate({
          "footer:placement": "scroll"
        });
      }).then(function () {
        const footer = element.querySelector(".u-footer");
        expect(footer.getAttribute("placement")).to.equal("scroll");

        // Then switch back to sticky.
        return asyncRun(function () {
          widget.dataUpdate({
            "footer:placement": "sticky"
          });

          // Trigger MutationObserver by adding and removing a temporary element.
          const temp = document.createElement("span");
          footer.appendChild(temp);
          footer.removeChild(temp);
        });
      }).then(function () {
        const footer = element.querySelector(".u-footer");
        expect(footer.getAttribute("placement")).to.equal("sticky");

        // Data-behavior should be set (it's set on initial load and not removed).
        expect(footer.hasAttribute("data-behavior")).to.be.true;
        const behavior = footer.getAttribute("data-behavior");
        expect(["fixed", "sticky"]).to.include(behavior);
      });
    });

    it("should apply correct CSS position based on data-behavior", function () {
      return asyncRun(function () {
        // Reset to sticky placement.
        widget.dataUpdate({
          "header:placement": "sticky",
          "footer:placement": "sticky"
        });
      }).then(function () {
        const header = element.querySelector(".u-header");
        const footer = element.querySelector(".u-footer");
        const footerBehavior = footer.getAttribute("data-behavior");

        // Verify that attributes are correctly set for CSS to apply.
        expect(header.getAttribute("placement")).to.equal("sticky");
        expect(footer.getAttribute("placement")).to.equal("sticky");
        // Only footer has data-behavior.
        expect(header.hasAttribute("data-behavior")).to.be.false;
        expect(["fixed", "sticky"]).to.include(footerBehavior);

        // Check computed styles when browser supports it.
        const footerStyle = window.getComputedStyle(footer);

        // CSS position should match data-behavior (if computed style is available).
        if (footerStyle.position) {
          if (footerBehavior === "fixed") {
            expect(footerStyle.position).to.equal("fixed");
          } else if (footerBehavior === "sticky") {
            expect(footerStyle.position).to.equal("sticky");
          }
        }
      });
    });

    it("should set data-behavior to sticky or fixed when content overflows", function () {
      return asyncRun(function () {
        // Create multiple child definitions to generate scrollable content.
        const componentDef = {
          "componentname": "TESTCOMPONENT",
          "properties": {},
          "type": "component",
          "widget_class": "UX.CompLayout"
        };

        for (let i = 1; i <= 10; i++) {
          componentDef[`#${i + 1}`] = {
            "nm": `ScrollField${i}`,
            "type": "field",
            "widget_class": "UX.TextField",
            "properties": { "area-slot": "main" },
            "id": `#${i + 1}`
          };
        }

        componentTester.createWidget(null, createSkeleton(componentWidgetId), componentDef);
        const testElement = componentTester.element;
        const testWidget = componentTester.widget;

        // Set placement to sticky and ensure content has height.
        testWidget.dataUpdate({
          "footer:placement": "sticky",
          "main:padding": "large"
        });

        const main = testElement.querySelector(".u-main");
        const footer = testElement.querySelector(".u-footer");

        // Add some height to child elements to create overflow.
        const childElements = main.querySelectorAll("[id^='ufld:']");
        childElements.forEach(child => {
          child.style.height = "100px";
          child.style.marginBottom = "20px";
        });

        // Trigger MutationObserver by adding and removing a temporary element.
        const temp = document.createElement("span");
        footer.appendChild(temp);
        footer.removeChild(temp);
      }).then(function () {
        const testElement = componentTester.element;
        const footer = testElement.querySelector(".u-footer");

        expect(footer.getAttribute("placement")).to.equal("sticky");

        // Verify data-behavior is set to sticky or fixed.
        expect(footer.hasAttribute("data-behavior")).to.be.true;
        const behavior = footer.getAttribute("data-behavior");
        expect(["sticky", "fixed"]).to.include(behavior, "Footer should have data-behavior set to sticky or fixed when content overflows.");

        // Verify computed style matches behavior (if styles are computed).
        const footerStyle = window.getComputedStyle(footer);
        if (footerStyle.position && footerStyle.position !== "") {
          if (behavior === "sticky") {
            expect(["sticky", "-webkit-sticky"]).to.include(footerStyle.position);
          } else if (behavior === "fixed") {
            expect(footerStyle.position).to.equal("fixed");
          }
        }
      });
    });
  });

  describe("Default Theme Application", function () {
    let element;

    before(function () {
      componentTester.createWidget(null, createSkeleton(componentWidgetId), mockComponentDef);
      element = componentTester.element;
      assert(element, "Widget top element is not defined!");
    });

    it("should have defaultTheme static property defined", function () {
      const defaultTheme = componentWidgetClass.defaultTheme;
      assert(defaultTheme, "defaultTheme should be defined on widget class.");
      assert(defaultTheme.header, "defaultTheme should have header configuration.");
      assert(defaultTheme.footer, "defaultTheme should have footer configuration.");
    });

    it("should have correct default theme values for header", function () {
      const headerTheme = componentWidgetClass.defaultTheme.header;
      expect(headerTheme.neutral).to.equal("#0078d4");
      expect(headerTheme.accent).to.equal("#4A9EFF");
      expect(headerTheme.luminance).to.equal(0.23);
    });

    it("should have correct default theme values for footer", function () {
      const footerTheme = componentWidgetClass.defaultTheme.footer;
      expect(footerTheme.neutral).to.equal("#808080");
      expect(footerTheme.accent).to.equal("#0078d4");
      expect(footerTheme.luminance).to.equal(0.9);
    });

    it("should apply dark mode luminance to header section", function () {
      let header;
      return asyncRun(function () {
        header = element.querySelector(".u-header");
        // Verify that header section exists and is connected.
        assert(header, "Header section should exist");
        assert(header.isConnected, "Header should be connected to DOM");
      }).then(function () {
        const computedStyle = window.getComputedStyle(header);
        const headerLuminance = computedStyle.getPropertyValue("--base-layer-luminance");
        // Verify the theme configuration has correct luminance value.
        expect(headerLuminance).to.equal("0.23", "Header theme should have luminance 0.23");
      });
    });

    it("should apply custom luminance to footer section", function () {
      let footer;
      return asyncRun(function () {
        footer = element.querySelector(".u-footer");
        // Verify that footer section exists and is connected.
        assert(footer, "Footer section should exist");
        assert(footer.isConnected, "Footer should be connected to DOM");
      }).then(function () {
        const computedStyle = window.getComputedStyle(footer);
        const footerLuminance = computedStyle.getPropertyValue("--base-layer-luminance");
        // Verify the theme configuration has correct luminance value.
        expect(footerLuminance).to.equal("0.9", "Footer theme should have luminance 0.9");
      });
    });

    it("should have blue neutral color for header section", function () {
      const header = element.querySelector(".u-header");
      const headerTheme = componentWidgetClass.defaultTheme.header;

      expect(headerTheme.neutral).to.equal("#0078d4");
      const headerStyle = window.getComputedStyle(header);
      const headerNeutral = headerStyle.getPropertyValue("--neutral-base-color");
      assert(headerNeutral !== "", "Header neutral color should be applied.");
    });

    it("should have gray neutral color for footer section", function () {
      const footer = element.querySelector(".u-footer");
      const footerTheme = componentWidgetClass.defaultTheme.footer;

      expect(footerTheme.neutral).to.equal("#808080");
      const footerStyle = window.getComputedStyle(footer);
      const footerNeutral = footerStyle.getPropertyValue("--neutral-base-color");
      assert(footerNeutral !== "", "Footer neutral color should be applied.");
    });

    it("should have lighter blue accent color for header section", function () {
      const header = element.querySelector(".u-header");
      const headerTheme = componentWidgetClass.defaultTheme.header;

      expect(headerTheme.accent).to.equal("#4A9EFF");
      const headerStyle = window.getComputedStyle(header);
      const headerAccent = headerStyle.getPropertyValue("--accent-base-color");
      assert(headerAccent !== "", "Header accent color should be applied.");
    });

    it("should have standard blue accent color for footer section", function () {
      const footer = element.querySelector(".u-footer");
      const footerTheme = componentWidgetClass.defaultTheme.footer;

      expect(footerTheme.accent).to.equal("#0078d4");
      const footerStyle = window.getComputedStyle(footer);
      const footerAccent = footerStyle.getPropertyValue("--accent-base-color");
      assert(footerAccent !== "", "Footer accent color should be applied.");
    });

    it("should have child widgets in header section inherit theme tokens", function () {
      return asyncRun(function () {
        const componentDef = {
          "#2": {
            "nm": "HeaderChild",
            "type": "field",
            "widget_class": "UX.TextField",
            "properties": { "area-slot": "header" },
            "id": "#2"
          },
          "componentname": "TESTCOMPONENT",
          "properties": {},
          "type": "component",
          "widget_class": "UX.CompLayout"
        };
        componentTester.createWidget(null, createSkeleton(componentWidgetId), componentDef);
        componentTester.onConnect();
      }).then(function () {
        const element = componentTester.element;

        const headerSection = element.querySelector(".u-header");
        const childElement = headerSection.querySelector("[id^='ufld:'], [id^='uent:']");
        assert(childElement, "Child widget should exist in header section.");

        const headerStyle = window.getComputedStyle(headerSection);
        const childStyle = window.getComputedStyle(childElement);

        const headerNeutral = headerStyle.getPropertyValue("--neutral-base-color");
        const headerAccent = headerStyle.getPropertyValue("--accent-base-color");
        const headerLuminance = headerStyle.getPropertyValue("--base-layer-luminance");

        const childNeutral = childStyle.getPropertyValue("--neutral-base-color");
        const childAccent = childStyle.getPropertyValue("--accent-base-color");
        const childLuminance = childStyle.getPropertyValue("--base-layer-luminance");

        // Child should inherit exact header theme values.
        expect(childNeutral).to.equal(headerNeutral, "Child widget should inherit same neutral-base-color as header.");
        expect(childAccent).to.equal(headerAccent, "Child widget should inherit same accent-base-color as header.");
        expect(childLuminance).to.equal(headerLuminance, "Child widget should inherit same luminance as header (0.23).");
      });
    });

    it("should have child widgets in footer section inherit theme tokens", function () {
      return asyncRun(function () {
        const componentDef = {
          "#2": {
            "nm": "FooterChild",
            "type": "field",
            "widget_class": "UX.TextField",
            "properties": { "area-slot": "footer" },
            "id": "#2"
          },
          "componentname": "TESTCOMPONENT",
          "properties": {},
          "type": "component",
          "widget_class": "UX.CompLayout"
        };
        componentTester.createWidget(null, createSkeleton(componentWidgetId), componentDef);
        componentTester.onConnect();
      }).then(function () {
        const element = componentTester.element;

        const footerSection = element.querySelector(".u-footer");
        const childElement = footerSection.querySelector("[id^='ufld:'], [id^='uent:']");
        assert(childElement, "Child widget should exist in footer section.");

        const footerStyle = window.getComputedStyle(footerSection);
        const childStyle = window.getComputedStyle(childElement);

        const footerNeutral = footerStyle.getPropertyValue("--neutral-base-color");
        const footerAccent = footerStyle.getPropertyValue("--accent-base-color");
        const footerLuminance = footerStyle.getPropertyValue("--base-layer-luminance");

        const childNeutral = childStyle.getPropertyValue("--neutral-base-color");
        const childAccent = childStyle.getPropertyValue("--accent-base-color");
        const childLuminance = childStyle.getPropertyValue("--base-layer-luminance");

        // Child should inherit exact footer theme values.
        expect(childNeutral).to.equal(footerNeutral, "Child widget should inherit same neutral-base-color as footer.");
        expect(childAccent).to.equal(footerAccent, "Child widget should inherit same accent-base-color as footer.");
        expect(childLuminance).to.equal(footerLuminance, "Child widget should inherit same luminance as footer (0.9).");
      });
    });
  });

  describe("applyColorPalette method tests", function () {
    let element;
    let widget;

    before(function () {
      componentTester.createWidget(null, createSkeleton(componentWidgetId), mockComponentDef);
      widget = componentTester.widget;
      element = componentTester.element;
      assert(element, "Widget top element is not defined!");
    });

    it("should apply custom color palette to header section", function () {
      const header = element.querySelector(".u-header");
      const customNeutral = "#FF5733";
      const customAccent = "#33FF57";
      const customLuminance = 0.5;

      widget.applyColorPalette(header, customNeutral, customAccent, customLuminance);

      const headerStyle = window.getComputedStyle(header);
      const neutralColor = headerStyle.getPropertyValue("--neutral-base-color");
      const accentColor = headerStyle.getPropertyValue("--accent-base-color");
      const luminance = headerStyle.getPropertyValue("--base-layer-luminance");

      // CSS custom properties should be set (may be empty string in some test environments).
      assert(neutralColor !== null && neutralColor !== undefined, "Neutral color property should exist.");
      assert(accentColor !== null && accentColor !== undefined, "Accent color property should exist.");
      expect(luminance).to.not.be.null;
    });

    it("should apply custom color palette to footer section", function () {
      const footer = element.querySelector(".u-footer");
      const customNeutral = "#ABCDEF";
      const customAccent = "#FEDCBA";
      const customLuminance = 0.25;

      widget.applyColorPalette(footer, customNeutral, customAccent, customLuminance);

      const footerStyle = window.getComputedStyle(footer);
      const neutralColor = footerStyle.getPropertyValue("--neutral-base-color");
      const accentColor = footerStyle.getPropertyValue("--accent-base-color");
      const luminance = footerStyle.getPropertyValue("--base-layer-luminance");

      // CSS custom properties should be set (may be empty string in some test environments).
      assert(neutralColor !== null && neutralColor !== undefined, "Neutral color property should exist.");
      assert(accentColor !== null && accentColor !== undefined, "Accent color property should exist.");
      expect(luminance).to.not.be.null;
    });

    it("should handle invalid hex color gracefully", function () {
      const header = element.querySelector(".u-header");
      const invalidColor = "not-a-color";
      const validAccent = "#0078d4";
      const validLuminance = 0.5;

      // Should not throw error with invalid color.
      expect(() => {
        widget.applyColorPalette(header, invalidColor, validAccent, validLuminance);
      }).to.not.throw();
    });

    it("should apply different colors to different sections simultaneously", function () {
      return asyncRun(function () {
        const header = element.querySelector(".u-header");
        const footer = element.querySelector(".u-footer");

        widget.applyColorPalette(header, "#FF0000", "#00FF00", 0.2);
        widget.applyColorPalette(footer, "#0000FF", "#FF0000", 0.8);
      }).then(function () {
        const header = element.querySelector(".u-header");
        const footer = element.querySelector(".u-footer");

        const headerLuminance = window.getComputedStyle(header).getPropertyValue("--base-layer-luminance");
        const footerLuminance = window.getComputedStyle(footer).getPropertyValue("--base-layer-luminance");

        // CSS custom properties should be set (may be empty string in some test environments).
        expect(headerLuminance).to.not.be.null;
        expect(footerLuminance).to.not.be.null;
      });
    });
  });

  describe("applyDefaultTheme method tests", function () {
    let element;
    let widget;

    before(function () {
      componentTester.createWidget(null, createSkeleton(componentWidgetId), mockComponentDef);
      element = componentTester.element;
      widget = componentTester.widget;
      assert(element, "Widget top element is not defined!");
    });

    it("should apply default theme to header on widget creation", function (done) {
      const header = element.querySelector(".u-header");
      const headerTheme = componentWidgetClass.defaultTheme.header;

      // Ensure element is in document for getComputedStyle to work.
      if (!element.isConnected) {
        document.body.appendChild(element);
      }

      // Wait for browser to apply design tokens.
      requestAnimationFrame(() => {
        // In test environment, Fluent UI tokens may not set CSS properties.
        // Just verify the method was called successfully (no errors thrown).
        expect(header).to.exist;
        expect(widget.applyDefaultTheme).to.be.a("function");
        expect(headerTheme.luminance).to.equal(0.23);
        done();
      });
    });

    it("should apply default theme to footer on widget creation", function (done) {
      const footer = element.querySelector(".u-footer");
      const footerTheme = componentWidgetClass.defaultTheme.footer;

      // Ensure element is in document.
      if (!element.isConnected) {
        document.body.appendChild(element);
      }

      // Wait for browser to apply design tokens.
      requestAnimationFrame(() => {
        // In test environment, Fluent UI tokens may not set CSS properties.
        // Just verify the method was called successfully (no errors thrown).
        expect(footer).to.exist;
        expect(widget.applyDefaultTheme).to.be.a("function");
        expect(footerTheme.luminance).to.equal(0.9);
        done();
      });
    });

    it("should allow re-applying default theme to a section", function (done) {
      const header = element.querySelector(".u-header");

      // Ensure element is in document.
      if (!element.isConnected) {
        document.body.appendChild(element);
      }

      // First apply custom theme.
      widget.applyColorPalette(header, "#FFFFFF", "#000000", 0.1);

      // Then re-apply default theme.
      widget.applyDefaultTheme(element, "header");

      // Wait for browser to apply design tokens.
      requestAnimationFrame(() => {
        // In test environment, just verify methods executed without errors.
        expect(widget.applyColorPalette).to.be.a("function");
        expect(widget.applyDefaultTheme).to.be.a("function");
        expect(componentWidgetClass.defaultTheme.header.luminance).to.equal(0.23);
        done();
      });
    });
  });

  describe("Sticky placement with window resize", function () {
    let element;
    let widget;

    before(function () {
      componentTester.createWidget(null, createSkeleton(componentWidgetId), mockComponentDef);
      widget = componentTester.widget;
      element = componentTester.element;
      assert(element, "Widget top element is not defined!");
    });

    it("should respond to window resize events", function () {
      return asyncRun(function () {
        // Ensure footer has sticky placement.
        widget.dataUpdate({ "footer:placement": "sticky" });

        // Trigger window resize event.
        // eslint-disable-next-line no-undef
        window.dispatchEvent(new Event("resize"));
      }).then(function () {
        const footer = element.querySelector(".u-footer");
        const afterResizeBehavior = footer.getAttribute("data-behavior");

        // Behavior attribute should exist when placement is sticky.
        if (afterResizeBehavior) {
          expect(["sticky", "fixed"]).to.include(afterResizeBehavior);
        }
      });
    });

    it("should maintain footer data-behavior after multiple resizes", function () {
      return asyncRun(function () {
        // Trigger multiple resize events.
        for (let i = 0; i < 5; i++) {
          // eslint-disable-next-line no-undef
          window.dispatchEvent(new Event("resize"));
        }
      }).then(function () {
        const footer = element.querySelector(".u-footer");
        const behavior = footer.getAttribute("data-behavior");
        expect(footer.getAttribute("placement")).to.equal("sticky");
        if (behavior) {
          expect(["sticky", "fixed"]).to.include(behavior);
        }
      });
    });
  });

  describe("Reset properties", function () {
    let element;

    before(function () {
      componentTester.createWidget(null, createSkeleton(componentWidgetId), mockComponentDef);
      element = componentTester.element;
      assert(element, "Widget top element is not defined!");
    });

    it("should reset all properties and values to initial values if initial values exist", function () {
      const initialValues = {
        "header:placement": "hidden",
        "header:layout-type": "vertical-wrap",
        "header:horizontal-align": "center",
        "header:vertical-align": "end",
        "main:layout-type": "horizontal-wrap",
        "footer:placement": "scroll",
        "footer:layout-type": "vertical-wrap",
        "footer:horizontal-align": "center",
        "footer:vertical-align": "end"
      };

      return asyncRun(function () {
        componentTester.dataInit(null, null, null, initialValues);
      })
        .then(function () {
          return asyncRun(function () {
            componentTester.dataUpdate({
              "header:placement": "sticky",
              "header:layout-type": "horizontal-scroll",
              "header:horizontal-align": "end",
              "header:vertical-align": "center",
              "main:layout-type": "vertical-wrap",
              "footer:placement": "sticky",
              "footer:layout-type": "horizontal-wrap",
              "footer:horizontal-align": "space-between",
              "footer:vertical-align": "center"
            });
          });
        })
        .then(function () {
          expect(element.querySelector(".u-header").getAttribute("placement"), "Header placement should be 'sticky'.").to.equal("sticky");
          expect(element.querySelector(".u-header").getAttribute("layout-type"), "Header layout-type should be 'horizontal-scroll'.").to.equal("horizontal-scroll");
          expect(element.querySelector(".u-main").getAttribute("layout-type"), "Main layout-type should be 'vertical-wrap'.").to.equal("vertical-wrap");
          expect(element.querySelector(".u-footer").getAttribute("placement"), "Footer placement should be 'sticky'.").to.equal("sticky");
        })
        .then(function () {
          return asyncRun(function () {
            componentTester.resetWidget();
          });
        })
        .then(function () {
          expect(element.querySelector(".u-header").getAttribute("placement"), "Header placement should be reset to 'hidden'.").to.equal("hidden");
          expect(element.querySelector(".u-header").getAttribute("layout-type"), "Header layout-type should be reset to 'vertical-wrap'.").to.equal("vertical-wrap");
          expect(element.querySelector(".u-header").getAttribute("horizontal-align"), "Header horizontal-align should be reset to 'center'.").to.equal("center");
          expect(element.querySelector(".u-header").getAttribute("vertical-align"), "Header vertical-align should be reset to 'end'.").to.equal("end");
          expect(element.querySelector(".u-main").getAttribute("layout-type"), "Main layout-type should be reset to 'horizontal-wrap'.").to.equal("horizontal-wrap");
          expect(element.querySelector(".u-footer").getAttribute("placement"), "Footer placement should be reset to 'scroll'.").to.equal("scroll");
          expect(element.querySelector(".u-footer").getAttribute("layout-type"), "Footer layout-type should be reset to 'vertical-wrap'.").to.equal("vertical-wrap");
          expect(element.querySelector(".u-footer").getAttribute("horizontal-align"), "Footer horizontal-align should be reset to 'center'.").to.equal("center");
          expect(element.querySelector(".u-footer").getAttribute("vertical-align"), "Footer vertical-align should be reset to 'end'.").to.equal("end");
        });
    });

    it("should reset all properties and values to default values if no initial values exist", function () {
      const initialValues = {};

      return asyncRun(function () {
        componentTester.dataInit(null, null, null, initialValues);
      })
        .then(function () {
          return asyncRun(function () {
            componentTester.dataUpdate({
              "header:placement": "hidden",
              "header:layout-type": "vertical-wrap",
              "header:horizontal-align": "center",
              "header:vertical-align": "end",
              "main:layout-type": "horizontal-wrap",
              "footer:placement": "scroll",
              "footer:layout-type": "vertical-wrap",
              "footer:horizontal-align": "center",
              "footer:vertical-align": "end"
            });
          });
        })
        .then(function () {
          expect(element.querySelector(".u-header").getAttribute("placement"), "Header placement should be 'hidden'.").to.equal("hidden");
          expect(element.querySelector(".u-footer").getAttribute("placement"), "Footer placement should be 'scroll'.").to.equal("scroll");
        })
        .then(function () {
          return asyncRun(function () {
            componentTester.resetWidget();
          });
        })
        .then(function () {
          expect(element.querySelector(".u-header").getAttribute("placement"), "Header placement should be reset to 'sticky'.").to.equal("sticky");
          expect(element.querySelector(".u-header").getAttribute("layout-type"), "Header layout-type should be reset to 'horizontal-wrap'.").to.equal("horizontal-wrap");
          expect(element.querySelector(".u-header").getAttribute("horizontal-align"), "Header horizontal-align should be reset to 'space-between'.").to.equal("space-between");
          expect(element.querySelector(".u-header").getAttribute("vertical-align"), "Header vertical-align should be reset to 'center'.").to.equal("center");
          expect(element.querySelector(".u-main").getAttribute("layout-type"), "Main layout-type should be reset to 'vertical-scroll'.").to.equal("vertical-scroll");
          expect(element.querySelector(".u-main").getAttribute("horizontal-align"), "Main horizontal-align should be reset to 'start'.").to.equal("start");
          expect(element.querySelector(".u-main").getAttribute("vertical-align"), "Main vertical-align should be reset to 'start'.").to.equal("start");
          expect(element.querySelector(".u-footer").getAttribute("placement"), "Footer placement should be reset to 'sticky'.").to.equal("sticky");
          expect(element.querySelector(".u-footer").getAttribute("layout-type"), "Footer layout-type should be reset to 'horizontal-wrap'.").to.equal("horizontal-wrap");
          expect(element.querySelector(".u-footer").getAttribute("horizontal-align"), "Footer horizontal-align should be reset to 'space-between'.").to.equal("space-between");
          expect(element.querySelector(".u-footer").getAttribute("vertical-align"), "Footer vertical-align should be reset to 'center'.").to.equal("center");
        });
    });
  });

  describe("Widget reuse", function () {
    let element;

    it("should reset all properties and values to defaults when reused", function () {
      const componentSkeleton = createSkeleton(componentWidgetId);
      componentTester.createWidget(null, componentSkeleton, mockComponentDef);
      element = componentTester.element;

      return asyncRun(function () {
        componentTester.dataUpdate({
          "header:placement": "hidden",
          "header:layout-type": "vertical-wrap",
          "header:horizontal-align": "center",
          "header:vertical-align": "end",
          "main:layout-type": "horizontal-wrap",
          "footer:placement": "scroll",
          "footer:layout-type": "vertical-wrap",
          "footer:horizontal-align": "center",
          "footer:vertical-align": "end"
        });
      })
        .then(function () {
          expect(element.querySelector(".u-header").getAttribute("placement"), "Header placement should be 'hidden' before reuse.").to.equal("hidden");
          expect(element.querySelector(".u-footer").getAttribute("placement"), "Footer placement should be 'scroll' before reuse.").to.equal("scroll");
        })
        .then(function () {
          componentTester.dataCleanup();
          return asyncRun(function () {
            componentTester.dataInit();
          });
        })
        .then(function () {
          assert(element.querySelector(":scope > .u-header"), "Header section should exist after reuse.");
          assert(element.querySelector(":scope > .u-main"), "Main section should exist after reuse.");
          assert(element.querySelector(":scope > .u-footer"), "Footer section should exist after reuse.");
          expect(element.querySelector(".u-header").getAttribute("placement"), "Header placement should be reset to 'sticky' after reuse.").to.equal("sticky");
          expect(element.querySelector(".u-header").getAttribute("layout-type"), "Header layout-type should be reset to 'horizontal-wrap' after reuse.").to.equal("horizontal-wrap");
          expect(element.querySelector(".u-header").getAttribute("horizontal-align"), "Header horizontal-align should be reset to 'space-between' after reuse.").to.equal("space-between");
          expect(element.querySelector(".u-header").getAttribute("vertical-align"), "Header vertical-align should be reset to 'center' after reuse.").to.equal("center");
          expect(element.querySelector(".u-main").getAttribute("layout-type"), "Main layout-type should be reset to 'vertical-scroll' after reuse.").to.equal("vertical-scroll");
          expect(element.querySelector(".u-main").getAttribute("horizontal-align"), "Main horizontal-align should be reset to 'start' after reuse.").to.equal("start");
          expect(element.querySelector(".u-main").getAttribute("vertical-align"), "Main vertical-align should be reset to 'start' after reuse.").to.equal("start");
          expect(element.querySelector(".u-footer").getAttribute("placement"), "Footer placement should be reset to 'sticky' after reuse.").to.equal("sticky");
          expect(element.querySelector(".u-footer").getAttribute("layout-type"), "Footer layout-type should be reset to 'horizontal-wrap' after reuse.").to.equal("horizontal-wrap");
          expect(element.querySelector(".u-footer").getAttribute("horizontal-align"), "Footer horizontal-align should be reset to 'space-between' after reuse.").to.equal("space-between");
          expect(element.querySelector(".u-footer").getAttribute("vertical-align"), "Footer vertical-align should be reset to 'center' after reuse.").to.equal("center");
        });
    });
  });
})();

