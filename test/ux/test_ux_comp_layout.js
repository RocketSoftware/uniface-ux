(function () {
  "use strict";

  const assert = chai.assert;
  const expect = chai.expect;
  const tester = new umockup.WidgetTester();
  const widgetId = tester.widgetId;
  const widgetName = tester.widgetName;
  const widgetClass = tester.getWidgetClass();
  const asyncRun = umockup.asyncRun;

  let mockObjDef = {
    "properties": {},
    "componentName": "test_comp_layout",
    "type": "component"
  };

  function verifyWidgetClass(widgetClass) {
    assert(
      widgetClass,
      `Widget class '${widgetName}' is not defined!
          Hint: Check if the JavaScript file defined class '${widgetName}' is loaded.`
    );
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
      expect(structure.tagName).to.equal("uf-layout");
      expect(structure.styleClass).to.equal("");
      expect(structure.elementQuerySelector).to.equal("");
      expect(structure.childWorkers).to.be.an("array");
    });
  });

  describe(`${widgetName}.processLayout()`, function () {
    let element;

    it("processLayout()", function () {
      verifyWidgetClass(widgetClass);
      element = tester.processLayout(mockObjDef);
      expect(element).to.have.tagName(tester.uxTagName);
    });

    describe("Checks", function () {
      before(function () {
        verifyWidgetClass(widgetClass);
        element = tester.processLayout(mockObjDef);
      });

      it("check instance of HTMLElement", function () {
        expect(element).instanceOf(HTMLElement, `Function processLayout() of ${widgetName} does not return an HTMLElement.`);
      });

      it("check registration of web component", function () {
        const customElementNames = ["uf-layout"];
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

      it("check label text element", function () {
        assert(element.querySelector("span.u-label-text"), "Component Layout widget misses or has incorrect u-label-text element.");
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
        assert(widgetClass.defaultValues["class:u-comp-layout"], "Class 'u-comp-layout' is not defined in defaultValues!");
      } catch (e) {
        assert(false, `Failed to construct new widget, exception ${e}.`);
      }
    });

    describe("onConnect()", function () {
      const element = tester.processLayout(mockObjDef);
      const widget = tester.onConnect();

      it("check that the element is created and connected", function () {
        assert(element, "Target element is not defined!");
        assert(widget.elements.widget === element, "Widget is not connected!");
      });
    });
  });

  describe("dataInit()", function () {
    const classes = tester.getDefaultClasses();
    let element;

    before(function () {
      tester.createWidget();
      tester.getDefaultValues();
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

    it("check default properties values", function () {
      assert.strictEqual(tester.defaultValues["label-size"], "normal", "Default value of 'label-size' should be 'normal'.");
      assert.strictEqual(tester.defaultValues["label-align"], "start", "Default value of 'label-alignment' should be 'start'.");
      assert.strictEqual(tester.defaultValues["label-position"], "above", "Default value of 'label-position' should be 'above'.");
      assert.strictEqual(tester.defaultValues["layout-type"], "vertical-scroll", "Default value of 'layout-type' should be 'vertical-scroll'.");
      assert.strictEqual(tester.defaultValues["horizontal-align"], "start", "Default value of 'horizontal-align' should be 'start'.");
      assert.strictEqual(tester.defaultValues["vertical-align"], "start", "Default value of 'vertical-align' should be 'start'.");
    });

    it("check gap property on root part", function () {
      const shadowRoot = element.shadowRoot;
      assert(shadowRoot, "Shadow root should exist.");
      const rootPart = shadowRoot.querySelector("[part='root']");
      assert(rootPart, "Root part should exist.");
      const styles = window.getComputedStyle(rootPart);
      assert(styles.gap, "Gap property should be set on root part.");
    });

    it("check padding property when used as main DSP", function () {
      const styles = window.getComputedStyle(element);
      assert(styles.paddingLeft || styles.paddingRight || styles.paddingTop || styles.paddingBottom, "Padding property should be set on layout element.");
    });
  });

  describe("mapTrigger()", function () {
    it("no test required", function () { });
  });

  describe("dataUpdate()", function () {
    let element;

    before(function () {
      return asyncRun(function () {
        tester.createWidget();
        element = tester.element;
      }).then(function () {
        assert(element, "Widget top element is not defined!");
      });
    });

    describe("update label-text, label-size, label-alignment, label-position", function () {
      it("update label-text and render as span by default", function () {
        const data = {
          "label-text": "Updated Layout"
        };
        return asyncRun(function () {
          tester.dataUpdate(data);
        }).then(function () {
          const labelElement = element.querySelector(".u-label-text");
          expect(labelElement.tagName).to.equal("SPAN");
          expect(labelElement.innerText).to.equal("Updated Layout");
        });
      });

      const labelSizeCases = [
        {
          "size": "small",
          "expectedTag": "H3"
        },
        {
          "size": "medium",
          "expectedTag": "H2"
        },
        {
          "size": "large",
          "expectedTag": "H1"
        }
      ];

      labelSizeCases.forEach(function (testCase) {
        it(`render label-text as ${testCase.expectedTag} when label-size is ${testCase.size}`, function () {
          const data = {
            "label-text": "Updated Layout",
            "label-size": testCase.size
          };
          return asyncRun(function () {
            tester.dataUpdate(data);
          }).then(function () {
            const labelElement = element.querySelector(".u-label-text");
            expect(labelElement.tagName).to.equal(testCase.expectedTag);
            expect(labelElement.innerText).to.equal("Updated Layout");
          });
        });
      });

      ["start", "center", "end"].forEach(function (alignment) {
        it(`update label-alignment to ${alignment}`, function () {
          const data = {
            "label-align": alignment
          };
          return asyncRun(function () {
            tester.dataUpdate(data);
          }).then(function () {
            expect(element.getAttribute("label-align")).to.equal(alignment);
          });
        });
      });

      ["below", "before", "above", "after"].forEach(function (position) {
        it(`update label-position to ${position}`, function () {
          const data = {
            "label-position": position
          };
          return asyncRun(function () {
            tester.dataUpdate(data);
          }).then(function () {
            expect(element.getAttribute("label-position")).to.equal(position);
          });
        });
      });
    });

    describe("update layout-type, horizontal-align, vertical-align", function () {
      const properties = [
        "layout-type",
        "horizontal-align",
        "vertical-align"
      ];
      properties.forEach(function (property) {
        it(`update ${property}`, function () {
          const data = {};
          switch (property) {
            case "layout-type":
              data[property] = "horizontal-wrap";
              break;
            case "horizontal-align":
              data[property] = "space-between";
              break;
            case "vertical-align":
              data[property] = "stretch";
              break;
          }
          return asyncRun(function () {
            tester.dataUpdate(data);
          }).then(function () {
            expect(element.getAttribute(property)).to.equal(data[property]);
          });
        });
      });

      it("update layout-type to 'auto'", function () {
        const data = { "layout-type": "auto" };
        return asyncRun(function () {
          tester.dataUpdate(data);
        }).then(function () {
          expect(element.getAttribute("layout-type")).to.equal("auto");
        });
      });

      it("update horizontal-align to 'auto'", function () {
        const data = { "horizontal-align": "auto" };
        return asyncRun(function () {
          tester.dataUpdate(data);
        }).then(function () {
          expect(element.getAttribute("horizontal-align")).to.equal("auto");
        });
      });

      it("update vertical-align to 'auto'", function () {
        const data = { "vertical-align": "auto" };
        return asyncRun(function () {
          tester.dataUpdate(data);
        }).then(function () {
          expect(element.getAttribute("vertical-align")).to.equal("auto");
        });
      });
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
