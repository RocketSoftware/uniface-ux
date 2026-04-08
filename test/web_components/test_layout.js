/* global chai, umockup */
(function () {
  "use strict";

  const assert = chai.assert;
  const expect = chai.expect;
  const asyncRun = umockup.asyncRun;

  /**
   * Creates a new uf-layout element and appends it to the document body.
   * @returns {HTMLElement} The created layout element.
   */
  function createLayout() {
    const layout = document.createElement("uf-layout");
    const container = document.getElementById("web-component") || document.body;
    container.appendChild(layout);
    return layout;
  }

  /**
   * Creates a new uf-layout element. Use with asyncRun for async initialization.
   * @returns {HTMLElement} The created layout element.
   */
  function createRenderedLayout() {
    return createLayout();
  }

  /**
   * Removes the layout element from the DOM.
   * @param {HTMLElement} layout - The layout element to remove.
   */
  function cleanupLayout(layout) {
    layout?.remove();
  }

  /**
   * Automated tests for the Layout web component.
   * The Layout component is a FAST custom element that provides
   * a flexible layout with label and content slots.
   */
  describe("Layout Web Component Tests", function () {
    describe("Component Registration", function () {
      it("should be registered as a custom element", function () {
        const layoutElement = window.customElements.get("uf-layout");
        assert(layoutElement, "Layout web component 'uf-layout' should be registered.");
      });

      it("should be defined in the window context", function () {
        assert(window.Layout || window.customElements.get("uf-layout"), "Layout should be available.");
      });
    });

    describe("Component Creation", function () {
      let layout;

      beforeEach(function () {
        layout = createLayout();
      });

      afterEach(function () {
        cleanupLayout(layout);
      });

      it("should create a layout element", function () {
        assert(layout, "Layout element should be created.");
        expect(layout.tagName.toLowerCase()).to.equal("uf-layout");
      });

      it("should be an instance of HTMLElement", function () {
        expect(layout).to.be.instanceOf(HTMLElement);
      });

      it("should have FASTElement properties", function () {
        // FASTElement provides $fastController property.
        assert(layout.$fastController, "Layout should have $fastController from FASTElement.");
      });
    });

    describe("Component Structure", function () {
      let layout;

      beforeEach(function () {
        layout = createLayout();
      });

      afterEach(function () {
        cleanupLayout(layout);
      });

      it("should have a shadow root", function () {
        assert(layout.shadowRoot, "Layout should have a shadow root.");
      });

      it("should not contain a label section by default", function () {
        const shadowRoot = layout.shadowRoot;
        const labelPart = shadowRoot.querySelector("[part='label']");
        expect(labelPart).to.be.null;
      });

      it("should contain a label section when show-label is true", function () {
        return asyncRun(function () {
          layout.setAttribute("show-label", "true");
        }).then(function () {
          const shadowRoot = layout.shadowRoot;
          const labelPart = shadowRoot.querySelector("[part='label']");
          assert(labelPart, "Layout should have a label part when show-label is true.");
          expect(labelPart.classList.contains("label")).to.be.true;
          expect(labelPart).to.not.be.null;
        });
      });

      it("should contain a root section", function () {
        const shadowRoot = layout.shadowRoot;
        const rootPart = shadowRoot.querySelector("[part='root']");
        assert(rootPart, "Layout should have a root part.");
        expect(rootPart.classList.contains("root")).to.be.true;
      });

      it("should not have a label slot by default", function () {
        const shadowRoot = layout.shadowRoot;
        const labelSlot = shadowRoot.querySelector("slot[name='label']");
        expect(labelSlot).to.be.null;
      });

      it("should have a slot for label content when show-label is true", function () {
        return asyncRun(function () {
          layout.setAttribute("show-label", "true");
        }).then(function () {
          const shadowRoot = layout.shadowRoot;
          const labelSlot = shadowRoot.querySelector("slot[name='label']");
          assert(labelSlot, "Layout should have a named slot for label when show-label is true.");
        });
      });

      it("should have a default slot for main content", function () {
        const shadowRoot = layout.shadowRoot;
        const defaultSlot = shadowRoot.querySelector(".root slot:not([name])");
        assert(defaultSlot, "Layout should have a default slot for content.");
      });
    });

    describe("Slotted Content", function () {
      let layout;

      beforeEach(function () {
        layout = createLayout();
      });

      afterEach(function () {
        cleanupLayout(layout);
      });

      it("should display content in default slot", function () {
        const content = document.createElement("div");
        content.textContent = "Test Content";
        layout.appendChild(content);

        const assignedNodes = layout.shadowRoot.querySelector(".root slot").assignedNodes();
        expect(assignedNodes.length).to.be.greaterThan(0);
      });

      it("should not display label slot by default", function () {
        const label = document.createElement("label");
        label.setAttribute("slot", "label");
        label.textContent = "Test Label";
        layout.appendChild(label);

        const labelSlot = layout.shadowRoot.querySelector("slot[name='label']");
        expect(labelSlot).to.be.null;
      });

      it("should display label in named slot when show-label is true", function () {
        return asyncRun(function () {
          layout.setAttribute("show-label", "true");
        }).then(function () {
          const label = document.createElement("label");
          label.setAttribute("slot", "label");
          label.textContent = "Test Label";
          layout.appendChild(label);
          return asyncRun(function () {});
        }).then(function () {
          const labelSlot = layout.shadowRoot.querySelector("slot[name='label']");
          assert(labelSlot, "Label slot should exist when show-label is true.");
          const assignedNodes = labelSlot.assignedNodes();
          expect(assignedNodes.length).to.be.greaterThan(0);
        });
      });

      it("should support multiple elements in default slot", function () {
        const div1 = document.createElement("div");
        div1.textContent = "Content 1";
        const div2 = document.createElement("div");
        div2.textContent = "Content 2";

        layout.appendChild(div1);
        layout.appendChild(div2);

        const defaultSlot = layout.shadowRoot.querySelector(".root slot:not([name])");
        const assignedNodes = defaultSlot.assignedNodes();
        expect(assignedNodes.length).to.equal(2);
      });
    });

    describe("show-label Attribute", function () {
      let layout;

      beforeEach(function () {
        layout = createLayout();
      });

      afterEach(function () {
        cleanupLayout(layout);
      });

      it("should hide label section by default", function () {
        const labelPart = layout.shadowRoot.querySelector("[part='label']");
        expect(labelPart).to.be.null;
      });

      it("should show label section when show-label='true'", function () {
        return asyncRun(function () {
          layout.setAttribute("show-label", "true");
        }).then(function () {
          const labelPart = layout.shadowRoot.querySelector("[part='label']");
          assert(labelPart, "Label section should be visible when show-label is true.");
        });
      });

      it("should hide label section when show-label attribute is removed", function () {
        return asyncRun(function () {
          layout.setAttribute("show-label", "true");
        }).then(function () {
          const labelPartBefore = layout.shadowRoot.querySelector("[part='label']");
          assert(labelPartBefore, "Label should be visible initially.");
          layout.removeAttribute("show-label");
          return asyncRun(function () {});
        }).then(function () {
          const labelPartAfter = layout.shadowRoot.querySelector("[part='label']");
          expect(labelPartAfter).to.be.null;
        });
      });

      it("should toggle label visibility dynamically", function () {
        // Start with label hidden.
        const initialLabel = layout.shadowRoot.querySelector("[part='label']");
        expect(initialLabel).to.be.null;

        // Show label.
        return asyncRun(function () {
          layout.setAttribute("show-label", "true");
        }).then(function () {
          const shownLabel = layout.shadowRoot.querySelector("[part='label']");
          assert(shownLabel, "Label should be visible after setting show-label to true.");
          // Hide label.
          return asyncRun(function () {
            layout.removeAttribute("show-label");
          });
        }).then(function () {
          const hiddenLabel = layout.shadowRoot.querySelector("[part='label']");
          expect(hiddenLabel).to.be.null;
          // Show again.
          return asyncRun(function () {
            layout.setAttribute("show-label", "true");
          });
        }).then(function () {
          const reshownLabel = layout.shadowRoot.querySelector("[part='label']");
          assert(reshownLabel, "Label should be visible again after re-enabling.");
        });
      });

      it("should maintain slotted label content when toggling visibility", function () {
        const label = document.createElement("label");
        label.setAttribute("slot", "label");
        label.textContent = "Persistent Label";
        layout.appendChild(label);

        return asyncRun(function () {
          layout.setAttribute("show-label", "true");
        }).then(function () {
          const labelSlot = layout.shadowRoot.querySelector("slot[name='label']");
          const assignedBefore = labelSlot.assignedNodes();
          expect(assignedBefore.length).to.be.greaterThan(0);
          expect(assignedBefore[0].textContent).to.equal("Persistent Label");
          return asyncRun(function () {
            layout.removeAttribute("show-label");
          });
        }).then(function () {
          const hiddenSlot = layout.shadowRoot.querySelector("slot[name='label']");
          expect(hiddenSlot).to.be.null;
          return asyncRun(function () {
            layout.setAttribute("show-label", "true");
          });
        }).then(function () {
          const reshownSlot = layout.shadowRoot.querySelector("slot[name='label']");
          const assignedAfter = reshownSlot.assignedNodes();
          expect(assignedAfter.length).to.be.greaterThan(0);
          expect(assignedAfter[0].textContent).to.equal("Persistent Label");
        });
      });

      it("should keep root section visible regardless of show-label value", function () {
        const rootBefore = layout.shadowRoot.querySelector("[part='root']");
        assert(rootBefore, "Root section should always be visible.");

        return asyncRun(function () {
          layout.setAttribute("show-label", "true");
        }).then(function () {
          const rootWithLabel = layout.shadowRoot.querySelector("[part='root']");
          assert(rootWithLabel, "Root section should remain visible when label is shown.");
          return asyncRun(function () {
            layout.removeAttribute("show-label");
          });
        }).then(function () {
          const rootWithoutLabel = layout.shadowRoot.querySelector("[part='root']");
          assert(rootWithoutLabel, "Root section should remain visible when label is hidden.");
        });
      });

      it("should handle empty string as show-label value", function () {
        return asyncRun(function () {
          layout.setAttribute("show-label", "");
        }).then(function () {
          const labelPart = layout.shadowRoot.querySelector("[part='label']");
          expect(labelPart).to.be.null;
        });
      });

      it("should treat any truthy string as true for show-label", function () {
        return asyncRun(function () {
          layout.setAttribute("show-label", "yes");
        }).then(function () {
          const labelPart = layout.shadowRoot.querySelector("[part='label']");
          // Depending on FASTElement's attribute handling, this might show or not.
          // Test actual behavior.
          assert(labelPart, "Label section should be visible for any truthy string value.");
          expect(labelPart).to.not.be.null;
        });
      });
    });

    describe("Component Styling", function () {
      let layout;

      beforeEach(function () {
        layout = createLayout();
      });

      afterEach(function () {
        cleanupLayout(layout);
      });

      it("should have CSS custom properties defined", function () {
        const styles = window.getComputedStyle(layout);
        // Check for any computed styles (basic sanity check).
        assert(styles, "Layout should have computed styles.");
      });

      it("should have display style", function () {
        const styles = window.getComputedStyle(layout);
        assert(styles.display, "Layout should have a display style.");
      });

      it("should apply flexbox layout", function () {
        const styles = window.getComputedStyle(layout);
        // The component uses display: flex.
        assert(styles.display === "flex" || styles.display === "block", "Layout should use flex or block display.");
      });
    });

    describe("Component Template", function () {
      let layout;

      beforeEach(function () {
        layout = createLayout();
      });

      afterEach(function () {
        cleanupLayout(layout);
      });

      it("should render label section before root section", function () {
        return asyncRun(function () {
          layout.setAttribute("show-label", "true");
        }).then(function () {
          const shadowRoot = layout.shadowRoot;
          const labelPart = shadowRoot.querySelector("[part='label']");
          const rootPart = shadowRoot.querySelector("[part='root']");

          assert(labelPart, "Label part should exist.");
          assert(rootPart, "Root part should exist.");

          // Check order in DOM.
          const elements = Array.from(shadowRoot.children);
          const labelIndex = elements.indexOf(labelPart);
          const rootIndex = elements.indexOf(rootPart);

          expect(labelIndex).to.be.lessThan(rootIndex, "Label should appear before root in the template.");
        });
      });
    });

    describe("Dynamic Content Updates", function () {
      let layout;

      beforeEach(function () {
        layout = createLayout();
      });

      afterEach(function () {
        cleanupLayout(layout);
      });

      it("should update when adding new content", function () {
        return asyncRun(function () {
          const newContent = document.createElement("p");
          newContent.textContent = "Dynamic Content";
          layout.appendChild(newContent);
        }).then(function () {
          const slot = layout.shadowRoot.querySelector(".root slot:not([name])");
          const assigned = slot.assignedNodes();
          expect(assigned.length).to.be.greaterThan(0);
        });
      });

      it("should update when removing content", function () {
        const content = document.createElement("div");
        content.id = "removable";
        layout.appendChild(content);

        return asyncRun(function () {
        }).then(function () {
          layout.removeChild(content);
          return asyncRun(function () {});
        }).then(function () {
          const slot = layout.shadowRoot.querySelector(".root slot:not([name])");
          const assigned = slot.assignedNodes().filter((node) => node.nodeType === Node.ELEMENT_NODE);
          expect(assigned.some((node) => node.id === "removable")).to.be.false;
        });
      });

      it("should handle clearing all content", function () {
        layout.innerHTML = "<div>Test 1</div><div>Test 2</div>";

        return asyncRun(function () {
        }).then(function () {
          layout.innerHTML = "";
          return asyncRun(function () {});
        }).then(function () {
          const slot = layout.shadowRoot.querySelector(".root slot:not([name])");
          const assigned = slot.assignedNodes().filter((node) => node.nodeType === Node.ELEMENT_NODE);
          expect(assigned.length).to.equal(0);
        });
      });
    });

    describe("Component Definition", function () {
      it("should have a static definition property", function () {
        const LayoutClass = window.customElements.get("uf-layout");
        // FASTElement classes have definition.
        assert(LayoutClass, "Layout class should exist.");
      });

      it("should have correct element name in definition", function () {
        const LayoutClass = window.customElements.get("uf-layout");
        if (LayoutClass && LayoutClass.definition) {
          expect(LayoutClass.definition.name).to.equal("uf-layout");
        } else {
          // If definition is not directly accessible, verify registration.
          assert(window.customElements.get("uf-layout"), "Layout should be registered with correct name.");
        }
      });
    });

    describe("Integration Tests", function () {
      let layout;

      beforeEach(function () {
        layout = createLayout();
      });

      afterEach(function () {
        cleanupLayout(layout);
      });

      it("should work with complex nested structure", function () {
        const label = document.createElement("h3");
        label.setAttribute("slot", "label");
        label.textContent = "Form Section";

        const form = document.createElement("form");
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Enter value";
        form.appendChild(input);

        layout.appendChild(label);
        layout.appendChild(form);

        assert(layout.querySelector("h3[slot='label']"), "Label should be present.");
        assert(layout.querySelector("form"), "Form should be present.");
        assert(layout.querySelector("input"), "Input should be present.");
      });

      it("should maintain functionality when cloned", function () {
        const label = document.createElement("span");
        label.setAttribute("slot", "label");
        label.textContent = "Original Label";
        layout.appendChild(label);

        const clonedLayout = layout.cloneNode(true);
        document.body.appendChild(clonedLayout);

        assert(clonedLayout.querySelector("span[slot='label']"), "Cloned layout should have label.");
        expect(clonedLayout.querySelector("span[slot='label']").textContent).to.equal("Original Label");

        document.body.removeChild(clonedLayout);
      });

      it("should support multiple layout instances", function () {
        const layout2 = document.createElement("uf-layout");
        const layout3 = document.createElement("uf-layout");

        document.body.appendChild(layout2);
        document.body.appendChild(layout3);

        assert(layout.shadowRoot, "First layout should have shadow root.");
        assert(layout2.shadowRoot, "Second layout should have shadow root.");
        assert(layout3.shadowRoot, "Third layout should have shadow root.");

        document.body.removeChild(layout2);
        document.body.removeChild(layout3);
      });
    });

    describe("Error Handling", function () {
      let layout;

      beforeEach(function () {
        layout = createLayout();
      });

      afterEach(function () {
        cleanupLayout(layout);
      });

      it("should handle invalid slot names gracefully", function () {
        const element = document.createElement("div");
        element.setAttribute("slot", "non-existent-slot");
        element.textContent = "Content";

        // Should not throw error.
        expect(() => layout.appendChild(element)).to.not.throw();
      });

      it("should handle rapid content changes", function () {
        return asyncRun(function () {
          for (let i = 0; i < 10; i++) {
            const div = document.createElement("div");
            div.textContent = `Item ${i}`;
            layout.appendChild(div);
          }
        }).then(function () {
          const slot = layout.shadowRoot.querySelector(".root slot:not([name])");
          const assigned = slot.assignedNodes().filter((node) => node.nodeType === Node.ELEMENT_NODE);
          expect(assigned.length).to.equal(10);
        });
      });
    });

    describe("Attribute-Based Styling: Label Size", function () {
      let layout;

      beforeEach(function () {
        layout = createLayout();
      });

      afterEach(function () {
        cleanupLayout(layout);
      });

      it("should apply small label size", function () {
        layout.setAttribute("label-size", "small");
        expect(layout.getAttribute("label-size")).to.equal("small");
      });

      it("should apply medium label size", function () {
        layout.setAttribute("label-size", "medium");
        expect(layout.getAttribute("label-size")).to.equal("medium");
      });

      it("should apply large label size", function () {
        layout.setAttribute("label-size", "large");
        expect(layout.getAttribute("label-size")).to.equal("large");
      });

      it("should change label size dynamically", function () {
        layout.setAttribute("label-size", "small");
        expect(layout.getAttribute("label-size")).to.equal("small");

        layout.setAttribute("label-size", "large");
        expect(layout.getAttribute("label-size")).to.equal("large");
      });
    });

    describe("Attribute-Based Styling: Label Position", function () {
      let layout;

      beforeEach(function () {
        layout = createLayout();
      });

      afterEach(function () {
        cleanupLayout(layout);
      });

      it("should apply 'above' label position", function () {
        layout.setAttribute("label-position", "above");
        expect(layout.getAttribute("label-position")).to.equal("above");
      });

      it("should apply 'below' label position", function () {
        layout.setAttribute("label-position", "below");
        expect(layout.getAttribute("label-position")).to.equal("below");
      });

      it("should apply 'before' label position", function () {
        layout.setAttribute("label-position", "before");
        expect(layout.getAttribute("label-position")).to.equal("before");
        // When label is before/after, layout should use row direction.
        const styles = window.getComputedStyle(layout);
        expect(styles.flexDirection).to.equal("row");
      });

      it("should apply 'after' label position", function () {
        layout.setAttribute("label-position", "after");
        expect(layout.getAttribute("label-position")).to.equal("after");
        const styles = window.getComputedStyle(layout);
        expect(styles.flexDirection).to.equal("row");
      });

      it("should change label position dynamically", function () {
        layout.setAttribute("label-position", "above");

        layout.setAttribute("label-position", "below");
        expect(layout.getAttribute("label-position")).to.equal("below");
      });
    });

    describe("Attribute-Based Styling: Label Alignment", function () {
      let layout;

      beforeEach(function () {
        layout = createLayout();
      });

      afterEach(function () {
        cleanupLayout(layout);
      });

      it("should apply 'start' label alignment", function () {
        layout.setAttribute("label-align", "start");
        expect(layout.getAttribute("label-align")).to.equal("start");
      });

      it("should apply 'center' label alignment", function () {
        layout.setAttribute("label-align", "center");
        expect(layout.getAttribute("label-align")).to.equal("center");
      });

      it("should apply 'end' label alignment", function () {
        layout.setAttribute("label-align", "end");
        expect(layout.getAttribute("label-align")).to.equal("end");
      });
    });

    describe("Attribute-Based Styling: horizontal-align", function () {
      let layout;

      beforeEach(function () {
        layout = createLayout();
      });

      afterEach(function () {
        cleanupLayout(layout);
      });

      it("should apply 'start' horizontal-align", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "horizontal-scroll");
          layout.setAttribute("horizontal-align", "start");
        }).then(function () {
          const rootElement = layout.shadowRoot.querySelector(".root");
          const styles = window.getComputedStyle(rootElement);
          expect(styles.justifyContent).to.equal("start");
        });
      });

      it("should apply 'center' horizontal-align", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "horizontal-scroll");
          layout.setAttribute("horizontal-align", "center");
        }).then(function () {
          const rootElement = layout.shadowRoot.querySelector(".root");
          const styles = window.getComputedStyle(rootElement);
          expect(styles.justifyContent).to.equal("safe center");
        });
      });

      it("should apply 'end' horizontal-align", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "horizontal-scroll");
          layout.setAttribute("horizontal-align", "end");
        }).then(function () {
          const rootElement = layout.shadowRoot.querySelector(".root");
          const styles = window.getComputedStyle(rootElement);
          expect(styles.justifyContent).to.equal("safe end");
        });
      });

      it("should apply 'space-between' horizontal-align", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "horizontal-scroll");
          layout.setAttribute("horizontal-align", "space-between");
        }).then(function () {
          const rootElement = layout.shadowRoot.querySelector(".root");
          const styles = window.getComputedStyle(rootElement);
          expect(styles.justifyContent).to.equal("space-between");
        });
      });

      it("should apply 'space-around' horizontal-align", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "horizontal-scroll");
          layout.setAttribute("horizontal-align", "space-around");
        }).then(function () {
          const rootElement = layout.shadowRoot.querySelector(".root");
          const styles = window.getComputedStyle(rootElement);
          expect(styles.justifyContent).to.equal("space-around");
        });
      });

      it("should apply 'space-evenly' horizontal-align", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "horizontal-scroll");
          layout.setAttribute("horizontal-align", "space-evenly");
        }).then(function () {
          const rootElement = layout.shadowRoot.querySelector(".root");
          const styles = window.getComputedStyle(rootElement);
          expect(styles.justifyContent).to.equal("space-evenly");
        });
      });

      it("should apply 'auto' horizontal-align", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "auto");
          layout.setAttribute("horizontal-align", "auto");
        }).then(function () {
          const rootElement = layout.shadowRoot.querySelector(".root");
          const styles = window.getComputedStyle(rootElement);
          expect(styles.justifyContent).to.equal("normal"); // Auto fallback.
        });
      });
    });

    describe("Horizontal Align in Scroll Layout", function () {
      let container;

      beforeEach(function () {
        container = createLayout();
      });

      afterEach(function () {
        cleanupLayout(container);
      });

      it("should apply center alignment with horizontal-scroll layout", function () {
        return asyncRun(function () {
          container.setAttribute("layout-type", "horizontal-scroll");
          container.setAttribute("horizontal-align", "center");
        }).then(function () {
          const rootElement = container.shadowRoot.querySelector(".root");
          const styles = window.getComputedStyle(rootElement);
          expect(styles.justifyContent).to.equal("safe center");
        });
      });

      it("should apply end alignment with horizontal-scroll layout", function () {
        return asyncRun(function () {
          container.setAttribute("layout-type", "horizontal-scroll");
          container.setAttribute("horizontal-align", "end");
        }).then(function () {
          const rootElement = container.shadowRoot.querySelector(".root");
          const styles = window.getComputedStyle(rootElement);
          expect(styles.justifyContent).to.equal("safe end");
        });
      });

      it("should keep horizontal-wrap with center alignment at center", function () {
        return asyncRun(function () {
          container.setAttribute("layout-type", "horizontal-wrap");
          container.setAttribute("horizontal-align", "center");
        }).then(function () {
          const rootElement = container.shadowRoot.querySelector(".root");
          const styles = window.getComputedStyle(rootElement);
          expect(styles.justifyContent).to.equal("safe center");
        });
      });
    });

    describe("Attribute-Based Styling: vertical-align", function () {
      let layout;

      beforeEach(function () {
        return asyncRun(function () {
          layout = createLayout();
        });
      });

      afterEach(function () {
        cleanupLayout(layout);
      });

      it("should apply 'start' vertical-align", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "horizontal-scroll");
          layout.setAttribute("vertical-align", "start");
        }).then(function () {
          const rootElement = layout.shadowRoot.querySelector(".root");
          const styles = window.getComputedStyle(rootElement);
          expect(styles.alignItems).to.equal("start");
        });
      });

      it("should apply 'center' vertical-align", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "horizontal-scroll");
          layout.setAttribute("vertical-align", "center");
        }).then(function () {
          const rootElement = layout.shadowRoot.querySelector(".root");
          const styles = window.getComputedStyle(rootElement);
          expect(styles.alignItems).to.equal("safe center");
        });
      });

      it("should apply 'end' vertical-align", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "horizontal-scroll");
          layout.setAttribute("vertical-align", "end");
        }).then(function () {
          const rootElement = layout.shadowRoot.querySelector(".root");
          const styles = window.getComputedStyle(rootElement);
          expect(styles.alignItems).to.equal("safe end");
        });
      });

      it("should apply 'stretch' vertical-align", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "horizontal-scroll");
          layout.setAttribute("vertical-align", "stretch");
        }).then(function () {
          const rootElement = layout.shadowRoot.querySelector(".root");
          const styles = window.getComputedStyle(rootElement);
          expect(styles.alignItems).to.equal("stretch");
        });
      });

      it("should apply 'auto' vertical-align", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "auto");
          layout.setAttribute("vertical-align", "auto");
        }).then(function () {
          const rootElement = layout.shadowRoot.querySelector(".root");
          const styles = window.getComputedStyle(rootElement);
          expect(styles.alignItems).to.equal("normal"); // Auto fallback.
        });
      });
    });

    describe("Attribute-Based Styling: Layout Direction", function () {
      let layout;

      beforeEach(function () {
        layout = createLayout();
      });

      afterEach(function () {
        cleanupLayout(layout);
      });

      it("should apply vertical-scroll layout", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "vertical-scroll");
        }).then(function () {
          const rootElement = layout.shadowRoot.querySelector(".root");
          const rootStyles = window.getComputedStyle(rootElement);
          const layoutStyles = window.getComputedStyle(layout);

          expect(rootStyles.flexDirection).to.equal("column");
          expect(layoutStyles.overflowY).to.be.oneOf(["auto", "scroll"]);
        });
      });

      it("should apply vertical-wrap layout", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "vertical-wrap");
        }).then(function () {
          const rootElement = layout.shadowRoot.querySelector(".root");
          const styles = window.getComputedStyle(rootElement);

          expect(styles.flexDirection).to.equal("column");
          expect(styles.flexWrap).to.equal("wrap");
        });
      });

      it("should apply horizontal-scroll layout", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "horizontal-scroll");
        }).then(function () {
          const rootElement = layout.shadowRoot.querySelector(".root");
          const rootStyles = window.getComputedStyle(rootElement);
          const layoutStyles = window.getComputedStyle(layout);

          expect(rootStyles.flexDirection).to.equal("row");
          expect(layoutStyles.overflowX).to.be.oneOf(["auto", "scroll"]);
        });
      });

      it("should apply horizontal-wrap layout", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "horizontal-wrap");
        }).then(function () {
          const rootElement = layout.shadowRoot.querySelector(".root");
          const styles = window.getComputedStyle(rootElement);

          expect(styles.flexDirection).to.equal("row");
          expect(styles.flexWrap).to.equal("wrap");
        });
      });

      it("should apply 'auto' layout", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "auto");
        }).then(function () {
          const rootElement = layout.shadowRoot.querySelector(".root");
          const styles = window.getComputedStyle(rootElement);

          expect(styles.flexDirection).to.equal("column"); // Auto defaults to vertical-scroll.
          expect(styles.flexWrap).to.equal("nowrap");
        });
      });
    });

    describe("Attribute-Based Styling: Combined Attributes", function () {
      let layout;

      beforeEach(function () {
        layout = createLayout();
      });

      afterEach(function () {
        cleanupLayout(layout);
      });

      it("should apply multiple attributes simultaneously", function () {
        layout.setAttribute("layout-type", "horizontal-wrap");
        layout.setAttribute("horizontal-align", "center");

        return asyncRun(function () {
        }).then(function () {
          expect(layout.getAttribute("layout-type")).to.equal("horizontal-wrap");
          expect(layout.getAttribute("horizontal-align")).to.equal("center");

          const rootElement = layout.shadowRoot.querySelector(".root");
          const rootStyles = window.getComputedStyle(rootElement);
          expect(rootStyles.flexDirection).to.equal("row");
          expect(rootStyles.flexWrap).to.equal("wrap");
          expect(rootStyles.justifyContent).to.equal("safe center");
        });
      });

      it("should handle label position with alignment", function () {
        layout.setAttribute("show-label", "true");
        layout.setAttribute("label-position", "before");
        layout.setAttribute("label-align", "center");
        layout.setAttribute("label-size", "large");

        return asyncRun(function () {
        }).then(function () {
          const layoutStyles = window.getComputedStyle(layout);
          expect(layoutStyles.flexDirection).to.equal("row");

          const labelElement = layout.shadowRoot.querySelector(".label");
          if (labelElement) {
            const labelStyles = window.getComputedStyle(labelElement);
            expect(labelStyles.alignSelf).to.equal("center");
          }
        });
      });

      it("should dynamically update multiple attributes", function () {
        layout.setAttribute("layout-type", "vertical-scroll");

        return asyncRun(function () {
          layout.setAttribute("layout-type", "horizontal-wrap");
        }).then(function () {
          expect(layout.getAttribute("layout-type")).to.equal("horizontal-wrap");

          const rootElement = layout.shadowRoot.querySelector(".root");
          const styles = window.getComputedStyle(rootElement);
          expect(styles.flexDirection).to.equal("row");
        });
      });

      it("should maintain content and styling when attributes change", function () {
        const label = document.createElement("h3");
        label.setAttribute("slot", "label");
        label.textContent = "Test Label";

        const content = document.createElement("div");
        content.textContent = "Test Content";

        layout.appendChild(label);
        layout.appendChild(content);

        return asyncRun(function () {
          layout.setAttribute("layout-type", "horizontal-scroll");
        }).then(function () {
          // Verify content is still present.
          assert(layout.querySelector("h3[slot='label']"), "Label should still be present.");
          assert(layout.querySelector("div"), "Content should still be present.");

          // Verify attributes applied.
          expect(layout.getAttribute("layout-type")).to.equal("horizontal-scroll");
        });
      });
    });

    describe("Attribute-Based Styling: Edge Cases", function () {
      let layout;

      beforeEach(function () {
        layout = createLayout();
      });

      afterEach(function () {
        cleanupLayout(layout);
      });

      it("should handle invalid attribute values gracefully", function () {
        expect(() => {
          layout.setAttribute("layout-type", "invalid-layout");
          layout.setAttribute("horizontal-align", "wrong");
        }).to.not.throw();
      });

      it("should handle attribute removal", function () {
        layout.setAttribute("layout-type", "horizontal-wrap");

        return asyncRun(function () {
          layout.removeAttribute("layout-type");
        }).then(function () {
          expect(layout.hasAttribute("layout-type")).to.be.false;
        });
      });

      it("should handle empty attribute values", function () {
        expect(() => {
          layout.setAttribute("layout-type", "");
        }).to.not.throw();
      });

      it("should handle rapid attribute changes", function () {
        const values = ["vertical-scroll", "horizontal-scroll", "vertical-wrap", "vertical-scroll", "horizontal-wrap"];

        return asyncRun(function () {
          values.forEach((value) => {
            layout.setAttribute("layout-type", value);
          });
        }).then(function () {
          expect(layout.getAttribute("layout-type")).to.equal("horizontal-wrap");
        });
      });
    });

    describe("Comprehensive Attribute Validation", function () {
      let layout;

      beforeEach(function () {
        layout = createLayout();
      });

      afterEach(function () {
        cleanupLayout(layout);
      });

      it("should reject invalid layout values and use default", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "invalid-layout");
        }).then(function () {
          const root = layout.shadowRoot.querySelector(".root");
          const styles = window.getComputedStyle(root);
          // Should not apply invalid layout.
          expect(styles.flexDirection).to.be.oneOf(["row", "column"]);
        });
      });

      it("should be case-sensitive for attribute values", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "HORIZONTAL-WRAP");
        }).then(function () {
          layout.setAttribute("layout-type", "horizontal-wrap");
          return asyncRun(function () {});
        }).then(function () {
          const root = layout.shadowRoot.querySelector(".root");
          const styles = window.getComputedStyle(root);
          // Case matters - HORIZONTAL-WRAP might not work, horizontal-wrap should work.
          expect(styles.flexWrap).to.equal("wrap");
        });
      });

      it("should handle null and undefined attribute values gracefully", function () {
        expect(() => {
          layout.setAttribute("layout-type", null);
          layout.setAttribute("label-position", undefined);
        }).to.not.throw();
      });
    });

    describe("All Valid Attribute Values", function () {
      let layout;

      beforeEach(function () {
        layout = createLayout();
      });

      afterEach(function () {
        cleanupLayout(layout);
      });

      it("should accept all 5 valid layout values", function () {
        return asyncRun(function () {
          const layouts = ["vertical-scroll", "horizontal-scroll", "vertical-wrap", "horizontal-wrap", "auto"];

          layouts.forEach(layoutValue => {
            layout.setAttribute("layout-type", layoutValue);
            const root = layout.shadowRoot.querySelector(".root");
            expect(root).to.exist;
          });
        });
      });

      it("should accept all 3 valid label sizes (small/medium/large)", function () {
        return asyncRun(function () {
          const labelSizes = ["small", "medium", "large"];

          labelSizes.forEach(size => {
            layout.setAttribute("label-size", size);
            expect(layout.getAttribute("label-size")).to.equal(size);
          });
        });
      });

      it("should accept all 4 valid label positions", function () {
        return asyncRun(function () {
          const positions = ["above", "below", "before", "after"];

          positions.forEach(position => {
            layout.setAttribute("label-position", position);
            expect(layout.getAttribute("label-position")).to.equal(position);
          });
        });
      });

      it("should accept all 3 valid label alignments", function () {
        return asyncRun(function () {
          const alignments = ["start", "center", "end"];

          alignments.forEach(alignment => {
            layout.setAttribute("label-align", alignment);
            expect(layout.getAttribute("label-align")).to.equal(alignment);
          });
        });
      });

      it("should accept all 8 valid horizontal-align values", function () {
        return asyncRun(function () {
          const alignments = ["start", "center", "end", "space-between", "space-around", "space-evenly", "stretch", "auto"];

          alignments.forEach(alignment => {
            layout.setAttribute("horizontal-align", alignment);
            expect(layout.getAttribute("horizontal-align")).to.equal(alignment);
          });
        });
      });

      it("should accept all 8 valid vertical-align values", function () {
        return asyncRun(function () {
          const alignments = ["start", "center", "end", "space-between", "space-around", "space-evenly", "stretch", "auto"];

          alignments.forEach(alignment => {
            layout.setAttribute("vertical-align", alignment);
            expect(layout.getAttribute("vertical-align")).to.equal(alignment);
          });
        });
      });
    });

    describe("Attribute Removal and Default Behavior", function () {
      let layout;

      beforeEach(function () {
        layout = createLayout();
      });

      afterEach(function () {
        cleanupLayout(layout);
      });

      it("should revert to default when layout attribute is removed", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "horizontal-scroll");
        }).then(function () {
          layout.removeAttribute("layout-type");
          return asyncRun(function () {});
        }).then(function () {
          const root = layout.shadowRoot.querySelector(".root");
          const styles = window.getComputedStyle(root);
          expect(styles.flexDirection).to.equal("column"); // default
        });
      });

      it("should handle multiple attribute removals", function () {
        layout.setAttribute("label-position", "below");
        layout.setAttribute("layout-type", "horizontal-wrap");

        return asyncRun(function () {
          layout.removeAttribute("label-position");
          layout.removeAttribute("layout-type");
        }).then(function () {
          expect(layout.hasAttribute("label-position")).to.be.false;
          expect(layout.hasAttribute("layout-type")).to.be.false;
        });
      });
    });

    describe("Attribute Value Switching", function () {
      let layout;

      beforeEach(function () {
        layout = createLayout();
      });

      afterEach(function () {
        cleanupLayout(layout);
      });

      it("should properly switch between layout directions", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "vertical-scroll");
        }).then(function () {
          const root = layout.shadowRoot.querySelector(".root");
          expect(window.getComputedStyle(root).flexDirection).to.equal("column");
          layout.setAttribute("layout-type", "horizontal-scroll");
          return asyncRun(function () {});
        }).then(function () {
          const root = layout.shadowRoot.querySelector(".root");
          expect(window.getComputedStyle(root).flexDirection).to.equal("row");
        });
      });

      it("should switch between wrap and scroll layouts", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "vertical-scroll");
        }).then(function () {
          const root = layout.shadowRoot.querySelector(".root");
          expect(window.getComputedStyle(root).flexWrap).to.not.equal("wrap");
          layout.setAttribute("layout-type", "vertical-wrap");
          return asyncRun(function () {});
        }).then(function () {
          const root = layout.shadowRoot.querySelector(".root");
          expect(window.getComputedStyle(root).flexWrap).to.equal("wrap");
        });
      });

      it("should switch to and from auto layout", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "vertical-scroll");
        }).then(function () {
          expect(layout.getAttribute("layout-type")).to.equal("vertical-scroll");
          layout.setAttribute("layout-type", "auto");
          return asyncRun(function () {});
        }).then(function () {
          expect(layout.getAttribute("layout-type")).to.equal("auto");
          layout.setAttribute("layout-type", "horizontal-wrap");
          return asyncRun(function () {});
        }).then(function () {
          expect(layout.getAttribute("layout-type")).to.equal("horizontal-wrap");
        });
      });

      it("should switch alignment values to and from auto", function () {
        return asyncRun(function () {
          layout.setAttribute("horizontal-align", "center");
          expect(layout.getAttribute("horizontal-align")).to.equal("center");
          layout.setAttribute("horizontal-align", "auto");
          return asyncRun(function () {});
        }).then(function () {
          expect(layout.getAttribute("horizontal-align")).to.equal("auto");

          layout.setAttribute("vertical-align", "stretch");
          expect(layout.getAttribute("vertical-align")).to.equal("stretch");
          layout.setAttribute("vertical-align", "auto");
          return asyncRun(function () {});
        }).then(function () {
          expect(layout.getAttribute("vertical-align")).to.equal("auto");
        });
      });

    });

    describe("Boundary Cases for Attributes", function () {
      let layout;

      beforeEach(function () {
        layout = createLayout();
      });

      afterEach(function () {
        cleanupLayout(layout);
      });

      it("should handle empty string attribute values", function () {
        expect(() => {
          layout.setAttribute("layout-type", "");
        }).to.not.throw();
      });

      it("should handle whitespace-only attribute values", function () {
        expect(() => {
          layout.setAttribute("layout-type", " \t\n ");
        }).to.not.throw();
      });

      it("should handle numeric values for string attributes", function () {
        expect(() => {
          layout.setAttribute("layout-type", 0);
        }).to.not.throw();
      });

      it("should handle special characters in attribute values", function () {
        expect(() => {
          layout.setAttribute("layout-type", "vertical<script>");
        }).to.not.throw();
      });

      it("should handle very long attribute values", function () {
        const longValue = "a".repeat(1000);
        expect(() => layout.setAttribute("layout-type", longValue)).to.not.throw();
      });
    });

    describe("CSS Computed Values Verification", function () {
      let layout;

      beforeEach(function () {
        layout = createLayout();
      });

      afterEach(function () {
        cleanupLayout(layout);
      });

      it("should apply correct flex-direction for each layout", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "horizontal-scroll");
        }).then(function () {
          const root = layout.shadowRoot.querySelector(".root");
          expect(window.getComputedStyle(root).flexDirection).to.equal("row");
          layout.setAttribute("layout-type", "vertical-scroll");
          return asyncRun(function () {});
        }).then(function () {
          const root = layout.shadowRoot.querySelector(".root");
          expect(window.getComputedStyle(root).flexDirection).to.equal("column");
        });
      });

      it("should apply overflow correctly for scroll layouts", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "horizontal-scroll");
        }).then(function () {
          const styles = window.getComputedStyle(layout);
          expect(styles.overflowX).to.equal("auto");
          layout.setAttribute("layout-type", "vertical-scroll");
          return asyncRun(function () {});
        }).then(function () {
          const verticalStyles = window.getComputedStyle(layout);
          expect(verticalStyles.overflowY).to.equal("auto");
        });
      });

    });

    describe("Label Position Layout Behavior", function () {
      let layout;

      beforeEach(function () {
        layout = createRenderedLayout();
      });

      afterEach(function () {
        cleanupLayout(layout);
      });

      it("should change host flex-direction for before/after positions", function () {
        return asyncRun(function () {
          layout.setAttribute("label-position", "before");
        }).then(function () {
          const hostStyles = window.getComputedStyle(layout);
          expect(hostStyles.flexDirection).to.equal("row");
          layout.setAttribute("label-position", "above");
          return asyncRun(function () {});
        }).then(function () {
          expect(window.getComputedStyle(layout).flexDirection).to.equal("column");
        });
      });

      it("should change label order for below/after positions", function () {
        return asyncRun(function () {
          layout.setAttribute("show-label", "true");
          const label = document.createElement("div");
          label.setAttribute("slot", "label");
          label.textContent = "Test Label";
          layout.appendChild(label);
          layout.setAttribute("label-position", "below");
        }).then(function () {
          const labelElement = layout.shadowRoot.querySelector(".label");
          assert(labelElement, "Label element should exist when show-label is true.");
          const orderStyle = window.getComputedStyle(labelElement).order;
          expect(orderStyle).to.equal("2");
        });
      });

      it("should maintain row direction for after position", function () {
        return asyncRun(function () {
          layout.setAttribute("show-label", "true");
          layout.setAttribute("label-position", "after");
        }).then(function () {
          const hostStyles = window.getComputedStyle(layout);
          expect(hostStyles.flexDirection).to.equal("row");

          const labelElement = layout.shadowRoot.querySelector(".label");
          assert(labelElement, "Label element should exist when show-label is true.");
          const orderStyle = window.getComputedStyle(labelElement).order;
          expect(orderStyle).to.equal("2");
        });
      });

      it("should apply correct margin for each label position", function () {
        return asyncRun(function () {
          layout.setAttribute("show-label", "true");
          layout.setAttribute("label-size", "medium");
          layout.setAttribute("label-position", "above");
        }).then(function () {
          const labelElement = layout.shadowRoot.querySelector(".label");
          assert(labelElement, "Label element should exist when show-label is true.");
          const styles = window.getComputedStyle(labelElement);
          expect(styles.marginBlockEnd).to.not.equal("0px");

          layout.setAttribute("label-position", "before");
          return asyncRun(function () {});
        }).then(function () {
          const labelElement = layout.shadowRoot.querySelector(".label");
          const newStyles = window.getComputedStyle(labelElement);
          expect(newStyles.marginInlineEnd).to.not.equal("0px");
        });
      });
    });

    /**
     * These tests verify that .root sizes to the remaining space after the label
     * rather than consuming the full host height, so content is not clipped when
     * a label is present (e.g. with vertical-align="end").
     */
    describe("Label and Root Space Distribution", function () {
      let layout;

      beforeEach(function () {
        layout = createLayout();
      });

      afterEach(function () {
        cleanupLayout(layout);
      });

      it("should have flex-grow 1 on .root so remaining space fills correctly after siblings", function () {
        const root = layout.shadowRoot.querySelector(".root");
        // flex: 1 ... auto sets flex-grow to 1; height: 100% must not be present to allow correct flex sizing.
        expect(window.getComputedStyle(root).flexGrow).to.equal("1");
      });

      it("should size .root below the full host height when show-label is true", function () {
        return asyncRun(function () {
          layout.style.height = "300px";
          layout.setAttribute("show-label", "true");
          const labelEl = document.createElement("div");
          labelEl.setAttribute("slot", "label");
          labelEl.textContent = "Label";
          labelEl.style.height = "40px";
          layout.appendChild(labelEl);
        }).then(function () {
          const root = layout.shadowRoot.querySelector(".root");
          // .root must shrink to leave room for the label; flex-grow fills remaining space, not 100% of host.
          expect(root.offsetHeight).to.be.lessThan(layout.clientHeight);
        });
      });

      it("should not allow .root and label heights to exceed the host height", function () {
        return asyncRun(function () {
          layout.style.height = "300px";
          layout.setAttribute("show-label", "true");
          const labelEl = document.createElement("div");
          labelEl.setAttribute("slot", "label");
          labelEl.textContent = "Label";
          labelEl.style.height = "40px";
          layout.appendChild(labelEl);
        }).then(function () {
          const root = layout.shadowRoot.querySelector(".root");
          const labelSection = layout.shadowRoot.querySelector(".label");
          assert(labelSection, "Label section should exist when show-label is true.");
          const totalHeight = root.offsetHeight + labelSection.offsetHeight;
          // Combined height of .root and .label must fit within the host boundaries.
          expect(totalHeight).to.be.at.most(layout.clientHeight);
        });
      });

      it("should keep content within the host when vertical-align is end and show-label is true", function () {
        let content;
        return asyncRun(function () {
          layout.style.height = "300px";
          layout.setAttribute("show-label", "true");
          layout.setAttribute("layout-type", "vertical-scroll");
          layout.setAttribute("vertical-align", "end");
          const labelEl = document.createElement("div");
          labelEl.setAttribute("slot", "label");
          labelEl.textContent = "Label";
          labelEl.style.height = "40px";
          layout.appendChild(labelEl);
          content = document.createElement("div");
          content.textContent = "Content";
          content.style.height = "50px";
          layout.appendChild(content);
        }).then(function () {
          const layoutRect = layout.getBoundingClientRect();
          const contentRect = content.getBoundingClientRect();
          // Content pushed to end must not visually overflow the host bottom boundary.
          expect(contentRect.bottom).to.be.at.most(layoutRect.bottom + 1);
        });
      });

      it("should leave space for the label when label-position is below", function () {
        return asyncRun(function () {
          layout.style.height = "300px";
          layout.setAttribute("show-label", "true");
          layout.setAttribute("label-position", "below");
          const labelEl = document.createElement("div");
          labelEl.setAttribute("slot", "label");
          labelEl.textContent = "Label";
          labelEl.style.height = "40px";
          layout.appendChild(labelEl);
        }).then(function () {
          const root = layout.shadowRoot.querySelector(".root");
          // With label-position below, .root must still accommodate the label; full host height is not consumed.
          expect(root.offsetHeight).to.be.lessThan(layout.clientHeight);
        });
      });

      it("should keep content within the host when vertical-align is center and show-label is true", function () {
        let content;
        return asyncRun(function () {
          layout.style.height = "300px";
          layout.setAttribute("show-label", "true");
          layout.setAttribute("layout-type", "vertical-scroll");
          layout.setAttribute("vertical-align", "center");
          const labelEl = document.createElement("div");
          labelEl.setAttribute("slot", "label");
          labelEl.textContent = "Label";
          labelEl.style.height = "40px";
          layout.appendChild(labelEl);
          content = document.createElement("div");
          content.textContent = "Content";
          content.style.height = "200px";
          layout.appendChild(content);
        }).then(function () {
          const layoutRect = layout.getBoundingClientRect();
          const contentRect = content.getBoundingClientRect();
          // Content centered within .root must not visually overflow the host bottom boundary.
          expect(contentRect.bottom).to.be.at.most(layoutRect.bottom + 1);
        });
      });

      it("should not affect .root sizing when label-position is before", function () {
        return asyncRun(function () {
          layout.style.height = "300px";
          layout.setAttribute("show-label", "true");
          layout.setAttribute("label-position", "before");
          const labelEl = document.createElement("div");
          labelEl.setAttribute("slot", "label");
          labelEl.textContent = "Label";
          labelEl.style.width = "80px";
          layout.appendChild(labelEl);
        }).then(function () {
          const root = layout.shadowRoot.querySelector(".root");
          // In row direction, label sits beside .root; the fix (removing height: 100%) does not affect this axis.
          expect(window.getComputedStyle(layout).flexDirection).to.equal("row");
          // In row direction both label and .root stretch to the full host height via align-self: stretch.
          // The -1 tolerance accounts for sub-pixel rounding between offsetHeight (integer) and clientHeight.
          expect(root.offsetHeight).to.be.at.least(layout.clientHeight - 1);
        });
      });

      it("should not affect .root sizing when label-position is after", function () {
        return asyncRun(function () {
          layout.style.height = "300px";
          layout.setAttribute("show-label", "true");
          layout.setAttribute("label-position", "after");
          const labelEl = document.createElement("div");
          labelEl.setAttribute("slot", "label");
          labelEl.textContent = "Label";
          labelEl.style.width = "80px";
          layout.appendChild(labelEl);
        }).then(function () {
          const root = layout.shadowRoot.querySelector(".root");
          // In row direction, label sits beside .root; the fix (removing height: 100%) does not affect this axis.
          expect(window.getComputedStyle(layout).flexDirection).to.equal("row");
          // In row direction both label and .root stretch to the full host height via align-self: stretch.
          // The -1 tolerance accounts for sub-pixel rounding between offsetHeight (integer) and clientHeight.
          expect(root.offsetHeight).to.be.at.least(layout.clientHeight - 1);
        });
      });
    });

    describe("Invalid Value Rejection", function () {
      let layout;

      beforeEach(function () {
        return asyncRun(function () {
          layout = createRenderedLayout();
        });
      });

      afterEach(function () {
        cleanupLayout(layout);
      });



      it("should handle invalid layout values gracefully", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "vertical-scroll");
        }).then(function () {
          const root = layout.shadowRoot.querySelector(".root");
          const validDirection = window.getComputedStyle(root).flexDirection;
          expect(validDirection).to.equal("column");
          // Set invalid value - may reset to default or ignore.
          layout.setAttribute("layout-type", "diagonal-scroll");
          return asyncRun(function () {});
        }).then(function () {
          const root = layout.shadowRoot.querySelector(".root");
          const invalidDirection = window.getComputedStyle(root).flexDirection;
          // Component should handle gracefully (either keep valid or reset to default).
          expect(invalidDirection).to.be.oneOf(["row", "column"]);
        });
      });

      it("should handle invalid alignment values gracefully", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "horizontal-scroll");
          layout.setAttribute("horizontal-align", "center");
        }).then(function () {
          const root = layout.shadowRoot.querySelector(".root");
          const validAlignment = window.getComputedStyle(root).justifyContent;
          expect(validAlignment).to.be.equal("safe center");
          // Set invalid value - may reset to default or ignore.
          layout.setAttribute("horizontal-align", "middle");
          return asyncRun(function () {});
        }).then(function () {
          const root2 = layout.shadowRoot.querySelector(".root");
          const invalidAlignment = window.getComputedStyle(root2).justifyContent;
          // Component should handle gracefully (reset to default or keep valid).
          expect(invalidAlignment).to.be.a("string");
        });
      });
    });

    describe("Auto Layout CSS Variable Inheritance", function () {
      let layout;

      beforeEach(function () {
        layout = createRenderedLayout();
      });

      afterEach(function () {
        cleanupLayout(layout);
      });

      it("should apply CSS variables when layout-type is auto", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "auto");
          const root = layout.shadowRoot.querySelector(".root");
          const style = window.getComputedStyle(root);

          // Should use flex-direction from CSS variable or default.
          expect(style.flexDirection).to.exist;
        });
      });

      it("should inherit flex-direction from CSS variable", function () {
        return asyncRun(function () {
          layout.style.setProperty("--u-layout-flex-direction", "row");
          layout.setAttribute("layout-type", "auto");
        }).then(function () {
          const root = layout.shadowRoot.querySelector(".root");
          const style = window.getComputedStyle(root);
          expect(style.flexDirection).to.equal("row");
        });
      });

      it("should inherit flex-wrap from CSS variable", function () {
        return asyncRun(function () {
          layout.style.setProperty("--u-layout-flex-wrap", "wrap");
          layout.setAttribute("layout-type", "auto");
        }).then(function () {
          const root = layout.shadowRoot.querySelector(".root");
          const style = window.getComputedStyle(root);
          expect(style.flexWrap).to.equal("wrap");
        });
      });

      it("should inherit justify-content when horizontal-align is auto", function () {
        return asyncRun(function () {
          layout.style.setProperty("--u-layout-justify-content", "center");
          layout.setAttribute("layout-type", "auto");
          layout.setAttribute("horizontal-align", "auto");
        }).then(function () {
          const root = layout.shadowRoot.querySelector(".root");
          const style = window.getComputedStyle(root);
          expect(style.justifyContent).to.equal("center");
        });
      });

      it("should inherit align-items when vertical-align is auto", function () {
        return asyncRun(function () {
          layout.style.setProperty("--u-layout-align-items", "end");
          layout.setAttribute("layout-type", "auto");
          layout.setAttribute("vertical-align", "auto");
        }).then(function () {
          const root = layout.shadowRoot.querySelector(".root");
          const style = window.getComputedStyle(root);
          expect(style.alignItems).to.equal("end");
        });
      });

      it("should inherit overflow properties in auto layout", function () {
        return asyncRun(function () {
          layout.style.setProperty("--layout-horizontal-overflow", "auto");
          layout.style.setProperty("--layout-vertical-overflow", "scroll");
          layout.setAttribute("layout-type", "auto");
        }).then(function () {
          const root = layout.shadowRoot.querySelector(".root");
          const style = window.getComputedStyle(root);
          // auto layout does not apply overflow to .root; overflow is only on the host for explicit scroll types.
          expect(style.overflowX).to.not.equal("scroll");
          expect(style.overflowY).to.not.equal("scroll");
        });
      });

      it("should use fallback values when CSS variables are not set", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "auto");
          layout.setAttribute("horizontal-align", "auto");
          layout.setAttribute("vertical-align", "auto");
        }).then(function () {
          const root = layout.shadowRoot.querySelector(".root");
          const style = window.getComputedStyle(root);

          // Should use default values.
          expect(style.flexDirection).to.equal("column"); // Fallback.
          expect(style.justifyContent).to.equal("normal"); // Fallback.
          expect(style.alignItems).to.equal("normal"); // Fallback.
        });
      });

      it("should combine auto layout with explicit alignment", function () {
        return asyncRun(function () {
          layout.style.setProperty("--u-layout-flex-direction", "row");
          layout.style.setProperty("--u-layout-justify-content", "center");
          layout.setAttribute("layout-type", "auto");
        }).then(function () {
          const root = layout.shadowRoot.querySelector(".root");
          const style = window.getComputedStyle(root);

          expect(style.flexDirection).to.equal("row");
          expect(style.justifyContent).to.equal("center");
        });
      });
    });

    describe("Nested Layout Auto Layout Inheritance", function () {
      let parentLayout, childLayout, grandchildLayout;

      beforeEach(function () {
        parentLayout = createLayout();
        childLayout = createLayout();
        grandchildLayout = createLayout();
      });

      afterEach(function () {
        cleanupLayout(grandchildLayout);
        cleanupLayout(childLayout);
        cleanupLayout(parentLayout);
      });

      it("should inherit layout properties from parent layout", function () {
        return asyncRun(function () {
          // Parent defines the layout.
          parentLayout.setAttribute("layout-type", "horizontal-scroll");
          parentLayout.appendChild(childLayout);

          // Child uses auto to inherit.
          childLayout.setAttribute("layout-type", "auto");
        }).then(function () {
          const parentRoot = parentLayout.shadowRoot.querySelector(".root");
          const parentStyle = window.getComputedStyle(parentRoot);

          // Parent should set CSS variables that child can inherit.
          expect(parentStyle.getPropertyValue("--u-layout-flex-direction").trim()).to.equal("row");
        });
      });

      it("should support multi-level inheritance", function () {
        return asyncRun(function () {
          // Set up 3-level nesting.
          parentLayout.setAttribute("layout-type", "vertical-wrap");
          const parentRoot = parentLayout.shadowRoot.querySelector(".root");
          parentRoot.appendChild(childLayout);

          childLayout.setAttribute("layout-type", "auto");
          const childRoot = childLayout.shadowRoot.querySelector(".root");
          childRoot.appendChild(grandchildLayout);

          grandchildLayout.setAttribute("layout-type", "auto");
        }).then(function () {
          const parentRoot = parentLayout.shadowRoot.querySelector(".root");
          const parentStyle = window.getComputedStyle(parentRoot);
          expect(parentStyle.flexDirection).to.equal("column");
          expect(parentStyle.flexWrap).to.equal("wrap");
        });
      });

      it("should allow child to override inherited properties", function () {
        return asyncRun(function () {
          // Parent sets horizontal layout.
          parentLayout.setAttribute("layout-type", "horizontal-scroll");
          const parentRoot = parentLayout.shadowRoot.querySelector(".root");
          parentRoot.appendChild(childLayout);

          // Child starts with auto (inherits).
          childLayout.setAttribute("layout-type", "auto");
        }).then(function () {
          // Child overrides to vertical.
          childLayout.setAttribute("layout-type", "vertical-wrap");
          return asyncRun(function () {});
        }).then(function () {
          const childRoot = childLayout.shadowRoot.querySelector(".root");
          const childStyle = window.getComputedStyle(childRoot);

          expect(childStyle.flexDirection).to.equal("column");
        });
      });

      it("should inherit some properties and override others", function () {
        return asyncRun(function () {
          // Parent sets flex direction via layout.
          parentLayout.setAttribute("layout-type", "horizontal-scroll");
          parentLayout.setAttribute("horizontal-align", "center");
          const parentRoot = parentLayout.shadowRoot.querySelector(".root");
          parentRoot.appendChild(childLayout);

          // Child inherits layout but overrides alignment.
          childLayout.setAttribute("layout-type", "auto");
          childLayout.setAttribute("horizontal-align", "end");
        }).then(function () {
          const childRoot = childLayout.shadowRoot.querySelector(".root");
          const childStyle = window.getComputedStyle(childRoot);

          // Child inherits parent's CSS variable (safe center), explicit horizontal-align on auto layout does not override.
          expect(childStyle.justifyContent).to.equal("safe center");
        });
      });

      it("should handle parent with no layout attributes", function () {
        return asyncRun(function () {
          // Parent has no layout attributes.
          const parentRoot = parentLayout.shadowRoot.querySelector(".root");
          parentRoot.appendChild(childLayout);

          // Child uses auto.
          childLayout.setAttribute("layout-type", "auto");
        }).then(function () {
          const childRoot = childLayout.shadowRoot.querySelector(".root");
          const childStyle = window.getComputedStyle(childRoot);

          // Should use fallback values.
          expect(childStyle.flexDirection).to.equal("column");
        });
      });

      it("should properly inherit when parent uses CSS variables directly", function () {
        return asyncRun(function () {
          const parentRoot = parentLayout.shadowRoot.querySelector(".root");
          parentRoot.style.setProperty("--u-layout-flex-direction", "row");
          parentRoot.style.setProperty("--u-layout-justify-content", "space-between");
          parentRoot.appendChild(childLayout);

          childLayout.setAttribute("layout-type", "auto");
          childLayout.setAttribute("horizontal-align", "auto");
        }).then(function () {
          const childRoot = childLayout.shadowRoot.querySelector(".root");
          const childStyle = window.getComputedStyle(childRoot);

          expect(childStyle.flexDirection).to.equal("row");
          expect(childStyle.justifyContent).to.equal("space-between");
        });
      });

      it("should handle complex nested structure with mixed inheritance", function () {
        return asyncRun(function () {
          // Level 1: Parent with explicit layout.
          parentLayout.setAttribute("layout-type", "horizontal-wrap");
          parentLayout.setAttribute("horizontal-align", "start");
          parentLayout.setAttribute("vertical-align", "center");
          const parentRoot = parentLayout.shadowRoot.querySelector(".root");
          parentRoot.appendChild(childLayout);

          // Level 2: Child inherits layout, overrides main-axis.
          childLayout.setAttribute("layout-type", "auto");
          childLayout.setAttribute("horizontal-align", "space-between");
          childLayout.setAttribute("vertical-align", "auto");
          const childRoot = childLayout.shadowRoot.querySelector(".root");
          childRoot.appendChild(grandchildLayout);

          // Level 3: Grandchild fully auto.
          grandchildLayout.setAttribute("layout-type", "auto");
          grandchildLayout.setAttribute("horizontal-align", "auto");
          grandchildLayout.setAttribute("vertical-align", "auto");
        }).then(function () {
          const parentRoot = parentLayout.shadowRoot.querySelector(".root");
          const childRoot = childLayout.shadowRoot.querySelector(".root");

          const parentStyle = window.getComputedStyle(parentRoot);
          const childStyle = window.getComputedStyle(childRoot);

          // Parent should have explicit values.
          expect(parentStyle.flexDirection).to.equal("row");
          expect(parentStyle.justifyContent).to.equal("start");
          expect(parentStyle.alignItems).to.equal("safe center");

          // Child inherits parent's CSS variable (start from horizontal-wrap + horizontal-align=start).
          expect(childStyle.justifyContent).to.equal("start"); // Inherited from parent CSS variable.
        });
      });

      it("should work when parent also uses auto", function () {
        return asyncRun(function () {
          parentLayout.setAttribute("layout-type", "auto");
          const parentRoot = parentLayout.shadowRoot.querySelector(".root");
          parentRoot.appendChild(childLayout);

          childLayout.setAttribute("layout-type", "auto");
        }).then(function () {
          const childRoot = childLayout.shadowRoot.querySelector(".root");
          const childStyle = window.getComputedStyle(childRoot);

          // Both should use fallbacks.
          expect(childStyle.flexDirection).to.equal("column");
        });
      });

      it("should handle parent with mixed explicit and auto values", function () {
        return asyncRun(function () {
          parentLayout.setAttribute("layout-type", "horizontal-scroll");
          parentLayout.setAttribute("horizontal-align", "auto");
          const parentRoot = parentLayout.shadowRoot.querySelector(".root");
          parentRoot.appendChild(childLayout);

          childLayout.setAttribute("layout-type", "auto");
        }).then(function () {
          const parentRoot = parentLayout.shadowRoot.querySelector(".root");
          const parentStyle = window.getComputedStyle(parentRoot);

          // Explicit layout-type drives flex-direction; horizontal-align="auto" leaves justify-content unset.
          expect(parentStyle.flexDirection).to.equal("row");
        });
      });
    });

    describe("Auto Layout Edge Cases", function () {
      let layout;

      beforeEach(function () {
        layout = createLayout();
      });

      afterEach(function () {
        cleanupLayout(layout);
      });

      it("should handle switching from explicit to auto layout", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "vertical-scroll");
        }).then(function () {
          const root = layout.shadowRoot.querySelector(".root");
          const style = window.getComputedStyle(root);
          expect(style.flexDirection).to.equal("column");

          layout.setAttribute("layout-type", "auto");
          return asyncRun(function () {});
        }).then(function () {
          const root = layout.shadowRoot.querySelector(".root");
          const style = window.getComputedStyle(root);
          // Should now use CSS variable or fallback.
          expect(style.flexDirection).to.exist;
        });
      });

      it("should handle auto with no parent layout", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "auto");
          layout.setAttribute("horizontal-align", "auto");
          layout.setAttribute("vertical-align", "auto");
        }).then(function () {
          const root = layout.shadowRoot.querySelector(".root");
          const style = window.getComputedStyle(root);

          // Should use fallback values.
          expect(style.flexDirection).to.equal("column");
          expect(style.justifyContent).to.equal("normal");
          expect(style.alignItems).to.equal("normal");
        });
      });

      it("should handle auto with partial CSS variables", function () {
        return asyncRun(function () {
          layout.style.setProperty("--u-layout-flex-direction", "row");
          // Don't set other variables.
          layout.setAttribute("layout-type", "auto");
          layout.setAttribute("horizontal-align", "auto");
        }).then(function () {
          const root = layout.shadowRoot.querySelector(".root");
          const style = window.getComputedStyle(root);

          expect(style.flexDirection).to.equal("row"); // From variable.
          expect(style.justifyContent).to.equal("normal"); // Fallback.
        });
      });
    });

    describe("Auto Layout with Different Parent Configurations", function () {
      let parentLayout, childLayout;

      beforeEach(function () {
        parentLayout = createLayout();
        childLayout = createLayout();
      });

      afterEach(function () {
        cleanupLayout(childLayout);
        cleanupLayout(parentLayout);
      });

      it("should inherit from parent with vertical-scroll layout", function () {
        return asyncRun(function () {
          parentLayout.setAttribute("layout-type", "vertical-scroll");
        }).then(function () {
          const parentRoot = parentLayout.shadowRoot.querySelector(".root");
          const parentStyle = window.getComputedStyle(parentRoot);

          expect(parentStyle.getPropertyValue("--u-layout-flex-direction").trim()).to.equal("column");
          expect(parentStyle.getPropertyValue("--u-layout-flex-wrap").trim()).to.equal("nowrap");
        });
      });

      it("should inherit from parent with horizontal-wrap layout", function () {
        return asyncRun(function () {
          parentLayout.setAttribute("layout-type", "horizontal-wrap");
        }).then(function () {
          const parentRoot = parentLayout.shadowRoot.querySelector(".root");
          const parentStyle = window.getComputedStyle(parentRoot);

          expect(parentStyle.getPropertyValue("--u-layout-flex-direction").trim()).to.equal("row");
          expect(parentStyle.getPropertyValue("--u-layout-flex-wrap").trim()).to.equal("wrap");
        });
      });

      it("should inherit alignment from parent with explicit alignments", function () {
        return asyncRun(function () {
          parentLayout.setAttribute("layout-type", "horizontal-scroll");
          parentLayout.setAttribute("horizontal-align", "space-between");
          parentLayout.setAttribute("vertical-align", "stretch");
        }).then(function () {
          const parentRoot = parentLayout.shadowRoot.querySelector(".root");
          const parentStyle = window.getComputedStyle(parentRoot);

          expect(parentStyle.getPropertyValue("--u-layout-justify-content").trim()).to.equal("space-between");
          expect(parentStyle.getPropertyValue("--u-layout-align-items").trim()).to.equal("stretch");
        });
      });

      it("should work when parent also uses auto", function () {
        return asyncRun(function () {
          parentLayout.setAttribute("layout-type", "auto");
          const parentRoot = parentLayout.shadowRoot.querySelector(".root");
          parentRoot.appendChild(childLayout);

          childLayout.setAttribute("layout-type", "auto");
        }).then(function () {
          const childRoot = childLayout.shadowRoot.querySelector(".root");
          const childStyle = window.getComputedStyle(childRoot);

          // Both should use fallbacks.
          expect(childStyle.flexDirection).to.equal("column");
        });
      });

      it("should handle parent with mixed explicit and auto values", function () {
        return asyncRun(function () {
          parentLayout.setAttribute("layout-type", "horizontal-scroll");
          parentLayout.setAttribute("horizontal-align", "auto");
        }).then(function () {
          const parentRoot = parentLayout.shadowRoot.querySelector(".root");
          const parentStyle = window.getComputedStyle(parentRoot);

          // Explicit layout-type drives flex-direction; horizontal-align="auto" leaves justify-content unset.
          expect(parentStyle.flexDirection).to.equal("row");
        });
      });
    });

    describe("Multiple Attribute Interactions", function () {
      let layout;

      beforeEach(function () {
        layout = createRenderedLayout();
      });

      afterEach(function () {
        cleanupLayout(layout);
      });

      it("should apply layout and alignment together", function () {
        return asyncRun(function () {
          layout.setAttribute("layout-type", "horizontal-wrap");
          layout.setAttribute("horizontal-align", "space-between");
          layout.setAttribute("vertical-align", "center");
        }).then(function () {
          const root = layout.shadowRoot.querySelector(".root");
          const styles = window.getComputedStyle(root);

          expect(styles.flexDirection).to.equal("row");
          expect(styles.flexWrap).to.equal("wrap");
          expect(styles.justifyContent).to.equal("space-between");
          expect(styles.alignItems).to.equal("safe center");
        });
      });

      it("should handle all label-related attributes together", function () {
        return asyncRun(function () {
          layout.setAttribute("show-label", "true");
          const label = document.createElement("span");
          label.setAttribute("slot", "label");
          label.textContent = "Test Label";
          layout.appendChild(label);
          layout.setAttribute("label-position", "before");
          layout.setAttribute("label-size", "large");
          layout.setAttribute("label-align", "center");
        }).then(function () {
          const layoutStyles = window.getComputedStyle(layout);
          const labelElement = layout.shadowRoot.querySelector(".label");
          assert(labelElement, "Label element should exist when show-label is true.");
          const labelStyles = window.getComputedStyle(labelElement);

          expect(layoutStyles.flexDirection).to.equal("row");
          expect(labelStyles.alignSelf).to.equal("center");
        });
      });
    });

    describe("Stretch Behavior Tests", function () {
      let layout;
      beforeEach(function () {
        layout = createLayout();
      });

      afterEach(function () {
        cleanupLayout(layout);
      });

      describe("Vertical Layout with Stretch", function () {
        it("should apply flex-grow when vertical-scroll has vertical-align stretch", function () {
          return asyncRun(function () {
            layout.setAttribute("layout-type", "vertical-scroll");
            layout.setAttribute("vertical-align", "stretch");
          }).then(function () {
            const rootPart = layout.shadowRoot.querySelector(".root");
            const styles = window.getComputedStyle(rootPart);
            expect(styles.flexGrow).to.equal("1");
          });
        });

        it("should apply flex-grow when vertical-wrap has vertical-align stretch", function () {
          return asyncRun(function () {
            layout.setAttribute("layout-type", "vertical-wrap");
            layout.setAttribute("vertical-align", "stretch");
          }).then(function () {
            const rootPart = layout.shadowRoot.querySelector(".root");
            const styles = window.getComputedStyle(rootPart);
            expect(styles.flexGrow).to.equal("1");
          });
        });

        it("should apply align-items stretch when vertical-scroll has horizontal-align stretch", function () {
          return asyncRun(function () {
            layout.setAttribute("layout-type", "vertical-scroll");
            layout.setAttribute("horizontal-align", "stretch");
          }).then(function () {
            const rootPart = layout.shadowRoot.querySelector(".root");
            const styles = window.getComputedStyle(rootPart);
            expect(styles.alignItems).to.equal("stretch");
          });
        });

        it("should apply align-items stretch when vertical-wrap has horizontal-align stretch", function () {
          return asyncRun(function () {
            layout.setAttribute("layout-type", "vertical-wrap");
            layout.setAttribute("horizontal-align", "stretch");
          }).then(function () {
            const rootPart = layout.shadowRoot.querySelector(".root");
            const styles = window.getComputedStyle(rootPart);
            expect(styles.alignItems).to.equal("stretch");
          });
        });
      });

      describe("Horizontal Layout with Stretch", function () {
        it("should apply flex-grow when horizontal-scroll has horizontal-align stretch", function () {
          return asyncRun(function () {
            layout.setAttribute("layout-type", "horizontal-scroll");
            layout.setAttribute("horizontal-align", "stretch");
          }).then(function () {
            const rootPart = layout.shadowRoot.querySelector(".root");
            const styles = window.getComputedStyle(rootPart);
            expect(styles.flexGrow).to.equal("1");
          });
        });

        it("should apply flex-grow when horizontal-wrap has horizontal-align stretch", function () {
          return asyncRun(function () {
            layout.setAttribute("layout-type", "horizontal-wrap");
            layout.setAttribute("horizontal-align", "stretch");
          }).then(function () {
            const rootPart = layout.shadowRoot.querySelector(".root");
            const styles = window.getComputedStyle(rootPart);
            expect(styles.flexGrow).to.equal("1");
          });
        });

        it("should apply align-items stretch when horizontal-wrap has vertical-align stretch", function () {
          return asyncRun(function () {
            layout.setAttribute("layout-type", "horizontal-wrap");
            layout.setAttribute("vertical-align", "stretch");
          }).then(function () {
            const rootPart = layout.shadowRoot.querySelector(".root");
            const styles = window.getComputedStyle(rootPart);
            expect(styles.alignItems).to.equal("stretch");
          });
        });
      });

      describe("Stretch Behavior Dynamic Changes", function () {
        it("should update from non-stretch to stretch alignment", function () {
          return asyncRun(function () {
            layout.setAttribute("layout-type", "vertical-scroll");
            layout.setAttribute("vertical-align", "start");
          }).then(function () {
            const rootPart = layout.shadowRoot.querySelector(".root");
            let styles = window.getComputedStyle(rootPart);
            expect(styles.justifyContent).to.equal("start");

            return asyncRun(function () {
              layout.setAttribute("vertical-align", "stretch");
            });
          }).then(function () {
            const rootPart = layout.shadowRoot.querySelector(".root");
            const styles = window.getComputedStyle(rootPart);
            expect(styles.flexGrow).to.equal("1");
          });
        });

        it("should update from stretch to non-stretch alignment", function () {
          return asyncRun(function () {
            layout.setAttribute("layout-type", "horizontal-scroll");
            layout.setAttribute("horizontal-align", "stretch");
          }).then(function () {
            const rootPart = layout.shadowRoot.querySelector(".root");
            let styles = window.getComputedStyle(rootPart);
            expect(styles.flexGrow).to.equal("1");

            return asyncRun(function () {
              layout.setAttribute("horizontal-align", "center");
            });
          }).then(function () {
            const rootPart = layout.shadowRoot.querySelector(".root");
            const styles = window.getComputedStyle(rootPart);
            expect(styles.justifyContent).to.contain("center");
          });
        });

        it("should maintain stretch when changing layout direction", function () {
          return asyncRun(function () {
            layout.setAttribute("layout-type", "vertical-scroll");
            layout.setAttribute("vertical-align", "stretch");
          }).then(function () {
            const rootPart = layout.shadowRoot.querySelector(".root");
            let styles = window.getComputedStyle(rootPart);
            expect(styles.flexGrow).to.equal("1");

            return asyncRun(function () {
              layout.setAttribute("layout-type", "vertical-wrap");
            });
          }).then(function () {
            const rootPart = layout.shadowRoot.querySelector(".root");
            const styles = window.getComputedStyle(rootPart);
            expect(styles.flexGrow).to.equal("1");
          });
        });
      });

      describe("Stretch with Child Elements", function () {
        it("should stretch child elements with horizontal-align stretch in vertical layout", function () {
          return asyncRun(function () {
            layout.setAttribute("layout-type", "vertical-scroll");
            layout.setAttribute("horizontal-align", "stretch");

            const child1 = document.createElement("div");
            child1.textContent = "Child 1";
            child1.style.backgroundColor = "red";
            child1.style.height = "50px";

            const child2 = document.createElement("div");
            child2.textContent = "Child 2";
            child2.style.backgroundColor = "blue";
            child2.style.height = "50px";

            layout.appendChild(child1);
            layout.appendChild(child2);
          }).then(function () {
            const rootPart = layout.shadowRoot.querySelector(".root");
            const styles = window.getComputedStyle(rootPart);
            expect(styles.alignItems).to.equal("stretch");
          });
        });

        it("should stretch child elements with vertical-align stretch in horizontal layout", function () {
          return asyncRun(function () {
            layout.setAttribute("layout-type", "horizontal-scroll");
            layout.setAttribute("vertical-align", "stretch");
            layout.style.height = "200px";

            const child1 = document.createElement("div");
            child1.textContent = "Child 1";
            child1.style.backgroundColor = "green";
            child1.style.width = "100px";

            const child2 = document.createElement("div");
            child2.textContent = "Child 2";
            child2.style.backgroundColor = "yellow";
            child2.style.width = "100px";

            layout.appendChild(child1);
            layout.appendChild(child2);
          }).then(function () {
            const rootPart = layout.shadowRoot.querySelector(".root");
            const styles = window.getComputedStyle(rootPart);
            expect(styles.alignItems).to.equal("stretch");
          });
        });
      });

      describe("Stretch Behavior with Nested Layouts", function () {
        let parentLayout, childLayout;

        beforeEach(function () {
          parentLayout = createLayout();
          childLayout = document.createElement("uf-layout");
          parentLayout.appendChild(childLayout);
        });

        afterEach(function () {
          cleanupLayout(parentLayout);
        });

        it("should apply stretch from parent to child in auto layout", function () {
          return asyncRun(function () {
            parentLayout.setAttribute("layout-type", "vertical-scroll");
            parentLayout.setAttribute("horizontal-align", "stretch");
            childLayout.setAttribute("layout-type", "auto");
          }).then(function () {
            const parentRoot = parentLayout.shadowRoot.querySelector(".root");
            const parentStyles = window.getComputedStyle(parentRoot);
            expect(parentStyles.alignItems).to.equal("stretch");

            // Verify child inherits the stretch behavior in auto layout
            const childRoot = childLayout.shadowRoot.querySelector(".root");
            const childStyles = window.getComputedStyle(childRoot);
            // Auto layout should inherit alignment from parent
            expect(childStyles.alignItems).to.equal("stretch");
          });
        });

        it("should grow child with vertical stretch in parent vertical layout", function () {
          return asyncRun(function () {
            parentLayout.setAttribute("layout-type", "vertical-scroll");
            parentLayout.setAttribute("vertical-align", "stretch");
            parentLayout.style.height = "400px";
            childLayout.setAttribute("layout-type", "vertical-scroll");
          }).then(function () {
            const parentRoot = parentLayout.shadowRoot.querySelector(".root");
            const parentStyles = window.getComputedStyle(parentRoot);
            expect(parentStyles.flexGrow).to.equal("1");
          });
        });

        it("should apply independent stretch to nested layouts", function () {
          return asyncRun(function () {
            parentLayout.setAttribute("layout-type", "horizontal-scroll");
            parentLayout.setAttribute("vertical-align", "stretch");
            childLayout.setAttribute("layout-type", "vertical-scroll");
            childLayout.setAttribute("horizontal-align", "stretch");
          }).then(function () {
            const parentRoot = parentLayout.shadowRoot.querySelector(".root");
            const parentStyles = window.getComputedStyle(parentRoot);
            expect(parentStyles.alignItems).to.equal("stretch");

            const childRoot = childLayout.shadowRoot.querySelector(".root");
            const childStyles = window.getComputedStyle(childRoot);
            expect(childStyles.alignItems).to.equal("stretch");
          });
        });
      });

      describe("Stretch Edge Cases", function () {
        it("should not apply flex-grow when stretch is on wrong axis", function () {
          return asyncRun(function () {
            layout.setAttribute("layout-type", "vertical-scroll");
            layout.setAttribute("horizontal-align", "stretch");
          }).then(function () {
            const rootPart = layout.shadowRoot.querySelector(".root");
            const styles = window.getComputedStyle(rootPart);
            // horizontal-align stretch on vertical layout should set align-items, not drive main-axis grow.
            expect(styles.alignItems).to.equal("stretch");
            // u-jc-stretch is not set because stretch is on the cross axis, not the main axis.
            expect(layout.classList.contains("u-jc-stretch")).to.equal(false);
          });
        });

        it("should handle stretch with both alignments set", function () {
          return asyncRun(function () {
            layout.setAttribute("layout-type", "vertical-scroll");
            layout.setAttribute("vertical-align", "stretch");
            layout.setAttribute("horizontal-align", "stretch");
          }).then(function () {
            const rootPart = layout.shadowRoot.querySelector(".root");
            const styles = window.getComputedStyle(rootPart);
            // Both should apply.
            expect(styles.flexGrow).to.equal("1");
            expect(styles.alignItems).to.equal("stretch");
          });
        });

        it("should handle removing stretch attribute", function () {
          return asyncRun(function () {
            layout.setAttribute("layout-type", "horizontal-scroll");
            layout.setAttribute("horizontal-align", "stretch");
          }).then(function () {
            const rootPart = layout.shadowRoot.querySelector(".root");
            let styles = window.getComputedStyle(rootPart);
            expect(styles.flexGrow).to.equal("1");

            return asyncRun(function () {
              layout.removeAttribute("horizontal-align");
            });
          }).then(function () {
            // stretch removed — u-jc-stretch class is no longer on the host.
            expect(layout.classList.contains("u-jc-stretch")).to.equal(false);
          });
        });

        it("should handle layout type change with stretch", function () {
          return asyncRun(function () {
            layout.setAttribute("layout-type", "vertical-scroll");
            layout.setAttribute("vertical-align", "stretch");
          }).then(function () {
            const rootPart = layout.shadowRoot.querySelector(".root");
            let styles = window.getComputedStyle(rootPart);
            expect(styles.flexGrow).to.equal("1");

            return asyncRun(function () {
              // Change to horizontal layout with same stretch alignment.
              layout.setAttribute("layout-type", "horizontal-scroll");
              layout.setAttribute("vertical-align", "stretch");
              layout.removeAttribute("vertical-align");
              layout.setAttribute("vertical-align", "stretch");
            });
          }).then(function () {
            const rootPart = layout.shadowRoot.querySelector(".root");
            const styles = window.getComputedStyle(rootPart);
            // Now stretch should apply to align-items instead.
            expect(styles.alignItems).to.equal("stretch");
          });
        });
      });

      describe("Comprehensive Stretch Combinations", function () {
        describe("Vertical Layouts - All Stretch Combinations", function () {
          it("should handle vertical-scroll with only vertical-align stretch", function () {
            return asyncRun(function () {
              layout.setAttribute("layout-type", "vertical-scroll");
              layout.setAttribute("vertical-align", "stretch");
              layout.setAttribute("horizontal-align", "start");
            }).then(function () {
              const rootPart = layout.shadowRoot.querySelector(".root");
              const styles = window.getComputedStyle(rootPart);
              expect(styles.flexGrow).to.equal("1");
              expect(styles.alignItems).to.equal("start");
            });
          });

          it("should handle vertical-scroll with only horizontal-align stretch", function () {
            return asyncRun(function () {
              layout.setAttribute("layout-type", "vertical-scroll");
              layout.setAttribute("vertical-align", "start");
              layout.setAttribute("horizontal-align", "stretch");
            }).then(function () {
              const rootPart = layout.shadowRoot.querySelector(".root");
              const styles = window.getComputedStyle(rootPart);
              // Only verify that horizontal-align stretch sets align-items correctly.
              expect(styles.alignItems).to.equal("stretch");
            });
          });

          it("should handle vertical-wrap with only vertical-align stretch", function () {
            return asyncRun(function () {
              layout.setAttribute("layout-type", "vertical-wrap");
              layout.setAttribute("vertical-align", "stretch");
              layout.setAttribute("horizontal-align", "center");
            }).then(function () {
              const rootPart = layout.shadowRoot.querySelector(".root");
              const styles = window.getComputedStyle(rootPart);
              expect(styles.flexGrow).to.equal("1");
              expect(styles.alignItems).to.equal("safe center");
            });
          });

          it("should handle vertical-wrap with both alignments as stretch", function () {
            return asyncRun(function () {
              layout.setAttribute("layout-type", "vertical-wrap");
              layout.setAttribute("vertical-align", "stretch");
              layout.setAttribute("horizontal-align", "stretch");
            }).then(function () {
              const rootPart = layout.shadowRoot.querySelector(".root");
              const styles = window.getComputedStyle(rootPart);
              expect(styles.flexGrow).to.equal("1");
              expect(styles.alignItems).to.equal("stretch");
            });
          });
        });

        describe("Horizontal Layouts - All Stretch Combinations", function () {
          it("should handle horizontal-scroll with only horizontal-align stretch", function () {
            return asyncRun(function () {
              layout.setAttribute("layout-type", "horizontal-scroll");
              layout.setAttribute("horizontal-align", "stretch");
              layout.setAttribute("vertical-align", "start");
            }).then(function () {
              const rootPart = layout.shadowRoot.querySelector(".root");
              const styles = window.getComputedStyle(rootPart);
              expect(styles.flexGrow).to.equal("1");
              expect(styles.alignItems).to.equal("start");
            });
          });

          it("should handle horizontal-scroll with only vertical-align stretch", function () {
            return asyncRun(function () {
              layout.setAttribute("layout-type", "horizontal-scroll");
              layout.setAttribute("horizontal-align", "center");
              layout.setAttribute("vertical-align", "stretch");
            }).then(function () {
              const rootPart = layout.shadowRoot.querySelector(".root");
              const styles = window.getComputedStyle(rootPart);
              // Only verify that vertical-align stretch sets align-items correctly.
              expect(styles.alignItems).to.equal("stretch");
            });
          });

          it("should handle horizontal-wrap with both alignments as stretch", function () {
            return asyncRun(function () {
              layout.setAttribute("layout-type", "horizontal-wrap");
              layout.setAttribute("horizontal-align", "stretch");
              layout.setAttribute("vertical-align", "stretch");
            }).then(function () {
              const rootPart = layout.shadowRoot.querySelector(".root");
              const styles = window.getComputedStyle(rootPart);
              expect(styles.flexGrow).to.equal("1");
              expect(styles.alignItems).to.equal("stretch");
            });
          });

          it("should handle horizontal-wrap with only vertical-align stretch", function () {
            return asyncRun(function () {
              layout.setAttribute("layout-type", "horizontal-wrap");
              layout.setAttribute("horizontal-align", "end");
              layout.setAttribute("vertical-align", "stretch");
            }).then(function () {
              const rootPart = layout.shadowRoot.querySelector(".root");
              const styles = window.getComputedStyle(rootPart);
              // Only verify that vertical-align stretch sets align-items correctly.
              expect(styles.alignItems).to.equal("stretch");
            });
          });
        });

        describe("Auto Layout with Stretch Inheritance", function () {
          let parentLayout, childLayout;

          beforeEach(function () {
            parentLayout = createLayout();
            childLayout = document.createElement("uf-layout");
            parentLayout.appendChild(childLayout);
          });

          afterEach(function () {
            cleanupLayout(parentLayout);
          });

          it("should inherit vertical stretch from vertical parent to auto child", function () {
            return asyncRun(function () {
              parentLayout.setAttribute("layout-type", "vertical-scroll");
              parentLayout.setAttribute("vertical-align", "stretch");
              childLayout.setAttribute("layout-type", "auto");
            }).then(function () {
              const parentRoot = parentLayout.shadowRoot.querySelector(".root");
              const parentStyles = window.getComputedStyle(parentRoot);
              expect(parentStyles.flexGrow).to.equal("1");

              const childRoot = childLayout.shadowRoot.querySelector(".root");
              const childStyles = window.getComputedStyle(childRoot);
              // Auto should inherit flex-grow from parent.
              expect(childStyles.flexGrow).to.equal("1");
            });
          });

          it("should inherit horizontal stretch from vertical parent to auto child", function () {
            return asyncRun(function () {
              parentLayout.setAttribute("layout-type", "vertical-scroll");
              parentLayout.setAttribute("horizontal-align", "stretch");
              childLayout.setAttribute("layout-type", "auto");
            }).then(function () {
              const parentRoot = parentLayout.shadowRoot.querySelector(".root");
              const parentStyles = window.getComputedStyle(parentRoot);
              expect(parentStyles.alignItems).to.equal("stretch");

              const childRoot = childLayout.shadowRoot.querySelector(".root");
              const childStyles = window.getComputedStyle(childRoot);
              // Auto child should inherit stretch align-items.
              expect(childStyles.alignItems).to.equal("stretch");
            });
          });

          it("should inherit horizontal stretch from horizontal parent to auto child", function () {
            return asyncRun(function () {
              parentLayout.setAttribute("layout-type", "horizontal-scroll");
              parentLayout.setAttribute("horizontal-align", "stretch");
              childLayout.setAttribute("layout-type", "auto");
            }).then(function () {
              const parentRoot = parentLayout.shadowRoot.querySelector(".root");
              const parentStyles = window.getComputedStyle(parentRoot);
              expect(parentStyles.flexGrow).to.equal("1");

              const childRoot = childLayout.shadowRoot.querySelector(".root");
              const childStyles = window.getComputedStyle(childRoot);
              // Auto should inherit flex-grow.
              expect(childStyles.flexGrow).to.equal("1");
            });
          });

          it("should inherit vertical stretch from horizontal parent to auto child", function () {
            return asyncRun(function () {
              parentLayout.setAttribute("layout-type", "horizontal-wrap");
              parentLayout.setAttribute("vertical-align", "stretch");
              childLayout.setAttribute("layout-type", "auto");
            }).then(function () {
              const parentRoot = parentLayout.shadowRoot.querySelector(".root");
              const parentStyles = window.getComputedStyle(parentRoot);
              expect(parentStyles.alignItems).to.equal("stretch");

              const childRoot = childLayout.shadowRoot.querySelector(".root");
              const childStyles = window.getComputedStyle(childRoot);
              // Auto child should inherit stretch.
              expect(childStyles.alignItems).to.equal("stretch");
            });
          });

          it("should handle auto child with explicit stretch overriding parent", function () {
            return asyncRun(function () {
              parentLayout.setAttribute("layout-type", "vertical-scroll");
              parentLayout.setAttribute("vertical-align", "start");
              parentLayout.setAttribute("horizontal-align", "start");
              childLayout.setAttribute("layout-type", "auto");
              childLayout.setAttribute("horizontal-align", "stretch");
            }).then(function () {
              const parentRoot = parentLayout.shadowRoot.querySelector(".root");
              const parentStyles = window.getComputedStyle(parentRoot);
              expect(parentStyles.justifyContent).to.equal("start");
              expect(parentStyles.alignItems).to.equal("start");

              const childRoot = childLayout.shadowRoot.querySelector(".root");
              const childStyles = window.getComputedStyle(childRoot);
              // Child's explicit stretch should override parent's start.
              expect(childStyles.alignItems).to.equal("stretch");
            });
          });

          it("should handle nested auto layouts with stretch propagation", function () {
            let grandchildLayout;
            return asyncRun(function () {
              grandchildLayout = document.createElement("uf-layout");
              childLayout.appendChild(grandchildLayout);

              parentLayout.setAttribute("layout-type", "vertical-scroll");
              parentLayout.setAttribute("horizontal-align", "stretch");
              childLayout.setAttribute("layout-type", "auto");
              grandchildLayout.setAttribute("layout-type", "auto");
            }).then(function () {
              const parentRoot = parentLayout.shadowRoot.querySelector(".root");
              expect(window.getComputedStyle(parentRoot).alignItems).to.equal("stretch");

              const childRoot = childLayout.shadowRoot.querySelector(".root");
              expect(window.getComputedStyle(childRoot).alignItems).to.equal("stretch");

              const grandchildRoot = grandchildLayout.shadowRoot.querySelector(".root");
              expect(window.getComputedStyle(grandchildRoot).alignItems).to.equal("stretch");
            });
          });
        });

        describe("Stretch with Mixed Alignment Values", function () {
          it("should handle vertical-scroll with stretch and space-between", function () {
            return asyncRun(function () {
              layout.setAttribute("layout-type", "vertical-scroll");
              layout.setAttribute("vertical-align", "stretch");
              layout.setAttribute("horizontal-align", "space-between");
            }).then(function () {
              const rootPart = layout.shadowRoot.querySelector(".root");
              const styles = window.getComputedStyle(rootPart);
              expect(styles.flexGrow).to.equal("1");
              expect(styles.alignItems).to.equal("start"); // space-between defaults to start for cross-axis.
            });
          });

          it("should handle horizontal-scroll with stretch and space-evenly", function () {
            return asyncRun(function () {
              layout.setAttribute("layout-type", "horizontal-scroll");
              layout.setAttribute("horizontal-align", "stretch");
              layout.setAttribute("vertical-align", "space-evenly");
            }).then(function () {
              const rootPart = layout.shadowRoot.querySelector(".root");
              const styles = window.getComputedStyle(rootPart);
              expect(styles.flexGrow).to.equal("1");
              expect(styles.alignItems).to.equal("start"); // space-evenly defaults to start for cross-axis.
            });
          });

          it("should handle vertical-wrap with stretch and center", function () {
            return asyncRun(function () {
              layout.setAttribute("layout-type", "vertical-wrap");
              layout.setAttribute("vertical-align", "center");
              layout.setAttribute("horizontal-align", "stretch");
            }).then(function () {
              const rootPart = layout.shadowRoot.querySelector(".root");
              const styles = window.getComputedStyle(rootPart);
              // vertical-align center doesn't set flex-grow to 1.
              expect(styles.justifyContent).to.contain("center");
              expect(styles.alignItems).to.equal("stretch");
            });
          });

          it("should handle horizontal-wrap with stretch and end", function () {
            return asyncRun(function () {
              layout.setAttribute("layout-type", "horizontal-wrap");
              layout.setAttribute("horizontal-align", "end");
              layout.setAttribute("vertical-align", "stretch");
            }).then(function () {
              const rootPart = layout.shadowRoot.querySelector(".root");
              const styles = window.getComputedStyle(rootPart);
              // horizontal-align end doesn't set flex-grow to 1.
              expect(styles.justifyContent).to.contain("end");
              expect(styles.alignItems).to.equal("stretch");
            });
          });
        });

        describe("Stretch Reliability - State Transitions", function () {
          it("should maintain stretch after multiple attribute changes", function () {
            return asyncRun(function () {
              layout.setAttribute("layout-type", "vertical-scroll");
              layout.setAttribute("vertical-align", "stretch");
            }).then(function () {
              expect(window.getComputedStyle(layout.shadowRoot.querySelector(".root")).flexGrow).to.equal("1");

              return asyncRun(function () {
                layout.setAttribute("vertical-align", "start");
              });
            }).then(function () {
              // After switching to start, u-jc-stretch class is removed from the host.
              expect(layout.classList.contains("u-jc-stretch")).to.equal(false);

              return asyncRun(function () {
                layout.setAttribute("vertical-align", "stretch");
              });
            }).then(function () {
              expect(window.getComputedStyle(layout.shadowRoot.querySelector(".root")).flexGrow).to.equal("1");
            });
          });

          it("should correctly switch between different stretch axes", function () {
            return asyncRun(function () {
              layout.setAttribute("layout-type", "vertical-scroll");
              layout.setAttribute("vertical-align", "stretch");
            }).then(function () {
              const styles1 = window.getComputedStyle(layout.shadowRoot.querySelector(".root"));
              expect(styles1.flexGrow).to.equal("1");
              // vertical-align stretch doesn't affect alignItems (cross-axis property).

              return asyncRun(function () {
                layout.removeAttribute("vertical-align");
                layout.setAttribute("horizontal-align", "stretch");
              });
            }).then(function () {
              const styles2 = window.getComputedStyle(layout.shadowRoot.querySelector(".root"));
              // horizontal-align stretch on vertical layout sets align-items only; u-jc-stretch is not set.
              expect(layout.classList.contains("u-jc-stretch")).to.equal(false);
              expect(styles2.alignItems).to.equal("stretch");
            });
          });

          it("should handle rapid toggle between stretch and non-stretch", function () {
            return asyncRun(function () {
              layout.setAttribute("layout-type", "horizontal-scroll");
              layout.setAttribute("horizontal-align", "stretch");
            }).then(function () {
              expect(window.getComputedStyle(layout.shadowRoot.querySelector(".root")).flexGrow).to.equal("1");

              return asyncRun(function () {
                layout.setAttribute("horizontal-align", "center");
              });
            }).then(function () {
              expect(window.getComputedStyle(layout.shadowRoot.querySelector(".root")).justifyContent).to.contain("center");

              return asyncRun(function () {
                layout.setAttribute("horizontal-align", "stretch");
              });
            }).then(function () {
              expect(window.getComputedStyle(layout.shadowRoot.querySelector(".root")).flexGrow).to.equal("1");
            });
          });

          it("should maintain stretch when switching between scroll and wrap", function () {
            return asyncRun(function () {
              layout.setAttribute("layout-type", "vertical-scroll");
              layout.setAttribute("horizontal-align", "stretch");
            }).then(function () {
              expect(window.getComputedStyle(layout.shadowRoot.querySelector(".root")).alignItems).to.equal("stretch");

              return asyncRun(function () {
                layout.setAttribute("layout-type", "vertical-wrap");
              });
            }).then(function () {
              expect(window.getComputedStyle(layout.shadowRoot.querySelector(".root")).alignItems).to.equal("stretch");
            });
          });
        });

        describe("Stretch with Real Content", function () {
          it("should stretch children to full width in vertical layout", function () {
            return asyncRun(function () {
              layout.setAttribute("layout-type", "vertical-scroll");
              layout.setAttribute("horizontal-align", "stretch");
              layout.style.width = "400px";

              const child1 = document.createElement("div");
              child1.textContent = "Child 1";
              child1.style.backgroundColor = "red";
              child1.style.height = "50px";

              const child2 = document.createElement("div");
              child2.textContent = "Child 2";
              child2.style.backgroundColor = "blue";
              child2.style.height = "50px";

              layout.appendChild(child1);
              layout.appendChild(child2);
            }).then(function () {
              const rootPart = layout.shadowRoot.querySelector(".root");
              const styles = window.getComputedStyle(rootPart);
              expect(styles.alignItems).to.equal("stretch");
              expect(layout.children.length).to.equal(2);
            });
          });

          it("should stretch children to full height in horizontal layout", function () {
            return asyncRun(function () {
              layout.setAttribute("layout-type", "horizontal-scroll");
              layout.setAttribute("vertical-align", "stretch");
              layout.style.height = "300px";
              layout.style.width = "600px";

              const child1 = document.createElement("div");
              child1.textContent = "Column 1";
              child1.style.backgroundColor = "green";
              child1.style.width = "150px";

              const child2 = document.createElement("div");
              child2.textContent = "Column 2";
              child2.style.backgroundColor = "yellow";
              child2.style.width = "150px";

              layout.appendChild(child1);
              layout.appendChild(child2);
            }).then(function () {
              const rootPart = layout.shadowRoot.querySelector(".root");
              const styles = window.getComputedStyle(rootPart);
              expect(styles.alignItems).to.equal("stretch");
              expect(layout.children.length).to.equal(2);
            });
          });
        });
      });
    });

    // =========================================================================
    // Direction-Aware Alignment in Nested Layouts
    // =========================================================================
    // These tests verify that computed justify-content and align-items on nested
    // uf-layout elements reflect the direction-aware resolution logic:
    //   - The flex direction (horizontal vs vertical) is resolved from the nearest
    //     ancestor (or self) that has an explicit layout-type.
    //   - horizontal-align drives justify-content in a horizontal context and
    //     align-items in a vertical context; vertical-align is the opposite.
    //   - Each axis independently finds its nearest non-auto ancestor value.
    //   - Layouts are nested in the light DOM so closest() traversal works correctly.
    // =========================================================================
    describe("Direction-Aware Alignment in Nested Layouts", function () {
      let l1, l2, l3;

      beforeEach(function () {
        l1 = createLayout();
        l2 = createLayout();
        l3 = createLayout();
      });

      afterEach(function () {
        cleanupLayout(l3);
        cleanupLayout(l2);
        cleanupLayout(l1);
      });

      describe("Static: computed styles on initial render", function () {
        it("should map inherited h-align to main axis and own v-align to cross axis in a horizontal context", function () {
          return asyncRun(function () {
            l1.setAttribute("layout-type", "horizontal-scroll");
            l1.setAttribute("horizontal-align", "center");
            l1.setAttribute("vertical-align", "start");
            l1.appendChild(l2);
            l2.setAttribute("layout-type", "auto");
            l2.setAttribute("vertical-align", "stretch");
          }).then(function () {
            const root = l2.shadowRoot.querySelector(".root");
            const styles = window.getComputedStyle(root);
            // h-align nearest non-auto: l1 "center" → justifyContent = safe center.
            expect(styles.justifyContent).to.equal("safe center");
            // v-align nearest non-auto: l2 "stretch" (shadows l1 "start") → alignItems = stretch.
            expect(styles.alignItems).to.equal("stretch");
          });
        });

        it("should swap alignment axes when child has its own vertical direction inside a horizontal parent", function () {
          return asyncRun(function () {
            l1.setAttribute("layout-type", "horizontal-scroll");
            l1.setAttribute("horizontal-align", "end");
            l1.setAttribute("vertical-align", "center");
            l1.appendChild(l2);
            l2.setAttribute("layout-type", "vertical-scroll");
          }).then(function () {
            const root = l2.shadowRoot.querySelector(".root");
            const styles = window.getComputedStyle(root);
            // Vertical context: v-align (main) = l1 "center" → justifyContent = safe center.
            expect(styles.justifyContent).to.equal("safe center");
            // Vertical context: h-align (cross) = l1 "end" → alignItems = safe end.
            expect(styles.alignItems).to.equal("safe end");
          });
        });

        it("should use child's own h-align for the main axis and shadow the ancestor's value", function () {
          return asyncRun(function () {
            l1.setAttribute("layout-type", "horizontal-scroll");
            l1.setAttribute("horizontal-align", "center");
            l1.setAttribute("vertical-align", "start");
            l1.appendChild(l2);
            l2.setAttribute("layout-type", "auto");
            l2.setAttribute("horizontal-align", "end");
          }).then(function () {
            const root = l2.shadowRoot.querySelector(".root");
            const styles = window.getComputedStyle(root);
            // l2's own h-align "end" shadows l1's "center" → justifyContent = safe end.
            expect(styles.justifyContent).to.equal("safe end");
            // v-align nearest non-auto: l1 "start" → alignItems = start.
            expect(styles.alignItems).to.equal("start");
          });
        });

        it("should resolve three-level nesting using the nearest non-auto value independently per axis", function () {
          return asyncRun(function () {
            l1.setAttribute("layout-type", "horizontal-scroll");
            l1.setAttribute("horizontal-align", "center");
            l1.setAttribute("vertical-align", "start");
            l1.appendChild(l2);
            l2.setAttribute("layout-type", "auto");
            l2.setAttribute("vertical-align", "end");
            l2.appendChild(l3);
            l3.setAttribute("layout-type", "vertical-scroll");
            l3.setAttribute("horizontal-align", "center");
          }).then(function () {
            const l3Root = l3.shadowRoot.querySelector(".root");
            const l3Styles = window.getComputedStyle(l3Root);
            // v-align nearest non-auto: L2 "end" (closer than L1 "start") → justifyContent = safe end.
            expect(l3Styles.justifyContent).to.equal("safe end");
            // h-align nearest non-auto: L3 itself "center" → alignItems = safe center.
            expect(l3Styles.alignItems).to.equal("safe center");
          });
        });

        it("should fall back to start when a space-* value resolves to the cross axis", function () {
          return asyncRun(function () {
            l1.setAttribute("layout-type", "horizontal-scroll");
            l1.setAttribute("horizontal-align", "start");
            l1.setAttribute("vertical-align", "space-between");
            l1.appendChild(l2);
            l2.setAttribute("layout-type", "auto");
            l2.setAttribute("horizontal-align", "auto");
            l2.setAttribute("vertical-align", "auto");
          }).then(function () {
            // l1 itself: horizontal — v-align on cross axis → space-between falls back to start.
            const l1Root = l1.shadowRoot.querySelector(".root");
            expect(window.getComputedStyle(l1Root).justifyContent).to.equal("start");
            expect(window.getComputedStyle(l1Root).alignItems).to.equal("start");
            // l2 is fully auto — inherits CSS variables from l1, so it sees the same fallback.
            const l2Root = l2.shadowRoot.querySelector(".root");
            expect(window.getComputedStyle(l2Root).justifyContent).to.equal("start");
            expect(window.getComputedStyle(l2Root).alignItems).to.equal("start");
          });
        });
      });

      describe("Dynamic: computed styles after attribute updates", function () {
        it("should update child main-axis alignment when parent h-align changes", function () {
          // l2 has no h-align (inherits from l1) but has an explicit v-align (so it participates
          // in alignment resolution and will be re-synced when l1's h-align changes).
          return asyncRun(function () {
            l1.setAttribute("layout-type", "horizontal-scroll");
            l1.setAttribute("horizontal-align", "start");
            l1.appendChild(l2);
            l2.setAttribute("layout-type", "auto");
            l2.setAttribute("vertical-align", "stretch");
          }).then(function () {
            const root = l2.shadowRoot.querySelector(".root");
            // Initial: h-align from l1 "start" → justifyContent = start. Own v-align → alignItems = stretch.
            expect(window.getComputedStyle(root).justifyContent).to.equal("start");
            expect(window.getComputedStyle(root).alignItems).to.equal("stretch");
            l1.setAttribute("horizontal-align", "center");
            return asyncRun(function () {});
          }).then(function () {
            const root = l2.shadowRoot.querySelector(".root");
            // l2 re-synced: justifyContent updated to parent's new h-align. alignItems unchanged.
            expect(window.getComputedStyle(root).justifyContent).to.equal("safe center");
            expect(window.getComputedStyle(root).alignItems).to.equal("stretch");
          });
        });

        it("should remap child alignment axes when parent direction changes from horizontal to vertical", function () {
          // l2 has an explicit h-align. Initially (horizontal parent): h-align is the main axis.
          // After parent switches to vertical: h-align becomes the cross axis.
          return asyncRun(function () {
            l1.setAttribute("layout-type", "horizontal-scroll");
            l1.setAttribute("horizontal-align", "center");
            l1.setAttribute("vertical-align", "start");
            l1.appendChild(l2);
            l2.setAttribute("layout-type", "auto");
            l2.setAttribute("horizontal-align", "end");
          }).then(function () {
            const root = l2.shadowRoot.querySelector(".root");
            // Horizontal context: h-align (main) = l2 "end" → justifyContent = safe end.
            //                     v-align (cross) = l1 "start" → alignItems = start.
            expect(window.getComputedStyle(root).justifyContent).to.equal("safe end");
            expect(window.getComputedStyle(root).alignItems).to.equal("start");
            l1.setAttribute("layout-type", "vertical-scroll");
            return asyncRun(function () {});
          }).then(function () {
            const root = l2.shadowRoot.querySelector(".root");
            // Vertical context: v-align (main) = l1 "start" → justifyContent = start.
            //                   h-align (cross) = l2 "end" → alignItems = safe end.
            expect(window.getComputedStyle(root).justifyContent).to.equal("start");
            expect(window.getComputedStyle(root).alignItems).to.equal("safe end");
          });
        });

        it("should update child main-axis alignment when parent v-align changes and child has own vertical direction", function () {
          // l2 has its own vertical direction (so it is a candidate for v-align propagation)
          // but no explicit alignment attributes of its own.
          // v-align is the main axis in a vertical context → justifyContent reflects it.
          return asyncRun(function () {
            l1.setAttribute("layout-type", "horizontal-scroll");
            l1.setAttribute("vertical-align", "start");
            l1.appendChild(l2);
            l2.setAttribute("layout-type", "vertical-scroll");
          }).then(function () {
            const root = l2.shadowRoot.querySelector(".root");
            // Vertical context: v-align from l1 "start" → justifyContent = start.
            expect(window.getComputedStyle(root).justifyContent).to.equal("start");
            l1.setAttribute("vertical-align", "center");
            return asyncRun(function () {});
          }).then(function () {
            const root = l2.shadowRoot.querySelector(".root");
            // Re-synced: v-align updated on l1 → justifyContent = safe center.
            expect(window.getComputedStyle(root).justifyContent).to.equal("safe center");
          });
        });

        it("should stop propagating parent h-align changes once child defines its own h-align", function () {
          // Initially l2 inherits h-align from l1. Once l2 sets its own h-align it
          // becomes a boundary and is no longer affected by l1's h-align changes.
          return asyncRun(function () {
            l1.setAttribute("layout-type", "horizontal-scroll");
            l1.setAttribute("horizontal-align", "start");
            l1.appendChild(l2);
            l2.setAttribute("layout-type", "auto");
            l2.setAttribute("vertical-align", "stretch");
          }).then(function () {
            const root = l2.shadowRoot.querySelector(".root");
            // l2 inherits h-align from l1 "start" → justifyContent = start.
            expect(window.getComputedStyle(root).justifyContent).to.equal("start");
            // l2 now defines its own h-align, becoming a boundary.
            l2.setAttribute("horizontal-align", "end");
            return asyncRun(function () {});
          }).then(function () {
            const root = l2.shadowRoot.querySelector(".root");
            // l2's own h-align "end" now drives justifyContent.
            expect(window.getComputedStyle(root).justifyContent).to.equal("safe end");
            // Parent changes its h-align — l2 is now a boundary and must not be re-synced.
            l1.setAttribute("horizontal-align", "center");
            return asyncRun(function () {});
          }).then(function () {
            const root = l2.shadowRoot.querySelector(".root");
            // l2's justifyContent remains safe end — own value shadows parent's new "center".
            expect(window.getComputedStyle(root).justifyContent).to.equal("safe end");
          });
        });
      });
    });
  });
})();
