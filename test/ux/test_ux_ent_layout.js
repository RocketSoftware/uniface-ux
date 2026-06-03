(function () {
  "use strict";

  const assert = chai.assert;
  const expect = chai.expect;

  // Collection Entity test setup.
  const collectionTester = new umockup.WidgetTester("UX.CollectionLayout", "uent:UXENTITY.NOMODEL");
  const collectionWidgetId = collectionTester.widgetId;
  const collectionWidgetName = collectionTester.widgetName;
  const collectionWidgetClass = collectionTester.getWidgetClass();

  // Occurrence Entity test setup.
  const occurrenceTester = new umockup.WidgetTester("UX.OccurrenceLayout", "uocc:UXENTITY.NOMODEL.1");
  const occurrenceWidgetId = occurrenceTester.widgetId;
  const occurrenceWidgetName = occurrenceTester.widgetName;
  const occurrenceWidgetClass = occurrenceTester.getWidgetClass();

  // Component Layout test setup.
  const componentTester = new umockup.WidgetTester("UX.CompLayout", "ucpt:comp-layout");
  const componentWidgetId = componentTester.widgetId;

  const asyncRun = umockup.asyncRun;
  const createSkeleton = umockup.createSkeleton;

  const layoutTypes = ["vertical-scroll", "horizontal-scroll", "horizontal-wrap", "vertical-wrap", "auto"];
  const alignmentValues = ["start", "center", "end", "space-between", "space-around", "space-evenly", "stretch", "auto"];
  const appearanceValues = ["transparent", "outline", "card", "section", "panel"];

  const mockEntityDef = {
    "nm": "UXENTITY.NOMODEL",
    "type": "entity",
    "widget_class": "UX.CollectionLayout",
    "occs": {
      "#2": {
        "type": "occurrence",
        "#3": {
          "nm": "TEXTFIELD.ENT.NOMODEL",
          "type": "field",
          "widget_class": "UX.TextField",
          "properties": {
            "html:type": "text"
          },
          "id": "#3"
        },
        "#4": {
          "nm": "TEXTAREA.ENT.NOMODEL",
          "type": "field",
          "widget_class": "UX.TextArea",
          "properties": {},
          "id": "#4"
        },
        "#5": {
          "nm": "SWITCH.ENT.NOMODEL",
          "type": "field",
          "widget_class": "UX.Switch",
          "properties": {},
          "id": "#5"
        },
        "widget_class": "UX.OccurrenceLayout"
      }
    },
    "properties": {},
    "id": "#2",
    "hasNEDFields": true,
    "ownsNEDFields": true
  };

  const mockEntityDefWithMultipleOccs = {
    "nm": "UXENTITY.NOMODEL",
    "type": "entity",
    "widget_class": "UX.CollectionLayout",
    "occs": {
      "#2": {
        "type": "occurrence",
        "#3": {
          "nm": "TEXTFIELD.ENT.NOMODEL",
          "type": "field",
          "widget_class": "UX.TextField",
          "properties": {
            "html:type": "text"
          },
          "id": "#3"
        },
        "#4": {
          "nm": "BUTTON.ENT.NOMODEL",
          "type": "field",
          "widget_class": "UX.Button",
          "properties": {
            "html:readonly": "true"
          },
          "id": "#4"
        },
        "#5": {
          "nm": "TEXTAREA.ENT.NOMODEL",
          "type": "field",
          "widget_class": "UX.TextArea",
          "properties": {},
          "id": "#5"
        },
        "widget_class": "UX.OccurrenceLayout"
      },
      "#3": {
        "type": "occurrence",
        "#3": {
          "nm": "TEXTFIELD.UXENTITY.NOMODEL",
          "type": "field",
          "widget_class": "UX.TextField",
          "properties": {
            "html:type": "text"
          },
          "id": "#3"
        },
        "#4": {
          "nm": "BUTTON.UXENTITY.NOMODEL",
          "type": "field",
          "widget_class": "UX.Button",
          "properties": {
            "html:readonly": "true"
          },
          "id": "#4"
        },
        "#5": {
          "nm": "TEXTAREA.UXENTITY.NOMODEL",
          "type": "field",
          "widget_class": "UX.TextArea",
          "properties": {},
          "id": "#5"
        },
        "widget_class": "UX.OccurrenceLayout"
      }
    },
    "properties": {},
    "id": "#2",
    "hasNEDFields": true,
    "ownsNEDFields": true
  };

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
    "componentname": "APPEARANCE",
    "properties": {},
    "type": "component",
    "widget_class": "UX.CompLayout"
  };

  const mockComponentDefWithTwoEntities = {
    ...mockComponentDef,
    "#4": {
      "nm": "UXENTITY3.NOMODEL",
      "type": "entity",
      "widget_class": "UX.CollectionLayout",
      "occs": {
        "#3": {
          "#4": {
            "nm": "BUTTON.UXENTITY3.NOMODEL",
            "type": "field",
            "initval": "",
            "triggers": {
              "ongetjs": {
                "requesttype": "update"
              }
            },
            "widget_class": "UX.Button",
            "properties": {
              "value": "Button"
            },
            "id": "#4"
          },
          "#5": {
            "nm": "CHECKBOX.UXENTITY3.NOMODEL",
            "type": "field",
            "initval": "1",
            "triggers": {
              "ongetjs": {
                "requesttype": "update"
              }
            },
            "widget_class": "UX.Checkbox",
            "properties": {
              "value": "1"
            },
            "id": "#5"
          },
          "#6": {
            "nm": "SWITCH.UXENTITY3.NOMODEL",
            "type": "field",
            "initval": "1",
            "triggers": {
              "ongetjs": {
                "requesttype": "update"
              }
            },
            "widget_class": "UX.Switch",
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
      "id": "#3"
    }
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

    it(`should load the ${collectionWidgetName} widget class`, function () {
      verifyWidgetClass(collectionWidgetClass, collectionWidgetName);
    });

    it(`should load the ${occurrenceWidgetName} widget class`, function () {
      verifyWidgetClass(occurrenceWidgetClass, occurrenceWidgetName);
    });

  });

  describe("Uniface static structure constructor() definition", function () {

    describe("CollectionLayout specific", function () {

      it("should have a static property structure of type Element", function () {
        const structure = collectionWidgetClass.structure;
        expect(structure.constructor, "Structure constructor should be an instance of Element constructor.").to.be.an.instanceof(Element.constructor);
        expect(structure.tagName, "Structure tagName should be 'uf-layout'.").to.equal("uf-layout");
        expect(structure.styleClass, "Structure styleClass should be empty string.").to.equal("");
        expect(structure.elementQuerySelector, "Structure elementQuerySelector should be empty string.").to.equal("");
        expect(structure.childWorkers, "Structure childWorkers should be an array.").to.be.an("array");
      });
    });

    describe("OccurrenceLayout specific", function () {

      it("should have a static property structure of type Element", function () {
        const structure = occurrenceWidgetClass.structure;
        expect(structure.constructor, "Structure constructor should be an instance of Element constructor.").to.be.an.instanceof(Element.constructor);
        expect(structure.tagName, "Structure tagName should be 'uf-layout'.").to.equal("uf-layout");
        expect(structure.styleClass, "Structure styleClass should be empty string.").to.equal("");
        expect(structure.elementQuerySelector, "Structure elementQuerySelector should be empty string.").to.equal("");
        expect(structure.childWorkers, "Structure childWorkers should be an array.").to.be.an("array");
      });
    });
  });

  describe("processLayout()", function () {

    describe("CollectionLayout specific", function () {

      describe("Checks", function () {
        let element;

        before(function () {
          const collectionSkeleton = createSkeleton(collectionWidgetId);
          element = collectionTester.processLayout(collectionSkeleton, mockEntityDef);
        });

        it("should be an instance of HTMLElement", function () {
          expect(element, `Function processLayout() of ${collectionWidgetName} does not return an HTMLElement.`).instanceOf(HTMLElement);
        });

        it("should register the web component", function () {
          const customElementNames = ["uf-layout"];
          for (const name of customElementNames) {
            assert(window.customElements.get(name), `Web component ${name} has not been registered!`);
          }
        });

        it("should have the correct tagName", function () {
          expect(element, `Element should have tagName ${collectionTester.uxTagName}.`).to.have.tagName(collectionTester.uxTagName);
        });

        it("should have the correct id", function () {
          expect(element, `Element should have id ${collectionWidgetId}.`).to.have.id(collectionWidgetId);
        });

        it("should have label text element for CollectionLayout", function () {
          assert(element.querySelector("span.u-label-text"), "CollectionLayout widget misses or has incorrect u-label-text element.");
        });
      });
    });

    describe("OccurrenceLayout specific", function () {

      describe("Checks", function () {
        let element;

        before(function () {
          const occurrenceSkeleton = createSkeleton(occurrenceWidgetId);
          element = occurrenceTester.processLayout(occurrenceSkeleton, mockEntityDef);
        });

        it("should be an instance of HTMLElement", function () {
          expect(element, `Function processLayout() of ${occurrenceWidgetName} does not return an HTMLElement.`).instanceOf(HTMLElement);
        });

        it("should register the web component", function () {
          const customElementNames = ["uf-layout"];
          for (const name of customElementNames) {
            assert(window.customElements.get(name), `Web component ${name} has not been registered!`);
          }
        });

        it("should have the correct tagName", function () {
          expect(element, `Element should have tagName ${occurrenceTester.uxTagName}.`).to.have.tagName(occurrenceTester.uxTagName);
        });

        it("should have the correct id", function () {
          expect(element, `Element should have id ${occurrenceWidgetId}.`).to.have.id(occurrenceWidgetId);
        });

        it("should not have a label text element for OccurrenceLayout", function () {
          const labelElement = element.querySelector(":scope > span.u-label-text");
          assert(!labelElement, "OccurrenceLayout should not have a u-label-text element.");
        });
      });
    });
  });

  describe("Create widget", function () {

    describe("CollectionLayout specific", function () {

      it("constructor()", function () {
        const widget = collectionTester.construct();
        expect(widget, "collectionTester.construct() should return a widget instance").to.exist;
        expect(collectionWidgetClass.defaultValues, "Collection widget class should define required default values").to.include.all.keys(
          "class:u-coll-layout",
          "layout-type-occurrences",
          "horizontal-align-occurrences",
          "vertical-align-occurrences",
          "label-size",
          "label-text",
          "label-align",
          "label-position",
          "area-slot",
          "appearance"
        );
      });

      describe("onConnect()", function () {

        it("should create and connect the element", function () {
          const collectionSkeleton = createSkeleton(collectionWidgetId);
          const widget = collectionTester.onConnect(collectionSkeleton, mockEntityDef);
          const element = collectionTester.element;
          assert(element, "Target element is not defined!");
          assert(widget.elements.widget === element, "Widget is not connected!");
        });
      });

      it("should render without any console errors or warnings", function () {
        const errorSpy = sinon.spy(console, "error");
        const warnSpy = sinon.spy(console, "warn");
        try {
          collectionTester.createWidget(null, createSkeleton(collectionWidgetId), mockEntityDef);
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

    describe("OccurrenceLayout specific", function () {

      it("constructor()", function () {
        const widget = occurrenceTester.construct();
        expect(widget, "occurrenceTester.construct() should return a widget instance").to.exist;
        expect(occurrenceWidgetClass.defaultValues, "Occurrence widget class should define required default values").to.include.all.keys(
          "class:u-occ-layout",
          "layout-type",
          "horizontal-align",
          "vertical-align",
          "appearance-occurrences"
        );
      });

      describe("onConnect()", function () {

        it("should create and connect the element", function () {
          const occurrenceSkeleton = createSkeleton(occurrenceWidgetId);
          const widget = occurrenceTester.onConnect(occurrenceSkeleton, mockEntityDef);
          const element = occurrenceTester.element;
          assert(element, "Target element is not defined!");
          assert(widget.elements.widget === element, "Widget is not connected!");
        });
      });

      it("should render without any console errors or warnings", function () {
        const errorSpy = sinon.spy(console, "error");
        const warnSpy = sinon.spy(console, "warn");
        try {
          occurrenceTester.createWidget(null, createSkeleton(occurrenceWidgetId), mockEntityDef);
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
  });

  describe("dataInit()", function () {

    describe("CollectionLayout specific", function () {
      const classes = collectionTester.getDefaultClasses();
      let element;

      before(function () {
        const collectionSkeleton = createSkeleton(collectionWidgetId);
        collectionTester.createWidget(null, collectionSkeleton, mockEntityDef);
        collectionTester.getDefaultValues();
        element = collectionTester.element;
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
        assert.strictEqual(collectionTester.widgetId.toString().length > 0, true, "Widget id should be a non-empty string.");
      });

      it("should have default value 'auto' for 'layout-type-occurrences'", function () {
        expect(collectionTester.defaultValues["layout-type-occurrences"], "Default value of 'layout-type-occurrences' should be 'auto'.").to.equal("auto");
      });

      it("should have default value 'auto' for 'horizontal-align-occurrences'", function () {
        expect(collectionTester.defaultValues["horizontal-align-occurrences"], "Default value of 'horizontal-align-occurrences' should be 'auto'.").to.equal("auto");
      });

      it("should have default value 'auto' for 'vertical-align-occurrences'", function () {
        expect(collectionTester.defaultValues["vertical-align-occurrences"], "Default value of 'vertical-align-occurrences' should be 'auto'.").to.equal("auto");
      });

      it("should have default value 'normal' for 'label-size'", function () {
        expect(collectionTester.defaultValues["label-size"], "Default value of 'label-size' should be 'normal'.").to.equal("normal");
      });

      it("should have default value 'start' for 'label-align'", function () {
        expect(collectionTester.defaultValues["label-align"], "Default value of 'label-align' should be 'start'.").to.equal("start");
      });

      it("should have default value 'above' for 'label-position'", function () {
        expect(collectionTester.defaultValues["label-position"], "Default value of 'label-position' should be 'above'.").to.equal("above");
      });

      it("should have default value 'main' for 'area-slot'", function () {
        expect(collectionTester.defaultValues["area-slot"], "Default value of 'area-slot' should be 'main'.").to.equal("main");
      });

      it("should have default value 'transparent' for 'appearance'", function () {
        expect(collectionTester.defaultValues["appearance"], "Default value of 'appearance' should be 'transparent'.").to.equal("transparent");
      });

      it("should set show-label attribute to 'true' on the root element after dataInit", function () {
        expect(element.getAttribute("show-label"), "The 'show-label' attribute should be 'true' on the root element after initialization.").to.equal("true");
      });
    });

    describe("OccurrenceLayout specific", function () {
      const classes = occurrenceTester.getDefaultClasses();
      let element;

      before(function () {
        const occurrenceSkeleton = createSkeleton(occurrenceWidgetId);
        occurrenceTester.createWidget(null, occurrenceSkeleton, mockEntityDef);
        occurrenceTester.getDefaultValues();
        element = occurrenceTester.element;
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
        assert.strictEqual(occurrenceTester.widgetId.toString().length > 0, true, "Widget id should be a non-empty string.");
      });

      it("should have correct default value for 'layout-type'", function () {
        expect(occurrenceTester.defaultValues["layout-type"], "Default value of 'layout-type' should be 'auto'.").to.equal(
          "auto"
        );
      });

      it("should have default value 'auto' for 'horizontal-align'", function () {
        expect(
          occurrenceTester.defaultValues["horizontal-align"],
          "Default value of 'horizontal-align' should be 'auto'."
        ).to.equal("auto");
      });

      it("should have default value 'auto' for 'vertical-align'", function () {
        expect(
          occurrenceTester.defaultValues["vertical-align"],
          "Default value of 'vertical-align' should be 'auto'."
        ).to.equal("auto");
      });

      it("should not have a default value for 'label-size' (collection-only property)", function () {
        expect(occurrenceTester.defaultValues["label-size"], "OccurrenceLayout should not define 'label-size'.").to.be.undefined;
      });

      it("should not have a default value for 'label-align' (collection-only property)", function () {
        expect(occurrenceTester.defaultValues["label-align"], "OccurrenceLayout should not define 'label-align'.").to.be.undefined;
      });

      it("should not have a default value for 'label-position' (collection-only property)", function () {
        expect(occurrenceTester.defaultValues["label-position"], "OccurrenceLayout should not define 'label-position'.").to.be.undefined;
      });

      it("should not have a default value for 'area-slot' (collection-only property)", function () {
        expect(occurrenceTester.defaultValues["area-slot"], "OccurrenceLayout should not define 'area-slot'.").to.be.undefined;
      });

      it("should have default value 'transparent' for 'appearance-occurrences'", function () {
        expect(occurrenceTester.defaultValues["appearance-occurrences"], "Default value of 'appearance-occurrences' should be 'transparent'.").to.equal("transparent");
      });

      it("should not have a show-label attribute on the root element after dataInit (occurrence-only layout)", function () {
        expect(element.getAttribute("show-label"), "OccurrenceLayout should not have a 'show-label' attribute.").to.be.null;
      });
    });
  });

  describe("dataUpdate()", function () {

    describe("CollectionLayout specific", function () {
      let element;

      before(function () {
        return asyncRun(function () {
          const collectionSkeleton = createSkeleton(collectionWidgetId);
          collectionTester.createWidget(null, collectionSkeleton, mockEntityDef);
          element = collectionTester.element;
        }).then(function () {
          assert(element, "Widget top element is not defined!");
        });
      });

      describe("Label properties", function () {

        it("should update label-text", function () {
          const data = {
            "label-text": "Collection Label"
          };
          return asyncRun(function () {
            collectionTester.dataUpdate(data);
          }).then(function () {
            const labelElement = element.querySelector(":scope > .u-label-text");
            expect(labelElement, "The '.u-label-text' element should exist after updating label-text.").to.exist;
            expect(labelElement.textContent, "The label text content should equal 'Collection Label'.").to.equal("Collection Label");
          });
        });

        ["small", "medium", "large", "normal"].forEach(function (size) {
          it(`should update label-size to ${size}`, function () {
            const data = {
              "label-text": "Collection Label",
              "label-size": size
            };
            return asyncRun(function () {
              collectionTester.dataUpdate(data);
            }).then(function () {
              expect(element.getAttribute("label-size"), `The 'label-size' attribute should equal '${size}'.`).to.equal(size);
            });
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
              collectionTester.dataUpdate({
                "label-text": "Tag Test",
                "label-size": size
              });
            }).then(function () {
              const labelElement = element.querySelector(":scope > .u-label-text");
              assert(labelElement, `The '.u-label-text' element should exist for label-size '${size}'.`);
              expect(labelElement.tagName.toLowerCase(), `The '.u-label-text' tag should be '${expectedTag}' for label-size '${size}'.`).to.equal(expectedTag);
            });
          });
        });

        it("should change label-text tag when label-size changes dynamically", function () {
          return asyncRun(function () {
            collectionTester.dataUpdate({
              "label-text": "Dynamic Tag Test",
              "label-size": "large"
            });
          }).then(function () {
            const labelElement = element.querySelector(":scope > .u-label-text");
            expect(labelElement.tagName.toLowerCase(), "Tag should be 'h1' for label-size 'large'.").to.equal("h1");
            expect(labelElement.textContent, "Text should be preserved after tag change.").to.equal("Dynamic Tag Test");
            return asyncRun(function () {
              collectionTester.dataUpdate({ "label-size": "small" });
            });
          }).then(function () {
            const labelElement = element.querySelector(":scope > .u-label-text");
            expect(labelElement.tagName.toLowerCase(), "Tag should be 'h3' after changing label-size to 'small'.").to.equal("h3");
            expect(labelElement.textContent, "Text should be preserved after tag change.").to.equal("Dynamic Tag Test");
          });
        });

        ["start", "center", "end"].forEach(function (alignment) {
          it(`should update label-align to ${alignment}`, function () {
            const data = {
              "label-align": alignment
            };
            return asyncRun(function () {
              collectionTester.dataUpdate(data);
            }).then(function () {
              expect(element.getAttribute("label-align"), `The 'label-align' attribute should equal '${alignment}'.`).to.equal(alignment);
            });
          });
        });

        ["above", "below", "before", "after"].forEach(function (position) {
          it(`should update label-position to ${position}`, function () {
            const data = {
              "label-position": position
            };
            return asyncRun(function () {
              collectionTester.dataUpdate(data);
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
            collectionTester.dataUpdate(data);
          }).then(function () {
            expect(collectionTester.element.getAttribute("label-size"), "The 'label-size' attribute should equal 'large'.").to.equal("large");
            expect(collectionTester.element.getAttribute("label-align"), "The 'label-align' attribute should equal 'center'.").to.equal("center");
            expect(collectionTester.element.getAttribute("label-position"), "The 'label-position' attribute should equal 'below'.").to.equal("below");
            const labelElement = collectionTester.element.querySelector(":scope > .u-label-text");
            expect(labelElement, "The '.u-label-text' element should exist after updating multiple label properties.").to.exist;
            expect(labelElement.textContent, "The label text content should equal 'Combined Test'.").to.equal("Combined Test");
          });
        });

        it("should update label-text to empty string hides the label span", function () {
          return asyncRun(function () {
            collectionTester.dataUpdate({
              "label-text": "Some Label"
            });
          }).then(function () {
            return asyncRun(function () {
              collectionTester.dataUpdate({
                "label-text": ""
              });
            });
          }).then(function () {
            const labelElement = element.querySelector(":scope > .u-label-text");
            expect(labelElement, "The '.u-label-text' element should exist after updating label-text to empty string.").to.exist;
            expect(labelElement.hidden, "The '.u-label-text' element should be hidden when label-text is empty string.").to.be.true;
          });
        });

        it("should update label-text to null hides the label span", function () {
          return asyncRun(function () {
            collectionTester.dataUpdate({
              "label-text": "Some Label"
            });
          }).then(function () {
            return asyncRun(function () {
              collectionTester.dataUpdate({
                "label-text": null
              });
            });
          }).then(function () {
            const labelElement = element.querySelector(":scope > .u-label-text");
            expect(labelElement, "The '.u-label-text' element should exist after updating label-text to null.").to.exist;
            expect(labelElement.hidden, "The '.u-label-text' element should be hidden when label-text is null.").to.be.true;
          });
        });

        it("should show the label span with text 'null' when label-text is set to the string 'null'", function () {
          return asyncRun(function () {
            collectionTester.dataUpdate({
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
            collectionTester.dataUpdate({
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

      describe("Container properties", function () {
        ["main", "header", "footer"].forEach(function (slot) {
          it(`should update area-slot to ${slot}`, function () {
            const data = {
              "area-slot": slot
            };
            return asyncRun(function () {
              collectionTester.dataUpdate(data);
            }).then(function () {
              expect(element.getAttribute("area-slot"), `The 'area-slot' attribute should equal '${slot}'.`).to.equal(slot);
            });
          });
        });
      });

      describe("Layout properties", function () {
        layoutTypes.forEach(function (layoutType) {
          it(`should update layout-type to ${layoutType}`, function () {
            const data = {
              "layout-type-occurrences": layoutType
            };
            return asyncRun(function () {
              collectionTester.dataUpdate(data);
            }).then(function () {
              expect(element.getAttribute("layout-type"), `The 'layout-type' attribute should equal '${layoutType}'.`).to.equal(layoutType);
            });
          });
        });

        alignmentValues.forEach(function (alignment) {
          it(`should update horizontal-align to ${alignment}`, function () {
            const data = {
              "horizontal-align-occurrences": alignment
            };
            return asyncRun(function () {
              collectionTester.dataUpdate(data);
            }).then(function () {
              expect(element.getAttribute("horizontal-align"), `The 'horizontal-align' attribute should equal '${alignment}'.`).to.equal(alignment);
            });
          });
        });

        alignmentValues.forEach(function (alignment) {
          it(`should update vertical-align to ${alignment}`, function () {
            const data = {
              "vertical-align-occurrences": alignment
            };
            return asyncRun(function () {
              collectionTester.dataUpdate(data);
            }).then(function () {
              expect(element.getAttribute("vertical-align"), `The 'vertical-align' attribute should equal '${alignment}'.`).to.equal(alignment);
            });
          });
        });
      });

      describe("Appearance property", function () {
        appearanceValues.forEach(function (appearance) {
          it(`should update appearance to ${appearance}`, function () {
            const data = {
              "appearance": appearance
            };
            return asyncRun(function () {
              collectionTester.dataUpdate(data);
            }).then(function () {
              expect(element.getAttribute("appearance"), `The 'appearance' attribute should be set to '${appearance}'.`).to.equal(appearance);
            });
          });
        });

        ["outline", "card", "section", "panel"].forEach(function (appearance) {
          it(`should have border-radius and padding for appearance ${appearance}`, function () {
            const data = {
              "appearance": appearance
            };
            return asyncRun(function () {
              collectionTester.dataUpdate(data);
            }).then(function () {
              const styles = window.getComputedStyle(element);
              expect(parseFloat(styles.borderRadius), `appearance '${appearance}' should have a non-zero border-radius.`).to.be.above(0);
              expect(parseFloat(styles.padding), `appearance '${appearance}' should have non-zero padding.`).to.be.above(0);
            });
          });
        });

        ["outline", "card", "panel"].forEach(function (appearance) {
          it(`should have border for appearance ${appearance}`, function () {
            const data = {
              "appearance": appearance
            };
            return asyncRun(function () {
              collectionTester.dataUpdate(data);
            }).then(function () {
              const styles = window.getComputedStyle(element);

              expect(parseFloat(styles.borderWidth), `appearance '${appearance}' should have a non-zero border width.`).to.be.above(0);
              expect(styles.borderStyle, `appearance '${appearance}' should have a solid border style.`).to.equal("solid");
              expect(styles.borderColor, `appearance '${appearance}' should have a non-transparent border color.`).not.to.equal("transparent");
            });
          });
        });

        ["card", "section", "panel"].forEach(function (appearance) {
          it(`should have background-color for appearance ${appearance}`, function () {
            const data = {
              "appearance": appearance
            };
            return asyncRun(function () {
              collectionTester.dataUpdate(data);
            }).then(function () {
              const styles = window.getComputedStyle(element);
              expect(styles.backgroundColor, `Appearance '${appearance}' should have a non-transparent background color.`).not.to.equal(
                "rgba(0, 0, 0, 0)"
              );
            });
          });
        });

        it("should have box-shadow for appearance card", function () {
          const data = {
            "appearance": "card"
          };
          return asyncRun(function () {
            collectionTester.dataUpdate(data);
          }).then(function () {
            const styles = window.getComputedStyle(element);
            expect(styles.boxShadow, "appearance 'card' should have a box-shadow applied.").not.to.equal("none");
          });
        });

        ["transparent", "outline", "section", "panel"].forEach(function (appearance) {
          it(`should not have box-shadow for appearance ${appearance}`, function () {
            const data = { "appearance": appearance };
            return asyncRun(function () {
              collectionTester.dataUpdate(data);
            }).then(function () {
              const styles = window.getComputedStyle(element);
              expect(styles.boxShadow, `appearance '${appearance}' should not have a box-shadow.`).to.equal("none");
            });
          });
        });

        it("should not have border, padding or background-color for appearance transparent", function () {
          const data = { "appearance": "transparent" };
          return asyncRun(function () {
            collectionTester.dataUpdate(data);
          }).then(function () {
            const styles = window.getComputedStyle(element);
            expect(parseFloat(styles.borderWidth), "appearance 'transparent' should have no border.").to.equal(0);
            expect(styles.backgroundColor, "appearance 'transparent' should have a transparent background color.").to.equal("rgba(0, 0, 0, 0)");
            expect(parseFloat(styles.padding), "appearance 'transparent' should have no padding.").to.equal(0);
          });
        });

        it("should not have background-color for appearance outline", function () {
          const data = { "appearance": "outline" };
          return asyncRun(function () {
            collectionTester.dataUpdate(data);
          }).then(function () {
            const styles = window.getComputedStyle(element);
            expect(styles.backgroundColor, "appearance 'outline' should have a transparent background color.").to.equal("rgba(0, 0, 0, 0)");
          });
        });

        it("should not have border for appearance section", function () {
          const data = { "appearance": "section" };
          return asyncRun(function () {
            collectionTester.dataUpdate(data);
          }).then(function () {
            const styles = window.getComputedStyle(element);
            expect(parseFloat(styles.borderWidth), "appearance 'section' should have no border.").to.equal(0);
          });
        });
      });

      describe("Combined and independent property updates", function () {
        it("should apply multiple layout properties together", function () {
          const data = {
            "layout-type-occurrences": "vertical-scroll",
            "horizontal-align-occurrences": "center",
            "vertical-align-occurrences": "stretch"
          };
          return asyncRun(function () {
            collectionTester.dataUpdate(data);
          }).then(function () {
            expect(element.getAttribute("layout-type"), "The 'layout-type' attribute should equal 'vertical-scroll'.").to.equal("vertical-scroll");
            expect(element.getAttribute("horizontal-align"), "The 'horizontal-align' attribute should equal 'center'.").to.equal("center");
            expect(element.getAttribute("vertical-align"), "The 'vertical-align' attribute should equal 'stretch'.").to.equal("stretch");
          });
        });

        it("should update layout properties independently", function () {
          const data1 = { "layout-type-occurrences": "horizontal-scroll" };

          return asyncRun(function () {
            collectionTester.dataUpdate(data1);
          })
            .then(function () {
              expect(element.getAttribute("layout-type"), "The 'layout-type' attribute should equal 'horizontal-scroll' after first update.").to.equal("horizontal-scroll");
              const data2 = { "horizontal-align-occurrences": "end" };
              return asyncRun(function () {
                collectionTester.dataUpdate(data2);
              });
            })
            .then(function () {
              expect(element.getAttribute("layout-type"), "The 'layout-type' attribute should still equal 'horizontal-scroll' after second update.").to.equal("horizontal-scroll");
              expect(element.getAttribute("horizontal-align"), "The 'horizontal-align' attribute should equal 'end'.").to.equal("end");
            });
        });
      });

      describe("Custom CSS class", function () {
        it("should apply a custom CSS class", function () {
          return asyncRun(function () {
            collectionTester.dataUpdate({
              "class:class-test": true
            });
          }).then(function () {
            expect(element.classList.contains("class-test"), "Collection Layout should have custom class 'class-test'.").to.be.true;
          });
        });

        it("should remove a custom CSS class", function () {
          return asyncRun(function () {
            collectionTester.dataUpdate({
              "class:class-test": false
            });
          }).then(function () {
            expect(element.classList.contains("class-test"), "Collection Layout should not have custom class 'class-test'.").to.be.false;
          });
        });

        it("should apply multiple custom CSS classes simultaneously", function () {
          return asyncRun(function () {
            collectionTester.dataUpdate({
              "class:class-a": true,
              "class:class-b": true
            });
          }).then(function () {
            expect(element.classList.contains("class-a"), "Collection Layout should have custom class 'class-a'.").to.be.true;
            expect(element.classList.contains("class-b"), "Collection Layout should have custom class 'class-b'.").to.be.true;
          });
        });
      });
    });

    describe("OccurrenceLayout specific", function () {
      let element;
      let localOccurrenceTester;

      before(function () {
        return asyncRun(function () {
          resetWidgetContainer();
          const occurrenceSkeleton = createSkeleton(occurrenceWidgetId);
          localOccurrenceTester = new umockup.WidgetTester("UX.OccurrenceLayout", "uocc:UXENTITY.NOMODEL.1");
          localOccurrenceTester.createWidget(null, occurrenceSkeleton, mockEntityDef);
          element = localOccurrenceTester.element;
        }).then(function () {
          assert(element, "Widget top element is not defined!");
        });
      });

      it("should not update label properties on OccurrenceLayout", function () {
        const data = {
          "label-text": "Occurrence Label",
          "label-size": "large",
          "label-align": "center",
          "label-position": "below"
        };
        return asyncRun(function () {
          localOccurrenceTester.dataUpdate(data);
        }).then(function () {
          const labelElement = localOccurrenceTester.element.querySelector(":scope > span.u-label-text");
          expect(labelElement, "OccurrenceLayout should not have a '.u-label-text' element.").to.be.null;
        });
      });

      describe("Layout properties", function () {
        layoutTypes.forEach(function (layoutType) {
          it(`should update layout-type to ${layoutType}`, function () {
            const data = {
              "layout-type": layoutType
            };
            return asyncRun(function () {
              localOccurrenceTester.dataUpdate(data);
            }).then(function () {
              expect(localOccurrenceTester.element.getAttribute("layout-type"), `The 'layout-type' attribute should equal '${layoutType}'.`).to.equal(layoutType);
            });
          });
        });
        alignmentValues.forEach(function (alignment) {
          it(`should update horizontal-align to ${alignment}`, function () {
            const data = {
              "horizontal-align": alignment
            };
            return asyncRun(function () {
              localOccurrenceTester.dataUpdate(data);
            }).then(function () {
              expect(localOccurrenceTester.element.getAttribute("horizontal-align"), `The 'horizontal-align' attribute should equal '${alignment}'.`).to.equal(alignment);
            });
          });
        });

        alignmentValues.forEach(function (alignment) {
          it(`should update occurrence:vertical-align to ${alignment}`, function () {
            const data = {
              "vertical-align": alignment
            };
            return asyncRun(function () {
              localOccurrenceTester.dataUpdate(data);
            }).then(function () {
              expect(localOccurrenceTester.element.getAttribute("vertical-align"), `The 'vertical-align' attribute should equal '${alignment}'.`).to.equal(alignment);
            });
          });
        });
      });

      describe("Appearance property", function () {
        appearanceValues.forEach(function (appearance) {
          it(`should update appearance-occurrences to ${appearance}`, function () {
            const data = {
              "appearance-occurrences": appearance
            };
            return asyncRun(function () {
              localOccurrenceTester.dataUpdate(data);
            }).then(function () {
              expect(localOccurrenceTester.element.getAttribute("appearance"), `The 'appearance' attribute should equal '${appearance}'.`).to.equal(appearance);
            });
          });
        });

        ["outline", "card", "section", "panel"].forEach(function (appearance) {
          it(`should have border-radius and padding for appearance ${appearance}`, function () {
            const data = {
              "appearance-occurrences": appearance
            };
            return asyncRun(function () {
              localOccurrenceTester.dataUpdate(data);
            }).then(function () {
              const styles = window.getComputedStyle(element);
              expect(parseFloat(styles.borderRadius), `appearance '${appearance}' should have a non-zero border-radius.`).to.be.above(0);
              expect(parseFloat(styles.padding), `appearance '${appearance}' should have non-zero padding.`).to.be.above(0);
            });
          });
        });

        ["outline", "card", "panel"].forEach(function (appearance) {
          it(`should have border for appearance ${appearance}`, function () {
            const data = {
              "appearance-occurrences": appearance
            };
            return asyncRun(function () {
              localOccurrenceTester.dataUpdate(data);
            }).then(function () {
              const styles = window.getComputedStyle(element);

              expect(parseFloat(styles.borderWidth), `appearance '${appearance}' should have a non-zero border width.`).to.be.above(0);
              expect(styles.borderStyle, `appearance '${appearance}' should have a solid border style.`).to.equal("solid");
              expect(styles.borderColor, `appearance '${appearance}' should have a non-transparent border color.`).not.to.equal("transparent");
            });
          });
        });

        ["card", "section", "panel"].forEach(function (appearance) {
          it(`should have background-color for appearance ${appearance}`, function () {
            const data = {
              "appearance-occurrences": appearance
            };
            return asyncRun(function () {
              localOccurrenceTester.dataUpdate(data);
            }).then(function () {
              const styles = window.getComputedStyle(element);
              expect(styles.backgroundColor, `Appearance '${appearance}' should have a non-transparent background color.`).not.to.equal(
                "rgba(0, 0, 0, 0)"
              );
            });
          });
        });

        it("should have box-shadow for appearance card", function () {
          const data = {
            "appearance-occurrences": "card"
          };
          return asyncRun(function () {
            localOccurrenceTester.dataUpdate(data);
          }).then(function () {
            const styles = window.getComputedStyle(element);
            expect(styles.boxShadow, "appearance 'card' should have a box-shadow applied.").not.to.equal("none");
          });
        });

        ["transparent", "outline", "section", "panel"].forEach(function (appearance) {
          it(`should not have box-shadow for appearance ${appearance}`, function () {
            const data = { "appearance-occurrences": appearance };
            return asyncRun(function () {
              localOccurrenceTester.dataUpdate(data);
            }).then(function () {
              const styles = window.getComputedStyle(element);
              expect(styles.boxShadow, `appearance '${appearance}' should not have a box-shadow.`).to.equal("none");
            });
          });
        });

        it("should not have border, padding or background-color for appearance transparent", function () {
          const data = { "appearance-occurrences": "transparent" };
          return asyncRun(function () {
            localOccurrenceTester.dataUpdate(data);
          }).then(function () {
            const styles = window.getComputedStyle(element);
            expect(parseFloat(styles.borderWidth), "appearance 'transparent' should have no border.").to.equal(0);
            expect(styles.backgroundColor, "appearance 'transparent' should have a transparent background color.").to.equal("rgba(0, 0, 0, 0)");
            expect(parseFloat(styles.padding), "appearance 'transparent' should have no padding.").to.equal(0);
          });
        });

        it("should not have background-color for appearance outline", function () {
          const data = { "appearance-occurrences": "outline" };
          return asyncRun(function () {
            localOccurrenceTester.dataUpdate(data);
          }).then(function () {
            const styles = window.getComputedStyle(element);
            expect(styles.backgroundColor, "appearance 'outline' should have a transparent background color.").to.equal("rgba(0, 0, 0, 0)");
          });
        });

        it("should not have border for appearance section", function () {
          const data = { "appearance-occurrences": "section" };
          return asyncRun(function () {
            localOccurrenceTester.dataUpdate(data);
          }).then(function () {
            const styles = window.getComputedStyle(element);
            expect(parseFloat(styles.borderWidth), "appearance 'section' should have no border.").to.equal(0);
          });
        });
      });

      describe("Combined and independent property updates", function () {
        it("should apply multiple layout properties together for OccurrenceLayout", function () {
          const data = {
            "layout-type": "horizontal-wrap",
            "horizontal-align": "space-between",
            "vertical-align": "end"
          };
          return asyncRun(function () {
            localOccurrenceTester.dataUpdate(data);
          }).then(function () {
            expect(localOccurrenceTester.element.getAttribute("layout-type"), "The 'layout-type' attribute should equal 'horizontal-wrap'.").to.equal("horizontal-wrap");
            expect(localOccurrenceTester.element.getAttribute("horizontal-align"), "The 'horizontal-align' attribute should equal 'space-between'.").to.equal("space-between");
            expect(localOccurrenceTester.element.getAttribute("vertical-align"), "The 'vertical-align' attribute should equal 'end'.").to.equal("end");
          });
        });

        it("should update layout properties independently for OccurrenceLayout", function () {
          const data1 = { "layout-type": "horizontal-scroll" };

          return asyncRun(function () {
            localOccurrenceTester.dataUpdate(data1);
          })
            .then(function () {
              expect(localOccurrenceTester.element.getAttribute("layout-type"), "The 'layout-type' attribute should equal 'horizontal-scroll' after first update.").to.equal("horizontal-scroll");

              const data2 = { "horizontal-align": "end" };

              return asyncRun(function () {
                localOccurrenceTester.dataUpdate(data2);
              });
            })
            .then(function () {
              expect(localOccurrenceTester.element.getAttribute("layout-type"), "The 'layout-type' attribute should still equal 'horizontal-scroll' after second update.").to.equal("horizontal-scroll");
              expect(localOccurrenceTester.element.getAttribute("horizontal-align"), "The 'horizontal-align' attribute should equal 'end'.").to.equal("end");
            });
        });
      });

      describe("Custom CSS class", function () {

        it("should apply a custom CSS class", function () {
          return asyncRun(function () {
            localOccurrenceTester.dataUpdate({
              "class:class-test": true
            });
          }).then(function () {
            expect(element.classList.contains("class-test"), "Occurrence Layout should have custom class 'class-test'.").to.be.true;
          });
        });

        it("should remove a custom CSS class", function () {
          return asyncRun(function () {
            localOccurrenceTester.dataUpdate({
              "class:class-test": false
            });
          }).then(function () {
            expect(element.classList.contains("class-test"), "Occurrence Layout should not have custom class 'class-test'.").to.be.false;
          });
        });

        it("should apply multiple custom CSS classes simultaneously", function () {
          return asyncRun(function () {
            localOccurrenceTester.dataUpdate({
              "class:class-a": true,
              "class:class-b": true
            });
          }).then(function () {
            expect(element.classList.contains("class-a"), "Occurrence Layout should have custom class 'class-a'.").to.be.true;
            expect(element.classList.contains("class-b"), "Occurrence Layout should have custom class 'class-b'.").to.be.true;
          });
        });
      });
    });
  });

  describe("Entity Layout CSS Tests", function () {

    describe("CollectionLayout specific Layout Width Rules", function () {
      let collElement;

      describe("When u-coll-layout is the only child", function () {
        let localCompTester;

        before(function () {
          resetWidgetContainer();
          localCompTester = new umockup.WidgetTester("UX.CompLayout", componentWidgetId);
          const localCollectionTester = new umockup.WidgetTester("UX.CollectionLayout", collectionWidgetId);
          const componentSkeleton = createSkeleton(componentWidgetId);
          localCompTester.createWidget(null, componentSkeleton, mockComponentDef);
          localCollectionTester.createWidget(null, localCompTester.element.querySelector(`[id="${collectionWidgetId}"]`), mockEntityDef);
          collElement = localCollectionTester.element;
        });

        it("should set width 100% on u-coll-layout inside a vertical-scroll parent", function () {
          // u-coll-layout:only-child rule sets width: 100%.
          return asyncRun(function () {
            localCompTester.dataUpdate({ "layout-type": "vertical-scroll" });
          }).then(function () {
            const collWidth = collElement.clientWidth;
            const parentWidth = collElement.parentElement.clientWidth;
            const parentLeftPadding = parseInt(window.getComputedStyle(collElement.parentElement).paddingLeft);
            const parentRightPadding = parseInt(window.getComputedStyle(collElement.parentElement).paddingRight);
            const totalParentPadding = parentLeftPadding + parentRightPadding;
            const expectedCollWidth = parentWidth - totalParentPadding;
            expect(collWidth, "u-coll-layout width should equal parent width minus padding inside a vertical-scroll parent.").to.equal(expectedCollWidth);
          });
        });

        it("should set width 100% on u-coll-layout inside a vertical-wrap parent", function () {
          // u-coll-layout:only-child rule sets width: 100%.
          return asyncRun(function () {
            localCompTester.dataUpdate({ "layout-type": "vertical-wrap" });
          }).then(function () {
            const collWidth = collElement.clientWidth;
            const parentWidth = collElement.parentElement.clientWidth;
            const parentLeftPadding = parseInt(window.getComputedStyle(collElement.parentElement).paddingLeft);
            const parentRightPadding = parseInt(window.getComputedStyle(collElement.parentElement).paddingRight);
            const totalParentPadding = parentLeftPadding + parentRightPadding;
            const expectedCollWidth = parentWidth - totalParentPadding;
            expect(collWidth, "u-coll-layout width should equal parent width minus padding inside a vertical-wrap parent.").to.equal(expectedCollWidth);
          });
        });

        it("should set width 100% on u-coll-layout inside a horizontal-scroll parent", function () {
          // u-coll-layout:only-child rule sets width: 100%.
          return asyncRun(function () {
            localCompTester.dataUpdate({ "layout-type": "horizontal-scroll" });
          }).then(function () {
            const collWidth = collElement.clientWidth;
            const parentWidth = collElement.parentElement.clientWidth;
            const parentLeftPadding = parseInt(window.getComputedStyle(collElement.parentElement).paddingLeft);
            const parentRightPadding = parseInt(window.getComputedStyle(collElement.parentElement).paddingRight);
            const totalParentPadding = parentLeftPadding + parentRightPadding;
            const expectedCollWidth = parentWidth - totalParentPadding;
            expect(collWidth, "u-coll-layout width should equal parent width minus padding inside a horizontal-scroll parent.").to.equal(expectedCollWidth);
          });
        });

        it("should set width 100% on u-coll-layout inside a horizontal-wrap parent", function () {
          // u-coll-layout:only-child rule sets width: 100%.
          return asyncRun(function () {
            localCompTester.dataUpdate({ "layout-type": "horizontal-wrap" });
          }).then(function () {
            const collWidth = collElement.clientWidth;
            const parentWidth = collElement.parentElement.clientWidth;
            const parentLeftPadding = parseInt(window.getComputedStyle(collElement.parentElement).paddingLeft);
            const parentRightPadding = parseInt(window.getComputedStyle(collElement.parentElement).paddingRight);
            const totalParentPadding = parentLeftPadding + parentRightPadding;
            const expectedCollWidth = parentWidth - totalParentPadding;
            expect(collWidth, "u-coll-layout width should equal parent width minus padding inside a horizontal-wrap parent.").to.equal(expectedCollWidth);
          });
        });
      });

      describe("When u-coll-layout is not the only child", function () {
        let localCompTester;

        before(function () {
          resetWidgetContainer();
          localCompTester = new umockup.WidgetTester("UX.CompLayout", componentWidgetId);
          const localCollectionTester = new umockup.WidgetTester("UX.CollectionLayout", collectionWidgetId);
          const componentSkeleton = createSkeleton(componentWidgetId);
          localCompTester.createWidget(null, componentSkeleton, mockComponentDefWithTwoEntities);
          localCollectionTester.createWidget(null, localCompTester.element.querySelector(`[id="${collectionWidgetId}"]`), mockEntityDef);
          collElement = localCollectionTester.element;
        });

        it("should set width 100% on u-coll-layout inside a vertical-scroll parent", function () {
          return asyncRun(function () {
            localCompTester.dataUpdate({ "layout-type": "vertical-scroll" });
          }).then(function () {
            const collWidth = collElement.clientWidth;
            const parentWidth = collElement.parentElement.clientWidth;
            const parentLeftPadding = parseInt(window.getComputedStyle(collElement.parentElement).paddingLeft);
            const parentRightPadding = parseInt(window.getComputedStyle(collElement.parentElement).paddingRight);
            const totalParentPadding = parentLeftPadding + parentRightPadding;
            const expectedCollWidth = parentWidth - totalParentPadding;
            expect(collWidth, "u-coll-layout width should equal parent width minus padding inside a vertical-scroll parent.").to.equal(expectedCollWidth);
          });
        });

        it("should set width 100% on u-coll-layout inside a vertical-wrap parent", function () {
          return asyncRun(function () {
            localCompTester.dataUpdate({ "layout-type": "vertical-wrap" });
          }).then(function () {
            const collWidth = collElement.clientWidth;
            const parentWidth = collElement.parentElement.clientWidth;
            const parentLeftPadding = parseInt(window.getComputedStyle(collElement.parentElement).paddingLeft);
            const parentRightPadding = parseInt(window.getComputedStyle(collElement.parentElement).paddingRight);
            const totalParentPadding = parentLeftPadding + parentRightPadding;
            const expectedCollWidth = parentWidth - totalParentPadding;
            expect(collWidth, "u-coll-layout width should equal parent width minus padding inside a vertical-wrap parent.").to.equal(expectedCollWidth);
          });
        });

        it("should not set width 100% on u-coll-layout inside a horizontal-scroll parent", function () {
          return asyncRun(function () {
            localCompTester.dataUpdate({ "layout-type": "horizontal-scroll" });
          }).then(function () {
            const collWidth = collElement.clientWidth;
            const parentWidth = collElement.parentElement.clientWidth;
            const parentLeftPadding = parseInt(window.getComputedStyle(collElement.parentElement).paddingLeft);
            const parentRightPadding = parseInt(window.getComputedStyle(collElement.parentElement).paddingRight);
            const totalParentPadding = parentLeftPadding + parentRightPadding;
            const expectedCollWidth = parentWidth - totalParentPadding;
            expect(collWidth, "u-coll-layout width should not equal parent width minus padding inside a horizontal-scroll parent when not the only child.").not.to.equal(expectedCollWidth);
          });
        });

        it("should not set width 100% on u-coll-layout inside a horizontal-wrap parent", function () {
          return asyncRun(function () {
            localCompTester.dataUpdate({ "layout-type": "horizontal-wrap" });
          }).then(function () {
            const collWidth = collElement.clientWidth;
            const parentWidth = collElement.parentElement.clientWidth;
            const parentLeftPadding = parseInt(window.getComputedStyle(collElement.parentElement).paddingLeft);
            const parentRightPadding = parseInt(window.getComputedStyle(collElement.parentElement).paddingRight);
            const totalParentPadding = parentLeftPadding + parentRightPadding;
            const expectedCollWidth = parentWidth - totalParentPadding;
            expect(collWidth, "u-coll-layout width should not equal parent width minus padding inside a horizontal-wrap parent when not the only child.").not.to.equal(expectedCollWidth);
          });
        });
      });
    });

    describe("OccurrenceLayout specific Layout Width Rules", function () {
      let occElement;

      describe("When u-occ-layout is the only child", function () {
        let localCollectionTester;

        before(function () {
          resetWidgetContainer();
          localCollectionTester = new umockup.WidgetTester("UX.CollectionLayout", collectionWidgetId);
          const localOccurrenceTester = new umockup.WidgetTester("UX.OccurrenceLayout", occurrenceWidgetId);
          const collectionSkeleton = createSkeleton(collectionWidgetId);
          localCollectionTester.createWidget(null, collectionSkeleton, mockEntityDef);
          localOccurrenceTester.createWidget(null, localCollectionTester.element.querySelector(`[id="${occurrenceWidgetId}"]`), mockEntityDef);
          occElement = localOccurrenceTester.element;
        });

        it("should set width 100% on u-occ-layout inside a vertical-scroll parent", function () {
          // .u-occ-layout:only-of-type rule sets width: 100%.
          return asyncRun(function () {
            localCollectionTester.dataUpdate({ "layout-type-occurrences": "vertical-scroll" });
          }).then(function () {
            const occWidth = occElement.clientWidth;
            const parentWidth = occElement.parentElement.clientWidth;
            const parentLeftPadding = parseInt(window.getComputedStyle(occElement.parentElement).paddingLeft);
            const parentRightPadding = parseInt(window.getComputedStyle(occElement.parentElement).paddingRight);
            const totalParentPadding = parentLeftPadding + parentRightPadding;
            const expectedOccWidth = parentWidth - totalParentPadding;
            expect(occWidth, "u-occ-layout width should equal parent width minus padding inside a vertical-scroll parent.").to.equal(expectedOccWidth);
          });
        });

        it("should set width 100% on u-occ-layout inside a vertical-wrap parent", function () {
          // .u-occ-layout:only-of-type rule sets width: 100%.
          return asyncRun(function () {
            localCollectionTester.dataUpdate({ "layout-type-occurrences": "vertical-wrap" });
          }).then(function () {
            const occWidth = occElement.clientWidth;
            const parentWidth = occElement.parentElement.clientWidth;
            const parentLeftPadding = parseInt(window.getComputedStyle(occElement.parentElement).paddingLeft);
            const parentRightPadding = parseInt(window.getComputedStyle(occElement.parentElement).paddingRight);
            const totalParentPadding = parentLeftPadding + parentRightPadding;
            const expectedOccWidth = parentWidth - totalParentPadding;
            expect(occWidth, "u-occ-layout width should equal parent width minus padding inside a vertical-wrap parent.").to.equal(expectedOccWidth);
          });
        });

        it("should set width 100% on u-occ-layout inside a horizontal-scroll parent", function () {
          // .u-occ-layout:only-of-type rule sets width: 100%.
          return asyncRun(function () {
            localCollectionTester.dataUpdate({ "layout-type-occurrences": "horizontal-scroll" });
          }).then(function () {
            const occWidth = occElement.clientWidth;
            const parentWidth = occElement.parentElement.clientWidth;
            const parentLeftPadding = parseInt(window.getComputedStyle(occElement.parentElement).paddingLeft);
            const parentRightPadding = parseInt(window.getComputedStyle(occElement.parentElement).paddingRight);
            const totalParentPadding = parentLeftPadding + parentRightPadding;
            const expectedOccWidth = parentWidth - totalParentPadding;
            expect(occWidth, "u-occ-layout width should equal parent width minus padding inside a horizontal-scroll parent.").to.equal(expectedOccWidth);
          });
        });

        it("should set width 100% on u-occ-layout inside a horizontal-wrap parent", function () {
          // .u-occ-layout:only-of-type rule sets width: 100%.
          return asyncRun(function () {
            localCollectionTester.dataUpdate({ "layout-type-occurrences": "horizontal-wrap" });
          }).then(function () {
            const occWidth = occElement.clientWidth;
            const parentWidth = occElement.parentElement.clientWidth;
            const parentLeftPadding = parseInt(window.getComputedStyle(occElement.parentElement).paddingLeft);
            const parentRightPadding = parseInt(window.getComputedStyle(occElement.parentElement).paddingRight);
            const totalParentPadding = parentLeftPadding + parentRightPadding;
            const expectedOccWidth = parentWidth - totalParentPadding;
            expect(occWidth, "u-occ-layout width should equal parent width minus padding inside a horizontal-wrap parent.").to.equal(expectedOccWidth);
          });
        });
      });

      describe("When u-occ-layout is not the only occurrence", function () {
        let localCollectionTester;

        before(function () {
          resetWidgetContainer();
          localCollectionTester = new umockup.WidgetTester("UX.CollectionLayout", collectionWidgetId);
          const localOccurrenceTester = new umockup.WidgetTester("UX.OccurrenceLayout", occurrenceWidgetId);
          const collectionSkeleton = createSkeleton(collectionWidgetId);
          localCollectionTester.createWidget(null, collectionSkeleton, mockEntityDefWithMultipleOccs);
          localOccurrenceTester.createWidget(null, localCollectionTester.element.querySelector(`[id="${occurrenceWidgetId}"]`), mockEntityDefWithMultipleOccs);
          occElement = localOccurrenceTester.element;
        });

        it("should set width 100% on u-occ-layout inside a vertical-scroll parent", function () {
          return asyncRun(function () {
            localCollectionTester.dataUpdate({ "layout-type-occurrences": "vertical-scroll" });
          }).then(function () {
            const occWidth = occElement.clientWidth;
            const parentWidth = occElement.parentElement.clientWidth;
            const parentLeftPadding = parseInt(window.getComputedStyle(occElement.parentElement).paddingLeft);
            const parentRightPadding = parseInt(window.getComputedStyle(occElement.parentElement).paddingRight);
            const totalParentPadding = parentLeftPadding + parentRightPadding;
            const expectedOccWidth = parentWidth - totalParentPadding;
            expect(occWidth, "u-occ-layout width should equal parent width minus padding inside a vertical-scroll parent.").to.equal(expectedOccWidth);
          });
        });

        it("should set width 100% on u-occ-layout inside a vertical-wrap parent", function () {
          return asyncRun(function () {
            localCollectionTester.dataUpdate({ "layout-type-occurrences": "vertical-wrap" });
          }).then(function () {
            const occWidth = occElement.clientWidth;
            const parentWidth = occElement.parentElement.clientWidth;
            const parentLeftPadding = parseInt(window.getComputedStyle(occElement.parentElement).paddingLeft);
            const parentRightPadding = parseInt(window.getComputedStyle(occElement.parentElement).paddingRight);
            const totalParentPadding = parentLeftPadding + parentRightPadding;
            const expectedOccWidth = parentWidth - totalParentPadding;
            expect(occWidth, "u-occ-layout width should equal parent width minus padding inside a vertical-wrap parent.").to.equal(expectedOccWidth);
          });
        });

        it("should not set width 100% on u-occ-layout inside a horizontal-scroll parent", function () {
          return asyncRun(function () {
            localCollectionTester.dataUpdate({ "layout-type-occurrences": "horizontal-scroll" });
          }).then(function () {
            const occWidth = occElement.clientWidth;
            const parentWidth = occElement.parentElement.clientWidth;
            const parentLeftPadding = parseInt(window.getComputedStyle(occElement.parentElement).paddingLeft);
            const parentRightPadding = parseInt(window.getComputedStyle(occElement.parentElement).paddingRight);
            const totalParentPadding = parentLeftPadding + parentRightPadding;
            const expectedOccWidth = parentWidth - totalParentPadding;
            expect(occWidth, "u-occ-layout width should not equal parent width minus padding inside a horizontal-scroll parent when not the only occurrence.").not.to.equal(expectedOccWidth);
          });
        });

        it("should not set width 100% on u-occ-layout inside a horizontal-wrap parent", function () {
          return asyncRun(function () {
            localCollectionTester.dataUpdate({ "layout-type-occurrences": "horizontal-wrap" });
          }).then(function () {
            const occWidth = occElement.clientWidth;
            const parentWidth = occElement.parentElement.clientWidth;
            const parentLeftPadding = parseInt(window.getComputedStyle(occElement.parentElement).paddingLeft);
            const parentRightPadding = parseInt(window.getComputedStyle(occElement.parentElement).paddingRight);
            const totalParentPadding = parentLeftPadding + parentRightPadding;
            const expectedOccWidth = parentWidth - totalParentPadding;
            expect(occWidth, "u-occ-layout width should not equal parent width minus padding inside a horizontal-wrap parent when not the only occurrence.").not.to.equal(expectedOccWidth);
          });
        });
      });
    });
  });

  describe("Stretchable behavior in uf-layout", function () {

    describe("When a uf-layout has stretchable direct children", function () {
      let localOccurrenceTester;
      let stretchableTesters;
      before(function () {
        resetWidgetContainer();
        const mockEntityDef = {
          "nm": "UXENTITY.NOMODEL",
          "type": "entity",
          "widget_class": "UX.CollectionLayout",
          "occs": {
            "#2": {
              "type": "occurrence",
              "#3": {
                "nm": "TEXTFIELD.ENT.NOMODEL",
                "type": "field",
                "widget_class": "UX.TextField",
                "properties": { "html:type": "text" },
                "id": "#3"
              },
              "#4": {
                "nm": "TEXTAREA.ENT.NOMODEL",
                "type": "field",
                "widget_class": "UX.TextArea",
                "properties": {},
                "id": "#4"
              },
              "#6": {
                "nm": "BUTTON.ENT.NOMODEL",
                "type": "field",
                "widget_class": "UX.Button",
                "properties": {},
                "id": "#6"
              },
              "#7": {
                "nm": "NUMBERFIELD.ENT.NOMODEL",
                "type": "field",
                "widget_class": "UX.NumberField",
                "properties": {},
                "id": "#7"
              },
              "#10": {
                "nm": "SELECT.ENT.NOMODEL",
                "type": "field",
                "widget_class": "UX.Select",
                "properties": {},
                "id": "#10"
              },
              "widget_class": "UX.OccurrenceLayout"
            }
          },
          "properties": {},
          "id": "#2",
          "hasNEDFields": true,
          "ownsNEDFields": true
        };
        stretchableTesters = [
          new umockup.WidgetTester("UX.TextField", "ufld:TEXTFIELD.ENT.NOMODEL"),
          new umockup.WidgetTester("UX.TextArea", "ufld:TEXTAREA.ENT.NOMODEL"),
          new umockup.WidgetTester("UX.Button", "ufld:BUTTON.ENT.NOMODEL"),
          new umockup.WidgetTester("UX.NumberField", "ufld:NUMBERFIELD.ENT.NOMODEL"),
          new umockup.WidgetTester("UX.Select", "ufld:SELECT.ENT.NOMODEL")
        ];
        localOccurrenceTester = new umockup.WidgetTester("UX.OccurrenceLayout", "uocc:UXENTITY.NOMODEL.3");
        const occurrenceSkeleton = createSkeleton("uocc:UXENTITY.NOMODEL.3");
        localOccurrenceTester.createWidget(null, occurrenceSkeleton, mockEntityDef);
        stretchableTesters.forEach(function (tester) {
          tester.createWidget(null, localOccurrenceTester.element.querySelector(`[id="${tester.widgetId}"]`), null);
        });
        localOccurrenceTester.dataUpdate({
          "layout-type": "horizontal-scroll",
          "horizontal-align": "stretch"
        });
      });

      it("should apply flex-grow to parent uf-layout", function () {
        expect(window.getComputedStyle(localOccurrenceTester.element).flexGrow, "Parent uf-layout should have flex-grow: 1 when it has stretchable direct children.").to.equal("1");
      });

      it("should apply flex-grow to stretchable direct child such as text-field, text-area, button, number-field and select of uf-layout", function () {
        stretchableTesters.forEach(function (tester) {
          expect(window.getComputedStyle(tester.element).flexGrow, `Stretchable child '${tester.widgetName}' should have flex-grow: 1 as a direct child of uf-layout.`).to.equal("1");
        });
      });
    });

    describe("When a uf-layout has non-stretchable direct children", function () {
      let localOccurrenceTester;
      let nonStretchableTesters;
      before(function () {
        resetWidgetContainer();
        const mockEntityDef = {
          "nm": "UXENTITY.NOMODEL",
          "type": "entity",
          "widget_class": "UX.CollectionLayout",
          "occs": {
            "#2": {
              "type": "occurrence",
              "#5": {
                "nm": "PLAINTEXT.ENT.NOMODEL",
                "type": "field",
                "widget_class": "UX.PlainText",
                "properties": {},
                "id": "#5"
              },
              "#8": {
                "nm": "CHECKBOX.ENT.NOMODEL",
                "type": "field",
                "widget_class": "UX.Checkbox",
                "properties": {},
                "id": "#8"
              },
              "#9": {
                "nm": "SWITCH.ENT.NOMODEL",
                "type": "field",
                "widget_class": "UX.Switch",
                "properties": {},
                "id": "#9"
              },
              "#11": {
                "nm": "LISTBOX.ENT.NOMODEL",
                "type": "field",
                "widget_class": "UX.Listbox",
                "properties": {},
                "id": "#11"
              },
              "#12": {
                "nm": "RADIOGROUP.ENT.NOMODEL",
                "type": "field",
                "widget_class": "UX.RadioGroup",
                "properties": {},
                "id": "#12"
              },
              "widget_class": "UX.OccurrenceLayout"
            }
          },
          "properties": {},
          "id": "#2",
          "hasNEDFields": true,
          "ownsNEDFields": true
        };
        nonStretchableTesters = [
          new umockup.WidgetTester("UX.PlainText", "ufld:PLAINTEXT.ENT.NOMODEL"),
          new umockup.WidgetTester("UX.Checkbox", "ufld:CHECKBOX.ENT.NOMODEL"),
          new umockup.WidgetTester("UX.Switch", "ufld:SWITCH.ENT.NOMODEL"),
          new umockup.WidgetTester("UX.Listbox", "ufld:LISTBOX.ENT.NOMODEL"),
          new umockup.WidgetTester("UX.RadioGroup", "ufld:RADIOGROUP.ENT.NOMODEL")
        ];
        localOccurrenceTester = new umockup.WidgetTester("UX.OccurrenceLayout", "uocc:UXENTITY.NOMODEL.3");
        const occurrenceSkeleton = createSkeleton("uocc:UXENTITY.NOMODEL.3");
        localOccurrenceTester.createWidget(null, occurrenceSkeleton, mockEntityDef);
        localOccurrenceTester.dataUpdate({
          "layout-type": "horizontal-scroll",
          "horizontal-align": "stretch"
        });
        nonStretchableTesters.forEach(function (tester) {
          tester.createWidget(null, localOccurrenceTester.element.querySelector(`[id="${tester.widgetId}"]`), null);
        });
      });

      it("should not apply flex-grow to parent uf-layout", function () {
        expect(window.getComputedStyle(localOccurrenceTester.element).flexGrow, "Parent uf-layout should have flex-grow: 0 when all direct children are non-stretchable.").to.equal("0");
      });

      it("should not apply flex-grow to stretchable direct child such as plaintext, checkbox, switch, listbox and radio-group of uf-layout", function () {
        return asyncRun(function () {}).then(function () {
          nonStretchableTesters.forEach(function (tester) {
            expect(window.getComputedStyle(tester.element).flexGrow, `Non-stretchable child '${tester.widgetName}' should have flex-grow: 0 as a direct child of uf-layout.`).to.equal("0");
          });
        });
      });

      it("should retain natural offsetWidth for each non-stretchable child when horizontal-align is stretch", function () {
        const widthsWithStretch = nonStretchableTesters.map(function (tester) {
          return tester.element.offsetWidth;
        });
        return asyncRun(function () {
          localOccurrenceTester.dataUpdate({ "horizontal-align": "auto" });
        }).then(function () {
          nonStretchableTesters.forEach(function (tester, i) {
            expect(widthsWithStretch[i], `'${tester.widgetName}' offsetWidth should be unchanged by horizontal-align stretch (retains natural width).`).to.equal(tester.element.offsetWidth);
          });
        });
      });
    });

    describe("When the sole direct child of a u-occ-layout with u-jc-stretch is a non-stretchable control", function () {
      [
        {
          "widgetClass": "UX.Switch",
          "nm": "SWITCH.ENT.NOMODEL",
          "fieldId": "#9"
        },
        {
          "widgetClass": "UX.Checkbox",
          "nm": "CHECKBOX.ENT.NOMODEL",
          "fieldId": "#8"
        },
        {
          "widgetClass": "UX.RadioGroup",
          "nm": "RADIOGROUP.ENT.NOMODEL",
          "fieldId": "#12"
        },
        {
          "widgetClass": "UX.PlainText",
          "nm": "PLAINTEXT.ENT.NOMODEL",
          "fieldId": "#5"
        },
        {
          "widgetClass": "UX.Listbox",
          "nm": "LISTBOX.ENT.NOMODEL",
          "fieldId": "#11"
        }
      ].forEach(function ({ widgetClass, nm, fieldId }) {
        describe(`When the sole child is ${widgetClass}`, function () {
          let localOccurrenceTester;

          before(function () {
            resetWidgetContainer();
            const mockEntityDef = {
              "nm": "UXENTITY.NOMODEL",
              "type": "entity",
              "widget_class": "UX.CollectionLayout",
              "occs": {
                "#2": {
                  "type": "occurrence",
                  [fieldId]: {
                    "nm": nm,
                    "type": "field",
                    "widget_class": widgetClass,
                    "properties": {},
                    "id": fieldId
                  },
                  "widget_class": "UX.OccurrenceLayout"
                }
              },
              "properties": {},
              "id": "#2",
              "hasNEDFields": true,
              "ownsNEDFields": true
            };
            localOccurrenceTester = new umockup.WidgetTester("UX.OccurrenceLayout", "uocc:UXENTITY.NOMODEL.3");
            const occurrenceSkeleton = createSkeleton("uocc:UXENTITY.NOMODEL.3");
            localOccurrenceTester.createWidget(null, occurrenceSkeleton, mockEntityDef);
            const childTester = new umockup.WidgetTester(widgetClass, `ufld:${nm}`);
            childTester.createWidget(null, localOccurrenceTester.element.querySelector(`[id="${childTester.widgetId}"]`), null);
            localOccurrenceTester.dataUpdate({
              "layout-type": "horizontal-scroll",
              "horizontal-align": "stretch"
            });
          });

          it("should have flex-grow 0 on u-occ-layout despite u-jc-stretch because the :has() rule does not match a non-stretchable sole child", function () {
            expect(localOccurrenceTester.element.classList.contains("u-jc-stretch"),
              `u-occ-layout should have u-jc-stretch when horizontal-align is stretch (sole child is '${widgetClass}').`).to.be.true;
            expect(window.getComputedStyle(localOccurrenceTester.element).flexGrow, `u-occ-layout flex-grow should be 0 when the sole child is the non-stretchable '${widgetClass}', overriding u-jc-stretch via the :has() rule.`).to.equal("0");
          });
        });
      });
    });

    describe("When a uf-layout has nested uf-layout", function () {
      let localOccurrenceTester;
      let nestedEntityTester;
      beforeEach(function () {
        resetWidgetContainer();
        const mockEntityDef = {
          "nm": "UXENTITY.NOMODEL",
          "type": "entity",
          "widget_class": "UX.CollectionLayout",
          "occs": {
            "#2": {
              "type": "occurrence",
              "#3": {
                "nm": "TEXTFIELD.ENT.NOMODEL",
                "type": "field",
                "widget_class": "UX.TextField",
                "properties": { "html:type": "text" },
                "id": "#3"
              },
              "#13": {
                "nm": "NESTED.ENT.NOMODEL",
                "type": "entity",
                "widget_class": "UX.CollectionLayout",
                "occs": {
                  "#14": {
                    "type": "occurrence",
                    "#15": {
                      "nm": "TEXTFIELD.NESTED.ENT.NOMODEL",
                      "type": "field",
                      "widget_class": "UX.TextField",
                      "properties": { "html:type": "text" },
                      "id": "#15"
                    },
                    "widget_class": "UX.OccurrenceLayout"
                  }
                },
                "properties": {},
                "id": "#13"
              },
              "widget_class": "UX.OccurrenceLayout"
            }
          },
          "properties": {},
          "id": "#2",
          "hasNEDFields": true,
          "ownsNEDFields": true
        };
        localOccurrenceTester = new umockup.WidgetTester("UX.OccurrenceLayout", "uocc:UXENTITY.NOMODEL.3");
        const occurrenceSkeleton = createSkeleton("uocc:UXENTITY.NOMODEL.3");
        localOccurrenceTester.createWidget(null, occurrenceSkeleton, mockEntityDef);
        nestedEntityTester = new umockup.WidgetTester("UX.CollectionLayout", "uent:NESTED.ENT.NOMODEL");
        const nestedEntitySkeleton = localOccurrenceTester.element.querySelector(`[id="${nestedEntityTester.widgetId}"]`);
        nestedEntityTester.createWidget(null, nestedEntitySkeleton, mockEntityDef.occs["#2"]["#13"]);
        localOccurrenceTester.dataUpdate({
          "layout-type": "horizontal-scroll",
          "horizontal-align": "stretch"
        });
      });

      it("should apply flex-grow to the parent uf-layout when its direct child nested uf-layout has stretch alignment", function () {
        // horizontal-align-occurrences sets .u-jc-stretch on the CollectionLayout element,
        // which makes localOccurrenceTester match uf-layout:has(> uf-layout:is(.u-jc-stretch)).
        nestedEntityTester.dataUpdate({
          "layout-type-occurrences": "horizontal-scroll",
          "horizontal-align-occurrences": "stretch"
        });

        // uf-layout:has(> uf-layout:is(.u-jc-stretch)) matches localOccurrenceTester it gets flex-grow
        expect(window.getComputedStyle(localOccurrenceTester.element).flexGrow, "Parent uf-layout should have flex-grow: 1 when its direct child nested uf-layout has stretch alignment.").to.equal("1");
      });

      it("should not apply flex-grow to nested uf-layout child without alignment/justify stretch class", function () {
        expect(window.getComputedStyle(nestedEntityTester.element).flexGrow, "Nested uf-layout child should have flex-grow: 0 when it has no stretch alignment or justify class.").to.equal("0");
      });
    });

    describe("When a CollectionLayout has an OccurrenceLayout child with stretchable widgets", function () {
      let localCollectionTester;
      let localOccurrenceTester;
      let stretchFieldTester;

      before(function () {
        resetWidgetContainer();
        const entityDef = {
          "nm": "UXENTITY.NOMODEL",
          "type": "entity",
          "widget_class": "UX.CollectionLayout",
          "occs": {
            "#2": {
              "type": "occurrence",
              "#3": {
                "nm": "TEXTFIELD.ENT.NOMODEL",
                "type": "field",
                "widget_class": "UX.TextField",
                "properties": { "html:type": "text" },
                "id": "#3"
              },
              "widget_class": "UX.OccurrenceLayout"
            }
          },
          "properties": {},
          "id": "#2",
          "hasNEDFields": true,
          "ownsNEDFields": true
        };
        localCollectionTester = new umockup.WidgetTester("UX.CollectionLayout", collectionWidgetId);
        const collectionSkeleton = createSkeleton(collectionWidgetId);
        localCollectionTester.createWidget(null, collectionSkeleton, entityDef);
        localOccurrenceTester = new umockup.WidgetTester("UX.OccurrenceLayout", occurrenceWidgetId);
        localOccurrenceTester.createWidget(null, localCollectionTester.element.querySelector(`[id="${occurrenceWidgetId}"]`), entityDef);
        stretchFieldTester = new umockup.WidgetTester("UX.TextField", "ufld:TEXTFIELD.ENT.NOMODEL");
        stretchFieldTester.createWidget(null, localOccurrenceTester.element.querySelector(`[id="${stretchFieldTester.widgetId}"]`), null);
        localOccurrenceTester.dataUpdate({
          "layout-type": "horizontal-scroll",
          "horizontal-align": "stretch"
        });
        localCollectionTester.dataUpdate({
          "layout-type-occurrences": "horizontal-scroll",
          "horizontal-align-occurrences": "stretch"
        });
      });

      it("should apply flex-grow to the CollectionLayout when its OccurrenceLayout child has stretchable direct children", function () {
        // uf-layout:has(> uf-layout > .u-stretchable) matches CollectionLayout gets flex-grow
        expect(window.getComputedStyle(localCollectionTester.element).flexGrow, "CollectionLayout should have flex-grow: 1 when its OccurrenceLayout child has stretchable direct children.").to.equal("1");
      });
    });

    describe("When a uf-layout has both stretchable and non-stretchable direct children", function () {
      let localOccurrenceTester;
      let textFieldTester;
      let switchTester;

      before(function () {
        resetWidgetContainer();
        const mockEntityDef = {
          "nm": "UXENTITY.NOMODEL",
          "type": "entity",
          "widget_class": "UX.CollectionLayout",
          "occs": {
            "#2": {
              "type": "occurrence",
              "#3": {
                "nm": "TEXTFIELD.ENT.NOMODEL",
                "type": "field",
                "widget_class": "UX.TextField",
                "properties": { "html:type": "text" },
                "id": "#3"
              },
              "#9": {
                "nm": "SWITCH.ENT.NOMODEL",
                "type": "field",
                "widget_class": "UX.Switch",
                "properties": {},
                "id": "#9"
              },
              "widget_class": "UX.OccurrenceLayout"
            }
          },
          "properties": {},
          "id": "#2",
          "hasNEDFields": true,
          "ownsNEDFields": true
        };
        textFieldTester = new umockup.WidgetTester("UX.TextField", "ufld:TEXTFIELD.ENT.NOMODEL");
        switchTester = new umockup.WidgetTester("UX.Switch", "ufld:SWITCH.ENT.NOMODEL");
        localOccurrenceTester = new umockup.WidgetTester("UX.OccurrenceLayout", "uocc:UXENTITY.NOMODEL.3");
        const occurrenceSkeleton = createSkeleton("uocc:UXENTITY.NOMODEL.3");
        localOccurrenceTester.createWidget(null, occurrenceSkeleton, mockEntityDef);
        textFieldTester.createWidget(null, localOccurrenceTester.element.querySelector(`[id="${textFieldTester.widgetId}"]`), null);
        switchTester.createWidget(null, localOccurrenceTester.element.querySelector(`[id="${switchTester.widgetId}"]`), null);
        localOccurrenceTester.dataUpdate({
          "layout-type": "horizontal-scroll",
          "horizontal-align": "stretch"
        });
      });

      it("should apply flex-grow to the parent when at least one direct child is stretchable", function () {
        expect(window.getComputedStyle(localOccurrenceTester.element).flexGrow, "Parent uf-layout should have flex-grow: 1 when at least one direct child is stretchable.").to.equal("1");
      });

      it("should apply flex-grow to the stretchable child but not the non-stretchable sibling", function () {
        expect(window.getComputedStyle(textFieldTester.element).flexGrow, "Stretchable text-field should have flex-grow: 1 as a direct child of uf-layout.").to.equal("1");
        expect(window.getComputedStyle(switchTester.element).flexGrow, "Non-stretchable switch sibling should have flex-grow: 0 as a direct child of uf-layout.").to.equal("0");
      });
    });

    describe("When a .u-stretchable element is nested inside a non-stretchable widget", function () {
      let localOccurrenceTester;
      let switchTester;

      before(function () {
        resetWidgetContainer();
        const mockEntityDef = {
          "nm": "UXENTITY.NOMODEL",
          "type": "entity",
          "widget_class": "UX.CollectionLayout",
          "occs": {
            "#2": {
              "type": "occurrence",
              "#9": {
                "nm": "SWITCH.ENT.NOMODEL",
                "type": "field",
                "widget_class": "UX.Switch",
                "properties": {},
                "id": "#9"
              },
              "widget_class": "UX.OccurrenceLayout"
            }
          },
          "properties": {},
          "id": "#2",
          "hasNEDFields": true,
          "ownsNEDFields": true
        };
        switchTester = new umockup.WidgetTester("UX.Switch", "ufld:SWITCH.ENT.NOMODEL");
        localOccurrenceTester = new umockup.WidgetTester("UX.OccurrenceLayout", "uocc:UXENTITY.NOMODEL.3");
        const occurrenceSkeleton = createSkeleton("uocc:UXENTITY.NOMODEL.3");
        localOccurrenceTester.createWidget(null, occurrenceSkeleton, mockEntityDef);
        switchTester.createWidget(null, localOccurrenceTester.element.querySelector(`[id="${switchTester.widgetId}"]`), null);
        // Manually nest a .u-stretchable element inside the Switch's host element.
        // The CSS uses the direct child combinator (uf-layout > .u-stretchable), so
        // an element nested inside the Switch host must not trigger flex-grow on uf-layout.
        const nestedStretchable = document.createElement("span");
        nestedStretchable.classList.add("u-stretchable");
        switchTester.element.appendChild(nestedStretchable);
        localOccurrenceTester.dataUpdate({
          "layout-type": "horizontal-scroll",
          "horizontal-align": "stretch"
        });
      });

      it("should not apply flex-grow to the parent uf-layout when .u-stretchable is nested inside a widget, not a direct child of uf-layout", function () {
        // The direct child selector uf-layout > .u-stretchable does not reach elements
        // nested inside another widget element.
        expect(window.getComputedStyle(localOccurrenceTester.element).flexGrow, "Parent uf-layout should have flex-grow: 0 when .u-stretchable is nested inside a widget, not a direct child of uf-layout.").to.equal("0");
      });
    });

    describe("When the u-stretchable class is added or removed dynamically", function () {
      let localOccurrenceTester;
      let textFieldTester;

      beforeEach(function () {
        resetWidgetContainer();
        const mockEntityDef = {
          "nm": "UXENTITY.NOMODEL",
          "type": "entity",
          "widget_class": "UX.CollectionLayout",
          "occs": {
            "#2": {
              "type": "occurrence",
              "#3": {
                "nm": "TEXTFIELD.ENT.NOMODEL",
                "type": "field",
                "widget_class": "UX.TextField",
                "properties": { "html:type": "text" },
                "id": "#3"
              },
              "widget_class": "UX.OccurrenceLayout"
            }
          },
          "properties": {},
          "id": "#2",
          "hasNEDFields": true,
          "ownsNEDFields": true
        };
        textFieldTester = new umockup.WidgetTester("UX.TextField", "ufld:TEXTFIELD.ENT.NOMODEL");
        localOccurrenceTester = new umockup.WidgetTester("UX.OccurrenceLayout", "uocc:UXENTITY.NOMODEL.3");
        const occurrenceSkeleton = createSkeleton("uocc:UXENTITY.NOMODEL.3");
        localOccurrenceTester.createWidget(null, occurrenceSkeleton, mockEntityDef);
        textFieldTester.createWidget(null, localOccurrenceTester.element.querySelector(`[id="${textFieldTester.widgetId}"]`), null);
        localOccurrenceTester.dataUpdate({
          "layout-type": "horizontal-scroll",
          "horizontal-align": "stretch"
        });
      });

      it("should lose flex-grow on the parent after removing u-stretchable from the only stretchable child", function () {
        expect(window.getComputedStyle(localOccurrenceTester.element).flexGrow, "Before removal: parent should grow").to.equal("1");
        textFieldTester.element.classList.remove("u-stretchable");
        expect(window.getComputedStyle(localOccurrenceTester.element).flexGrow, "After removal: parent should no longer grow").to.equal("0");
      });

      it("should gain flex-grow on the parent after adding u-stretchable to a non-stretchable child", function () {
        return asyncRun(function () {
          textFieldTester.element.classList.remove("u-stretchable");
        }).then(function () {
          expect(window.getComputedStyle(localOccurrenceTester.element).flexGrow, "Before addition: parent should not grow").to.equal("0");
          textFieldTester.element.classList.add("u-stretchable");
          expect(window.getComputedStyle(localOccurrenceTester.element).flexGrow, "After addition: parent should grow").to.equal("1");
        });
      });
    });

    describe("When the layout type is vertical with horizontal-align stretch, flex-grow is suppressed for all stretchable children", function () {
      let localOccurrenceTester;
      let stretchableTesters;

      before(function () {
        resetWidgetContainer();
        const entityDef = {
          "nm": "UXENTITY.NOMODEL",
          "type": "entity",
          "widget_class": "UX.CollectionLayout",
          "occs": {
            "#2": {
              "type": "occurrence",
              "#3": {
                "nm": "TEXTFIELD.ENT.NOMODEL",
                "type": "field",
                "widget_class": "UX.TextField",
                "properties": { "html:type": "text" },
                "id": "#3"
              },
              "#4": {
                "nm": "TEXTAREA.ENT.NOMODEL",
                "type": "field",
                "widget_class": "UX.TextArea",
                "properties": {},
                "id": "#4"
              },
              "widget_class": "UX.OccurrenceLayout"
            }
          },
          "properties": {},
          "id": "#2",
          "hasNEDFields": true,
          "ownsNEDFields": true
        };
        stretchableTesters = [
          new umockup.WidgetTester("UX.TextField", "ufld:TEXTFIELD.ENT.NOMODEL"),
          new umockup.WidgetTester("UX.TextArea", "ufld:TEXTAREA.ENT.NOMODEL")
        ];
        localOccurrenceTester = new umockup.WidgetTester("UX.OccurrenceLayout", "uocc:UXENTITY.NOMODEL.4");
        const occurrenceSkeleton = createSkeleton("uocc:UXENTITY.NOMODEL.4");
        localOccurrenceTester.createWidget(null, occurrenceSkeleton, entityDef);
        stretchableTesters.forEach(function (tester) {
          tester.createWidget(null, localOccurrenceTester.element.querySelector(`[id="${tester.widgetId}"]`), null);
        });
        localOccurrenceTester.dataUpdate({
          "layout-type": "vertical-scroll",
          "horizontal-align": "stretch"
        });
      });

      it("should not apply flex-grow to stretchable direct children in a vertical-scroll layout", function () {
        stretchableTesters.forEach(function (tester) {
          expect(window.getComputedStyle(tester.element).flexGrow, `Stretchable child '${tester.widgetName}' should have flex-grow: 0 in a vertical-scroll layout with horizontal-align stretch.`).to.equal("0");
        });
      });

      it("should not apply flex-grow to stretchable direct children in a vertical-wrap layout", function () {
        return asyncRun(function () {
          localOccurrenceTester.dataUpdate({
            "layout-type": "vertical-wrap",
            "horizontal-align": "stretch"
          });
        }).then(function () {
          stretchableTesters.forEach(function (tester) {
            expect(window.getComputedStyle(tester.element).flexGrow, `Stretchable child '${tester.widgetName}' should have flex-grow: 0 in a vertical-wrap layout with horizontal-align stretch.`).to.equal("0");
          });
        });
      });
    });

    describe("When u-text-area bypasses the vertical grow guard in a vertical-align stretch layout", function () {
      let localOccurrenceTester;
      let textFieldTester;
      let textAreaTester;

      before(function () {
        resetWidgetContainer();
        const entityDef = {
          "nm": "UXENTITY.NOMODEL",
          "type": "entity",
          "widget_class": "UX.CollectionLayout",
          "occs": {
            "#2": {
              "type": "occurrence",
              "#3": {
                "nm": "TEXTFIELD.ENT.NOMODEL",
                "type": "field",
                "widget_class": "UX.TextField",
                "properties": { "html:type": "text" },
                "id": "#3"
              },
              "#4": {
                "nm": "TEXTAREA.ENT.NOMODEL",
                "type": "field",
                "widget_class": "UX.TextArea",
                "properties": {},
                "id": "#4"
              },
              "widget_class": "UX.OccurrenceLayout"
            }
          },
          "properties": {},
          "id": "#2",
          "hasNEDFields": true,
          "ownsNEDFields": true
        };
        textFieldTester = new umockup.WidgetTester("UX.TextField", "ufld:TEXTFIELD.ENT.NOMODEL");
        textAreaTester = new umockup.WidgetTester("UX.TextArea", "ufld:TEXTAREA.ENT.NOMODEL");
        localOccurrenceTester = new umockup.WidgetTester("UX.OccurrenceLayout", "uocc:UXENTITY.NOMODEL.3");
        const occurrenceSkeleton = createSkeleton("uocc:UXENTITY.NOMODEL.3");
        localOccurrenceTester.createWidget(null, occurrenceSkeleton, entityDef);
        textFieldTester.createWidget(null, localOccurrenceTester.element.querySelector(`[id="${textFieldTester.widgetId}"]`), null);
        textAreaTester.createWidget(null, localOccurrenceTester.element.querySelector(`[id="${textAreaTester.widgetId}"]`), null);
        localOccurrenceTester.dataUpdate({
          "layout-type": "vertical-scroll",
          "vertical-align": "stretch"
        });
      });

      it("should not apply flex-grow to text-field the vertical grow guard suppresses main-axis growth", function () {
        // uf-layout > .u-stretchable reads flex-grow: var(--u-vertical-layout-grow, var(--u-layout-grow, 0))
        // --u-vertical-layout-grow: 0 is set on .root text-field inherits 0, guard wins.
        expect(window.getComputedStyle(textFieldTester.element).flexGrow,
          "text-field should not grow: --u-vertical-layout-grow: 0 on .root suppresses growth.").to.equal("0");
      });

      it("should apply flex-grow to u-text-area it reads --u-layout-grow directly, bypassing the guard", function () {
        // .u-text-area.u-stretchable { flex-grow: var(--u-layout-grow, 0) } higher specificity.
        // --u-layout-grow: 1 is set on :host (via :host(.u-jc-stretch)) and inherited via .root.
        // --u-vertical-layout-grow: 0 is ignored by this rule.
        expect(window.getComputedStyle(textAreaTester.element).flexGrow,
          "u-text-area should grow: its rule reads --u-layout-grow: 1 directly, bypassing --u-vertical-layout-grow: 0.").to.equal("1");
      });
    });

    describe("When text-field, number-field, and button do not grow vertically with vertical-align stretch", function () {
      let localOccurrenceTester;
      let textFieldTester;
      let numberFieldTester;
      let buttonTester;

      before(function () {
        resetWidgetContainer();
        const entityDef = {
          "nm": "UXENTITY.NOMODEL",
          "type": "entity",
          "widget_class": "UX.CollectionLayout",
          "occs": {
            "#2": {
              "type": "occurrence",
              "#3": {
                "nm": "TEXTFIELD.ENT.NOMODEL",
                "type": "field",
                "widget_class": "UX.TextField",
                "properties": { "html:type": "text" },
                "id": "#3"
              },
              "#7": {
                "nm": "NUMBERFIELD.ENT.NOMODEL",
                "type": "field",
                "widget_class": "UX.NumberField",
                "properties": {},
                "id": "#7"
              },
              "#6": {
                "nm": "BUTTON.ENT.NOMODEL",
                "type": "field",
                "widget_class": "UX.Button",
                "properties": {},
                "id": "#6"
              },
              "widget_class": "UX.OccurrenceLayout"
            }
          },
          "properties": {},
          "id": "#2",
          "hasNEDFields": true,
          "ownsNEDFields": true
        };
        textFieldTester = new umockup.WidgetTester("UX.TextField", "ufld:TEXTFIELD.ENT.NOMODEL");
        numberFieldTester = new umockup.WidgetTester("UX.NumberField", "ufld:NUMBERFIELD.ENT.NOMODEL");
        buttonTester = new umockup.WidgetTester("UX.Button", "ufld:BUTTON.ENT.NOMODEL");
        localOccurrenceTester = new umockup.WidgetTester("UX.OccurrenceLayout", "uocc:UXENTITY.NOMODEL.3");
        const occurrenceSkeleton = createSkeleton("uocc:UXENTITY.NOMODEL.3");
        localOccurrenceTester.createWidget(null, occurrenceSkeleton, entityDef);
        [textFieldTester, numberFieldTester, buttonTester].forEach(function (tester) {
          tester.createWidget(null, localOccurrenceTester.element.querySelector(`[id="${tester.widgetId}"]`), null);
        });
        localOccurrenceTester.dataUpdate({
          "layout-type": "vertical-scroll",
          "vertical-align": "stretch"
        });
      });

      it("should have flex-grow 0 on each control — the --u-vertical-layout-grow: 0 guard suppresses main-axis growth", function () {
        [textFieldTester, numberFieldTester, buttonTester].forEach(function (tester) {
          expect(window.getComputedStyle(tester.element).flexGrow,
            `'${tester.widgetName}' flex-grow should be 0: --u-vertical-layout-grow: 0 guard prevents vertical growth.`).to.equal("0");
        });
      });

      it("should retain natural offsetHeight for each control — vertical-align stretch does not increase height", function () {
        const heightsWithStretch = [textFieldTester, numberFieldTester, buttonTester].map(function (tester) {
          return tester.element.offsetHeight;
        });
        return asyncRun(function () {
          localOccurrenceTester.dataUpdate({ "vertical-align": "auto" });
        }).then(function () {
          [textFieldTester, numberFieldTester, buttonTester].forEach(function (tester, i) {
            expect(heightsWithStretch[i],
              `'${tester.widgetName}' offsetHeight should be unchanged by vertical-align stretch (retains natural height).`).to.equal(tester.element.offsetHeight);
          });
        });
      });
    });

    describe("When text-field, number-field, and button do grow horizontally with horizontal-align stretch", function () {
      let localOccurrenceTester;
      let textFieldTester;
      let numberFieldTester;
      let buttonTester;

      before(function () {
        resetWidgetContainer();
        const entityDef = {
          "nm": "UXENTITY.NOMODEL",
          "type": "entity",
          "widget_class": "UX.CollectionLayout",
          "occs": {
            "#2": {
              "type": "occurrence",
              "#3": {
                "nm": "TEXTFIELD.ENT.NOMODEL",
                "type": "field",
                "widget_class": "UX.TextField",
                "properties": { "html:type": "text" },
                "id": "#3"
              },
              "#7": {
                "nm": "NUMBERFIELD.ENT.NOMODEL",
                "type": "field",
                "widget_class": "UX.NumberField",
                "properties": {},
                "id": "#7"
              },
              "#6": {
                "nm": "BUTTON.ENT.NOMODEL",
                "type": "field",
                "widget_class": "UX.Button",
                "properties": {},
                "id": "#6"
              },
              "widget_class": "UX.OccurrenceLayout"
            }
          },
          "properties": {},
          "id": "#2",
          "hasNEDFields": true,
          "ownsNEDFields": true
        };
        textFieldTester = new umockup.WidgetTester("UX.TextField", "ufld:TEXTFIELD.ENT.NOMODEL");
        numberFieldTester = new umockup.WidgetTester("UX.NumberField", "ufld:NUMBERFIELD.ENT.NOMODEL");
        buttonTester = new umockup.WidgetTester("UX.Button", "ufld:BUTTON.ENT.NOMODEL");
        localOccurrenceTester = new umockup.WidgetTester("UX.OccurrenceLayout", "uocc:UXENTITY.NOMODEL.3");
        const occurrenceSkeleton = createSkeleton("uocc:UXENTITY.NOMODEL.3");
        localOccurrenceTester.createWidget(null, occurrenceSkeleton, entityDef);
        [textFieldTester, numberFieldTester, buttonTester].forEach(function (tester) {
          tester.createWidget(null, localOccurrenceTester.element.querySelector(`[id="${tester.widgetId}"]`), null);
        });
        localOccurrenceTester.dataUpdate({
          "layout-type": "horizontal-scroll",
          "horizontal-align": "stretch"
        });
      });

      it("should have flex-grow 1 on each control — the --u-vertical-layout-grow guard is cleared for horizontal layouts", function () {
        // For horizontal layouts, --u-vertical-layout-grow is not set (initial), so
        // flex-grow: var(--u-vertical-layout-grow, var(--u-layout-grow, 0)) resolves to
        // var(--u-layout-grow, 0) which is 1 when u-jc-stretch is active.
        [textFieldTester, numberFieldTester, buttonTester].forEach(function (tester) {
          expect(window.getComputedStyle(tester.element).flexGrow,
            `'${tester.widgetName}' flex-grow should be 1: --u-vertical-layout-grow is cleared for horizontal-scroll layouts.`).to.equal("1");
        });
      });

      it("should grow offsetWidth when horizontal-align is stretch and shrink back when removed", function () {
        const widthsWithStretch = [textFieldTester, numberFieldTester, buttonTester].map(function (tester) {
          return tester.element.offsetWidth;
        });
        return asyncRun(function () {
          localOccurrenceTester.dataUpdate({ "horizontal-align": "auto" });
        }).then(function () {
          [textFieldTester, numberFieldTester, buttonTester].forEach(function (tester, i) {
            expect(widthsWithStretch[i],
              `'${tester.widgetName}' offsetWidth with stretch should be greater than natural width without stretch.`).to.be.greaterThan(tester.element.offsetWidth);
          });
        });
      });
    });

    describe("When an OccurrenceLayout contains only a text-field", function () {
      let localOccurrenceTester;
      let textFieldTester;

      const entityDef = {
        "nm": "UXENTITY.NOMODEL",
        "type": "entity",
        "widget_class": "UX.CollectionLayout",
        "occs": {
          "#2": {
            "type": "occurrence",
            "#3": {
              "nm": "TEXTFIELD.ENT.NOMODEL",
              "type": "field",
              "widget_class": "UX.TextField",
              "properties": { "html:type": "text" },
              "id": "#3"
            },
            "widget_class": "UX.OccurrenceLayout"
          }
        },
        "properties": {},
        "id": "#2",
        "hasNEDFields": true,
        "ownsNEDFields": true
      };

      beforeEach(function () {
        resetWidgetContainer();
        textFieldTester = new umockup.WidgetTester("UX.TextField", "ufld:TEXTFIELD.ENT.NOMODEL");
        localOccurrenceTester = new umockup.WidgetTester("UX.OccurrenceLayout", "uocc:UXENTITY.NOMODEL.3");
        const occurrenceSkeleton = createSkeleton("uocc:UXENTITY.NOMODEL.3");
        localOccurrenceTester.createWidget(null, occurrenceSkeleton, entityDef);
        textFieldTester.createWidget(null, localOccurrenceTester.element.querySelector(`[id="${textFieldTester.widgetId}"]`), null);
      });

      it("should not grow vertically with vertical-scroll and vertical-align stretch — --u-vertical-layout-grow: 0 guard applies", function () {
        return asyncRun(function () {
          localOccurrenceTester.dataUpdate({
            "layout-type": "vertical-scroll",
            "vertical-align": "stretch"
          });
        }).then(function () {
          const heightWithStretch = textFieldTester.element.offsetHeight;
          expect(window.getComputedStyle(textFieldTester.element).flexGrow,
            "text-field flex-grow should be 0 in a vertical-scroll layout: --u-vertical-layout-grow: 0 guard suppresses growth.").to.equal("0");
          return asyncRun(function () {
            localOccurrenceTester.dataUpdate({ "vertical-align": "auto" });
          }).then(function () {
            expect(heightWithStretch,
              "text-field offsetHeight should be unchanged by vertical-align stretch (retains natural height).").to.equal(textFieldTester.element.offsetHeight);
          });
        });
      });

      it("should grow horizontally with horizontal-scroll and horizontal-align stretch — --u-vertical-layout-grow guard is cleared", function () {
        return asyncRun(function () {
          localOccurrenceTester.dataUpdate({
            "layout-type": "horizontal-scroll",
            "horizontal-align": "stretch"
          });
        }).then(function () {
          const widthWithStretch = textFieldTester.element.offsetWidth;
          expect(window.getComputedStyle(textFieldTester.element).flexGrow,
            "text-field flex-grow should be 1 in a horizontal-scroll layout: --u-vertical-layout-grow is cleared, --u-layout-grow: 1 wins.").to.equal("1");
          return asyncRun(function () {
            localOccurrenceTester.dataUpdate({ "horizontal-align": "auto" });
          }).then(function () {
            expect(widthWithStretch,
              "text-field offsetWidth with stretch should be greater than natural width without stretch.").to.be.greaterThan(textFieldTester.element.offsetWidth);
          });
        });
      });
    });

    describe("When layout-type switches at runtime from vertical-scroll to horizontal-scroll with stretch alignment", function () {
      let localOccurrenceTester;
      let textFieldTester;

      before(function () {
        resetWidgetContainer();
        const entityDef = {
          "nm": "UXENTITY.NOMODEL",
          "type": "entity",
          "widget_class": "UX.CollectionLayout",
          "occs": {
            "#2": {
              "type": "occurrence",
              "#3": {
                "nm": "TEXTFIELD.ENT.NOMODEL",
                "type": "field",
                "widget_class": "UX.TextField",
                "properties": { "html:type": "text" },
                "id": "#3"
              },
              "widget_class": "UX.OccurrenceLayout"
            }
          },
          "properties": {},
          "id": "#2",
          "hasNEDFields": true,
          "ownsNEDFields": true
        };
        textFieldTester = new umockup.WidgetTester("UX.TextField", "ufld:TEXTFIELD.ENT.NOMODEL");
        localOccurrenceTester = new umockup.WidgetTester("UX.OccurrenceLayout", "uocc:UXENTITY.NOMODEL.3");
        const occurrenceSkeleton = createSkeleton("uocc:UXENTITY.NOMODEL.3");
        localOccurrenceTester.createWidget(null, occurrenceSkeleton, entityDef);
        textFieldTester.createWidget(null, localOccurrenceTester.element.querySelector(`[id="${textFieldTester.widgetId}"]`), null);
        localOccurrenceTester.dataUpdate({
          "layout-type": "vertical-scroll",
          "vertical-align": "stretch"
        });
      });

      it("should have u-jc-stretch on the container after vertical-scroll with vertical-align stretch", function () {
        expect(localOccurrenceTester.element.classList.contains("u-jc-stretch"),
          "u-occ-layout should have u-jc-stretch when layout-type is vertical-scroll and vertical-align is stretch.").to.be.true;
        expect(localOccurrenceTester.element.classList.contains("u-ai-stretch"),
          "u-occ-layout should not have u-ai-stretch when layout-type is vertical-scroll.").to.be.false;
        expect(window.getComputedStyle(textFieldTester.element).flexGrow,
          "text-field flex-grow should be 0: --u-vertical-layout-grow: 0 guard is active.").to.equal("0");
      });

      it("should replace u-jc-stretch with u-ai-stretch after switching to horizontal-scroll", function () {
        return asyncRun(function () {
          localOccurrenceTester.dataUpdate({ "layout-type": "horizontal-scroll" });
        }).then(function () {
          expect(localOccurrenceTester.element.classList.contains("u-jc-stretch"),
            "u-jc-stretch should be absent after switching to horizontal-scroll.").to.be.false;
          expect(localOccurrenceTester.element.classList.contains("u-ai-stretch"),
            "u-ai-stretch should be present after switching to horizontal-scroll with vertical-align stretch.").to.be.true;
        });
      });
    });

    describe("When OccurrenceLayout has layout-type vertical-scroll and horizontal-align stretch", function () {
      let localOccurrenceTester;

      before(function () {
        resetWidgetContainer();
        localOccurrenceTester = new umockup.WidgetTester("UX.OccurrenceLayout", occurrenceWidgetId);
        const occurrenceSkeleton = createSkeleton(occurrenceWidgetId);
        localOccurrenceTester.createWidget(null, occurrenceSkeleton, mockEntityDef);
        localOccurrenceTester.dataUpdate({
          "layout-type": "vertical-scroll",
          "horizontal-align": "stretch"
        });
      });

      it("should apply u-ai-stretch (not u-jc-stretch) to u-occ-layout when the cross axis has stretch", function () {
        expect(localOccurrenceTester.element.classList.contains("u-ai-stretch"),
          "u-occ-layout should have u-ai-stretch when layout-type is vertical-scroll and horizontal-align is stretch.").to.be.true;
        expect(localOccurrenceTester.element.classList.contains("u-jc-stretch"),
          "u-occ-layout should not have u-jc-stretch when horizontal-align is stretch in a vertical-scroll layout.").to.be.false;
      });
    });

    describe("When OccurrenceLayout vertical-align changes away from stretch", function () {
      let localOccurrenceTester;

      before(function () {
        resetWidgetContainer();
        localOccurrenceTester = new umockup.WidgetTester("UX.OccurrenceLayout", occurrenceWidgetId);
        const occurrenceSkeleton = createSkeleton(occurrenceWidgetId);
        localOccurrenceTester.createWidget(null, occurrenceSkeleton, mockEntityDef);
        localOccurrenceTester.dataUpdate({
          "layout-type": "vertical-scroll",
          "vertical-align": "stretch"
        });
      });

      it("should remove u-jc-stretch from u-occ-layout when vertical-align changes away from stretch", function () {
        expect(localOccurrenceTester.element.classList.contains("u-jc-stretch"),
          "u-occ-layout should have u-jc-stretch before alignment change.").to.be.true;
        return asyncRun(function () {
          localOccurrenceTester.dataUpdate({ "vertical-align": "start" });
        }).then(function () {
          expect(localOccurrenceTester.element.classList.contains("u-jc-stretch"),
            "u-occ-layout should not have u-jc-stretch after vertical-align changes to 'start'.").to.be.false;
        });
      });
    });

    describe("When CollectionLayout has layout-type-occurrences vertical-scroll and vertical-align-occurrences stretch", function () {
      let localCollectionTester;
      let collElement;

      before(function () {
        resetWidgetContainer();
        localCollectionTester = new umockup.WidgetTester("UX.CollectionLayout", collectionWidgetId);
        const collectionSkeleton = createSkeleton(collectionWidgetId);
        localCollectionTester.createWidget(null, collectionSkeleton, mockEntityDef);
        collElement = localCollectionTester.element;
        localCollectionTester.dataUpdate({
          "layout-type-occurrences": "vertical-scroll",
          "vertical-align-occurrences": "stretch"
        });
      });

      it("should apply u-jc-stretch (not u-ai-stretch) to u-coll-layout when main axis has stretch", function () {
        expect(collElement.classList.contains("u-jc-stretch"),
          "u-coll-layout should have u-jc-stretch when layout-type-occurrences is vertical-scroll and vertical-align-occurrences is stretch.").to.be.true;
        expect(collElement.classList.contains("u-ai-stretch"),
          "u-coll-layout should not have u-ai-stretch when layout-type-occurrences is vertical-scroll.").to.be.false;
      });

      it("should remove u-jc-stretch from u-coll-layout when vertical-align-occurrences changes away from stretch", function () {
        return asyncRun(function () {
          localCollectionTester.dataUpdate({ "vertical-align-occurrences": "stretch" });
        }).then(function () {
          expect(collElement.classList.contains("u-jc-stretch"),
            "u-coll-layout should have u-jc-stretch before alignment change.").to.be.true;
          return asyncRun(function () {
            localCollectionTester.dataUpdate({ "vertical-align-occurrences": "start" });
          });
        }).then(function () {
          expect(collElement.classList.contains("u-jc-stretch"),
            "u-coll-layout should not have u-jc-stretch after vertical-align-occurrences changes to 'start'.").to.be.false;
        });
      });
    });

    describe("When CollectionLayout has layout-type-occurrences vertical-scroll and only horizontal-align-occurrences stretch", function () {
      let localCollectionTester;
      let collElement;

      before(function () {
        resetWidgetContainer();
        localCollectionTester = new umockup.WidgetTester("UX.CollectionLayout", collectionWidgetId);
        const collectionSkeleton = createSkeleton(collectionWidgetId);
        localCollectionTester.createWidget(null, collectionSkeleton, mockEntityDef);
        collElement = localCollectionTester.element;
        localCollectionTester.dataUpdate({
          "layout-type-occurrences": "vertical-scroll",
          "vertical-align-occurrences": "start",
          "horizontal-align-occurrences": "stretch"
        });
      });

      it("should apply u-ai-stretch (not u-jc-stretch) to u-coll-layout when only the cross axis has stretch", function () {
        expect(
          collElement.classList.contains("u-jc-stretch"),
          "u-coll-layout should not have u-jc-stretch when vertical-align-occurrences is not stretch."
        ).to.be.false;
        expect(
          collElement.classList.contains("u-ai-stretch"),
          "u-coll-layout should have u-ai-stretch when horizontal-align-occurrences is stretch in a vertical-scroll layout."
        ).to.be.true;
      });
    });

    describe("When CollectionLayout has layout-type-occurrences horizontal-scroll and horizontal-align-occurrences stretch", function () {
      let localCollectionTester;
      let collElement;

      before(function () {
        resetWidgetContainer();
        localCollectionTester = new umockup.WidgetTester("UX.CollectionLayout", collectionWidgetId);
        const collectionSkeleton = createSkeleton(collectionWidgetId);
        localCollectionTester.createWidget(null, collectionSkeleton, mockEntityDef);
        collElement = localCollectionTester.element;
        localCollectionTester.dataUpdate({
          "layout-type-occurrences": "horizontal-scroll",
          "horizontal-align-occurrences": "stretch"
        });
      });

      it("should apply u-jc-stretch to u-coll-layout when layout-type-occurrences is horizontal-scroll and horizontal-align-occurrences is stretch", function () {
        expect(collElement.classList.contains("u-jc-stretch"),
          "u-coll-layout should have u-jc-stretch when layout-type-occurrences is horizontal-scroll and horizontal-align-occurrences is stretch.").to.be.true;
      });
    });

    describe("When CollectionLayout has both alignment axes set to auto", function () {
      let localCollectionTester;
      let collElement;

      before(function () {
        resetWidgetContainer();
        localCollectionTester = new umockup.WidgetTester("UX.CollectionLayout", collectionWidgetId);
        const collectionSkeleton = createSkeleton(collectionWidgetId);
        localCollectionTester.createWidget(null, collectionSkeleton, mockEntityDef);
        collElement = localCollectionTester.element;
        localCollectionTester.dataUpdate({
          "horizontal-align-occurrences": "auto",
          "vertical-align-occurrences": "auto"
        });
      });

      it("should apply neither u-jc-stretch nor u-ai-stretch to u-coll-layout when both alignment axes are auto", function () {
        expect(collElement.classList.contains("u-jc-stretch"),
          "u-coll-layout should not have u-jc-stretch when horizontal-align-occurrences is auto.").to.be.false;
        expect(collElement.classList.contains("u-ai-stretch"),
          "u-coll-layout should not have u-ai-stretch when vertical-align-occurrences is auto.").to.be.false;
      });
    });
  });

  describe("Reset properties", function () {

    describe("CollectionLayout specific", function () {

      let localCollectionTester;
      let collElement;

      before(function () {
        resetWidgetContainer();
        localCollectionTester = new umockup.WidgetTester("UX.CollectionLayout", collectionWidgetId);
        const collectionSkeleton = createSkeleton(collectionWidgetId);
        localCollectionTester.createWidget(null, collectionSkeleton, mockEntityDef);
        collElement = localCollectionTester.element;
      });

      it("should reset all properties and values to initial values if initial values exist", function () {
        const initialValues = {
          "label-text": "Label text",
          "label-size": "medium",
          "label-align": "center",
          "label-position": "below",
          "layout-type-occurrences": "vertical-wrap",
          "horizontal-align-occurrences": "center",
          "vertical-align-occurrences": "end",
          "appearance": "panel"
        };

        return asyncRun(function () {
          // Step 1: Call dataInit() to mock initial non-default screen load values.
          localCollectionTester.dataInit(null, null, null, initialValues);
        })
          // Step 2: Apply a representative set of properties.
          .then(function () {
            return asyncRun(function () {
              localCollectionTester.dataUpdate({
                "label-text": "Abc",
                "label-size": "small",
                "label-align": "end",
                "label-position": "before",
                "layout-type-occurrences": "horizontal-wrap",
                "horizontal-align-occurrences": "end",
                "vertical-align-occurrences": "center",
                "appearance": "outline"
              });
            });
          })
          .then(function () {
            // Step 3: Verify all representative properties are applied.
            expect(collElement.querySelector(":scope > .u-label-text").hasAttribute("hidden"), "Label text span should not be hidden after reset.").to.be.false;
            expect(collElement.querySelector(":scope > .u-label-text").innerText, "Label text should be 'Abc'.").to.equal("Abc");
            expect(collElement.getAttribute("label-position"), "label-position should be 'before'.").to.equal("before");
            expect(collElement.getAttribute("label-align"), "label-align should be 'end'.").to.equal("end");
            expect(collElement.getAttribute("label-size"), "label-size should be 'small'.").to.equal("small");
            expect(collElement.getAttribute("layout-type"), "layout-type should be 'horizontal-wrap'.").to.equal("horizontal-wrap");
            expect(collElement.getAttribute("horizontal-align"), "horizontal-align should be 'end'.").to.equal("end");
            expect(collElement.getAttribute("vertical-align"), "vertical-align should be 'center'.").to.equal("center");
            expect(collElement.getAttribute("appearance"), "appearance should be 'outline'.").to.equal("outline");
          })
          .then(function () {
            // Step 4: Call resetWidget() to reset all properties to initial values.
            return asyncRun(function () {
              localCollectionTester.resetWidget();
            });
          })
          .then(function () {
            // Step 5: Verify all properties are reset to initial values.
            expect(collElement.querySelector(":scope > .u-label-text").hasAttribute("hidden"), "Label text span should not be hidden after reset.").to.be.false;
            expect(collElement.querySelector(":scope > .u-label-text").innerText, "Label text should be 'Label text'.").to.equal("Label text");
            expect(collElement.getAttribute("label-position"), "label-position should be reset to 'below'.").to.equal("below");
            expect(collElement.getAttribute("label-align"), "label-align should be reset to 'center'.").to.equal("center");
            expect(collElement.getAttribute("label-size"), "label-size should be reset to 'medium'.").to.equal("medium");
            expect(collElement.getAttribute("layout-type"), "layout-type should be reset to 'vertical-wrap'.").to.equal("vertical-wrap");
            expect(collElement.getAttribute("horizontal-align"), "horizontal-align should be reset to 'center'.").to.equal("center");
            expect(collElement.getAttribute("vertical-align"), "vertical-align should be reset to 'end'.").to.equal("end");
            expect(collElement.getAttribute("appearance"), "appearance should be reset to 'panel'.").to.equal("panel");
          });
      });

      it("should reset all properties and values to default values if no initial values exist", function () {
        const initialValues = {};

        return (
          asyncRun(function () {
            // Step 1: Call dataInit() to mock initial non-default screen load values.
            localCollectionTester.dataInit(null, null, null, initialValues);
          })
            // Step 2: Apply a representative set of properties.
            .then(function () {
              return asyncRun(function () {
                localCollectionTester.dataUpdate({
                  "label-text": "Abc",
                  "label-size": "small",
                  "label-align": "end",
                  "label-position": "before",
                  "layout-type-occurrences": "horizontal-wrap",
                  "horizontal-align-occurrences": "end",
                  "vertical-align-occurrences": "center",
                  "appearance": "outline"
                });
              });
            })
            .then(function () {
              // Step 3: Verify all representative properties are applied.
              expect(collElement.querySelector(":scope > .u-label-text").hasAttribute("hidden"), "Label text span should not be hidden after reset.").to.be.false;
              expect(collElement.querySelector(":scope > .u-label-text").innerText, "Label text should be 'Abc'.").to.equal("Abc");
              expect(collElement.getAttribute("label-position"), "label-position should be 'before'.").to.equal("before");
              expect(collElement.getAttribute("label-align"), "label-align should be 'end'.").to.equal("end");
              expect(collElement.getAttribute("label-size"), "label-size should be 'small'.").to.equal("small");
              expect(collElement.getAttribute("layout-type"), "layout-type should be 'horizontal-wrap'.").to.equal("horizontal-wrap");
              expect(collElement.getAttribute("horizontal-align"), "horizontal-align should be 'end'.").to.equal("end");
              expect(collElement.getAttribute("vertical-align"), "vertical-align should be 'center'.").to.equal("center");
              expect(collElement.getAttribute("appearance"), "appearance should be 'outline'.").to.equal("outline");
            })
            .then(function () {
              // Step 4: Call resetWidget() to reset all properties to default values.
              return asyncRun(function () {
                localCollectionTester.resetWidget();
              });
            })
            .then(function () {
              // Step 5: Verify all properties are reset to default values.
              expect(collElement.querySelector(":scope > .u-label-text").hasAttribute("hidden"), "Label text span should be hidden.").to.be.true;
              expect(collElement.querySelector(":scope > .u-label-text").innerText, "Label text should be empty.").to.equal("");
              expect(collElement.getAttribute("label-position"), "label-position should be reset to 'above'.").to.equal("above");
              expect(collElement.getAttribute("label-align"), "label-align should be reset to 'start'.").to.equal("start");
              expect(collElement.getAttribute("label-size"), "label-size should be reset to 'normal'.").to.equal("normal");
              expect(collElement.getAttribute("layout-type"), "layout-type should be reset to 'auto'.").to.equal("auto");
              expect(collElement.getAttribute("horizontal-align"), "horizontal-align should be reset to 'auto'.").to.equal("auto");
              expect(collElement.getAttribute("vertical-align"), "vertical-align should be reset to 'auto'.").to.equal("auto");
              expect(collElement.getAttribute("appearance"), "appearance should be reset to 'transparent'.").to.equal("transparent");
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
            localCollectionTester.dataInit(null, null, null, initialValues);
          })
            // Step 2: Apply a representative set of properties.
            .then(function () {
              return asyncRun(function () {
                localCollectionTester.dataUpdate({
                  "label-text": "Abc",
                  "label-size": "small",
                  "label-align": "end",
                  "label-position": "before",
                  "layout-type-occurrences": "horizontal-wrap",
                  "horizontal-align-occurrences": "end",
                  "vertical-align-occurrences": "center",
                  "appearance": "outline"
                });
              });
            })
            .then(function () {
              // Step 3: Verify all representative properties are applied.
              expect(collElement.querySelector(":scope > .u-label-text").hasAttribute("hidden"), "Label text span should not be hidden after reset.").to.be.false;
              expect(collElement.querySelector(":scope > .u-label-text").innerText, "Label text should be 'Abc'.").to.equal("Abc");
              expect(collElement.getAttribute("label-position"), "label-position should be 'before'.").to.equal("before");
              expect(collElement.getAttribute("label-align"), "label-align should be 'end'.").to.equal("end");
              expect(collElement.getAttribute("label-size"), "label-size should be 'small'.").to.equal("small");
              expect(collElement.getAttribute("layout-type"), "layout-type should be 'horizontal-wrap'.").to.equal("horizontal-wrap");
              expect(collElement.getAttribute("horizontal-align"), "horizontal-align should be 'end'.").to.equal("end");
              expect(collElement.getAttribute("vertical-align"), "vertical-align should be 'center'.").to.equal("center");
              expect(collElement.getAttribute("appearance"), "appearance should be 'outline'.").to.equal("outline");
            })
            .then(function () {
              // Step 4: Call resetWidget() to reset label-text and appearance properties to initial values.
              return asyncRun(function () {
                localCollectionTester.resetWidget(["label-text", "appearance"]);
              });
            })
            .then(function () {
              // Step 5: Verify reset properties ('label-text', 'appearance') are restored to initial values; others remain unchanged.
              expect(collElement.querySelector(":scope > .u-label-text").hasAttribute("hidden"), "Label text span should not be hidden after reset.").to.be.false;
              expect(collElement.querySelector(":scope > .u-label-text").innerText, "Label text should be 'Label text'.").to.equal("Label text");
              expect(collElement.getAttribute("label-position"), "label-position should remain 'before' (not reset).").to.equal("before");
              expect(collElement.getAttribute("label-align"), "label-align should remain 'end' (not reset).").to.equal("end");
              expect(collElement.getAttribute("label-size"), "label-size should remain 'small' (not reset).").to.equal("small");
              expect(collElement.getAttribute("layout-type"), "layout-type should remain 'horizontal-wrap' (not reset).").to.equal("horizontal-wrap");
              expect(collElement.getAttribute("horizontal-align"), "horizontal-align should remain 'end' (not reset).").to.equal("end");
              expect(collElement.getAttribute("vertical-align"), "vertical-align should remain 'center' (not reset).").to.equal("center");
              expect(collElement.getAttribute("appearance"), "appearance should be reset to 'card'.").to.equal("card");
            })
        );
      });
    });

    describe("OccurrenceLayout specific", function () {

      let localOccurrenceTester;
      let occElement;

      before(function () {
        resetWidgetContainer();
        localOccurrenceTester = new umockup.WidgetTester("UX.OccurrenceLayout", occurrenceWidgetId);
        const occurrenceSkeleton = createSkeleton(occurrenceWidgetId);
        localOccurrenceTester.createWidget(null, occurrenceSkeleton, mockEntityDef);
        occElement = localOccurrenceTester.element;
      });

      it("should reset all properties to initial values if initial values exist", function () {
        const initialValues = {
          "layout-type": "horizontal-scroll",
          "horizontal-align": "space-between",
          "vertical-align": "end",
          "appearance-occurrences": "section"
        };

        return asyncRun(function () {
          // Step 1: Call dataInit() to mock initial non-default screen load values.
          localOccurrenceTester.dataInit(null, null, null, initialValues);
        })
          // Step 2: Apply a representative set of properties.
          .then(function () {
            return asyncRun(function () {
              localOccurrenceTester.dataUpdate({
                "layout-type": "vertical-wrap",
                "horizontal-align": "end",
                "vertical-align": "start",
                "appearance-occurrences": "panel"
              });
            });
          })
          .then(function () {
            // Step 3: Verify all representative properties are applied.
            expect(occElement.getAttribute("layout-type"), "layout-type should be 'vertical-wrap'.").to.equal("vertical-wrap");
            expect(occElement.getAttribute("horizontal-align"), "horizontal-align should be 'end'.").to.equal("end");
            expect(occElement.getAttribute("vertical-align"), "vertical-align should be 'start'.").to.equal("start");
            expect(occElement.getAttribute("appearance"), "appearance should be 'panel'.").to.equal("panel");
          })
          .then(function () {
            // Step 4: Call resetWidget() to reset all properties to initial values.
            return asyncRun(function () {
              localOccurrenceTester.resetWidget();
            });
          })
          .then(function () {
            // Step 5: Verify all properties are reset to initial values.
            expect(occElement.getAttribute("layout-type"), "layout-type should be reset to 'horizontal-scroll'.").to.equal("horizontal-scroll");
            expect(occElement.getAttribute("horizontal-align"), "horizontal-align should be reset to 'space-between'.").to.equal("space-between");
            expect(occElement.getAttribute("vertical-align"), "vertical-align should be reset to 'end'.").to.equal("end");
            expect(occElement.getAttribute("appearance"), "appearance should be reset to 'section'.").to.equal("section");
          });
      });

      it("should reset all properties to default values if no initial values exist", function () {
        const initialValues = {};

        return asyncRun(function () {
          // Step 1: Call dataInit() to mock initial non-default screen load values.
          localOccurrenceTester.dataInit(null, null, null, initialValues);
        })
          // Step 2: Apply a representative set of properties.
          .then(function () {
            return asyncRun(function () {
              localOccurrenceTester.dataUpdate({
                "layout-type": "horizontal-wrap",
                "horizontal-align": "space-between",
                "vertical-align": "end",
                "appearance-occurrences": "section"
              });
            });
          })
          .then(function () {
            // Step 3: Verify all representative properties are applied.
            expect(occElement.getAttribute("layout-type"), "layout-type should be 'horizontal-wrap'.").to.equal("horizontal-wrap");
            expect(occElement.getAttribute("horizontal-align"), "horizontal-align should be 'space-between'.").to.equal("space-between");
            expect(occElement.getAttribute("vertical-align"), "vertical-align should be 'end'.").to.equal("end");
            expect(occElement.getAttribute("appearance"), "appearance should be 'section'.").to.equal("section");
          })
          .then(function () {
            // Step 4: Call resetWidget() to reset all properties to default values.
            return asyncRun(function () {
              localOccurrenceTester.resetWidget();
            });
          })
          .then(function () {
            // Step 5: Verify all properties are reset to default values.
            expect(occElement.getAttribute("layout-type"), "layout-type should be reset to 'auto'.").to.equal("auto");
            expect(occElement.getAttribute("horizontal-align"), "horizontal-align should be reset to 'auto'.").to.equal("auto");
            expect(occElement.getAttribute("vertical-align"), "vertical-align should be reset to 'auto'.").to.equal("auto");
            expect(occElement.getAttribute("appearance"), "appearance should be reset to 'transparent'.").to.equal("transparent");
          });
      });

      it("should reset specific properties to initial values that have initial values and leave others unchanged", function () {
        const initialValues = {
          "horizontal-align": "space-around",
          "appearance-occurrences": "card"
        };

        return asyncRun(function () {
          // Step 1: Call dataInit() to mock initial non-default screen load values.
          localOccurrenceTester.dataInit(null, null, null, initialValues);
        })
          // Step 2: Apply a representative set of properties.
          .then(function () {
            return asyncRun(function () {
              localOccurrenceTester.dataUpdate({
                "layout-type": "horizontal-scroll",
                "horizontal-align": "center",
                "vertical-align": "start",
                "appearance-occurrences": "panel"
              });
            });
          })
          .then(function () {
            // Step 3: Verify all representative properties are applied.
            expect(occElement.getAttribute("layout-type"), "layout-type should be 'horizontal-scroll'.").to.equal("horizontal-scroll");
            expect(occElement.getAttribute("horizontal-align"), "horizontal-align should be 'center'.").to.equal("center");
            expect(occElement.getAttribute("vertical-align"), "vertical-align should be 'start'.").to.equal("start");
            expect(occElement.getAttribute("appearance"), "appearance should be 'panel'.").to.equal("panel");
          })
          .then(function () {
            // Step 4: Call resetWidget() to reset specific properties to initial values.
            return asyncRun(function () {
              localOccurrenceTester.resetWidget(["horizontal-align", "appearance-occurrences"]);
            });
          })
          .then(function () {
            // Step 5: Verify reset properties ('horizontal-align', 'appearance-occurrences') are restored to initial values; others remain unchanged.
            expect(occElement.getAttribute("layout-type"), "layout-type should remain 'horizontal-scroll' (not reset).").to.equal("horizontal-scroll");
            expect(occElement.getAttribute("horizontal-align"), "horizontal-align should be reset to 'space-around'.").to.equal("space-around");
            expect(occElement.getAttribute("vertical-align"), "vertical-align should remain 'start' (not reset).").to.equal("start");
            expect(occElement.getAttribute("appearance"), "appearance should be reset to 'card'.").to.equal("card");
          });
      });
    });
  });

  describe("Widget reuse", function () {
    let element;

    describe("CollectionLayout specific", function () {

      it("should reset all properties and values to defaults when reused", function () {
        const collectionSkeleton = createSkeleton(collectionWidgetId);
        collectionTester.createWidget(null, collectionSkeleton, mockEntityDef);
        element = collectionTester.element;
        // Step 1: Apply a representative set of properties.
        return asyncRun(function () {
          collectionTester.dataUpdate({
            "label-text": "Label text",
            "label-position": "below",
            "layout-type-occurrences": "horizontal-scroll",
            "horizontal-align-occurrences": "space-between"
          });
        })
          .then(function () {
            // Step 2: Verify all properties are applied before reuse.
            expect(element.querySelector(":scope > .u-label-text").innerText, "Text should be 'Label text' before reuse.").to.equal("Label text");
            assert(!element.querySelector(":scope > .u-label-text").hasAttribute("hidden"), "Label text span should be visible before reuse.");
            expect(element.getAttribute("label-position"), "label-position should be 'below' before reuse.").to.equal("below");
            expect(element.getAttribute("layout-type"), "layout-type should be 'horizontal-scroll' before reuse.").to.equal("horizontal-scroll");
            expect(element.getAttribute("horizontal-align"), "horizontal-align should be 'space-between' before reuse.").to.equal("space-between");
          })
          .then(function () {
            // Step 3: Simulate Uniface widget reuse clean up the current occurrence, then re-initialize with defaults.
            collectionTester.dataCleanup();
            return asyncRun(function () {
              collectionTester.dataInit();
            });
          })
          .then(function () {
            // Step 4: Verify all properties and value are reset to defaults after reuse.
            assert(element.querySelector(":scope > .u-label-text").hasAttribute("hidden"), "Label text span should be hidden after reuse.");
            expect(element.querySelector(":scope > .u-label-text").innerText, "Label text should be empty after reuse.").to.equal("");
            expect(element.getAttribute("label-position"), "label-position should be reset to 'above' after reuse.").to.equal("above");
            expect(element.getAttribute("layout-type"), "layout-type should be reset to 'auto' after reuse.").to.equal("auto");
            expect(element.getAttribute("horizontal-align"), "horizontal-align should be reset to 'auto' after reuse.").to.equal("auto");
          });
      });
    });

    describe("OccurrenceLayout specific", function () {

      it("should reset all properties and value to defaults when reused", function () {
        const occurrenceSkeleton = createSkeleton(occurrenceWidgetId);
        occurrenceTester.createWidget(null, occurrenceSkeleton, mockEntityDef);
        element = occurrenceTester.element;
        // Step 1: Apply a representative set of properties.
        return asyncRun(function () {
          occurrenceTester.dataUpdate({
            "layout-type": "horizontal-wrap",
            "horizontal-align": "space-around",
            "appearance-occurrences": "card"
          });
        })
          .then(function () {
            // Step 2: Verify all properties are applied before reuse.
            expect(element.getAttribute("layout-type"), "layout-type should be 'horizontal-wrap' before reuse.").to.equal("horizontal-wrap");
            expect(element.getAttribute("horizontal-align"), "horizontal-align should be 'space-around' before reuse.").to.equal("space-around");
            expect(element.getAttribute("appearance"), "appearance should be 'card' before reuse.").to.equal("card");
          })
          .then(function () {
            // Step 3: Simulate Uniface widget reuse clean up the current occurrence, then re-initialize with defaults.
            occurrenceTester.dataCleanup();
            return asyncRun(function () {
              occurrenceTester.dataInit();
            });
          })
          .then(function () {
            // Step 4: Verify all properties and value are reset to defaults after reuse.
            expect(element.getAttribute("layout-type"), "layout-type should be reset to 'auto' after reuse.").to.equal("auto");
            expect(element.getAttribute("horizontal-align"), "horizontal-align should be reset to 'auto' after reuse.").to.equal("auto");
            expect(element.getAttribute("appearance"), "appearance should be reset to 'transparent' after reuse.").to.equal("transparent");
          });
      });
    });
  });
})();

