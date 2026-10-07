/* global chai, describe, it, before, beforeEach, afterEach, sinon, UNIFACE */

(function () {
  "use strict";

  const expect = chai.expect;

  /**
   * The accordion widget classes are registered in the bundle loaded by the test
   * harness HTML page. Using the registry avoids a direct source import that would
   * pull in the unresolvable bare specifier "@fluentui/web-components".
   */
  const Accordion = UNIFACE.ClassRegistry.get("UX.Accordion");
  const AccordionItem = UNIFACE.ClassRegistry.get("UX.AccordionItem");
  const AccordionHeadingField = UNIFACE.ClassRegistry.get("UX.AccordionHeadingField");

  /**
   * Produces a fresh, mutation-safe mock widget class for constructing standalone
   * workers. A plain object literal is used so the worker registration writes
   * (setters / getters / defaultValues) do not touch the real registered classes.
   */
  function createMockWidgetClass() {
    return {
      "setters": {},
      "getters": {},
      "defaultValues": {},
      "subWidgetWorkers": []
    };
  }

  /**
   * Builds a mock child object definition matching the shape the ChildWidgets
   * worker relies on (getName / getType / widget-class / property accessors).
   */
  function createMockChildDef(name, widgetClass, props) {
    const store = Object.assign({}, props);
    let currentWidgetClass = widgetClass;
    return {
      "getName": function () {
        return name;
      },
      "getType": function () {
        return "field";
      },
      "getWidgetClass": function () {
        return currentWidgetClass;
      },
      "setWidgetClass": function (wc) {
        currentWidgetClass = wc;
      },
      "getPropertyNames": function () {
        return Object.keys(store);
      },
      "getProperty": function (p) {
        return store[p];
      },
      "setProperty": function (p, v) {
        if (v === undefined) {
          delete store[p];
        } else {
          store[p] = v;
        }
      }
    };
  }

  /** Wraps children in a mock parent object definition. */
  function createMockParentDef(children) {
    return {
      "getChildDefinitions": function () {
        return children;
      }
    };
  }

  /** Builds a mock widget instance exposing the minimal element/data shape workers use. */
  function createMockWidgetInstance(data, element) {
    return {
      "data": data || {},
      "elements": { "widget": element || document.createElement("fluent-accordion-item") },
      "getTraceDescription": function () {
        return "traceDescription";
      }
    };
  }

  describe("Accordion", function () {

    describe("Static members", function () {

      it("should have subWidgets as an empty object", function () {
        expect(Accordion.subWidgets, "SubWidgets should be an empty object.").to.deep.equal({});
      });

      it("should have subWidgetWorkers as an array", function () {
        expect(Accordion.subWidgetWorkers, "SubWidgetWorkers should be an array.").to.be.an("array");
      });

      it("should have a defined structure", function () {
        expect(Accordion.structure, "Structure should be defined.").to.exist;
      });

      it("should build a 'uf-accordion-container' root element", function () {
        expect(Accordion.structure.tagName, "Structure root tagName should be 'uf-accordion-container'.").to.equal("uf-accordion-container");
      });

      it("should have setters as a non-empty object", function () {
        expect(Accordion.setters, "Setters should be a non-empty object.").to.not.be.empty;
      });

      it("should have defaultValues as a non-empty object", function () {
        expect(Accordion.defaultValues, "DefaultValues should be a non-empty object.").to.not.be.empty;
      });

      it("should have getters as an object", function () {
        expect(Accordion.getters, "Getters should be an object.").to.be.an("object");
      });

      it("should not define any triggers", function () {
        expect(Accordion.triggers, "Accordion should not define any triggers.").to.deep.equal({});
      });

      it("should register an 'expand-mode' setter", function () {
        expect(Accordion.setters, "Setters should include 'expand-mode'.").to.have.property("expand-mode");
      });

      it("should register a 'label-size' setter", function () {
        expect(Accordion.setters, "Setters should include 'label-size'.").to.have.property("label-size");
      });

    });

    describe("Static methods", function () {

      describe("getValueFormattedSetters()", function () {
        let result;

        before(function () {
          result = Accordion.getValueFormattedSetters();
        });

        it("should return an array", function () {
          expect(result, "getValueFormattedSetters() should return an array.").to.be.an("array");
        });

        it("should include 'value' in the returned array", function () {
          expect(result, "Returned array should include 'value'.").to.include("value");
        });

        it("should include 'error' and 'error-message'", function () {
          expect(result, "Returned array should include 'error' and 'error-message'.").to.include.members(["error", "error-message"]);
        });
      });

      describe("getPropertyIds()", function () {
        let result;

        before(function () {
          result = Accordion.getPropertyIds();
        });

        it("should return an array", function () {
          expect(result, "getPropertyIds() should return an array.").to.be.an("array");
        });

        it("should not include the 'class' property", function () {
          expect(result, "Returned array should exclude 'class'.").to.not.include("class");
        });

        it("should include registered property ids", function () {
          expect(result, "Returned array should include 'expand-mode'.").to.include("expand-mode");
        });
      });

    });

  });

  describe("AccordionItem", function () {

    describe("Static members", function () {

      it("should have subWidgets as an object", function () {
        expect(AccordionItem.subWidgets, "SubWidgets should be an object.").to.be.an("object");
      });

      it("should have subWidgetWorkers as an array", function () {
        expect(AccordionItem.subWidgetWorkers, "SubWidgetWorkers should be an array.").to.be.an("array");
      });

      it("should have a defined structure", function () {
        expect(AccordionItem.structure, "Structure should be defined.").to.exist;
      });

      it("should build a 'fluent-accordion-item' root element", function () {
        expect(AccordionItem.structure.tagName, "Structure root tagName should be 'fluent-accordion-item'.").to.equal("fluent-accordion-item");
      });

      it("should have setters as a non-empty object", function () {
        expect(AccordionItem.setters, "Setters should be a non-empty object.").to.not.be.empty;
      });

      it("should have defaultValues as a non-empty object", function () {
        expect(AccordionItem.defaultValues, "DefaultValues should be a non-empty object.").to.not.be.empty;
      });

      it("should not define any triggers", function () {
        expect(AccordionItem.triggers, "AccordionItem should not define any triggers.").to.deep.equal({});
      });

      it("should register an 'item:expanded' setter", function () {
        expect(AccordionItem.setters, "Setters should include 'item:expanded'.").to.have.property("item:expanded");
      });

      it("should register an 'item:label-size' setter", function () {
        expect(AccordionItem.setters, "Setters should include 'item:label-size'.").to.have.property("item:label-size");
      });

      it("should expose AttributeHeadingLevel as a static nested class", function () {
        expect(AccordionItem.AttributeHeadingLevel, "AttributeHeadingLevel should be a function/class.").to.be.a("function");
      });

      it("should expose ChildSlots as a static nested class", function () {
        expect(AccordionItem.ChildSlots, "ChildSlots should be a function/class.").to.be.a("function");
      });

      it("should declare childSlotConfig offering the 'start', 'end' and 'heading' slots", function () {
        expect(AccordionItem.childSlotConfig, "childSlotConfig should be an object.").to.be.an("object");
        expect(AccordionItem.childSlotConfig.propertyName, "childSlotConfig should key on the 'html:slot' property.").to.equal("html:slot");
        expect(AccordionItem.childSlotConfig.validSlots, "childSlotConfig should offer the start/end/heading slots.").to.deep.equal(["start", "end", "heading"]);
        expect(AccordionItem.childSlotConfig.defaultSlot, "childSlotConfig default slot should be the empty (body) slot.").to.equal("");
      });

    });

    describe("AttributeHeadingLevel", function () {

      let worker;

      beforeEach(function () {
        worker = new AccordionItem.AttributeHeadingLevel(createMockWidgetClass());
      });

      it("should map 'item:label-size' to the 'heading-level' attribute", function () {
        expect(worker.propId, "propId should be 'item:label-size'.").to.equal("item:label-size");
        expect(worker.attrName, "attrName should be 'heading-level'.").to.equal("heading-level");
      });

      it("should default to the 'medium' choice", function () {
        expect(worker.defaultValue, "Default value should be 'medium'.").to.equal("medium");
      });

      it("should set the attribute as an HTML attribute", function () {
        expect(worker.setAsAttribute, "setAsAttribute should be true.").to.be.true;
      });

      it("should expose the size-to-level map", function () {
        expect(worker.levelMap, "levelMap should map sizes to aria heading levels.").to.deep.equal({
          "small": "3",
          "medium": "2",
          "large": "1"
        });
      });

      it("should support the 'small', 'medium' and 'large' choices", function () {
        expect(worker.choices, "Choices should be the three heading sizes.").to.deep.equal(["small", "medium", "large"]);
      });

      it("should set heading-level '3' for a 'small' heading size", function () {
        const element = document.createElement("fluent-accordion-item");
        const instance = createMockWidgetInstance({ "item:label-size": "small" }, element);
        worker.refresh(instance);
        expect(element.getAttribute("heading-level"), "Small heading size should map to level '3'.").to.equal("3");
      });

      it("should set heading-level '2' for a 'medium' heading size", function () {
        const element = document.createElement("fluent-accordion-item");
        const instance = createMockWidgetInstance({ "item:label-size": "medium" }, element);
        worker.refresh(instance);
        expect(element.getAttribute("heading-level"), "Medium heading size should map to level '2'.").to.equal("2");
      });

      it("should set heading-level '1' for a 'large' heading size", function () {
        const element = document.createElement("fluent-accordion-item");
        const instance = createMockWidgetInstance({ "item:label-size": "large" }, element);
        worker.refresh(instance);
        expect(element.getAttribute("heading-level"), "Large heading size should map to level '1'.").to.equal("1");
      });

      it("should fall back to level '2' for an unknown heading size", function () {
        const element = document.createElement("fluent-accordion-item");
        const instance = createMockWidgetInstance({ "item:label-size": "gigantic" }, element);
        worker.refresh(instance);
        expect(element.getAttribute("heading-level"), "Unknown heading size should fall back to level '2'.").to.equal("2");
      });

      it("should fall back to level '2' when the heading size is absent", function () {
        const element = document.createElement("fluent-accordion-item");
        const instance = createMockWidgetInstance({}, element);
        worker.refresh(instance);
        expect(element.getAttribute("heading-level"), "Absent heading size should fall back to level '2'.").to.equal("2");
      });

    });

    describe("ChildSlots", function () {

      let worker;

      beforeEach(function () {
        worker = new AccordionItem.ChildSlots(createMockWidgetClass(), "span", AccordionItem.childSlotConfig);
      });

      it("should reclassify a heading-slot child to 'UX.AccordionHeadingField'", function () {
        const headingChild = createMockChildDef("HEADING.ACCORD.NOMODEL", "UX.TextField", {
          "html:slot": "heading",
          "value": "v"
        });
        worker.getLayout(createMockParentDef([headingChild]));
        expect(headingChild.getWidgetClass(), "Heading-slot child should be reclassified to 'UX.AccordionHeadingField'.").to.equal("UX.AccordionHeadingField");
      });

      it("should record the original widget class under 'org-widget-class'", function () {
        const headingChild = createMockChildDef("HEADING.ACCORD.NOMODEL", "UX.TextField", {
          "html:slot": "heading",
          "value": "v"
        });
        worker.getLayout(createMockParentDef([headingChild]));
        expect(headingChild.getProperty("org-widget-class"), "Original widget class should be recorded under 'org-widget-class'.").to.equal("UX.TextField");
      });

      ["UX.PlainText", "UX.TextField", "UX.Button", "UX.Select"].forEach(function (originalWidgetClass) {
        it(`should convert a heading-slot '${originalWidgetClass}' child to the heading field while recording its original class`, function () {
          const headingChild = createMockChildDef("HEADING.ACCORD.NOMODEL", originalWidgetClass, {
            "html:slot": "heading",
            "value": "v"
          });
          worker.getLayout(createMockParentDef([headingChild]));
          expect(
            headingChild.getWidgetClass(),
            `Heading-slot '${originalWidgetClass}' child should be reclassified to 'UX.AccordionHeadingField'.`
          ).to.equal("UX.AccordionHeadingField");
          expect(
            headingChild.getProperty("org-widget-class"),
            `Original class '${originalWidgetClass}' should be recorded under 'org-widget-class'.`
          ).to.equal(originalWidgetClass);
          expect(
            headingChild.getProperty("html:slot"),
            "'html:slot' should be preserved so the converted child still routes to the heading slot."
          ).to.equal("heading");
        });
      });

      it("should preserve 'html:slot' so the child still routes to the heading slot", function () {
        const headingChild = createMockChildDef("HEADING.ACCORD.NOMODEL", "UX.TextField", {
          "html:slot": "heading",
          "value": "v"
        });
        worker.getLayout(createMockParentDef([headingChild]));
        expect(headingChild.getProperty("html:slot"), "'html:slot' should be preserved for slot routing.").to.equal("heading");
      });

      it("should pass unrelated properties through untouched", function () {
        const headingChild = createMockChildDef("HEADING.ACCORD.NOMODEL", "UX.TextField", {
          "html:slot": "heading",
          "value": "v",
          "label-text": "L"
        });
        worker.getLayout(createMockParentDef([headingChild]));
        expect(headingChild.getProperty("value"), "'value' should be passed through untouched.").to.equal("v");
        expect(headingChild.getProperty("label-text"), "'label-text' should be passed through untouched.").to.equal("L");
      });

      it("should leave non-heading children untouched", function () {
        const bodyChild = createMockChildDef("BODY.ACCORD.NOMODEL", "UX.TextField", {
          "value": "b",
          "label-text": "B"
        });
        worker.getLayout(createMockParentDef([bodyChild]));
        expect(bodyChild.getWidgetClass(), "Non-heading child should keep its original widget class.").to.equal("UX.TextField");
        expect(bodyChild.getProperty("org-widget-class"), "Non-heading child should not record 'org-widget-class'.").to.be.undefined;
      });

      it("should not reclassify a child whose slot is not 'heading'", function () {
        const startChild = createMockChildDef("START.ACCORD.NOMODEL", "UX.Button", {
          "html:slot": "start",
          "value": "S"
        });
        worker.getLayout(createMockParentDef([startChild]));
        expect(startChild.getWidgetClass(), "Non-heading slot child should keep its original widget class.").to.equal("UX.Button");
      });

      it("should return placeholder elements carrying each field binding id", function () {
        const headingChild = createMockChildDef("HEADING.ACCORD.NOMODEL", "UX.TextField", {
          "html:slot": "heading",
          "value": "v"
        });
        const elements = worker.getLayout(createMockParentDef([headingChild]));
        expect(elements, "getLayout() should return an array of elements.").to.be.an("array");
        expect(elements[0].id, "Placeholder element should carry the field binding id.").to.equal("ufld:HEADING.ACCORD.NOMODEL");
      });

      it("should return an empty array when there are no children", function () {
        const elements = worker.getLayout(createMockParentDef([]));
        expect(elements, "getLayout() should return an empty array for no children.").to.deep.equal([]);
      });

      it("should replace a non-offered slot with the default slot", function () {
        const footerChild = createMockChildDef("FOOTER.ACCORD.NOMODEL", "UX.TextField", {
          "html:slot": "footer",
          "value": "F"
        });
        worker.getLayout(createMockParentDef([footerChild]));
        expect(footerChild.getProperty("html:slot"), "A non-offered slot should be replaced by the default (empty) slot.").to.equal("");
      });

      it("should not reclassify a child placed in a non-offered slot", function () {
        const footerChild = createMockChildDef("FOOTER.ACCORD.NOMODEL", "UX.TextField", {
          "html:slot": "footer",
          "value": "F"
        });
        worker.getLayout(createMockParentDef([footerChild]));
        expect(footerChild.getWidgetClass(), "A non-offered slot child should keep its original widget class.").to.equal("UX.TextField");
      });

      it("should leave a valid 'end' slot child untouched", function () {
        const endChild = createMockChildDef("END.ACCORD.NOMODEL", "UX.Button", {
          "html:slot": "end",
          "value": "E"
        });
        worker.getLayout(createMockParentDef([endChild]));
        expect(endChild.getWidgetClass(), "A valid 'end' slot child should keep its original widget class.").to.equal("UX.Button");
        expect(endChild.getProperty("html:slot"), "A valid 'end' slot should be preserved.").to.equal("end");
      });

      it("should reclassify a heading child whose slot value has surrounding whitespace", function () {
        const headingChild = createMockChildDef("PAD.ACCORD.NOMODEL", "UX.TextField", {
          "html:slot": "  heading  ",
          "value": "v"
        });
        worker.getLayout(createMockParentDef([headingChild]));
        expect(headingChild.getWidgetClass(), "A whitespace-padded 'heading' slot should still reclassify the child.").to.equal("UX.AccordionHeadingField");
      });

      it("should leave a child with no slot in the default slot untouched", function () {
        const bodyChild = createMockChildDef("BODY2.ACCORD.NOMODEL", "UX.TextField", {
          "value": "b"
        });
        worker.getLayout(createMockParentDef([bodyChild]));
        expect(bodyChild.getWidgetClass(), "A child with no slot should keep its widget class.").to.equal("UX.TextField");
        expect(bodyChild.getProperty("html:slot"), "A child with no slot should not gain a slot.").to.be.undefined;
      });

    });

  });

  describe("AccordionHeadingField", function () {

    describe("Static members", function () {

      it("should have subWidgets as an empty object", function () {
        expect(AccordionHeadingField.subWidgets, "SubWidgets should be an empty object.").to.deep.equal({});
      });

      it("should have subWidgetWorkers as an array", function () {
        expect(AccordionHeadingField.subWidgetWorkers, "SubWidgetWorkers should be an array.").to.be.an("array");
      });

      it("should have a defined structure", function () {
        expect(AccordionHeadingField.structure, "Structure should be defined.").to.exist;
      });

      it("should build a 'span' root element", function () {
        expect(AccordionHeadingField.structure.tagName, "Structure root tagName should be 'span'.").to.equal("span");
      });

      it("should have an empty uiBlocking value", function () {
        expect(AccordionHeadingField.uiBlocking, "uiBlocking should be an empty string.").to.equal("");
      });

      it("should suppress unsupported property warnings", function () {
        expect(AccordionHeadingField.reportUnsupportedPropertyWarnings, "Unsupported property warnings should be suppressed.").to.be.false;
      });

      it("should suppress unsupported trigger warnings", function () {
        expect(AccordionHeadingField.reportUnsupportedTriggerWarnings, "Unsupported trigger warnings should be suppressed.").to.be.false;
      });

      it("should list the base formatted-value setters", function () {
        expect(AccordionHeadingField.baseFormattedSetters, "Base formatted-value setters should include the always-relevant properties.").to.include.members([
          "html:title",
          "html:disabled",
          "html:readonly",
          "html:hidden",
          "value",
          "error",
          "error-message"
        ]);
      });

      it("should register a setter for 'org-widget-class'", function () {
        expect(AccordionHeadingField.setters, "Setters should include 'org-widget-class'.").to.have.property("org-widget-class");
      });

      it("should register a setter for 'html:slot'", function () {
        expect(AccordionHeadingField.setters, "Setters should include 'html:slot'.").to.have.property("html:slot");
      });

      it("should return the inherited formatted-value setters", function () {
        expect(AccordionHeadingField.getValueFormattedSetters(), "getValueFormattedSetters() should include 'value'.").to.include("value");
      });

    });

    describe("setProperties", function () {

      let instance;
      let formattedValueSetter;
      let refreshStub;

      beforeEach(function () {
        instance = new AccordionHeadingField();
        instance.elements.widget = document.createElement("span");
        // Stub the AttributeFormattedValue worker so the branch logic can be verified
        // without any real formatted-value rendering.
        formattedValueSetter = AccordionHeadingField.setters["org-widget-class"][0];
        refreshStub = sinon.stub(formattedValueSetter, "refresh");
      });

      afterEach(function () {
        refreshStub.restore();
      });

      it("should not refresh the formatted value when 'org-widget-class' is absent", function () {
        instance.setProperties({ "value": "X" });
        expect(refreshStub.called, "Formatted-value setter should not refresh without an original widget class.").to.be.false;
      });

      it("should refresh the formatted value when a relevant setter changes", function () {
        instance.data["org-widget-class"] = "UX.TextField";
        instance.setProperties({ "value": "Updated" });
        expect(refreshStub.calledOnce, "Formatted-value setter should refresh once when 'value' changes.").to.be.true;
      });

      it("should not refresh the formatted value when only an irrelevant property changes", function () {
        instance.data["org-widget-class"] = "UX.TextField";
        instance.setProperties({ "unrelated-prop-xyz": "noop" });
        expect(refreshStub.called, "Formatted-value setter should not refresh for an irrelevant property.").to.be.false;
      });

      it("should refresh the formatted value when 'error' changes", function () {
        instance.data["org-widget-class"] = "UX.TextField";
        instance.setProperties({ "error": true });
        expect(refreshStub.calledOnce, "Formatted-value setter should refresh once when 'error' changes.").to.be.true;
      });

      it("should not throw when data is null", function () {
        expect(function () {
          instance.setProperties(null);
        }, "setProperties(null) should not throw.").to.not.throw();
      });

    });

    describe("Edge cases", function () {

      it("should register all three accordion classes in the registry", function () {
        expect(Accordion, "Accordion should be registered.").to.be.a("function");
        expect(AccordionItem, "AccordionItem should be registered.").to.be.a("function");
        expect(AccordionHeadingField, "AccordionHeadingField should be registered.").to.be.a("function");
      });

      it("should reclassify only heading children within a mixed child set", function () {
        const worker = new AccordionItem.ChildSlots(createMockWidgetClass(), "span", AccordionItem.childSlotConfig);
        const headingChild = createMockChildDef("HEAD.ACCORD.NOMODEL", "UX.TextField", {
          "html:slot": "heading",
          "value": "H"
        });
        const bodyChild = createMockChildDef("BODY.ACCORD.NOMODEL", "UX.Button", {
          "value": "B"
        });
        const elements = worker.getLayout(createMockParentDef([headingChild, bodyChild]));
        expect(headingChild.getWidgetClass(), "Heading child should be reclassified.").to.equal("UX.AccordionHeadingField");
        expect(bodyChild.getWidgetClass(), "Body child should retain its widget class.").to.equal("UX.Button");
        expect(elements, "Both children should produce placeholder elements.").to.have.lengthOf(2);
      });

      it("should overwrite a previously assigned heading-level on subsequent refresh", function () {
        const worker = new AccordionItem.AttributeHeadingLevel(createMockWidgetClass());
        const element = document.createElement("fluent-accordion-item");
        worker.refresh(createMockWidgetInstance({ "item:label-size": "large" }, element));
        expect(element.getAttribute("heading-level"), "First refresh should set level '1'.").to.equal("1");
        worker.refresh(createMockWidgetInstance({ "item:label-size": "small" }, element));
        expect(element.getAttribute("heading-level"), "Second refresh should overwrite to level '3'.").to.equal("3");
      });

      it("should fall back to level '2' when the heading size is null", function () {
        const worker = new AccordionItem.AttributeHeadingLevel(createMockWidgetClass());
        const element = document.createElement("fluent-accordion-item");
        worker.refresh(createMockWidgetInstance({ "item:label-size": null }, element));
        expect(element.getAttribute("heading-level"), "Null heading size should fall back to level '2'.").to.equal("2");
      });

    });

  });

})();
