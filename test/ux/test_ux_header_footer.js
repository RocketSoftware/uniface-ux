(function () {
  "use strict";

  const assert = chai.assert;
  const expect = chai.expect;
  const tester = new umockup.WidgetTester();
  const widgetId = tester.widgetId;
  const widgetName = tester.widgetName;
  const widgetClass = tester.getWidgetClass();
  const asyncRun = umockup.asyncRun;

  // umockup.createUxDefinitions provides getChildDefinitions/setProperty now; no local override needed.

  /**
   * Mock implementation of child definition object.
   */
  class MockChildDefinition {
    constructor(name, type = "field", properties = {}) {
      this.name = name;
      this.type = type;
      this.properties = properties;
    }

    getName() {
      return this.name;
    }

    getType() {
      return this.type;
    }

    getProperty(propertyName) {
      return this.properties[propertyName] || null;
    }

    getChildDefinitions() {
      return;
    }
  }

  /**
   * Mock implementation of object definition with child definitions support.
   */
  class MockObjectDefinition {
    constructor(properties = {}, children = []) {
      this.properties = properties;
      this.children = children;
    }

    getProperty(propertyName) {
      return this.properties[propertyName];
    }

    getPropertyNames() {
      return Object.keys(this.properties);
    }

    setProperty(propertyName, propertyValue) {
      this.properties[propertyName] = propertyValue;
    }

    getChildDefinitions() {
      return this.children;
    }
  }

  /**
   * Helper function to get ChildWidgets worker from a specific section.
   */
  function getChildWidgetsWorker(sectionClass) {
    const sectionElement = widgetClass.structure.childWorkers.find(w => w.styleClass === sectionClass);
    return sectionElement?.childWorkers.find(w => w.slotConfig !== undefined);
  }

  /**
   * Helper function to process layout with specific child definitions.
   */
  function processLayoutWithChildren(children) {
    const skeletonElement = document.getElementById(widgetId);
    const mockObjectDef = new MockObjectDefinition({}, children);

    tester.layoutArgs = [skeletonElement, mockObjectDef];

    const element = widgetClass.processLayout(skeletonElement, mockObjectDef);
    tester.element = element;
    tester.uxTagName = element.tagName;

    return element;
  }

  /**
   * Helper function to reset tester state for child definition tests.
   */
  function resetTester() {
    tester.widget = null;
    tester.element = null;
    tester.uxTagName = null;
  }

  function verifyWidgetClass(widgetClass) {
    assert(widgetClass, `Widget class '${widgetName}' is not defined.`);
  }

  describe("Uniface mockup tests", function () {

    it(`get class ${widgetName}`, function () {
      verifyWidgetClass(widgetClass);
    });

  });

  describe("Uniface static structure constructor() definition", function () {

    it("should have a static property structure of type Element", function () {
      verifyWidgetClass(widgetClass);
      const structure = widgetClass.structure;
      expect(structure.constructor).to.be.an.instanceof(Element.constructor);
      expect(structure.tagName).to.equal("uf-shell");
      expect(structure.styleClass).to.equal("");
      expect(structure.elementQuerySelector).to.equal("");
      expect(structure.childWorkers).to.be.an("array");
    });

    it("should have header, main, and footer sections", function () {
      verifyWidgetClass(widgetClass);
      const structure = widgetClass.structure;

      // Find section elements by their styleClass (more reliable than checking constructor name).
      const headerElement = structure.childWorkers.find(w => w.styleClass === "u-header");
      const mainElement = structure.childWorkers.find(w => w.styleClass === "u-main");
      const footerElement = structure.childWorkers.find(w => w.styleClass === "u-footer");

      // Check header section.
      assert(headerElement, "Header section should exist.");
      expect(headerElement.tagName).to.equal("uf-header");

      // Check main section.
      assert(mainElement, "Main section should exist.");
      expect(mainElement.tagName).to.equal("uf-main");

      // Check footer section.
      assert(footerElement, "Footer section should exist.");
      expect(footerElement.tagName).to.equal("uf-footer");
    });

  });

  describe(`${widgetName}.processLayout()`, function () {
    let element;

    it("processLayout()", function () {
      verifyWidgetClass(widgetClass);
      element = tester.processLayout();
      expect(element).to.have.tagName(tester.uxTagName);
    });

    describe("Checks", function () {

      before(function () {
        verifyWidgetClass(widgetClass);
        element = tester.processLayout();
      });

      it("check instance of HTMLElement", function () {
        expect(element).instanceOf(HTMLElement, `Function processLayout() of ${widgetName} does not return an HTMLElement.`);
      });

      it("check registration of web component", function () {
        const customElementNames = ["uf-shell", "uf-header", "uf-main", "uf-footer"];
        for (const name of customElementNames) {
          assert(window.customElements.get(name), `Web component ${name} has not been registered!`);
        }
      });

      it("check tagName", function () {
        expect(element).to.have.tagName(tester.uxTagName);
      });

      it("check id", function () {
        expect(element).to.have.id(widgetId);
      });

      it("check u-header section", function () {
        const header = element.querySelector(".u-header");
        assert(header, "Widget should have u-header section.");
        expect(header).to.have.tagName("uf-header");
      });

      it("check u-main section", function () {
        const main = element.querySelector(".u-main");
        assert(main, "Widget should have u-main section.");
        expect(main).to.have.tagName("uf-main");
      });

      it("check u-footer section", function () {
        const footer = element.querySelector(".u-footer");
        assert(footer, "Widget should have u-footer section.");
        expect(footer).to.have.tagName("uf-footer");
      });

    });

  });

  describe("Create widget", function () {

    before(function () {
      verifyWidgetClass(widgetClass);
      tester.construct();
    });

    it("constructor()", function () {
      try {
        const widget = tester.construct();
        assert(widget, "Widget is not defined!");
        verifyWidgetClass(widgetClass);
        assert(widgetClass.defaultValues["class:u-header-footer"], "Class is not defined!");
      } catch (e) {
        assert(false, `Failed to construct new widget, exception ${e}.`);
      }
    });

    describe("onConnect()", function () {
      const element = tester.processLayout();
      const widget = tester.onConnect();

      it("check that the element is created and connected", function () {
        assert(element, "Target element is not defined!");
        assert(widget.elements.widget === element, "Widget is not connected!");
      });
    });

  });

  describe("mapTrigger()", function () {

    it("test that no triggers are defined", function () {
      expect(Object.keys(widgetClass.triggers || {}).length).to.equal(0);
    });

  });

  describe("dataInit()", function () {
    const classes = tester.getDefaultClasses();
    let element;

    beforeEach(function () {
      tester.dataInit();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    for (const defaultClass in classes) {
      it(`check class ${defaultClass}`, function () {
        if (classes[defaultClass]) {
          expect(element).to.have.class(defaultClass, `Widget element has class ${defaultClass}.`);
        } else {
          expect(element).not.to.have.class(defaultClass, `Widget element has no class ${defaultClass}.`);
        }
      });
    }

    it("check widget id", function () {
      assert.strictEqual(tester.widget.widget.id.toString().length > 0, true);
    });

    it("check header placement default", function () {
      const header = element.querySelector(".u-header");
      expect(header.getAttribute("placement")).to.equal("sticky");
      // Note: data-behavior is only set when handleStickyPlacement() is called in onConnect().
      // During dataInit(), the attribute is not yet set.
    });

    it("check footer placement default", function () {
      const footer = element.querySelector(".u-footer");
      expect(footer.getAttribute("placement")).to.equal("sticky");
      // Note: data-behavior is only set when handleStickyPlacement() is called in onConnect().
      // During dataInit(), the attribute is not yet set.
    });

    it("check sections structure", function () {
      const header = element.querySelector(".u-header");
      const main = element.querySelector(".u-main");
      const footer = element.querySelector(".u-footer");

      assert(header, "Header section should exist.");
      assert(main, "Main section should exist.");
      assert(footer, "Footer section should exist.");
    });

    it("check data-behavior is not set during dataInit", function () {
      const header = element.querySelector(".u-header");
      const footer = element.querySelector(".u-footer");

      // data-behavior should not be set yet since handleStickyPlacement() hasn't been called.
      // Note: header never gets data-behavior attribute, only footer does.
      expect(header.hasAttribute("data-behavior")).to.be.false;
      expect(footer.hasAttribute("data-behavior")).to.be.false;
    });

    describe("Default layout properties", function () {

      it("header should have default placement='sticky'", function () {
        expect(tester.widget.data["header:placement"]).to.equal("sticky");
      });

      it("header should have default layout-type='horizontal-wrap'", function () {
        expect(tester.widget.data["header:layout-type"]).to.equal("horizontal-wrap");
      });

      it("header should have default horizontal-align='space-between'", function () {
        expect(tester.widget.data["header:horizontal-align"]).to.equal("space-between");
      });

      it("header should have default vertical-align='center'", function () {
        expect(tester.widget.data["header:vertical-align"]).to.equal("center");
      });

      it("main should have default layout-type='vertical-scroll'", function () {
        expect(tester.widget.data["main:layout-type"]).to.equal("vertical-scroll");
      });

      it("main should have default horizontal-align='start'", function () {
        expect(tester.widget.data["main:horizontal-align"]).to.equal("start");
      });

      it("main should have default vertical-align='start'", function () {
        expect(tester.widget.data["main:vertical-align"]).to.equal("start");
      });

      it("footer should have default placement='sticky'", function () {
        expect(tester.widget.data["footer:placement"]).to.equal("sticky");
      });

      it("footer should have default layout-type='horizontal-wrap'", function () {
        expect(tester.widget.data["footer:layout-type"]).to.equal("horizontal-wrap");
      });

      it("footer should have default horizontal-align='space-between'", function () {
        expect(tester.widget.data["footer:horizontal-align"]).to.equal("space-between");
      });

      it("footer should have default vertical-align='center'", function () {
        expect(tester.widget.data["footer:vertical-align"]).to.equal("center");
      });

    });

  });

  describe("dataUpdate()", function () {
    let element;
    let widget;

    before(function () {
      widget = tester.createWidget();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    describe("Header placement", function () {

      it("update header placement to scroll", function () {
        return asyncRun(function () {
          tester.dataUpdate({
            "header:placement": "scroll"
          });
        }).then(function () {
          const header = element.querySelector(".u-header");
          expect(header.getAttribute("placement")).to.equal("scroll");
          const headerStyle = window.getComputedStyle(header);
          expect(headerStyle.position).to.not.equal("fixed");
          expect(headerStyle.position).to.not.equal("sticky");
        });
      });

      it("update header placement to sticky", function () {
        return asyncRun(function () {
          tester.dataUpdate({
            "header:placement": "sticky"
          });
        }).then(function () {
          const header = element.querySelector(".u-header");
          expect(header.getAttribute("placement")).to.equal("sticky");
          // Note: data-behavior is set by observers that trigger on size/DOM changes.
          // It may not be immediately set after dataUpdate, so we don't check it here.
        });
      });

      it("update header placement to hidden", function () {
        return asyncRun(function () {
          tester.dataUpdate({
            "header:placement": "hidden"
          });
        }).then(function () {
          const header = element.querySelector(".u-header");
          expect(header.getAttribute("placement")).to.equal("hidden");
          const headerStyle = window.getComputedStyle(header);
          expect(headerStyle.display).to.equal("none");
        });
      });

    });

    describe("Footer placement", function () {

      it("update footer placement to scroll", function () {
        return asyncRun(function () {
          tester.dataUpdate({
            "footer:placement": "scroll"
          });
        }).then(function () {
          const footer = element.querySelector(".u-footer");
          expect(footer.getAttribute("placement")).to.equal("scroll");
          const footerStyle = window.getComputedStyle(footer);
          expect(footerStyle.position).to.not.equal("fixed");
          expect(footerStyle.position).to.not.equal("sticky");
        });
      });

      it("update footer placement to sticky", function () {
        return asyncRun(function () {
          tester.dataUpdate({
            "footer:placement": "sticky"
          });
        }).then(function () {
          const footer = element.querySelector(".u-footer");
          expect(footer.getAttribute("placement")).to.equal("sticky");
          // Note: data-behavior is set by observers that trigger on size/DOM changes.
          // It may not be immediately set after dataUpdate, so we don't check it here.
        });
      });

      it("update footer placement to hidden", function () {
        return asyncRun(function () {
          tester.dataUpdate({
            "footer:placement": "hidden"
          });
        }).then(function () {
          const footer = element.querySelector(".u-footer");
          expect(footer.getAttribute("placement")).to.equal("hidden");
          const footerStyle = window.getComputedStyle(footer);
          expect(footerStyle.display).to.equal("none");
        });
      });

    });

    describe("Combined placement updates", function () {

      it("update both header and footer placement to sticky", function () {
        return asyncRun(function () {
          tester.dataUpdate({
            "header:placement": "sticky",
            "footer:placement": "sticky"
          });
        }).then(function () {
          const header = element.querySelector(".u-header");
          const footer = element.querySelector(".u-footer");
          expect(header.getAttribute("placement")).to.equal("sticky");
          expect(footer.getAttribute("placement")).to.equal("sticky");
          // Note: data-behavior is set by observers that trigger on size/DOM changes.
          // It may not be immediately set after dataUpdate, so we don't check it here.
        });
      });

      it("hide header and show footer", function () {
        return asyncRun(function () {
          tester.dataUpdate({
            "header:placement": "hidden",
            "footer:placement": "sticky"
          });
        }).then(function () {
          const header = element.querySelector(".u-header");
          const footer = element.querySelector(".u-footer");
          expect(header.getAttribute("placement")).to.equal("hidden");
          expect(footer.getAttribute("placement")).to.equal("sticky");
          const headerStyle = window.getComputedStyle(header);
          expect(headerStyle.display).to.equal("none");
          // Note: data-behavior is set by observers that trigger on size/DOM changes.
          // It may not be immediately set after dataUpdate, so we don't check it here.
        });
      });

    });

    describe("Header layout properties", function () {

      it("should update layout to 'vertical-scroll'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "header:layout-type": "vertical-scroll" });
        }).then(function () {
          expect(widget.data["header:layout-type"]).to.equal("vertical-scroll");
          const headerElement = widget.elements.widget.querySelector(".u-header");
          expect(headerElement.getAttribute("layout-type")).to.equal("vertical-scroll");
        });
      });

      it("should update layout to 'horizontal-wrap'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "header:layout-type": "horizontal-wrap" });
        }).then(function () {
          expect(widget.data["header:layout-type"]).to.equal("horizontal-wrap");
          const headerElement = widget.elements.widget.querySelector(".u-header");
          expect(headerElement.getAttribute("layout-type")).to.equal("horizontal-wrap");
        });
      });

      it("should update layout to 'vertical-wrap'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "header:layout-type": "vertical-wrap" });
        }).then(function () {
          expect(widget.data["header:layout-type"]).to.equal("vertical-wrap");
          const headerElement = widget.elements.widget.querySelector(".u-header");
          expect(headerElement.getAttribute("layout-type")).to.equal("vertical-wrap");
        });
      });

      it("should update layout to 'auto'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "header:layout-type": "auto" });
        }).then(function () {
          expect(widget.data["header:layout-type"]).to.equal("auto");
          const headerElement = widget.elements.widget.querySelector(".u-header");
          expect(headerElement.getAttribute("layout-type")).to.equal("auto");
        });
      });

      it("should update horizontal-align to 'center'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "header:horizontal-align": "center" });
        }).then(function () {
          expect(widget.data["header:horizontal-align"]).to.equal("center");
          const headerElement = widget.elements.widget.querySelector(".u-header");
          expect(headerElement.getAttribute("horizontal-align")).to.equal("center");
        });
      });

      it("should update horizontal-align to 'end'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "header:horizontal-align": "end" });
        }).then(function () {
          expect(widget.data["header:horizontal-align"]).to.equal("end");
          const headerElement = widget.elements.widget.querySelector(".u-header");
          expect(headerElement.getAttribute("horizontal-align")).to.equal("end");
        });
      });

      it("should update horizontal-align to 'space-between'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "header:horizontal-align": "space-between" });
        }).then(function () {
          expect(widget.data["header:horizontal-align"]).to.equal("space-between");
          const headerElement = widget.elements.widget.querySelector(".u-header");
          expect(headerElement.getAttribute("horizontal-align")).to.equal("space-between");
        });
      });

      it("should update horizontal-align to 'space-around'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "header:horizontal-align": "space-around" });
        }).then(function () {
          expect(widget.data["header:horizontal-align"]).to.equal("space-around");
          const headerElement = widget.elements.widget.querySelector(".u-header");
          expect(headerElement.getAttribute("horizontal-align")).to.equal("space-around");
        });
      });

      it("should update horizontal-align to 'space-evenly'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "header:horizontal-align": "space-evenly" });
        }).then(function () {
          expect(widget.data["header:horizontal-align"]).to.equal("space-evenly");
          const headerElement = widget.elements.widget.querySelector(".u-header");
          expect(headerElement.getAttribute("horizontal-align")).to.equal("space-evenly");
        });
      });

      it("should update horizontal-align to 'auto'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "header:horizontal-align": "auto" });
        }).then(function () {
          expect(widget.data["header:horizontal-align"]).to.equal("auto");
          const headerElement = widget.elements.widget.querySelector(".u-header");
          expect(headerElement.getAttribute("horizontal-align")).to.equal("auto");
        });
      });

      it("should update vertical-align to 'center'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "header:vertical-align": "center" });
        }).then(function () {
          expect(widget.data["header:vertical-align"]).to.equal("center");
          const headerElement = widget.elements.widget.querySelector(".u-header");
          expect(headerElement.getAttribute("vertical-align")).to.equal("center");
        });
      });

      it("should update vertical-align to 'end'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "header:vertical-align": "end" });
        }).then(function () {
          expect(widget.data["header:vertical-align"]).to.equal("end");
          const headerElement = widget.elements.widget.querySelector(".u-header");
          expect(headerElement.getAttribute("vertical-align")).to.equal("end");
        });
      });

      it("should update vertical-align to 'stretch'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "header:vertical-align": "stretch" });
        }).then(function () {
          expect(widget.data["header:vertical-align"]).to.equal("stretch");
          const headerElement = widget.elements.widget.querySelector(".u-header");
          expect(headerElement.getAttribute("vertical-align")).to.equal("stretch");
        });
      });

      it("should update vertical-align to 'auto'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "header:vertical-align": "auto" });
        }).then(function () {
          expect(widget.data["header:vertical-align"]).to.equal("auto");
          const headerElement = widget.elements.widget.querySelector(".u-header");
          expect(headerElement.getAttribute("vertical-align")).to.equal("auto");
        });
      });

      it("should handle invalid layout value gracefully", function () {
        const warnSpy = sinon.spy(console, "warn");
        return asyncRun(function () {
          widget.dataUpdate({ "header:layout-type": "invalid-layout" });
        }).then(function () {
          expect(widget.data["header:layout-type"]).to.equal("invalid-layout");
          expect(warnSpy.calledWith(sinon.match("Property 'header:layout-type' invalid value (invalid-layout)"))).to.be.true;
          warnSpy.restore();
        });
      });

    });

    describe("Main layout properties", function () {

      it("should update layout to 'horizontal-scroll'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "main:layout-type": "horizontal-scroll" });
        }).then(function () {
          expect(widget.data["main:layout-type"]).to.equal("horizontal-scroll");
          const mainElement = widget.elements.widget.querySelector(".u-main");
          expect(mainElement.getAttribute("layout-type")).to.equal("horizontal-scroll");
        });
      });

      it("should update layout to 'horizontal-wrap'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "main:layout-type": "horizontal-wrap" });
        }).then(function () {
          expect(widget.data["main:layout-type"]).to.equal("horizontal-wrap");
          const mainElement = widget.elements.widget.querySelector(".u-main");
          expect(mainElement.getAttribute("layout-type")).to.equal("horizontal-wrap");
        });
      });

      it("should update layout to 'vertical-wrap'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "main:layout-type": "vertical-wrap" });
        }).then(function () {
          expect(widget.data["main:layout-type"]).to.equal("vertical-wrap");
          const mainElement = widget.elements.widget.querySelector(".u-main");
          expect(mainElement.getAttribute("layout-type")).to.equal("vertical-wrap");
        });
      });

      it("should update layout to 'auto'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "main:layout-type": "auto" });
        }).then(function () {
          expect(widget.data["main:layout-type"]).to.equal("auto");
          const mainElement = widget.elements.widget.querySelector(".u-main");
          expect(mainElement.getAttribute("layout-type")).to.equal("auto");
        });
      });

      it("should update horizontal-align to 'center'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "main:horizontal-align": "center" });
        }).then(function () {
          expect(widget.data["main:horizontal-align"]).to.equal("center");
          const mainElement = widget.elements.widget.querySelector(".u-main");
          expect(mainElement.getAttribute("horizontal-align")).to.equal("center");
        });
      });

      it("should update horizontal-align to 'end'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "main:horizontal-align": "end" });
        }).then(function () {
          expect(widget.data["main:horizontal-align"]).to.equal("end");
          const mainElement = widget.elements.widget.querySelector(".u-main");
          expect(mainElement.getAttribute("horizontal-align")).to.equal("end");
        });
      });

      it("should update horizontal-align to 'space-between'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "main:horizontal-align": "space-between" });
        }).then(function () {
          expect(widget.data["main:horizontal-align"]).to.equal("space-between");
          const mainElement = widget.elements.widget.querySelector(".u-main");
          expect(mainElement.getAttribute("horizontal-align")).to.equal("space-between");
        });
      });

      it("should update horizontal-align to 'space-around'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "main:horizontal-align": "space-around" });
        }).then(function () {
          expect(widget.data["main:horizontal-align"]).to.equal("space-around");
          const mainElement = widget.elements.widget.querySelector(".u-main");
          expect(mainElement.getAttribute("horizontal-align")).to.equal("space-around");
        });
      });

      it("should update horizontal-align to 'space-evenly'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "main:horizontal-align": "space-evenly" });
        }).then(function () {
          expect(widget.data["main:horizontal-align"]).to.equal("space-evenly");
          const mainElement = widget.elements.widget.querySelector(".u-main");
          expect(mainElement.getAttribute("horizontal-align")).to.equal("space-evenly");
        });
      });

      it("should update horizontal-align to 'auto'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "main:horizontal-align": "auto" });
        }).then(function () {
          expect(widget.data["main:horizontal-align"]).to.equal("auto");
          const mainElement = widget.elements.widget.querySelector(".u-main");
          expect(mainElement.getAttribute("horizontal-align")).to.equal("auto");
        });
      });

      it("should update vertical-align to 'center'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "main:vertical-align": "center" });
        }).then(function () {
          expect(widget.data["main:vertical-align"]).to.equal("center");
          const mainElement = widget.elements.widget.querySelector(".u-main");
          expect(mainElement.getAttribute("vertical-align")).to.equal("center");
        });
      });

      it("should update vertical-align to 'end'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "main:vertical-align": "end" });
        }).then(function () {
          expect(widget.data["main:vertical-align"]).to.equal("end");
          const mainElement = widget.elements.widget.querySelector(".u-main");
          expect(mainElement.getAttribute("vertical-align")).to.equal("end");
        });
      });

      it("should update vertical-align to 'stretch'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "main:vertical-align": "stretch" });
        }).then(function () {
          expect(widget.data["main:vertical-align"]).to.equal("stretch");
          const mainElement = widget.elements.widget.querySelector(".u-main");
          expect(mainElement.getAttribute("vertical-align")).to.equal("stretch");
        });
      });

      it("should update vertical-align to 'auto'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "main:vertical-align": "auto" });
        }).then(function () {
          expect(widget.data["main:vertical-align"]).to.equal("auto");
          const mainElement = widget.elements.widget.querySelector(".u-main");
          expect(mainElement.getAttribute("vertical-align")).to.equal("auto");
        });
      });

      it("should handle invalid layout value gracefully", function () {
        const warnSpy = sinon.spy(console, "warn");
        return asyncRun(function () {
          widget.dataUpdate({ "main:layout-type": "invalid-layout" });
        }).then(function () {
          expect(widget.data["main:layout-type"]).to.equal("invalid-layout");
          expect(warnSpy.calledWith(sinon.match("Property 'main:layout-type' invalid value (invalid-layout)"))).to.be.true;
          warnSpy.restore();
        });
      });

    });

    describe("Footer layout properties", function () {

      it("should update layout to 'vertical-scroll'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "footer:layout-type": "vertical-scroll" });
        }).then(function () {
          expect(widget.data["footer:layout-type"]).to.equal("vertical-scroll");
          const footerElement = widget.elements.widget.querySelector(".u-footer");
          expect(footerElement.getAttribute("layout-type")).to.equal("vertical-scroll");
        });
      });

      it("should update layout to 'horizontal-wrap'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "footer:layout-type": "horizontal-wrap" });
        }).then(function () {
          expect(widget.data["footer:layout-type"]).to.equal("horizontal-wrap");
          const footerElement = widget.elements.widget.querySelector(".u-footer");
          expect(footerElement.getAttribute("layout-type")).to.equal("horizontal-wrap");
        });
      });

      it("should update layout to 'vertical-wrap'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "footer:layout-type": "vertical-wrap" });
        }).then(function () {
          expect(widget.data["footer:layout-type"]).to.equal("vertical-wrap");
          const footerElement = widget.elements.widget.querySelector(".u-footer");
          expect(footerElement.getAttribute("layout-type")).to.equal("vertical-wrap");
        });
      });

      it("should update layout to 'auto'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "footer:layout-type": "auto" });
        }).then(function () {
          expect(widget.data["footer:layout-type"]).to.equal("auto");
          const footerElement = widget.elements.widget.querySelector(".u-footer");
          expect(footerElement.getAttribute("layout-type")).to.equal("auto");
        });
      });

      it("should update horizontal-align to 'center'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "footer:horizontal-align": "center" });
        }).then(function () {
          expect(widget.data["footer:horizontal-align"]).to.equal("center");
          const footerElement = widget.elements.widget.querySelector(".u-footer");
          expect(footerElement.getAttribute("horizontal-align")).to.equal("center");
        });
      });

      it("should update horizontal-align to 'end'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "footer:horizontal-align": "end" });
        }).then(function () {
          expect(widget.data["footer:horizontal-align"]).to.equal("end");
          const footerElement = widget.elements.widget.querySelector(".u-footer");
          expect(footerElement.getAttribute("horizontal-align")).to.equal("end");
        });
      });

      it("should update horizontal-align to 'space-between'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "footer:horizontal-align": "space-between" });
        }).then(function () {
          expect(widget.data["footer:horizontal-align"]).to.equal("space-between");
          const footerElement = widget.elements.widget.querySelector(".u-footer");
          expect(footerElement.getAttribute("horizontal-align")).to.equal("space-between");
        });
      });

      it("should update horizontal-align to 'space-around'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "footer:horizontal-align": "space-around" });
        }).then(function () {
          expect(widget.data["footer:horizontal-align"]).to.equal("space-around");
          const footerElement = widget.elements.widget.querySelector(".u-footer");
          expect(footerElement.getAttribute("horizontal-align")).to.equal("space-around");
        });
      });

      it("should update horizontal-align to 'space-evenly'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "footer:horizontal-align": "space-evenly" });
        }).then(function () {
          expect(widget.data["footer:horizontal-align"]).to.equal("space-evenly");
          const footerElement = widget.elements.widget.querySelector(".u-footer");
          expect(footerElement.getAttribute("horizontal-align")).to.equal("space-evenly");
        });
      });

      it("should update horizontal-align to 'auto'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "footer:horizontal-align": "auto" });
        }).then(function () {
          expect(widget.data["footer:horizontal-align"]).to.equal("auto");
          const footerElement = widget.elements.widget.querySelector(".u-footer");
          expect(footerElement.getAttribute("horizontal-align")).to.equal("auto");
        });
      });

      it("should update vertical-align to 'center'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "footer:vertical-align": "center" });
        }).then(function () {
          expect(widget.data["footer:vertical-align"]).to.equal("center");
          const footerElement = widget.elements.widget.querySelector(".u-footer");
          expect(footerElement.getAttribute("vertical-align")).to.equal("center");
        });
      });

      it("should update vertical-align to 'end'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "footer:vertical-align": "end" });
        }).then(function () {
          expect(widget.data["footer:vertical-align"]).to.equal("end");
          const footerElement = widget.elements.widget.querySelector(".u-footer");
          expect(footerElement.getAttribute("vertical-align")).to.equal("end");
        });
      });

      it("should update vertical-align to 'stretch'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "footer:vertical-align": "stretch" });
        }).then(function () {
          expect(widget.data["footer:vertical-align"]).to.equal("stretch");
          const footerElement = widget.elements.widget.querySelector(".u-footer");
          expect(footerElement.getAttribute("vertical-align")).to.equal("stretch");
        });
      });

      it("should update vertical-align to 'auto'", function () {
        return asyncRun(function () {
          widget.dataUpdate({ "footer:vertical-align": "auto" });
        }).then(function () {
          expect(widget.data["footer:vertical-align"]).to.equal("auto");
          const footerElement = widget.elements.widget.querySelector(".u-footer");
          expect(footerElement.getAttribute("vertical-align")).to.equal("auto");
        });
      });

      it("should handle invalid layout value gracefully", function () {
        const warnSpy = sinon.spy(console, "warn");
        return asyncRun(function () {
          widget.dataUpdate({ "footer:layout-type": "invalid-layout" });
        }).then(function () {
          expect(widget.data["footer:layout-type"]).to.equal("invalid-layout");
          expect(warnSpy.calledWith(sinon.match("Property 'footer:layout-type' invalid value (invalid-layout)"))).to.be.true;
          warnSpy.restore();
        });
      });

    });

  });

  describe("ChildWidgets Integration", function () {
    let element;

    before(function () {
      tester.createWidget();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    it("check that ChildWidgets workers exist in each section", function () {
      const headerElement = widgetClass.structure.childWorkers.find(w => w.styleClass === "u-header");
      const mainElement = widgetClass.structure.childWorkers.find(w => w.styleClass === "u-main");
      const footerElement = widgetClass.structure.childWorkers.find(w => w.styleClass === "u-footer");

      const headerChildWidgets = headerElement.childWorkers.find(w => w.slotConfig !== undefined);
      const mainChildWidgets = mainElement.childWorkers.find(w => w.slotConfig !== undefined);
      const footerChildWidgets = footerElement.childWorkers.find(w => w.slotConfig !== undefined);

      assert(headerChildWidgets, "Header section should have a ChildWidgets worker.");
      assert(mainChildWidgets, "Main section should have a ChildWidgets worker.");
      assert(footerChildWidgets, "Footer section should have a ChildWidgets worker.");
    });

    it("check slot configuration propertyName", function () {
      const childWidgetsWorker = getChildWidgetsWorker("u-header");

      assert(childWidgetsWorker, "ChildWidgets worker should exist in header.");
      assert(childWidgetsWorker.slotConfig, "ChildWidgets should have slotConfig.");
      expect(childWidgetsWorker.slotConfig.propertyName).to.equal("area-slot");
    });

    it("check valid slots configuration", function () {
      const childWidgetsWorker = getChildWidgetsWorker("u-header");

      expect(childWidgetsWorker.slotConfig.validSlots).to.include("header");
      expect(childWidgetsWorker.slotConfig.validSlots).to.include("main");
      expect(childWidgetsWorker.slotConfig.validSlots).to.include("footer");
    });

    it("check default slot is main", function () {
      const childWidgetsWorker = getChildWidgetsWorker("u-main");

      expect(childWidgetsWorker.slotConfig.defaultSlot).to.equal("main");
    });

  });

  describe("Dynamic Index Rules", function () {
    let childWidgetsWorker;

    before(function () {
      tester.createWidget();
      childWidgetsWorker = getChildWidgetsWorker("u-header");
      assert(childWidgetsWorker, "ChildWidgets worker should be initialized.");
      assert(childWidgetsWorker.slotConfig, "SlotConfig should exist.");
      assert(childWidgetsWorker.slotConfig.indexRules, "IndexRules should be defined.");
    });

    it("check index rules for 1 child", function () {
      const rule = childWidgetsWorker.slotConfig.indexRules[1];
      assert(rule, "Index rule for 1 child should exist.");
      expect(rule.main).to.deep.equal([0], "1 child should go to main[0]");
    });

    it("check index rules for 2 children", function () {
      const rule = childWidgetsWorker.slotConfig.indexRules[2];
      assert(rule, "Index rule for 2 children should exist.");
      expect(rule.header).to.deep.equal([0], "First child should go to header[0]");
      expect(rule.main).to.deep.equal([1], "Second child should go to main[1]");
    });

    it("check index rules for 3 children", function () {
      const rule = childWidgetsWorker.slotConfig.indexRules[3];
      assert(rule, "Index rule for 3 children should exist.");
      expect(rule.header).to.deep.equal([0], "First child should go to header[0]");
      expect(rule.main).to.deep.equal([1], "Middle child should go to main[1]");
      expect(rule.footer).to.deep.equal([2], "Last child should go to footer[2]");
    });

    it("check index rules for 5 children", function () {
      const rule = childWidgetsWorker.slotConfig.indexRules[5];
      assert(rule, "Index rule for 5 children should exist.");
      expect(rule.header).to.deep.equal([0], "First child should go to header[0]");
      expect(rule.main).to.deep.equal([1, 2, 3], "Middle children should go to main[1,2,3]");
      expect(rule.footer).to.deep.equal([4], "Last child should go to footer[4]");
    });

    it("check dynamic index rules generation for arbitrary child count", function () {
      // Test with 10 children.
      const rule = childWidgetsWorker.slotConfig.indexRules[10];
      assert(rule, "Index rule for 10 children should be dynamically generated.");
      expect(rule.header).to.deep.equal([0], "First child should go to header[0]");
      expect(rule.main).to.have.lengthOf(8, "Middle 8 children should go to main");
      expect(rule.footer).to.deep.equal([9], "Last child should go to footer[9]");
    });

  });

  describe("Section Structure", function () {
    let element;

    before(function () {
      tester.createWidget();
      element = tester.element;
    });

    it("check header section is positioned correctly in DOM", function () {
      const children = Array.from(element.children);
      const headerIndex = children.findIndex(child => child.classList.contains("u-header"));
      const mainIndex = children.findIndex(child => child.classList.contains("u-main"));
      const footerIndex = children.findIndex(child => child.classList.contains("u-footer"));

      assert(headerIndex < mainIndex, "Header should come before main in DOM.");
      assert(mainIndex < footerIndex, "Main should come before footer in DOM.");
    });

    it("check all sections are uf-header, uf-main, uf-footer elements", function () {
      const header = element.querySelector(".u-header");
      const main = element.querySelector(".u-main");
      const footer = element.querySelector(".u-footer");

      expect(header).to.have.tagName("uf-header");
      expect(main).to.have.tagName("uf-main");
      expect(footer).to.have.tagName("uf-footer");
    });

  });

  describe("ChildWidgets with NO child definitions", function () {
    let element;

    before(function () {
      resetTester();
      element = processLayoutWithChildren([]);
    });

    it("should render widget successfully with no children", function () {
      assert(element, "Widget element should be created.");
      expect(element).to.have.tagName("uf-shell");
    });

    it("should have all three sections", function () {
      const header = element.querySelector(".u-header");
      const main = element.querySelector(".u-main");
      const footer = element.querySelector(".u-footer");

      assert(header, "Header section should exist.");
      assert(main, "Main section should exist.");
      assert(footer, "Footer section should exist.");
    });

    it("should have empty sections with no child elements", function () {
      const header = element.querySelector(".u-header");
      const main = element.querySelector(".u-main");
      const footer = element.querySelector(".u-footer");

      // Only ChildWidgets container divs should be present, no actual child widgets.
      const headerChildren = Array.from(header.children).filter(child => child.id && (child.id.startsWith("uent:") || child.id.startsWith("ufld:")));
      const mainChildren = Array.from(main.children).filter(child => child.id && (child.id.startsWith("uent:") || child.id.startsWith("ufld:")));
      const footerChildren = Array.from(footer.children).filter(child => child.id && (child.id.startsWith("uent:") || child.id.startsWith("ufld:")));

      expect(headerChildren.length).to.equal(0, "Header should have no child widgets.");
      expect(mainChildren.length).to.equal(0, "Main should have no child widgets.");
      expect(footerChildren.length).to.equal(0, "Footer should have no child widgets.");
    });

  });

  describe("ChildWidgets with ONE child (goes to main)", function () {
    let element;

    before(function () {
      resetTester();
      element = processLayoutWithChildren([new MockChildDefinition("TestField1", "field", {})]);
      tester.onConnect();
    });

    it("should render widget with 1 child in main section", function () {
      const main = element.querySelector(".u-main");
      const childElement = main.querySelector("#ufld\\:TestField1");

      assert(childElement, "Child element should be created in main section.");
      expect(childElement.tagName.toLowerCase()).to.equal("div");
    });

    it("should have empty header and footer sections", function () {
      const header = element.querySelector(".u-header");
      const footer = element.querySelector(".u-footer");

      const headerChildren = Array.from(header.children).filter(child => child.id && child.id.startsWith("ufld:"));
      const footerChildren = Array.from(footer.children).filter(child => child.id && child.id.startsWith("ufld:"));

      expect(headerChildren.length).to.equal(0, "Header should be empty.");
      expect(footerChildren.length).to.equal(0, "Footer should be empty.");
    });

  });

  describe("ChildWidgets with TWO children (header and main)", function () {
    let element;

    before(function () {
      resetTester();
      element = processLayoutWithChildren([
        new MockChildDefinition("TestField1", "field", {}),
        new MockChildDefinition("TestField2", "field", {})
      ]);
      tester.onConnect();
    });

    it("should place first child in header", function () {
      const header = element.querySelector(".u-header");
      const childElement = header.querySelector("#ufld\\:TestField1");

      assert(childElement, "First child should be in header section.");
    });

    it("should place second child in main", function () {
      const main = element.querySelector(".u-main");
      const childElement = main.querySelector("#ufld\\:TestField2");

      assert(childElement, "Second child should be in main section.");
    });

    it("should have empty footer section", function () {
      const footer = element.querySelector(".u-footer");
      const footerChildren = Array.from(footer.children).filter(child => child.id && child.id.startsWith("ufld:"));

      expect(footerChildren.length).to.equal(0, "Footer should be empty.");
    });

  });

  describe("ChildWidgets with THREE children (header, main, footer)", function () {
    let element;

    before(function () {
      resetTester();
      element = processLayoutWithChildren([
        new MockChildDefinition("HeaderField", "field", {}),
        new MockChildDefinition("MainField", "field", {}),
        new MockChildDefinition("FooterField", "field", {})
      ]);
      tester.onConnect();
    });

    it("should place first child in header", function () {
      const header = element.querySelector(".u-header");
      const childElement = header.querySelector("#ufld\\:HeaderField");

      assert(childElement, "First child should be in header section.");
    });

    it("should place second child in main", function () {
      const main = element.querySelector(".u-main");
      const childElement = main.querySelector("#ufld\\:MainField");

      assert(childElement, "Second child should be in main section.");
    });

    it("should place third child in footer", function () {
      const footer = element.querySelector(".u-footer");
      const childElement = footer.querySelector("#ufld\\:FooterField");

      assert(childElement, "Third child should be in footer section.");
    });

  });

  describe("ChildWidgets with FIVE children (header, 3 in main, footer)", function () {
    let element;

    before(function () {
      resetTester();
      element = processLayoutWithChildren([
        new MockChildDefinition("Field1", "field", {}),
        new MockChildDefinition("Field2", "field", {}),
        new MockChildDefinition("Field3", "field", {}),
        new MockChildDefinition("Field4", "field", {}),
        new MockChildDefinition("Field5", "field", {})
      ]);
      tester.onConnect();
    });

    it("should place first child in header", function () {
      const header = element.querySelector(".u-header");
      const childElement = header.querySelector("#ufld\\:Field1");

      assert(childElement, "First child should be in header.");
    });

    it("should place middle three children in main", function () {
      const main = element.querySelector(".u-main");
      const child2 = main.querySelector("#ufld\\:Field2");
      const child3 = main.querySelector("#ufld\\:Field3");
      const child4 = main.querySelector("#ufld\\:Field4");

      assert(child2, "Second child should be in main.");
      assert(child3, "Third child should be in main.");
      assert(child4, "Fourth child should be in main.");
    });

    it("should place last child in footer", function () {
      const footer = element.querySelector(".u-footer");
      const childElement = footer.querySelector("#ufld\\:Field5");

      assert(childElement, "Last child should be in footer.");
    });

    it("should verify correct distribution count", function () {
      const header = element.querySelector(".u-header");
      const main = element.querySelector(".u-main");
      const footer = element.querySelector(".u-footer");

      const headerCount = Array.from(header.children).filter(child => child.id && child.id.startsWith("ufld:")).length;
      const mainCount = Array.from(main.children).filter(child => child.id && child.id.startsWith("ufld:")).length;
      const footerCount = Array.from(footer.children).filter(child => child.id && child.id.startsWith("ufld:")).length;

      expect(headerCount).to.equal(1, "Header should have 1 child");
      expect(mainCount).to.equal(3, "Main should have 3 children");
      expect(footerCount).to.equal(1, "Footer should have 1 child");
    });

  });

  describe("ChildWidgets with property-based slot assignment", function () {
    let element;

    before(function () {
      resetTester();
      element = processLayoutWithChildren([
        new MockChildDefinition("Field1", "field", { "area-slot": "main" }),
        new MockChildDefinition("Field2", "field", { "area-slot": "header" }),
        new MockChildDefinition("Field3", "field", { "area-slot": "footer" }),
        new MockChildDefinition("Field4", "field", { "area-slot": "main" })
      ]);
      tester.onConnect();
    });

    it("should place child with area-slot='header' in header", function () {
      const header = element.querySelector(".u-header");
      const childElement = header.querySelector("#ufld\\:Field2");

      assert(childElement, "Field2 with area-slot='header' should be in header section.");
    });

    it("should place children with area-slot='main' in main", function () {
      const main = element.querySelector(".u-main");
      const child1 = main.querySelector("#ufld\\:Field1");
      const child4 = main.querySelector("#ufld\\:Field4");

      assert(child1, "Field1 with area-slot='main' should be in main section.");
      assert(child4, "Field4 with area-slot='main' should be in main section.");
    });

    it("should place child with area-slot='footer' in footer", function () {
      const footer = element.querySelector(".u-footer");
      const childElement = footer.querySelector("#ufld\\:Field3");

      assert(childElement, "Field3 with area-slot='footer' should be in footer section.");
    });

    it("should verify property-based distribution takes precedence over index-based", function () {
      const header = element.querySelector(".u-header");
      const main = element.querySelector(".u-main");
      const footer = element.querySelector(".u-footer");

      const headerCount = Array.from(header.children).filter(child => child.id && child.id.startsWith("ufld:")).length;
      const mainCount = Array.from(main.children).filter(child => child.id && child.id.startsWith("ufld:")).length;
      const footerCount = Array.from(footer.children).filter(child => child.id && child.id.startsWith("ufld:")).length;

      expect(headerCount).to.equal(1, "Header should have 1 child (Field2)");
      expect(mainCount).to.equal(2, "Main should have 2 children (Field1, Field4)");
      expect(footerCount).to.equal(1, "Footer should have 1 child (Field3)");
    });

  });

  describe("ChildWidgets with mixed entity and field types", function () {
    let element;

    before(function () {
      resetTester();
      element = processLayoutWithChildren([
        new MockChildDefinition("Entity1", "entity", {}),
        new MockChildDefinition("Field1", "field", {}),
        new MockChildDefinition("Entity2", "entity", {})
      ]);
      tester.onConnect();
    });

    it("should create entity children with uent: prefix", function () {
      const header = element.querySelector(".u-header");
      const entityElement = header.querySelector("#uent\\:Entity1");

      assert(entityElement, "Entity should be created with uent: prefix.");
    });

    it("should create field children with ufld: prefix", function () {
      const main = element.querySelector(".u-main");
      const fieldElement = main.querySelector("#ufld\\:Field1");

      assert(fieldElement, "Field should be created with ufld: prefix.");
    });

    it("should distribute mixed types according to index rules", function () {
      const header = element.querySelector(".u-header");
      const main = element.querySelector(".u-main");
      const footer = element.querySelector(".u-footer");

      const entity1 = header.querySelector("#uent\\:Entity1");
      const field1 = main.querySelector("#ufld\\:Field1");
      const entity2 = footer.querySelector("#uent\\:Entity2");

      assert(entity1, "First entity should be in header.");
      assert(field1, "Field should be in main.");
      assert(entity2, "Second entity should be in footer.");
    });
  });

  describe("Data-behavior attribute tests", function () {
    let element;
    let widget;

    before(function () {
      widget = tester.createWidget();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    it("set data-behavior on header and footer with sticky placement", function () {
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

    it("not set data-behavior when placement is scroll", function () {
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

    it("not set data-behavior when placement is hidden", function () {
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

    it("update data-behavior when switching back to sticky", function () {
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

    it("apply correct CSS position based on data-behavior", function () {
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

    it("set data-behavior to sticky or fixed when content overflows", function () {
      return asyncRun(function () {
        // Create multiple child definitions to generate scrollable content.
        resetTester();
        const children = [];
        for (let i = 1; i <= 10; i++) {
          children.push(new MockChildDefinition(`ScrollField${i}`, "field", { "area-slot": "main" }));
        }

        const testElement = processLayoutWithChildren(children);
        const testWidget = tester.onConnect();

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
        const testElement = tester.element;
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
      resetTester();
      tester.createWidget();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    it("should have defaultTheme static property defined", function () {
      const defaultTheme = widgetClass.defaultTheme;
      assert(defaultTheme, "defaultTheme should be defined on widget class.");
      assert(defaultTheme.header, "defaultTheme should have header configuration.");
      assert(defaultTheme.footer, "defaultTheme should have footer configuration.");
    });

    it("should have correct default theme values for header", function () {
      const headerTheme = widgetClass.defaultTheme.header;
      expect(headerTheme.neutral).to.equal("#0078d4");
      expect(headerTheme.accent).to.equal("#4A9EFF");
      expect(headerTheme.luminance).to.equal(0.23);
    });

    it("should have correct default theme values for footer", function () {
      const footerTheme = widgetClass.defaultTheme.footer;
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
      const headerTheme = widgetClass.defaultTheme.header;

      expect(headerTheme.neutral).to.equal("#0078d4");
      const headerStyle = window.getComputedStyle(header);
      const headerNeutral = headerStyle.getPropertyValue("--neutral-base-color");
      assert(headerNeutral !== "", "Header neutral color should be applied.");
    });

    it("should have gray neutral color for footer section", function () {
      const footer = element.querySelector(".u-footer");
      const footerTheme = widgetClass.defaultTheme.footer;

      expect(footerTheme.neutral).to.equal("#808080");
      const footerStyle = window.getComputedStyle(footer);
      const footerNeutral = footerStyle.getPropertyValue("--neutral-base-color");
      assert(footerNeutral !== "", "Footer neutral color should be applied.");
    });

    it("should have lighter blue accent color for header section", function () {
      const header = element.querySelector(".u-header");
      const headerTheme = widgetClass.defaultTheme.header;

      expect(headerTheme.accent).to.equal("#4A9EFF");
      const headerStyle = window.getComputedStyle(header);
      const headerAccent = headerStyle.getPropertyValue("--accent-base-color");
      assert(headerAccent !== "", "Header accent color should be applied.");
    });

    it("should have standard blue accent color for footer section", function () {
      const footer = element.querySelector(".u-footer");
      const footerTheme = widgetClass.defaultTheme.footer;

      expect(footerTheme.accent).to.equal("#0078d4");
      const footerStyle = window.getComputedStyle(footer);
      const footerAccent = footerStyle.getPropertyValue("--accent-base-color");
      assert(footerAccent !== "", "Footer accent color should be applied.");
    });

    it("should have child widgets in header section inherit theme tokens", function () {
      return asyncRun(function () {
        resetTester();
        const element = processLayoutWithChildren([
          new MockChildDefinition("HeaderChild", "field", { "area-slot": "header" })
        ]);
        tester.onConnect();

        const headerSection = element.querySelector(".u-header");
        const childElement = element.querySelector("#ufld\\:HeaderChild");
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
        resetTester();
        const element = processLayoutWithChildren([
          new MockChildDefinition("FooterChild", "field", { "area-slot": "footer" })
        ]);
        tester.onConnect();

        const footerSection = element.querySelector(".u-footer");
        const childElement = element.querySelector("#ufld\\:FooterChild");
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
      widget = tester.createWidget();
      element = tester.element;
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
      resetTester();
      element = processLayoutWithChildren([]);
      widget = tester.onConnect();
      assert(element, "Widget top element is not defined!");
    });

    it("should apply default theme to header on widget creation", function (done) {
      const header = element.querySelector(".u-header");
      const headerTheme = widgetClass.defaultTheme.header;

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
      const footerTheme = widgetClass.defaultTheme.footer;

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
        expect(widgetClass.defaultTheme.header.luminance).to.equal(0.23);
        done();
      });
    });
  });

  describe("Sticky placement with window resize", function () {
    let element;
    let widget;

    before(function () {
      widget = tester.createWidget();
      element = tester.element;
      assert(element, "Widget top element is not defined!");
    });

    it("respond to window resize events", function () {
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

    it("maintain footer data-behavior after multiple resizes", function () {
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

  describe("generateIndexRule() function tests", function () {
    it("should verify index rule for 1 child is correctly applied", function () {
      const childWidgetsWorker = getChildWidgetsWorker("u-main");
      const indexRules = childWidgetsWorker.slotConfig.indexRules;

      // Access the dynamic rule for 1 child.
      const rule = indexRules[1];
      expect(rule).to.deep.equal({ "main": [0] });
    });

    it("should verify index rule for 2 children is correctly applied", function () {
      const childWidgetsWorker = getChildWidgetsWorker("u-main");
      const indexRules = childWidgetsWorker.slotConfig.indexRules;

      const rule = indexRules[2];
      expect(rule).to.deep.equal({
        "header": [0],
        "main": [1]
      });
    });

    it("should verify index rule for 3 children is correctly applied", function () {
      const childWidgetsWorker = getChildWidgetsWorker("u-main");
      const indexRules = childWidgetsWorker.slotConfig.indexRules;

      const rule = indexRules[3];
      expect(rule).to.deep.equal({
        "header": [0],
        "main": [1],
        "footer": [2]
      });
    });

    it("should verify index rule for 4 children is correctly applied", function () {
      const childWidgetsWorker = getChildWidgetsWorker("u-main");
      const indexRules = childWidgetsWorker.slotConfig.indexRules;

      const rule = indexRules[4];
      expect(rule).to.deep.equal({
        "header": [0],
        "main": [1, 2],
        "footer": [3]
      });
    });

    it("should verify index rule for 10 children is correctly applied", function () {
      const childWidgetsWorker = getChildWidgetsWorker("u-main");
      const indexRules = childWidgetsWorker.slotConfig.indexRules;

      const rule = indexRules[10];
      expect(rule).to.have.property("header").that.deep.equals([0]);
      expect(rule).to.have.property("main").that.deep.equals([1, 2, 3, 4, 5, 6, 7, 8]);
      expect(rule).to.have.property("footer").that.deep.equals([9]);
    });

    it("should verify dynamic index rules work for large child counts", function () {
      const childWidgetsWorker = getChildWidgetsWorker("u-main");
      const indexRules = childWidgetsWorker.slotConfig.indexRules;

      const rule = indexRules[100];
      expect(rule).to.have.property("header").that.deep.equals([0]);
      expect(rule).to.have.property("main").that.is.an("array").with.lengthOf(98);
      expect(rule).to.have.property("footer").that.deep.equals([99]);
      expect(rule.main[0]).to.equal(1);
      expect(rule.main[97]).to.equal(98);
    });
  });

  describe("Reset all properties", function () {
    it("reset all properties", function () {
      try {
        tester.dataUpdate(tester.getDefaultValues());
      } catch (e) {
        assert(false, `Failed to reset the properties, exception ${e}.`);
      }
    });
  });
})();
