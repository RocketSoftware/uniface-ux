(function () {
  "use strict";

  const assert = chai.assert;
  const expect = chai.expect;

  // Component Layout test setup.
  const componentTester = new umockup.WidgetTester("UX.CompLayout", "ucpt:comp-layout");
  const componentWidgetId = componentTester.widgetId;
  const componentWidgetName = componentTester.widgetName;
  const componentWidgetClass = componentTester.getWidgetClass();

  const asyncRun = umockup.asyncRun;
  const createSkeleton = umockup.createSkeleton;

  const mockComponentDef = {
    "#2": {
      "nm": "UXENTITY.NOMODEL",
      "type": "entity",
      "widget_class": "UX.CollectionLayout",
      "occs": {
        "#2": {
          "#3": {
            "nm": "TEXTFIELD.UXENTITY1.NOMODEL",
            "type": "field",
            "initval": "1234568",
            "triggers": {
              "ongetjs": {
                "requesttype": "update"
              }
            },
            "widget_class": "UX.TextField",
            "properties": {
              "html:type": "text"
            },
            "id": "#3"
          },
          "#4": {
            "nm": "TEXTAREA.UXENTITY1.NOMODEL",
            "type": "field",
            "initval": "Hello",
            "triggers": {
              "ongetjs": {
                "requesttype": "update"
              }
            },
            "widget_class": "UX.TextArea",
            "properties": {
              "html:placeholder": "Add your suggestion"
            },
            "id": "#4"
          },
          "#5": {
            "nm": "BUTTON.UXENTITY1.NOMODEL",
            "type": "field",
            "initval": "1234568",
            "triggers": {
              "ongetjs": {
                "requesttype": "update"
              }
            },
            "widget_class": "UX.Button",
            "properties": {
              "value": "Button"
            },
            "id": "#5"
          },
          "#6": {
            "nm": "CHECKBOX.UXENTITY1.NOMODEL",
            "type": "field",
            "initval": "1234568",
            "triggers": {
              "ongetjs": {
                "requesttype": "update"
              }
            },
            "widget_class": "UX.Checkbox",
            "properties": {
              "value": "1"
            },
            "id": "#6"
          },
          "type": "occurrence",
          "widget_class": "UX.OccurrenceLayout"
        }
      },
      "properties": {
        "label-size": "normal"
      },
      "id": "#2"
    },
    "componentname": "TESTCOMPONENT",
    "properties": {},
    "type": "component",
    "widget_class": "UX.CompLayout"
  };

  function verifyWidgetClass(widgetClass, widgetName) {
    assert(
      widgetClass,
      `Widget class '${widgetName}' is not defined!
          Hint: Check if the JavaScript file defined class '${widgetName}' is loaded.`
    );
  }
  // Resets the widget container by clearing its content and adding a new anchor element for the widget.
  function resetWidgetContainer() {
    const container = document.getElementById("widget-container");
    if (container) {
      container.innerHTML = "";
      const anchor = document.createElement("span");
      anchor.id = "ux-widget";
      container.appendChild(anchor);
    }
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
      expect(structure.tagName, "Structure tagName should be 'uf-layout'.").to.equal("uf-layout");
      expect(structure.styleClass, "Structure styleClass should be empty string.").to.equal("");
      expect(structure.elementQuerySelector, "Structure elementQuerySelector should be empty string.").to.equal("");
      expect(structure.childWorkers, "Structure childWorkers should be an array.").to.be.an("array");
    });
  });

  describe("processLayout()", function () {

    describe("Checks", function () {
      let element;

      before(function () {
        const componentSkeleton = createSkeleton(componentWidgetId);
        element = componentTester.processLayout(componentSkeleton, mockComponentDef);
      });

      it("should be an instance of HTMLElement", function () {
        expect(element).instanceOf(HTMLElement, `Function processLayout() of ${componentWidgetName} does not return an HTMLElement.`);
      });

      it("should register the web component", function () {
        const customElementNames = ["uf-layout"];
        for (const name of customElementNames) {
          assert(window.customElements.get(name), `Web component ${name} has not been registered!`);
        }
      });

      it("should have the correct tagName", function () {
        expect(element).to.have.tagName(componentTester.uxTagName);
      });

      it("should have the correct id", function () {
        expect(element).to.have.id(componentTester.widgetId);
      });

      it("should have a label text element", function () {
        assert(element.querySelector("span.u-label-text"), "Component Layout widget misses or has incorrect u-label-text element.");
      });
    });
  });

  describe("Create widget", function () {

    it("should construct the widget", function () {
      const widget = componentTester.construct();
      expect(widget, "componentTester.construct() should return a widget instance").to.exist;
      expect(componentWidgetClass.defaultValues, "Component widget class should define required default values").to.include.all.keys(
        "class:u-comp-layout",
        "horizontal-align",
        "vertical-align",
        "label-size",
        "label-text",
        "label-align",
        "label-position",
        "layout-type",
        "appearance"
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
      assert.strictEqual(componentTester.widgetId.toString().length > 0, true, "Widget id should be a non-empty string.");
    });

    it("should have default value 'vertical-scroll' for 'layout-type'", function () {
      expect(componentTester.defaultValues["layout-type"], "Default value of 'layout-type' should be 'vertical-scroll'.").to.equal("vertical-scroll");
    });

    it("should have default value 'start' for 'horizontal-align'", function () {
      expect(componentTester.defaultValues["horizontal-align"], "Default value of 'horizontal-align' should be 'start'.").to.equal("start");
    });

    it("should have default value 'start' for 'vertical-align'", function () {
      expect(componentTester.defaultValues["vertical-align"], "Default value of 'vertical-align' should be 'start'.").to.equal("start");
    });

    it("should have default value 'normal' for 'label-size'", function () {
      expect(componentTester.defaultValues["label-size"], "Default value of 'label-size' should be 'normal'.").to.equal("normal");
    });

    it("should have default value 'start' for 'label-align'", function () {
      expect(componentTester.defaultValues["label-align"], "Default value of 'label-align' should be 'start'.").to.equal("start");
    });

    it("should have default value 'above' for 'label-position'", function () {
      expect(componentTester.defaultValues["label-position"], "Default value of 'label-position' should be 'above'.").to.equal("above");
    });

    it("should have default value 'transparent' for 'appearance'", function () {
      expect(componentTester.defaultValues["appearance"], "Default value of 'appearance' should be 'transparent'.").to.equal("transparent");
    });

    it("should have default value '' for 'label-text' and the label span should be hidden and empty", function () {
      expect(componentTester.defaultValues["label-text"], "Default value of 'label-text' should be empty string.").to.equal("");
      const labelElement = element.querySelector(":scope > .u-label-text");
      expect(labelElement, "The '.u-label-text' element should exist after dataInit.").to.exist;
      expect(labelElement.textContent, "The label text content should be empty string by default.").to.equal("");
      expect(labelElement.hidden, "The '.u-label-text' element should be hidden by default.").to.be.true;
    });

    it("should set show-label attribute to 'true' on the root element after dataInit()", function () {
      expect(element.getAttribute("show-label"), "The 'show-label' attribute should be 'true' on the root element after initialization.").to.equal("true");
    });

    describe("Shadow root structure and ::part(root) gap", function () {

      it("should have a shadow root on u-comp-layout", function () {
        assert(element.shadowRoot, "Shadow root should exist on u-comp-layout.");
      });

      it("should have a ::part(root) element in the shadow root of u-comp-layout", function () {
        const rootPart = element.shadowRoot.querySelector("[part='root']");
        assert(rootPart, "::part(root) should exist in the shadow root of u-comp-layout.");
      });

      it("should have a non-zero gap on u-comp-layout::part(root) set by --u-spacing", function () {
        const rootPart = element.shadowRoot.querySelector("[part='root']");
        const gap = parseFloat(window.getComputedStyle(rootPart).gap);
        expect(gap, "u-comp-layout::part(root) should have a non-zero gap set by var(--u-spacing).").to.be.above(0);
      });
    });

    it("should have a padding applied when used as main DSP", function () {
      const styles = window.getComputedStyle(element);
      const hasPadding = parseFloat(styles.paddingLeft) > 0 && parseFloat(styles.paddingRight) > 0 && parseFloat(styles.paddingTop) > 0 && parseFloat(styles.paddingBottom) > 0;
      expect(hasPadding, "Padding property should be set on layout element.").to.be.true;
    });

    it("should stretch to full dynamic viewport height", function () {
      const parent = element.parentElement;
      assert(parent, "Comp layout should be attached to a parent container.");

      const previousMinHeight = parent.style.minHeight;
      try {
        parent.style.minHeight = "100dvh";

        const parentStyles = window.getComputedStyle(parent);
        const styles = window.getComputedStyle(element);
        expect(styles.height, "Comp layout height should inherit the parent dynamic viewport min-height.").to.equal(
          parentStyles.minHeight
        );
      } finally {
        parent.style.minHeight = previousMinHeight;
      }
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

    describe("Label properties", function () {

      it("should update label-text and render as span by default", function () {
        const data = {
          "label-text": "Updated Layout"
        };
        return asyncRun(function () {
          componentTester.dataUpdate(data);
        }).then(function () {
          const labelElement = element.querySelector(":scope > .u-label-text");
          expect(labelElement, "The '.u-label-text' element should exist after updating label-text.").to.exist;
          expect(labelElement.tagName.toLowerCase(), "The '.u-label-text' tag should be 'span' by default.").to.equal("span");
          expect(labelElement.textContent, "The label text content should equal 'Updated Layout'.").to.equal("Updated Layout");
        });
      });

      const labelSizeTagMap = {
        "small": "h3",
        "medium": "h2",
        "large": "h1",
        "normal": "span"
      };
      Object.entries(labelSizeTagMap).forEach(function ([size, expectedTag]) {
        it(`should use tag '${expectedTag}' for label-text element when label-size is '${size}'`, function () {
          return asyncRun(function () {
            componentTester.dataUpdate({
              "label-text": "Updated Layout",
              "label-size": size
            });
          }).then(function () {
            const labelElement = element.querySelector(":scope > .u-label-text");
            assert(labelElement, `The '.u-label-text' element should exist for label-size '${size}'.`);
            expect(labelElement.tagName.toLowerCase(), `The '.u-label-text' tag should be '${expectedTag}' for label-size '${size}'.`).to.equal(expectedTag);
            expect(labelElement.textContent, "The label text content should equal 'Updated Layout'.").to.equal("Updated Layout");
          });
        });
      });

      ["start", "center", "end"].forEach(function (alignment) {
        it(`should update label-align to '${alignment}'`, function () {
          const data = {
            "label-align": alignment
          };
          return asyncRun(function () {
            componentTester.dataUpdate(data);
          }).then(function () {
            expect(element.getAttribute("label-align"), `The 'label-align' attribute should equal '${alignment}'.`).to.equal(alignment);
          });
        });
      });

      ["below", "before", "above", "after"].forEach(function (position) {
        it(`should update label-position to '${position}'`, function () {
          const data = {
            "label-position": position
          };
          return asyncRun(function () {
            componentTester.dataUpdate(data);
          }).then(function () {
            expect(element.getAttribute("label-position"), `The 'label-position' attribute should equal '${position}'.`).to.equal(position);
          });
        });
      });

      it("should apply multiple label properties together", function () {
        const data = {
          "label-text": "Combined Test",
          "label-size": "large",
          "label-align": "center",
          "label-position": "below"
        };
        return asyncRun(function () {
          componentTester.dataUpdate(data);
        }).then(function () {
          expect(componentTester.element.getAttribute("label-size"), "The 'label-size' attribute should equal 'large'.").to.equal("large");
          expect(componentTester.element.getAttribute("label-align"), "The 'label-align' attribute should equal 'center'.").to.equal("center");
          expect(componentTester.element.getAttribute("label-position"), "The 'label-position' attribute should equal 'below'.").to.equal("below");
          const labelElement = componentTester.element.querySelector(":scope > .u-label-text");
          expect(labelElement, "The '.u-label-text' element should exist after updating multiple label properties.").to.exist;
          expect(labelElement.textContent, "The label text content should equal 'Combined Test'.").to.equal("Combined Test");
        });
      });

      it("should hide the label span when label-text is updated to empty string", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({
            "label-text": "Some Label"
          });
        })
          .then(function () {
            return asyncRun(function () {
              componentTester.dataUpdate({
                "label-text": ""
              });
            });
          })
          .then(function () {
            const labelElement = element.querySelector(":scope > .u-label-text");
            expect(labelElement, "The '.u-label-text' element should exist after updating label-text to empty string.").to.exist;
            expect(labelElement.hidden, "The '.u-label-text' element should be hidden when label-text is empty string.").to.be.true;
          });
      });

      it("should update label-text to null hides the label span", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({
            "label-text": "Some Label"
          });
        })
          .then(function () {
            return asyncRun(function () {
              componentTester.dataUpdate({
                "label-text": null
              });
            });
          })
          .then(function () {
            const labelElement = element.querySelector(":scope > .u-label-text");
            expect(labelElement, "The '.u-label-text' element should exist after updating label-text to null.").to.exist;
            expect(labelElement.hidden, "The '.u-label-text' element should be hidden when label-text is null.").to.be.true;
          });
      });

      it("should show the label span with text 'null' when label-text is set to the string 'null'", function () {
        return asyncRun(function () {
          componentTester.dataUpdate({
            "label-text": "null"
          });
        }).then(function () {
          const labelElement = element.querySelector(":scope > .u-label-text");
          expect(labelElement, "The '.u-label-text' element should exist after updating label-text to 'null'.").to.exist;
          expect(labelElement.hidden, "The '.u-label-text' element should be visible after updating label-text to 'null'.").to.be.false;
          expect(labelElement.textContent, "The label text content should equal 'null'.").to.equal("null");
        });
      });

      it("should update label-text to a very long text shows the label span with the full text", function () {
        const longText = "This is a very long label of WIDGET and the question is, will it wrap or not?";
        return asyncRun(function () {
          componentTester.dataUpdate({
            "label-text": longText
          });
        }).then(function () {
          const labelElement = element.querySelector(":scope > .u-label-text");
          expect(labelElement, "The '.u-label-text' element should exist after updating label-text to a very long text.").to.exist;
          expect(labelElement.hidden, "The '.u-label-text' element should be visible after updating label-text to a very long text.").to.be.false;
          expect(labelElement.textContent, "The label text content should equal the very long text.").to.equal(longText);
        });
      });
    });

    describe("Layout properties", function () {

      function createComponentDefWithManyChildren() {
        const componentDef = {
          "componentname": "TESTCOMPONENT",
          "properties": {},
          "type": "component",
          "widget_class": "UX.CompLayout"
        };

        for (let i = 1; i <= 10; i++) {
          componentDef[`#${i + 1}`] = {
            "nm": `FIELD_${i}`,
            "type": "field",
            "widget_class": "UX.TextField",
            "properties": {},
            "id": `#${i + 1}`
          };
        }

        return componentDef;
      }

      ["vertical-scroll", "horizontal-scroll", "horizontal-wrap", "vertical-wrap", "auto"].forEach(function (layoutType) {
        it(`should update layout-type to '${layoutType}'`, function () {
          const data = {
            "layout-type": layoutType
          };
          return asyncRun(function () {
            componentTester.dataUpdate(data);
          }).then(function () {
            expect(element.getAttribute("layout-type"), `The 'layout-type' attribute should equal '${layoutType}'.`).to.equal(layoutType);
          });
        });
      });

      it("should avoid horizontal overflow with layout-type 'horizontal-wrap' at fixed width", function () {
        return asyncRun(function () {
          const componentDef = createComponentDefWithManyChildren();
          componentTester.createWidget(null, createSkeleton(componentWidgetId), componentDef);
          element = componentTester.element;
          element.style.width = "320px";

          // Make child widgets wide enough to force a wrapping/scrolling decision.
          const childWidgets = element.querySelectorAll("[id^='ufld:'], [id^='uent:']");
          childWidgets.forEach(child => {
            child.style.width = "180px";
            child.style.minWidth = "180px";
          });

          componentTester.dataUpdate({ "layout-type": "horizontal-wrap" });
        }).then(function () {
          // horizontal-wrap should keep content wrapped instead of requiring horizontal scroll.
          expect(element.getAttribute("layout-type")).to.equal("horizontal-wrap");
          expect(element.scrollWidth, "horizontal-wrap should avoid horizontal overflow at fixed width.").to.be.at.most(element.clientWidth + 2);
        });
      });

      it("should create horizontal overflow with layout-type 'horizontal-scroll' at fixed width", function () {
        return asyncRun(function () {
          const componentDef = createComponentDefWithManyChildren();
          componentTester.createWidget(null, createSkeleton(componentWidgetId), componentDef);
          element = componentTester.element;
          element.style.width = "320px";

          // Make child widgets wide enough to require horizontal scrolling.
          const childWidgets = element.querySelectorAll("[id^='ufld:'], [id^='uent:']");
          childWidgets.forEach(child => {
            child.style.width = "180px";
            child.style.minWidth = "180px";
          });

          componentTester.dataUpdate({ "layout-type": "horizontal-scroll" });
        }).then(function () {
          expect(element.getAttribute("layout-type")).to.equal("horizontal-scroll");
          expect(element.scrollWidth, "horizontal-scroll should create horizontal overflow at fixed width.").to.be.above(element.clientWidth);
        });
      });

      ["start", "center", "end", "space-between", "space-around", "space-evenly", "stretch", "auto"].forEach(function (alignment) {
        it(`should update horizontal-align to '${alignment}'`, function () {
          const data = {
            "horizontal-align": alignment
          };
          return asyncRun(function () {
            componentTester.dataUpdate(data);
          }).then(function () {
            expect(element.getAttribute("horizontal-align"), `The 'horizontal-align' attribute should equal '${alignment}'.`).to.equal(alignment);
          });
        });
      });

      ["start", "center", "end", "space-between", "space-around", "space-evenly", "stretch", "auto"].forEach(function (alignment) {
        it(`should update vertical-align to '${alignment}'`, function () {
          const data = {
            "vertical-align": alignment
          };
          return asyncRun(function () {
            componentTester.dataUpdate(data);
          }).then(function () {
            expect(element.getAttribute("vertical-align"), `The 'vertical-align' attribute should equal '${alignment}'.`).to.equal(alignment);
          });
        });
      });
    });

    describe("Appearance property", function () {

      ["transparent", "outline", "card", "section", "panel"].forEach(function (value) {
        it(`should update appearance to '${value}'`, function () {
          const data = {
            "appearance": value
          };
          return asyncRun(function () {
            componentTester.dataUpdate(data);
          }).then(function () {
            expect(element.getAttribute("appearance"), `The 'appearance' attribute should be set to '${value}'.`).to.equal(value);
          });
        });
      });

      ["outline", "card", "section", "panel"].forEach(function (appearance) {
        it(`should have border-radius and padding for appearance '${appearance}'`, function () {
          const data = {
            "appearance": appearance
          };
          return asyncRun(function () {
            componentTester.dataUpdate(data);
          }).then(function () {
            const styles = window.getComputedStyle(element);
            expect(parseFloat(styles.borderRadius), `appearance '${appearance}' should have a non-zero border-radius.`).to.be.above(0);
            expect(parseFloat(styles.padding), `appearance '${appearance}' should have non-zero padding.`).to.be.above(0);
          });
        });
      });

      ["outline", "card", "panel"].forEach(function (appearance) {
        it(`should have border for appearance '${appearance}'`, function () {
          const data = {
            "appearance": appearance
          };
          return asyncRun(function () {
            componentTester.dataUpdate(data);
          }).then(function () {
            const styles = window.getComputedStyle(element);
            expect(parseFloat(styles.borderWidth), `appearance '${appearance}' should have a non-zero border width.`).to.be.above(0);
            expect(styles.borderStyle, `appearance '${appearance}' should have a solid border style.`).to.equal("solid");
            expect(styles.borderColor, `appearance '${appearance}' should have a non-transparent border color.`).not.to.equal("transparent");
          });
        });
      });

      ["card", "section", "panel"].forEach(function (appearance) {
        it(`should have background-color for appearance '${appearance}'`, function () {
          const data = {
            "appearance": appearance
          };
          return asyncRun(function () {
            componentTester.dataUpdate(data);
          }).then(function () {
            const styles = window.getComputedStyle(element);
            expect(styles.backgroundColor, `appearance '${appearance}' should have a non-transparent background color.`).not.to.equal("rgba(0, 0, 0, 0)");
          });
        });
      });

      it("should have box-shadow for appearance 'card'", function () {
        const data = {
          "appearance": "card"
        };
        return asyncRun(function () {
          componentTester.dataUpdate(data);
        }).then(function () {
          const styles = window.getComputedStyle(element);
          expect(styles.boxShadow, "appearance 'card' should have a box-shadow applied.").not.to.equal("none");
        });
      });

      ["transparent", "outline", "section", "panel"].forEach(function (appearance) {
        it(`should not have box-shadow for appearance '${appearance}'`, function () {
          const data = {
            "appearance": appearance
          };
          return asyncRun(function () {
            componentTester.dataUpdate(data);
          }).then(function () {
            const styles = window.getComputedStyle(element);
            expect(styles.boxShadow, `appearance '${appearance}' should not have a box-shadow.`).to.equal("none");
          });
        });
      });

      it("should not have border or background-color for appearance 'transparent'", function () {
        const data = {
          "appearance": "transparent"
        };
        return asyncRun(function () {
          componentTester.dataUpdate(data);
        }).then(function () {
          const styles = window.getComputedStyle(element);
          expect(parseFloat(styles.borderWidth), "appearance 'transparent' should have no border.").to.equal(0);
          expect(styles.backgroundColor, "appearance 'transparent' should have a transparent background color.").to.equal("rgba(0, 0, 0, 0)");
        });
      });

      it("should not have background-color for appearance 'outline'", function () {
        const data = {
          "appearance": "outline"
        };
        return asyncRun(function () {
          componentTester.dataUpdate(data);
        }).then(function () {
          const styles = window.getComputedStyle(element);
          expect(styles.backgroundColor, "appearance 'outline' should have a transparent background color.").to.equal("rgba(0, 0, 0, 0)");
        });
      });

      it("should not have border for appearance 'section'", function () {
        const data = {
          "appearance": "section"
        };
        return asyncRun(function () {
          componentTester.dataUpdate(data);
        }).then(function () {
          const styles = window.getComputedStyle(element);
          expect(parseFloat(styles.borderWidth), "appearance 'section' should have no border.").to.equal(0);
        });
      });
    });
  });

  describe("Reset properties", function () {
    let element;

    before(function () {
      resetWidgetContainer();
      const componentSkeleton = createSkeleton(componentWidgetId);
      componentTester.createWidget(null, componentSkeleton, mockComponentDef);
      element = componentTester.element;
    });

    it("should reset all properties and values to initial values if initial values exist", function () {
      const initialValues = {
        "label-text": "Label text",
        "label-size": "medium",
        "label-align": "center",
        "label-position": "below",
        "layout-type": "vertical-wrap",
        "horizontal-align": "center",
        "vertical-align": "end",
        "appearance": "panel"
      };

      return (
        asyncRun(function () {
          // Step 1: Call dataInit() to mock initial non-default screen load values.
          componentTester.dataInit(null, null, null, initialValues);
        })
          // Step 2: Apply a representative set of properties.
          .then(function () {
            return asyncRun(function () {
              componentTester.dataUpdate({
                "label-text": "Abc",
                "label-size": "small",
                "label-align": "end",
                "label-position": "before",
                "layout-type": "horizontal-wrap",
                "horizontal-align": "end",
                "vertical-align": "center",
                "appearance": "outline"
              });
            });
          })
          .then(function () {
            // Step 3: Verify all representative properties are applied.
            expect(element.querySelector(":scope > .u-label-text").hasAttribute("hidden"), "Label text span should not be hidden after update.").to
              .be.false;
            expect(element.querySelector(":scope > .u-label-text").textContent, "Label text should be 'Abc'.").to.equal("Abc");
            expect(element.getAttribute("label-position"), "label-position should be 'before'.").to.equal("before");
            expect(element.getAttribute("label-align"), "label-align should be 'end'.").to.equal("end");
            expect(element.getAttribute("label-size"), "label-size should be 'small'.").to.equal("small");
            expect(element.getAttribute("layout-type"), "layout-type should be 'horizontal-wrap'.").to.equal("horizontal-wrap");
            expect(element.getAttribute("horizontal-align"), "horizontal-align should be 'end'.").to.equal("end");
            expect(element.getAttribute("vertical-align"), "vertical-align should be 'center'.").to.equal("center");
            expect(element.getAttribute("appearance"), "appearance should be 'outline'.").to.equal("outline");
          })
          .then(function () {
            // Step 4: Call resetWidget() to reset all properties to initial values.
            return asyncRun(function () {
              componentTester.resetWidget();
            });
          })
          .then(function () {
            // Step 5: Verify all properties are reset to initial values.
            expect(element.querySelector(":scope > .u-label-text").hasAttribute("hidden"), "Label text span should not be hidden after reset.").to
              .be.false;
            expect(element.querySelector(":scope > .u-label-text").textContent, "Label text should be 'Label text'.").to.equal("Label text");
            expect(element.getAttribute("label-position"), "label-position should be reset to 'below'.").to.equal("below");
            expect(element.getAttribute("label-align"), "label-align should be reset to 'center'.").to.equal("center");
            expect(element.getAttribute("label-size"), "label-size should be reset to 'medium'.").to.equal("medium");
            expect(element.getAttribute("layout-type"), "layout-type should be reset to 'vertical-wrap'.").to.equal("vertical-wrap");
            expect(element.getAttribute("horizontal-align"), "horizontal-align should be reset to 'center'.").to.equal("center");
            expect(element.getAttribute("vertical-align"), "vertical-align should be reset to 'end'.").to.equal("end");
            expect(element.getAttribute("appearance"), "appearance should be reset to 'panel'.").to.equal("panel");
          })
      );
    });

    it("should reset all properties and values to default values if no initial values exist", function () {
      const initialValues = {};

      return (
        asyncRun(function () {
          // Step 1: Call dataInit() to mock initial non-default screen load values.
          componentTester.dataInit(null, null, null, initialValues);
        })
          // Step 2: Apply a representative set of properties.
          .then(function () {
            return asyncRun(function () {
              componentTester.dataUpdate({
                "label-text": "Abc",
                "label-size": "small",
                "label-align": "end",
                "label-position": "before",
                "layout-type": "horizontal-wrap",
                "horizontal-align": "end",
                "vertical-align": "center",
                "appearance": "outline"
              });
            });
          })
          .then(function () {
            // Step 3: Verify all representative properties are applied.
            expect(element.querySelector(":scope > .u-label-text").hasAttribute("hidden"), "Label text span should not be hidden after update.").to
              .be.false;
            expect(element.querySelector(":scope > .u-label-text").textContent, "Label text should be 'Abc'.").to.equal("Abc");
            expect(element.getAttribute("label-position"), "label-position should be 'before'.").to.equal("before");
            expect(element.getAttribute("label-align"), "label-align should be 'end'.").to.equal("end");
            expect(element.getAttribute("label-size"), "label-size should be 'small'.").to.equal("small");
            expect(element.getAttribute("layout-type"), "layout-type should be 'horizontal-wrap'.").to.equal("horizontal-wrap");
            expect(element.getAttribute("horizontal-align"), "horizontal-align should be 'end'.").to.equal("end");
            expect(element.getAttribute("vertical-align"), "vertical-align should be 'center'.").to.equal("center");
            expect(element.getAttribute("appearance"), "appearance should be 'outline'.").to.equal("outline");
          })
          .then(function () {
            // Step 4: Call resetWidget() to reset all properties to default values.
            return asyncRun(function () {
              componentTester.resetWidget();
            });
          })
          .then(function () {
            // Step 5: Verify all properties are reset to default values.
            expect(element.querySelector(":scope > .u-label-text").hasAttribute("hidden"), "Label text span should be hidden.").to.be.true;
            expect(element.querySelector(":scope > .u-label-text").textContent, "Label text should be empty.").to.equal("");
            expect(element.getAttribute("label-position"), "label-position should be reset to 'above'.").to.equal("above");
            expect(element.getAttribute("label-align"), "label-align should be reset to 'start'.").to.equal("start");
            expect(element.getAttribute("label-size"), "label-size should be reset to 'normal'.").to.equal("normal");
            expect(element.getAttribute("layout-type"), "layout-type should be reset to 'vertical-scroll'.").to.equal("vertical-scroll");
            expect(element.getAttribute("horizontal-align"), "horizontal-align should be reset to 'start'.").to.equal("start");
            expect(element.getAttribute("vertical-align"), "vertical-align should be reset to 'start'.").to.equal("start");
            expect(element.getAttribute("appearance"), "appearance should be reset to 'transparent'.").to.equal("transparent");
          })
      );
    });

    it("should reset specific properties and values to initial values that have initial values and leave others unchanged", function () {
      const initialValues = {
        "label-text": "Label text",
        "appearance": "card"
      };

      return (
        asyncRun(function () {
          // Step 1: Call dataInit() to mock initial non-default screen load values.
          componentTester.dataInit(null, null, null, initialValues);
        })
          // Step 2: Apply a representative set of properties.
          .then(function () {
            return asyncRun(function () {
              componentTester.dataUpdate({
                "label-text": "Abc",
                "label-size": "small",
                "label-align": "end",
                "label-position": "before",
                "layout-type": "horizontal-wrap",
                "horizontal-align": "end",
                "vertical-align": "center",
                "appearance": "outline"
              });
            });
          })
          .then(function () {
            // Step 3: Verify all representative properties are applied.
            expect(element.querySelector(":scope > .u-label-text").hasAttribute("hidden"), "Label text span should not be hidden after update.").to
              .be.false;
            expect(element.querySelector(":scope > .u-label-text").textContent, "Label text should be 'Abc'.").to.equal("Abc");
            expect(element.getAttribute("label-position"), "label-position should be 'before'.").to.equal("before");
            expect(element.getAttribute("label-align"), "label-align should be 'end'.").to.equal("end");
            expect(element.getAttribute("label-size"), "label-size should be 'small'.").to.equal("small");
            expect(element.getAttribute("layout-type"), "layout-type should be 'horizontal-wrap'.").to.equal("horizontal-wrap");
            expect(element.getAttribute("horizontal-align"), "horizontal-align should be 'end'.").to.equal("end");
            expect(element.getAttribute("vertical-align"), "vertical-align should be 'center'.").to.equal("center");
            expect(element.getAttribute("appearance"), "appearance should be 'outline'.").to.equal("outline");
          })
          .then(function () {
            // Step 4: Call resetWidget() to reset label-text and appearance properties to initial values.
            return asyncRun(function () {
              componentTester.resetWidget(["label-text", "appearance"]);
            });
          })
          .then(function () {
            // Step 5: Verify reset properties ('label-text', 'appearance') are restored to initial values; others remain unchanged.
            expect(element.querySelector(":scope > .u-label-text").hasAttribute("hidden"), "Label text span should not be hidden after reset.").to
              .be.false;
            expect(element.querySelector(":scope > .u-label-text").textContent, "Label text should be 'Label text'.").to.equal("Label text");
            expect(element.getAttribute("label-position"), "label-position should remain 'before' (not reset).").to.equal("before");
            expect(element.getAttribute("label-align"), "label-align should remain 'end' (not reset).").to.equal("end");
            expect(element.getAttribute("label-size"), "label-size should remain 'small' (not reset).").to.equal("small");
            expect(element.getAttribute("layout-type"), "layout-type should remain 'horizontal-wrap' (not reset).").to.equal("horizontal-wrap");
            expect(element.getAttribute("horizontal-align"), "horizontal-align should remain 'end' (not reset).").to.equal("end");
            expect(element.getAttribute("vertical-align"), "vertical-align should remain 'center' (not reset).").to.equal("center");
            expect(element.getAttribute("appearance"), "appearance should be reset to 'card'.").to.equal("card");
          })
      );
    });
  });

  describe("Widget reuse", function () {
    let element;

    it("should reset all properties and values to defaults when reused", function () {
      const componentSkeleton = createSkeleton(componentWidgetId);
      componentTester.createWidget(null, componentSkeleton, mockComponentDef);
      element = componentTester.element;
      // Step 1: Apply a representative set of properties.
      return asyncRun(function () {
        componentTester.dataUpdate({
          "label-text": "Label text",
          "label-position": "below",
          "label-align": "center",
          "label-size": "medium",
          "layout-type": "horizontal-scroll",
          "horizontal-align": "space-between",
          "vertical-align": "center",
          "appearance": "outline"
        });
      })
        .then(function () {
          // Step 2: Verify all properties are applied before reuse.
          expect(element.querySelector(":scope > .u-label-text").innerText, "Text should be 'Label text' before reuse.").to.equal("Label text");
          assert(!element.querySelector(":scope > .u-label-text").hasAttribute("hidden"), "Label text span should be visible before reuse.");
          expect(element.getAttribute("label-position"), "label-position should be 'below' before reuse.").to.equal("below");
          expect(element.getAttribute("label-align"), "label-align should be 'center' before reuse.").to.equal("center");
          expect(element.getAttribute("label-size"), "label-size should be 'medium' before reuse.").to.equal("medium");
          expect(element.getAttribute("layout-type"), "layout-type should be 'horizontal-scroll' before reuse.").to.equal("horizontal-scroll");
          expect(element.getAttribute("horizontal-align"), "horizontal-align should be 'space-between' before reuse.").to.equal("space-between");
          expect(element.getAttribute("vertical-align"), "vertical-align should be 'center' before reuse.").to.equal("center");
          expect(element.getAttribute("appearance"), "appearance should be 'outline' before reuse.").to.equal("outline");
        })
        .then(function () {
          // Step 3: Simulate Uniface widget reuse clean up the current occurrence, then re-initialize with defaults.
          componentTester.dataCleanup();
          return asyncRun(function () {
            componentTester.dataInit();
          });
        })
        .then(function () {
          // Step 4: Verify all properties and value are reset to defaults after reuse.
          assert(element.querySelector(":scope > .u-label-text").hasAttribute("hidden"), "Label text span should be hidden after reuse.");
          expect(element.querySelector(":scope > .u-label-text").innerText, "Label text should be empty after reuse.").to.equal("");
          expect(element.getAttribute("label-position"), "label-position should be reset to 'above' after reuse.").to.equal("above");
          expect(element.getAttribute("label-align"), "label-align should be reset to 'start' after reuse.").to.equal("start");
          expect(element.getAttribute("label-size"), "label-size should be reset to 'normal' after reuse.").to.equal("normal");
          expect(element.getAttribute("layout-type"), "layout-type should be reset to 'vertical-scroll' after reuse.").to.equal("vertical-scroll");
          expect(element.getAttribute("horizontal-align"), "horizontal-align should be reset to 'start' after reuse.").to.equal("start");
          expect(element.getAttribute("vertical-align"), "vertical-align should be reset to 'start' after reuse.").to.equal("start");
          expect(element.getAttribute("appearance"), "appearance should be reset to 'transparent' after reuse.").to.equal("transparent");
        });
    });
  });
})();

