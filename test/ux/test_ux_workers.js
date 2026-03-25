import { getWidgetClass } from "../../src/ux/framework/common/dsp_connector.js";
import { Widget } from "../../src/ux/framework/common/widget.js";
import { AttributeBase } from "../../src/ux/framework/common/attribute_base.js";
import { Element } from "../../src/ux/framework/workers/element.js";
import { AttributeString } from "../../src/ux/framework/workers/attribute_string.js";
import { AttributeBoolean } from "../../src/ux/framework/workers/attribute_boolean.js";
import { AttributeChoice } from "../../src/ux/framework/workers/attribute_choice.js";
import { AttributeLength } from "../../src/ux/framework/workers/attribute_length.js";
import { AttributeNumber } from "../../src/ux/framework/workers/attribute_number.js";
import { AttributeBooleanValue } from "../../src/ux/framework/workers/attribute_boolean_value.js";
import { PropertyFilter } from "../../src/ux/framework/workers/property_filter.js";
import { ElementIconText } from "../../src/ux/framework/workers/element_icon_text.js";
import { ElementsValrep } from "../../src/ux/framework/workers/elements_valrep.js";
import { ElementError } from "../../src/ux/framework/workers/element_error.js";
import { SubWidget } from "../../src/ux/framework/workers/sub_widget.js";
import { StyleClassManager } from "../../src/ux/framework/workers/style_class_manager.js";
import { EventTrigger } from "../../src/ux/framework/workers/event_trigger.js";
import { AttributeUIBlocking } from "../../src/ux/framework/workers/attribute_ui_blocking.js";
import { WorkerBase } from "../../src/ux/framework/common/worker_base.js";
import { ChildWidgets } from "../../src/ux/framework/workers/child_widgets.js";
import { WidgetOccurrence } from "../../src/ux/framework/workers/widget_occurrence.js";

(function () {
  "use strict";

  // This test depends on Button, see calls to getWidgetClass.

  const assert = chai.assert;
  const expect = chai.expect;

  describe("Tests for Workers", function () {

    let widgetClass;
    let worker;
    let elementQuerySelector;
    let element;

    beforeEach(function () {
      widgetClass = {};
      worker = new WorkerBase(widgetClass);
    });

    it("should initialize with the correct properties", function () {
      expect(worker.widgetClass).to.equal(widgetClass);
      expect(worker.isSetter).to.equal(true);
    });

    it("testing setElementQuerySelector", function () {
      elementQuerySelector = "div";
      worker.setElementQuerySelector(elementQuerySelector);
      expect(worker.elementQuerySelector).to.equal(elementQuerySelector);
    });

    it("testing getElement", function () {
      const widgetInstance = {
        "elements": {
          "widget": document.createElement("div")
        },
        "getTraceDescription": function () {
          return "description";
        }
      };
      element = worker.getElement(widgetInstance);
      expect(element).to.have.tagName("div");
    });
  });

  // ===================================================================================================================
  // == Testing ClassStyle class =======================================================================================
  // ===================================================================================================================
  describe("Test ClassStyle class", function () {
    let widgetClass;
    let defaultClassList;
    let instance;

    beforeEach(function () {
      Widget.structure = {};
      Widget.subWidgets = {};
      Widget.subWidgetWorkers = [];
      Widget.defaultValues = {};
      Widget.setters = {};
      Widget.getters = {};
      Widget.triggers = {};

      widgetClass = Widget;
      defaultClassList = ["class1", "class2"];
      instance = new StyleClassManager(widgetClass, defaultClassList);
    });

    it("should initialize with the correct properties for ClassStyle class", function () {
      expect(instance.widgetClass).to.equal(widgetClass);
    });

    it("should register default class values for ClassStyle class", function () {
      defaultClassList.forEach((className) => {
        expect(instance.widgetClass.defaultValues[`class:${className}`]).to.be.true;
      });
    });

    it("should refresh correctly and modify the element classes for ClassStyle class", function () {
      const widgetInstance = {
        "data": {
          "class:class1": true,
          "class:class2": false,
          "class1:class3": true,
          "class2:class4": true
        },
        "getTraceDescription": sinon.stub().returns("description")
      };
      const element = document.createElement("div");
      sinon.stub(instance, "getElement").returns(element);

      instance.refresh(widgetInstance);

      expect(element.classList.contains("class1")).to.be.true;
      expect([...element.classList].includes(...["class2, class3", "class4"])).to.be.false;
    });
  });

  // ===================================================================================================================
  // == Testing Element class =========================================================================================
  // ===================================================================================================================
  describe("Test Element class", function () {

    let widgetClass;
    let tagName;
    let styleClass;
    let elementQuerySelector;
    let childWorkers;
    let element;
    let definitions;
    let expectedQuerySelectors;

    beforeEach(function () {
      Widget.structure = {};
      Widget.subWidgets = {};
      Widget.subWidgetWorkers = [];
      Widget.defaultValues = {};
      Widget.setters = {};
      Widget.getters = {};
      Widget.triggers = {};

      widgetClass = Widget;
      tagName = "DIV";
      elementQuerySelector = "div";
      styleClass = "styleClass";
      childWorkers = [new StyleClassManager(widgetClass, ["u-switch"]), new AttributeString(widgetClass, "html:role", "role", "switch"), new ElementIconText(widgetClass, "span", "u-label-text", ".u-label-text", "", "label-text"), new ElementIconText(widgetClass, "span", "u-checked-message", ".u-checked-message", "checked-message", "checked-message"), new EventTrigger(widgetClass, "onchange", "change", true)];
      expectedQuerySelectors = ["div", "div", ".u-label-text", ".u-checked-message", "div"];
      element = new Element(widgetClass, tagName, styleClass, elementQuerySelector, childWorkers);
    });

    it("should initialize with correct properties for Element class", function () {
      expect(element.widgetClass).to.equal(widgetClass);
      expect(element.tagName).to.equal(tagName);
      expect(element.styleClass).to.equal(styleClass);
      expect(element.elementQuerySelector).to.equal(elementQuerySelector);
      expect(element.childWorkers).to.equal(childWorkers);
    });

    it("check elementQuerySelector has been inherited from Element if not already present", function () {
      childWorkers.forEach((childWorker, index) => {
        expect(childWorker.elementQuerySelector).to.equal(expectedQuerySelectors[index]);
      });
    });

    // Definitions doesn't do anything.
    it("check generate layout for Element class", function () {
      let layoutElement = element.getLayout(definitions);

      expect(layoutElement).to.have.tagName("DIV");
      expect(layoutElement).to.have.class("styleClass");
      expect(layoutElement.querySelector("u-label-text"));
      expect(layoutElement.querySelector("u-checked-message"));
    });
  });

  // ===================================================================================================================
  // == Testing ElementIconText class =================================================================================
  // ===================================================================================================================
  describe("Test ElementIconText class", function () {

    let widgetClass;
    let propText;
    let defaultText;
    let propIcon;
    let defaultIcon;
    let slottedElement;
    let dynamicLabelElement;

    const widgetInstance = {
      "data": {
        "icon": "testicon.png",
        "icon-position": "start",
        "text": "defaultText",
        "value": ""
      },
      "elements": {
        "widget": document.createElement("div")
      },
      "getTraceDescription": function () {
        return "description";
      }
    };

    beforeEach(function () {
      Widget.structure = {};
      Widget.subWidgets = {};
      Widget.subWidgetWorkers = [];
      Widget.defaultValues = {};
      Widget.setters = {};
      Widget.getters = {};
      Widget.triggers = {};

      widgetClass = Widget;
      propText = "text";
      propIcon = "icon";
      defaultText = "defaultText";
      defaultIcon = "default.png";
      slottedElement = new ElementIconText(widgetClass, "", "", "", "", propText, defaultText, propIcon, defaultIcon);
      dynamicLabelElement = new ElementIconText(widgetClass, "span", "label-class", "", "label-slot", propText, defaultText, null, null, true);
    });

    it("should initialize with correct properties for ElementIconText class", function () {
      expect(slottedElement.widgetClass).to.equal(widgetClass);
      expect(slottedElement.textPropId).to.equal(propText);
      expect(slottedElement.textDefaultValue).to.equal(defaultText);
      expect(slottedElement.iconPropId).to.equal(propIcon);
      expect(slottedElement.iconDefaultValue).to.equal(defaultIcon);
      expect(slottedElement.isDynamicLabel).to.be.false;
      expect(slottedElement.currentLabelSize).to.be.null;

      // Test isDynamicLabel initialization
      expect(dynamicLabelElement.isDynamicLabel).to.be.true;
      expect(dynamicLabelElement.currentLabelSize).to.be.null;
    });

    it("check getters/setters changed for propIcon, propText for ElementIconText class", function () {
      expect(slottedElement.widgetClass.defaultValues.icon).to.equal(defaultIcon);
      expect(slottedElement.widgetClass.defaultValues.text).to.equal(defaultText);

      // Test label-size setter registration for dynamic labels
      expect(widgetClass.setters["label-size"]).to.exist;
      expect(widgetClass.setters["label-size"]).to.include(dynamicLabelElement);
    });

    it("should refresh correctly for ElementIconText class", function () {
      slottedElement.refresh(widgetInstance);
      let mockIconClasses = ["ms-Icon", "ms-Icon--testicon.png"];
      expect(widgetInstance.elements.widget.hidden).to.equal(false);
      expect([...widgetInstance.elements.widget.classList].includes(...mockIconClasses)).to.equal(true);

      widgetInstance.data["icon"] = "";
      slottedElement.refresh(widgetInstance);
      expect(widgetInstance.elements.widget.innerText).to.equal("defaultText");
      expect([...widgetInstance.elements.widget.classList].includes(...mockIconClasses)).to.equal(false);
    });

    it("should return correct tag name for different label sizes", function () {
      expect(dynamicLabelElement.getTagNameForLabelSize("small")).to.equal("h3");
      expect(dynamicLabelElement.getTagNameForLabelSize("medium")).to.equal("h2");
      expect(dynamicLabelElement.getTagNameForLabelSize("large")).to.equal("h1");
      expect(dynamicLabelElement.getTagNameForLabelSize("unknown")).to.equal("span");
      expect(dynamicLabelElement.getTagNameForLabelSize(null)).to.equal("span");
    });

    it("should create element with correct tag based on label-size in getLayout", function () {
      const objectDefinition = {
        "getProperty": sinon.stub()
      };

      objectDefinition.getProperty.withArgs("label-size").returns("medium");
      let element = dynamicLabelElement.getLayout(objectDefinition);
      expect(element.tagName.toLowerCase()).to.equal("h2");
      expect(element.classList.contains("label-class")).to.be.true;
      expect(dynamicLabelElement.currentLabelSize).to.equal("medium");
    });

    it("should replace element with new tag when label-size changes", function () {
      const parentElement = document.createElement("div");
      const oldElement = document.createElement("h2");
      oldElement.innerText = "Test Label";
      oldElement.slot = "label-slot";
      oldElement.classList.add("label-class", "extra-class");
      oldElement.hidden = false;
      parentElement.appendChild(oldElement);

      dynamicLabelElement.currentLabelSize = "medium";
      const newElement = dynamicLabelElement.handleLabelSizeChange(oldElement, "large");

      expect(newElement.tagName.toLowerCase()).to.equal("h1");
      expect(newElement.innerText).to.equal("Test Label");
      expect(newElement.slot).to.equal("label-slot");
      expect(newElement.classList.contains("label-class")).to.be.true;
      expect(newElement.classList.contains("extra-class")).to.be.true;
      expect(newElement.hidden).to.be.false;
      expect(dynamicLabelElement.currentLabelSize).to.equal("large");
    });

    it("should not replace element when label-size remains the same", function () {
      const oldElement = document.createElement("h2");
      dynamicLabelElement.currentLabelSize = "medium";

      const result = dynamicLabelElement.handleLabelSizeChange(oldElement, "medium");

      expect(result).to.equal(oldElement);
      expect(result.tagName.toLowerCase()).to.equal("h2");
    });
  });

  // ===================================================================================================================
  // == Testing ElementError class =====================================================================================
  // ===================================================================================================================
  describe("Test ElementError class", function () {

    let widgetClass;
    let slottedError;

    beforeEach(function () {
      Widget.structure = {};
      Widget.subWidgets = {};
      Widget.subWidgetWorkers = [];
      Widget.defaultValues = {};
      Widget.setters = {};
      Widget.getters = {};
      Widget.triggers = {};

      widgetClass = Widget;
      slottedError = new ElementError(widgetClass, "", "", "", "");
    });

    it("should initialize with correct properties for ElementError class", function () {
      expect(slottedError.widgetClass).to.equal(widgetClass);
    });

    it("check setters were added for ElementError class", function () {
      let setters = Object.keys(slottedError.widgetClass.setters);
      let errorArray = [
        "error",
        "error-message",
        "format-error",
        "format-error-message"
      ];

      expect(setters).to.include(errorArray[0]);
      expect(setters).to.include(errorArray[1]);
      expect(setters).to.include(errorArray[2]);
      expect(setters).to.include(errorArray[3]);
    });

    it("should refresh correctly for ElementError class", function () {
      const widgetInstance = {
        "data": {
          "error": true,
          "error-message": "1Bad error",
          "format-error": true,
          "format-error-message": "1Bad Formatting"
        },
        "elements": {
          "widget": document.createElement("div")
        },
        "getTraceDescription": function () {
          return "description";
        }
      };

      slottedError.refresh(widgetInstance);
      expect(widgetInstance.elements.widget.hidden).to.equal(false);
      expect(widgetInstance.elements.widget.classList[0]).to.equal("u-format-invalid");
      expect(widgetInstance.elements.widget.classList[1]).to.equal("ms-Icon");
      expect(widgetInstance.elements.widget.classList[2]).to.equal("ms-Icon--AlertSolid");
      expect(widgetInstance.elements.widget.title).to.equal("1Bad Formatting");

      widgetInstance.data["format-error"] = false;
      slottedError.refresh(widgetInstance);
      expect(widgetInstance.elements.widget.title).to.equal("1Bad error");
      expect(widgetInstance.elements.widget.classList[3]).to.equal("u-invalid");

      widgetInstance.data["error"] = false;
      slottedError.refresh(widgetInstance);
      expect(widgetInstance.elements.widget.hidden).to.equal(true);
      expect(widgetInstance.elements.widget.title).to.equal("");
      expect(widgetInstance.elements.widget.classList).to.have.lengthOf(0);

    });
  });

  // ===================================================================================================================
  // == Testing SubWidget class =====================================================================================
  // ====================================================================================================================
  describe("Test SubWidget class", function () {
    let widgetClass;
    let subWidgetId;
    let subWidgetName;
    let subWidgetClass;
    let tagName;
    let slottedWidget;

    beforeEach(function () {
      Widget.structure = {};
      Widget.subWidgets = {};
      Widget.subWidgetWorkers = [];
      Widget.defaultValues = {};
      Widget.setters = {};
      Widget.getters = {};
      Widget.triggers = {};

      widgetClass = Widget;
      subWidgetName = "UX.Button";
      subWidgetClass = getWidgetClass(subWidgetName);
      assert(subWidgetClass, `Widget class '${subWidgetName}' is not loaded!`);
      tagName = "DIV";
      subWidgetId = "undefined";
      slottedWidget = new SubWidget(widgetClass, tagName, "styleClass", "", "", subWidgetId, subWidgetName, {}, "");
    });

    it("should initialize with correct properties for SubWidget class", function () {
      expect(slottedWidget.widgetClass).to.equal(widgetClass);
    });

    it("check getters/setters changed and subWidget added", function () {
      expect(slottedWidget.subWidgetClass).to.equal(subWidgetClass);
      expect(slottedWidget.propId).to.equal("undefined");
    });

    it("check generate layout for SubWidget class", function () {
      let layoutElement = slottedWidget.getLayout();

      expect(layoutElement).to.have.class("u-sw-undefined");
      expect(layoutElement.hidden).to.equal(true);
      expect(layoutElement).to.have.tagName("FLUENT-BUTTON");
    });

    it("should refresh correctly for SubWidget class", function () {
      const widgetInstance = {
        "data": {
          "undefined": true
        },
        "elements": {
          "widget": document.createElement("div")
        },
        "getTraceDescription": function () {
          return "description";
        }
      };

      slottedWidget.elementQuerySelector = "";
      slottedWidget.refresh(widgetInstance);

      expect(widgetInstance.elements.widget.hidden).to.equal(false);
      expect(widgetInstance.elements.widget.classList[0]).to.equal("u-sw-undefined-shown");

      delete widgetInstance.data["undefined"];
      slottedWidget.refresh(widgetInstance);
      expect(widgetInstance.elements.widget.hidden).to.equal(true);
      expect(widgetInstance.elements.widget.classList).to.have.lengthOf(0);
    });
  });

  // ===================================================================================================================
  // == Testing AttributeBase class ================================================================================
  // ===================================================================================================================
  describe("Test AttributeBase class", function () {

    let widgetClass;
    let propId;
    let attrName;
    let defaultValue;
    let worker;
    let element;
    let value;

    beforeEach(function () {
      Widget.structure = {};
      Widget.subWidgets = {};
      Widget.subWidgetWorkers = [];
      Widget.defaultValues = {};
      Widget.setters = {};
      Widget.getters = {};
      Widget.triggers = {};

      widgetClass = Widget;
      propId = "value";
      attrName = "contentEditable";
      defaultValue = "1";
      worker = new AttributeBase(widgetClass, propId, attrName, defaultValue);
    });

    it("should initialize with correct properties for AttributeBase class", function () {
      expect(worker.widgetClass).to.equal(widgetClass);
      expect(worker.propId).to.equal(propId);
      expect(worker.attrName).to.equal(attrName);
      expect(worker.defaultValue).to.equal(defaultValue);

    });

    it("check getters/setters for AttributeBase class", function () {
      let length = worker.widgetClass.setters.value.length;

      expect(worker.widgetClass.getters.value.propId).to.equal(propId);
      expect(worker.widgetClass.setters.value[length - 1].propId).to.equal(propId);
    });

    it("check setHtmlAttribute for AttributeBase class", function () {
      element = {
        "elements": {
          "widget": document.createElement("div")
        }
      };
      worker.setHtmlAttribute(element, "new Value");
      expect(element[attrName]).to.equal("new Value");
    });

    // refresh() doesn't do anything.
    it("check refresh() for AttributeBase class", function () {
      worker.refresh({});
    });

    it("check getValue() for AttributeBase class", function () {
      const widgetInstance = {
        "elements": {
          "widget": document.createElement("div")
        },
        "getTraceDescription": function () {
          return "description";
        }
      };
      value = worker.getValue(widgetInstance);
      expect(value).to.equal("inherit");
    });

    // getValueUpdaters() doesn't do anything.
    it("check getValueUpdaters() for AttributeBase class", function () {
      const widgetInstance = {
        "elements": {
          "widget": [document.createElement("div"), document.createElement("span")]
        },
        "getTraceDescription": function () {
          return "description";
        }
      };
      value = worker.getValueUpdaters(widgetInstance);
    });
  });

  // ===================================================================================================================
  // == Testing AttributeString class ====================================================================================
  // ===================================================================================================================
  describe("Test AttributeString class", function () {

    let widgetClass;
    let propId;
    let attrName;
    let defaultValue;
    let element;

    beforeEach(function () {
      Widget.structure = {};
      Widget.subWidgets = {};
      Widget.subWidgetWorkers = [];
      Widget.defaultValues = {};
      Widget.setters = {};
      Widget.getters = {};
      Widget.triggers = {};

      widgetClass = Widget;
      propId = "icon-position";
      attrName = "button";
      defaultValue = "1";
      element = new AttributeString(widgetClass, propId, attrName, defaultValue);
    });

    it("should initialize with correct properties for AttributeString class", function () {
      expect(element.widgetClass).to.equal(widgetClass);
    });

    it("should refresh correctly", function () {
      const widgetInstance = {
        "data": {
          "icon-position": "start-end"
        },
        "elements": {
          "widget": document.createElement("div")
        },
        "getTraceDescription": function () {
          return "description";
        }
      };
      element.refresh(widgetInstance);
      expect(widgetInstance.elements.widget).to.have.all.keys("button");
      expect(widgetInstance.elements.widget.button).to.equal("start-end");
    });
  });

  // ===================================================================================================================
  // == Testing AttributeChoice class ==============================================================================
  // ===================================================================================================================
  describe("Test AttributeChoice class", function () {

    let widgetClass;
    let propId;
    let attrName;
    let choices;
    let defaultValue;
    let element;

    beforeEach(function () {
      Widget.structure = {};
      Widget.subWidgets = {};
      Widget.subWidgetWorkers = [];
      Widget.defaultValues = {};
      Widget.setters = {};
      Widget.getters = {};
      Widget.triggers = {};

      widgetClass = Widget;
      propId = "icon-position";
      attrName = "button";
      defaultValue = "1";
      choices = ["all", "start-end", "none"];
      element = new AttributeChoice(widgetClass, propId, attrName, choices, defaultValue);
    });

    it("should initialize with correct properties for AttributeChoice class", function () {
      expect(element.widgetClass).to.equal(widgetClass);
      expect(element.choices).to.equal(choices);
    });

    it("should refresh correctly", function () {
      const widgetInstance = {
        "data": {
          "icon-position": "start-end"
        },
        "elements": {
          "widget": document.createElement("div")
        },
        "getTraceDescription": function () {
          return "description";
        }
      };
      element.refresh(widgetInstance);
      expect(widgetInstance.elements.widget).to.have.all.keys("button");
      expect(widgetInstance.elements.widget.button).to.equal("start-end");
    });
  });

  // ===================================================================================================================
  // == Testing AttributeNumber class ==============================================================================
  // ===================================================================================================================
  describe("Test AttributeNumber class", function () {

    let widgetClass;
    let propId;
    let attrName;
    let min;
    let max;
    let defaultValue;
    let element;

    beforeEach(function () {
      Widget.structure = {};
      Widget.subWidgets = {};
      Widget.subWidgetWorkers = [];
      Widget.defaultValues = {};
      Widget.setters = {};
      Widget.getters = {};
      Widget.triggers = {};

      widgetClass = Widget;
      propId = "numberValue";
      attrName = "newReturnNumber";
      defaultValue = "1";
      min = 1;
      max = 500;
      element = new AttributeNumber(widgetClass, propId, attrName, min, max, defaultValue);
    });

    it("should initialize with correct properties for AttributeNumber class", function () {
      expect(element.widgetClass).to.equal(widgetClass);
      expect(element.min).to.equal(min);
      expect(element.max).to.equal(max);
    });

    it("should refresh correctly", function () {
      const widgetInstance = {
        "data": {
          "numberValue": "126"
        },
        "elements": {
          "widget": document.createElement("div")
        },
        "getTraceDescription": function () {
          return "description";
        }
      };
      element.refresh(widgetInstance);
      expect(widgetInstance.elements.widget).to.have.all.keys("newReturnNumber");
      expect(widgetInstance.elements.widget.newReturnNumber).to.equal(126);
    });
  });

  // ===================================================================================================================
  // == Testing AttributeBoolean class =============================================================================
  // ===================================================================================================================
  describe("Test AttributeBoolean class", function () {

    let widgetClass;
    let propId;
    let attrName;
    let defaultValue;
    let element;

    beforeEach(function () {
      Widget.structure = {};
      Widget.subWidgets = {};
      Widget.subWidgetWorkers = [];
      Widget.defaultValues = {};
      Widget.setters = {};
      Widget.getters = {};
      Widget.triggers = {};

      widgetClass = Widget;
      propId = "icon-position";
      attrName = "button";
      defaultValue = "1";
      element = new AttributeBoolean(widgetClass, propId, attrName, defaultValue);
    });

    it("should initialize with correct properties for AttributeBoolean class", function () {
      expect(element.widgetClass).to.equal(widgetClass);
    });

    it("should refresh correctly", function () {
      const widgetInstance = {
        "data": {
          "icon-position": "1-start-end"
        },
        "elements": {
          "widget": document.createElement("div")
        },
        "getTraceDescription": function () {
          return "description";
        }
      };
      element.refresh(widgetInstance);
      expect(widgetInstance.elements.widget.button).to.equal(true);

      element.attrName = "ariaValueMax";
      element.refresh(widgetInstance);
      expect(widgetInstance.elements.widget.ariaValueMax).to.equal("true");
    });
  });

  // ===================================================================================================================
  // == Testing AttributeBooleanValue class ========================================================================
  // ===================================================================================================================
  describe("Test AttributeBooleanValue class", function () {

    let widgetClass;
    let propId;
    let attrName;
    let defaultValue;
    let element;
    let buttonWidgetClass;
    let buttonWidget;
    let returnedProcess;

    beforeEach(function () {
      Widget.structure = {};
      Widget.subWidgets = {};
      Widget.subWidgetWorkers = [];
      Widget.defaultValues = {};
      Widget.setters = {};
      Widget.getters = {};
      Widget.triggers = {};

      widgetClass = Widget;
      propId = "icon-position";
      attrName = "ariaValueMax";
      defaultValue = "1";
      element = new AttributeBooleanValue(widgetClass, propId, attrName, defaultValue);
      buttonWidgetClass = getWidgetClass("UX.Button");
      assert(buttonWidgetClass, "Widget class UX.Button is not loaded!");
      buttonWidget = new buttonWidgetClass;
      returnedProcess = buttonWidgetClass.processLayout(buttonWidget, "");
    });

    it("should initialize with correct properties for AttributeBooleanValue class", function () {
      expect(element.widgetClass).to.equal(widgetClass);
    });

    it("should refresh correctly for AttributeBooleanValue class", function () {
      const widgetInstance = {
        "data": {
          "icon-position": "1-start-end"
        },
        "elements": {
          "widget": document.createElement("div")
        },
        "getTraceDescription": function () {
          return "description";
        }
      };
      buttonWidget.onConnect(returnedProcess, "");
      buttonWidget.dataInit();
      buttonWidget.dataUpdate(widgetInstance.data);

      element.refresh(buttonWidget);
      expect(buttonWidget.data).to.have.any.keys("icon", "icon-position", "format-error", "format-error-message");
      expect(buttonWidget.data["format-error"]).to.equal(true);
      expect(buttonWidget.data["format-error-message"]).to.equal("ERROR: Internal value cannot be represented by control. Either correct value or contact your system administrator.");
    });
  });

  // ===================================================================================================================
  // == Testing AttributeLength class ========================================================================
  // ===================================================================================================================
  describe("Test AttributeLength class", function () {

    let widgetClass;
    let propMin;
    let propMax;
    let defaultMin;
    let defaultMax;
    let element;
    let divElement;

    beforeEach(function () {
      Widget.structure = {};
      Widget.subWidgets = {};
      Widget.subWidgetWorkers = [];
      Widget.defaultValues = {};
      Widget.setters = {};
      Widget.getters = {};
      Widget.triggers = {};

      widgetClass = Widget;
      propMin = "min";
      propMax = "max";
      defaultMin = 0;
      defaultMax = 10;
      element = new AttributeLength(widgetClass, propMin, propMax, defaultMin, defaultMax);
    });

    it("should initialize with correct properties for AttributeLength class", function () {
      expect(element.widgetClass).to.equal(widgetClass);
      expect(element.propMin).to.equal(propMin);
      expect(element.propMax).to.equal(propMax);
      expect(element.defaultMin).to.equal(defaultMin);
      expect(element.defaultMax).to.equal(defaultMax);
    });

    it("check setters for AttributeLength class", function () {
      let setterKeys = Object.keys(element.widgetClass.setters);

      expect(setterKeys[setterKeys.length - 2]).to.equal("min");
      expect(setterKeys[setterKeys.length - 1]).to.equal("max");
    });

    it("should refresh correctly", function () {

      divElement = document.createElement("div");
      divElement.value = "";

      const widgetInstance = {
        "data": {
          "min": "12",
          "max": "100",
          "value": ""
        },
        "elements": {
          "widget": divElement
        },
        "widget": {
          "maxlengthHasBeenSet": ""
        },
        "getTraceDescription": function () {
          return "description";
        }
      };
      expect(widgetInstance.widget.maxlengthHasBeenSet).to.equal("");
      element.refresh(widgetInstance);

      expect(widgetInstance.elements.widget.maxlength).to.equal(100);
      expect(widgetInstance.elements.widget.minlength).to.equal(12);
      expect(widgetInstance.widget.maxlengthHasBeenSet).to.equal(true);
    });
  });

  // ===================================================================================================================
  // == Testing EventTrigger class ==========================================================================================
  // ===================================================================================================================
  describe("Test EventTrigger class", function () {

    let widgetClass;
    let triggerName;
    let eventName;
    let validate;
    let element;

    beforeEach(function () {
      Widget.structure = {};
      Widget.subWidgets = {};
      Widget.subWidgetWorkers = [];
      Widget.defaultValues = {};
      Widget.setters = {};
      Widget.getters = {};
      Widget.triggers = {};

      widgetClass = Widget;
      triggerName = "NameofTrigger";
      eventName = "EventName";
      validate = "Validated";
      element = new EventTrigger(widgetClass, triggerName, eventName, validate);
    });

    it("should initialize with correct properties for EventTrigger class", function () {
      expect(element.widgetClass).to.equal(widgetClass);
      expect(element.triggerName).to.equal(triggerName);
    });

    it("check registerTrigger() functionality", function () {
      let registerTriggerKey = Object.keys(element.widgetClass.triggers);
      expect(registerTriggerKey).to.include(triggerName);
    });

    it("check getTriggerMapping() functionality", function () {
      const widgetInstance = {
        "elements": {
          "widget": document.createElement("div")
        },
        "getTraceDescription": function () {
          return "description";
        }
      };
      let returnMapping = element.getTriggerMapping(widgetInstance);
      expect(returnMapping.event_name).to.equal(eventName);
      expect(returnMapping.validate).to.equal(validate);
      expect(returnMapping.element).to.have.tagName("div");
    });
  });

  // ===================================================================================================================
  // == Testing PropertyFilter class ===================================================================================
  // ===================================================================================================================
  describe("Test PropertyFilter class", function () {
    let widgetClass;
    let propId;
    let defaultValue;
    let element;

    beforeEach(function () {
      Widget.structure = {};
      Widget.subWidgets = {};
      Widget.subWidgetWorkers = [];
      Widget.defaultValues = {};
      Widget.setters = {};
      Widget.getters = {};
      Widget.triggers = {};

      widgetClass = Widget;
      propId = "tri-state";
      defaultValue = false;
      element = new PropertyFilter(widgetClass, propId, defaultValue);
    });

    it("should initialize with correct properties for PropertyFilter worker", function () {
      expect(element.widgetClass).to.equal(widgetClass);
      expect(element.propId).to.equal(propId);
    });

    it("check setters and default values for PropertyFilter worker", function () {
      let setterKeys = Object.keys(element.widgetClass.setters);
      expect(setterKeys[setterKeys.length - 1]).to.equal("tri-state");
      expect(element.defaultValue).to.equal(defaultValue);
    });
  });

  // ===================================================================================================================
  // == Testing ElementsValrep class ==========================================================================
  // ===================================================================================================================
  describe("Test ElementsValrep class", function () {
    let widgetClass;
    let tagName;
    let styleClass;
    let elementQuerySelector;
    let element;

    beforeEach(function () {
      Widget.structure = {};
      Widget.subWidgets = {};
      Widget.subWidgetWorkers = [];
      Widget.defaultValues = {};
      Widget.setters = {};
      Widget.getters = {};
      Widget.triggers = {};

      widgetClass = Widget;
      tagName = "fluent-option";
      styleClass = "";
      elementQuerySelector = "";
      element = new ElementsValrep(widgetClass, tagName, styleClass, elementQuerySelector);
    });

    it("should initialize with correct properties for ElementsValrep worker", function () {
      expect(element.widgetClass).to.equal(widgetClass);
      expect(element.tagName).to.equal(tagName);
      expect(element.styleClass).to.equal(styleClass);
      expect(element.elementQuerySelector).to.equal(elementQuerySelector);
    });

    it("check setters and default values for ElementsValrep worker", function () {
      let setterKeys = Object.keys(element.widgetClass.setters);
      let defaultValues = element.widgetClass.defaultValues;
      let setterKeysForUniface = Object.keys(element.widgetClass.setters);
      let defaultValuesForUniface = element.widgetClass.defaultValues;

      expect(setterKeysForUniface[1]).to.equal("display-format");
      expect(defaultValuesForUniface["display-format"]).to.equal("rep");
      expect(setterKeys[0]).to.equal("valrep");
      expect(defaultValues["valrep"].length).to.equal(0);
    });

    it("should refresh correctly for ElementsValrep worker", function () {
      const valRepArray = [
        {
          "value": "1",
          "representation": "option one"
        },
        {
          "value": "2",
          "representation": "option two"
        },
        {
          "value": "3",
          "representation": "option three"
        }
      ];

      const widgetInstance = {
        "data": {
          "valrep": valRepArray,
          "display-format": "val"
        },
        "elements": {
          "widget": document.createElement("div")
        },
        "getTraceDescription": function () {
          return "description";
        }
      };
      element.refresh(widgetInstance);
      let selectOptionArray = widgetInstance.elements.widget.querySelectorAll("fluent-option");
      expect(selectOptionArray.length).to.equal(valRepArray.length);
      selectOptionArray.forEach(function (node, index) {
        expect(node.value).to.equal(index.toString());
      });
    });
  });

  // == Testing AttributeUIBlocking class ==========================================================================
  // ===================================================================================================================
  describe("Test AttributeUIBlocking class", function () {
    let widgetClass, element;

    beforeEach(function () {
      Widget.structure = {};
      Widget.subWidgets = {};
      Widget.subWidgetWorkers = [];
      Widget.defaultValues = {};
      Widget.setters = {};
      Widget.getters = {};
      Widget.triggers = {};

      widgetClass = Widget;
      element = new AttributeUIBlocking(widgetClass, "readonly");
    });

    it("should initialize with correct properties", function () {
      expect(element.widgetClass).to.equal(widgetClass);
      expect(element.uiblocking).to.equal("readonly");
    });

    it("check setters and default values", function () {
      let setterKeys = Object.keys(element.widgetClass.setters);
      expect(setterKeys[setterKeys.length - 1]).to.equal("uiblocked");
    });

    it("should refresh correctly", function () {
      const classListStub = {
        "add": sinon.spy(),
        "remove": sinon.spy()
      };

      const widgetInstance = {
        "data": {
          "uiblocked": true
        },
        "elements": {
          "widget": {
            "classList": classListStub,
            "disabled": false,
            "readOnly": false
          }
        },
        "getTraceDescription": function () {
          return "description";
        },
        "error": sinon.spy(),
        "toBoolean": function (val) {
          return Boolean(val);
        }
      };

      // Should add class and readonly element when uiblocked is true and block type is 'readonly'.
      element.refresh(widgetInstance);
      expect(widgetInstance.elements.widget.classList.add.calledWith("u-blocked")).to.be.true;
      expect(widgetInstance.elements.widget.readOnly).to.be.true;

      // Should remove class when uiblocked is false.
      widgetInstance.data["uiblocked"] = false;
      element.refresh(widgetInstance);
      expect(widgetInstance.elements.widget.readOnly).to.be.false;
      expect(widgetInstance.elements.widget.classList.remove.calledWith("u-blocked")).to.be.true;

    });

  });

  describe("Test AttributeUIBlocking class for invalid uiblocking", function () {
    let widgetClass, element;

    beforeEach(function () {
      Widget.structure = {};
      Widget.subWidgets = {};
      Widget.subWidgetWorkers = [];
      Widget.defaultValues = {};
      Widget.setters = {};
      Widget.getters = {};
      Widget.triggers = {};

      widgetClass = Widget;
      element = new AttributeUIBlocking(widgetClass, "invalid");
    });

    it("should initialize with correct properties", function () {
      expect(element.widgetClass).to.equal(widgetClass);
      expect(element.uiblocking).to.equal("invalid");
    });

    it("check setters and default values", function () {
      let setterKeys = Object.keys(element.widgetClass.setters);
      expect(setterKeys[setterKeys.length - 1]).to.equal("uiblocked");
    });

    it("should refresh correctly", function () {
      const classListStub = {
        "add": sinon.spy(),
        "remove": sinon.spy()
      };
      const widgetInstance = {
        "data": {
          "uiblocked": true
        },
        "elements": {
          "widget": {
            "classList": classListStub,
            "disabled": false,
            "readOnly": false
          }
        },
        "getTraceDescription": function () {
          return "description";
        },
        "error": sinon.spy()
      };

      // Should add class when uiblocked.
      element.refresh(widgetInstance);
      expect(widgetInstance.elements.widget.classList.add.calledWith("u-blocked")).to.be.true;

      expect(widgetInstance.error.calledOnce).to.be.true;
      expect(widgetInstance.error.calledWith("AttributeUIBlocking", "Invalid block type", "invalid")).to.be.true;
    });
  });

  // ===================================================================================================================
  // == Testing ChildWidgets class =================================================================================
  // ===================================================================================================================
  describe("Test ChildWidgets class", function () {
    let widgetClass;
    let widgetInstance;
    let mockObjectDefinition;

    // Mock ObjectDefinition class for testing.
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

    beforeEach(function () {
      widgetClass = getWidgetClass("button");

      // Create a mock widget instance.
      widgetInstance = {
        "data": {},
        "elements": {
          "widget": document.createElement("div")
        },
        "getTraceDescription": function () {
          return "description";
        }
      };

      // Create mock object definition.
      mockObjectDefinition = new MockObjectDefinition("parent", {});
    });

    afterEach(function () {
      if (widgetInstance.elements.widget.parentNode) {
        widgetInstance.elements.widget.parentNode.removeChild(widgetInstance.elements.widget);
      }
    });

    describe("Element Creation (DOM)", function () {
      it("should create HTMLElements for entity children", function () {
        const worker = new ChildWidgets(widgetClass, "span", null, null);

        mockObjectDefinition.addChild(new MockObjectDefinition("entity1", {}, "entity"));
        mockObjectDefinition.addChild(new MockObjectDefinition("entity2", {}, "entity"));

        const layout = worker.getLayout(mockObjectDefinition);

        expect(layout).to.have.lengthOf(2);
        expect(layout[0]).to.be.instanceof(HTMLElement);
        expect(layout[0].tagName.toLowerCase()).to.equal("span");
        expect(layout[0].id).to.equal("uent:entity1");
        expect(layout[1].id).to.equal("uent:entity2");
      });

      it("should create correct element tagNames", function () {
        const worker = new ChildWidgets(widgetClass, "div", null, null);

        mockObjectDefinition.addChild(new MockObjectDefinition("entity1", {}, "entity"));

        const layout = worker.getLayout(mockObjectDefinition);

        expect(layout[0].tagName.toLowerCase()).to.equal("div");
      });

      it("should handle both entity and field bindings", function () {
        const worker = new ChildWidgets(widgetClass, "span", null, null);

        mockObjectDefinition.addChild(new MockObjectDefinition("entity1", {}, "entity"));
        mockObjectDefinition.addChild(new MockObjectDefinition("field1", {}, "field"));

        const layout = worker.getLayout(mockObjectDefinition);

        expect(layout).to.have.lengthOf(2);
        expect(layout[0].id).to.equal("uent:entity1");
        expect(layout[1].id).to.equal("ufld:field1");
      });

      it("should skip children without binding template", function () {
        const worker = new ChildWidgets(widgetClass, "span", null, null);

        mockObjectDefinition.addChild(new MockObjectDefinition("entity1", {}, "entity"));
        mockObjectDefinition.addChild(new MockObjectDefinition("other1", {}, "other"));

        const layout = worker.getLayout(mockObjectDefinition);

        expect(layout).to.have.lengthOf(1);
        expect(layout[0].id).to.equal("uent:entity1");
      });

      it("should render elements to DOM correctly", function () {
        const worker = new ChildWidgets(widgetClass, "span", null, null);

        mockObjectDefinition.addChild(new MockObjectDefinition("entity1", {}, "entity"));

        const layout = worker.getLayout(mockObjectDefinition);
        widgetInstance.elements.widget.appendChild(layout[0]);

        expect(widgetInstance.elements.widget.children).to.have.lengthOf(1);
        expect(widgetInstance.elements.widget.children[0].id).to.equal("uent:entity1");
      });
    });

    describe("Slot Distribution (DOM)", function () {
      it("should return all children when slotId is null", function () {
        const worker = new ChildWidgets(widgetClass, "div", null, null);

        mockObjectDefinition.addChild(new MockObjectDefinition("child1", { "area-slot": "header" }, "entity"));
        mockObjectDefinition.addChild(new MockObjectDefinition("child2", { "area-slot": "main" }, "entity"));
        mockObjectDefinition.addChild(new MockObjectDefinition("child3", { "area-slot": "footer" }, "entity"));

        const layout = worker.getLayout(mockObjectDefinition);

        expect(layout).to.have.lengthOf(3);
        expect(layout[0]).to.be.instanceof(HTMLElement);
        expect(layout[0].id).to.equal("uent:child1");
      });

      it("should filter children by slot", function () {
        const slotConfig = {
          "propertyName": "area-slot",
          "defaultSlot": "main",
          "validSlots": ["header", "main", "footer"]
        };
        const worker = new ChildWidgets(widgetClass, "div", "header", slotConfig);

        mockObjectDefinition.addChild(new MockObjectDefinition("child1", { "area-slot": "header" }, "entity"));
        mockObjectDefinition.addChild(new MockObjectDefinition("child2", { "area-slot": "main" }, "entity"));

        const layout = worker.getLayout(mockObjectDefinition);

        expect(layout).to.have.lengthOf(1);
        expect(layout[0]).to.be.instanceof(HTMLElement);
        expect(layout[0].id).to.equal("uent:child1");
      });

      it("should cache distribution results", function () {
        const slotConfig = {
          "propertyName": "area-slot",
          "defaultSlot": "main",
          "validSlots": ["header", "main", "footer"]
        };
        const worker = new ChildWidgets(widgetClass, "div", "main", slotConfig);

        mockObjectDefinition.addChild(new MockObjectDefinition("child1", { "area-slot": "main" }, "entity"));

        const layout1 = worker.getLayout(mockObjectDefinition);
        const layout2 = worker.getLayout(mockObjectDefinition);

        expect(mockObjectDefinition._slottedGroups).to.exist;
        expect(layout1.length).to.equal(layout2.length);
      });

      it("should use property-based assignment when children have slot property", function () {
        const slotConfig = {
          "propertyName": "area-slot",
          "defaultSlot": "main",
          "validSlots": ["header", "main", "footer"]
        };
        const workerMain = new ChildWidgets(widgetClass, "div", "main", slotConfig);
        const workerHeader = new ChildWidgets(widgetClass, "div", "header", slotConfig);

        mockObjectDefinition.addChild(new MockObjectDefinition("child1", { "area-slot": "header" }, "entity"));
        mockObjectDefinition.addChild(new MockObjectDefinition("child2", { "area-slot": "main" }, "entity"));
        mockObjectDefinition.addChild(new MockObjectDefinition("child3", { "area-slot": "main" }, "entity"));

        const mainLayout = workerMain.getLayout(mockObjectDefinition);
        const headerLayout = workerHeader.getLayout(mockObjectDefinition);

        expect(headerLayout).to.have.lengthOf(1);
        expect(headerLayout[0]).to.be.instanceof(HTMLElement);
        expect(headerLayout[0].id).to.equal("uent:child1");
        expect(mainLayout).to.have.lengthOf(2);
        expect(mainLayout[0].id).to.equal("uent:child2");
        expect(mainLayout[1].id).to.equal("uent:child3");
      });

      it("should use index-based assignment when children lack slot property", function () {
        const slotConfig = {
          "propertyName": "area-slot",
          "defaultSlot": "main",
          "indexRules": {
            "2": {
              "header": [0],
              "main": [1]
            }
          }
        };
        const workerMain = new ChildWidgets(widgetClass, "div", "main", slotConfig);
        const workerHeader = new ChildWidgets(widgetClass, "div", "header", slotConfig);

        mockObjectDefinition.addChild(new MockObjectDefinition("child1", {}, "entity"));
        mockObjectDefinition.addChild(new MockObjectDefinition("child2", {}, "entity"));

        const mainLayout = workerMain.getLayout(mockObjectDefinition);
        const headerLayout = workerHeader.getLayout(mockObjectDefinition);

        expect(headerLayout).to.have.lengthOf(1);
        expect(headerLayout[0]).to.be.instanceof(HTMLElement);
        expect(headerLayout[0].id).to.equal("uent:child1");
        expect(mainLayout).to.have.lengthOf(1);
        expect(mainLayout[0]).to.be.instanceof(HTMLElement);
        expect(mainLayout[0].id).to.equal("uent:child2");
      });

      it("should use defaultSlot for invalid slot values", function () {
        const slotConfig = {
          "propertyName": "area-slot",
          "defaultSlot": "main",
          "validSlots": ["header", "main", "footer"]
        };
        const worker = new ChildWidgets(widgetClass, "div", null, "main", slotConfig);

        mockObjectDefinition.addChild(new MockObjectDefinition("child1", { "area-slot": "invalid" }));
        mockObjectDefinition.addChild(new MockObjectDefinition("child2", { "area-slot": "main" }));

        const layout = worker.getLayout(mockObjectDefinition);

        expect(layout).to.have.lengthOf(2);
      });

      it("should exclude children when defaultSlot is null and no valid slot", function () {
        const slotConfig = {
          "propertyName": "area-slot",
          "defaultSlot": null,
          "validSlots": ["header", "main", "footer"]
        };
        const worker = new ChildWidgets(widgetClass, "div", "main", slotConfig);

        mockObjectDefinition.addChild(new MockObjectDefinition("child1", {}, "entity"));
        mockObjectDefinition.addChild(new MockObjectDefinition("child2", { "area-slot": "main" }, "entity"));

        const layout = worker.getLayout(mockObjectDefinition);

        expect(layout).to.have.lengthOf(1);
        expect(layout[0]).to.be.instanceof(HTMLElement);
        expect(layout[0].id).to.equal("uent:child2");
      });
    });

    describe("Multiple Slots Integration", function () {
      it("should distribute children across multiple slots", function () {
        const slotConfig = {
          "propertyName": "area-slot",
          "defaultSlot": "main",
          "validSlots": ["header", "main", "footer"]
        };

        const headerWorker = new ChildWidgets(widgetClass, "div", "header", slotConfig);
        const mainWorker = new ChildWidgets(widgetClass, "div", "main", slotConfig);
        const footerWorker = new ChildWidgets(widgetClass, "div", "footer", slotConfig);

        mockObjectDefinition.addChild(new MockObjectDefinition("child1", { "area-slot": "header" }, "entity"));
        mockObjectDefinition.addChild(new MockObjectDefinition("child2", { "area-slot": "main" }, "entity"));
        mockObjectDefinition.addChild(new MockObjectDefinition("child3", { "area-slot": "footer" }, "entity"));

        const headerLayout = headerWorker.getLayout(mockObjectDefinition);
        const mainLayout = mainWorker.getLayout(mockObjectDefinition);
        const footerLayout = footerWorker.getLayout(mockObjectDefinition);

        expect(headerLayout).to.have.lengthOf(1);
        expect(mainLayout).to.have.lengthOf(1);
        expect(footerLayout).to.have.lengthOf(1);
        expect(headerLayout[0]).to.be.instanceof(HTMLElement);
        expect(headerLayout[0].id).to.equal("uent:child1");
        expect(mainLayout[0].id).to.equal("uent:child2");
        expect(footerLayout[0].id).to.equal("uent:child3");
      });

      it("should share cached distribution across multiple workers", function () {
        const slotConfig = {
          "propertyName": "area-slot",
          "defaultSlot": "main",
          "validSlots": ["header", "main", "footer"]
        };

        const worker1 = new ChildWidgets(widgetClass, "div", "header", slotConfig);
        const worker2 = new ChildWidgets(widgetClass, "div", "main", slotConfig);

        mockObjectDefinition.addChild(new MockObjectDefinition("child1", { "area-slot": "header" }, "entity"));
        mockObjectDefinition.addChild(new MockObjectDefinition("child2", { "area-slot": "main" }, "entity"));

        worker1.getLayout(mockObjectDefinition);
        worker2.getLayout(mockObjectDefinition);

        expect(mockObjectDefinition._slottedGroups).to.exist;
        expect(mockObjectDefinition._slottedGroups.header).to.have.lengthOf(1);
        expect(mockObjectDefinition._slottedGroups.main).to.have.lengthOf(1);
      });
    });

    describe("Edge Cases and Error Conditions (DOM)", function () {
      it("should handle empty children gracefully", function () {
        const worker = new ChildWidgets(widgetClass, "div", null, null);

        const layout = worker.getLayout(mockObjectDefinition);

        expect(layout).to.have.lengthOf(0);
      });

      it("should handle null children array", function () {
        const worker = new ChildWidgets(widgetClass, "div", null, null);
        mockObjectDefinition.children = null;

        const layout = worker.getLayout(mockObjectDefinition);

        expect(layout).to.have.lengthOf(0);
      });

      it("should handle slot with no matching children", function () {
        const slotConfig = {
          "propertyName": "area-slot",
          "defaultSlot": "main",
          "validSlots": ["header", "main", "footer"]
        };
        const worker = new ChildWidgets(widgetClass, "div", "sidebar", slotConfig);

        mockObjectDefinition.addChild(new MockObjectDefinition("child1", { "area-slot": "main" }, "entity"));

        const layout = worker.getLayout(mockObjectDefinition);

        expect(layout).to.have.lengthOf(0);
      });

      it("should handle mixed child types", function () {
        const worker = new ChildWidgets(widgetClass, "span", null, null);

        mockObjectDefinition.addChild(new MockObjectDefinition("entity1", {}, "entity"));
        mockObjectDefinition.addChild(new MockObjectDefinition("field1", {}, "field"));
        mockObjectDefinition.addChild(new MockObjectDefinition("other1", {}, "other"));

        const layout = worker.getLayout(mockObjectDefinition);

        expect(layout).to.have.lengthOf(2);
        expect(layout[0]).to.be.instanceof(HTMLElement);
        expect(layout[0].id).to.equal("uent:entity1");
        expect(layout[1].id).to.equal("ufld:field1");
      });

      it("should handle large number of children", function () {
        const worker = new ChildWidgets(widgetClass, "div", null, null);

        for (let i = 0; i < 100; i++) {
          mockObjectDefinition.addChild(new MockObjectDefinition(`child${i}`, {}, "entity"));
        }

        const layout = worker.getLayout(mockObjectDefinition);

        expect(layout).to.have.lengthOf(100);
        expect(layout[0]).to.be.instanceof(HTMLElement);
      });
    });

    describe("Integration with Element Worker", function () {
      it("should work as child worker in element structure", function () {
        const slotConfig = {
          "propertyName": "area-slot",
          "defaultSlot": "main"
        };

        const childWidgetsWorker = new ChildWidgets(widgetClass, "div", "main", slotConfig);

        expect(childWidgetsWorker).to.be.instanceof(WorkerBase);
        expect(childWidgetsWorker).to.respondTo("getLayout");
      });

      it("should generate layout compatible with Element worker", function () {
        const worker = new ChildWidgets(widgetClass, "span", null, null);

        mockObjectDefinition.addChild(new MockObjectDefinition("entity1", {}, "entity"));

        const layout = worker.getLayout(mockObjectDefinition);

        expect(Array.isArray(layout)).to.equal(true);
        expect(layout.every(item => item instanceof HTMLElement)).to.equal(true);
      });
    });
  });

  // ===================================================================================================================
  // == Testing WidgetOccurrence class ============================================================================
  // ===================================================================================================================
  describe("Test WidgetOccurrence class", function () {
    let widgetClass;
    let tagName;
    let bindingId;
    let worker;
    let objectDefinition;

    beforeEach(function () {
      Widget.structure = {};
      Widget.subWidgets = {};
      Widget.subWidgetWorkers = [];
      Widget.defaultValues = {};
      Widget.setters = {};
      Widget.getters = {};
      Widget.triggers = {};

      widgetClass = Widget;
      tagName = "span";
      bindingId = "uocc:test-occurrence";
      worker = new WidgetOccurrence(widgetClass, tagName, bindingId);

      // Mock objectDefinition with some supported functions.
      objectDefinition = {
        "getName": sinon.stub().returns("CUSTOMER"),
        "getShortName": sinon.stub().returns("CUST")
      };
    });

    it("should initialize with correct properties for WidgetOccurrence class", function () {
      expect(worker.widgetClass).to.equal(widgetClass);
      expect(worker.tagName).to.equal(tagName);
      expect(worker.bindingId).to.equal(bindingId);
    });

    it("should create element with specified tag name", function () {
      let elements = worker.getLayout(objectDefinition);

      expect(elements).to.be.an("array");
      expect(elements).to.have.lengthOf(1);
      expect(elements[0]).to.have.tagName(tagName.toUpperCase());
    });

    it("should set element id with simple bindingId (no substitutions)", function () {
      let elements = worker.getLayout(objectDefinition);

      expect(elements[0].id).to.equal(bindingId);
    });

    it("should substitute {{getName()}} in bindingId", function () {
      worker.bindingId = "uocc:{{getName()}}";
      let elements = worker.getLayout(objectDefinition);

      expect(elements[0].id).to.equal("uocc:CUSTOMER");
      expect(objectDefinition.getName.calledOnce).to.be.true;
    });

    it("should substitute {{getShortName()}} in bindingId", function () {
      worker.bindingId = "uocc:{{getShortName()}}";
      let elements = worker.getLayout(objectDefinition);

      expect(elements[0].id).to.equal("uocc:CUST");
      expect(objectDefinition.getShortName.calledOnce).to.be.true;
    });

    it("should handle case-sensitive function names and return error for incorrect case", function () {
      worker.bindingId = "uocc:{{GetName()}}";
      let elements = worker.getLayout(objectDefinition);

      // Function names are case-sensitive, so GetName() should fail.
      expect(elements[0].id).to.include("Unknown function detected");
      expect(elements[0].id).to.include("GetName");
    });

    it("should work with different tag names", function () {
      worker.tagName = "div";
      let elements = worker.getLayout(objectDefinition);

      expect(elements[0]).to.have.tagName("DIV");
      expect(elements).to.have.lengthOf(1);
    });

    it("should handle empty bindingId", function () {
      worker.bindingId = "";
      let elements = worker.getLayout(objectDefinition);

      expect(elements[0].id).to.equal("");
      expect(elements).to.have.lengthOf(1);
    });

    it("should handle bindingId with only text (no substitutions)", function () {
      worker.bindingId = "plain-text-id";
      let elements = worker.getLayout(objectDefinition);

      expect(elements[0].id).to.equal("plain-text-id");
    });

    it("should handle invalid function call gracefully", function () {
      worker.bindingId = "uocc:{{invalidFunction()}}";
      let elements = worker.getLayout(objectDefinition);

      // Should return error message as the id.
      expect(elements[0].id).to.include("Unknown function detected");
      expect(elements[0].id).to.include("invalidFunction");
    });

    it("should handle malformed instruction gracefully", function () {
      worker.bindingId = "uocc:{{getName}}"; // Missing parentheses.
      let elements = worker.getLayout(objectDefinition);

      // Should return error message as the id.
      expect(elements[0].id).to.include("Invalid instruction detected");
    });

    it("should handle nested curly braces", function () {
      worker.bindingId = "uocc:{{getName()}}";
      let elements = worker.getLayout(objectDefinition);

      expect(elements[0].id).to.equal("uocc:CUSTOMER");
    });

    it("should preserve special characters in bindingId", function () {
      worker.bindingId = "uocc:test-id_with-special.chars:{{getName()}}";
      let elements = worker.getLayout(objectDefinition);

      expect(elements[0].id).to.equal("uocc:test-id_with-special.chars:CUSTOMER");
    });

    it("should work with custom tag names like web components", function () {
      worker.tagName = "fluent-data-grid-row";
      let elements = worker.getLayout(objectDefinition);

      expect(elements[0]).to.have.tagName("FLUENT-DATA-GRID-ROW");
      expect(elements).to.have.lengthOf(1);
    });

    it("should return array even for single element", function () {
      let elements = worker.getLayout(objectDefinition);

      expect(Array.isArray(elements)).to.be.true;
      expect(elements).to.have.lengthOf(1);
    });

    it("should create fresh element on each getLayout() call", function () {
      let elements1 = worker.getLayout(objectDefinition);
      let elements2 = worker.getLayout(objectDefinition);

      expect(elements1[0]).to.not.equal(elements2[0]);
      expect(elements1[0].id).to.equal(elements2[0].id);
    });
  });
})();
