/* global chai, describe, it, beforeEach */

import { ChildWidgets } from "../../src/ux/framework/workers/child_widgets.js";
import { WorkerBase } from "../../src/ux/framework/common/worker_base.js";

(function () {
  "use strict";

  // Unit Test Suite for ChildWidgets Worker
  // Pure unit tests focusing on logic validation without DOM manipulation:
  // - Constructor validation
  // - Configuration validation
  // - Property-based distribution logic
  // - Index-based distribution logic
  // - Distribution strategy detection
  // - Cache mechanism
  // - Edge cases and error conditions
  // - High mutation score coverage

  const expect = chai.expect;

  // Mock Widget Class for testing.
  class MockWidget {
    constructor() {
      this.data = {};
      this.setters = {};
      this.defaultValues = {};
    }

    static structure = {
      "childWorkers": []
    };
  }

  // Initialize static properties for property registration.
  MockWidget.setters = {};
  MockWidget.defaultValues = {};
  MockWidget.getters = {};
  MockWidget.triggers = {};

  // Mock ObjectDefinition class.
  class MockObjectDefinition {
    constructor(name, properties = {}, type = "entity") {
      this.name = name;
      this.properties = properties;
      this.type = type;
      this.children = [];
    }

    getName() {
      return this.name;
    }

    getProperty(name) {
      return this.properties[name];
    }

    getType() {
      return this.type;
    }

    getChildDefinitions() {
      return this.children;
    }

    getPropertyNames() {
      return Object.keys(this.properties);
    }

    addChild(child) {
      this.children.push(child);
    }
  }

  // Helper factory functions to reduce duplication.
  const createSlotConfig = (overrides = {}) => ({
    "propertyName": "area-slot",
    "defaultSlot": "main",
    "validSlots": ["header", "main", "footer"],
    ...overrides
  });

  const createIndexRules = () => ({
    "1": {
      "main": [0]
    },
    "2": {
      "header": [0],
      "main": [1]
    },
    "3": {
      "header": [0],
      "main": [1],
      "footer": [2]
    }
  });

  const createChildren = (count, slotValue = null) => {
    const children = [];
    for (let i = 0; i < count; i++) {
      const props = slotValue ? { "area-slot": slotValue } : {};
      children.push(new MockObjectDefinition(`child${i + 1}`, props, "entity"));
    }
    return children;
  };

  describe("ChildWidgets Worker", function() {

    // Reset MockWidget state before each test to avoid pollution.
    beforeEach(function() {
      MockWidget.setters = {};
      MockWidget.defaultValues = {};
      MockWidget.getters = {};
      MockWidget.triggers = {};
    });

    describe("Constructor", function() {

      it("should initialize with null slotId (unfiltered mode)", function() {
        const worker = new ChildWidgets(MockWidget, "div", null, null);

        expect(worker).to.be.instanceof(WorkerBase);
        expect(worker.slotId).to.be.null;
        expect(worker.slotConfig).to.be.null;
        expect(worker.tagName).to.equal("div");
      });

      it("should initialize with slotId and slotConfig", function() {
        const slotConfig = {
          "propertyName": "area-slot",
          "defaultSlot": "main",
          "validSlots": ["header", "main", "footer"]
        };
        const worker = new ChildWidgets(MockWidget, "div", "main", slotConfig);

        expect(worker.slotId).to.equal("main");
        expect(worker.slotConfig).to.exist;
        expect(worker.slotConfig.propertyName).to.equal("area-slot");
        expect(worker.tagName).to.equal("div");
      });

      it("should store tagName correctly", function() {
        const worker = new ChildWidgets(MockWidget, "span", null, null);

        expect(worker.tagName).to.equal("span");
      });

      it("should validate required parameters", function() {
        const worker1 = new ChildWidgets(MockWidget, "", null, null);
        expect(worker1._isValid).to.be.false;
      });
    });

    describe("Constructor - Slot Configuration", function() {

      it("should apply default slot configuration values", function() {
        const worker = new ChildWidgets(MockWidget, "div", "main", {});

        expect(worker.slotConfig.propertyName).to.equal("area-slot");
        expect(worker.slotConfig.defaultSlot).to.equal(null);
        expect(worker.slotConfig.validSlots).to.deep.equal([]);
        expect(worker.slotConfig.indexRules).to.deep.equal({});
      });

      it("should apply custom slot configuration", function() {
        const config = {
          "propertyName": "custom-slot",
          "defaultSlot": "content",
          "validSlots": ["header", "content", "footer"],
          "indexRules": {
            "1": { "content": [0] },
            "2": {
              "header": [0],
              "content": [1]
            }
          }
        };

        const worker = new ChildWidgets(MockWidget, "div", "content", config);

        expect(worker.slotConfig.propertyName).to.equal("custom-slot");
        expect(worker.slotConfig.defaultSlot).to.equal("content");
        expect(worker.slotConfig.validSlots).to.deep.equal(["header", "content", "footer"]);
        expect(worker.slotConfig.indexRules).to.deep.equal(config.indexRules);
      });

      it("should set _isValid to false when slotId provided without slotConfig", function() {
        const worker = new ChildWidgets(MockWidget, "div", "main", null);
        expect(worker._isValid).to.be.false;
      });

      it("should handle partial slot configuration", function() {
        const config = {
          "propertyName": "slot",
          "validSlots": ["a", "b"]
        };

        const worker = new ChildWidgets(MockWidget, "div", "a", config);

        expect(worker.slotConfig.propertyName).to.equal("slot");
        expect(worker.slotConfig.defaultSlot).to.equal(null);
        expect(worker.slotConfig.validSlots).to.deep.equal(["a", "b"]);
        expect(worker.slotConfig.indexRules).to.deep.equal({});
      });
    });

    describe("Property-Based Distribution", function() {

      let worker;

      beforeEach(function() {
        worker = new ChildWidgets(MockWidget, "div", "main", createSlotConfig());
      });

      it("should distribute children by property value", function() {
        const children = [
          new MockObjectDefinition("child1", { "area-slot": "header" }),
          new MockObjectDefinition("child2", { "area-slot": "main" }),
          new MockObjectDefinition("child3", { "area-slot": "footer" })
        ];

        const groups = worker.distributeByProperty(children);

        expect(groups.header).to.have.lengthOf(1);
        expect(groups.main).to.have.lengthOf(1);
        expect(groups.footer).to.have.lengthOf(1);
        expect(groups.header[0].getName()).to.equal("child1");
        expect(groups.main[0].getName()).to.equal("child2");
        expect(groups.footer[0].getName()).to.equal("child3");
      });

      it("should use defaultSlot when property is missing", function() {
        const children = [
          new MockObjectDefinition("child1", {}),
          new MockObjectDefinition("child2", { "area-slot": "header" })
        ];

        const groups = worker.distributeByProperty(children);

        expect(groups.main).to.have.lengthOf(1);
        expect(groups.header).to.have.lengthOf(1);
        expect(groups.main[0].getName()).to.equal("child1");
      });

      it("should reject invalid slot values and use defaultSlot", function() {
        const children = [
          new MockObjectDefinition("child1", { "area-slot": "invalid" }),
          new MockObjectDefinition("child2", { "area-slot": "sidebar" })
        ];

        const groups = worker.distributeByProperty(children);

        expect(groups.main).to.have.lengthOf(2);
        expect(groups.invalid).to.be.undefined;
        expect(groups.sidebar).to.be.undefined;
      });

      it("should exclude children when no valid slot assigned and defaultSlot is null", function() {
        worker = new ChildWidgets(MockWidget, "div", "main", createSlotConfig({ "defaultSlot": null }));

        const children = [
          new MockObjectDefinition("child1", {}),
          new MockObjectDefinition("child2", { "area-slot": "header" })
        ];

        const groups = worker.distributeByProperty(children);

        expect(groups.header).to.have.lengthOf(1);
        expect(groups.main).to.be.undefined;
      });

      it("should group multiple children in same slot", function() {
        const children = [
          new MockObjectDefinition("child1", { "area-slot": "main" }),
          new MockObjectDefinition("child2", { "area-slot": "main" }),
          new MockObjectDefinition("child3", { "area-slot": "main" })
        ];

        const groups = worker.distributeByProperty(children);

        expect(groups.main).to.have.lengthOf(3);
        expect(groups.main[0].getName()).to.equal("child1");
        expect(groups.main[1].getName()).to.equal("child2");
        expect(groups.main[2].getName()).to.equal("child3");
      });

      it("should handle empty children array", function() {
        const groups = worker.distributeByProperty([]);

        expect(Object.keys(groups)).to.have.lengthOf(0);
      });

      it("should allow empty validSlots array (no validation)", function() {
        worker = new ChildWidgets(MockWidget, "div", "main", createSlotConfig({ "validSlots": [] }));

        const children = [new MockObjectDefinition("child1", { "area-slot": "custom" })];
        const groups = worker.distributeByProperty(children);

        expect(groups.custom).to.have.lengthOf(1);
      });
    });

    describe("Index-Based Distribution", function() {

      let worker;

      beforeEach(function() {
        worker = new ChildWidgets(MockWidget, "div", "main", createSlotConfig({ "indexRules": createIndexRules() }));
      });

      it("should distribute 1 child to main slot", function() {
        const groups = worker.distributeByIndex(createChildren(1));

        expect(groups.main).to.have.lengthOf(1);
        expect(groups.main[0].getName()).to.equal("child1");
      });

      it("should distribute 2 children to header and main", function() {
        const groups = worker.distributeByIndex(createChildren(2));

        expect(groups.header).to.have.lengthOf(1);
        expect(groups.main).to.have.lengthOf(1);
        expect(groups.header[0].getName()).to.equal("child1");
        expect(groups.main[0].getName()).to.equal("child2");
      });

      it("should distribute 3 children to header, main, footer", function() {
        const groups = worker.distributeByIndex(createChildren(3));

        expect(groups.header).to.have.lengthOf(1);
        expect(groups.main).to.have.lengthOf(1);
        expect(groups.footer).to.have.lengthOf(1);
        expect(groups.header[0].getName()).to.equal("child1");
        expect(groups.main[0].getName()).to.equal("child2");
        expect(groups.footer[0].getName()).to.equal("child3");
      });

      it("should return empty groups when no index rule exists", function() {
        const children = [
          new MockObjectDefinition("child1", { "area-slot": "header" }, "entity"),
          new MockObjectDefinition("child2", { "area-slot": "main" }, "entity"),
          new MockObjectDefinition("child3", { "area-slot": "main" }, "entity"),
          new MockObjectDefinition("child4", { "area-slot": "footer" }, "entity")
        ];

        const groups = worker.distributeByIndex(children);

        // No rule for 4 children, returns empty groups.
        expect(Object.keys(groups)).to.have.lengthOf(0);
      });

      it("should handle multiple children in same slot via index rule", function() {
        const rules = {
          ...createIndexRules(),
          "4": {
            "header": [0],
            "main": [1, 2],
            "footer": [3]
          }
        };
        worker = new ChildWidgets(MockWidget, "div", "main", createSlotConfig({ "indexRules": rules }));

        const groups = worker.distributeByIndex(createChildren(4));

        expect(groups.main).to.have.lengthOf(2);
        expect(groups.main[0].getName()).to.equal("child2");
        expect(groups.main[1].getName()).to.equal("child3");
      });

      it("should handle empty children array", function() {
        const groups = worker.distributeByIndex([]);
        expect(Object.keys(groups)).to.have.lengthOf(0);
      });

      it("should filter out invalid indices", function() {
        const rules = {
          "2": {
            "main": [0, 5]
          }
        }; // Index 5 doesn't exist.
        worker = new ChildWidgets(MockWidget, "div", "main", createSlotConfig({ "indexRules": rules }));

        const groups = worker.distributeByIndex(createChildren(2));

        expect(groups.main).to.have.lengthOf(1);
        expect(groups.main[0].getName()).to.equal("child1");
      });
    });

    describe("Distribution Strategy Detection", function() {

      let worker;

      beforeEach(function() {
        worker = new ChildWidgets(MockWidget, "div", "main", createSlotConfig());
      });

      it("should use property-based when at least one child has property", function() {
        const children = [
          new MockObjectDefinition("child1", {}),
          new MockObjectDefinition("child2", { "area-slot": "header" }),
          new MockObjectDefinition("child3", {})
        ];

        const shouldUse = worker.shouldUsePropertyBased(children);

        expect(shouldUse).to.equal(true);
      });

      it("should use index-based when no children have property", function() {
        expect(worker.shouldUsePropertyBased(createChildren(3))).to.be.false;
      });

      it("should handle empty children array", function() {
        expect(worker.shouldUsePropertyBased([])).to.be.false;
      });

      it("should treat property value of null same as missing", function() {
        const children = [
          new MockObjectDefinition("child1", { "area-slot": null }),
          new MockObjectDefinition("child2", {})
        ];

        const shouldUse = worker.shouldUsePropertyBased(children);

        // null is treated same as undefined, so should be false.
        expect(shouldUse).to.equal(false);
      });
    });

    describe("Cache Mechanism", function() {

      let worker;
      let parentDef;

      beforeEach(function() {
        worker = new ChildWidgets(MockWidget, "div", "main", createSlotConfig());

        parentDef = new MockObjectDefinition("parent", {});
        parentDef.addChild(new MockObjectDefinition("child1", { "area-slot": "header" }));
        parentDef.addChild(new MockObjectDefinition("child2", { "area-slot": "main" }));
      });

      it("should cache distribution results on objectDefinition", function() {
        const groups1 = worker.distributeChildren(parentDef);

        expect(parentDef._slottedGroups).to.exist;
        expect(parentDef._slottedGroups).to.deep.equal(groups1);
      });

      it("should return cached results on subsequent calls", function() {
        const groups1 = worker.distributeChildren(parentDef);
        const groups2 = worker.distributeChildren(parentDef);

        expect(groups1).to.equal(groups2); // Same reference.
      });

      it("should use property-based strategy when detected", function() {
        const groups = worker.distributeChildren(parentDef);

        expect(groups.header).to.have.lengthOf(1);
        expect(groups.main).to.have.lengthOf(1);
      });

      it("should use index-based strategy when no properties detected", function() {
        const rules = {
          "2": {
            "header": [0],
            "main": [1]
          }
        };
        worker = new ChildWidgets(MockWidget, "div", "main", createSlotConfig({ "indexRules": rules }));

        parentDef = new MockObjectDefinition("parent", {});
        createChildren(2).forEach(child => parentDef.addChild(child));

        const groups = worker.distributeChildren(parentDef);

        expect(groups.header).to.have.lengthOf(1);
        expect(groups.main).to.have.lengthOf(1);
      });

      it("should handle empty children", function() {
        parentDef = new MockObjectDefinition("parent", {});

        const groups = worker.distributeChildren(parentDef);

        expect(Object.keys(groups)).to.have.lengthOf(0);
      });
    });

    describe("Element Creation", function() {

      let worker;

      beforeEach(function() {
        worker = new ChildWidgets(MockWidget, "span", null, null);
      });

      it("should create elements for entity children", function() {
        const children = [
          new MockObjectDefinition("entity1", {}, "entity"),
          new MockObjectDefinition("entity2", {}, "entity")
        ];

        const elements = worker.createChildElements(children);

        expect(elements).to.have.lengthOf(2);
        expect(elements[0].tagName.toLowerCase()).to.equal("span");
        expect(elements[0].id).to.equal("uent:entity1");
        expect(elements[1].id).to.equal("uent:entity2");
      });

      it("should create elements for field children", function() {
        const children = [
          new MockObjectDefinition("field1", {}, "field"),
          new MockObjectDefinition("field2", {}, "field")
        ];

        const elements = worker.createChildElements(children);

        expect(elements).to.have.lengthOf(2);
        expect(elements[0].tagName.toLowerCase()).to.equal("span");
        expect(elements[0].id).to.equal("ufld:field1");
        expect(elements[1].id).to.equal("ufld:field2");
      });

      it("should process both entity and field types", function() {
        const children = [
          new MockObjectDefinition("entity1", {}, "entity"),
          new MockObjectDefinition("field1", {}, "field"),
          new MockObjectDefinition("entity2", {}, "entity")
        ];

        const elements = worker.createChildElements(children);

        expect(elements).to.have.lengthOf(3);
        expect(elements[0].id).to.equal("uent:entity1");
        expect(elements[1].id).to.equal("ufld:field1");
        expect(elements[2].id).to.equal("uent:entity2");
      });

      it("should skip unknown types", function() {
        const children = [
          new MockObjectDefinition("entity1", {}, "entity"),
          new MockObjectDefinition("other1", {}, "other"),
          new MockObjectDefinition("field1", {}, "field")
        ];

        const elements = worker.createChildElements(children);

        expect(elements).to.have.lengthOf(2);
        expect(elements[0].id).to.equal("uent:entity1");
        expect(elements[1].id).to.equal("ufld:field1");
      });

      it("should handle empty children array", function() {
        const elements = worker.createChildElements([]);

        expect(elements).to.have.lengthOf(0);
      });

      it("should substitute getName() in templates", function() {
        const children = [
          new MockObjectDefinition("myEntity", {}, "entity")
        ];

        const elements = worker.createChildElements(children);

        expect(elements[0].id).to.equal("uent:myEntity");
      });

      it("should use correct tagName from constructor", function() {
        worker = new ChildWidgets(MockWidget, "div", null, null);

        const children = [
          new MockObjectDefinition("entity1", {}, "entity")
        ];

        const elements = worker.createChildElements(children);

        expect(elements[0].tagName.toLowerCase()).to.equal("div");
      });

      it("should return empty array when worker is invalid", function() {
        worker = new ChildWidgets(MockWidget, "", null, null); // Invalid: empty tagName.

        const children = [
          new MockObjectDefinition("entity1", {}, "entity")
        ];

        const elements = worker.createChildElements(children);

        expect(elements).to.have.lengthOf(0);
      });
    });

    describe("getLayout()", function() {

      let worker;
      let slotConfig;
      let parentDef;

      beforeEach(function() {
        slotConfig = {
          "propertyName": "area-slot",
          "defaultSlot": "main",
          "validSlots": ["header", "main", "footer"]
        };

        parentDef = new MockObjectDefinition("parent", {});
        parentDef.addChild(new MockObjectDefinition("child1", { "area-slot": "header" }, "entity"));
        parentDef.addChild(new MockObjectDefinition("child2", { "area-slot": "main" }, "entity"));
        parentDef.addChild(new MockObjectDefinition("child3", { "area-slot": "footer" }, "entity"));
      });

      it("should return HTMLElements for all children when slotId is null", function() {
        worker = new ChildWidgets(MockWidget, "div", null, null);

        const result = worker.getLayout(parentDef);

        expect(result).to.have.lengthOf(3);
        expect(result[0]).to.be.instanceof(HTMLElement);
        expect(result[0].id).to.equal("uent:child1");
      });

      it("should return only header slot children", function() {
        worker = new ChildWidgets(MockWidget, "div", "header", slotConfig);

        const result = worker.getLayout(parentDef);

        expect(result).to.have.lengthOf(1);
        expect(result[0]).to.be.instanceof(HTMLElement);
        expect(result[0].id).to.equal("uent:child1");
      });

      it("should return only main slot children", function() {
        worker = new ChildWidgets(MockWidget, "div", "main", slotConfig);

        const result = worker.getLayout(parentDef);

        expect(result).to.have.lengthOf(1);
        expect(result[0]).to.be.instanceof(HTMLElement);
        expect(result[0].id).to.equal("uent:child2");
      });

      it("should return empty array for slot with no children", function() {
        worker = new ChildWidgets(MockWidget, "div", "sidebar", slotConfig);

        const result = worker.getLayout(parentDef);

        expect(result).to.have.lengthOf(0);
      });

      it("should return empty array when parent has no children", function() {
        worker = new ChildWidgets(MockWidget, "div", "main", slotConfig);
        parentDef = new MockObjectDefinition("parent", {});

        const result = worker.getLayout(parentDef);

        expect(result).to.have.lengthOf(0);
      });

      it("should use cached distribution on subsequent calls", function() {
        worker = new ChildWidgets(MockWidget, "div", "main", slotConfig);

        const result1 = worker.getLayout(parentDef);
        const result2 = worker.getLayout(parentDef);

        expect(result1).to.deep.equal(result2);
        expect(parentDef._slottedGroups).to.exist; // But same cached distribution.
      });

      it("should return empty array when worker is invalid", function() {
        worker = new ChildWidgets(MockWidget, "", null, null); // Invalid: empty tagName.

        const result = worker.getLayout(parentDef);

        expect(result).to.have.lengthOf(0);
      });
    });

    describe("Substitute Instructions", function() {

      let worker;

      beforeEach(function() {
        worker = new ChildWidgets(MockWidget, "div", null, null);
      });

      it("should replace {{getName()}} with child name", function() {
        const child = new MockObjectDefinition("myChild", {});
        const result = worker.substituteInstructions(child, "uent:{{getName()}}");

        expect(result).to.equal("uent:myChild");
      });

      it("should replace multiple {{getName()}} occurrences", function() {
        const child = new MockObjectDefinition("test", {});
        const result = worker.substituteInstructions(
          child,
          "{{getName()}}-prefix-{{getName()}}"
        );

        expect(result).to.equal("test-prefix-test");
      });

      it("should return template unchanged if no placeholders", function() {
        const child = new MockObjectDefinition("test", {});
        const result = worker.substituteInstructions(child, "static-id");

        expect(result).to.equal("static-id");
      });

      it("should handle empty template", function() {
        const child = new MockObjectDefinition("test", {});
        const result = worker.substituteInstructions(child, "");

        expect(result).to.equal("");
      });
    });

    describe("Edge Cases and Error Handling", function() {

      it("should handle null children array gracefully", function() {
        const slotConfig = {
          "propertyName": "area-slot",
          "defaultSlot": "main"
        };
        const worker = new ChildWidgets(MockWidget, "div", "main", slotConfig);
        const parentDef = new MockObjectDefinition("parent", {});
        parentDef.children = null;

        const result = worker.getLayout(parentDef);

        expect(result).to.have.lengthOf(0);
      });

      it("should handle undefined getChildDefinitions return", function() {
        const worker = new ChildWidgets(MockWidget, "div", null, null);
        const parentDef = new MockObjectDefinition("parent", {});
        parentDef.getChildDefinitions = () => undefined;

        const result = worker.getLayout(parentDef);

        expect(result).to.have.lengthOf(0);
      });

      it("should handle children with null property values", function() {
        const slotConfig = {
          "propertyName": "area-slot",
          "defaultSlot": "main",
          "validSlots": ["header", "main", "footer"]
        };
        const worker = new ChildWidgets(MockWidget, "div", "main", slotConfig);

        const children = [
          new MockObjectDefinition("child1", { "area-slot": null })
        ];

        const groups = worker.distributeByProperty(children);

        expect(groups.main).to.have.lengthOf(1);
      });

      it("should handle extremely large child counts", function() {
        const slotConfig = {
          "propertyName": "area-slot",
          "defaultSlot": "main"
        };
        const worker = new ChildWidgets(MockWidget, "div", "main", slotConfig);

        const children = [];
        for (let i = 0; i < 1000; i++) {
          children.push(new MockObjectDefinition(`child${i}`, { "area-slot": "main" }));
        }

        const groups = worker.distributeByProperty(children);

        expect(groups.main).to.have.lengthOf(1000);
      });

      it("should handle special characters in child names", function() {
        const worker = new ChildWidgets(MockWidget, "span", null, null);

        const child = new MockObjectDefinition("my-entity_123", {}, "entity");
        const result = worker.substituteInstructions(child, "uent:{{getName()}}");

        expect(result).to.equal("uent:my-entity_123");
      });
    });

    describe("Type Checks and Public API", function() {

      it("should be instance of WorkerBase", function() {
        const worker = new ChildWidgets(MockWidget, "div", null, null);

        expect(worker).to.be.instanceof(WorkerBase);
      });

      it("should expose public methods", function() {
        const worker = new ChildWidgets(MockWidget, "div", null, null);

        expect(worker).to.respondTo("distributeByProperty");
        expect(worker).to.respondTo("distributeByIndex");
        expect(worker).to.respondTo("shouldUsePropertyBased");
        expect(worker).to.respondTo("distributeChildren");
        expect(worker).to.respondTo("getLayout");
      });

      it("should expose element creation methods", function() {
        const worker = new ChildWidgets(MockWidget, "span", null, null);

        expect(worker).to.respondTo("substituteInstructions");
        expect(worker).to.respondTo("createChildElements");
      });
    });
  });
})();
