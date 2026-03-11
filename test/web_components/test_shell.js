/* global chai, umockup */
(function () {
  "use strict";

  const assert = chai.assert;
  const expect = chai.expect;
  const asyncRun = umockup.asyncRun;

  /**
   * Creates a new shell element and appends it to the document body.
   * @param {string} elementName - The name of the element to create (uf-shell, uf-header, uf-main, or uf-footer).
   * @returns {HTMLElement} The created element.
   */
  function createElement(elementName) {
    const element = document.createElement(elementName);
    document.body.appendChild(element);
    return element;
  }

  /**
   * Removes the element from the DOM.
   * @param {HTMLElement} element - The element to remove.
   */
  function cleanupElement(element) {
    element?.remove();
  }

  /**
   * Automated tests for the Shell web components (uf-shell, uf-header, uf-main, uf-footer).
   * These components extend FASTElement and provide flexible layout containers.
   */
  describe("Shell Web Component Tests", function () {
    describe("Component Registration", function () {
      it("should register uf-shell as a custom element", function () {
        const shellElement = window.customElements.get("uf-shell");
        assert(shellElement, "Shell web component 'uf-shell' should be registered.");
      });

      it("should register uf-header as a custom element", function () {
        const headerElement = window.customElements.get("uf-header");
        assert(headerElement, "Header web component 'uf-header' should be registered.");
      });

      it("should register uf-main as a custom element", function () {
        const mainElement = window.customElements.get("uf-main");
        assert(mainElement, "Main web component 'uf-main' should be registered.");
      });

      it("should register uf-footer as a custom element", function () {
        const footerElement = window.customElements.get("uf-footer");
        assert(footerElement, "Footer web component 'uf-footer' should be registered.");
      });

      it("should have Shell defined in the window context", function () {
        assert(window.Shell || window.customElements.get("uf-shell"), "Shell should be available.");
      });

      it("should have Header defined in the window context", function () {
        assert(window.Header || window.customElements.get("uf-header"), "Header should be available.");
      });

      it("should have Main defined in the window context", function () {
        assert(window.Main || window.customElements.get("uf-main"), "Main should be available.");
      });

      it("should have Footer defined in the window context", function () {
        assert(window.Footer || window.customElements.get("uf-footer"), "Footer should be available.");
      });
    });

    describe("Shell Component Creation", function () {
      let shell;

      beforeEach(function () {
        shell = createElement("uf-shell");
      });

      afterEach(function () {
        cleanupElement(shell);
      });

      it("should create a shell element", function () {
        assert(shell, "Shell element should be created.");
        expect(shell.tagName.toLowerCase()).to.equal("uf-shell");
      });

      it("should be an instance of HTMLElement", function () {
        expect(shell).to.be.instanceOf(HTMLElement);
      });

      it("should have FASTElement properties", function () {
        assert(shell.$fastController, "Shell should have $fastController from FASTElement.");
      });
    });

    describe("Header Component Creation", function () {
      let header;

      beforeEach(function () {
        header = createElement("uf-header");
      });

      afterEach(function () {
        cleanupElement(header);
      });

      it("should create a header element", function () {
        assert(header, "Header element should be created.");
        expect(header.tagName.toLowerCase()).to.equal("uf-header");
      });

      it("should be an instance of HTMLElement", function () {
        expect(header).to.be.instanceOf(HTMLElement);
      });

      it("should have FASTElement properties", function () {
        assert(header.$fastController, "Header should have $fastController from FASTElement.");
      });
    });

    describe("Main Component Creation", function () {
      let main;

      beforeEach(function () {
        main = createElement("uf-main");
      });

      afterEach(function () {
        cleanupElement(main);
      });

      it("should create a main element", function () {
        assert(main, "Main element should be created.");
        expect(main.tagName.toLowerCase()).to.equal("uf-main");
      });

      it("should be an instance of HTMLElement", function () {
        expect(main).to.be.instanceOf(HTMLElement);
      });

      it("should have FASTElement properties", function () {
        assert(main.$fastController, "Main should have $fastController from FASTElement.");
      });
    });

    describe("Footer Component Creation", function () {
      let footer;

      beforeEach(function () {
        footer = createElement("uf-footer");
      });

      afterEach(function () {
        cleanupElement(footer);
      });

      it("should create a footer element", function () {
        assert(footer, "Footer element should be created.");
        expect(footer.tagName.toLowerCase()).to.equal("uf-footer");
      });

      it("should be an instance of HTMLElement", function () {
        expect(footer).to.be.instanceOf(HTMLElement);
      });

      it("should have FASTElement properties", function () {
        assert(footer.$fastController, "Footer should have $fastController from FASTElement.");
      });
    });

    describe("Shell Component Structure", function () {
      let shell;

      beforeEach(function () {
        shell = createElement("uf-shell");
      });

      afterEach(function () {
        cleanupElement(shell);
      });

      it("should have a shadow root", function () {
        assert(shell.shadowRoot, "Shell should have a shadow root.");
      });

      it("should not contain a label section by default", function () {
        const shadowRoot = shell.shadowRoot;
        const labelPart = shadowRoot.querySelector("[part='label']");
        expect(labelPart).to.be.null;
      });

      it("should contain a label section when show-label is true", function () {
        return asyncRun(function () {
          shell.setAttribute("show-label", "true");
        }).then(function () {
          const shadowRoot = shell.shadowRoot;
          const labelPart = shadowRoot.querySelector("[part='label']");
          assert(labelPart, "Shell should have a label part when show-label='true'.");
          expect(labelPart.classList.contains("label")).to.be.true;
        });
      });

      it("should contain a root section", function () {
        const shadowRoot = shell.shadowRoot;
        const rootPart = shadowRoot.querySelector("[part='root']");
        assert(rootPart, "Shell should have a root part.");
        expect(rootPart.classList.contains("root")).to.be.true;
      });

      it("should not have a label slot by default", function () {
        const shadowRoot = shell.shadowRoot;
        const labelSlot = shadowRoot.querySelector("slot[name='label']");
        expect(labelSlot).to.be.null;
      });

      it("should have a slot for label content when show-label is true", function () {
        return asyncRun(function () {
          shell.setAttribute("show-label", "true");
        }).then(function () {
          const shadowRoot = shell.shadowRoot;
          const labelSlot = shadowRoot.querySelector("slot[name='label']");
          assert(labelSlot, "Shell should have a named slot for label when show-label='true'.");
        });
      });

      it("should have a default slot for main content", function () {
        const shadowRoot = shell.shadowRoot;
        const defaultSlot = shadowRoot.querySelector(".root slot:not([name])");
        assert(defaultSlot, "Shell should have a default slot for content.");
      });
    });

    describe("Header Component Structure", function () {
      let header;

      beforeEach(function () {
        header = createElement("uf-header");
      });

      afterEach(function () {
        cleanupElement(header);
      });

      it("should have a shadow root", function () {
        assert(header.shadowRoot, "Header should have a shadow root.");
      });

      it("should not contain a label section by default", function () {
        const shadowRoot = header.shadowRoot;
        const labelPart = shadowRoot.querySelector("[part='label']");
        expect(labelPart).to.be.null;
      });

      it("should contain a label section when show-label is true", function () {
        return asyncRun(function () {
          header.setAttribute("show-label", "true");
        }).then(function () {
          const shadowRoot = header.shadowRoot;
          const labelPart = shadowRoot.querySelector("[part='label']");
          assert(labelPart, "Header should have a label part when show-label='true'.");
        });
      });

      it("should contain a root section", function () {
        const shadowRoot = header.shadowRoot;
        const rootPart = shadowRoot.querySelector("[part='root']");
        assert(rootPart, "Header should have a root part.");
      });

      it("should have a default slot for content", function () {
        const shadowRoot = header.shadowRoot;
        const defaultSlot = shadowRoot.querySelector(".root slot:not([name])");
        assert(defaultSlot, "Header should have a default slot.");
      });
    });

    describe("Main Component Structure", function () {
      let main;

      beforeEach(function () {
        main = createElement("uf-main");
      });

      afterEach(function () {
        cleanupElement(main);
      });

      it("should have a shadow root", function () {
        assert(main.shadowRoot, "Main should have a shadow root.");
      });

      it("should not contain a label section by default", function () {
        const shadowRoot = main.shadowRoot;
        const labelPart = shadowRoot.querySelector("[part='label']");
        expect(labelPart).to.be.null;
      });

      it("should contain a label section when show-label is true", function () {
        return asyncRun(function () {
          main.setAttribute("show-label", "true");
        }).then(function () {
          const shadowRoot = main.shadowRoot;
          const labelPart = shadowRoot.querySelector("[part='label']");
          assert(labelPart, "Main should have a label part when show-label='true'.");
        });
      });

      it("should contain a root section", function () {
        const shadowRoot = main.shadowRoot;
        const rootPart = shadowRoot.querySelector("[part='root']");
        assert(rootPart, "Main should have a root part.");
      });

      it("should have a default slot for content", function () {
        const shadowRoot = main.shadowRoot;
        const defaultSlot = shadowRoot.querySelector(".root slot:not([name])");
        assert(defaultSlot, "Main should have a default slot.");
      });
    });

    describe("Footer Component Structure", function () {
      let footer;

      beforeEach(function () {
        footer = createElement("uf-footer");
      });

      afterEach(function () {
        cleanupElement(footer);
      });

      it("should have a shadow root", function () {
        assert(footer.shadowRoot, "Footer should have a shadow root.");
      });

      it("should not contain a label section by default", function () {
        const shadowRoot = footer.shadowRoot;
        const labelPart = shadowRoot.querySelector("[part='label']");
        expect(labelPart).to.be.null;
      });

      it("should contain a label section when show-label is true", function () {
        return asyncRun(function () {
          footer.setAttribute("show-label", "true");
        }).then(function () {
          const shadowRoot = footer.shadowRoot;
          const labelPart = shadowRoot.querySelector("[part='label']");
          assert(labelPart, "Footer should have a label part when show-label='true'.");
        });
      });

      it("should contain a root section", function () {
        const shadowRoot = footer.shadowRoot;
        const rootPart = shadowRoot.querySelector("[part='root']");
        assert(rootPart, "Footer should have a root part.");
      });

      it("should have a default slot for content", function () {
        const shadowRoot = footer.shadowRoot;
        const defaultSlot = shadowRoot.querySelector(".root slot:not([name])");
        assert(defaultSlot, "Footer should have a default slot.");
      });
    });

    describe("Slotted Content - Shell", function () {
      let shell;

      beforeEach(function () {
        shell = createElement("uf-shell");
      });

      afterEach(function () {
        cleanupElement(shell);
      });

      it("should display content in default slot", function () {
        const content = document.createElement("div");
        content.textContent = "Shell Content";
        shell.appendChild(content);

        const assignedNodes = shell.shadowRoot.querySelector(".root slot").assignedNodes();
        expect(assignedNodes.length).to.be.greaterThan(0);
      });

      it("should display label in named slot when show-label is true", function () {
        const label = document.createElement("label");
        label.setAttribute("slot", "label");
        label.textContent = "Shell Label";
        shell.appendChild(label);

        return asyncRun(function () {
          shell.setAttribute("show-label", "true");
        }).then(function () {
          const labelSlot = shell.shadowRoot.querySelector("slot[name='label']");
          const assignedNodes = labelSlot.assignedNodes();
          expect(assignedNodes.length).to.be.greaterThan(0);
        });
      });

      it("should support multiple elements in default slot", function () {
        const div1 = document.createElement("div");
        div1.textContent = "Content 1";
        const div2 = document.createElement("div");
        div2.textContent = "Content 2";

        shell.appendChild(div1);
        shell.appendChild(div2);

        const defaultSlot = shell.shadowRoot.querySelector(".root slot:not([name])");
        const assignedNodes = defaultSlot.assignedNodes();
        expect(assignedNodes.length).to.equal(2);
      });
    });

    describe("Slotted Content - Header", function () {
      let header;

      beforeEach(function () {
        header = createElement("uf-header");
      });

      afterEach(function () {
        cleanupElement(header);
      });

      it("should display content in default slot", function () {
        const content = document.createElement("div");
        content.textContent = "Header Content";
        header.appendChild(content);

        const defaultSlot = header.shadowRoot.querySelector(".root slot:not([name])");
        const assignedNodes = defaultSlot.assignedNodes();
        expect(assignedNodes.length).to.be.greaterThan(0);
      });

      it("should support multiple child elements", function () {
        const nav = document.createElement("nav");
        nav.textContent = "Navigation";
        const title = document.createElement("h1");
        title.textContent = "Page Title";

        header.appendChild(nav);
        header.appendChild(title);

        const defaultSlot = header.shadowRoot.querySelector(".root slot:not([name])");
        const assignedNodes = defaultSlot.assignedNodes();
        expect(assignedNodes.length).to.equal(2);
      });
    });

    describe("Slotted Content - Main", function () {
      let main;

      beforeEach(function () {
        main = createElement("uf-main");
      });

      afterEach(function () {
        cleanupElement(main);
      });

      it("should display content in default slot", function () {
        const content = document.createElement("article");
        content.textContent = "Main Content";
        main.appendChild(content);

        const defaultSlot = main.shadowRoot.querySelector(".root slot:not([name])");
        const assignedNodes = defaultSlot.assignedNodes();
        expect(assignedNodes.length).to.be.greaterThan(0);
      });

      it("should support complex nested structure", function () {
        const section = document.createElement("section");
        const article = document.createElement("article");
        article.textContent = "Article content";
        section.appendChild(article);
        main.appendChild(section);

        const defaultSlot = main.shadowRoot.querySelector(".root slot:not([name])");
        const assignedNodes = defaultSlot.assignedNodes();
        expect(assignedNodes.length).to.be.greaterThan(0);
      });
    });

    describe("Slotted Content - Footer", function () {
      let footer;

      beforeEach(function () {
        footer = createElement("uf-footer");
      });

      afterEach(function () {
        cleanupElement(footer);
      });

      it("should display content in default slot", function () {
        const content = document.createElement("div");
        content.textContent = "Footer Content";
        footer.appendChild(content);

        const defaultSlot = footer.shadowRoot.querySelector(".root slot:not([name])");
        const assignedNodes = defaultSlot.assignedNodes();
        expect(assignedNodes.length).to.be.greaterThan(0);
      });

      it("should support copyright and links", function () {
        const copyright = document.createElement("p");
        copyright.textContent = "© 2026 Company";
        const links = document.createElement("nav");
        links.textContent = "Footer Links";

        footer.appendChild(copyright);
        footer.appendChild(links);

        const defaultSlot = footer.shadowRoot.querySelector(".root slot:not([name])");
        const assignedNodes = defaultSlot.assignedNodes();
        expect(assignedNodes.length).to.equal(2);
      });
    });

    describe("Component Template", function () {
      let shell;

      beforeEach(function () {
        shell = createElement("uf-shell");
      });

      afterEach(function () {
        cleanupElement(shell);
      });

      it("should render label section before root section when show-label is true", function () {
        return asyncRun(function () {
          shell.setAttribute("show-label", "true");
        }).then(function () {
          const shadowRoot = shell.shadowRoot;
          const labelPart = shadowRoot.querySelector("[part='label']");
          const rootPart = shadowRoot.querySelector("[part='root']");

          assert(labelPart, "Label part should exist.");
          assert(rootPart, "Root part should exist.");

          const elements = Array.from(shadowRoot.children);
          const labelIndex = elements.indexOf(labelPart);
          const rootIndex = elements.indexOf(rootPart);

          expect(labelIndex).to.be.lessThan(rootIndex, "Label should appear before root in the template.");
        });
      });
    });

    describe("Dynamic Content Updates - Shell", function () {
      let shell;

      beforeEach(function () {
        shell = createElement("uf-shell");
      });

      afterEach(function () {
        cleanupElement(shell);
      });

      it("should update when adding new content", function () {
        const newContent = document.createElement("p");
        newContent.textContent = "Dynamic Content";
        shell.appendChild(newContent);

        return asyncRun(function () {}).then(function () {
          const slot = shell.shadowRoot.querySelector(".root slot:not([name])");
          const assigned = slot.assignedNodes();
          expect(assigned.length).to.be.greaterThan(0);
        });
      });

      it("should update when removing content", function () {
        const content = document.createElement("div");
        content.id = "removable";
        shell.appendChild(content);

        return asyncRun(function () {
          shell.removeChild(content);
        }).then(function () {
          const slot = shell.shadowRoot.querySelector(".root slot:not([name])");
          const assigned = slot.assignedNodes().filter((node) => node.nodeType === Node.ELEMENT_NODE);
          expect(assigned.some((node) => node.id === "removable")).to.be.false;
        });
      });

      it("should handle clearing all content", function () {
        shell.innerHTML = "<div>Test 1</div><div>Test 2</div>";

        return asyncRun(function () {
          shell.innerHTML = "";
        }).then(function () {
          const slot = shell.shadowRoot.querySelector(".root slot:not([name])");
          const assigned = slot.assignedNodes().filter((node) => node.nodeType === Node.ELEMENT_NODE);
          expect(assigned.length).to.equal(0);
        });
      });
    });

    describe("Dynamic Content Updates - Header", function () {
      let header;

      beforeEach(function () {
        header = createElement("uf-header");
      });

      afterEach(function () {
        cleanupElement(header);
      });

      it("should update when content changes", function () {
        const nav = document.createElement("nav");
        nav.textContent = "Nav";
        header.appendChild(nav);

        return asyncRun(function () {
          const newNav = document.createElement("nav");
          newNav.textContent = "Updated Nav";
          header.replaceChild(newNav, nav);
        }).then(function () {
          const slot = header.shadowRoot.querySelector(".root slot:not([name])");
          const assigned = slot.assignedNodes();
          expect(assigned.length).to.be.greaterThan(0);
        });
      });
    });

    describe("Component Definition", function () {
      it("should have Shell registered with correct element name", function () {
        const ShellClass = window.customElements.get("uf-shell");
        assert(ShellClass, "Shell class should exist.");
        // Create instance to verify it's the correct element.
        const shell = document.createElement("uf-shell");
        expect(shell.tagName.toLowerCase()).to.equal("uf-shell");
      });

      it("should have Header registered with correct element name", function () {
        const HeaderClass = window.customElements.get("uf-header");
        assert(HeaderClass, "Header class should exist.");
        const header = document.createElement("uf-header");
        expect(header.tagName.toLowerCase()).to.equal("uf-header");
      });

      it("should have Main registered with correct element name", function () {
        const MainClass = window.customElements.get("uf-main");
        assert(MainClass, "Main class should exist.");
        const main = document.createElement("uf-main");
        expect(main.tagName.toLowerCase()).to.equal("uf-main");
      });

      it("should have Footer registered with correct element name", function () {
        const FooterClass = window.customElements.get("uf-footer");
        assert(FooterClass, "Footer class should exist.");
        const footer = document.createElement("uf-footer");
        expect(footer.tagName.toLowerCase()).to.equal("uf-footer");
      });
    });

    describe("Integration Tests - Nested Structure", function () {
      let shell;

      beforeEach(function () {
        shell = createElement("uf-shell");
      });

      afterEach(function () {
        cleanupElement(shell);
      });

      it("should work with header, main, and footer inside shell", function () {
        const header = document.createElement("uf-header");
        header.textContent = "Header Content";

        const main = document.createElement("uf-main");
        main.textContent = "Main Content";

        const footer = document.createElement("uf-footer");
        footer.textContent = "Footer Content";

        shell.appendChild(header);
        shell.appendChild(main);
        shell.appendChild(footer);

        assert(shell.querySelector("uf-header"), "Header should be present in shell.");
        assert(shell.querySelector("uf-main"), "Main should be present in shell.");
        assert(shell.querySelector("uf-footer"), "Footer should be present in shell.");
      });

      it("should support multiple levels of nesting", function () {
        const header = document.createElement("uf-header");
        const headerContent = document.createElement("div");
        headerContent.textContent = "Nested Header Content";
        header.appendChild(headerContent);

        shell.appendChild(header);

        assert(shell.querySelector("uf-header div"), "Nested content should be present.");
      });
    });

    describe("Integration Tests - Multiple Instances", function () {
      it("should support multiple shell instances", function () {
        const shell1 = createElement("uf-shell");
        const shell2 = createElement("uf-shell");
        const shell3 = createElement("uf-shell");

        return asyncRun(function () {}).then(function () {
          assert(shell1.shadowRoot, "First shell should have shadow root.");
          assert(shell2.shadowRoot, "Second shell should have shadow root.");
          assert(shell3.shadowRoot, "Third shell should have shadow root.");

          cleanupElement(shell1);
          cleanupElement(shell2);
          cleanupElement(shell3);
        });
      });

      it("should support multiple header instances", function () {
        const header1 = createElement("uf-header");
        const header2 = createElement("uf-header");

        return asyncRun(function () {}).then(function () {
          assert(header1.shadowRoot, "First header should have shadow root.");
          assert(header2.shadowRoot, "Second header should have shadow root.");

          cleanupElement(header1);
          cleanupElement(header2);
        });
      });

      it("should support multiple main instances", function () {
        const main1 = createElement("uf-main");
        const main2 = createElement("uf-main");

        return asyncRun(function () {}).then(function () {
          assert(main1.shadowRoot, "First main should have shadow root.");
          assert(main2.shadowRoot, "Second main should have shadow root.");

          cleanupElement(main1);
          cleanupElement(main2);
        });
      });

      it("should support multiple footer instances", function () {
        const footer1 = createElement("uf-footer");
        const footer2 = createElement("uf-footer");

        return asyncRun(function () {}).then(function () {
          assert(footer1.shadowRoot, "First footer should have shadow root.");
          assert(footer2.shadowRoot, "Second footer should have shadow root.");

          cleanupElement(footer1);
          cleanupElement(footer2);
        });
      });
    });

    describe("Error Handling", function () {
      let shell;

      beforeEach(function () {
        shell = createElement("uf-shell");
      });

      afterEach(function () {
        cleanupElement(shell);
      });

      it("should handle invalid slot names gracefully", function () {
        const element = document.createElement("div");
        element.setAttribute("slot", "non-existent-slot");
        element.textContent = "Content";

        expect(() => shell.appendChild(element)).to.not.throw();
      });

      it("should handle rapid content changes", function () {
        for (let i = 0; i < 10; i++) {
          const div = document.createElement("div");
          div.textContent = `Item ${i}`;
          shell.appendChild(div);
        }

        return asyncRun(function () {}).then(function () {
          const slot = shell.shadowRoot.querySelector(".root slot:not([name])");
          const assigned = slot.assignedNodes().filter((node) => node.nodeType === Node.ELEMENT_NODE);
          expect(assigned.length).to.equal(10);
        });
      });

      it("should handle empty shell", function () {
        expect(() => {
          const emptyShell = createElement("uf-shell");
          cleanupElement(emptyShell);
        }).to.not.throw();
      });
    });

    describe("Component Styling", function () {
      let shell;

      beforeEach(function () {
        shell = createElement("uf-shell");
      });

      afterEach(function () {
        cleanupElement(shell);
      });

      it("should have computed styles", function () {
        const styles = window.getComputedStyle(shell);
        assert(styles, "Shell should have computed styles.");
      });

      it("should have display style", function () {
        const styles = window.getComputedStyle(shell);
        assert(styles.display, "Shell should have a display style.");
      });
    });

    describe("Cloning Support", function () {
      let shell;

      beforeEach(function () {
        shell = createElement("uf-shell");
      });

      afterEach(function () {
        cleanupElement(shell);
      });

      it("should maintain functionality when cloned", function () {
        const header = document.createElement("uf-header");
        header.textContent = "Original Header";
        shell.appendChild(header);

        const clonedShell = shell.cloneNode(true);
        document.body.appendChild(clonedShell);

        assert(clonedShell.querySelector("uf-header"), "Cloned shell should have header.");
        expect(clonedShell.querySelector("uf-header").textContent).to.equal("Original Header");

        document.body.removeChild(clonedShell);
      });
    });

    describe("Attribute Support", function () {
      let header;

      beforeEach(function () {
        header = createElement("uf-header");
      });

      afterEach(function () {
        cleanupElement(header);
      });

      it("should support custom attributes", function () {
        header.setAttribute("role", "banner");
        expect(header.getAttribute("role")).to.equal("banner");
      });

      it("should support data attributes", function () {
        header.setAttribute("data-section", "top");
        expect(header.getAttribute("data-section")).to.equal("top");
      });

      it("should dynamically update attributes", function () {
        header.setAttribute("aria-label", "Page Header");

        return asyncRun(function () {
          header.setAttribute("aria-label", "Updated Header");
        }).then(function () {
          expect(header.getAttribute("aria-label")).to.equal("Updated Header");
        });
      });
    });

    describe("Accessibility", function () {
      it("should allow role attribute on shell", function () {
        const shell = createElement("uf-shell");
        shell.setAttribute("role", "main");
        expect(shell.getAttribute("role")).to.equal("main");
        cleanupElement(shell);
      });

      it("should allow role attribute on header", function () {
        const header = createElement("uf-header");
        header.setAttribute("role", "banner");
        expect(header.getAttribute("role")).to.equal("banner");
        cleanupElement(header);
      });

      it("should allow role attribute on main", function () {
        const main = createElement("uf-main");
        main.setAttribute("role", "main");
        expect(main.getAttribute("role")).to.equal("main");
        cleanupElement(main);
      });

      it("should allow role attribute on footer", function () {
        const footer = createElement("uf-footer");
        footer.setAttribute("role", "contentinfo");
        expect(footer.getAttribute("role")).to.equal("contentinfo");
        cleanupElement(footer);
      });

      it("should support aria-label attributes", function () {
        const header = createElement("uf-header");
        header.setAttribute("aria-label", "Site Header");
        expect(header.getAttribute("aria-label")).to.equal("Site Header");
        cleanupElement(header);
      });
    });

    describe("Real-world Use Cases", function () {
      it("should create a complete page structure", function () {
        const shell = createElement("uf-shell");

        const header = document.createElement("uf-header");
        const nav = document.createElement("nav");
        nav.textContent = "Navigation";
        header.appendChild(nav);

        const main = document.createElement("uf-main");
        const article = document.createElement("article");
        article.textContent = "Main Content";
        main.appendChild(article);

        const footer = document.createElement("uf-footer");
        const copyright = document.createElement("p");
        copyright.textContent = "© 2026";
        footer.appendChild(copyright);

        shell.appendChild(header);
        shell.appendChild(main);
        shell.appendChild(footer);

        return asyncRun(function () {}).then(function () {
          assert(shell.querySelector("uf-header nav"), "Navigation should be in header.");
          assert(shell.querySelector("uf-main article"), "Article should be in main.");
          assert(shell.querySelector("uf-footer p"), "Copyright should be in footer.");

          cleanupElement(shell);
        });
      });

      it("should work with form layouts", function () {
        const main = createElement("uf-main");

        const form = document.createElement("form");
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Enter text";

        const button = document.createElement("button");
        button.textContent = "Submit";

        form.appendChild(input);
        form.appendChild(button);
        main.appendChild(form);

        assert(main.querySelector("form"), "Form should be present.");
        assert(main.querySelector("input"), "Input should be present.");
        assert(main.querySelector("button"), "Button should be present.");

        cleanupElement(main);
      });
    });
  });
})();
