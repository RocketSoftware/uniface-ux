(function () {
  "use strict";

  const assert = chai.assert;
  const expect = chai.expect;

  // Collection Entity test setup.
  const collectionTester = new umockup.WidgetTester("UX.Accordion", "uent:ACCORD.NOMODEL");
  const collectionWidgetId = collectionTester.widgetId;
  const collectionWidgetName = collectionTester.widgetName;
  const collectionWidgetClass = collectionTester.getWidgetClass();

  // Occurrence Entity test setup.
  const occurrenceTester = new umockup.WidgetTester("UX.AccordionItem", "uocc:ACCORD.NOMODEL.1");
  const occurrenceWidgetId = occurrenceTester.widgetId;
  const occurrenceWidgetName = occurrenceTester.widgetName;
  const occurrenceWidgetClass = occurrenceTester.getWidgetClass();

  // Heading Field test setup. Internal widget a child is reclassified to when slotted into the
  // accordion "heading" slot; it renders the original widget's formatted value as read-only text.
  const headingWidgetName = "UX.AccordionHeadingField";
  const headingWidgetClass = new umockup.WidgetTester(headingWidgetName, "ufld:HEADING.ACCORD.NOMODEL").getWidgetClass();

  const asyncRun = umockup.asyncRun;
  const createSkeleton = umockup.createSkeleton;

  const mockEntityDef = {
    "nm": "ACCORD.NOMODEL",
    "type": "entity",
    "widget_class": "UX.Accordion",
    "occs": {
      "#2": {
        "type": "occurrence",
        "#3": {
          "nm": "HEADING.ACCORD.NOMODEL",
          "type": "field",
          "widget_class": "UX.PlainText",
          "properties": {},
          "id": "#3"
        },
        "#4": {
          "nm": "STATUS.ACCORD.NOMODEL",
          "type": "field",
          "widget_class": "UX.Button",
          "properties": {},
          "id": "#4"
        },
        "#5": {
          "nm": "BADGE.ACCORD.NOMODEL",
          "type": "field",
          "widget_class": "UX.PlainText",
          "properties": {},
          "id": "#5"
        },
        "#6": {
          "nm": "TEXTFIELD.ACCORD.NOMODEL",
          "type": "field",
          "widget_class": "UX.TextField",
          "properties": {
            "html:type": "text"
          },
          "id": "#6"
        },
        "widget_class": "UX.AccordionItem"
      }
    },
    "properties": {},
    "id": "#2",
    "hasNEDFields": true,
    "ownsNEDFields": true
  };

  function verifyWidgetClass(widgetClass, widgetName) {
    assert(
      widgetClass,
      `Widget class '${widgetName}' is not defined!
          Hint: Check if the JavaScript file defined class '${widgetName}' is loaded.`
    );
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

    describe("Accordion specific", function () {

      it("should have a static property structure of type Element", function () {
        const structure = collectionWidgetClass.structure;
        expect(structure.constructor, "Structure constructor should be an instance of Element constructor.").to.be.an.instanceof(Element.constructor);
        expect(structure.tagName, "Structure tagName should be 'uf-accordion-container'.").to.equal("uf-accordion-container");
        expect(structure.styleClass, "Structure styleClass should be empty string.").to.equal("");
        expect(structure.elementQuerySelector, "Structure elementQuerySelector should be empty string.").to.equal("");
        expect(structure.childWorkers, "Structure childWorkers should be an array.").to.be.an("array");
      });

      it("should have header content workers and a fluent-accordion body element", function () {
        const structure = collectionWidgetClass.structure;
        const prefixWorker = structure.childWorkers.find(w => w.styleClass === "u-accordion-prefix");
        const labelWorker = structure.childWorkers.find(w => w.styleClass === "u-accordion-label");
        const suffixWorker = structure.childWorkers.find(w => w.styleClass === "u-accordion-suffix");
        const bodyElement = structure.childWorkers.find(w => w.styleClass === "u-accordion");
        assert(prefixWorker, "Prefix header worker should exist.");
        assert(labelWorker, "Label header worker should exist.");
        assert(suffixWorker, "Suffix header worker should exist.");
        assert(bodyElement, "Body element should exist.");
        expect(bodyElement.tagName, "Body element should have tagName 'fluent-accordion'.").to.equal("fluent-accordion");
      });

      it("should not define any triggers", function () {
        expect(Object.keys(collectionWidgetClass.triggers), "Accordion should not define triggers.").to.have.lengthOf(0);
      });
    });

    describe("AccordionItem specific", function () {

      it("should have a static property structure of type Element", function () {
        const structure = occurrenceWidgetClass.structure;
        expect(structure.constructor, "Structure constructor should be an instance of Element constructor.").to.be.an.instanceof(Element.constructor);
        expect(structure.tagName, "Structure tagName should be 'fluent-accordion-item'.").to.equal("fluent-accordion-item");
        expect(structure.styleClass, "Structure styleClass should be empty string.").to.equal("");
        expect(structure.childWorkers, "Structure childWorkers should be an array.").to.be.an("array");
      });

      it("should have heading, start, and end content workers", function () {
        const structure = occurrenceWidgetClass.structure;
        const headingWorker = structure.childWorkers.find(w => w.styleClass === "u-label-text");
        const prefixWorker = structure.childWorkers.find(w => w.styleClass === "u-prefix-icon");
        const suffixWorker = structure.childWorkers.find(w => w.styleClass === "u-suffix-text");
        assert(headingWorker, "Heading text worker should exist.");
        assert(prefixWorker, "Prefix heading worker should exist.");
        assert(suffixWorker, "Suffix heading worker should exist.");
      });

      it("should not define any triggers", function () {
        expect(Object.keys(occurrenceWidgetClass.triggers), "AccordionItem should not define triggers.").to.have.lengthOf(0);
      });
    });
  });

  describe("processLayout()", function () {

    describe("Accordion specific", function () {
      let element;

      before(function () {
        const collectionSkeleton = createSkeleton(collectionWidgetId);
        element = collectionTester.processLayout(collectionSkeleton, mockEntityDef);
      });

      it("should be an instance of HTMLElement", function () {
        expect(element, `Function processLayout() of ${collectionWidgetName} does not return an HTMLElement.`).instanceOf(HTMLElement);
      });

      it("should register the fluent-accordion web component", function () {
        const customElementNames = ["uf-accordion-container", "fluent-accordion", "fluent-accordion-item"];
        for (const name of customElementNames) {
          assert(window.customElements.get(name), `Web component ${name} has not been registered!`);
        }
      });

      it("should have the correct id", function () {
        expect(element, `Element should have id ${collectionWidgetId}.`).to.have.id(collectionWidgetId);
      });

      it("should use the uf-accordion-container as root with a fluent-accordion body", function () {
        expect(element.tagName.toLowerCase(), "Root should be 'uf-accordion-container'.").to.equal("uf-accordion-container");
        assert(element.querySelector("fluent-accordion.u-accordion"), "Collection misses the '.u-accordion' element.");
      });

      it("should have prefix, label and suffix header content elements", function () {
        assert(element.querySelector(".u-accordion-prefix"), "Collection misses the '.u-accordion-prefix' element.");
        assert(element.querySelector(".u-accordion-label"), "Collection misses the '.u-accordion-label' element.");
        assert(element.querySelector(".u-accordion-suffix"), "Collection misses the '.u-accordion-suffix' element.");
      });

      it("should render an occurrence widget inside the fluent-accordion body", function () {
        const body = element.querySelector("fluent-accordion.u-accordion");
        assert(body, "Collection misses the '.u-accordion' element.");
        const occurrence = body.firstElementChild;
        assert(occurrence, "Collection misses the rendered occurrence element inside the accordion body.");
        expect(occurrence.tagName.toLowerCase(), "Occurrence should be a 'fluent-accordion-item'.").to.equal("fluent-accordion-item");
      });
    });

    describe("AccordionItem specific", function () {
      let element;

      before(function () {
        const occurrenceSkeleton = createSkeleton(occurrenceWidgetId);
        element = occurrenceTester.processLayout(occurrenceSkeleton, mockEntityDef);
      });

      it("should be an instance of HTMLElement", function () {
        expect(element, `Function processLayout() of ${occurrenceWidgetName} does not return an HTMLElement.`).instanceOf(HTMLElement);
      });

      it("should have tagName 'fluent-accordion-item'", function () {
        expect(element.tagName.toLowerCase(), "Occurrence should have tagName 'fluent-accordion-item'.").to.equal("fluent-accordion-item");
      });

      it("should have heading, start, and end content elements", function () {
        assert(element.querySelector(".u-label-text"), "Occurrence misses the '.u-label-text' element.");
        assert(element.querySelector(".u-prefix-icon"), "Occurrence misses the '.u-prefix-icon' element.");
        assert(element.querySelector(".u-suffix-icon"), "Occurrence misses the '.u-suffix-icon' element.");
      });

      it("should place child fields as direct children of the accordion item", function () {
        assert(element.querySelector("[id^='ufld:HEADING']"), "Occurrence should contain the heading field.");
        assert(element.querySelector("[id^='ufld:STATUS']"), "Occurrence should contain the status field.");
        assert(element.querySelector("[id^='ufld:BADGE']"), "Occurrence should contain the badge field.");
        assert(element.querySelector("[id^='ufld:TEXTFIELD']"), "Occurrence should contain the text field.");
      });
    });

    describe("AccordionItem child slot resolution", function () {

      const mockDefWithSlotsTemplate = {
        "nm": "ACCORD.NOMODEL",
        "type": "entity",
        "widget_class": "UX.Accordion",
        "occs": {
          "#2": {
            "type": "occurrence",
            "#3": {
              "nm": "HEAD.ACCORD.NOMODEL",
              "type": "field",
              "widget_class": "UX.PlainText",
              "properties": { "html:slot": "heading" },
              "id": "#3"
            },
            "#4": {
              "nm": "BADSLOT.ACCORD.NOMODEL",
              "type": "field",
              "widget_class": "UX.PlainText",
              "properties": { "html:slot": "footer" },
              "id": "#4"
            },
            "#5": {
              "nm": "BODY.ACCORD.NOMODEL",
              "type": "field",
              "widget_class": "UX.TextField",
              "properties": {},
              "id": "#5"
            },
            "#6": {
              "nm": "BTNHEAD.ACCORD.NOMODEL",
              "type": "field",
              "widget_class": "UX.Button",
              "properties": { "html:slot": "heading" },
              "id": "#6"
            },
            "#7": {
              "nm": "STARTFIELD.ACCORD.NOMODEL",
              "type": "field",
              "widget_class": "UX.PlainText",
              "properties": { "html:slot": "start" },
              "id": "#7"
            },
            "#8": {
              "nm": "ENDBTN.ACCORD.NOMODEL",
              "type": "field",
              "widget_class": "UX.Button",
              "properties": { "html:slot": "end" },
              "id": "#8"
            },
            "widget_class": "UX.AccordionItem"
          }
        },
        "properties": {},
        "id": "#2",
        "hasNEDFields": true,
        "ownsNEDFields": true
      };

      it("should place a child declaring html:slot 'heading' into the heading slot", function () {
        const slotTester = new umockup.WidgetTester("UX.AccordionItem", "uocc:ACCORD.NOMODEL.1");
        const mockDefWithSlots = JSON.parse(JSON.stringify(mockDefWithSlotsTemplate));
        const element = slotTester.processLayout(createSkeleton(slotTester.widgetId), mockDefWithSlots);
        const headingChild = element.querySelector("[id^='ufld:HEAD']");
        assert(headingChild, "Occurrence should contain the heading-slotted child.");
        expect(headingChild.getAttribute("slot"), "Heading-slotted child should be placed into the 'heading' slot.").to.equal("heading");
      });

      it("should route a 'UX.Button' heading-slot child into the heading slot", function () {
        const slotTester = new umockup.WidgetTester("UX.AccordionItem", "uocc:ACCORD.NOMODEL.1");
        const mockDefWithSlots = JSON.parse(JSON.stringify(mockDefWithSlotsTemplate));
        const element = slotTester.processLayout(createSkeleton(slotTester.widgetId), mockDefWithSlots);
        const buttonHeadingChild = element.querySelector("[id^='ufld:BTNHEAD']");
        assert(buttonHeadingChild, "Occurrence should contain the button heading-slotted child.");
        expect(buttonHeadingChild.getAttribute("slot"), "A 'UX.Button' heading child should also be routed to the 'heading' slot.").to.equal("heading");
      });

      it("should reclassify the 'UX.Button' heading child to the heading field while recording 'org-widget-class' as 'UX.Button'", function () {
        // The occurrence reclassifies heading-slot children in place while it lays out, recording the
        // original widget class under 'org-widget-class'. Use a fresh definition: the reclassification
        // mutates the child definition, so re-running processLayout on a shared mock would overwrite
        // 'org-widget-class' with the (already reclassified) heading field class.
        const freshDef = {
          "nm": "ACCORD.NOMODEL",
          "type": "entity",
          "widget_class": "UX.Accordion",
          "occs": {
            "#2": {
              "type": "occurrence",
              "#3": {
                "nm": "BTNHEAD.ACCORD.NOMODEL",
                "type": "field",
                "widget_class": "UX.Button",
                "properties": { "html:slot": "heading" },
                "id": "#3"
              },
              "widget_class": "UX.AccordionItem"
            }
          },
          "properties": {},
          "id": "#2",
          "hasNEDFields": true,
          "ownsNEDFields": true
        };
        const slotTester = new umockup.WidgetTester("UX.AccordionItem", "uocc:ACCORD.NOMODEL.1");
        slotTester.processLayout(createSkeleton(slotTester.widgetId), freshDef);
        const buttonChild = freshDef.occs["#2"]["#3"];
        expect(
          buttonChild.widget_class,
          "The 'UX.Button' heading child should be reclassified to 'UX.AccordionHeadingField'."
        ).to.equal("UX.AccordionHeadingField");
        expect(
          buttonChild.properties["org-widget-class"],
          "The original 'UX.Button' class should be recorded under 'org-widget-class'."
        ).to.equal("UX.Button");
      });

      it("should warn when a child requests a slot that is not offered", function () {
        const slotTester = new umockup.WidgetTester("UX.AccordionItem", "uocc:ACCORD.NOMODEL.1");
        const mockDefWithSlots = JSON.parse(JSON.stringify(mockDefWithSlotsTemplate));
        const warnSpy = sinon.spy(console, "warn");
        try {
          slotTester.processLayout(createSkeleton(slotTester.widgetId), mockDefWithSlots);
          expect(
            warnSpy.calledWith(sinon.match("Child 'BADSLOT.ACCORD.NOMODEL' has invalid slot 'footer'")),
            "Console should warn about the unsupported 'footer' slot."
          ).to.be.true;
        } finally {
          warnSpy.restore();
        }
      });

      it("should declare the slots it offers on the object definition of every child", function () {
        // AttributeSlot of the child reads this while the layout of the child is created, and the
        // child is placed only in a slot this occurrence offers. It stays on the definition, which
        // the sub-widgets of the child create their layout from as well.
        const slotTester = new umockup.WidgetTester("UX.AccordionItem", "uocc:ACCORD.NOMODEL.1");
        const mockDefWithSlots = JSON.parse(JSON.stringify(mockDefWithSlotsTemplate));
        slotTester.processLayout(createSkeleton(slotTester.widgetId), mockDefWithSlots);

        const occurrence = mockDefWithSlots.occs["#2"];
        ["#3", "#4", "#5", "#6", "#7", "#8"].forEach(function (childKey) {
          const placement = occurrence[childKey].properties["slot-placement"];
          assert(placement, `Child '${childKey}' should be told how this occurrence places it.`);
          expect(placement.allowedSlots, `Child '${childKey}' should be offered the header slots.`).to.deep.equal(["start", "end", "heading"]);
        });
      });

      it("should keep a child without an html:slot in the default (body) slot", function () {
        const slotTester = new umockup.WidgetTester("UX.AccordionItem", "uocc:ACCORD.NOMODEL.1");
        const mockDefWithSlots = JSON.parse(JSON.stringify(mockDefWithSlotsTemplate));
        const element = slotTester.processLayout(createSkeleton(slotTester.widgetId), mockDefWithSlots);
        const bodyChild = element.querySelector("[id^='ufld:BODY']");
        assert(bodyChild, "Occurrence should contain the body child.");
        expect(bodyChild.getAttribute("slot"), "Body child should not be assigned to a header slot.").to.not.be.oneOf(["heading", "start", "end"]);
      });

      it("should place a child declaring html:slot 'start' into the start slot without reclassifying it", function () {
        const slotTester = new umockup.WidgetTester("UX.AccordionItem", "uocc:ACCORD.NOMODEL.1");
        const mockDefWithSlots = JSON.parse(JSON.stringify(mockDefWithSlotsTemplate));
        const element = slotTester.processLayout(createSkeleton(slotTester.widgetId), mockDefWithSlots);
        const startChild = element.querySelector("[id^='ufld:STARTFIELD']");
        assert(startChild, "Occurrence should contain the start-slotted child.");
        expect(startChild.getAttribute("slot"), "Start-slotted child should be placed into the 'start' slot.").to.equal("start");
        expect(
          mockDefWithSlots.occs["#2"]["#7"].widget_class,
          "A 'start' child should keep its original widget class (only 'heading' children are reclassified)."
        ).to.equal("UX.PlainText");
      });

      it("should place a child declaring html:slot 'end' into the end slot without reclassifying it", function () {
        const slotTester = new umockup.WidgetTester("UX.AccordionItem", "uocc:ACCORD.NOMODEL.1");
        const mockDefWithSlots = JSON.parse(JSON.stringify(mockDefWithSlotsTemplate));
        const element = slotTester.processLayout(createSkeleton(slotTester.widgetId), mockDefWithSlots);
        const endChild = element.querySelector("[id^='ufld:ENDBTN']");
        assert(endChild, "Occurrence should contain the end-slotted child.");
        expect(endChild.getAttribute("slot"), "End-slotted child should be placed into the 'end' slot.").to.equal("end");
        expect(
          mockDefWithSlots.occs["#2"]["#8"].widget_class,
          "An 'end' child should keep its original widget class (only 'heading' children are reclassified)."
        ).to.equal("UX.Button");
      });
    });
  });

  describe("Create widget", function () {

    describe("Accordion specific", function () {

      it("constructor()", function () {
        const widget = collectionTester.construct();
        expect(widget, "collectionTester.construct() should return a widget instance").to.exist;
        expect(collectionWidgetClass.defaultValues, "Collection widget class should define required default values").to.include.all.keys(
          "class:u-accordion-container",
          "expand-mode",
          "label-text",
          "label-align",
          "prefix-icon",
          "suffix-icon"
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

    describe("AccordionItem specific", function () {

      it("constructor()", function () {
        const widget = occurrenceTester.construct();
        expect(widget, "occurrenceTester.construct() should return a widget instance").to.exist;
        expect(occurrenceWidgetClass.defaultValues, "Occurrence widget class should define required default values").to.include.all.keys(
          "class:u-accordion-item",
          "item:expanded",
          "item:label-text",
          "item:label-size"
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

      it("should block and unblock the internal heading button", function () {
        const occurrenceSkeleton = createSkeleton(occurrenceWidgetId);
        const widget = occurrenceTester.createWidget(null, occurrenceSkeleton, mockEntityDef);
        // The fluent element renders its shadow template when it is connected, and the rules that
        // style its parts apply from the document.
        document.body.appendChild(occurrenceTester.element);
        const button = occurrenceTester.element.shadowRoot.querySelector("[part='button']");
        assert(button, "Accordion occurrence should expose its internal heading button.");

        widget.blockUI();
        expect(occurrenceTester.element, "Blocked occurrence should have the 'u-blocked' class.").to.have.class("u-blocked");
        expect(button.disabled, "Blocked occurrence should disable its internal heading button.").to.be.true;

        widget.unblockUI();
        expect(occurrenceTester.element, "Unblocked occurrence should remove the 'u-blocked' class.").not.to.have.class("u-blocked");
        expect(button.disabled, "Unblocked occurrence should re-enable its internal heading button.").to.be.false;
      });

      it("should apply a 'not-allowed' cursor to the heading and internal button when blocked", function () {
        const occurrenceSkeleton = createSkeleton(occurrenceWidgetId);
        const widget = occurrenceTester.createWidget(null, occurrenceSkeleton, mockEntityDef);
        // The fluent element renders its shadow template when it is connected, and the rules that
        // style its parts apply from the document.
        document.body.appendChild(occurrenceTester.element);
        const shadowRoot = occurrenceTester.element.shadowRoot;
        const heading = shadowRoot.querySelector("[part='heading']");
        const button = shadowRoot.querySelector("[part='button']");
        assert(heading, "Accordion occurrence should expose its internal heading wrapper.");
        assert(button, "Accordion occurrence should expose its internal heading button.");

        widget.blockUI();
        expect(window.getComputedStyle(heading).cursor, "Blocked heading wrapper should show a 'not-allowed' cursor.").to.equal("not-allowed");
        expect(window.getComputedStyle(button).cursor, "Blocked internal button should show a 'not-allowed' cursor.").to.equal("not-allowed");

        widget.unblockUI();
        expect(window.getComputedStyle(heading).cursor, "Unblocked heading wrapper should not show a 'not-allowed' cursor.").to.not.equal("not-allowed");
        expect(window.getComputedStyle(button).cursor, "Unblocked internal button should not show a 'not-allowed' cursor.").to.not.equal("not-allowed");
      });

      // The 'start' and 'end' parts are siblings of 'button' inside 'heading' (per Fluent's
      // accordionItemTemplate), so they have no dedicated blocked rule and rely on inheriting
      // 'not-allowed' from the '::part(heading)' wrapper - this pins down that inheritance.
      it("should inherit the 'not-allowed' cursor into the start and end slot areas when blocked", function () {
        const occurrenceSkeleton = createSkeleton(occurrenceWidgetId);
        const widget = occurrenceTester.createWidget(null, occurrenceSkeleton, mockEntityDef);
        // The fluent element renders its shadow template when it is connected, and the rules that
        // style its parts apply from the document.
        document.body.appendChild(occurrenceTester.element);
        const shadowRoot = occurrenceTester.element.shadowRoot;
        const start = shadowRoot.querySelector("[part='start']");
        const end = shadowRoot.querySelector("[part='end']");
        assert(start, "Accordion occurrence should expose its internal start slot wrapper.");
        assert(end, "Accordion occurrence should expose its internal end slot wrapper.");

        widget.blockUI();
        expect(window.getComputedStyle(start).cursor, "Blocked start slot wrapper should show a 'not-allowed' cursor.").to.equal("not-allowed");
        expect(window.getComputedStyle(end).cursor, "Blocked end slot wrapper should show a 'not-allowed' cursor.").to.equal("not-allowed");

        widget.unblockUI();
        expect(window.getComputedStyle(start).cursor, "Unblocked start slot wrapper should not show a 'not-allowed' cursor.").to.not.equal("not-allowed");
        expect(window.getComputedStyle(end).cursor, "Unblocked end slot wrapper should not show a 'not-allowed' cursor.").to.not.equal("not-allowed");
      });
    });
  });

  describe("dataInit()", function () {

    describe("Accordion specific", function () {
      const classes = collectionTester.getDefaultClasses();
      let element;

      before(function () {
        const collectionSkeleton = createSkeleton(collectionWidgetId);
        collectionTester.createWidget(null, collectionSkeleton, mockEntityDef);
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

      it("should have default value 'multi' for 'expand-mode'", function () {
        expect(collectionTester.defaultValues["expand-mode"], "Default value of 'expand-mode' should be 'multi'.").to.equal("multi");
      });

      it("should set expand-mode attribute 'multi' on the fluent-accordion body", function () {
        const body = element.querySelector("fluent-accordion.u-accordion");
        expect(body.getAttribute("expand-mode"), "Body should have expand-mode 'multi' by default.").to.equal("multi");
      });

      it("should have default value 'start' for 'label-align'", function () {
        expect(collectionTester.defaultValues["label-align"], "Default value of 'label-align' should be 'start'.").to.equal("start");
      });

      it("should have default value '' for 'label-text' and the label span should be hidden and empty", function () {
        expect(collectionTester.defaultValues["label-text"], "Default value of 'label-text' should be empty string.").to.equal("");
        const labelElement = element.querySelector(".u-accordion-label");
        expect(labelElement, "The '.u-accordion-label' element should exist after dataInit.").to.exist;
        expect(labelElement.textContent, "The label text content should be empty string by default.").to.equal("");
        expect(labelElement.hidden, "The '.u-accordion-label' element should be hidden by default.").to.be.true;
      });
    });

    describe("AccordionItem specific", function () {
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

      it("should have default value 'false' for 'item:expanded'", function () {
        expect(occurrenceTester.defaultValues["item:expanded"], "Default value of 'item:expanded' should be false.").to.equal(false);
      });

      it("should have default value 'medium' for 'item:label-size' and set heading-level '2'", function () {
        expect(occurrenceTester.defaultValues["item:label-size"], "Default value of 'item:label-size' should be 'medium'.").to.equal("medium");
        expect(element.getAttribute("heading-level"), "Occurrence should have heading-level '2' by default.").to.equal("2");
      });

      it("should not define a collection-only 'expand-mode' property", function () {
        expect(occurrenceTester.defaultValues["expand-mode"], "AccordionItem should not define 'expand-mode'.").to.be.undefined;
      });

      it("should not define layout properties", function () {
        expect(occurrenceTester.defaultValues["layout-type"], "AccordionItem should not define 'layout-type'.").to.be.undefined;
        expect(occurrenceTester.defaultValues["horizontal-align"], "AccordionItem should not define 'horizontal-align'.").to.be.undefined;
        expect(occurrenceTester.defaultValues["vertical-align"], "AccordionItem should not define 'vertical-align'.").to.be.undefined;
      });
    });
  });

  describe("dataUpdate()", function () {

    describe("Accordion specific", function () {
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

      it("should update label-text", function () {
        return asyncRun(function () {
          collectionTester.dataUpdate({ "label-text": "Group Label" });
        }).then(function () {
          const labelElement = element.querySelector(".u-accordion-label");
          expect(labelElement.textContent, "The label text content should equal 'Group Label'.").to.equal("Group Label");
          expect(labelElement.hidden, "The label element should be visible after setting label-text.").to.be.false;
        });
      });

      ["multi", "single"].forEach(function (mode) {
        it(`should update expand-mode to '${mode}'`, function () {
          return asyncRun(function () {
            collectionTester.dataUpdate({ "expand-mode": mode });
          }).then(function () {
            const body = element.querySelector("fluent-accordion.u-accordion");
            expect(body.getAttribute("expand-mode"), `Body should have expand-mode '${mode}'.`).to.equal(mode);
          });
        });
      });

      it("should update the prefix-icon", function () {
        return asyncRun(function () {
          collectionTester.dataUpdate({ "prefix-icon": "Info" });
        }).then(function () {
          const prefix = element.querySelector(".u-accordion-prefix");
          expect(prefix.classList.contains("ms-Icon--Info"), "Prefix should show the 'Info' icon.").to.be.true;
          expect(prefix.hidden, "Prefix element should be visible after setting prefix-icon.").to.be.false;
        });
      });

      it("should update the suffix-icon", function () {
        return asyncRun(function () {
          collectionTester.dataUpdate({ "suffix-icon": "ChevronDown" });
        }).then(function () {
          const suffix = element.querySelector(".u-accordion-suffix");
          expect(suffix.classList.contains("ms-Icon--ChevronDown"), "Suffix should show the 'ChevronDown' icon.").to.be.true;
        });
      });

      ["start", "center", "end"].forEach(function (align) {
        it(`should update label-align to '${align}'`, function () {
          return asyncRun(function () {
            collectionTester.dataUpdate({ "label-align": align });
          }).then(function () {
            expect(element.getAttribute("label-align"), `Root container should have label-align '${align}'.`).to.equal(align);
          });
        });
      });

      ["small", "medium", "large", "normal"].forEach(function (size) {
        it(`should update label-size to '${size}'`, function () {
          return asyncRun(function () {
            collectionTester.dataUpdate({ "label-size": size });
          }).then(function () {
            expect(element.getAttribute("label-size"), `Root container should have label-size '${size}'.`).to.equal(size);
          });
        });
      });

      it("should warn and ignore an invalid expand-mode value", function () {
        const warnSpy = sinon.spy(console, "warn");
        return asyncRun(function () {
          collectionTester.dataUpdate({ "expand-mode": "bogus" });
        }).then(function () {
          expect(
            warnSpy.calledWith(sinon.match("Property 'expand-mode' invalid value (bogus) - Ignored.")),
            "Console should warn about the invalid 'expand-mode' value."
          ).to.be.true;
          warnSpy.restore();
        });
      });

      it("should hide the whole accordion when html:hidden is true", function () {
        return asyncRun(function () {
          collectionTester.dataUpdate({ "html:hidden": true });
        }).then(function () {
          expect(element.hidden, "Accordion should be hidden when html:hidden is true.").to.be.true;
        });
      });
    });

    describe("AccordionItem specific", function () {
      let element;

      before(function () {
        return asyncRun(function () {
          const occurrenceSkeleton = createSkeleton(occurrenceWidgetId);
          occurrenceTester.createWidget(null, occurrenceSkeleton, mockEntityDef);
          element = occurrenceTester.element;
        }).then(function () {
          assert(element, "Widget top element is not defined!");
        });
      });

      it("should update item:label-text", function () {
        return asyncRun(function () {
          occurrenceTester.dataUpdate({ "item:label-text": "Panel One" });
        }).then(function () {
          const labelText = element.querySelector(".u-label-text");
          expect(labelText.textContent, "The label text content should equal 'Panel One'.").to.equal("Panel One");
          expect(labelText.getAttribute("slot"), "Label text should be slotted into 'heading'.").to.equal("heading");
        });
      });

      const headingSizeToLevel = {
        "small": "3",
        "medium": "2",
        "large": "1"
      };
      Object.keys(headingSizeToLevel).forEach(function (size) {
        it(`should map item:label-size '${size}' to heading-level '${headingSizeToLevel[size]}'`, function () {
          return asyncRun(function () {
            occurrenceTester.dataUpdate({ "item:label-size": size });
          }).then(function () {
            expect(element.getAttribute("heading-level"), `item:label-size '${size}' should map to level '${headingSizeToLevel[size]}'.`).to.equal(headingSizeToLevel[size]);
          });
        });
      });

      it("should update the expanded state", function () {
        return asyncRun(function () {
          occurrenceTester.dataUpdate({ "item:expanded": true });
        }).then(function () {
          expect(element.expanded, "Occurrence 'expanded' property should be true.").to.be.true;
        });
      });

      it("should update the item:prefix-icon in the start slot", function () {
        return asyncRun(function () {
          occurrenceTester.dataUpdate({ "item:prefix-icon": "StatusCircleCheckmark" });
        }).then(function () {
          const icon = element.querySelector(".u-prefix-icon");
          expect(icon.classList.contains("ms-Icon--StatusCircleCheckmark"), "Prefix icon should be shown.").to.be.true;
          expect(icon.getAttribute("slot"), "Prefix icon should be slotted into 'start'.").to.equal("start");
        });
      });

      it("should update the item:suffix-text in the end slot", function () {
        return asyncRun(function () {
          occurrenceTester.dataUpdate({ "item:suffix-text": "New" });
        }).then(function () {
          const text = element.querySelector(".u-suffix-text");
          expect(text.textContent, "Suffix text should equal 'New'.").to.equal("New");
          expect(text.getAttribute("slot"), "Suffix text should be slotted into 'end'.").to.equal("end");
        });
      });

      it("should update the item:prefix-text in the start slot", function () {
        return asyncRun(function () {
          occurrenceTester.dataUpdate({ "item:prefix-text": "Pre" });
        }).then(function () {
          const text = element.querySelector(".u-prefix-text");
          expect(text.textContent, "Prefix text should equal 'Pre'.").to.equal("Pre");
          expect(text.getAttribute("slot"), "Prefix text should be slotted into 'start'.").to.equal("start");
        });
      });

      it("should update the item:suffix-icon in the end slot", function () {
        return asyncRun(function () {
          occurrenceTester.dataUpdate({ "item:suffix-icon": "Add" });
        }).then(function () {
          const icon = element.querySelector(".u-suffix-icon");
          expect(icon.classList.contains("ms-Icon--Add"), "Suffix icon should be shown.").to.be.true;
          expect(icon.getAttribute("slot"), "Suffix icon should be slotted into 'end'.").to.equal("end");
        });
      });

      ["horizontal", "vertical"].forEach(function (type) {
        it(`should update item:panel:layout-type to '${type}'`, function () {
          return asyncRun(function () {
            occurrenceTester.dataUpdate({ "item:panel:layout-type": type });
          }).then(function () {
            expect(element.getAttribute("panel-layout-type"), `Occurrence should have panel-layout-type '${type}'.`).to.equal(type);
          });
        });
      });

      ["start", "center", "end", "space-between", "space-around", "space-evenly", "stretch"].forEach(function (align) {
        it(`should update item:panel:horizontal-align to '${align}'`, function () {
          return asyncRun(function () {
            occurrenceTester.dataUpdate({ "item:panel:horizontal-align": align });
          }).then(function () {
            expect(element.getAttribute("panel-horizontal-align"), `Occurrence should have panel-horizontal-align '${align}'.`).to.equal(align);
          });
        });

        it(`should update item:panel:vertical-align to '${align}'`, function () {
          return asyncRun(function () {
            occurrenceTester.dataUpdate({ "item:panel:vertical-align": align });
          }).then(function () {
            expect(element.getAttribute("panel-vertical-align"), `Occurrence should have panel-vertical-align '${align}'.`).to.equal(align);
          });
        });
      });

      it("should warn and ignore an invalid item:label-size value", function () {
        const warnSpy = sinon.spy(console, "warn");
        return asyncRun(function () {
          occurrenceTester.dataUpdate({ "item:label-size": "gigantic" });
        }).then(function () {
          expect(
            warnSpy.calledWith(sinon.match("Property 'item:label-size' invalid value (gigantic) - Ignored.")),
            "Console should warn about the invalid 'item:label-size' value."
          ).to.be.true;
          warnSpy.restore();
        });
      });

      it("should hide the occurrence when item:hidden is true", function () {
        return asyncRun(function () {
          occurrenceTester.dataUpdate({ "item:hidden": true });
        }).then(function () {
          expect(element.hidden, "Occurrence should be hidden when item:hidden is true.").to.be.true;
        });
      });
    });
  });

  describe("AccordionHeadingField formatted value", function () {

    // A fresh tester per test keeps widget data isolated (WidgetTester caches its widget/element).
    function createHeadingField() {
      const tester = new umockup.WidgetTester(headingWidgetName, "ufld:HEADING.ACCORD.NOMODEL");
      tester.createWidget(null, createSkeleton(tester.widgetId));
      return tester;
    }

    it(`should load the ${headingWidgetName} widget class`, function () {
      verifyWidgetClass(headingWidgetClass, headingWidgetName);
    });

    it("should render the original widget's formatted value as read-only text", function () {
      const tester = createHeadingField();
      const element = tester.element;
      return asyncRun(function () {
        tester.dataUpdate({ "org-widget-class": "UX.PlainText",
                            "value": "Hello" });
      }).then(function () {
        const valueElement = element.querySelector(".u-value .u-text");
        assert(valueElement, "Heading field should render a '.u-value .u-text' element.");
        expect(valueElement.textContent, "Formatted value should show the original widget's value.").to.equal("Hello");
      });
    });

    it("should re-render when a base formatted setter ('value') changes without 'org-widget-class'", function () {
      const tester = createHeadingField();
      const element = tester.element;
      return asyncRun(function () {
        tester.dataUpdate({ "org-widget-class": "UX.PlainText",
                            "value": "Hello" });
      }).then(function () {
        return asyncRun(function () {
          tester.dataUpdate({ "value": "World" });
        });
      }).then(function () {
        const valueElement = element.querySelector(".u-value .u-text");
        expect(valueElement.textContent, "Formatted value should update when only 'value' changes.").to.equal("World");
      });
    });

    it("should re-render when an original-widget setter ('prefix-text') changes without 'org-widget-class'", function () {
      const tester = createHeadingField();
      const element = tester.element;
      return asyncRun(function () {
        tester.dataUpdate({ "org-widget-class": "UX.PlainText",
                            "value": "Hello" });
      }).then(function () {
        return asyncRun(function () {
          tester.dataUpdate({ "prefix-text": "Pre" });
        });
      }).then(function () {
        const prefix = element.querySelector(".u-prefix-text");
        assert(prefix, "Heading field should render a '.u-prefix-text' element.");
        expect(prefix.textContent, "Prefix text should update via the original widget's getValueFormattedSetters().").to.equal("Pre");
      });
    });

    it("should hide the heading field when a base setter ('html:hidden') changes without 'org-widget-class'", function () {
      const tester = createHeadingField();
      const element = tester.element;
      return asyncRun(function () {
        tester.dataUpdate({ "org-widget-class": "UX.PlainText",
                            "value": "Hello" });
      }).then(function () {
        return asyncRun(function () {
          tester.dataUpdate({ "html:hidden": true });
        });
      }).then(function () {
        expect(element, "Heading field should have the 'u-hidden' class when hidden.").to.have.class("u-hidden");
      });
    });

    it("should render a 'UX.TextField' original widget's formatted value as read-only text", function () {
      const tester = createHeadingField();
      const element = tester.element;
      return asyncRun(function () {
        tester.dataUpdate({ "org-widget-class": "UX.TextField",
                            "value": "First name" });
      }).then(function () {
        const valueElement = element.querySelector(".u-value .u-text");
        assert(valueElement, "Heading field should render a '.u-value .u-text' element for a text field.");
        expect(valueElement.textContent, "Formatted value should show the text field's value.").to.equal("First name");
      });
    });

    it("should render a 'UX.Button' original widget's value and icon", function () {
      const tester = createHeadingField();
      const element = tester.element;
      return asyncRun(function () {
        tester.dataUpdate({ "org-widget-class": "UX.Button",
                            "value": "Save",
                            "icon": "Save" });
      }).then(function () {
        const valueElement = element.querySelector(".u-value .u-text");
        assert(valueElement, "Heading field should render a '.u-value .u-text' element for a button.");
        expect(valueElement.textContent, "Formatted value should show the button's value.").to.equal("Save");
        const prefixIcon = element.querySelector(".u-prefix-icon");
        assert(prefixIcon, "Heading field should render a '.u-prefix-icon' element for the button icon.");
        expect(prefixIcon.classList.contains("ms-Icon--Save"), "Button icon should render the 'Save' icon.").to.be.true;
      });
    });

    it("should render a 'UX.Select' original widget's valrep representation", function () {
      const tester = createHeadingField();
      const element = tester.element;
      const valRepArray = [
        {
          "value": "1",
          "representation": "option one"
        },
        {
          "value": "2",
          "representation": "option two"
        }
      ];
      return asyncRun(function () {
        tester.dataUpdate({ "org-widget-class": "UX.Select",
                            "valrep": valRepArray,
                            "value": "2" });
      }).then(function () {
        const valueElement = element.querySelector(".u-value .u-text");
        assert(valueElement, "Heading field should render a '.u-value .u-text' element for a select.");
        expect(valueElement.textContent, "Formatted value should show the matching valrep representation.").to.equal("option two");
      });
    });

    it("should render a format-error indicator when the original widget reports an error", function () {
      const tester = createHeadingField();
      const element = tester.element;
      return asyncRun(function () {
        tester.dataUpdate({ "org-widget-class": "UX.TextField",
                            "value": "abc",
                            "error": true,
                            "error-message": "Invalid entry" });
      }).then(function () {
        expect(element, "Heading field should have the 'u-invalid' class when the value is in error.").to.have.class("u-invalid");
        const errorIcon = element.querySelector(".u-error-icon");
        assert(errorIcon, "Heading field should render a '.u-error-icon' element when in error.");
        expect(errorIcon.classList.contains("ms-Icon--AlertSolid"), "Error indicator should use the 'AlertSolid' icon.").to.be.true;
        expect(errorIcon.title, "Error indicator should expose the error message as its title.").to.equal("Invalid entry");
      });
    });

    it("should render a format-error indicator when a 'UX.Select' value has no matching valrep", function () {
      const tester = createHeadingField();
      const element = tester.element;
      const valRepArray = [
        {
          "value": "1",
          "representation": "option one"
        },
        {
          "value": "2",
          "representation": "option two"
        }
      ];
      return asyncRun(function () {
        tester.dataUpdate({ "org-widget-class": "UX.Select",
                            "valrep": valRepArray,
                            "value": "does-not-exist" });
      }).then(function () {
        expect(element, "Heading field should have the 'u-invalid' class for an unresolved select value.").to.have.class("u-invalid");
        const errorIcon = element.querySelector(".u-error-icon");
        assert(errorIcon, "Heading field should render a '.u-error-icon' element for an unresolved select value.");
        const primaryText = element.querySelector(".u-value .u-text .u-primary-text");
        assert(primaryText, "Heading field should still render a primary text span in the error state.");
        expect(primaryText.textContent, "Unresolved select value should render the 'ERROR' placeholder text.").to.equal("ERROR");
      });
    });
  });

  describe("Reset all properties", function () {

    it("should reset Accordion to default values without exception", function () {
      const collectionSkeleton = createSkeleton(collectionWidgetId);
      collectionTester.createWidget(null, collectionSkeleton, mockEntityDef);
      return asyncRun(function () {
        collectionTester.dataUpdate(collectionTester.getDefaultValues());
      });
    });

    it("should reset AccordionItem to default values without exception", function () {
      const occurrenceSkeleton = createSkeleton(occurrenceWidgetId);
      occurrenceTester.createWidget(null, occurrenceSkeleton, mockEntityDef);
      return asyncRun(function () {
        occurrenceTester.dataUpdate(occurrenceTester.getDefaultValues());
      });
    });
  });

})();
