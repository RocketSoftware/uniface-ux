(function () {
  "use strict";

  const assert = chai.assert;
  const expect = chai.expect;

  // Collection Entity test setup.
  const collectionTester = new umockup.WidgetTester();
  const collectionWidgetId = collectionTester.widgetId;
  const collectionWidgetName = collectionTester.widgetName;
  const collectionWidgetClass = collectionTester.getWidgetClass();

  const asyncRun = umockup.asyncRun;
  const MockEntityDefinition = umockup.MockEntityDefinition;
  const createSkeleton = umockup.createSkeleton;

  // Create mock object definition based on the widget being tested.
  let mockObjDef = new MockEntityDefinition(
    "test_entity",
    "UX.CollectionLayout",
    "entity",
    {}
  );

  // Occurrence Entity setup.
  const occurrenceMockDef = new MockEntityDefinition("test_occ_entity", "UX.OccurrenceLayout", "entity", {});
  const occurrenceWidgetClass = occurrenceMockDef.getWidgetClass();
  const occurrenceWidgetName = occurrenceMockDef.widgetClassName;

  /**
   * Helper function to create a collection element with widget initialization.
   */
  function createCollectionWidget(objDef, skeletonId) {
    const skeleton = document.createElement("div");
    if (skeletonId) {
      skeleton.id = skeletonId;
    }
    const element = collectionWidgetClass.processLayout(skeleton, objDef);
    const widget = new collectionWidgetClass();
    widget.onConnect(element, objDef);
    widget.dataInit();
    return {
      "element": element,
      "widget": widget
    };
  }

  /**
   * Helper function to create an occurrence element with widget initialization.
   */
  function createOccurrenceWidget(objDef, skeletonId) {
    const skeleton = document.createElement("div");
    if (skeletonId) {
      skeleton.id = skeletonId;
    }
    const element = occurrenceWidgetClass.processLayout(skeleton, objDef);
    const widget = new occurrenceWidgetClass();
    widget.onConnect(element, objDef);
    widget.dataInit();
    return {
      "element": element,
      "widget": widget
    };
  }

  function verifyWidgetClass(widgetClass) {
    assert(
      widgetClass,
      `Widget class '${collectionWidgetName}' is not defined!
          Hint: Check if the JavaScript file defined class '${collectionWidgetName}' is loaded.`
    );
  }

  describe("Uniface mockup tests", function () {
    it(`get class ${collectionWidgetName}`, function () {
      verifyWidgetClass(collectionWidgetClass);
    });

    it(`get class ${occurrenceWidgetName}`, function () {
      verifyWidgetClass(occurrenceWidgetClass);
    });
  });

  describe("Uniface static structure constructor() definition", function () {

    describe("CollectionLayout specific", function () {
      it("should have a static property structure of type Element", function () {
        verifyWidgetClass(collectionWidgetClass);
        const structure = collectionWidgetClass.structure;

        expect(structure.constructor).to.be.an.instanceof(Element.constructor);
        expect(structure.tagName).to.equal("uf-layout");
        expect(structure.childWorkers).to.be.an("array");
      });

      it("should have correct styleClass", function () {
        const structure = collectionWidgetClass.structure;
        expect(structure.styleClass).to.equal("");
      });
    });

    describe("OccurrenceLayout specific", function () {
      it("should have a static property structure of type Element", function () {
        verifyWidgetClass(occurrenceWidgetClass);
        const structure = occurrenceWidgetClass.structure;

        expect(structure.constructor).to.be.an.instanceof(Element.constructor);
        expect(structure.tagName).to.equal("uf-layout");
        expect(structure.childWorkers).to.be.an("array");
      });

      it("should have correct styleClass", function () {
        const structure = occurrenceWidgetClass.structure;
        expect(structure.styleClass).to.equal("");
      });
    });
  });

  describe(`${collectionWidgetName}.processLayout()`, function () {
    let element;

    it("processLayout()", function () {
      verifyWidgetClass(collectionWidgetClass);
      element = collectionTester.processLayout(mockObjDef);
      expect(element).to.have.tagName(collectionTester.uxTagName);
    });

    describe("Checks", function () {
      before(function () {
        verifyWidgetClass(collectionWidgetClass);
        element = collectionTester.processLayout(mockObjDef);
      });

      it("check instance of HTMLElement", function () {
        expect(element).instanceOf(HTMLElement, `Function processLayout() of ${collectionWidgetName} does not return an HTMLElement.`);
      });

      it("check registration of web component", function () {
        const customElementNames = ["uf-layout"];
        for (const name of customElementNames) {
          assert(window.customElements.get(name), `Web component ${name} has not been registered!`);
        }
      });

      it("check tagName", function () {
        expect(element).to.have.tagName(collectionTester.uxTagName);
      });

      it("check id", function () {
        expect(element).to.have.id(collectionWidgetId);
      });

      it("check label text element for CollectionLayout", function () {
        assert(element.querySelector("span.u-label-text"), "CollectionLayout widget misses or has incorrect u-label-text element.");
      });

      it("check WidgetOccurrence placeholder for CollectionLayout", function () {
        const placeholder = element.querySelector("span[id*='uocc:']");
        assert(placeholder, "CollectionLayout should have a WidgetOccurrence placeholder span.");
      });
    });
  });

  describe(`${occurrenceWidgetName}.processLayout()`, function () {
    let element;

    it("processLayout()", function () {
      verifyWidgetClass(occurrenceWidgetClass);
      const occSkeleton = createSkeleton("test_occ_layout");
      element = occurrenceWidgetClass.processLayout(occSkeleton, occurrenceMockDef);
      expect(element).to.have.tagName("uf-layout");
    });

    describe("Checks", function () {

      it("check instance of HTMLElement", function () {
        expect(element).instanceOf(HTMLElement, `Function processLayout() of ${occurrenceWidgetName} does not return an HTMLElement.`);
      });

      it("check registration of web component", function () {
        const customElementNames = ["uf-layout"];
        for (const name of customElementNames) {
          assert(window.customElements.get(name), `Web component ${name} has not been registered!`);
        }
      });

      it("check tagName", function () {
        expect(element).to.have.tagName("uf-layout");
      });

      it("check id", function () {
        expect(element).to.have.id("test_occ_layout");
      });

      it("check no label element for OccurrenceLayout", function () {
        const labelElement = element.querySelector(".u-label-text");
        expect(labelElement).to.be.null;
      });
    });
  });

  describe("processLayout() - occurrence widget property handling", function () {

    /**
     * Extended mock entity definition that supports occurrence widget class lookup
     * and tracks calls to setOccurrenceProperties for asserting the new
     * occurrence property filtering logic in Widget.processLayout().
     */
    class MockEntityDefinitionWithOccurrence extends MockEntityDefinition {
      constructor(name, widgetClassName, type, properties, occurrenceWidgetClassName) {
        super(name, widgetClassName, type, properties);
        this._occurrenceWidgetClassName = occurrenceWidgetClassName !== undefined ? occurrenceWidgetClassName : null;
        this._occurrenceProperties = null;
        this._setOccurrencePropertiesCalled = false;
      }

      getOccurrenceWidgetClass() {
        return this._occurrenceWidgetClassName;
      }

      setOccurrenceProperties(properties) {
        this._setOccurrencePropertiesCalled = true;
        this._occurrenceProperties = properties;
      }
    }

    it("should call setOccurrenceProperties with matching occurrence properties when entity has a valid occurrence widget class", function () {
      const objDef = new MockEntityDefinitionWithOccurrence(
        "test_entity_with_occ",
        "UX.CollectionLayout",
        "entity",
        {
          "layout-type": "vertical-scroll",
          "horizontal-align": "center",
          "label-text": "Label Only"
        },
        "UX.OccurrenceLayout"
      );
      const skeleton = createSkeleton("uent:test_occ_prop_matching");
      collectionWidgetClass.processLayout(skeleton, objDef);

      assert(objDef._setOccurrencePropertiesCalled, "setOccurrenceProperties() should be called when matching occurrence properties exist.");
      expect(objDef._occurrenceProperties).to.be.an("object");
      expect(objDef._occurrenceProperties["layout-type"]).to.equal("vertical-scroll");
      expect(objDef._occurrenceProperties["horizontal-align"]).to.equal("center");
    });

    it("should not include non-occurrence properties in the setOccurrenceProperties call", function () {
      const objDef = new MockEntityDefinitionWithOccurrence(
        "test_entity_filtered_props",
        "UX.CollectionLayout",
        "entity",
        {
          "layout-type": "horizontal-scroll",
          "label-text": "Not an occ prop",
          "label-size": "large",
          "area-slot": "header"
        },
        "UX.OccurrenceLayout"
      );
      const skeleton = createSkeleton("uent:test_occ_prop_filtered");
      collectionWidgetClass.processLayout(skeleton, objDef);

      assert(objDef._setOccurrencePropertiesCalled, "setOccurrenceProperties() should be called when at least one matching property exists.");
      const occProps = objDef._occurrenceProperties;
      expect(occProps).to.have.key("layout-type");
      expect(occProps).to.not.have.key("label-text");
      expect(occProps).to.not.have.key("label-size");
      expect(occProps).to.not.have.key("area-slot");
    });

    it("should not call setOccurrenceProperties when no entity properties match the occurrence widget property IDs", function () {
      const objDef = new MockEntityDefinitionWithOccurrence(
        "test_entity_no_match",
        "UX.CollectionLayout",
        "entity",
        {
          "label-text": "Collection Label",
          "label-size": "large",
          "area-slot": "main"
        },
        "UX.OccurrenceLayout"
      );
      const skeleton = createSkeleton("uent:test_occ_prop_no_match");
      collectionWidgetClass.processLayout(skeleton, objDef);

      assert(!objDef._setOccurrencePropertiesCalled, "setOccurrenceProperties() should NOT be called when no properties match.");
    });

    it("should not call setOccurrenceProperties when getOccurrenceWidgetClass() returns null", function () {
      const objDef = new MockEntityDefinitionWithOccurrence(
        "test_entity_no_occ_class",
        "UX.CollectionLayout",
        "entity",
        {
          "layout-type": "vertical-scroll",
          "horizontal-align": "start"
        },
        null // no occurrence widget class
      );
      const skeleton = createSkeleton("uent:test_occ_prop_null_class");
      collectionWidgetClass.processLayout(skeleton, objDef);

      assert(!objDef._setOccurrencePropertiesCalled, "setOccurrenceProperties() should NOT be called when occurrence widget class is null.");
    });

    it("should skip occurrence property handling when objectDefinition type is not 'entity'", function () {
      const objDef = new MockEntityDefinitionWithOccurrence(
        "test_non_entity",
        "UX.CollectionLayout",
        "component", // not "entity"
        {
          "layout-type": "vertical-scroll"
        },
        "UX.OccurrenceLayout"
      );
      const skeleton = createSkeleton("uent:test_non_entity_elem"); // has uent: prefix, type check is the reason it is skipped
      collectionWidgetClass.processLayout(skeleton, objDef);

      assert(!objDef._setOccurrencePropertiesCalled, "setOccurrenceProperties() should NOT be called when objectDefinition type is not 'entity'.");
    });

    it("should call setOccurrenceProperties with all three matching occurrence property IDs", function () {
      const objDef = new MockEntityDefinitionWithOccurrence(
        "test_entity_all_occ_props",
        "UX.CollectionLayout",
        "entity",
        {
          "layout-type": "vertical-wrap",
          "horizontal-align": "evenly",
          "vertical-align": "end"
        },
        "UX.OccurrenceLayout"
      );
      const skeleton = createSkeleton("uent:test_occ_prop_all");
      collectionWidgetClass.processLayout(skeleton, objDef);

      assert(objDef._setOccurrencePropertiesCalled, "setOccurrenceProperties() should be called.");
      const occProps = objDef._occurrenceProperties;
      expect(occProps["layout-type"]).to.equal("vertical-wrap");
      expect(occProps["horizontal-align"]).to.equal("evenly");
      expect(occProps["vertical-align"]).to.equal("end");
      expect(Object.keys(occProps)).to.have.lengthOf(3, "All three occurrence properties should be present.");
    });

    it("should pass the correct property values to setOccurrenceProperties for each matched property", function () {
      const objDef = new MockEntityDefinitionWithOccurrence(
        "test_entity_prop_values",
        "UX.CollectionLayout",
        "entity",
        {
          "layout-type": "horizontal-wrap",
          "vertical-align": "stretch"
        },
        "UX.OccurrenceLayout"
      );
      const skeleton = createSkeleton("uent:test_occ_prop_values");
      collectionWidgetClass.processLayout(skeleton, objDef);

      assert(objDef._setOccurrencePropertiesCalled, "setOccurrenceProperties() should be called.");
      const occProps = objDef._occurrenceProperties;
      expect(occProps["layout-type"]).to.equal("horizontal-wrap", "Correct value for layout-type should be passed.");
      expect(occProps["vertical-align"]).to.equal("stretch", "Correct value for vertical-align should be passed.");
      expect(occProps).to.not.have.key("horizontal-align", "Only properties present in objectDefinition should be included.");
    });

    it("should not call setOccurrenceProperties when elementId does not start with 'uent:'", function () {
      const objDef = new MockEntityDefinitionWithOccurrence(
        "test_entity_wrong_prefix",
        "UX.CollectionLayout",
        "entity",
        {
          "layout-type": "vertical-scroll",
          "horizontal-align": "center"
        },
        "UX.OccurrenceLayout"
      );
      const skeleton = createSkeleton("ufld:test_occ_prop_wrong_prefix");
      collectionWidgetClass.processLayout(skeleton, objDef);

      assert(!objDef._setOccurrencePropertiesCalled, "setOccurrenceProperties() should NOT be called when elementId does not start with 'uent:'.");
    });
  });

  describe("Create widget", function () {
    before(function () {
      verifyWidgetClass(collectionWidgetClass);
      collectionTester.construct();
    });

    it("constructor()", function () {
      try {
        const widget = collectionTester.construct();
        assert(widget, "Widget is not defined!");
        verifyWidgetClass(collectionWidgetClass);
      } catch (e) {
        assert(false, `Failed to construct new widget, exception ${e}.`);
      }
    });

    describe("onConnect()", function () {
      const element = collectionTester.processLayout(mockObjDef);
      const widget = collectionTester.onConnect();

      it("check that the element is created and connected", function () {
        assert(element, "Target element is not defined!");
        assert(widget.elements.widget === element, "Widget is not connected!");
      });
    });
  });

  describe("dataInit()", function () {
    describe("CollectionLayout tests", function () {
      let element;

      before(function () {
        collectionTester.createWidget();
        collectionTester.getDefaultValues();
        element = collectionTester.element;
        assert(element, "Widget top element is not defined!");
      });

      it("check default properties values", function () {
        // CollectionLayout default values.
        assert.strictEqual(collectionTester.defaultValues["layout-type-occurrences"], "auto", "Default value of 'layout-type-occurrences' should be 'auto'.");
        assert.strictEqual(collectionTester.defaultValues["horizontal-align-occurrences"], "auto", "Default value of 'horizontal-align-occurrences' should be 'auto'.");
        assert.strictEqual(collectionTester.defaultValues["vertical-align-occurrences"], "auto", "Default value of 'vertical-align-occurrences' should be 'auto'.");
        assert.strictEqual(collectionTester.defaultValues["label-size"], "normal", "Default value of 'label-size' should be 'normal'.");
        assert.strictEqual(collectionTester.defaultValues["label-align"], "start", "Default value of 'label-align' should be 'start'.");
        assert.strictEqual(collectionTester.defaultValues["label-position"], "above", "Default value of 'label-position' should be 'above'.");
        assert.strictEqual(collectionTester.defaultValues["area-slot"], "main", "Default value of 'area-slot' should be 'main'.");
      });

      it("check u-coll-layout class is added after dataInit", function () {
        expect(element).to.have.class("u-coll-layout");
      });

      it("check show-label attribute is set to 'true' on the root element after dataInit", function () {
        expect(element.getAttribute("show-label")).to.equal("true", "The 'show-label' attribute should be 'true' on the root element after initialization.");
      });

      it("check default styles on root part", function () {
        const shadowRoot = element.shadowRoot;
        assert(shadowRoot, "Shadow root should exist.");
        const rootPart = shadowRoot.querySelector("[part='root']");
        assert(rootPart, "Root part should exist.");
        const styles = window.getComputedStyle(rootPart);
        assert(styles.gap, "Gap style should be set on root part.");
      });
    });

    describe("OccurrenceLayout tests", function () {
      let occElement;

      before(function () {
        const occMockDef = new MockEntityDefinition("test_occ_init", "UX.OccurrenceLayout", "entity", {});
        const result = createOccurrenceWidget(occMockDef, "test_occ_init_elem");
        occElement = result.element;
      });

      it("check default properties values", function () {
        // OccurrenceLayout default values.
        const occWidget = occElement.__widget;
        if (occWidget && occWidget.defaultValues) {
          expect(occWidget.defaultValues["layout-type"]).to.equal("auto", "Default value of 'layout-type' should be 'auto'.");
          expect(occWidget.defaultValues["horizontal-align"]).to.equal("auto", "Default value of 'horizontal-align' should be 'auto'.");
          expect(occWidget.defaultValues["vertical-align"]).to.equal("auto", "Default value of 'vertical-align' should be 'auto'.");

        }
      });

      it("check shadow root exists", function () {
        const shadowRoot = occElement.shadowRoot;
        assert(shadowRoot, "Shadow root should exist.");
      });

      it("check u-occ-layout class is added after dataInit", function () {
        expect(occElement).to.have.class("u-occ-layout");
      });

      it("check default styles on root part", function () {
        const shadowRoot = occElement.shadowRoot;
        assert(shadowRoot, "Shadow root should exist.");
        const rootPart = shadowRoot.querySelector("[part='root']");
        assert(occElement.classList.contains("u-occ-layout"), "OccurrenceLayout container class should exist.");
        const styleTarget = rootPart || occElement;
        const styles = window.getComputedStyle(styleTarget);
        assert(typeof styles.gap === "string", "Gap style property should be available.");
      });
    });
  });

  describe("dataUpdate()", function () {
    let element;

    before(function () {
      return asyncRun(function () {
        collectionTester.createWidget();
        element = collectionTester.element;
      }).then(function () {
        assert(element, "Widget top element is not defined!");
      });
    });

    describe("CollectionLayout properties", function () {
      describe("Label properties", function () {
        it("update label-text", function () {
          const data = {
            "label-text": "Collection Label"
          };
          return asyncRun(function () {
            collectionTester.dataUpdate(data);
          }).then(function () {
            const labelElement = element.querySelector(".u-label-text");
            expect(labelElement).to.exist;
            expect(labelElement.textContent).to.equal("Collection Label");
          });
        });

        ["small", "medium", "large", "normal"].forEach(function (size) {
          it(`update label-size to ${size}`, function () {
            const data = {
              "label-size": size
            };
            return asyncRun(function () {
              collectionTester.dataUpdate(data);
            }).then(function () {
              expect(element.getAttribute("label-size")).to.equal(size);
            });
          });
        });

        ["start", "center", "end"].forEach(function (alignment) {
          it(`update label-align to ${alignment}`, function () {
            const data = {
              "label-align": alignment
            };
            return asyncRun(function () {
              collectionTester.dataUpdate(data);
            }).then(function () {
              expect(element.getAttribute("label-align")).to.equal(alignment);
            });
          });
        });

        ["above", "below", "before", "after"].forEach(function (position) {
          it(`update label-position to ${position}`, function () {
            const data = {
              "label-position": position
            };
            return asyncRun(function () {
              collectionTester.dataUpdate(data);
            }).then(function () {
              expect(element.getAttribute("label-position")).to.equal(position);
            });
          });
        });

        it("apply multiple label properties together", function () {
          const data = {
            "label-text": "Combined Test",
            "label-size": "large",
            "label-align": "center",
            "label-position": "below"
          };
          return asyncRun(function () {
            collectionTester.dataUpdate(data);
          }).then(function () {
            expect(collectionTester.element.getAttribute("label-size")).to.equal("large");
            expect(collectionTester.element.getAttribute("label-align")).to.equal("center");
            expect(collectionTester.element.getAttribute("label-position")).to.equal("below");
            const labelElement = collectionTester.element.querySelector(".u-label-text");
            expect(labelElement).to.exist;
            expect(labelElement.textContent).to.equal("Combined Test");
          });
        });

        it("update label-text to empty string hides the label span", function () {
          return asyncRun(function () {
            collectionTester.dataUpdate({ "label-text": "Some Label" });
          }).then(function () {
            return asyncRun(function () {
              collectionTester.dataUpdate({ "label-text": "" });
            });
          }).then(function () {
            const labelElement = element.querySelector(".u-label-text");
            expect(labelElement).to.exist;
            expect(labelElement.hidden).to.be.true;
          });
        });

        it("update label-text to null hides the label span", function () {
          return asyncRun(function () {
            collectionTester.dataUpdate({ "label-text": "Some Label" });
          }).then(function () {
            return asyncRun(function () {
              collectionTester.dataUpdate({ "label-text": null });
            });
          }).then(function () {
            const labelElement = element.querySelector(".u-label-text");
            expect(labelElement).to.exist;
            expect(labelElement.hidden).to.be.true;
          });
        });

        it("update label-text to the string 'null' shows the label span with text 'null'", function () {
          return asyncRun(function () {
            collectionTester.dataUpdate({ "label-text": "null" });
          }).then(function () {
            const labelElement = element.querySelector(".u-label-text");
            expect(labelElement).to.exist;
            expect(labelElement.hidden).to.be.false;
            expect(labelElement.textContent).to.equal("null");
          });
        });

        it("update label-text to a very long text shows the label span with the full text", function () {
          const longText = "This is a very long label of WIDGET and the question is, will it wrap or not?";
          return asyncRun(function () {
            collectionTester.dataUpdate({ "label-text": longText });
          }).then(function () {
            const labelElement = element.querySelector(".u-label-text");
            expect(labelElement).to.exist;
            expect(labelElement.hidden).to.be.false;
            expect(labelElement.textContent).to.equal(longText);
          });
        });
      });

      describe("Container properties", function () {
        ["main", "header", "footer"].forEach(function (slot) {
          it(`update area-slot to ${slot}`, function () {
            const data = {
              "area-slot": slot
            };
            return asyncRun(function () {
              collectionTester.dataUpdate(data);
            }).then(function () {
              expect(element.getAttribute("area-slot")).to.equal(slot);
            });
          });
        });
      });

      describe("Layout properties", function () {
        const layoutTypes = ["vertical-scroll", "horizontal-scroll", "horizontal-wrap", "vertical-wrap", "auto"];
        layoutTypes.forEach(function (layoutType) {
          it(`update layout-type to ${layoutType}`, function () {
            const data = {
              "layout-type-occurrences": layoutType
            };
            return asyncRun(function () {
              collectionTester.dataUpdate(data);
            }).then(function () {
              expect(element.getAttribute("layout-type")).to.equal(layoutType);
            });
          });
        });

        ["start", "center", "end", "space-between", "space-around", "space-evenly", "stretch", "auto"].forEach(function (alignment) {
          it(`update horizontal-align to ${alignment}`, function () {
            const data = {
              "horizontal-align-occurrences": alignment
            };
            return asyncRun(function () {
              collectionTester.dataUpdate(data);
            }).then(function () {
              expect(element.getAttribute("horizontal-align")).to.equal(alignment);
            });
          });
        });

        ["start", "center", "end", "space-between", "space-around", "space-evenly", "stretch", "auto"].forEach(function (alignment) {
          it(`update vertical-align to ${alignment}`, function () {
            const data = {
              "vertical-align-occurrences": alignment
            };
            return asyncRun(function () {
              collectionTester.dataUpdate(data);
            }).then(function () {
              expect(element.getAttribute("vertical-align")).to.equal(alignment);
            });
          });
        });
      });

      describe("Combined and independent property updates", function () {
        it("should apply multiple layout properties together for CollectionLayout", function () {
          const data = {
            "layout-type-occurrences": "vertical-scroll",
            "horizontal-align-occurrences": "center",
            "vertical-align-occurrences": "stretch"
          };
          return asyncRun(function () {
            collectionTester.dataUpdate(data);
          }).then(function () {
            expect(element.getAttribute("layout-type")).to.equal("vertical-scroll");
            expect(element.getAttribute("horizontal-align")).to.equal("center");
            expect(element.getAttribute("vertical-align")).to.equal("stretch");
          });
        });

        it("should update layout properties independently for CollectionLayout", function () {
          const data1 = { "layout-type-occurrences": "horizontal-scroll" };

          return asyncRun(function () {
            collectionTester.dataUpdate(data1);
          }).then(function () {
            expect(element.getAttribute("layout-type")).to.equal("horizontal-scroll");
            const data2 = { "horizontal-align-occurrences": "end" };
            return asyncRun(function () {
              collectionTester.dataUpdate(data2);
            });
          }).then(function () {
            expect(element.getAttribute("layout-type")).to.equal("horizontal-scroll");
            expect(element.getAttribute("horizontal-align")).to.equal("end");
          });
        });
      });
    });

    describe("OccurrenceLayout properties", function () {
      let occElement;
      let occWidget;

      before(function () {
        if (!occurrenceWidgetClass) {
          this.skip();
        }
        return asyncRun(function () {
          const occMockDef = new MockEntityDefinition("test_occ_update", "UX.OccurrenceLayout", "entity", {});
          const result = createOccurrenceWidget(occMockDef, "test_occ_update_elem");
          occElement = result.element;
          occWidget = result.widget;
        });
      });

      describe("Structural verification", function () {
        it("should not have label element for OccurrenceLayout", function () {
          const labelElement = occElement.querySelector(".u-label-text");
          expect(labelElement).to.be.null;
        });
      });

      describe("Layout properties", function () {
        const layoutTypes = ["vertical-scroll", "horizontal-scroll", "horizontal-wrap", "vertical-wrap", "auto"];
        layoutTypes.forEach(function (layoutType) {
          it(`update layout-type to ${layoutType}`, function () {
            const data = {
              "layout-type": layoutType
            };
            return asyncRun(function () {
              occWidget.dataUpdate(data);
            }).then(function () {
              expect(occElement.getAttribute("layout-type")).to.equal(layoutType);
            });
          });
        });
        ["start", "center", "end", "space-between", "space-around", "space-evenly", "stretch", "auto"].forEach(function (alignment) {
          it(`update horizontal-align to ${alignment}`, function () {
            const data = {
              "horizontal-align": alignment
            };
            return asyncRun(function () {
              occWidget.dataUpdate(data);
            }).then(function () {
              expect(occElement.getAttribute("horizontal-align")).to.equal(alignment);
            });
          });
        });

        ["start", "center", "end", "space-between", "space-around", "space-evenly", "stretch", "auto"].forEach(function (alignment) {
          it(`update occurrence:vertical-align to ${alignment}`, function () {
            const data = {
              "vertical-align": alignment

            };
            return asyncRun(function () {
              occWidget.dataUpdate(data);
            }).then(function () {
              expect(occElement.getAttribute("vertical-align")).to.equal(alignment);
            });
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
            occWidget.dataUpdate(data);
          }).then(function () {
            expect(occElement.getAttribute("layout-type")).to.equal("horizontal-wrap");
            expect(occElement.getAttribute("horizontal-align")).to.equal("space-between");
            expect(occElement.getAttribute("vertical-align")).to.equal("end");
          });
        });

        it("should update layout properties independently for OccurrenceLayout", function () {
          const data1 = { "layout-type": "horizontal-scroll" };

          return asyncRun(function () {
            occWidget.dataUpdate(data1);
          }).then(function () {
            expect(occElement.getAttribute("layout-type")).to.equal("horizontal-scroll");

            const data2 = { "horizontal-align": "end" };

            return asyncRun(function () {
              occWidget.dataUpdate(data2);
            });
          }).then(function () {
            expect(occElement.getAttribute("layout-type")).to.equal("horizontal-scroll");
            expect(occElement.getAttribute("horizontal-align")).to.equal("end");
          });
        });
      });
    });
  });

  /**
   * CollectionLayout always renders with show-label="true" and a label section
   * above the content area. These tests verify that .root sizes to the remaining
   * space after the label, rather than consuming the full host height.
   */
  describe("Label and Root Space Distribution", function () {
    let element;

    before(function () {
      return asyncRun(function () {
        collectionTester.createWidget();
        element = collectionTester.element;
      }).then(function () {
        assert(element, "Widget top element is not defined.");
      });
    });

    afterEach(function () {
      element.style.height = "";
    });

    it("should have flex-grow 1 on .root so remaining space fills correctly after siblings", function () {
      // Wait for a render frame so computed styles reflect the current layout.
      return asyncRun(function () {}).then(function () {
        const shadowRoot = element.shadowRoot;
        assert(shadowRoot, "Shadow root should exist.");
        const rootPart = shadowRoot.querySelector("[part='root']");
        assert(rootPart, "Root part should exist.");
        // flex: 1 ... auto sets flex-grow to 1; height: 100% must not be present to allow correct flex sizing.
        expect(window.getComputedStyle(rootPart).flexGrow).to.equal("1");
      });
    });

    it("should size .root below the full host height when a label is present", function () {
      return asyncRun(function () {
        element.style.height = "300px";
        collectionTester.dataUpdate({
          "label-text": "Test Label"
        });
      }).then(function () {
        const shadowRoot = element.shadowRoot;
        const rootPart = shadowRoot.querySelector("[part='root']");
        const labelPart = shadowRoot.querySelector("[part='label']");
        assert(rootPart, "Root part should exist.");
        // .root must leave room for the label section; it must not consume the full host height.
        if (labelPart && labelPart.offsetHeight > 0) {
          expect(rootPart.offsetHeight).to.be.lessThan(element.clientHeight);
        }
      });
    });

    it("should not allow .root and label heights to exceed the host height", function () {
      return asyncRun(function () {
        element.style.height = "300px";
        collectionTester.dataUpdate({
          "label-text": "Test Label"
        });
      }).then(function () {
        const shadowRoot = element.shadowRoot;
        const rootPart = shadowRoot.querySelector("[part='root']");
        const labelPart = shadowRoot.querySelector("[part='label']");
        assert(rootPart, "Root part should exist.");
        assert(labelPart, "Label part should exist when label-text is set.");
        const totalHeight = rootPart.offsetHeight + labelPart.offsetHeight;
        // Combined height of .root and .label must fit within the host boundaries.
        expect(totalHeight).to.be.at.most(element.clientHeight);
      });
    });

    it("should leave space for the label when label-position is below", function () {
      return asyncRun(function () {
        element.style.height = "300px";
        collectionTester.dataUpdate({
          "label-text": "Test Label",
          "label-position": "below"
        });
      }).then(function () {
        const shadowRoot = element.shadowRoot;
        const rootPart = shadowRoot.querySelector("[part='root']");
        const labelPart = shadowRoot.querySelector("[part='label']");
        assert(rootPart, "Root part should exist.");
        // With label-position below, .root must still accommodate the label; full host height is not consumed.
        if (labelPart && labelPart.offsetHeight > 0) {
          expect(rootPart.offsetHeight).to.be.lessThan(element.clientHeight);
        }
      });
    });

    it("should size .root below the full host height when vertical-align is end and label is present", function () {
      return asyncRun(function () {
        element.style.height = "300px";
        collectionTester.dataUpdate({
          "label-text": "Test Label",
          "label-position": "above",
          "layout-type": "vertical-scroll",
          "vertical-align": "end"
        });
      }).then(function () {
        const shadowRoot = element.shadowRoot;
        const rootPart = shadowRoot.querySelector("[part='root']");
        const labelPart = shadowRoot.querySelector("[part='label']");
        assert(rootPart, "Root part should exist.");
        // With vertical-align=end, .root must not overflow the host; flex-grow fills remaining space correctly.
        if (labelPart && labelPart.offsetHeight > 0) {
          expect(rootPart.offsetHeight).to.be.lessThan(element.clientHeight);
        }
      });
    });

    it("should size .root below the full host height when vertical-align is center and label is present", function () {
      return asyncRun(function () {
        element.style.height = "300px";
        collectionTester.dataUpdate({
          "label-text": "Test Label",
          "label-position": "above",
          "vertical-align": "center"
        });
      }).then(function () {
        const shadowRoot = element.shadowRoot;
        const rootPart = shadowRoot.querySelector("[part='root']");
        const labelPart = shadowRoot.querySelector("[part='label']");
        assert(rootPart, "Root part should exist.");
        // .root must leave room for the label regardless of vertical-align value.
        if (labelPart && labelPart.offsetHeight > 0) {
          expect(rootPart.offsetHeight).to.be.lessThan(element.clientHeight);
        }
      });
    });

    it("should not affect .root sizing when label-position is before", function () {
      return asyncRun(function () {
        element.style.height = "300px";
        collectionTester.dataUpdate({
          "label-text": "Test Label",
          "label-position": "before"
        });
      }).then(function () {
        const shadowRoot = element.shadowRoot;
        const rootPart = shadowRoot.querySelector("[part='root']");
        assert(rootPart, "Root part should exist.");
        // In row direction, label sits beside .root; the fix (removing height: 100%) does not affect this axis.
        expect(window.getComputedStyle(element).flexDirection).to.equal("row");
        // In row direction both label and .root stretch to the full host height via align-self: stretch.
        // The -1 tolerance accounts for sub-pixel rounding between offsetHeight (integer) and clientHeight.
        expect(rootPart.offsetHeight).to.be.at.least(element.clientHeight - 1);
      });
    });

    it("should not affect .root sizing when label-position is after", function () {
      return asyncRun(function () {
        element.style.height = "300px";
        collectionTester.dataUpdate({
          "label-text": "Test Label",
          "label-position": "after"
        });
      }).then(function () {
        const shadowRoot = element.shadowRoot;
        const rootPart = shadowRoot.querySelector("[part='root']");
        assert(rootPart, "Root part should exist.");
        // In row direction, label sits beside .root; the fix (removing height: 100%) does not affect this axis.
        expect(window.getComputedStyle(element).flexDirection).to.equal("row");
        // In row direction both label and .root stretch to the full host height via align-self: stretch.
        // The -1 tolerance accounts for sub-pixel rounding between offsetHeight (integer) and clientHeight.
        expect(rootPart.offsetHeight).to.be.at.least(element.clientHeight - 1);
      });
    });
  });

  describe("Collection and Occurrence combination behavior", function () {
    // Common class references used across all tests in this section.
    const CollectionLayoutClass = collectionWidgetClass;
    const OccurrenceLayoutClass = occurrenceWidgetClass;

    describe("Create Collection with Occurrences", function () {
      let collectionElement;

      it("should create a collection with multiple occurrence children", function () {
        const collectionObjDef = new MockEntityDefinition("test_collection", "UX.CollectionLayout", "entity", {}, []);
        const occurrenceDefs = [
          new MockEntityDefinition("occurrence_1", "UX.OccurrenceLayout", "entity", {}),
          new MockEntityDefinition("occurrence_2", "UX.OccurrenceLayout", "entity", {}),
          new MockEntityDefinition("occurrence_3", "UX.OccurrenceLayout", "entity", {})
        ];

        const collectionResult = createCollectionWidget(collectionObjDef, "collection_test_id");
        collectionElement = collectionResult.element;

        expect(collectionElement).to.exist;
        expect(collectionElement).to.have.tagName("UF-layout");
        expect(collectionElement).to.have.class("u-coll-layout");

        // Create occurrence elements with full widget initialization.
        const occElements = occurrenceDefs.map(function (def, idx) {
          const occResult = createOccurrenceWidget(def, "occ_" + (idx + 1) + "_skeleton");
          return occResult.element;
        });

        // Verify each occurrence is of type OccurrenceLayout.
        occElements.forEach(occ => {
          expect(occ).to.have.class("u-occ-layout");
        });
      });

      it("should have the correct structure for collection with occurrences", function () {
        const collectionObjDef = new MockEntityDefinition("test_collection", "UX.CollectionLayout", "entity", {}, []);
        collectionElement = CollectionLayoutClass.processLayout(createSkeleton("collection_struct_test"), collectionObjDef);

        // Verify collection has label element.
        const labelElement = collectionElement.querySelector(".u-label-text");
        assert(labelElement, "Collection should have a label element.");

        // Verify collection has occurrence placeholder.
        const occurrencePlaceholder = collectionElement.querySelector("span[id*='uocc:']");
        assert(occurrencePlaceholder, "Collection should have occurrence placeholder.");
      });

      it("should handle adding occurrence elements to collection", function () {
        const occurrence1 = new MockEntityDefinition("occurrence_1", "UX.OccurrenceLayout", "entity", {});
        const collectionObjDef = new MockEntityDefinition("test_collection", "UX.CollectionLayout", "entity", {}, []);

        // Create collection and occurrence elements with full widget initialization.
        const collectionResult = createCollectionWidget(collectionObjDef, "collection_add_occ_test");
        const collectionElement = collectionResult.element;
        const occurrenceResult = createOccurrenceWidget(occurrence1, "occ_1");
        const occurrenceElement = occurrenceResult.element;

        expect(collectionElement).to.exist;
        expect(collectionElement).to.have.tagName("UF-layout");
        expect(collectionElement).to.have.class("u-coll-layout");

        // Verify it can be appended to collection element.
        collectionElement.appendChild(occurrenceElement);
        const addedOccurrence = collectionElement.querySelector(".u-occ-layout");

        assert(addedOccurrence, "Occurrence should be added to collection.");
        expect(addedOccurrence).to.have.tagName("UF-layout");
        expect(addedOccurrence).to.have.class("u-occ-layout");
        expect(addedOccurrence.id).to.equal("occ_1");
      });

      it("should support multiple occurrences in a collection", function () {
        const occurrenceDefs = [
          new MockEntityDefinition("occurrence_1", "UX.OccurrenceLayout", "entity", {}),
          new MockEntityDefinition("occurrence_2", "UX.OccurrenceLayout", "entity", {}),
          new MockEntityDefinition("occurrence_3", "UX.OccurrenceLayout", "entity", {})
        ];
        const collectionObjDef = new MockEntityDefinition("test_collection", "UX.CollectionLayout", "entity", {}, []);

        // Create collection with widget (not used, only testing occurrence creation).
        createCollectionWidget(collectionObjDef, "collection_multi_occ_test");

        // Create multiple occurrence elements with full widget initialization.
        const occurrences = occurrenceDefs.map(function (def, idx) {
          const occResult = createOccurrenceWidget(def, "occ_" + (idx + 1));
          return occResult.element;
        });

        // Verify all occurrences were created.
        expect(occurrences).to.have.lengthOf(3);
        occurrences.forEach((occ, index) => {
          expect(occ).to.have.class("u-occ-layout");
          expect(occ).to.have.tagName("UF-layout");
          expect(occ.id).to.equal(`occ_${index + 1}`);
        });
      });
    });

    describe("Collection and Occurrence property interactions", function () {
      let collectionElement;
      let collectionWidget;
      let occurrenceElement;
      let occurrenceWidget;

      before(function () {
        return asyncRun(function () {
          // Create collection.
          const collectionObjDef = new MockEntityDefinition("test_collection", "UX.CollectionLayout", "entity", {}, []);
          const collectionResult = createCollectionWidget(collectionObjDef, "prop_collection_test");
          collectionElement = collectionResult.element;
          collectionWidget = collectionResult.widget;

          // Create occurrence.
          const occObjDef = new MockEntityDefinition("occurrence_1", "UX.OccurrenceLayout", "entity", {});
          const occResult = createOccurrenceWidget(occObjDef, "prop_occ_test");
          occurrenceElement = occResult.element;
          occurrenceWidget = occResult.widget;

          // Add occurrence to collection.
          collectionElement.appendChild(occurrenceElement);
        });
      });

      it("should update collection properties without affecting occurrence", async function () {
        const collectionData = {
          "label-text": "Collection Label",
          "layout-type-occurrences": "horizontal-scroll",
          "horizontal-align-occurrences": "center"
        };

        await asyncRun(function () {
          collectionWidget.dataUpdate(collectionData);
        });

        const shadowRoot = collectionElement.shadowRoot;
        const labelElement = shadowRoot?.querySelector(".u-label-text");

        // Verify label text is correctly set.
        if (labelElement) {
          expect(labelElement.textContent).to.equal("Collection Label", "Label text should match.");
        }

        // Verify collection attributes are correctly set.
        expect(collectionElement.getAttribute("layout-type")).to.equal("horizontal-scroll", "The layout-type should be horizontal-scroll.");
        expect(collectionElement.getAttribute("horizontal-align")).to.equal("center", "The horizontal-align should be center.");

        // Verify occurrence is still present and unchanged.
        const occInCollection = collectionElement.querySelector(".u-occ-layout");
        expect(occInCollection).to.exist;

        // Verify occurrence attributes are not affected.
        expect(occurrenceElement.getAttribute("layout-type")).to.not.equal("horizontal-scroll", "Occurrence layout-type should not be affected.");
      });

      it("should update occurrence properties without affecting collection", async function () {
        const occurrenceData = {
          "layout-type": "horizontal-wrap",
          "horizontal-align": "start",
          "vertical-align": "stretch"
        };

        await asyncRun(function () {
          occurrenceWidget.dataUpdate(occurrenceData);
        });

        // Verify occurrence element exists.
        expect(occurrenceElement).to.exist;
        expect(occurrenceElement).to.have.class("u-occ-layout");

        // Verify occurrence attributes are correctly set.
        expect(occurrenceElement.getAttribute("layout-type")).to.equal("horizontal-wrap", "Occurrence layout-type should be horizontal-wrap.");
        expect(occurrenceElement.getAttribute("horizontal-align")).to.equal("start", "Occurrence main-axis-alignment should be start.");
        expect(occurrenceElement.getAttribute("vertical-align")).to.equal("stretch", "Occurrence cross-axis-alignment should be stretch.");

        // Verify collection is unchanged.
        expect(collectionElement).to.have.class("u-coll-layout");
        const collectionLayout = collectionElement.getAttribute("layout-type");
        expect(collectionLayout).to.not.equal("horizontal-wrap", "Collection layout should not be affected by occurrence update.");
      });

      it("should support different layout types on collection and occurrence", async function () {
        const collectionData = {
          "layout-type-occurrences": "horizontal-scroll",
          "horizontal-align-occurrences": "space-between",
          "vertical-align-occurrences": "center"
        };
        const occurrenceData = {
          "layout-type": "vertical-wrap",
          "horizontal-align": "space-evenly",
          "vertical-align": "end"
        };

        await asyncRun(function () {
          collectionWidget.dataUpdate(collectionData);
          occurrenceWidget.dataUpdate(occurrenceData);
        });

        // Both should maintain their respective structure.
        expect(collectionElement).to.have.class("u-coll-layout");
        expect(occurrenceElement).to.have.class("u-occ-layout");

        // Verify collection attributes.
        expect(collectionElement.getAttribute("layout-type")).to.equal("horizontal-scroll", "Collection should have horizontal-scroll layout.");
        expect(collectionElement.getAttribute("horizontal-align")).to.equal("space-between", "Collection should have space-between alignment.");
        expect(collectionElement.getAttribute("vertical-align")).to.equal("center", "Collection should have center cross-axis alignment.");

        // Verify occurrence attributes are different.
        expect(occurrenceElement.getAttribute("layout-type")).to.equal("vertical-wrap", "Occurrence should have vertical-wrap layout.");
        expect(occurrenceElement.getAttribute("horizontal-align")).to.equal("space-evenly", "Occurrence should have space-evenly alignment.");
        expect(occurrenceElement.getAttribute("vertical-align")).to.equal("end", "Occurrence should have end cross-axis alignment.");

        // Verify they are independent.
        expect(collectionElement.getAttribute("layout-type")).to.not.equal(occurrenceElement.getAttribute("layout-type"));
      });

      it("should maintain hierarchy when updating both collection and occurrence", async function () {
        const collectionData = {
          "label-text": "Parent Collection",
          "layout-type-occurrences": "vertical-scroll",
          "horizontal-align-occurrences": "start"
        };
        const occurrenceData = {
          "layout-type": "horizontal-wrap",
          "vertical-align": "center"
        };

        await asyncRun(function () {
          collectionWidget.dataUpdate(collectionData);
          occurrenceWidget.dataUpdate(occurrenceData);
        });

        // Verify collection has its label.
        const labelElement = collectionElement?.querySelector(".u-label-text");
        if (labelElement) {
          expect(labelElement.textContent).to.equal("Parent Collection");
        }
        expect(collectionElement.getAttribute("layout-type")).to.equal("vertical-scroll");
        expect(collectionElement.getAttribute("horizontal-align")).to.equal("start");

        // Verify occurrence is still nested in collection.
        const occInCollection = collectionElement.querySelector(".u-occ-layout");
        expect(occInCollection).to.exist;
        expect(occInCollection.getAttribute("layout-type")).to.equal("horizontal-wrap");
        expect(occInCollection.getAttribute("vertical-align")).to.equal("center");
      });
    });

    describe("Collection layout with nested occurrences", function () {
      before(function () {
        if (!CollectionLayoutClass || !OccurrenceLayoutClass) {
          this.skip();
        }
      });

      it("should handle collection with single occurrence", async function () {
        const occurrence1 = new MockEntityDefinition("single_occurrence", "UX.OccurrenceLayout", "entity", {});
        const collectionObjDef = new MockEntityDefinition("single_occ_collection", "UX.CollectionLayout", "entity", {}, []);

        // Create collection and occurrence with widgets.
        const collectionResult = createCollectionWidget(collectionObjDef, "single_occ_test");
        const collectionElement = collectionResult.element;
        const collectionWidget = collectionResult.widget;
        const occResult = createOccurrenceWidget(occurrence1, "single_occ_elem");
        const occElement = occResult.element;
        const occWidget = occResult.widget;

        // Add occurrence to collection.
        collectionElement.appendChild(occElement);
        const addedOcc = collectionElement.querySelector(".u-occ-layout");
        expect(addedOcc).to.exist;

        // Test property updates on both collection and single occurrence.
        await asyncRun(function () {
          collectionWidget.dataUpdate({
            "label-text": "Single Occurrence Collection",
            "layout-type-occurrences": "vertical-scroll",
            "label-size": "large",
            "label-position": "above"
          });

          occWidget.dataUpdate({
            "layout-type": "horizontal-wrap",
            "horizontal-align": "center",
            "vertical-align": "stretch"
          });
        });

        const shadowRoot = collectionElement.shadowRoot;
        // Verify collection properties.
        const labelElement = shadowRoot.querySelector(".u-label-text");
        if (labelElement) {
          expect(labelElement.textContent).to.equal("Single Occurrence Collection");
        }
        expect(collectionElement.getAttribute("layout-type")).to.equal("vertical-scroll");
        expect(collectionElement.getAttribute("label-size")).to.equal("large");
        expect(collectionElement.getAttribute("label-position")).to.equal("above");

        // Verify occurrence properties.
        expect(occElement.getAttribute("layout-type")).to.equal("horizontal-wrap");
        expect(occElement.getAttribute("horizontal-align")).to.equal("center");
        expect(occElement.getAttribute("vertical-align")).to.equal("stretch");

        // Verify both elements coexist properly.
        const occurrences = collectionElement.querySelectorAll(".u-occ-layout");
        expect(occurrences).to.have.lengthOf(1, "Should have exactly 1 occurrence element.");
      });

      it("should handle nested collection structure (collection inside occurrence inside collection)", async function () {
        // Create definitions.
        const innerOccurrence = new MockEntityDefinition("inner_occurrence", "UX.OccurrenceLayout", "entity", {});
        const innerCollection = new MockEntityDefinition("inner_collection", "UX.CollectionLayout", "entity", {}, []);
        const outerOccurrence = new MockEntityDefinition("outer_occurrence", "UX.OccurrenceLayout", "entity", {}, []);
        const outerCollectionObjDef = new MockEntityDefinition("outer_collection", "UX.CollectionLayout", "entity", {}, []);

        // Create outer collection with widget.
        const outerCollResult = createCollectionWidget(outerCollectionObjDef, "nested_outer_collection");
        const outerCollElement = outerCollResult.element;
        const outerCollWidget = outerCollResult.widget;
        expect(outerCollElement).to.exist;
        expect(outerCollElement).to.have.class("u-coll-layout");

        // Create outer occurrence with widget.
        const outerOccResult = createOccurrenceWidget(outerOccurrence, "nested_outer_occurrence");
        const outerOccElement = outerOccResult.element;
        const outerOccWidget = outerOccResult.widget;
        expect(outerOccElement).to.exist;
        expect(outerOccElement).to.have.class("u-occ-layout");

        // Add outer occurrence to outer collection.
        outerCollElement.appendChild(outerOccElement);
        const outerCollShadowRoot = outerCollElement.shadowRoot;

        // Create inner collection with widget.
        const innerCollResult = createCollectionWidget(innerCollection, "nested_inner_collection");
        const innerCollElement = innerCollResult.element;
        const innerCollWidget = innerCollResult.widget;
        expect(innerCollElement).to.exist;
        expect(innerCollElement).to.have.class("u-coll-layout");

        // Add inner collection to outer occurrence.
        outerOccElement.appendChild(innerCollElement);

        // Create inner occurrence with widget.
        const innerOccResult = createOccurrenceWidget(innerOccurrence, "nested_inner_occurrence");
        const innerOccElement = innerOccResult.element;
        const innerOccWidget = innerOccResult.widget;
        expect(innerOccElement).to.exist;
        expect(innerOccElement).to.have.class("u-occ-layout");

        // Add inner occurrence to inner collection.
        innerCollElement.appendChild(innerOccElement);
        const innerCollShadowRoot = innerCollElement.shadowRoot;

        // Verify nested DOM structure.
        const outerOcc = outerCollElement.querySelector(".u-occ-layout");
        expect(outerOcc).to.exist;
        expect(outerOcc.id).to.equal("nested_outer_occurrence");

        const innerColl = outerOccElement.querySelector(".u-coll-layout");
        expect(innerColl).to.exist;
        expect(innerColl.id).to.equal("nested_inner_collection");

        const innerOcc = innerCollElement.querySelector(".u-occ-layout");
        expect(innerOcc).to.exist;
        expect(innerOcc.id).to.equal("nested_inner_occurrence");

        // Test property updates at each level.
        await asyncRun(function () {
          outerCollWidget.dataUpdate({
            "label-text": "Outer Collection",
            "layout-type-occurrences": "vertical-scroll",
            "label-size": "large"
          });

          outerOccWidget.dataUpdate({
            "layout-type": "horizontal-wrap",
            "horizontal-align": "start"
          });

          innerCollWidget.dataUpdate({
            "label-text": "Inner Collection",
            "layout-type-occurrences": "horizontal-scroll",
            "label-size": "small"
          });

          innerOccWidget.dataUpdate({
            "layout-type": "vertical-wrap",
            "horizontal-align": "center"
          });
        });

        // Verify outer collection properties.
        expect(outerCollElement.getAttribute("layout-type")).to.equal("vertical-scroll", "Outer collection layout-type should be vertical-scroll.");
        expect(outerCollElement.getAttribute("label-size")).to.equal("large", "Outer collection label-size should be large.");

        const outerCollLabel = outerCollShadowRoot?.querySelector(".u-label-text");
        if (outerCollLabel) {
          expect(outerCollLabel.textContent).to.equal("Outer Collection");
        }

        // Verify outer occurrence properties.
        expect(outerOccElement.getAttribute("layout-type")).to.equal("horizontal-wrap", "Outer occurrence layout-type should be horizontal-wrap.");
        expect(outerOccElement.getAttribute("horizontal-align")).to.equal("start", "Outer occurrence main-axis-alignment should be start.");

        // Verify inner collection properties.
        expect(innerCollElement.getAttribute("layout-type")).to.equal("horizontal-scroll", "Inner collection layout-type should be horizontal-scroll.");
        expect(innerCollElement.getAttribute("label-size")).to.equal("small", "Inner collection label-size should be small.");

        const innerCollLabel = innerCollShadowRoot?.querySelector(".u-label-text");
        if (innerCollLabel) {
          expect(innerCollLabel.textContent).to.equal("Inner Collection");
        }

        // Verify inner occurrence properties.
        expect(innerOccElement.getAttribute("layout-type")).to.equal("vertical-wrap", "Inner occurrence layout-type should be vertical-wrap.");
        expect(innerOccElement.getAttribute("horizontal-align")).to.equal("center", "Inner occurrence main-axis-alignment should be center.");

        // Verify all properties are independent at each level.
        expect(outerCollElement.getAttribute("layout-type")).to.not.equal(outerOccElement.getAttribute("layout-type"), "Outer collection and outer occurrence should have independent layout-type.");
        expect(outerOccElement.getAttribute("layout-type")).to.not.equal(innerCollElement.getAttribute("layout-type"), "Outer occurrence and inner collection should have independent layout-type.");
        expect(innerCollElement.getAttribute("layout-type")).to.not.equal(innerOccElement.getAttribute("layout-type"), "Inner collection and inner occurrence should have independent layout-type.");
      });
    });

    describe("Collection and Occurrence comprehensive property tests", function () {
      it("should correctly apply all layout properties to collection with single occurrence", async function () {
        const occurrence1 = new MockEntityDefinition("layout_occ", "UX.OccurrenceLayout", "entity", {});
        const collectionObjDef = new MockEntityDefinition("layout_test_collection", "UX.CollectionLayout", "entity", {}, []);

        // Create collection and occurrence with widgets
        const collectionResult = createCollectionWidget(collectionObjDef, "layout_test_id");
        const collectionElement = collectionResult.element;
        const collectionWidget = collectionResult.widget;
        const occResult = createOccurrenceWidget(occurrence1, "layout_occ_elem");
        const occElement = occResult.element;
        const occWidget = occResult.widget;

        // Add occurrence to collection
        collectionElement.appendChild(occElement);

        await asyncRun(function () {
          // Apply all collection layout properties.
          collectionWidget.dataUpdate({
            "layout-type-occurrences": "horizontal-wrap",
            "horizontal-align-occurrences": "space-evenly",
            "vertical-align-occurrences": "stretch"
          });

          // Apply all occurrence layout properties.
          occWidget.dataUpdate({
            "layout-type": "vertical-scroll",
            "horizontal-align": "space-between",
            "vertical-align": "center"
          });
        });

        // Verify collection attributes.
        expect(collectionElement.getAttribute("layout-type")).to.equal("horizontal-wrap", "Collection layout-type should be horizontal-wrap.");
        expect(collectionElement.getAttribute("horizontal-align")).to.equal("space-evenly", "Collection main-axis-alignment should be space-evenly.");
        expect(collectionElement.getAttribute("vertical-align")).to.equal("stretch", "Collection cross-axis-alignment should be stretch.");

        // Verify occurrence attributes.
        expect(occElement.getAttribute("layout-type")).to.equal("vertical-scroll", "Occurrence layout-type should be vertical-scroll.");
        expect(occElement.getAttribute("horizontal-align")).to.equal("space-between", "Occurrence main-axis-alignment should be space-between.");
        expect(occElement.getAttribute("vertical-align")).to.equal("center", "Occurrence cross-axis-alignment should be center.");

        // Verify they are independent.
        expect(collectionElement.getAttribute("layout-type")).to.not.equal(occElement.getAttribute("layout-type"), "Layout types should be independent.");
        expect(collectionElement.getAttribute("horizontal-align")).to.not.equal(occElement.getAttribute("horizontal-align"), "Main axis alignments should be independent.");
        expect(collectionElement.getAttribute("vertical-align")).to.not.equal(occElement.getAttribute("vertical-align"), "Cross axis alignments should be independent.");
      });

      it("should verify that collection with 2 occurrences maintains correct count and properties", async function () {
        const occurrence1 = new MockEntityDefinition("two_occ_1", "UX.OccurrenceLayout", "entity", {});
        const occurrence2 = new MockEntityDefinition("two_occ_2", "UX.OccurrenceLayout", "entity", {});

        const collectionObjDef = new MockEntityDefinition("two_occ_collection", "UX.CollectionLayout", "entity", {}, []);

        // Create skeleton elements for collection and both occurrences.
        const skeletonElement = document.createElement("div");
        skeletonElement.id = "two_occ_collection_id";
        const occ1Skeleton = document.createElement("div");
        occ1Skeleton.id = "two_occ_elem_1";
        const occ2Skeleton = document.createElement("div");
        occ2Skeleton.id = "two_occ_elem_2";

        const collectionElement = CollectionLayoutClass.processLayout(skeletonElement, collectionObjDef);

        const collectionWidget = new CollectionLayoutClass();
        collectionWidget.onConnect(collectionElement, collectionObjDef);
        collectionWidget.dataInit();

        const occurrences = [];
        const occWidgets = [];

        // Create both occurrences.
        const occDefs = [occurrence1, occurrence2];
        const occSkeletons = [occ1Skeleton, occ2Skeleton];

        occDefs.forEach((occDef, index) => {
          const occElement = OccurrenceLayoutClass.processLayout(occSkeletons[index], occDef);

          const occWidget = new OccurrenceLayoutClass();
          occWidget.onConnect(occElement, occDef);
          occWidget.dataInit();

          occurrences.push(occElement);
          occWidgets.push(occWidget);

          // Add occurrence to collection.
          collectionElement.appendChild(occElement);
        });

        // Verify occurrence count.
        expect(occurrences).to.have.lengthOf(2, "Should have exactly 2 occurrences.");

        await asyncRun(function () {
          // Update collection properties.
          collectionWidget.dataUpdate({
            "label-text": "Two Occurrences Collection",
            "layout-type-occurrences": "vertical-scroll",
            "area-slot": "main"
          });

          // Update first occurrence.
          occWidgets[0].dataUpdate({
            "layout-type": "horizontal-scroll",
            "horizontal-align": "start"
          });

          // Update second occurrence with different properties.
          occWidgets[1].dataUpdate({
            "layout-type": "vertical-wrap",
            "horizontal-align": "end"
          });
        });

        // Verify collection properties.
        expect(collectionElement.getAttribute("layout-type")).to.equal("vertical-scroll");
        expect(collectionElement.getAttribute("area-slot")).to.equal("main");

        const shadowRoot = collectionElement.shadowRoot;
        const labelElement = shadowRoot?.querySelector(".u-label-text");
        if (labelElement) {
          expect(labelElement.textContent).to.equal("Two Occurrences Collection");
        }

        // Verify first occurrence properties.
        expect(occurrences[0].getAttribute("layout-type")).to.equal("horizontal-scroll", "First occurrence should have horizontal-scroll.");
        expect(occurrences[0].getAttribute("horizontal-align")).to.equal("start", "First occurrence should have start alignment.");

        // Verify second occurrence properties are different.
        expect(occurrences[1].getAttribute("layout-type")).to.equal("vertical-wrap", "Second occurrence should have vertical-wrap.");
        expect(occurrences[1].getAttribute("horizontal-align")).to.equal("end", "Second occurrence should have end alignment.");

        // Verify both occurrences are present in DOM.
        const occElements = collectionElement.querySelectorAll(".u-occ-layout");
        expect(occElements).to.have.lengthOf(2, "Should have exactly 2 occurrence elements in DOM.");
      });

      it("should apply cross-axis-alignment property to both collection and occurrence", async function () {
        const occurrence1 = new MockEntityDefinition("cross_align_occ", "UX.OccurrenceLayout", "entity", {});
        const collectionObjDef = new MockEntityDefinition("cross_align_collection", "UX.CollectionLayout", "entity", {}, []);

        // Create collection and occurrence with widgets.
        const collectionResult = createCollectionWidget(collectionObjDef, "cross_align_stretch_test");
        const collectionElement = collectionResult.element;
        const collectionWidget = collectionResult.widget;
        const occResult = createOccurrenceWidget(occurrence1, "cross_align_occ_stretch");
        const occElement = occResult.element;
        const occWidget = occResult.widget;

        await asyncRun(function () {
          collectionWidget.dataUpdate({ "vertical-align-occurrences": "stretch" });
          occWidget.dataUpdate({ "vertical-align": "center" });
        });

        expect(collectionElement.getAttribute("vertical-align")).to.equal("stretch", "Collection cross-axis-alignment should be stretch.");
        expect(occElement.getAttribute("vertical-align")).to.equal("center", "Occurrence cross-axis-alignment should be center.");
      });

      it("should inherit computed style when occurrence is set to auto and collection is non-auto", async function () {
        const occurrence1 = new MockEntityDefinition("auto_inherit_occ", "UX.OccurrenceLayout", "entity", {});
        const collectionObjDef = new MockEntityDefinition("auto_inherit_collection", "UX.CollectionLayout", "entity", {}, []);

        // Create collection and occurrence with widgets.
        const collectionResult = createCollectionWidget(collectionObjDef, "auto_inherit_test");
        const collectionElement = collectionResult.element;
        const collectionWidget = collectionResult.widget;
        const occResult = createOccurrenceWidget(occurrence1, "auto_inherit_occ");
        const occElement = occResult.element;
        const occWidget = occResult.widget;

        // Add occurrence to collection.
        collectionElement.appendChild(occElement);

        await asyncRun(function () {
          // Set collection to a specific layout-type.
          collectionWidget.dataUpdate({
            "layout-type-occurrences": "horizontal-scroll",
            "horizontal-align-occurrences": "center",
            "vertical-align-occurrences": "stretch"
          });

          // Set occurrence to auto.
          occWidget.dataUpdate({
            "layout-type": "auto",
            "horizontal-align": "auto",
            "vertical-align": "auto"
          });
        });

        // Verify attributes are set correctly.
        expect(collectionElement.getAttribute("layout-type")).to.equal("horizontal-scroll", "Collection layout-type should be horizontal-scroll.");
        expect(collectionElement.getAttribute("horizontal-align")).to.equal("center", "Collection main-axis-alignment should be center.");
        expect(collectionElement.getAttribute("vertical-align")).to.equal("stretch", "Collection cross-axis-alignment should be stretch.");

        expect(occElement.getAttribute("layout-type")).to.equal("auto", "Occurrence layout-type should be auto.");
        expect(occElement.getAttribute("horizontal-align")).to.equal("auto", "Occurrence main-axis-alignment should be auto.");
        expect(occElement.getAttribute("vertical-align")).to.equal("auto", "Occurrence cross-axis-alignment should be auto.");

        // Get computed styles.
        const collectionShadowRoot = collectionElement.shadowRoot;
        const occShadowRoot = occElement.shadowRoot;

        if (collectionShadowRoot && occShadowRoot) {
          const collectionRootPart = collectionShadowRoot.querySelector("[part='root']");
          const occRootPart = occShadowRoot.querySelector("[part='root']");

          if (collectionRootPart && occRootPart) {
            const collectionStyles = window.getComputedStyle(collectionRootPart);
            const occStyles = window.getComputedStyle(occRootPart);

            // When occurrence is set to auto, it should inherit/match the collection's computed flex properties.
            expect(collectionStyles.flexDirection).to.exist;
            expect(occStyles.flexDirection).to.exist;

            // Both should have same computed values.
            expect(collectionStyles.flexDirection).to.equal(occStyles.flexDirection);
            expect(collectionStyles.justifyContent).to.equal(occStyles.justifyContent);
            expect(collectionStyles.alignItems).to.equal(occStyles.alignItems);
          }
        }
      });
    });
  });

  describe("Entity Layout CSS Tests", function () {
    // Tests for ent_layout.css: flex-grow guards per control type,
    // --u-vertical-layout-grow variable, and width/height rules for collection/occurrence layouts.

    describe("Collection and Occurrence Layout Width Rules", function () {
      it("should set width 100% on u-coll-layout that is the only child", function () {
        // u-coll-layout:only-child rule sets width: 100%.
        const occLayout = document.createElement("u-occ-layout");
        occLayout.classList.add("u-occ-layout");
        const collLayout = document.createElement("u-coll-layout");
        collLayout.classList.add("u-coll-layout");
        occLayout.appendChild(collLayout);
        document.body.appendChild(occLayout);

        return asyncRun(function () {
        }).then(function () {
          const collWidth = collLayout.getBoundingClientRect().width;
          const parentWidth = occLayout.getBoundingClientRect().width;
          expect(collWidth).to.equal(parentWidth);
        }).finally(function () {
          occLayout.remove();
        });
      });

      it("should set width 100% on u-occ-layout that is the only child", function () {
        // u-occ-layout:only-child rule sets width: 100%.
        const collLayout = document.createElement("u-coll-layout");
        collLayout.classList.add("u-coll-layout");
        const occLayout = document.createElement("u-occ-layout");
        occLayout.classList.add("u-occ-layout");
        collLayout.appendChild(occLayout);
        document.body.appendChild(collLayout);

        return asyncRun(function () {
        }).then(function () {
          const occWidth = occLayout.getBoundingClientRect().width;
          const parentWidth = collLayout.getBoundingClientRect().width;
          expect(occWidth).to.equal(parentWidth);
        }).finally(function () {
          collLayout.remove();
        });
      });

      it("should set width 100% on u-coll-layout inside a vertical-scroll parent", function () {
        // [layout-type*="vertical-scroll"] > .u-coll-layout rule sets width: 100%.
        const parent = document.createElement("uf-layout");
        parent.setAttribute("layout-type", "vertical-scroll");
        const collLayout = document.createElement("u-coll-layout");
        collLayout.classList.add("u-coll-layout");
        parent.appendChild(collLayout);
        document.body.appendChild(parent);

        return asyncRun(function () {
        }).then(function () {
          const collWidth = collLayout.getBoundingClientRect().width;
          const parentWidth = parent.getBoundingClientRect().width;
          expect(collWidth).to.equal(parentWidth);
        }).finally(function () {
          parent.remove();
        });
      });

      it("should set width 100% on u-coll-layout inside a vertical-wrap parent", function () {
        // [layout-type*="vertical-wrap"] > .u-coll-layout rule sets width: 100%.
        const parent = document.createElement("uf-layout");
        parent.setAttribute("layout-type", "vertical-wrap");
        const collLayout = document.createElement("u-coll-layout");
        collLayout.classList.add("u-coll-layout");
        parent.appendChild(collLayout);
        document.body.appendChild(parent);

        return asyncRun(function () {
        }).then(function () {
          const collWidth = collLayout.getBoundingClientRect().width;
          const parentWidth = parent.getBoundingClientRect().width;
          expect(collWidth).to.equal(parentWidth);
        }).finally(function () {
          parent.remove();
        });
      });
    });

    describe("Stretchable direct children flex-grow in uf-layout", function () {
      it("should apply flex-grow to u-stretchable direct child of uf-layout", function () {
        // uf-layout > .u-stretchable sets flex-grow via --u-vertical-layout-grow / --u-layout-grow.
        const layout = document.createElement("uf-layout");
        layout.style.setProperty("--u-layout-grow", "1");
        const child = document.createElement("div");
        child.classList.add("u-stretchable");
        layout.appendChild(child);
        document.body.appendChild(layout);

        return asyncRun(function () {
        }).then(function () {
          const styles = window.getComputedStyle(child);
          expect(styles.flexGrow).to.equal("1");
        }).finally(function () {
          layout.remove();
        });
      });

      it("should not apply flex-grow to non-stretchable direct child of uf-layout", function () {
        // Without .u-stretchable class, no flex-grow rule applies.
        const layout = document.createElement("uf-layout");
        layout.style.setProperty("--u-layout-grow", "1");
        const child = document.createElement("div");
        layout.appendChild(child);
        document.body.appendChild(layout);

        return asyncRun(function () {
        }).then(function () {
          const styles = window.getComputedStyle(child);
          expect(styles.flexGrow).to.equal("0");
        }).finally(function () {
          layout.remove();
        });
      });

      it("should not apply flex-grow to nested uf-layout child without u-stretchable", function () {
        // A nested uf-layout does not have .u-stretchable; it has its own container rules.
        const layout = document.createElement("uf-layout");
        layout.style.setProperty("--u-layout-grow", "1");
        const nestedLayout = document.createElement("uf-layout");
        layout.appendChild(nestedLayout);
        document.body.appendChild(layout);

        return asyncRun(function () {
        }).then(function () {
          const childStyles = window.getComputedStyle(nestedLayout);
          expect(childStyles.flexGrow).to.equal("0");
        }).finally(function () {
          layout.remove();
        });
      });
    });

    describe("switch, checkbox, radio-group, plain-text: no flex-grow as direct children", function () {
      ["u-switch", "u-checkbox", "u-radio-group", "u-plain-text", "u-listbox"].forEach(function (tag) {
        it("should not apply flex-grow to " + tag + " as direct child of uf-layout", function () {
          // These controls do not carry the u-stretchable class, so uf-layout > .u-stretchable does not match.
          const layout = document.createElement("uf-layout");
          layout.style.setProperty("--u-layout-grow", "1");
          const control = document.createElement(tag);
          control.classList.add(tag);
          layout.appendChild(control);
          document.body.appendChild(layout);

          return asyncRun(function () {
          }).then(function () {
            const styles = window.getComputedStyle(control);
            expect(styles.flexGrow).to.equal("0");
          }).finally(function () {
            layout.remove();
          });
        });
      });

      ["u-switch", "u-checkbox", "u-radio-group", "u-plain-text", "u-listbox"].forEach(function (tag) {
        it("should set flex-grow 0 on parent uf-layout whose only direct child is " + tag, function () {
          // Without u-stretchable, the uf-layout:has(> .u-stretchable) rule does not match.
          const layout = document.createElement("uf-layout");
          layout.style.setProperty("--u-layout-grow", "1");
          const control = document.createElement(tag);
          control.classList.add(tag);
          layout.appendChild(control);
          document.body.appendChild(layout);

          return asyncRun(function () {
          }).then(function () {
            const layoutStyles = window.getComputedStyle(layout);
            expect(layoutStyles.flexGrow).to.equal("0");
          }).finally(function () {
            layout.remove();
          });
        });
      });

      ["u-switch", "u-checkbox", "u-radio-group", "u-plain-text", "u-listbox"].forEach(function (tag) {
        it("should set flex-grow 0 on grandparent uf-layout when nested layout has only " + tag, function () {
          // Without u-stretchable, uf-layout:has(> uf-layout > .u-stretchable) does not match.
          const outerLayout = document.createElement("uf-layout");
          outerLayout.style.setProperty("--u-layout-grow", "1");
          const innerLayout = document.createElement("uf-layout");
          const control = document.createElement(tag);
          control.classList.add(tag);
          innerLayout.appendChild(control);
          outerLayout.appendChild(innerLayout);
          document.body.appendChild(outerLayout);

          return asyncRun(function () {
          }).then(function () {
            const outerStyles = window.getComputedStyle(outerLayout);
            expect(outerStyles.flexGrow).to.equal("0");
          }).finally(function () {
            outerLayout.remove();
          });
        });
      });
    });

    describe("text-field, number-field, button: flex-grow respects --u-vertical-layout-grow guard", function () {
      // --u-vertical-layout-grow is set by the uf-layout web component (layout_styles.js).
      // These tests verify that uf-layout > .u-stretchable correctly reads the variable:
      //   - when set to 0 (vertical layout), stretchable controls must not grow
      //   - when unset / initial (horizontal layout), stretchable controls grow via --u-layout-grow

      ["u-text-field", "u-number-field", "u-button"].forEach(function (tag) {
        it("should not grow " + tag + " inside uf-layout when --u-vertical-layout-grow is 0", function () {
          // Simulates vertical layout: web component sets --u-vertical-layout-grow: 0 on the host.
          const layout = document.createElement("uf-layout");
          layout.style.setProperty("--u-vertical-layout-grow", "0");
          layout.style.setProperty("--u-layout-grow", "1");
          const control = document.createElement(tag);
          control.classList.add(tag, "u-stretchable");
          layout.appendChild(control);
          document.body.appendChild(layout);

          return asyncRun(function () {
          }).then(function () {
            const styles = window.getComputedStyle(control);
            expect(styles.flexGrow).to.equal("0");
          }).finally(function () {
            layout.remove();
          });
        });

        it("should allow " + tag + " to grow inside uf-layout when --u-vertical-layout-grow is not constrained", function () {
          // Simulates horizontal layout: --u-vertical-layout-grow is unset so flex-grow falls back to --u-layout-grow.
          const layout = document.createElement("uf-layout");
          layout.style.setProperty("--u-layout-grow", "1");
          const control = document.createElement(tag);
          control.classList.add(tag, "u-stretchable");
          layout.appendChild(control);
          document.body.appendChild(layout);

          return asyncRun(function () {
          }).then(function () {
            const styles = window.getComputedStyle(control);
            expect(styles.flexGrow).to.equal("1");
          }).finally(function () {
            layout.remove();
          });
        });
      });

      ["u-text-field", "u-number-field", "u-button"].forEach(function (tag) {
        it("should not grow the parent uf-layout container with only " + tag + " when --u-vertical-layout-grow is 0", function () {
          // uf-layout:has(> uf-layout > .u-stretchable) reads --u-vertical-layout-grow.
          // Simulates vertical layout: web component sets --u-vertical-layout-grow: 0 on the host.
          const outerLayout = document.createElement("uf-layout");
          outerLayout.style.setProperty("--u-vertical-layout-grow", "0");
          outerLayout.style.setProperty("--u-layout-grow", "1");
          const innerLayout = document.createElement("uf-layout");
          const control = document.createElement(tag);
          control.classList.add(tag, "u-stretchable");
          innerLayout.appendChild(control);
          outerLayout.appendChild(innerLayout);
          document.body.appendChild(outerLayout);

          return asyncRun(function () {
          }).then(function () {
            const styles = window.getComputedStyle(outerLayout);
            expect(styles.flexGrow).to.equal("0");
          }).finally(function () {
            outerLayout.remove();
          });
        });

        it("should allow the parent uf-layout container with only " + tag + " to grow when --u-vertical-layout-grow is not constrained", function () {
          // Simulates horizontal layout: --u-vertical-layout-grow is unset so flex-grow falls back to --u-layout-grow.
          const outerLayout = document.createElement("uf-layout");
          outerLayout.style.setProperty("--u-layout-grow", "1");
          const innerLayout = document.createElement("uf-layout");
          const control = document.createElement(tag);
          control.classList.add(tag, "u-stretchable");
          innerLayout.appendChild(control);
          outerLayout.appendChild(innerLayout);
          document.body.appendChild(outerLayout);

          return asyncRun(function () {
          }).then(function () {
            const styles = window.getComputedStyle(outerLayout);
            expect(styles.flexGrow).to.equal("1");
          }).finally(function () {
            outerLayout.remove();
          });
        });
      });
    });
  });

  // ===========================================================================================================
  // == Stretchable CSS :has() behaviour tests =================================================================
  // ===========================================================================================================
  describe("Stretchable container growth via CSS :has()", function () {

    /**
     * Helper: creates a DOM tree
     *   <uf-layout>       (outer)
     *     <uf-layout>     (inner)
     *       ...childElements
     *     </uf-layout>
     *   </uf-layout>
     * and appends it to the document for computed style resolution.
     */
    function buildEntityDOM(childElements) {
      const coll = document.createElement("uf-layout");
      const occ = document.createElement("uf-layout");
      childElements.forEach(function (child) {
        occ.appendChild(child);
      });
      coll.appendChild(occ);
      document.body.appendChild(coll);
      return { "coll": coll,
               "occ": occ };
    }

    function createStretchableWidget() {
      const el = document.createElement("fluent-text-field");
      el.classList.add("u-text-field", "u-stretchable");
      return el;
    }

    function createCompactWidget() {
      const el = document.createElement("fluent-switch");
      el.classList.add("u-switch");
      return el;
    }

    afterEach(function () {
      // Clean up any appended entity DOM trees.
      document.querySelectorAll("body > uf-layout").forEach(function (el) {
        el.remove();
      });
    });

    describe("uf-layout detects stretchable direct children", function () {

      it("should detect a single stretchable widget as direct child", function () {
        const widget = createStretchableWidget();
        const dom = buildEntityDOM([widget]);
        expect(dom.occ.querySelector(":scope > .u-stretchable"), "uf-layout should have a direct stretchable child").to.exist;
      });

      it("should not detect stretchable when all children are compact", function () {
        const widget = createCompactWidget();
        const dom = buildEntityDOM([widget]);
        expect(dom.occ.querySelector(":scope > .u-stretchable"), "uf-layout should have no stretchable direct child").to.be.null;
      });

      it("should detect stretchable in a mix of stretchable and compact children", function () {
        const stretchable = createStretchableWidget();
        const compact = createCompactWidget();
        const dom = buildEntityDOM([stretchable, compact]);
        expect(dom.occ.querySelector(":scope > .u-stretchable"), "uf-layout should detect the stretchable child among mixed children").to.exist;
      });

      it("should not detect stretchable when uf-layout is empty", function () {
        const dom = buildEntityDOM([]);
        expect(dom.occ.querySelector(":scope > .u-stretchable"), "Empty uf-layout should not match").to.be.null;
      });
    });

    describe("outer uf-layout detects stretchable through inner uf-layout", function () {

      it("should detect stretchable grandchild via outer > inner > widget path", function () {
        const widget = createStretchableWidget();
        const dom = buildEntityDOM([widget]);
        const match = dom.coll.querySelector(":scope > uf-layout > .u-stretchable");
        expect(match, "outer uf-layout should detect stretchable grandchild through inner uf-layout").to.exist;
      });

      it("should not detect stretchable when inner layout contains only compact children", function () {
        const widget = createCompactWidget();
        const dom = buildEntityDOM([widget]);
        const match = dom.coll.querySelector(":scope > uf-layout > .u-stretchable");
        expect(match, "outer uf-layout should not detect stretchable when only compact children exist").to.be.null;
      });

      it("should not detect stretchable when inner uf-layout is empty", function () {
        const dom = buildEntityDOM([]);
        const match = dom.coll.querySelector(":scope > uf-layout > .u-stretchable");
        expect(match, "Empty outer uf-layout should not match").to.be.null;
      });
    });

    describe("Sub-widget inside a widget is excluded by direct child selector", function () {

      it("should only count the top-level widget, not a nested sub-widget button", function () {
        const textField = createStretchableWidget();
        const subButton = document.createElement("fluent-button");
        subButton.classList.add("u-button", "u-stretchable");
        textField.appendChild(subButton);

        const dom = buildEntityDOM([textField]);

        const directChildren = dom.occ.querySelectorAll(":scope > .u-stretchable");
        expect(directChildren.length, "Only one direct stretchable child should exist").to.equal(1);
        expect(directChildren[0].tagName.toLowerCase(), "Direct stretchable child should be the text-field, not the sub-widget button").to.equal("fluent-text-field");
      });

      it("should not match when a compact widget contains a stretchable sub-widget", function () {
        const switchEl = createCompactWidget();
        const subButton = document.createElement("fluent-button");
        subButton.classList.add("u-button", "u-stretchable");
        switchEl.appendChild(subButton);

        const dom = buildEntityDOM([switchEl]);

        const directStretchable = dom.occ.querySelector(":scope > .u-stretchable");
        expect(directStretchable, "occ-layout should not match when only nested sub-widgets are stretchable").to.be.null;
      });

      it("outer uf-layout should not match when stretchable exists only inside a nested sub-widget", function () {
        const switchEl = createCompactWidget();
        const subButton = document.createElement("fluent-button");
        subButton.classList.add("u-button", "u-stretchable");
        switchEl.appendChild(subButton);

        const dom = buildEntityDOM([switchEl]);

        const match = dom.coll.querySelector(":scope > uf-layout > .u-stretchable");
        expect(match, "outer uf-layout should not match when stretchable is only nested inside a compact widget").to.be.null;
      });
    });

    describe("Dynamic addition and removal of u-stretchable class", function () {

      it("should lose the match after removing u-stretchable from the only widget", function () {
        const widget = createStretchableWidget();
        const dom = buildEntityDOM([widget]);

        expect(dom.occ.querySelector(":scope > .u-stretchable"), "Before removal: should match").to.exist;

        widget.classList.remove("u-stretchable");

        expect(dom.occ.querySelector(":scope > .u-stretchable"), "After removal: should no longer match").to.be.null;
      });

      it("should gain the match after adding u-stretchable to a widget", function () {
        const widget = document.createElement("fluent-text-field");
        widget.classList.add("u-text-field");
        const dom = buildEntityDOM([widget]);

        expect(dom.occ.querySelector(":scope > .u-stretchable"), "Before addition: should not match").to.be.null;

        widget.classList.add("u-stretchable");

        expect(dom.occ.querySelector(":scope > .u-stretchable"), "After addition: should match").to.exist;
      });

      it("should still match after removing u-stretchable from one sibling when another remains", function () {
        const widget1 = createStretchableWidget();
        const widget2 = document.createElement("fluent-number-field");
        widget2.classList.add("u-number-field", "u-stretchable");
        const dom = buildEntityDOM([widget1, widget2]);

        widget1.classList.remove("u-stretchable");

        expect(dom.occ.querySelector(":scope > .u-stretchable"), "Should still match because widget2 is stretchable").to.exist;
      });

      it("should lose match on both occ and coll after removing u-stretchable from all children", function () {
        const widget1 = createStretchableWidget();
        const widget2 = document.createElement("fluent-number-field");
        widget2.classList.add("u-number-field", "u-stretchable");
        const dom = buildEntityDOM([widget1, widget2]);

        widget1.classList.remove("u-stretchable");
        widget2.classList.remove("u-stretchable");

        expect(dom.occ.querySelector(":scope > .u-stretchable"), "uf-layout should not match after all stretchable removed").to.be.null;
        expect(dom.coll.querySelector(":scope > uf-layout > .u-stretchable"), "outer uf-layout should not match after all stretchable removed").to.be.null;
      });
    });

  });

  describe("Alignment property independence", function () {
    it("setting horizontal-align alone does not override vertical-align on CollectionLayout", async function () {
      const collectionObjDef = new MockEntityDefinition("align_indep_coll_1", "UX.CollectionLayout", "entity", {}, []);
      const result = createCollectionWidget(collectionObjDef, "align_indep_coll_1_elem");
      const element = result.element;
      const widget = result.widget;

      await asyncRun(function () {
        widget.dataUpdate({ "vertical-align-occurrences": "stretch" });
      });
      expect(element.getAttribute("vertical-align")).to.equal("stretch", "vertical-align should be stretch after first update.");

      await asyncRun(function () {
        widget.dataUpdate({ "horizontal-align-occurrences": "start" });
      });
      expect(element.getAttribute("horizontal-align")).to.equal("start", "horizontal-align should be updated to start.");
      expect(element.getAttribute("vertical-align")).to.equal("stretch", "vertical-align should remain stretch and not be overridden.");
    });

    it("setting vertical-align-occurrences alone does not override horizontal-align on CollectionLayout", async function () {
      const collectionObjDef = new MockEntityDefinition("align_indep_coll_2", "UX.CollectionLayout", "entity", {}, []);
      const result = createCollectionWidget(collectionObjDef, "align_indep_coll_2_elem");
      const element = result.element;
      const widget = result.widget;

      await asyncRun(function () {
        widget.dataUpdate({ "horizontal-align-occurrences": "center" });
      });
      expect(element.getAttribute("horizontal-align")).to.equal("center", "horizontal-align should be center after first update.");

      await asyncRun(function () {
        widget.dataUpdate({ "vertical-align-occurrences": "end" });
      });
      expect(element.getAttribute("vertical-align")).to.equal("end", "vertical-align should be updated to end.");
      expect(element.getAttribute("horizontal-align")).to.equal("center", "horizontal-align should remain center and not be overridden.");
    });

    it("setting horizontal-align-occurrences: center and vertical-align-occurrences: end together keeps each axis independent", async function () {
      const collectionObjDef = new MockEntityDefinition("align_indep_coll_3", "UX.CollectionLayout", "entity", {}, []);
      const result = createCollectionWidget(collectionObjDef, "align_indep_coll_3_elem");
      const element = result.element;
      const widget = result.widget;

      await asyncRun(function () {
        widget.dataUpdate({
          "layout-type-occurrences": "horizontal-scroll",
          "horizontal-align-occurrences": "center",
          "vertical-align-occurrences": "end"
        });
      });

      expect(element.getAttribute("layout-type")).to.equal("horizontal-scroll", "layout-type should be horizontal-scroll.");
      expect(element.getAttribute("horizontal-align")).to.equal("center", "horizontal-align should be center.");
      expect(element.getAttribute("vertical-align")).to.equal("end", "vertical-align should be end and NOT be overridden to center.");
    });

    it("all alignment and layout entity properties set simultaneously are each applied to their correct attribute", async function () {
      const collectionObjDef = new MockEntityDefinition("align_indep_coll_4", "UX.CollectionLayout", "entity", {}, []);
      const result = createCollectionWidget(collectionObjDef, "align_indep_coll_4_elem");
      const element = result.element;
      const widget = result.widget;

      await asyncRun(function () {
        widget.dataUpdate({
          "layout-type-occurrences": "horizontal-scroll",
          "label-text": "Entity Label",
          "label-size": "medium",
          "horizontal-align-occurrences": "center",
          "vertical-align-occurrences": "end"
        });
      });

      expect(element.getAttribute("layout-type")).to.equal("horizontal-scroll", "layout-type should be horizontal-scroll.");
      expect(element.getAttribute("horizontal-align")).to.equal("center", "horizontal-align should be center.");
      expect(element.getAttribute("vertical-align")).to.equal("end", "vertical-align should be end and NOT overridden to center.");
      expect(element.getAttribute("label-size")).to.equal("medium", "label-size should be medium.");

      const shadowRoot = element.shadowRoot;
      const labelElement = shadowRoot && shadowRoot.querySelector(".u-label-text");
      if (labelElement) {
        expect(labelElement.textContent).to.equal("Entity Label", "label-text should be Entity Label.");
      }
    });
  });

  describe("CSS axis mapping for layout-type", function () {
    it("for horizontal-scroll layout, horizontal-align: end sets horizontal-align attribute to end on OccurrenceLayout", async function () {
      const occObjDef = new MockEntityDefinition("axis_map_occ_1", "UX.OccurrenceLayout", "entity", {});
      const result = createOccurrenceWidget(occObjDef, "axis_map_occ_1_elem");
      const element = result.element;
      const widget = result.widget;

      await asyncRun(function () {
        widget.dataUpdate({ "layout-type": "horizontal-scroll",
                            "horizontal-align": "end" });
      });

      expect(element.getAttribute("layout-type")).to.equal("horizontal-scroll", "layout-type should be horizontal-scroll.");
      expect(element.getAttribute("horizontal-align")).to.equal("end", "horizontal-align attribute should be end.");
      // vertical-align should be unaffected (still its default).
      expect(element.getAttribute("vertical-align")).to.not.equal("end", "vertical-align should NOT be changed to end.");
    });

    it("for horizontal-scroll layout, vertical-align: end sets vertical-align attribute to end on OccurrenceLayout", async function () {
      const occObjDef = new MockEntityDefinition("axis_map_occ_2", "UX.OccurrenceLayout", "entity", {});
      const result = createOccurrenceWidget(occObjDef, "axis_map_occ_2_elem");
      const element = result.element;
      const widget = result.widget;

      await asyncRun(function () {
        widget.dataUpdate({ "layout-type": "horizontal-scroll",
                            "vertical-align": "end" });
      });

      expect(element.getAttribute("layout-type")).to.equal("horizontal-scroll", "layout-type should be horizontal-scroll.");
      expect(element.getAttribute("vertical-align")).to.equal("end", "vertical-align attribute should be end.");
      // horizontal-align should be unaffected.
      expect(element.getAttribute("horizontal-align")).to.not.equal("end", "horizontal-align should NOT be changed to end.");
    });

    it("for vertical-scroll layout, vertical-align: end sets vertical-align attribute to end on OccurrenceLayout", async function () {
      const occObjDef = new MockEntityDefinition("axis_map_occ_3", "UX.OccurrenceLayout", "entity", {});
      const result = createOccurrenceWidget(occObjDef, "axis_map_occ_3_elem");
      const element = result.element;
      const widget = result.widget;

      await asyncRun(function () {
        widget.dataUpdate({ "layout-type": "vertical-scroll",
                            "vertical-align": "end" });
      });

      expect(element.getAttribute("layout-type")).to.equal("vertical-scroll", "layout-type should be vertical-scroll.");
      expect(element.getAttribute("vertical-align")).to.equal("end", "vertical-align attribute should be end.");
      expect(element.getAttribute("horizontal-align")).to.not.equal("end", "horizontal-align should NOT be changed to end.");
    });

    it("for vertical-scroll layout, horizontal-align: end sets horizontal-align attribute to end on OccurrenceLayout", async function () {
      const occObjDef = new MockEntityDefinition("axis_map_occ_4", "UX.OccurrenceLayout", "entity", {});
      const result = createOccurrenceWidget(occObjDef, "axis_map_occ_4_elem");
      const element = result.element;
      const widget = result.widget;

      await asyncRun(function () {
        widget.dataUpdate({ "layout-type": "vertical-scroll",
                            "horizontal-align": "end" });
      });

      expect(element.getAttribute("layout-type")).to.equal("vertical-scroll", "layout-type should be vertical-scroll.");
      expect(element.getAttribute("horizontal-align")).to.equal("end", "horizontal-align attribute should be end.");
      expect(element.getAttribute("vertical-align")).to.not.equal("end", "vertical-align should NOT be changed to end.");
    });

    it("switching layout-type from vertical-scroll to horizontal-scroll keeps alignment attributes independently correct", async function () {
      const occObjDef = new MockEntityDefinition("axis_map_occ_5", "UX.OccurrenceLayout", "entity", {});
      const result = createOccurrenceWidget(occObjDef, "axis_map_occ_5_elem");
      const element = result.element;
      const widget = result.widget;

      // Set up with vertical-scroll, vertical-align: end.
      await asyncRun(function () {
        widget.dataUpdate({ "layout-type": "vertical-scroll",
                            "vertical-align": "end" });
      });
      expect(element.getAttribute("layout-type")).to.equal("vertical-scroll");
      expect(element.getAttribute("vertical-align")).to.equal("end", "vertical-align should be end with vertical-scroll.");

      // Switch to horizontal-scroll without changing alignment.
      await asyncRun(function () {
        widget.dataUpdate({ "layout-type": "horizontal-scroll" });
      });
      expect(element.getAttribute("layout-type")).to.equal("horizontal-scroll", "layout-type should switch to horizontal-scroll.");
      // vertical-align attribute should still hold the value "end"
      // (axis remapping is a CSS concern, the attribute itself stays).
      expect(element.getAttribute("vertical-align")).to.equal("end", "vertical-align attribute should remain end after layout-type switch.");
    });

    it("layout-type: horizontal-scroll with vertical-align-occurrences: end on CollectionLayout sets correct attributes", async function () {
      const collectionObjDef = new MockEntityDefinition("axis_map_coll_6", "UX.CollectionLayout", "entity", {}, []);
      const result = createCollectionWidget(collectionObjDef, "axis_map_coll_6_elem");
      const element = result.element;
      const widget = result.widget;

      await asyncRun(function () {
        widget.dataUpdate({
          "layout-type-occurrences": "horizontal-scroll",
          "vertical-align-occurrences": "end"
        });
      });

      expect(element.getAttribute("layout-type")).to.equal("horizontal-scroll", "layout-type should be horizontal-scroll.");
      expect(element.getAttribute("vertical-align")).to.equal("end", "vertical-align attribute should be end.");
      // horizontal-align must remain at its default (auto), NOT change to end.
      expect(element.getAttribute("horizontal-align")).to.not.equal("end", "horizontal-align should NOT be set to end by vertical-align-occurrences.");
    });
  });

  describe("Invalid property handling", function () {
    it("setting an unsupported property on CollectionLayout logs a warning and is ignored", function () {
      const warnSpy = sinon.spy(console, "warn");
      return asyncRun(function () {
        collectionTester.dataUpdate({ "dummy-property": "some value" });
      }).then(function () {
        expect(warnSpy.calledWith(sinon.match("Widget does not support property 'dummy-property' - Ignored."))).to.be.true;
        warnSpy.restore();
      }).catch(function (e) {
        warnSpy.restore();
        throw e;
      });
    });

    it("setting an unsupported property on OccurrenceLayout logs a warning and is ignored", function () {
      const occMockDef = new MockEntityDefinition("test_occ_invalid_prop", "UX.OccurrenceLayout", "entity", {});
      const result = createOccurrenceWidget(occMockDef, "occ_invalid_prop_elem");
      const occWidget = result.widget;
      const warnSpy = sinon.spy(console, "warn");
      return asyncRun(function () {
        occWidget.dataUpdate({ "dummy-property": "some value" });
      }).then(function () {
        expect(warnSpy.calledWith(sinon.match("Widget does not support property 'dummy-property' - Ignored."))).to.be.true;
        warnSpy.restore();
      }).catch(function (e) {
        warnSpy.restore();
        throw e;
      });
    });
  });

  describe("Reset all properties", function () {
    it("reset all properties", function () {
      try {
        collectionTester.dataUpdate(collectionTester.getDefaultValues());
      } catch (e) {
        assert(false, `Failed to reset the properties, exception ${e}.`);
      }
    });
  });
})();

