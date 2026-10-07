/* global chai, describe, it, beforeEach, afterEach, umockup */

import { AttributeSlot } from "../../src/ux/framework/workers/attribute_slot.js";

(function () {
  "use strict";

  // Unit Test Suite for the AttributeSlot worker, which maintains the 'html:slot' property.
  //
  // The slot places a widget in an area of the widget it is placed in, and only that widget knows
  // which areas it offers: it declares them on the object definition of each of its children.
  // Covers the parts that carry the logic:
  // - Applying the slot of the object definition to the created layout.
  // - Refusing a slot the widget it is placed in does not offer, which the browser renders nothing
  //   for, so that applying it would leave the widget unrendered.
  // - Refusing and reporting a slot that arrives while the widget runs.

  const expect = chai.expect;

  // Mock widget class, holding the registrations of the worker under test.
  class Checkbox {
    static setters = {};
    static defaultValues = {};
    static getters = {};
    static triggers = {};

    constructor(element) {
      this.data = {};
      this.elements = { "widget": element };
    }

    getTraceDescription() {
      return "Checkbox:test";
    }
  }

  /**
   * Mock object definition carrying the design-time properties of a widget, which the widget it is
   * placed in may add to while it creates the layout. Built by the mockup, so it answers the whole
   * object definition contract and stays in step with it.
   * @param {object} properties
   * @param {object} [defs] - Definition fields a widget asks for beyond its properties.
   */
  function objectDefinition(properties, defs) {
    return umockup.createUxDefinitions(Object.assign({ "properties": Object.assign({}, properties) }, defs), true);
  }

  // Every widget that offers 'html:slot' is placed by the same worker, so a slot the widget it is
  // placed in does not offer must be refused the same way by all of them, and reported once.
  const slottedWidgetClasses = [
    "UX.Button", "UX.Checkbox", "UX.Listbox", "UX.NumberField", "UX.PlainText", "UX.RadioGroup",
    "UX.Select", "UX.Switch", "UX.TextArea", "UX.TextField", "UX.Accordion",
    "UX.DataGridCollection", "UX.CollectionLayout"
  ];

  describe("AttributeSlot", function () {

    let worker;
    let warnings;
    let originalWarn;

    /**
     * Creates the layout of a child widget, the way Widget.processLayout() does. The widget it is
     * placed in offers the slots of 'allowedSlots', or those of an accordion item by default.
     */
    function createLayout(properties, allowedSlots = ["start", "end", "heading"], childElement, isStatic = true) {
      const element = childElement || document.createElement("fluent-checkbox");
      const definition = objectDefinition(properties || {});
      definition.setProperty(AttributeSlot.slotPlacementPropId, {
        "allowedSlots": allowedSlots,
        "isStatic": isStatic
      });
      worker.initializeLayout(element, definition);
      return element;
    }

    /**
     * Sets the slot of a widget, the way Widget.setProperties() does. The slots it may be moved to
     * are the ones createLayout() left on the element.
     */
    function refreshWith(element, slotValue) {
      const widgetInstance = new Checkbox(element);
      widgetInstance.data["html:slot"] = slotValue;
      worker.refresh(widgetInstance);
      return widgetInstance;
    }

    beforeEach(function () {
      Checkbox.setters = {};
      Checkbox.defaultValues = {};
      worker = new AttributeSlot(Checkbox);
      warnings = [];
      originalWarn = console.warn;
      console.warn = function (message) {
        warnings.push(message);
      };
    });

    afterEach(function () {
      console.warn = originalWarn;
    });

    describe("Registration", function () {

      it("should register a setter for the property, so Uniface can set it", function () {
        expect(Checkbox.setters["html:slot"]).to.have.lengthOf(1);
        expect(Checkbox.setters["html:slot"][0]).to.equal(worker);
      });

      it("should register a default value for the property", function () {
        expect(Checkbox.defaultValues).to.have.property("html:slot");
      });
    });

    describe("The slot of the object definition", function () {

      it("should apply a slot the widget it is placed in offers", function () {
        const element = createLayout({ "html:slot": "heading" });

        expect(element.getAttribute("slot")).to.equal("heading");
        expect(warnings).to.have.lengthOf(0);
      });

      it("should apply the slot before the widget is placed in its container", function () {
        // The element must already carry its slot when it is inserted, so the widget is never
        // rendered in the wrong slot first.
        const element = createLayout({ "html:slot": "start" });

        expect(element.getAttribute("slot")).to.equal("start");
        expect(element.parentElement).to.be.null;
      });

      it("should trim a slot that only differs in surrounding whitespace", function () {
        const element = createLayout({ "html:slot": "  heading  " });

        expect(element.getAttribute("slot")).to.equal("heading");
      });

      it("should not apply a slot when the object definition carries none", function () {
        const element = createLayout({});

        expect(element.hasAttribute("slot")).to.be.false;
        expect(warnings).to.have.lengthOf(0);
      });

      it("should apply the slot to a nested element when the worker is registered on one", function () {
        const root = document.createElement("fluent-checkbox");
        const nested = document.createElement("span");
        nested.classList.add("u-nested");
        root.appendChild(nested);
        worker.setElementQuerySelector(".u-nested");

        createLayout({ "html:slot": "end" }, ["start", "end", "heading"], root);

        expect(nested.getAttribute("slot")).to.equal("end");
        expect(root.hasAttribute("slot")).to.be.false;
      });
    });

    describe("A slot the widget it is placed in does not offer", function () {

      it("should not be applied, so the widget is not left unrendered", function () {
        // The browser renders nothing for an element assigned to a slot that does not exist.
        const element = createLayout({ "html:slot": "footer" });

        expect(element.hasAttribute("slot"), "The widget must stay where it is.").to.be.false;
      });

      it("should not be reported while the layout is created", function () {
        // The value of the object definition reaches setProperties() as a property as well, so
        // reporting it here would report the same slot twice.
        createLayout({ "html:slot": "footer" });

        expect(warnings).to.have.lengthOf(0);
      });

      it("should be reported once, when the value arrives as a property", function () {
        const element = createLayout({ "html:slot": "footer" });

        refreshWith(element, "footer");

        expect(warnings).to.have.lengthOf(1);
        expect(warnings[0]).to.contain("Parent widget does not offer slot 'footer'");
        expect(warnings[0]).to.contain("Ignored");
      });

      it("should not be applied when the widget it is placed in offers no slots at all", function () {
        // Every widget that places its children without slots, such as an entity layout.
        const element = createLayout({ "html:slot": "end" }, []);

        expect(element.hasAttribute("slot")).to.be.false;
        expect(warnings).to.have.lengthOf(0);
      });

      it("should not be applied when the widget it is placed in declares nothing", function () {
        const element = document.createElement("fluent-checkbox");

        worker.initializeLayout(element, objectDefinition({ "html:slot": "end" }));

        expect(element.hasAttribute("slot")).to.be.false;
        expect(warnings).to.have.lengthOf(0);
      });
    });

    describe("Changing the slot at runtime", function () {

      it("should not report the value of the object definition arriving as a property", function () {
        // Uniface delivers the properties of the object definition as an update whenever the
        // widget binds to new data.
        const element = createLayout({ "html:slot": "heading" });

        refreshWith(element, "heading");

        expect(element.getAttribute("slot")).to.equal("heading");
        expect(warnings).to.have.lengthOf(0);
      });

      it("should refuse and report a different slot the widget it is placed in offers", function () {
        const element = createLayout({ "html:slot": "heading" });
        refreshWith(element, "start");

        expect(element.getAttribute("slot"), "The widget stays where it is.").to.equal("heading");
        expect(warnings).to.have.lengthOf(1);
        expect(warnings[0]).to.contain("Property 'html:slot' cannot be changed at runtime");
        expect(warnings[0]).to.contain("Ignored");
      });

      it("should refuse a slot for a widget that is placed in one, whatever the slot", function () {
        // The widget is in a slot, so the widget it is placed in offers slots and this is a move,
        // whether or not the slot asked for is one of them.
        const element = createLayout({ "html:slot": "heading" });

        refreshWith(element, "footer");

        expect(element.getAttribute("slot")).to.equal("heading");
        expect(warnings).to.have.lengthOf(1);
        expect(warnings[0]).to.contain("Property 'html:slot' cannot be changed at runtime");
      });

      it("should refuse a slot for a widget that is placed without slots", function () {
        // The case that would otherwise leave the widget unrendered: nothing offers 'end'.
        const element = createLayout({}, []);

        refreshWith(element, "end");

        expect(element.hasAttribute("slot"), "The widget must stay where it is.").to.be.false;
        expect(warnings).to.have.lengthOf(1);
        expect(warnings[0]).to.contain("Parent widget does not offer slot 'end'");
      });

      it("should not report the empty value that dataInit resets the widget to", function () {
        const element = createLayout({ "html:slot": "heading" });
        refreshWith(element, undefined);
        refreshWith(element, "");

        expect(element.getAttribute("slot")).to.equal("heading");
        expect(warnings).to.have.lengthOf(0);
      });

      it("should refuse a move by a widget that is placed once, whatever slot it asks for", function () {
        // A widget it is placed in that places its children while it creates the layout remembers
        // nothing, so a widget that is placed is refused without weighing the slot it asks for.
        const element = createLayout({ "html:slot": "heading" });

        refreshWith(element, "footer");

        expect(element.getAttribute("slot")).to.equal("heading");
        expect(warnings).to.have.lengthOf(1);
        expect(warnings[0]).to.contain("Property 'html:slot' cannot be changed at runtime");
      });

      it("should report a move to a slot it does offer as a change at runtime", function () {
        const element = createLayout({ "html:slot": "heading" });

        refreshWith(element, "start");

        expect(warnings).to.have.lengthOf(1);
        expect(warnings[0]).to.contain("Property 'html:slot' cannot be changed at runtime");
      });

      it("should apply the slot when the widget it is placed in moves its children", function () {
        // A widget that declares it is not static still starts where the object definition puts it.
        const element = createLayout({ "html:slot": "heading" }, ["start", "end", "heading"], undefined, false);
        expect(element.getAttribute("slot"), "The layout places the child where it starts.").to.equal("heading");

        refreshWith(element, "start");

        expect(element.getAttribute("slot"), "The widget is moved by refresh().").to.equal("start");
        expect(warnings).to.have.lengthOf(0);
      });

      it("should still refuse a slot it does not offer when it moves its children", function () {
        const element = createLayout({ "html:slot": "heading" }, ["start", "end", "heading"], undefined, false);

        refreshWith(element, "footer");

        expect(element.getAttribute("slot")).to.equal("heading");
        expect(warnings).to.have.lengthOf(1);
        expect(warnings[0]).to.contain("Parent widget does not offer slot 'footer'");
      });

      it("should keep reporting a widget that keeps asking to be moved", function () {
        const element = createLayout({ "html:slot": "heading" });
        refreshWith(element, "start");
        refreshWith(element, "start");

        expect(warnings).to.have.lengthOf(2);
      });
    });

    describe("Every widget that offers the slot", function () {

      /**
       * Creates the layout of a widget of the given class, the way Widget.processLayout() does,
       * for a widget the widget it is placed in offers no slots to.
       */
      function createWidgetLayout(widgetClassName, properties) {
        const widgetClass = globalThis.UNIFACE?.ClassRegistry?.get(widgetClassName);
        const skeleton = document.createElement("span");
        skeleton.id = "ufld:FLD.ENT";
        // A collection widget asks its definition for more than its properties. The mockup answers
        // those of a field, so only the two an entity definition carries are stood in for here.
        const definition = Object.assign(
          objectDefinition(properties, {
            "nm": "FLD.ENT",
            "type": "field",
            "widget_class": widgetClassName
          }),
          {
            "getOccurrenceWidgetClass": () => undefined,
            "setOccurrenceProperties": () => undefined
          }
        );
        return widgetClass ? widgetClass.processLayout(skeleton, definition) : null;
      }

      slottedWidgetClasses.forEach(function (widgetClassName) {

        it(`should refuse a slot ${widgetClassName} is not offered`, function () {
          const element = createWidgetLayout(widgetClassName, { "html:slot": "footer" });

          expect(element, `${widgetClassName} should be registered.`).to.exist;
          expect(element.hasAttribute("slot"), `${widgetClassName} must stay where it is.`).to.be.false;
        });

        it(`should create the layout of ${widgetClassName} without reporting the slot`, function () {
          // Also pins that a sub-widget does not report the slot of the widget it is part of.
          createWidgetLayout(widgetClassName, { "html:slot": "footer" });

          expect(warnings.filter((warning) => warning.includes("slot"))).to.have.lengthOf(0);
        });
      });
    });

    describe("The slots the widget it is placed in offers", function () {

      it("should be accepted by a worker of its own, so the slot is not refreshed twice", function () {
        // setProperties() refreshes the setters of every property it is given, so a worker that is
        // registered for both the slot and the placement is refreshed, and reports, once per
        // property whenever the two arrive together.
        expect(Checkbox.setters, "The placement needs a setter of its own.").to.have.property(AttributeSlot.slotPlacementPropId);
        expect(Checkbox.setters[AttributeSlot.slotPlacementPropId][0]).to.not.equal(worker);
      });

      it("should be left on the object definition, which the sub-widgets of a widget share", function () {
        // Every sub-widget creates its layout from the same object definition, and before the widget
        // it is part of does, so a sub-widget that removed the placement would take it away from the
        // widget it was declared for.
        const definition = objectDefinition({ "html:slot": "heading" });
        definition.setProperty(AttributeSlot.slotPlacementPropId, {
          "allowedSlots": ["start", "end", "heading"],
          "isStatic": true
        });

        worker.initializeLayout(document.createElement("fluent-checkbox"), definition);

        expect(definition.getProperty(AttributeSlot.slotPlacementPropId), "The placement should still be readable.").to.exist;
      });

      it("should be declared on the object definition of a child", function () {
        const definition = objectDefinition({});

        definition.setProperty(AttributeSlot.slotPlacementPropId, {
          "allowedSlots": ["start", "end"],
          "isStatic": true
        });

        expect(definition.getProperty(AttributeSlot.slotPlacementPropId)).to.deep.equal({
          "allowedSlots": ["start", "end"],
          "isStatic": true
        });
      });

      it("should be kept per widget, so one widget class answers differently in two places", function () {
        // The point of declaring it on the object definition: the same widget class is used in
        // widgets that offer different slots.
        const inAccordion = createLayout({ "html:slot": "heading" }, ["start", "end", "heading"]);
        const inLayout = createLayout({ "html:slot": "heading" }, []);

        expect(inAccordion.getAttribute("slot"), "The widget the accordion holds is placed.").to.equal("heading");
        expect(inLayout.hasAttribute("slot"), "The widget the layout holds is not.").to.be.false;
      });
    });
  });
})();
