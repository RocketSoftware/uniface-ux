// !!! This test currently does not use the test framework !!!

(function () {
  'use strict';

  /**
   * Default timeout for waiting for DOM rendering (in milliseconds)
   */
  const defaultAsyncTimeout = 100; //ms

  const expect = chai.expect;
  const toolbar = UNIFACE.ClassRegistry.get("UX.Toolbar");
  let toolbarWidget;
  let widgetElement;
  let parentNode = document.getElementById("widget-container");
  let placeholderEl = document.createElement("span");
  let node;

  const MOCK_EMPTY_DEFINITION = { properties: {} };

  const MOCK_START_CONTROLS_ONLY_DEFINITION = {
    properties: {
      "controls-start": "first",
      "first:widget-class": "UX.Button"
    }
  };

  const MOCK_EMPTY_START_CONTROLS_DEFINITION = {
    properties: {
      "controls-start": "",
      "controls-center": "size",
      "controls-end": "goto",
      "goto:widget-class": "UX.NumberField",
      "size:widget-class": "UX.Select"
    }
  };

  const MOCK_UNDEFINED_START_CONTROLS_DEFINITION = {
    properties: {
      "controls-center": "goto",
      "controls-end": "size",
      "goto:widget-class": "UX.NumberField",
      "size:widget-class": "UX.Select"
    }
  };

  const MOCK_EMPTY_CENTER_CONTROLS_DEFINITION = {
    properties: {
      "controls-start": "info",
      "controls-center": "",
      "controls-end": "size",
      "info:widget-class": "UX.PlainText",
      "size:widget-class": "UX.Select"
    }
  };

  const MOCK_UNDEFINED_CENTER_CONTROLS_DEFINITION = {
    properties: {
      "controls-start": "info",
      "controls-end": "size",
      "info:widget-class": "UX.PlainText",
      "size:widget-class": "UX.Select"
    }
  };

  const MOCK_EMPTY_END_CONTROLS_DEFINITION = {
    properties: {
      "controls-start": "info",
      "controls-center": "goto",
      "controls-end": "",
      "info:widget-class": "UX.PlainText",
      "goto:widget-class": "UX.NumberField"
    }
  };

  const MOCK_UNDEFINED_END_CONTROLS_DEFINITION = {
    properties: {
      "controls-start": "info",
      "controls-center": "goto",
      "info:widget-class": "UX.PlainText",
      "goto:widget-class": "UX.NumberField"
    }
  };

  const MOCK_START_CENTER_END_CONTROLS_DEFINITION = {
    properties: {
      "controls-start": "info",
      "controls-center": "goto",
      "controls-end": "sizefirst",
      "info:widget-class": "UX.PlainText",
      "goto:widget-class": "UX.NumberField",
      "size:widget-class": "UX.Select",
      "first:widget-class": "UX.Button"
    }
  };

  const MOCK_EMPTY_START_CENTER_END_CONTROLS_DEFINITION = {
    properties: {
      "controls-start": "",
      "controls-center": "",
      "controls-end": "",
      "info:widget-class": "UX.PlainText",
      "goto:widget-class": "UX.NumberField",
      "size:widget-class": "UX.Select"
    }
  };

  const MOCK_UNDEFINED_START_CENTER_END_CONTROLS_DEFINITION = {
    properties: {
      "info:widget-class": "UX.PlainText",
      "goto:widget-class": "UX.NumberField",
      "size:widget-class": "UX.Select"
    }
  };

  const MOCK_CONTROLS_WITHOUT_ANY_PROPERTIES_DEFINITION = {
    properties: {
      "controls-start": "first",
      "controls-center": "size",
      "controls-end": "goto",
      "last:widget-class": "UX.Button",
      "last:value": "Last"
    }
  };

  const MOCK_CONTROLS_PROPERTIES_DEFINITION = {
    properties: {
      "controls-start": "size",
      "controls-end": "last",
      "last:widget-class": "UX.Button",
      "size:widget-class": "UX.Select",
      "last:overflow-behavior": "none",
      "size:overflow-behavior": "hide",
      "last:overflow-index": "1",
      "size:overflow-index": "2",
      "last:value": "a",
      "size:value": "1",
      "size:valrep": "1=a10=1025=2550=50100=100",
      "size:label-text": "Label",
      "last:html:appearance": "accent",
      "last:style:padding": "10px",
      "last:class:classA": "true"
    }
  };

  const MOCK_TOOLBAR_DATA = {
    uniface: {
      "label-text": "Label"
    },
    html: {
      orientation: "vertical"
    },
    style: {
      padding: "10px"
    },
    class: {
      classC: "true"
    }
  };

  const MOCK_TOOLBAR_CONTROLS_DATA = {
    uniface: {
      "size:html:disabled": "true",
      "goto:html:hide-step": "true",
      "size:style:min-width": "100px",
      "goto:style:margin": "5px",
      "size:class:classA": "true",
      "goto:class:classB": "true",
      "size:label-text": "Label",
      "first:html:appearance": "accent",
      "first:value": "Go",
      "size:valrep": "1=a10=1025=2550=50100=100"
    }
  };

  const MOCK_CONTROLS = {
    last: {
      "overflow-behavior": "none",
      "overflow-index": "1",
      "widget-class": "UX.Button",
      "widget-cleanup-properties": {},
      "widget-properties": {
        classes: {
          classA: "true"
        },
        html: {
          appearance: "accent"
        },
        style: {
          padding: "10px"
        },
        value: "a"
      }
    },
    size: {
      "widget-properties": {
        uniface: {
          "label-text": "Label"
        },
        valrep: [
          {
            value: "1",
            representation: "a"
          },
          {
            value: "10",
            representation: "10"
          },
          {
            value: "25",
            representation: "25"
          },
          {
            value: "50",
            representation: "50"
          },
          {
            value: "100",
            representation: "100"
          }
        ],
        value: "1"
      },
      "widget-cleanup-properties": {},
      "widget-class": "UX.Select",
      "overflow-behavior": "hide",
      "overflow-index": "2"
    }
  };

  const MOCK_TOOLBAR_DEFAULT_PROPERTIES = {
    html: {
      "aria-orientation": "horizontal",
      orientation: "horizontal",
      role: "toolbar"
    },
    classes: {
      "u-toolbar": true
    },
    uniface: {
      "label-text": ""
    }
  };

  describe("processLayout()", function () {
    it("should have correct tagName when the placeholder is 'fluent-toolbar", function () {
      let placeholder = document.createElement("fluent-toolbar");
      widgetElement = toolbar.processLayout(placeholder, MOCK_EMPTY_DEFINITION);

      expect(widgetElement).to.have.tagName("fluent-toolbar");
      expect(widgetElement).equal(placeholder);
    });

    it("should have correct tagName when the placeholder is not 'fluent-toolbar", function () {
      widgetElement = toolbar.processLayout(placeholderEl, MOCK_EMPTY_DEFINITION);

      expect(widgetElement).to.have.tagName("fluent-toolbar");
      expect(widgetElement).not.equal(placeholderEl);
    });

    describe("when the definition.properties is {}", function () {
      it("should not contain start, center and end controls", function () {
        widgetElement = toolbar.processLayout(placeholderEl, MOCK_EMPTY_DEFINITION);

        expect(widgetElement.querySelector("[slot='start']")).to.be.null;
        expect(widgetElement.querySelector("[slot='']")).to.be.null;
        expect(widgetElement.querySelector("[slot='end']")).to.be.null;
      });
    });

    describe("when the definition.properties is not {}", function () {
      describe("if controls-start is undefined or empty", function () {
        it("should not contain start controls if controls-start is empty", function () {
          widgetElement = toolbar.processLayout(placeholderEl, MOCK_EMPTY_START_CONTROLS_DEFINITION);

          expect(widgetElement.querySelector("[slot='start']")).to.be.null;
        });

        it("should not contain start controls if controls-start is undefined", function () {
          widgetElement = toolbar.processLayout(placeholderEl, MOCK_UNDEFINED_START_CONTROLS_DEFINITION);

          expect(widgetElement.querySelector("[slot='start']")).to.be.null;
        });
      });

      describe("if controls-center is undefined or empty", function () {
        it("should not contain center controls if controls-center is empty", function () {
          widgetElement = toolbar.processLayout(placeholderEl, MOCK_EMPTY_CENTER_CONTROLS_DEFINITION);

          expect(widgetElement.querySelector("[slot='']")).to.be.null;
        });

        it("should not contain center controls if controls-center is undefined", function () {
          widgetElement = toolbar.processLayout(placeholderEl, MOCK_UNDEFINED_CENTER_CONTROLS_DEFINITION);

          expect(widgetElement.querySelector("[slot='']")).to.be.null;
        });
      });

      describe("if controls-end is undefined or empty", function () {
        it("should not contain end controls if controls-end is empty", function () {
          widgetElement = toolbar.processLayout(placeholderEl, MOCK_EMPTY_END_CONTROLS_DEFINITION);

          expect(widgetElement.querySelector("[slot='end']")).to.be.null;
        });

        it("should not contain end controls if controls-end is undefined", function () {
          widgetElement = toolbar.processLayout(placeholderEl, MOCK_UNDEFINED_END_CONTROLS_DEFINITION);

          expect(widgetElement.querySelector("[slot='end']")).to.be.null;
        });
      });

      describe("if controls-start, controls-center and controls-end are defined", function () {
        it("should contain start, center and end controls", function () {
          widgetElement = toolbar.processLayout(placeholderEl, MOCK_START_CENTER_END_CONTROLS_DEFINITION);

          expect(widgetElement.querySelector("[slot='start']")).not.to.be.null;
          expect(widgetElement.querySelector("[slot='']")).not.to.be.null;
          expect(widgetElement.querySelector("[slot='end']")).not.to.be.null;
        });
      });
    });

    describe("when the definition.properties does not contain control id's defined", function () {
      it("should not contain start, center and end controls", function () {
        widgetElement = toolbar.processLayout(placeholderEl, MOCK_EMPTY_START_CENTER_END_CONTROLS_DEFINITION);

        expect(widgetElement.querySelector("[slot='start']")).to.be.null;
        expect(widgetElement.querySelector("[slot='']")).to.be.null;
        expect(widgetElement.querySelector("[slot='end']")).to.be.null;
      });
    });

    describe("when the definition.properties does not contain control-start, control-center and control-end defined", function () {
      it("should not contain start, center and end controls", function () {
        widgetElement = toolbar.processLayout(placeholderEl, MOCK_UNDEFINED_START_CENTER_END_CONTROLS_DEFINITION);

        expect(widgetElement.querySelector("[slot='start']")).to.be.null;
        expect(widgetElement.querySelector("[slot='']")).to.be.null;
        expect(widgetElement.querySelector("[slot='end']")).to.be.null;
      });
    });
  });

  describe("constructor()", function () {
    toolbarWidget = new toolbar();
    it("should add widget id", function () {
      expect(toolbarWidget.widget.id).not.to.be.undefined;
      expect(toolbarWidget.widget.id).not.to.be.null;
      expect(toolbarWidget.widget.id).not.to.be.NaN;
    });

    it("should have default properties added", function () {
      expect(toolbar.defaultValues).to.deep.equal(MOCK_TOOLBAR_DEFAULT_PROPERTIES);
    });
  });

  describe("onConnect()", function () {
    beforeEach(function () {
      widgetElement = toolbar.processLayout(placeholderEl, MOCK_START_CENTER_END_CONTROLS_DEFINITION);
      node = parentNode.children[0];
      parentNode.replaceChild(widgetElement, node);
    });
    it("should add widgetElement(which is passed as parameter) to widget property of elements object", function () {
      toolbarWidget.onConnect(widgetElement);

      expect(toolbarWidget.elements.widget).to.deep.equal(widgetElement);
    });

    it("refernces to control elements should be added", function () {
      let mockControlIds = new Set(["info", "goto", "size"]);
      toolbarWidget.onConnect(widgetElement);

      mockControlIds.forEach((controlId) => {
        expect(toolbarWidget[controlId]).not.to.be.null;
      });
    });
  });

  describe("dataInit()", function () {
    it("should put widget in defined initial state", function () {
      widgetElement = toolbar.processLayout(placeholderEl, MOCK_EMPTY_DEFINITION);
      node = parentNode.children[0];
      parentNode.replaceChild(widgetElement, node);

      toolbarWidget.onConnect(widgetElement);
      toolbarWidget.dataInit();

      for (let key in toolbar.defaultValues.html) {
        expect(widgetElement.getAttribute(key)).to.equal(toolbar.defaultValues.html[key]);
      }

      for (let key in toolbar.defaultValues.classes) {
        expect(widgetElement.classList.contains(key)).to.be.true;
      }
    });
  });

  describe("dataUpdate()", function () {
    describe("when there is change in the toolbar properties", function () {
      beforeEach(function () {
        widgetElement = toolbar.processLayout(placeholderEl, MOCK_START_CENTER_END_CONTROLS_DEFINITION);
        node = parentNode.children[0];
        parentNode.replaceChild(widgetElement, node);
      });
      it("if there is change in any html properties, should be reflected on the widgetElement", function (done) {
        toolbarWidget.onConnect(widgetElement);
        toolbarWidget.dataInit();
        toolbarWidget.dataUpdate(MOCK_TOOLBAR_DATA);

        setTimeout(function () {
          for (let key in MOCK_TOOLBAR_DATA.html) {
            expect(widgetElement.getAttribute(key)).to.equal(MOCK_TOOLBAR_DATA.html[key]);
          }
          done();
        }, defaultAsyncTimeout);
      });

      it("if there is change in any style properties, should be reflected on the widgetElement", function () {
        toolbarWidget.onConnect(widgetElement);
        toolbarWidget.dataInit();
        toolbarWidget.dataUpdate(MOCK_TOOLBAR_DATA);

        for (let key in MOCK_TOOLBAR_DATA.style) {
          expect(window.getComputedStyle(widgetElement).getPropertyValue(key)).to.equal(MOCK_TOOLBAR_DATA.style[key]);
        }
      });

      it("if there is change in any class properties, should be reflected on the widgetElement", function () {
        toolbarWidget.onConnect(widgetElement);
        toolbarWidget.dataInit();
        toolbarWidget.dataUpdate(MOCK_TOOLBAR_DATA);

        for (let key in MOCK_TOOLBAR_DATA.classes) {
          expect(widgetElement.classList.contains(key)).to.be.true;
        }
      });

      it("if there is change in any uniface properties, should be reflected on the widgetElement", function () {
        toolbarWidget.onConnect(widgetElement);
        toolbarWidget.dataInit();
        toolbarWidget.dataUpdate(MOCK_TOOLBAR_DATA);

        expect(widgetElement.querySelector(".u-label-text").textContent).to.equal(MOCK_TOOLBAR_DATA.uniface["label-text"]);
      });

      it("if there is any change in control's html properties, should be reflected on the control", function (done) {
        toolbarWidget.onConnect(widgetElement);
        toolbarWidget.dataInit();
        toolbarWidget.dataUpdate(MOCK_TOOLBAR_CONTROLS_DATA);

        setTimeout(function () {
          for (let key in MOCK_TOOLBAR_CONTROLS_DATA.uniface) {
            let [mainKey, ...subKeys] = key.split(":");
            if (subKeys[0] === "html") {
              expect(toolbarWidget[mainKey].element.getAttribute(subKeys[1])).not.to.be.null;
            }
          }
          done();
        }, defaultAsyncTimeout);
      });

      it("if there is any change in control's style properties, should be reflected on the control", function () {
        toolbarWidget.onConnect(widgetElement);
        toolbarWidget.dataInit();
        toolbarWidget.dataUpdate(MOCK_TOOLBAR_CONTROLS_DATA);

        for (let key in MOCK_TOOLBAR_CONTROLS_DATA.uniface) {
          let [mainKey, ...subKeys] = key.split(":");
          if (subKeys[0] === "style") {
            expect(window.getComputedStyle(toolbarWidget[mainKey].element).getPropertyValue(subKeys[1])).to.equal(MOCK_TOOLBAR_CONTROLS_DATA.uniface[key]);
          }
        }
      });

      it("if there is any change in control's class properties, should be reflected on the control", function () {
        toolbarWidget.onConnect(widgetElement);
        toolbarWidget.dataInit();
        toolbarWidget.dataUpdate(MOCK_TOOLBAR_CONTROLS_DATA);

        for (let key in MOCK_TOOLBAR_CONTROLS_DATA.uniface) {
          let [mainKey, ...subKeys] = key.split(":");
          if (subKeys[0] === "class") {
            expect(toolbarWidget[mainKey].element.classList.contains(subKeys[1])).to.be.true;
          }
        }
      });

      it("if there is any change in control's uniface properties, should be reflected on the control", function () {
        toolbarWidget.onConnect(widgetElement);
        toolbarWidget.dataInit();
        toolbarWidget.dataUpdate(MOCK_TOOLBAR_CONTROLS_DATA);

        for (let key in MOCK_TOOLBAR_CONTROLS_DATA.uniface) {
          let [mainKey, ...subKeys] = key.split(":");
          if (subKeys[0] === "label-text") {
            expect(toolbarWidget[mainKey].element.querySelector(".u-label-text").textContent).to.equal(MOCK_TOOLBAR_CONTROLS_DATA.uniface[key]);
          }
        }
      });

      it("if there is any change in control's value property, should be reflected on the control", function () {
        toolbarWidget.onConnect(widgetElement);
        toolbarWidget.dataInit();
        toolbarWidget.dataUpdate(MOCK_TOOLBAR_CONTROLS_DATA);

        for (let key in MOCK_TOOLBAR_CONTROLS_DATA.uniface) {
          let [mainKey, ...subKeys] = key.split(":");
          if (subKeys[0] === "value") {
            expect(toolbarWidget[mainKey].widget.elements.buttonTextElement.textContent).to.equal(MOCK_TOOLBAR_CONTROLS_DATA.uniface[key]);
          }
        }
      });

      it("if there is any change in control's valrep property, should be reflected on the control", function () {
        toolbarWidget.onConnect(widgetElement);
        toolbarWidget.dataInit();
        toolbarWidget.dataUpdate(MOCK_TOOLBAR_CONTROLS_DATA);

        for (let key in MOCK_TOOLBAR_CONTROLS_DATA.uniface) {
          let [mainKey, subKeys] = key.split(":");
          if (subKeys[0] === "valrep") {
            let formattedValrep = toolbar.getFormattedValrep(MOCK_TOOLBAR_CONTROLS_DATA.uniface[key]);
            let listboxOptions = toolbarWidget[mainKey].element.querySelectorAll("fluent-option");
            Array.from(listboxOptions).forEach((option, i) => {
              expect(option.value).to.equal(formattedValrep[i].value);
              expect(option.querySelector(".u-valrep-representation").textContent).to.equal(formattedValrep[i].representation);
            });
          }
        }
      });
    });
  });

  describe("dataCleanup()", function () {
    beforeEach(function () {
      widgetElement = toolbar.processLayout(placeholderEl, MOCK_START_CENTER_END_CONTROLS_DEFINITION);
      node = parentNode.children[0];
      parentNode.replaceChild(widgetElement, node);
    });
    it("should reset widget's html, style and class properties", function () {
      let mockDataNames = {
        html: new Set(["orientation"]),
        style: new Set(["padding"]),
        class: new Set(["classC"])
      };
      toolbarWidget.onConnect(widgetElement);
      toolbarWidget.dataInit();
      toolbarWidget.dataUpdate(MOCK_TOOLBAR_DATA);
      toolbarWidget.dataCleanup(mockDataNames);

      expect(widgetElement.getAttribute("orientation")).to.equal("horizontal");
      expect(window.getComputedStyle(widgetElement).getPropertyValue("padding")).not.to.equal(MOCK_TOOLBAR_DATA.style.padding);
      expect(widgetElement.classList.contains(MOCK_TOOLBAR_DATA.class.classC)).to.be.false;
      expect(widgetElement.classList.length).to.equal(0);
    });

    it("should reset control's html properties", function (done) {
      let mockDataNames = {
        uniface: new Set(["first:html:appearance"])
      };
      toolbarWidget.onConnect(widgetElement);
      toolbarWidget.dataInit();
      toolbarWidget.dataUpdate(MOCK_TOOLBAR_CONTROLS_DATA);
      toolbarWidget.dataCleanup(mockDataNames);

      setTimeout(function () {
        mockDataNames.uniface.forEach((prop) => {
          let [mainKey, ...subKeys] = prop.split(":");
          expect(toolbarWidget[mainKey].element.getAttribute(subKeys[1])).not.to.equal(MOCK_TOOLBAR_CONTROLS_DATA.uniface[prop]);
          expect(toolbarWidget[mainKey].element.getAttribute(subKeys[1])).to.equal("neutral");
          done();
        }, defaultAsyncTimeout);
      });
    });

    it("should reset control's style properties", function () {
      let mockDataNames = {
        uniface: new Set(["size:style:padding"])
      };
      toolbarWidget.onConnect(widgetElement);
      toolbarWidget.dataInit();
      toolbarWidget.dataUpdate(MOCK_TOOLBAR_CONTROLS_DATA);
      toolbarWidget.dataCleanup(mockDataNames);

      mockDataNames.uniface.forEach((prop) => {
        let [mainKey, ...subKeys] = prop.split(":");
        expect(window.getComputedStyle(toolbarWidget[mainKey].element).getPropertyValue(subKeys[1])).not.to.equal(MOCK_TOOLBAR_CONTROLS_DATA.uniface[prop]);
        expect(window.getComputedStyle(toolbarWidget[mainKey].element).getPropertyValue(subKeys[1])).to.equal("0px");
      });
    });

    it("should reset control's class properties", function () {
      let mockDataNames = {
        uniface: new Set(["goto:class:classGoto"])
      };
      toolbarWidget.onConnect(widgetElement);
      toolbarWidget.dataInit();
      toolbarWidget.dataUpdate(MOCK_TOOLBAR_CONTROLS_DATA);
      toolbarWidget.dataCleanup(mockDataNames);

      mockDataNames.uniface.forEach((prop) => {
        let [mainKey, ...subKeys] = prop.split(":");
        expect(toolbarWidget[mainKey].element.classList.contains(subKeys[1])).to.be.false;
      });
    });

    it("should reset control's uniface properties", function () {
      let mockDataNames = {
        uniface: new Set(["goto:label-text"])
      };
      toolbarWidget.onConnect(widgetElement);
      toolbarWidget.dataInit();
      toolbarWidget.dataUpdate(MOCK_TOOLBAR_CONTROLS_DATA);
      toolbarWidget.dataCleanup(mockDataNames);

      mockDataNames.uniface.forEach((prop) => {
        let [mainKey, subKeys] = prop.split(":");
        if (subKeys[0] === "label-text") {
          expect(toolbarWidget[mainKey].element.querySelector(".u-label-text").textContent).not.to.equal(MOCK_TOOLBAR_CONTROLS_DATA.uniface[prop]);
          expect(toolbarWidget[mainKey].element.querySelector(".u-label-text").textContent).to.equal("");
        }
      });
    });

    it("should reset control's value property", function () {
      let mockDataNames = {
        uniface: new Set(["first:value"])
      };
      toolbarWidget.onConnect(widgetElement);
      toolbarWidget.dataInit();
      toolbarWidget.dataUpdate(MOCK_TOOLBAR_CONTROLS_DATA);
      toolbarWidget.dataCleanup(mockDataNames);

      mockDataNames.uniface.forEach((prop) => {
        let [mainKey, subKeys] = prop.split(":");
        if (subKeys[0] === "value") {
          expect(toolbarWidget[mainKey].widget.elements.buttonTextElement.textContent).not.to.equal(MOCK_TOOLBAR_CONTROLS_DATA.uniface[prop]);
          expect(toolbarWidget[mainKey].widget.elements.buttonTextElement.textContent).to.equal("");
        }
      });
    });

    it("should reset control's valrep property", function () {
      let mockDataNames = {
        uniface: new Set(["size:valrep"])
      };
      toolbarWidget.onConnect(widgetElement);
      toolbarWidget.dataInit();
      toolbarWidget.dataUpdate(MOCK_TOOLBAR_CONTROLS_DATA);
      toolbarWidget.dataCleanup(mockDataNames);

      mockDataNames.uniface.forEach((prop) => {
        let [mainKey, ...subKeys] = prop.split(":");
        if (subKeys[0] === "valrep") {
          let formattedValrep = toolbar.getFormattedValrep(MOCK_TOOLBAR_CONTROLS_DATA.uniface[prop]);
          let listboxOptions = toolbarWidget[mainKey].element.querySelectorAll("fluent-option");
          Array.from(listboxOptions).forEach((option, i) => {
            expect(option.value).not.to.equal(formattedValrep[i].value);
            expect(option.querySelector(".u-valrep-representation").textContent).not.to.equal(formattedValrep[i].representation);
          });
        }
      });
    });
  });

  describe("blockUI()", function () {
    it("should make the controls readonly/disabled (whatever that is applicable)", function (done) {
      widgetElement = toolbar.processLayout(placeholderEl, MOCK_START_CENTER_END_CONTROLS_DEFINITION);
      node = parentNode.children[0];
      parentNode.replaceChild(widgetElement, node);

      toolbarWidget.onConnect(widgetElement);
      toolbarWidget.dataInit();
      toolbarWidget.blockUI();

      setTimeout(function () {
        expect(toolbarWidget["size"].element.getAttribute("disabled")).to.exist;
        expect(toolbarWidget["goto"].element.getAttribute("readonly")).to.exist;
        expect(toolbarWidget["first"].element.getAttribute("disabled")).to.exist;
        done();
      }, defaultAsyncTimeout);
    });
  });

  describe("unblockUI()", function () {
    it("should remove readonly/disabled (whatever that is applicable) from the controls", function (done) {
      widgetElement = toolbar.processLayout(placeholderEl, MOCK_START_CENTER_END_CONTROLS_DEFINITION);
      node = parentNode.children[0];
      parentNode.replaceChild(widgetElement, node);

      toolbarWidget.onConnect(widgetElement);
      toolbarWidget.dataInit();
      toolbarWidget.blockUI();
      toolbarWidget.unblockUI();

      setTimeout(function () {
        expect(toolbarWidget["size"].element.getAttribute("disabled")).not.to.exist;
        expect(toolbarWidget["goto"].element.getAttribute("readonly")).not.to.exist;
        expect(toolbarWidget["first"].element.getAttribute("disabled")).not.to.exist;
        done();
      }, defaultAsyncTimeout);
    });
  });

  describe("addControlReference()", function () {
    it("should add references to the children of the slot element based on the id", function () {
      toolbarWidget = new toolbar();
      widgetElement = toolbar.processLayout(placeholderEl, MOCK_START_CENTER_END_CONTROLS_DEFINITION);
      node = parentNode.children[0];
      parentNode.replaceChild(widgetElement, node);

      let startContainer = widgetElement.shadowRoot.querySelector("[part='start']");
      let endContainer = widgetElement.shadowRoot.querySelector("[part='end']");

      toolbarWidget.addControlReference(startContainer.querySelector("slot"));
      toolbarWidget.addControlReference(endContainer.querySelector("slot"));

      [startContainer, endContainer].forEach((container) => {
        Array.from(container.querySelector("slot").assignedElements()).forEach((slotEl) => {
          expect(toolbarWidget[slotEl.id].element).to.deep.equal(slotEl);
        });
      });
    });
  });

  describe("invokeControlFunction()", function () {
    describe("if controls object is defined", function () {
      it("should call dataUpdate() of the control with the widgetProperties", function (done) {
        widgetElement = toolbar.processLayout(placeholderEl, MOCK_CONTROLS_PROPERTIES_DEFINITION);
        node = parentNode.children[0];
        parentNode.replaceChild(widgetElement, node);
        toolbarWidget = new toolbar();

        toolbarWidget.onConnect(widgetElement);
        toolbarWidget.dataInit();
        toolbarWidget.invokeControlFunction("dataUpdate", MOCK_CONTROLS);

        setTimeout(function () {
          expect(toolbarWidget["last"].element.getAttribute("appearance")).to.equal(MOCK_CONTROLS.last["widget-properties"].html.appearance);
          done();
        }, defaultAsyncTimeout);
      });

      it("should call dataCleanup() of the control with the widgetCleanupProperties", function (done) {
        let controls = {
          first: {
            "widget-properties": {},
            "widget-cleanup-properties": {
              html: new Set(["appearance"]),
              value: ""
            }
          }
        };
        widgetElement = toolbar.processLayout(placeholderEl, MOCK_START_CONTROLS_ONLY_DEFINITION);
        node = parentNode.children[0];
        parentNode.replaceChild(widgetElement, node);
        toolbarWidget = new toolbar();

        toolbarWidget.onConnect(widgetElement);
        toolbarWidget.dataInit();
        toolbarWidget.dataUpdate(MOCK_TOOLBAR_CONTROLS_DATA);
        toolbarWidget.invokeControlFunction("dataCleanup", controls);

        setTimeout(function () {
          expect(toolbarWidget["first"].element.getAttribute("appearance")).to.equal("neutral");
          expect(toolbarWidget["first"].element.value).to.equal("");
          done();
        }, defaultAsyncTimeout);
      });
    });

    describe("if controls object is not defined", function () {
      it("should call dataInit() of the control", function () {
        widgetElement = toolbar.processLayout(placeholderEl, MOCK_START_CONTROLS_ONLY_DEFINITION);
        node = parentNode.children[0];
        parentNode.replaceChild(widgetElement, node);
        toolbarWidget = new toolbar();

        toolbarWidget.onConnect(widgetElement);
        toolbarWidget.invokeControlFunction("dataInit");
        expect(toolbarWidget["first"].widget.data.id).to.exist;
        expect(toolbarWidget["first"].widget.data.iconName).to.equal("");
        expect(toolbarWidget["first"].widget.data.iconPosition).to.equal("start");
        expect(toolbarWidget["first"].widget.data.value).to.equal("");
      });

      it("should call blockUI() of the control", function (done) {
        widgetElement = toolbar.processLayout(placeholderEl, MOCK_START_CONTROLS_ONLY_DEFINITION);
        node = parentNode.children[0];
        parentNode.replaceChild(widgetElement, node);
        toolbarWidget = new toolbar();

        toolbarWidget.onConnect(widgetElement);
        toolbarWidget.dataInit();
        toolbarWidget.invokeControlFunction("blockUI");

        setTimeout(function () {
          expect(toolbarWidget["first"].element.getAttribute("disabled")).to.exist;
          done();
        }, defaultAsyncTimeout);
      });

      it("should call unblockUI() of the control", function (done) {
        widgetElement = toolbar.processLayout(placeholderEl, MOCK_START_CONTROLS_ONLY_DEFINITION);
        node = parentNode.children[0];
        parentNode.replaceChild(widgetElement, node);
        toolbarWidget = new toolbar();

        toolbarWidget.onConnect(widgetElement);
        toolbarWidget.dataInit();
        toolbarWidget.invokeControlFunction("blockUI");
        toolbarWidget.invokeControlFunction("unblockUI");

        setTimeout(function () {
          expect(toolbarWidget["first"].element.getAttribute("disabled")).not.to.exist;
          done();
        }, defaultAsyncTimeout);
      });
    });
  });

  describe("getControlsWithGroupedProps()", function () {
    describe("should group the control properties correctly", function () {
      it("should group the controls properties correctly when the control of the properties passed is not part of controlIds", function () {
        widgetElement = toolbar.processLayout(placeholderEl, MOCK_CONTROLS_WITHOUT_ANY_PROPERTIES_DEFINITION);
        node = parentNode.children[0];
        parentNode.replaceChild(widgetElement, node);
        let controls = {};

        for (const key in MOCK_CONTROLS_WITHOUT_ANY_PROPERTIES_DEFINITION.properties) {
          toolbar.processControlProps(controls, key, MOCK_CONTROLS_WITHOUT_ANY_PROPERTIES_DEFINITION.properties[key], false);
        }

        expect(controls).to.deep.equal({});
      });

      describe(" when the control of the properties passed is part of controlIds", function () {
        it("should group the controls widget-class, overflow-behavior, overflow-index, value, valrep,html,style,class and uniface properties correctly", function () {
          widgetElement = toolbar.processLayout(placeholderEl, MOCK_CONTROLS_PROPERTIES_DEFINITION);
          node = parentNode.children[0];
          parentNode.replaceChild(widgetElement, node);
          let controls = {};

          for (const key in MOCK_CONTROLS_PROPERTIES_DEFINITION.properties) {
            toolbar.processControlProps(controls, key, MOCK_CONTROLS_PROPERTIES_DEFINITION.properties[key], false);
          }

          expect(controls).to.deep.equal(MOCK_CONTROLS);
        });
      });
    });
  });
})();
