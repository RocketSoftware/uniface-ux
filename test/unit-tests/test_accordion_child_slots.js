/* global chai, describe, it, beforeEach, afterEach, UNIFACE */

(function () {
  "use strict";

  // The widget class comes from the class registry of the bundle, and not from an import of its
  // source, because the source imports the Fluent web components by bare module specifier, which a
  // module loaded straight into the browser cannot resolve.
  const AccordionItem = UNIFACE.ClassRegistry.get("UX.AccordionItem");

  // Unit Test Suite for the ChildSlots worker of AccordionItem.
  // The accordion item declares the slots it offers its child widgets and resolves the slot of
  // every child while its own layout is created, before the children are realized. A slot the item
  // does not offer is reported and replaced by the default slot in the object definition of the
  // child, which is what the child reads when its own layout is created.

  const expect = chai.expect;

  /**
   * Mock object definition of a child widget, holding its design-time properties.
   */
  function childDefinition(name, properties, widgetClass) {
    return {
      "properties": properties,
      "widgetClass": widgetClass || "UX.TextField",
      "getName": function () {
        return name;
      },
      "getType": function () {
        return "field";
      },
      "getProperty": function (propertyName) {
        return this.properties[propertyName];
      },
      "setProperty": function (propertyName, value) {
        this.properties[propertyName] = value;
      },
      "getWidgetClass": function () {
        return this.widgetClass;
      },
      "setWidgetClass": function (widgetClass_) {
        this.widgetClass = widgetClass_;
      }
    };
  }

  /**
   * Mock object definition of the accordion item, holding the definitions of its children.
   */
  function accordionItemDefinition(childDefinitions) {
    return {
      "getChildDefinitions": function () {
        return childDefinitions;
      }
    };
  }

  // Mock widget class, standing in for the widget the worker is registered on.
  class MockAccordionItem {
    static setters = {};
    static defaultValues = {};
    static getters = {};
    static triggers = {};
  }

  describe("AccordionItem ChildSlots Worker", function () {

    let worker;
    let warnings;
    let originalWarn;

    beforeEach(function () {
      worker = new AccordionItem.ChildSlots(MockAccordionItem, "span", AccordionItem.childSlotConfig);
      warnings = [];
      originalWarn = console.warn;
      console.warn = function (message) {
        warnings.push(message);
      };
    });

    afterEach(function () {
      console.warn = originalWarn;
    });

    describe("The slots the accordion item offers", function () {

      it("should offer the header slots of fluent-accordion-item", function () {
        expect(AccordionItem.childSlotConfig.validSlots).to.eql(["start", "end", "heading"]);
      });

      it("should use the default slot of fluent-accordion-item as its default", function () {
        expect(AccordionItem.childSlotConfig.defaultSlot).to.equal("");
      });

      it("should read the slot from the 'html:slot' property of a child", function () {
        expect(AccordionItem.childSlotConfig.propertyName).to.equal("html:slot");
      });

      it("should declare on every child how this accordion item places it", function () {
        // AttributeSlot of the child reads the declaration while the layout of the child is created.
        const children = [
          childDefinition("STATUS.ORDERS", { "html:slot": "heading" }),
          childDefinition("TOTAL.ORDERS", {})
        ];

        worker.getLayout(accordionItemDefinition(children));

        children.forEach(function (child) {
          const placement = child.getProperty("slot-placement");
          expect(placement, `Child '${child.getName()}' should be told how this item places it.`).to.exist;
          expect(placement.allowedSlots).to.eql(["start", "end", "heading"]);
          expect(placement.isStatic, "The declaration should say whether children are placed once.").to.be.a("boolean");
        });
      });
    });

    describe("Resolving the slot of a child", function () {

      it("should leave a slot the accordion item offers untouched", function () {
        const child = childDefinition("STATUS.ORDERS", { "html:slot": "heading" });

        worker.getLayout(accordionItemDefinition([child]));

        expect(child.getProperty("html:slot")).to.equal("heading");
        expect(warnings).to.have.lengthOf(0);
      });

      it("should render a child in the heading slot as a heading field", function () {
        const child = childDefinition("STATUS.ORDERS", { "html:slot": "heading" }, "UX.Button");

        worker.getLayout(accordionItemDefinition([child]));

        expect(child.getWidgetClass()).to.equal("UX.AccordionHeadingField");
        expect(child.getProperty("org-widget-class")).to.equal("UX.Button");
      });

      it("should leave a child without a slot untouched", function () {
        const child = childDefinition("STATUS.ORDERS", {});

        worker.getLayout(accordionItemDefinition([child]));

        expect(child.getProperty("html:slot")).to.be.undefined;
        expect(warnings).to.have.lengthOf(0);
      });

      it("should accept a slot that only differs in surrounding whitespace", function () {
        const child = childDefinition("STATUS.ORDERS", { "html:slot": " heading " });

        worker.getLayout(accordionItemDefinition([child]));

        expect(child.getProperty("html:slot")).to.equal(" heading ");
        expect(warnings).to.have.lengthOf(0);
      });

      it("should replace a slot the accordion item does not offer by the default slot", function () {
        const child = childDefinition("STATUS.ORDERS", { "html:slot": "footer" });

        worker.getLayout(accordionItemDefinition([child]));

        expect(child.getProperty("html:slot")).to.equal("");
      });

      it("should report a slot the accordion item does not offer", function () {
        const child = childDefinition("STATUS.ORDERS", { "html:slot": "footer" });

        worker.getLayout(accordionItemDefinition([child]));

        expect(warnings).to.have.lengthOf(1);
        expect(warnings[0]).to.contain("STATUS.ORDERS");
        expect(warnings[0]).to.contain("has invalid slot 'footer'");
        expect(warnings[0]).to.contain("Using the default slot");
      });

      it("should report every child that asks for a slot it cannot have", function () {
        const children = [
          childDefinition("STATUS.ORDERS", { "html:slot": "footer" }),
          childDefinition("TOTAL.ORDERS", { "html:slot": "heading" }),
          childDefinition("REMARK.ORDERS", { "html:slot": "sidebar" })
        ];

        worker.getLayout(accordionItemDefinition(children));

        expect(warnings).to.have.lengthOf(2);
        expect(children[0].getProperty("html:slot")).to.equal("");
        expect(children[1].getProperty("html:slot")).to.equal("heading");
        expect(children[2].getProperty("html:slot")).to.equal("");
      });
    });

    describe("The layout it creates", function () {

      it("should create a binding element per child widget", function () {
        const children = [
          childDefinition("STATUS.ORDERS", { "html:slot": "heading" }),
          childDefinition("TOTAL.ORDERS", {})
        ];

        const elements = worker.getLayout(accordionItemDefinition(children));

        expect(elements).to.have.lengthOf(2);
        expect(elements[0].id).to.equal("ufld:STATUS.ORDERS");
        expect(elements[1].id).to.equal("ufld:TOTAL.ORDERS");
      });

      it("should create no elements for an accordion item without children", function () {
        const elements = worker.getLayout(accordionItemDefinition([]));

        expect(elements).to.have.lengthOf(0);
      });

      it("should not fail on a definition that returns no children", function () {
        const elements = worker.getLayout({
          "getChildDefinitions": function () {
            return undefined;
          }
        });

        expect(elements).to.have.lengthOf(0);
      });
    });
  });
})();
