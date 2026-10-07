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
    "widget_class": "UX.HeaderFooter"
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

      it("should remove the area-slot property from the child definition after processLayout()", function () {
        const objectDefinition = umockup.createUxDefinitions({
          "#2": {
            "nm": "FIELD_MAIN",
            "type": "field",
            "widget_class": "UX.TextField",
            "properties": { "area-slot": "main" },
            "id": "#2"
          },
          "componentname": "TESTCOMPONENT",
          "properties": {},
          "type": "component",
          "widget_class": "UX.HeaderFooter"
        }, true);
        const skeleton = createSkeleton(componentWidgetId);

        componentWidgetClass.processLayout(skeleton, objectDefinition);

        const [childDefinition] = objectDefinition.getChildDefinitions();
        expect(childDefinition.getProperty("area-slot"), "area-slot should be removed from the child definition once processLayout() has distributed it into a slot.").to.be.undefined;
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
    });

    it("should have default footer placement", function () {
      const footer = element.querySelector(".u-footer");
      expect(footer.getAttribute("placement"), "Footer placement should be 'sticky' by default.").to.equal("sticky");
    });

    it("should have sections structure", function () {
      const header = element.querySelector(".u-header");
      const main = element.querySelector(".u-main");
      const footer = element.querySelector(".u-footer");

      assert(header, "Header section should exist.");
      assert(main, "Main section should exist.");
      assert(footer, "Footer section should exist.");
    });

    it("should stretch to full dynamic viewport height", function () {
      const parent = element.parentElement;
      assert(parent, "HeaderFooter should be attached to a parent container.");

      const previousMinHeight = parent.style.minHeight;
      try {
        parent.style.minHeight = "100dvh";

        const parentStyles = window.getComputedStyle(parent);
        const styles = window.getComputedStyle(element);
        expect(styles.height, "HeaderFooter height should inherit the parent dynamic viewport min-height.").to.equal(
          parentStyles.minHeight
        );
      } finally {
        parent.style.minHeight = previousMinHeight;
      }
    });

    it("should apply section flex and width defaults", function () {
      const header = element.querySelector(".u-header");
      const main = element.querySelector(".u-main");
      const footer = element.querySelector(".u-footer");

      const headerStyle = window.getComputedStyle(header);
      const mainStyle = window.getComputedStyle(main);
      const footerStyle = window.getComputedStyle(footer);

      expect(headerStyle.flexGrow, "Header should not grow.").to.equal("0");
      expect(mainStyle.flexGrow, "Main should grow to fill available space.").to.equal("1");
      expect(footerStyle.flexGrow, "Footer should not grow.").to.equal("0");

      expect(headerStyle.width, "Header width should fill container.").to.not.equal("0px");
      expect(mainStyle.width, "Main width should fill container.").to.not.equal("0px");
      expect(footerStyle.width, "Footer width should fill container.").to.not.equal("0px");
    });

    it("should apply shared section padding from CSS", function () {
      const header = element.querySelector(".u-header");
      const main = element.querySelector(".u-main");
      const footer = element.querySelector(".u-footer");

      const headerStyle = window.getComputedStyle(header);
      const mainStyle = window.getComputedStyle(main);
      const footerStyle = window.getComputedStyle(footer);

      expect(parseFloat(headerStyle.paddingLeft), "Header should have non-zero horizontal padding.").to.be.above(0);
      expect(parseFloat(mainStyle.paddingLeft), "Main should have non-zero horizontal padding.").to.be.above(0);
      expect(parseFloat(footerStyle.paddingLeft), "Footer should have non-zero horizontal padding.").to.be.above(0);

      expect(headerStyle.paddingLeft, "Header and main should use same horizontal padding rule.").to.equal(mainStyle.paddingLeft);
      expect(mainStyle.paddingLeft, "Main and footer should use same horizontal padding rule.").to.equal(footerStyle.paddingLeft);
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
        "widget_class": "UX.HeaderFooter"
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
        "widget_class": "UX.HeaderFooter"
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
        "widget_class": "UX.HeaderFooter"
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

    it("should warn and fall back to defaultSlot when an invalid area-slot value is set", function () {
      const invalidSlotDef = {
        "#2": {
          "nm": "ENTITY_INVALID",
          "type": "entity",
          "widget_class": "UX.CollectionLayout",
          "occs": {
            "#2": {
              "type": "occurrence",
              "widget_class": "UX.OccurrenceLayout"
            }
          },
          "properties": {
            "area-slot": "sidebar",
            "label-size": "normal"
          },
          "id": "#2"
        },
        "componentname": "TESTCOMPONENT",
        "properties": {},
        "type": "component",
        "widget_class": "UX.HeaderFooter"
      };

      const warnSpy = sinon.spy(console, "warn");
      let element;
      try {
        element = createIsolatedWidget(invalidSlotDef);
      } finally {
        warnSpy.restore();
      }

      const mainIds = getSectionChildIds(element, ".u-main");
      expect(hasIdFragment(mainIds, "ENTITY_INVALID"), "Entity with an invalid area-slot value should fall back to the defaultSlot ('main').").to.be.true;
      expect(
        warnSpy.calledWith(sinon.match("Child 'ENTITY_INVALID' has invalid slot 'sidebar' - Using default: main.")),
        "Console should warn about the invalid area-slot value 'sidebar'."
      ).to.be.true;
    });

    it("should warn when the static area-slot property is set dynamically on a child widget", function () {
      const componentDef = {
        "#2": {
          "nm": "ENTITY_HEADER",
          "type": "entity",
          "widget_class": "UX.CollectionLayout",
          "occs": {
            "#2": {
              "type": "occurrence",
              "widget_class": "UX.OccurrenceLayout"
            }
          },
          "properties": {
            "area-slot": "header",
            "label-size": "normal"
          },
          "id": "#2"
        },
        "componentname": "TESTCOMPONENT",
        "properties": {},
        "type": "component",
        "widget_class": "UX.HeaderFooter"
      };

      const isolatedTester = new umockup.WidgetTester("UX.HeaderFooter", "ucpt:header-footer");
      const isolatedSkeleton = createSkeleton(isolatedTester.widgetId);
      isolatedTester.createWidget(null, isolatedSkeleton, componentDef);

      // Fully connect and initialize the child CollectionLayout entity widget on the placeholder ChildWidgets created.
      const entityTester = new umockup.WidgetTester("UX.CollectionLayout", "uent:ENTITY_HEADER");
      entityTester.createWidget(null, isolatedTester.element.querySelector(`[id="${entityTester.widgetId}"]`), null);

      const warnSpy = sinon.spy(console, "warn");
      return asyncRun(function () {
        entityTester.dataUpdate({ "area-slot": "header" });
      }).then(function () {
        expect(
          warnSpy.calledWith(sinon.match("Widget does not support property 'area-slot' - Ignored")),
          "Console should warn when the static area-slot property is set dynamically via dataUpdate() on the child widget."
        ).to.be.true;
      }).finally(function () {
        warnSpy.restore();
      });
    });
  });

  describe("Placement CSS behavior", function () {
    let element;
    let widget;

    before(function () {
      componentTester.createWidget(null, createSkeleton(componentWidgetId), mockComponentDef);
      widget = componentTester.widget;
      element = componentTester.element;
      assert(element, "Widget top element is not defined!");
    });

    it("should lower z-index for nested header-footer header", function () {
      const wrapper = document.createElement("div");
      wrapper.className = "u-header-footer";

      const nestedContainer = document.createElement("div");
      nestedContainer.className = "u-header-footer";

      const nestedHeader = document.createElement("div");
      nestedHeader.className = "u-header";
      nestedContainer.appendChild(nestedHeader);
      wrapper.appendChild(nestedContainer);
      document.body.appendChild(wrapper);

      try {
        const nestedHeaderStyle = window.getComputedStyle(nestedHeader);
        expect(nestedHeaderStyle.zIndex, "Nested header should use lower z-index than outer sticky header.").to.equal("9");
      } finally {
        wrapper.remove();
      }
    });

    it("should apply sticky positioning through placement attributes", function () {
      return asyncRun(function () {
        widget.dataUpdate({
          "header:placement": "sticky",
          "footer:placement": "sticky"
        });
      }).then(function () {
        const header = element.querySelector(".u-header");
        const footer = element.querySelector(".u-footer");

        expect(header.getAttribute("placement")).to.equal("sticky");
        expect(footer.getAttribute("placement")).to.equal("sticky");

        const headerStyle = window.getComputedStyle(header);
        const footerStyle = window.getComputedStyle(footer);
        expect(["sticky", "-webkit-sticky"]).to.include(headerStyle.position);
        expect(["sticky", "-webkit-sticky"]).to.include(footerStyle.position);
      });
    });

    it("should remove sticky positioning when footer placement is scroll", function () {
      return asyncRun(function () {
        widget.dataUpdate({
          "footer:placement": "scroll"
        });
      }).then(function () {
        const footer = element.querySelector(".u-footer");
        expect(footer.getAttribute("placement")).to.equal("scroll");
        const footerStyle = window.getComputedStyle(footer);
        expect(footerStyle.position, "Footer with placement='scroll' should not have sticky position.").to.not.equal("sticky");
      });
    });

    it("should hide footer section when placement is hidden", function () {
      return asyncRun(function () {
        widget.dataUpdate({
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

  describe("Default Theme Application", function () {
    let element;

    before(function () {
      componentTester.createWidget(null, createSkeleton(componentWidgetId), mockComponentDef);
      element = componentTester.element;
      assert(element, "Widget top element is not defined!");
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
          "widget_class": "UX.HeaderFooter"
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
        expect(childLuminance).to.equal(headerLuminance, "Child widget should inherit same luminance as header.");
      });
    });

    it("should have child widgets in main section inherit theme tokens", function () {
      return asyncRun(function () {
        const componentDef = {
          "#2": {
            "nm": "MainChild",
            "type": "field",
            "widget_class": "UX.TextField",
            "properties": { "area-slot": "main" },
            "id": "#2"
          },
          "componentname": "TESTCOMPONENT",
          "properties": {},
          "type": "component",
          "widget_class": "UX.HeaderFooter"
        };
        componentTester.createWidget(null, createSkeleton(componentWidgetId), componentDef);
        componentTester.onConnect();
      }).then(function () {
        const element = componentTester.element;

        const mainSection = element.querySelector(".u-main");
        const childElement = mainSection.querySelector("[id^='ufld:'], [id^='uent:']");
        assert(childElement, "Child widget should exist in main section.");

        const mainStyle = window.getComputedStyle(mainSection);
        const childStyle = window.getComputedStyle(childElement);

        const mainNeutral = mainStyle.getPropertyValue("--neutral-base-color");
        const mainAccent = mainStyle.getPropertyValue("--accent-base-color");
        const mainLuminance = mainStyle.getPropertyValue("--base-layer-luminance");

        const childNeutral = childStyle.getPropertyValue("--neutral-base-color");
        const childAccent = childStyle.getPropertyValue("--accent-base-color");
        const childLuminance = childStyle.getPropertyValue("--base-layer-luminance");

        // Child should inherit exact main theme values.
        expect(childNeutral).to.equal(mainNeutral, "Child widget should inherit same neutral-base-color as main.");
        expect(childAccent).to.equal(mainAccent, "Child widget should inherit same accent-base-color as main.");
        expect(childLuminance).to.equal(mainLuminance, "Child widget should inherit same luminance as main.");
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
          "widget_class": "UX.HeaderFooter"
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
        expect(childLuminance).to.equal(footerLuminance, "Child widget should inherit same luminance as footer.");
      });
    });
  });

  describe("Color-mode theme switching", function () {
    let element;

    function waitForNextFrame() {
      return asyncRun(function () {
        // Intentionally empty: wait one repaint tick so body color-mode observers can propagate updates.
      });
    }

    before(function () {
      componentTester.createWidget(null, createSkeleton(componentWidgetId), mockComponentDef);
      element = componentTester.element;
      assert(element, "Widget top element is not defined!");
    });

    afterEach(function () {
      delete document.documentElement.dataset.uColorMode;
    });

    it("should apply header light theme when html data-u-color-mode is light", function () {
      return asyncRun(function () {
        document.documentElement.dataset.uColorMode = "light";
      }).then(function () {
        return waitForNextFrame();
      }).then(function () {
        const header = element.querySelector(".u-header");
        assert(header, "Header section should exist.");
        const headerStyle = window.getComputedStyle(header);
        const expectedTheme = componentWidgetClass.defaultTheme.header.light;

        expect(
          headerStyle.getPropertyValue("--neutral-base-color").trim().toLowerCase(),
          "Header neutral color should match the light theme neutral token."
        ).to.equal(String(expectedTheme.neutral).toLowerCase());
        expect(
          headerStyle.getPropertyValue("--accent-base-color").trim().toLowerCase(),
          "Header accent color should match the light theme accent token."
        ).to.equal(String(expectedTheme.accent).toLowerCase());
        expect(
          Number.parseFloat(headerStyle.getPropertyValue("--base-layer-luminance")),
          "Header luminance should match the light theme luminance token."
        ).to.equal(expectedTheme.luminance);
      });
    });

    it("should apply main light theme when html data-u-color-mode is light", function () {
      return asyncRun(function () {
        document.documentElement.dataset.uColorMode = "light";
      }).then(function () {
        return waitForNextFrame();
      }).then(function () {
        const main = element.querySelector(".u-main");
        assert(main, "Main section should exist.");

        const mainStyle = window.getComputedStyle(main);
        const mainTheme = componentWidgetClass.defaultTheme.main.light;
        const shellStyle = window.getComputedStyle(element);

        expect(
          mainStyle.getPropertyValue("--neutral-base-color"),
          "Main neutral-base-color should not be locally overridden in light mode."
        ).to.equal(shellStyle.getPropertyValue("--neutral-base-color"));
        expect(
          mainStyle.getPropertyValue("--accent-base-color"),
          "Main accent-base-color should not be locally overridden in light mode."
        ).to.equal(shellStyle.getPropertyValue("--accent-base-color"));
        expect(
          Number.parseFloat(mainStyle.getPropertyValue("--base-layer-luminance")),
          "Main luminance should match the light theme luminance token."
        ).to.equal(mainTheme.luminance);
      });
    });

    it("should apply footer light theme when html data-u-color-mode is light", function () {
      return asyncRun(function () {
        document.documentElement.dataset.uColorMode = "light";
      }).then(function () {
        return waitForNextFrame();
      }).then(function () {
        const footer = element.querySelector(".u-footer");
        assert(footer, "Footer section should exist.");

        const footerStyle = window.getComputedStyle(footer);
        const footerTheme = componentWidgetClass.defaultTheme.footer.light;
        const shellStyle = window.getComputedStyle(element);

        expect(
          footerStyle.getPropertyValue("--neutral-base-color"),
          "Footer neutral-base-color should not be locally overridden in light mode."
        ).to.equal(shellStyle.getPropertyValue("--neutral-base-color"));
        expect(
          footerStyle.getPropertyValue("--accent-base-color"),
          "Footer accent-base-color should not be locally overridden in light mode."
        ).to.equal(shellStyle.getPropertyValue("--accent-base-color"));
        expect(
          Number.parseFloat(footerStyle.getPropertyValue("--base-layer-luminance")),
          "Footer luminance should match the light theme luminance token."
        ).to.equal(footerTheme.luminance);
      });
    });

    it("should apply header dark theme when html data-u-color-mode is dark", function () {
      return asyncRun(function () {
        document.documentElement.dataset.uColorMode = "dark";
      }).then(function () {
        return waitForNextFrame();
      }).then(function () {
        const header = element.querySelector(".u-header");
        assert(header, "Header section should exist.");
        const headerStyle = window.getComputedStyle(header);
        const expectedTheme = componentWidgetClass.defaultTheme.header.dark;

        expect(
          headerStyle.getPropertyValue("--neutral-base-color").trim().toLowerCase(),
          "Header neutral color should match the dark theme neutral token."
        ).to.equal(String(expectedTheme.neutral).toLowerCase());
        expect(
          headerStyle.getPropertyValue("--accent-base-color").trim().toLowerCase(),
          "Header accent color should match the dark theme accent token."
        ).to.equal(String(expectedTheme.accent).toLowerCase());
        expect(
          Number.parseFloat(headerStyle.getPropertyValue("--base-layer-luminance")),
          "Header luminance should match the dark theme luminance token."
        ).to.equal(expectedTheme.luminance);
      });
    });

    it("should apply main dark theme when html data-u-color-mode is dark", function () {
      return asyncRun(function () {
        document.documentElement.dataset.uColorMode = "dark";
      }).then(function () {
        return waitForNextFrame();
      }).then(function () {
        const main = element.querySelector(".u-main");
        assert(main, "Main section should exist.");

        const mainStyle = window.getComputedStyle(main);
        const mainTheme = componentWidgetClass.defaultTheme.main.dark;
        const shellStyle = window.getComputedStyle(element);

        expect(
          mainStyle.getPropertyValue("--neutral-base-color").trim().toLowerCase(),
          "Main neutral color should match the dark theme neutral token."
        ).to.equal(String(mainTheme.neutral).toLowerCase());
        expect(
          mainStyle.getPropertyValue("--accent-base-color"),
          "Main accent-base-color should not be locally overridden in dark mode."
        ).to.equal(shellStyle.getPropertyValue("--accent-base-color"));
        expect(
          Number.parseFloat(mainStyle.getPropertyValue("--base-layer-luminance")),
          "Main luminance should match the dark theme luminance token."
        ).to.equal(mainTheme.luminance);
      });
    });

    it("should apply footer dark theme when html data-u-color-mode is dark", function () {
      return asyncRun(function () {
        document.documentElement.dataset.uColorMode = "dark";
      }).then(function () {
        return waitForNextFrame();
      }).then(function () {
        const footer = element.querySelector(".u-footer");
        assert(footer, "Footer section should exist.");

        const footerStyle = window.getComputedStyle(footer);
        const footerTheme = componentWidgetClass.defaultTheme.footer.dark;
        const shellStyle = window.getComputedStyle(element);

        expect(
          footerStyle.getPropertyValue("--neutral-base-color").trim().toLowerCase(),
          "Footer neutral color should match the dark theme neutral token."
        ).to.equal(String(footerTheme.neutral).toLowerCase());
        expect(
          footerStyle.getPropertyValue("--accent-base-color"),
          "Footer accent-base-color should not be locally overridden in dark mode."
        ).to.equal(shellStyle.getPropertyValue("--accent-base-color"));
        expect(
          Number.parseFloat(footerStyle.getPropertyValue("--base-layer-luminance")),
          "Footer luminance should match the dark theme luminance token."
        ).to.equal(footerTheme.luminance);
      });
    });

    it("should apply header resolved theme when html data-u-color-mode is auto", function () {
      return asyncRun(function () {
        document.documentElement.dataset.uColorMode = "auto";
      }).then(function () {
        return waitForNextFrame();
      }).then(function () {
        const resolvedMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        const header = element.querySelector(".u-header");
        assert(header, "Header section should exist.");

        const headerStyle = window.getComputedStyle(header);
        const headerTheme = componentWidgetClass.defaultTheme.header[resolvedMode];

        expect(
          headerStyle.getPropertyValue("--neutral-base-color").trim().toLowerCase(),
          "Header neutral color should match the resolved mode neutral token."
        ).to.equal(String(headerTheme.neutral).toLowerCase());
        expect(
          headerStyle.getPropertyValue("--accent-base-color").trim().toLowerCase(),
          "Header accent color should match the resolved mode accent token."
        ).to.equal(String(headerTheme.accent).toLowerCase());
        expect(
          Number.parseFloat(headerStyle.getPropertyValue("--base-layer-luminance")),
          "Header luminance should match the resolved mode luminance token."
        ).to.equal(headerTheme.luminance);
      });
    });

    it("should apply main resolved theme when html data-u-color-mode is auto", function () {
      return asyncRun(function () {
        document.documentElement.dataset.uColorMode = "auto";
      }).then(function () {
        return waitForNextFrame();
      }).then(function () {
        const resolvedMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        const main = element.querySelector(".u-main");
        assert(main, "Main section should exist.");

        const mainStyle = window.getComputedStyle(main);
        const mainTheme = componentWidgetClass.defaultTheme.main[resolvedMode];
        const shellStyle = window.getComputedStyle(element);

        if (resolvedMode === "dark") {
          expect(
            mainStyle.getPropertyValue("--neutral-base-color").trim().toLowerCase(),
            "Main neutral color should match the resolved mode neutral token."
          ).to.equal(String(componentWidgetClass.defaultTheme.main.dark.neutral).toLowerCase());
        } else {
          expect(
            mainStyle.getPropertyValue("--neutral-base-color"),
            "Main neutral-base-color should not be locally overridden in light mode."
          ).to.equal(shellStyle.getPropertyValue("--neutral-base-color"));
        }
        expect(
          mainStyle.getPropertyValue("--accent-base-color"),
          "Main accent-base-color should not be locally overridden."
        ).to.equal(shellStyle.getPropertyValue("--accent-base-color"));
        expect(
          Number.parseFloat(mainStyle.getPropertyValue("--base-layer-luminance")),
          "Main luminance should match the resolved mode luminance token."
        ).to.equal(mainTheme.luminance);
      });
    });

    it("should apply footer resolved theme when html data-u-color-mode is auto", function () {
      return asyncRun(function () {
        document.documentElement.dataset.uColorMode = "auto";
      }).then(function () {
        return waitForNextFrame();
      }).then(function () {
        const resolvedMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        const footer = element.querySelector(".u-footer");
        assert(footer, "Footer section should exist.");

        const footerStyle = window.getComputedStyle(footer);
        const footerTheme = componentWidgetClass.defaultTheme.footer[resolvedMode];
        const shellStyle = window.getComputedStyle(element);

        if (resolvedMode === "dark") {
          expect(
            footerStyle.getPropertyValue("--neutral-base-color").trim().toLowerCase(),
            "Footer neutral color should match the resolved mode neutral token."
          ).to.equal(String(componentWidgetClass.defaultTheme.footer.dark.neutral).toLowerCase());
        } else {
          expect(
            footerStyle.getPropertyValue("--neutral-base-color"),
            "Footer neutral-base-color should not be locally overridden in light mode."
          ).to.equal(shellStyle.getPropertyValue("--neutral-base-color"));
        }
        expect(
          footerStyle.getPropertyValue("--accent-base-color"),
          "Footer accent-base-color should not be locally overridden."
        ).to.equal(shellStyle.getPropertyValue("--accent-base-color"));
        expect(
          Number.parseFloat(footerStyle.getPropertyValue("--base-layer-luminance")),
          "Footer luminance should match the resolved mode luminance token."
        ).to.equal(footerTheme.luminance);
      });
    });

    it("should update header tokens when html data-u-color-mode changes from light to dark", function () {
      let lightHeaderLuminance;

      return asyncRun(function () {
        document.documentElement.dataset.uColorMode = "light";
      }).then(function () {
        return waitForNextFrame();
      }).then(function () {
        const header = element.querySelector(".u-header");
        assert(header, "Header section should exist.");
        const headerStyle = window.getComputedStyle(header);
        lightHeaderLuminance = Number.parseFloat(headerStyle.getPropertyValue("--base-layer-luminance"));
        expect(
          lightHeaderLuminance,
          "Header luminance should match the light theme before mode switching."
        ).to.equal(componentWidgetClass.defaultTheme.header.light.luminance);

        return asyncRun(function () {
          document.documentElement.dataset.uColorMode = "dark";
        });
      }).then(function () {
        return waitForNextFrame();
      }).then(function () {
        const header = element.querySelector(".u-header");
        assert(header, "Header section should exist.");
        const headerStyle = window.getComputedStyle(header);
        const darkHeaderLuminance = Number.parseFloat(headerStyle.getPropertyValue("--base-layer-luminance"));

        const darkTheme = componentWidgetClass.defaultTheme.header.dark;
        expect(
          headerStyle.getPropertyValue("--neutral-base-color").trim().toLowerCase(),
          "Header neutral color should match the dark theme after mode switching."
        ).to.equal(String(darkTheme.neutral).toLowerCase());
        expect(
          headerStyle.getPropertyValue("--accent-base-color").trim().toLowerCase(),
          "Header accent color should match the dark theme after mode switching."
        ).to.equal(String(darkTheme.accent).toLowerCase());
        expect(
          darkHeaderLuminance,
          "Header luminance should match the dark theme after mode switching."
        ).to.equal(darkTheme.luminance);
        expect(darkHeaderLuminance).to.not.equal(lightHeaderLuminance, "Header luminance token should change when switching modes.");
      });
    });

    it("should update main tokens when html data-u-color-mode changes from light to dark", function () {
      let lightMainLuminance;

      return asyncRun(function () {
        document.documentElement.dataset.uColorMode = "light";
      }).then(function () {
        return waitForNextFrame();
      }).then(function () {
        const main = element.querySelector(".u-main");
        assert(main, "Main section should exist.");
        const mainStyle = window.getComputedStyle(main);
        lightMainLuminance = Number.parseFloat(mainStyle.getPropertyValue("--base-layer-luminance"));
        expect(
          lightMainLuminance,
          "Main luminance should match the light theme before mode switching."
        ).to.equal(componentWidgetClass.defaultTheme.main.light.luminance);

        return asyncRun(function () {
          document.documentElement.dataset.uColorMode = "dark";
        });
      }).then(function () {
        return waitForNextFrame();
      }).then(function () {
        const main = element.querySelector(".u-main");
        assert(main, "Main section should exist.");
        const mainStyle = window.getComputedStyle(main);
        const darkMainLuminance = Number.parseFloat(mainStyle.getPropertyValue("--base-layer-luminance"));

        const darkTheme = componentWidgetClass.defaultTheme.main.dark;
        const shellStyle = window.getComputedStyle(element);
        expect(
          mainStyle.getPropertyValue("--neutral-base-color").trim().toLowerCase(),
          "Main neutral color should match the dark theme after mode switching."
        ).to.equal(String(darkTheme.neutral).toLowerCase());
        expect(
          mainStyle.getPropertyValue("--accent-base-color"),
          "Main accent-base-color should not be locally overridden in dark mode."
        ).to.equal(shellStyle.getPropertyValue("--accent-base-color"));
        expect(
          darkMainLuminance,
          "Main luminance should match the dark theme after mode switching."
        ).to.equal(darkTheme.luminance);
        expect(darkMainLuminance).to.not.equal(lightMainLuminance, "Main luminance token should change when switching modes.");
      });
    });

    it("should update footer tokens when html data-u-color-mode changes from light to dark", function () {
      let lightFooterLuminance;

      return asyncRun(function () {
        document.documentElement.dataset.uColorMode = "light";
      }).then(function () {
        return waitForNextFrame();
      }).then(function () {
        const footer = element.querySelector(".u-footer");
        assert(footer, "Footer section should exist.");
        const footerStyle = window.getComputedStyle(footer);
        lightFooterLuminance = Number.parseFloat(footerStyle.getPropertyValue("--base-layer-luminance"));
        expect(
          lightFooterLuminance,
          "Footer luminance should match the light theme before mode switching."
        ).to.equal(componentWidgetClass.defaultTheme.footer.light.luminance);

        return asyncRun(function () {
          document.documentElement.dataset.uColorMode = "dark";
        });
      }).then(function () {
        return waitForNextFrame();
      }).then(function () {
        const footer = element.querySelector(".u-footer");
        assert(footer, "Footer section should exist.");
        const footerStyle = window.getComputedStyle(footer);
        const darkFooterLuminance = Number.parseFloat(footerStyle.getPropertyValue("--base-layer-luminance"));

        const darkTheme = componentWidgetClass.defaultTheme.footer.dark;
        const shellStyle = window.getComputedStyle(element);
        expect(
          footerStyle.getPropertyValue("--neutral-base-color").trim().toLowerCase(),
          "Footer neutral color should match the dark theme after mode switching."
        ).to.equal(String(darkTheme.neutral).toLowerCase());
        expect(
          footerStyle.getPropertyValue("--accent-base-color"),
          "Footer accent-base-color should not be locally overridden in dark mode."
        ).to.equal(shellStyle.getPropertyValue("--accent-base-color"));
        expect(
          darkFooterLuminance,
          "Footer luminance should match the dark theme after mode switching."
        ).to.equal(darkTheme.luminance);
        expect(darkFooterLuminance).to.not.equal(lightFooterLuminance, "Footer luminance token should change when switching modes.");
      });
    });

    it("should update header tokens when html data-u-color-mode changes from dark to light", function () {
      let darkHeaderLuminance;

      return asyncRun(function () {
        document.documentElement.dataset.uColorMode = "dark";
      }).then(function () {
        return waitForNextFrame();
      }).then(function () {
        const header = element.querySelector(".u-header");
        assert(header, "Header section should exist.");
        const headerStyle = window.getComputedStyle(header);
        darkHeaderLuminance = Number.parseFloat(headerStyle.getPropertyValue("--base-layer-luminance"));
        expect(
          darkHeaderLuminance,
          "Header luminance should match the dark theme before mode switching."
        ).to.equal(componentWidgetClass.defaultTheme.header.dark.luminance);

        return asyncRun(function () {
          document.documentElement.dataset.uColorMode = "light";
        });
      }).then(function () {
        return waitForNextFrame();
      }).then(function () {
        const header = element.querySelector(".u-header");
        assert(header, "Header section should exist.");
        const headerStyle = window.getComputedStyle(header);
        const lightHeaderLuminance = Number.parseFloat(headerStyle.getPropertyValue("--base-layer-luminance"));

        const lightTheme = componentWidgetClass.defaultTheme.header.light;
        expect(
          headerStyle.getPropertyValue("--neutral-base-color").trim().toLowerCase(),
          "Header neutral color should match the light theme after mode switching."
        ).to.equal(String(lightTheme.neutral).toLowerCase());
        expect(
          headerStyle.getPropertyValue("--accent-base-color").trim().toLowerCase(),
          "Header accent color should match the light theme after mode switching."
        ).to.equal(String(lightTheme.accent).toLowerCase());
        expect(
          lightHeaderLuminance,
          "Header luminance should match the light theme after mode switching."
        ).to.equal(lightTheme.luminance);
        expect(lightHeaderLuminance).to.not.equal(darkHeaderLuminance, "Header luminance token should change when switching modes.");
      });
    });

    it("should update main tokens when html data-u-color-mode changes from dark to light", function () {
      let darkMainLuminance;

      return asyncRun(function () {
        document.documentElement.dataset.uColorMode = "dark";
      }).then(function () {
        return waitForNextFrame();
      }).then(function () {
        const main = element.querySelector(".u-main");
        assert(main, "Main section should exist.");
        const mainStyle = window.getComputedStyle(main);
        darkMainLuminance = Number.parseFloat(mainStyle.getPropertyValue("--base-layer-luminance"));
        expect(
          darkMainLuminance,
          "Main luminance should match the dark theme before mode switching."
        ).to.equal(componentWidgetClass.defaultTheme.main.dark.luminance);
        expect(
          mainStyle.getPropertyValue("--neutral-base-color").trim().toLowerCase(),
          "Main neutral color should match the dark theme before mode switching."
        ).to.equal(String(componentWidgetClass.defaultTheme.main.dark.neutral).toLowerCase());

        return asyncRun(function () {
          document.documentElement.dataset.uColorMode = "light";
        });
      }).then(function () {
        return waitForNextFrame();
      }).then(function () {
        const main = element.querySelector(".u-main");
        assert(main, "Main section should exist.");
        const mainStyle = window.getComputedStyle(main);
        const lightMainLuminance = Number.parseFloat(mainStyle.getPropertyValue("--base-layer-luminance"));

        const lightTheme = componentWidgetClass.defaultTheme.main.light;
        const shellStyle = window.getComputedStyle(element);
        expect(
          mainStyle.getPropertyValue("--neutral-base-color"),
          "Main neutral-base-color should not be locally overridden in light mode."
        ).to.equal(shellStyle.getPropertyValue("--neutral-base-color"));
        expect(
          mainStyle.getPropertyValue("--accent-base-color"),
          "Main accent-base-color should not be locally overridden in light mode."
        ).to.equal(shellStyle.getPropertyValue("--accent-base-color"));
        expect(
          lightMainLuminance,
          "Main luminance should match the light theme after mode switching."
        ).to.equal(lightTheme.luminance);
        expect(lightMainLuminance).to.not.equal(darkMainLuminance, "Main luminance token should change when switching modes.");
      });
    });

    it("should update footer tokens when html data-u-color-mode changes from dark to light", function () {
      let darkFooterLuminance;

      return asyncRun(function () {
        document.documentElement.dataset.uColorMode = "dark";
      }).then(function () {
        return waitForNextFrame();
      }).then(function () {
        const footer = element.querySelector(".u-footer");
        assert(footer, "Footer section should exist.");
        const footerStyle = window.getComputedStyle(footer);
        darkFooterLuminance = Number.parseFloat(footerStyle.getPropertyValue("--base-layer-luminance"));
        expect(
          darkFooterLuminance,
          "Footer luminance should match the dark theme before mode switching."
        ).to.equal(componentWidgetClass.defaultTheme.footer.dark.luminance);
        expect(
          footerStyle.getPropertyValue("--neutral-base-color").trim().toLowerCase(),
          "Footer neutral color should match the dark theme before mode switching."
        ).to.equal(String(componentWidgetClass.defaultTheme.footer.dark.neutral).toLowerCase());

        return asyncRun(function () {
          document.documentElement.dataset.uColorMode = "light";
        });
      }).then(function () {
        return waitForNextFrame();
      }).then(function () {
        const footer = element.querySelector(".u-footer");
        assert(footer, "Footer section should exist.");
        const footerStyle = window.getComputedStyle(footer);
        const lightFooterLuminance = Number.parseFloat(footerStyle.getPropertyValue("--base-layer-luminance"));

        const lightTheme = componentWidgetClass.defaultTheme.footer.light;
        const shellStyle = window.getComputedStyle(element);
        expect(
          footerStyle.getPropertyValue("--neutral-base-color"),
          "Footer neutral-base-color should not be locally overridden in light mode."
        ).to.equal(shellStyle.getPropertyValue("--neutral-base-color"));
        expect(
          footerStyle.getPropertyValue("--accent-base-color"),
          "Footer accent-base-color should not be locally overridden in light mode."
        ).to.equal(shellStyle.getPropertyValue("--accent-base-color"));
        expect(
          lightFooterLuminance,
          "Footer luminance should match the light theme after mode switching."
        ).to.equal(lightTheme.luminance);
        expect(lightFooterLuminance).to.not.equal(darkFooterLuminance, "Footer luminance token should change when switching modes.");
      });
    });

    it("should apply header dark theme when color-mode-change event is dispatched", function () {
      return asyncRun(function () {
        document.documentElement.dataset.uColorMode = "light";
      }).then(function () {
        return waitForNextFrame();
      }).then(function () {
        const header = element.querySelector(".u-header");
        assert(header, "Header section should exist.");

        // Dispatch color-mode-change event.
        const colorModeChangeEvent = new window.CustomEvent("color-mode-change", {
          "detail": { "resolvedMode": "dark" },
          "bubbles": true,
          "cancelable": true
        });
        header.dispatchEvent(colorModeChangeEvent);
      }).then(function () {
        return waitForNextFrame();
      }).then(function () {
        const header = element.querySelector(".u-header");
        assert(header, "Header section should exist.");
        const headerStyle = window.getComputedStyle(header);
        const expectedTheme = componentWidgetClass.defaultTheme.header.dark;

        expect(
          headerStyle.getPropertyValue("--neutral-base-color").trim().toLowerCase(),
          "Header neutral color should match the dark theme after event dispatch."
        ).to.equal(String(expectedTheme.neutral).toLowerCase());
        expect(
          headerStyle.getPropertyValue("--accent-base-color").trim().toLowerCase(),
          "Header accent color should match the dark theme after event dispatch."
        ).to.equal(String(expectedTheme.accent).toLowerCase());
        expect(
          Number.parseFloat(headerStyle.getPropertyValue("--base-layer-luminance")),
          "Header luminance should match the dark theme after event dispatch."
        ).to.equal(expectedTheme.luminance);
      });
    });

    it("should apply main dark theme when color-mode-change event is dispatched", function () {
      return asyncRun(function () {
        document.documentElement.dataset.uColorMode = "light";
      }).then(function () {
        return waitForNextFrame();
      }).then(function () {
        const main = element.querySelector(".u-main");
        assert(main, "Main section should exist.");

        // Dispatch color-mode-change event.
        const colorModeChangeEvent = new window.CustomEvent("color-mode-change", {
          "detail": { "resolvedMode": "dark" },
          "bubbles": true
        });
        main.dispatchEvent(colorModeChangeEvent);
      }).then(function () {
        return waitForNextFrame();
      }).then(function () {
        const main = element.querySelector(".u-main");
        assert(main, "Main section should exist.");
        const mainStyle = window.getComputedStyle(main);
        const expectedTheme = componentWidgetClass.defaultTheme.main.dark;
        const shellStyle = window.getComputedStyle(element);

        expect(
          mainStyle.getPropertyValue("--neutral-base-color").trim().toLowerCase(),
          "Main neutral color should match the dark theme after event dispatch."
        ).to.equal(String(expectedTheme.neutral).toLowerCase());
        expect(
          mainStyle.getPropertyValue("--accent-base-color"),
          "Main accent-base-color should not be locally overridden in dark mode."
        ).to.equal(shellStyle.getPropertyValue("--accent-base-color"));
        expect(
          Number.parseFloat(mainStyle.getPropertyValue("--base-layer-luminance")),
          "Main luminance should match the dark theme after event dispatch."
        ).to.equal(expectedTheme.luminance);
      });
    });

    it("should apply footer dark theme when color-mode-change event is dispatched", function () {
      return asyncRun(function () {
        document.documentElement.dataset.uColorMode = "light";
      }).then(function () {
        return waitForNextFrame();
      }).then(function () {
        const footer = element.querySelector(".u-footer");
        assert(footer, "Footer section should exist.");

        // Dispatch color-mode-change event.
        const colorModeChangeEvent = new window.CustomEvent("color-mode-change", {
          "detail": { "resolvedMode": "dark" },
          "bubbles": true
        });
        footer.dispatchEvent(colorModeChangeEvent);
      }).then(function () {
        return waitForNextFrame();
      }).then(function () {
        const footer = element.querySelector(".u-footer");
        assert(footer, "Footer section should exist.");
        const footerStyle = window.getComputedStyle(footer);
        const expectedTheme = componentWidgetClass.defaultTheme.footer.dark;
        const shellStyle = window.getComputedStyle(element);

        expect(
          footerStyle.getPropertyValue("--neutral-base-color").trim().toLowerCase(),
          "Footer neutral color should match the dark theme after event dispatch."
        ).to.equal(String(expectedTheme.neutral).toLowerCase());
        expect(
          footerStyle.getPropertyValue("--accent-base-color"),
          "Footer accent-base-color should not be locally overridden in dark mode."
        ).to.equal(shellStyle.getPropertyValue("--accent-base-color"));
        expect(
          Number.parseFloat(footerStyle.getPropertyValue("--base-layer-luminance")),
          "Footer luminance should match the dark theme after event dispatch."
        ).to.equal(expectedTheme.luminance);
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

