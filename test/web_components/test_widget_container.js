/* global chai, umockup */
(function () {
  "use strict";

  const assert = chai.assert;
  const expect = chai.expect;
  const asyncRun = umockup.asyncRun;

  /**
   * Creates a new widget container element and appends it to the test container.
   * @param {string} [type="accordion"] - The container type to create.
   * @returns {HTMLElement} The created container element.
   */
  function createContainer(type) {
    type = type || "accordion";
    const container = document.createElement("uf-" + type + "-container");
    const parent = document.getElementById("web-component") || document.body;
    parent.appendChild(container);
    return container;
  }

  /**
   * Removes the container element from the DOM.
   * @param {HTMLElement} container - The container element to remove.
   */
  function cleanupContainer(container) {
    container?.remove();
  }

  /**
   * Returns a named or default slot from the container shadow root.
   * @param {HTMLElement} container - The widget container.
   * @param {string} [name] - The named slot to find.
   * @returns {HTMLSlotElement} The requested slot.
   */
  function getSlot(container, name) {
    const selector = name ? "slot[name='" + name + "']" : ".body slot:not([name])";
    return container.shadowRoot.querySelector(selector);
  }

  /**
   * Creates and appends an element assigned to a container slot.
   * @param {HTMLElement} container - The widget container.
   * @param {string} tagName - The element tag name.
   * @param {string} slotName - The slot name.
   * @param {string} text - The element text content.
   * @returns {HTMLElement} The appended element.
   */
  function appendSlottedElement(container, tagName, slotName, text) {
    const element = document.createElement(tagName);
    element.setAttribute("slot", slotName);
    element.textContent = text;
    container.appendChild(element);
    return element;
  }

  /**
   * Automated tests for the WidgetContainer web component.
   * The WidgetContainer provides a shared header/body layout structure
   * with start, label, and end slots in the header and a default body slot.
   */
  describe("WidgetContainer Web Component Tests", function () {
    describe("Component Registration", function () {
      it("should register uf-accordion-container as a custom element", function () {
        const el = window.customElements.get("uf-accordion-container");
        assert(el, "Widget container 'uf-accordion-container' should be registered.");
      });
    });

    describe("Component Creation", function () {
      var container;

      beforeEach(function () {
        container = createContainer();
      });

      afterEach(function () {
        cleanupContainer(container);
      });

      it("should create a container element", function () {
        assert(container, "Container element should be created.");
        expect(container.tagName.toLowerCase()).to.equal("uf-accordion-container");
      });

      it("should be an instance of HTMLElement", function () {
        expect(container).to.be.instanceOf(HTMLElement);
      });

      it("should have FASTElement properties", function () {
        assert(container.$fastController, "Container should have $fastController from FASTElement.");
      });
    });

    describe("Component Structure", function () {
      var container;

      beforeEach(function () {
        container = createContainer();
      });

      afterEach(function () {
        cleanupContainer(container);
      });

      it("should have a shadow root", function () {
        assert(container.shadowRoot, "Container should have a shadow root.");
      });

      it("should contain a header section", function () {
        var headerPart = container.shadowRoot.querySelector("[part='header']");
        assert(headerPart, "Container should have a header part.");
        expect(headerPart.classList.contains("header")).to.be.true;
      });

      it("should contain a body section", function () {
        var bodyPart = container.shadowRoot.querySelector("[part='body']");
        assert(bodyPart, "Container should have a body part.");
        expect(bodyPart.classList.contains("body")).to.be.true;
      });

      it("should render header before body", function () {
        var shadowRoot = container.shadowRoot;
        var headerPart = shadowRoot.querySelector("[part='header']");
        var bodyPart = shadowRoot.querySelector("[part='body']");
        var elements = Array.from(shadowRoot.children);
        var headerIndex = elements.indexOf(headerPart);
        var bodyIndex = elements.indexOf(bodyPart);
        expect(headerIndex).to.be.lessThan(bodyIndex, "Header should appear before body.");
      });

      it("should contain a start section in the header", function () {
        var startPart = container.shadowRoot.querySelector("[part='start']");
        assert(startPart, "Container should have a start part.");
        expect(startPart.classList.contains("start")).to.be.true;
      });

      it("should contain a label section in the header", function () {
        var labelPart = container.shadowRoot.querySelector("[part='label']");
        assert(labelPart, "Container should have a label part.");
        expect(labelPart.classList.contains("label")).to.be.true;
      });

      it("should contain an end section in the header", function () {
        var endPart = container.shadowRoot.querySelector("[part='end']");
        assert(endPart, "Container should have an end part.");
        expect(endPart.classList.contains("end")).to.be.true;
      });

      it("should have header sections in order: start, label, end", function () {
        var headerPart = container.shadowRoot.querySelector("[part='header']");
        var children = Array.from(headerPart.children);
        expect(children[0].classList.contains("start")).to.be.true;
        expect(children[1].classList.contains("label")).to.be.true;
        expect(children[2].classList.contains("end")).to.be.true;
      });

      it("should have a slot for start content", function () {
        var startSlot = getSlot(container, "start");
        assert(startSlot, "Container should have a named slot for start.");
      });

      it("should have a slot for label content", function () {
        var labelSlot = getSlot(container, "label");
        assert(labelSlot, "Container should have a named slot for label.");
      });

      it("should have a slot for end content", function () {
        var endSlot = getSlot(container, "end");
        assert(endSlot, "Container should have a named slot for end.");
      });

      it("should have a default slot for body content", function () {
        var defaultSlot = getSlot(container);
        assert(defaultSlot, "Container should have a default slot for body content.");
      });
    });

    describe("Slotted Content", function () {
      var container;

      beforeEach(function () {
        container = createContainer();
      });

      afterEach(function () {
        cleanupContainer(container);
      });

      it("should display content in default body slot", function () {
        var content = document.createElement("div");
        content.textContent = "Body Content";
        container.appendChild(content);

        var defaultSlot = getSlot(container);
        var assignedNodes = defaultSlot.assignedNodes();
        expect(assignedNodes.length).to.be.greaterThan(0);
      });

      it("should display content in start slot", function () {
        appendSlottedElement(container, "i", "start", "▶");

        var startSlot = getSlot(container, "start");
        var assignedNodes = startSlot.assignedNodes();
        expect(assignedNodes.length).to.equal(1);
        expect(assignedNodes[0].textContent).to.equal("▶");
      });

      it("should display content in label slot", function () {
        appendSlottedElement(container, "span", "label", "Test Label");

        var labelSlot = getSlot(container, "label");
        var assignedNodes = labelSlot.assignedNodes();
        expect(assignedNodes.length).to.equal(1);
        expect(assignedNodes[0].textContent).to.equal("Test Label");
      });

      it("should display content in end slot", function () {
        appendSlottedElement(container, "i", "end", "⋮");

        var endSlot = getSlot(container, "end");
        var assignedNodes = endSlot.assignedNodes();
        expect(assignedNodes.length).to.equal(1);
        expect(assignedNodes[0].textContent).to.equal("⋮");
      });

      it("should support all slots populated simultaneously", function () {
        var startIcon = document.createElement("i");
        startIcon.setAttribute("slot", "start");
        startIcon.textContent = "▶";

        var label = document.createElement("span");
        label.setAttribute("slot", "label");
        label.textContent = "Title";

        var endIcon = document.createElement("i");
        endIcon.setAttribute("slot", "end");
        endIcon.textContent = "⋮";

        var body = document.createElement("div");
        body.textContent = "Body Content";

        container.appendChild(startIcon);
        container.appendChild(label);
        container.appendChild(endIcon);
        container.appendChild(body);

        var startSlot = getSlot(container, "start");
        var labelSlot = getSlot(container, "label");
        var endSlot = getSlot(container, "end");
        var defaultSlot = getSlot(container);

        expect(startSlot.assignedNodes().length).to.equal(1);
        expect(labelSlot.assignedNodes().length).to.equal(1);
        expect(endSlot.assignedNodes().length).to.equal(1);
        expect(defaultSlot.assignedNodes().length).to.be.greaterThan(0);
      });

      it("should support multiple elements in default slot", function () {
        var div1 = document.createElement("div");
        div1.textContent = "Content 1";
        var div2 = document.createElement("div");
        div2.textContent = "Content 2";

        container.appendChild(div1);
        container.appendChild(div2);

        var defaultSlot = getSlot(container);
        var assignedNodes = defaultSlot.assignedNodes();
        expect(assignedNodes.length).to.equal(2);
      });
    });

    describe("label-size Attribute", function () {
      var container;

      beforeEach(function () {
        container = createContainer();
      });

      afterEach(function () {
        cleanupContainer(container);
      });

      ["small", "medium", "large"].forEach(function (value) {
        it("should accept label-size='" + value + "'", function () {
          return asyncRun(function () {
            container.setAttribute("label-size", value);
          }).then(function () {
            expect(container.getAttribute("label-size")).to.equal(value);
          });
        });
      });

      it("should reflect label-size attribute on the host element", function () {
        return asyncRun(function () {
          container.setAttribute("label-size", "small");
        }).then(function () {
          return asyncRun(function () {
            container.setAttribute("label-size", "large");
          });
        }).then(function () {
          expect(container.getAttribute("label-size")).to.equal("large");
        });
      });

      it("should allow removing label-size attribute", function () {
        return asyncRun(function () {
          container.setAttribute("label-size", "medium");
        }).then(function () {
          container.removeAttribute("label-size");
          expect(container.hasAttribute("label-size")).to.be.false;
        });
      });
    });

    describe("label-align Attribute", function () {
      var container;

      beforeEach(function () {
        container = createContainer();
      });

      afterEach(function () {
        cleanupContainer(container);
      });

      ["start", "center", "end"].forEach(function (value) {
        it("should accept label-align='" + value + "'", function () {
          return asyncRun(function () {
            container.setAttribute("label-align", value);
          }).then(function () {
            expect(container.getAttribute("label-align")).to.equal(value);
          });
        });
      });

      it("should reflect label-align attribute on the host element", function () {
        return asyncRun(function () {
          container.setAttribute("label-align", "center");
        }).then(function () {
          return asyncRun(function () {
            container.setAttribute("label-align", "end");
          });
        }).then(function () {
          expect(container.getAttribute("label-align")).to.equal("end");
        });
      });
    });

    describe("Dynamic Content Updates", function () {
      var container;

      beforeEach(function () {
        container = createContainer();
      });

      afterEach(function () {
        cleanupContainer(container);
      });

      it("should update when adding new body content", function () {
        var content = document.createElement("p");
        content.textContent = "Dynamic Content";
        container.appendChild(content);

        return asyncRun(function () {}).then(function () {
          var slot = getSlot(container);
          var assigned = slot.assignedNodes();
          expect(assigned.length).to.be.greaterThan(0);
        });
      });

      it("should update when removing body content", function () {
        var content = document.createElement("div");
        content.id = "removable";
        container.appendChild(content);

        return asyncRun(function () {
          container.removeChild(content);
        }).then(function () {
          var slot = getSlot(container);
          var assigned = slot.assignedNodes().filter(function (node) {
            return node.nodeType === Node.ELEMENT_NODE;
          });
          expect(assigned.some(function (node) {
            return node.id === "removable";
          })).to.be.false;
        });
      });

      it("should handle clearing all content", function () {
        container.innerHTML = "<div>Test 1</div><div>Test 2</div>";

        return asyncRun(function () {
          container.innerHTML = "";
        }).then(function () {
          var slot = getSlot(container);
          var assigned = slot.assignedNodes().filter(function (node) {
            return node.nodeType === Node.ELEMENT_NODE;
          });
          expect(assigned.length).to.equal(0);
        });
      });

      it("should update label slot content dynamically", function () {
        var label = document.createElement("span");
        label.setAttribute("slot", "label");
        label.textContent = "Initial Label";
        container.appendChild(label);

        return asyncRun(function () {
          label.textContent = "Updated Label";
        }).then(function () {
          var labelSlot = getSlot(container, "label");
          var assigned = labelSlot.assignedNodes();
          expect(assigned[0].textContent).to.equal("Updated Label");
        });
      });

      it("should replace start slot content", function () {
        var icon1 = document.createElement("i");
        icon1.setAttribute("slot", "start");
        icon1.textContent = "▶";
        container.appendChild(icon1);

        return asyncRun(function () {
          container.removeChild(icon1);
          var icon2 = document.createElement("i");
          icon2.setAttribute("slot", "start");
          icon2.textContent = "▼";
          container.appendChild(icon2);
        }).then(function () {
          var startSlot = getSlot(container, "start");
          var assigned = startSlot.assignedNodes();
          expect(assigned.length).to.equal(1);
          expect(assigned[0].textContent).to.equal("▼");
        });
      });
    });

    describe("Shadow DOM Styles", function () {
      var container;

      beforeEach(function () {
        container = createContainer();
      });

      afterEach(function () {
        cleanupContainer(container);
      });

      it("should have adopted stylesheets or style element in shadow root", function () {
        var sr = container.shadowRoot;
        var hasAdopted = sr.adoptedStyleSheets && sr.adoptedStyleSheets.length > 0;
        var hasStyleEl = sr.querySelector("style") !== null;
        assert(hasAdopted || hasStyleEl, "Shadow root should contain styles.");
      });

      it("should apply display flex on host via shadow DOM styles", function () {
        const computed = window.getComputedStyle(container);
        expect(computed.display).to.equal("flex");
      });

      it("should apply flex-direction column on host via shadow DOM styles", function () {
        const computed = window.getComputedStyle(container);
        expect(computed.flexDirection).to.equal("column");
      });

      it("should hide the host when the hidden attribute is set", function () {
        container.setAttribute("hidden", "");
        const computed = window.getComputedStyle(container);
        expect(computed.display).to.equal("none");
      });

      it("should increase header spacing with label-size", function () {
        const label = appendSlottedElement(container, "span", "label", "Label");

        return asyncRun(function () {
          container.setAttribute("label-size", "small");
        }).then(function () {
          const smallSpacing = parseFloat(window.getComputedStyle(label).marginBlockEnd);
          return asyncRun(function () {
            container.setAttribute("label-size", "large");
          }).then(function () {
            const largeSpacing = parseFloat(window.getComputedStyle(label).marginBlockEnd);
            expect(largeSpacing).to.be.greaterThan(smallSpacing);
          });
        });
      });

      ["start", "center", "end"].forEach(function (value) {
        it("should apply label-align='" + value + "'", function () {
          return asyncRun(function () {
            container.setAttribute("label-align", value);
          }).then(function () {
            const labelPart = container.shadowRoot.querySelector("[part='label']");
            const computed = window.getComputedStyle(labelPart);
            expect(computed.justifyContent).to.equal(value);
          });
        });
      });
    });
  });
})();
