import { getWidgetClass } from "../../src/ux/framework/common/dsp_connector.js";
import { Widget } from "../../src/ux/framework/common/widget.js";
import { BaseHtmlAttribute } from "../../src/ux/framework/workers/base_html_attribute.js";
import { Element } from "../../src/ux/framework/workers/element.js";
import { HtmlAttribute } from "../../src/ux/framework/workers/html_attribute.js";
import { HtmlAttributeBoolean } from "../../src/ux/framework/workers/html_attribute_boolean.js";
import { HtmlAttributeChoice } from "../../src/ux/framework/workers/html_attribute_choice.js";
import { HtmlAttributeMinMaxLength } from "../../src/ux/framework/workers/html_attribute_min_max_length.js";
import { HtmlAttributeNumber } from "../../src/ux/framework/workers/html_attribute_number.js";
import { HtmlValueAttributeBoolean } from "../../src/ux/framework/workers/html_value_attribute_boolean.js";
import { IgnoreProperty } from "../../src/ux/framework/workers/ignore_property.js";
import { SlottedElement } from "../../src/ux/framework/workers/slotted_element.js";
import { SlottedElementsByValRep } from "../../src/ux/framework/workers/slotted_element_by_valrep.js";
import { SlottedError } from "../../src/ux/framework/workers/slotted_error.js";
import { SlottedSubWidget } from "../../src/ux/framework/workers/slotted_sub_widget.js";
import { StyleClass } from "../../src/ux/framework/workers/style_class.js";
import { SubWidgetsByProperty } from "../../src/ux/framework/workers/sub_widgets_by_property.js";
import { Trigger } from "../../src/ux/framework/workers/trigger.js";
import { UIBlock } from "../../src/ux/framework/workers/ui_block.js";
import { Worker } from "../../src/ux/framework/common/worker.js";

(function () {
  "use strict";

  // This test depends on Button, see calls to getWidgetClass

  const assert = chai.assert;
  const expect = chai.expect;

  describe("Tests for Workers", function () {

    let widgetClass;
    let worker;
    let elementQuerySelector;
    let element;

    beforeEach(function () {
      widgetClass = {};
      worker = new Worker(widgetClass);
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
      instance = new StyleClass(widgetClass, defaultClassList);
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
      childWorkers = [new StyleClass(widgetClass, ["u-switch"]), new HtmlAttribute(widgetClass, "html:role", "role", "switch"), new SlottedElement(widgetClass, "span", "u-label-text", ".u-label-text", "", "label-text"), new SlottedElement(widgetClass, "span", "u-checked-message", ".u-checked-message", "checked-message", "checked-message"), new Trigger(widgetClass, "onchange", "change", true)];
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
  // == Testing SlottedElement class =================================================================================
  // ===================================================================================================================
  describe("Test SlottedElement class", function () {

    let widgetClass;
    let propText;
    let defaultText;
    let propIcon;
    let defaultIcon;
    let slottedElement;

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
      slottedElement = new SlottedElement(widgetClass, "", "", "", "", propText, defaultText, propIcon, defaultIcon);
    });

    it("should initialize with correct properties for SlottedElement class", function () {
      expect(slottedElement.widgetClass).to.equal(widgetClass);
      expect(slottedElement.textPropId).to.equal(propText);
      expect(slottedElement.textDefaultValue).to.equal(defaultText);
      expect(slottedElement.iconPropId).to.equal(propIcon);
      expect(slottedElement.iconDefaultValue).to.equal(defaultIcon);
    });

    it("check getters/setters changed for propIcon, propText for SlottedElement class", function () {
      expect(slottedElement.widgetClass.defaultValues.icon).to.equal(defaultIcon);
      expect(slottedElement.widgetClass.defaultValues.text).to.equal(defaultText);
    });

    it("should refresh correctly for SlottedElement class", function () {
      slottedElement.refresh(widgetInstance);
      let mockIconClasses = ["ms-Icon", "ms-Icon--testicon.png"];
      expect(widgetInstance.elements.widget.hidden).to.equal(false);
      expect([...widgetInstance.elements.widget.classList].includes(...mockIconClasses)).to.equal(true);

      widgetInstance.data["icon"] = "";
      slottedElement.refresh(widgetInstance);
      expect(widgetInstance.elements.widget.innerText).to.equal("defaultText");
      expect([...widgetInstance.elements.widget.classList].includes(...mockIconClasses)).to.equal(false);
    });
  });

  // ===================================================================================================================
  // == Testing SlottedError class =====================================================================================
  // ===================================================================================================================
  describe("Test SlottedError class", function () {

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
      slottedError = new SlottedError(widgetClass, "", "", "", "");
    });

    it("should initialize with correct properties for SlottedError class", function () {
      expect(slottedError.widgetClass).to.equal(widgetClass);
    });

    it("check setters were added for SlottedError class", function () {
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

    it("should refresh correctly for SlottedError class", function () {
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
  // == Testing SlottedSubWidget class =====================================================================================
  // ====================================================================================================================
  describe("Test SlottedSubWidget class", function () {
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
      slottedWidget = new SlottedSubWidget(widgetClass, tagName, "styleClass", "", "", subWidgetId, subWidgetName, {}, "");
    });

    it("should initialize with correct properties for SlottedSubWidget class", function () {
      expect(slottedWidget.widgetClass).to.equal(widgetClass);
    });

    it("check getters/setters changed and subWidget added", function () {
      // debugger;
      expect(slottedWidget.subWidgetClass).to.equal(subWidgetClass);
      expect(slottedWidget.propId).to.equal("undefined");
    });

    it("check generate layout for SlottedSubWidget class", function () {
      let layoutElement = slottedWidget.getLayout();

      expect(layoutElement).to.have.class("u-sw-undefined");
      expect(layoutElement.hidden).to.equal(true);
      expect(layoutElement).to.have.tagName("FLUENT-BUTTON");
    });

    it("should refresh correctly for SlottedSubWidget class", function () {
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
  // == Testing SubWidgetsByProperty class ================================================================================
  // ===================================================================================================================
  describe("Test SubWidgetsByProperty class", function () {

    let widgetClass;
    let tagName;
    let styleClass;
    let elementQuerySelector;
    let propId;
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
      element = new SubWidgetsByProperty(widgetClass, tagName, styleClass, elementQuerySelector, propId);
    });

    it("should initialize with correct properties", function () {
      expect(element.widgetClass).to.equal(widgetClass);
      expect(element.tagName).to.equal(tagName);
      expect(element.styleClass).to.equal(styleClass);
      expect(element.elementQuerySelector).to.equal(elementQuerySelector);
      expect(element.propId).to.equal(propId);
    });
  });

  // ===================================================================================================================
  // == Testing BaseHtmlAttribute class ================================================================================
  // ===================================================================================================================
  describe("Test BaseHtmlAttribute class", function () {

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
      worker = new BaseHtmlAttribute(widgetClass, propId, attrName, defaultValue);
    });

    it("should initialize with correct properties for BaseHtmlAttribute class", function () {
      expect(worker.widgetClass).to.equal(widgetClass);
      expect(worker.propId).to.equal(propId);
      expect(worker.attrName).to.equal(attrName);
      expect(worker.defaultValue).to.equal(defaultValue);

    });

    it("check getters/setters for BaseHtmlAttribute class", function () {
      let length = worker.widgetClass.setters.value.length;

      expect(worker.widgetClass.getters.value.propId).to.equal(propId);
      expect(worker.widgetClass.setters.value[length - 1].propId).to.equal(propId);
    });

    it("check setHtmlAttribute for BaseHtmlAttribute class", function () {
      element = {
        "elements": {
          "widget": document.createElement("div")
        }
      };
      worker.setHtmlAttribute(element, "new Value");
      expect(element[attrName]).to.equal("new Value");
    });

    // refresh() doesn't do anything.
    it("check refresh() for BaseHtmlAttribute class", function () {
      worker.refresh({});
    });

    it("check getValue() for BaseHtmlAttribute class", function () {
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
    it("check getValueUpdaters() for BaseHtmlAttribute class", function () {
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
  // == Testing HtmlAttribute class ====================================================================================
  // ===================================================================================================================
  describe("Test HtmlAttribute class", function () {

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
      element = new HtmlAttribute(widgetClass, propId, attrName, defaultValue);
    });

    it("should initialize with correct properties for HtmlAttribute class", function () {
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
  // == Testing HtmlAttributeChoice class ==============================================================================
  // ===================================================================================================================
  describe("Test HtmlAttributeChoice class", function () {

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
      element = new HtmlAttributeChoice(widgetClass, propId, attrName, choices, defaultValue);
    });

    it("should initialize with correct properties for HtmlAttributeChoice class", function () {
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
  // == Testing HtmlAttributeNumber class ==============================================================================
  // ===================================================================================================================
  describe("Test HtmlAttributeNumber class", function () {

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
      element = new HtmlAttributeNumber(widgetClass, propId, attrName, min, max, defaultValue);
    });

    it("should initialize with correct properties for HtmlAttributeNumber class", function () {
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
  // == Testing HtmlAttributeBoolean class =============================================================================
  // ===================================================================================================================
  describe("Test HtmlAttributeBoolean class", function () {

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
      element = new HtmlAttributeBoolean(widgetClass, propId, attrName, defaultValue);
    });

    it("should initialize with correct properties for HtmlAttributeBoolean class", function () {
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
  // == Testing HtmlValueAttributeBoolean class ========================================================================
  // ===================================================================================================================
  describe("Test HtmlValueAttributeBoolean class", function () {

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
      element = new HtmlValueAttributeBoolean(widgetClass, propId, attrName, defaultValue);
      buttonWidgetClass = getWidgetClass("UX.Button");
      assert(buttonWidgetClass, "Widget class UX.Button is not loaded!");
      buttonWidget = new buttonWidgetClass;
      returnedProcess = buttonWidgetClass.processLayout(buttonWidget, "");
    });

    it("should initialize with correct properties for HtmlValueAttributeBoolean class", function () {
      expect(element.widgetClass).to.equal(widgetClass);
    });

    it("should refresh correctly for HtmlValueAttributeBoolean class", function () {
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
  // == Testing HtmlAttributeMinMaxLength class ========================================================================
  // ===================================================================================================================
  describe("Test HtmlAttributeMinMaxLength class", function () {

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
      element = new HtmlAttributeMinMaxLength(widgetClass, propMin, propMax, defaultMin, defaultMax);
    });

    it("should initialize with correct properties for HtmlAttributeMinMaxLength class", function () {
      expect(element.widgetClass).to.equal(widgetClass);
      expect(element.propMin).to.equal(propMin);
      expect(element.propMax).to.equal(propMax);
      expect(element.defaultMin).to.equal(defaultMin);
      expect(element.defaultMax).to.equal(defaultMax);
    });

    it("check setters for HtmlAttributeMinMaxLength class", function () {
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
  // == Testing Trigger class ==========================================================================================
  // ===================================================================================================================
  describe("Test Trigger class", function () {

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
      element = new Trigger(widgetClass, triggerName, eventName, validate);
    });

    it("should initialize with correct properties for Trigger class", function () {
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
  // == Testing IgnoreProperty class ===================================================================================
  // ===================================================================================================================
  describe("Test IgnoreProperty class", function () {
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
      element = new IgnoreProperty(widgetClass, propId, defaultValue);
    });

    it("should initialize with correct properties for IgnoreProperty worker", function () {
      expect(element.widgetClass).to.equal(widgetClass);
      expect(element.propId).to.equal(propId);
    });

    it("check setters and default values for IgnoreProperty worker", function () {
      let setterKeys = Object.keys(element.widgetClass.setters);
      expect(setterKeys[setterKeys.length - 1]).to.equal("tri-state");
      expect(element.defaultValue).to.equal(defaultValue);
    });
  });

  // ===================================================================================================================
  // == Testing SlottedElementsByValRep class ==========================================================================
  // ===================================================================================================================
  describe("Test SlottedElementsByValRep class", function () {
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
      element = new SlottedElementsByValRep(widgetClass, tagName, styleClass, elementQuerySelector);
    });

    it("should initialize with correct properties for SlottedElementsByValRep worker", function () {
      expect(element.widgetClass).to.equal(widgetClass);
      expect(element.tagName).to.equal(tagName);
      expect(element.styleClass).to.equal(styleClass);
      expect(element.elementQuerySelector).to.equal(elementQuerySelector);
    });

    it("check setters and default values for SlottedElementsByValRep worker", function () {
      let setterKeys = Object.keys(element.widgetClass.setters);
      let defaultValues = element.widgetClass.defaultValues;
      let setterKeysForUniface = Object.keys(element.widgetClass.setters);
      let defaultValuesForUniface = element.widgetClass.defaultValues;

      expect(setterKeysForUniface[1]).to.equal("display-format");
      expect(defaultValuesForUniface["display-format"]).to.equal("rep");
      expect(setterKeys[0]).to.equal("valrep");
      expect(defaultValues["valrep"].length).to.equal(0);
    });

    it("should refresh correctly for SlottedElementsByValRep worker", function () {
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

  // ===================================================================================================================
  // == Testing SubWidgetsByProperty class ==========================================================================
  // ===================================================================================================================
  describe("Test SubWidgetsByProperty Class", function () {
    let widgetClass;
    let tagName;
    let styleClass;
    let elementQuerySelector;
    let propId;
    let element;
    const dataObjReturnLayout = {
      "subwidgets-start": "select",
      "subwidgets-center": "",
      "subwidgets-end": "",
      "select_widget-class": "UX.Select",
      "select:valrep": "1=a10=1025=2550=50100=100",
      "select_overflow-behavior": "none",
      "select:value": "1",
      "select_usefield": true,
      "select_delegated-properties": "html:disabled"
    };
    const dataObjIncorrectProperty = {
      "subwidgets-starts": "select",
      "subwidgets-center": "",
      "subwidgets-end": "",
      "select_widget-class": "UX.Select",
      "select:valrep": "1=a10=1025=2550=50100=100",
      "select_overflow-behavior": "none",
      "select:value": "1",
      "select_usefield": true,
      "select_delegated-properties": "html:disabled"
    };
    const dataObjSubwidgetNotFoundInClassRegistry = {
      "subwidgets-start": "select",
      "subwidgets-center": "",
      "subwidgets-end": "",
      "select_widget-class": "UX.Select123",
      "select:valrep": "1=a10=1025=2550=50100=100",
      "select_overflow-behavior": "none",
      "select:value": "1",
      "select_usefield": true,
      "select_delegated-properties": "html:disabled"
    };
    const dataObjPropertyNameNotDefined = {
      "subwidgets-start": "select1",
      "subwidgets-center": "",
      "subwidgets-end": "",
      "select_widget-class": "UX.Select",
      "select:valrep": "1=a10=1025=2550=50100=100",
      "select_overflow-behavior": "none",
      "select:value": "1",
      "select_usefield": true,
      "select_delegated-properties": "html:disabled"
    };
    const dataObjWithTwoSubWidgets = {
      "subwidgets-start": "selectbutton",
      "subwidgets-center": "",
      "subwidgets-end": "",
      "select_widget-class": "UX.Select",
      "select:valrep": "1=a10=1025=2550=50100=100",
      "select_overflow-behavior": "none",
      "select:value": "1",
      "select_usefield": true,
      "select_delegated-properties": "html:disabled",
      "button_widget-class": "UX.Button",
      "button:value": "Me Button",
      "button_usefield": true,
      "button_overflow-behavior": "move",
      "button_delegated-properties": "html:readonly"
    };

    before(function () {
      widgetClass = Widget;
      tagName = "span";
      styleClass = "u-controlbar-item";
      elementQuerySelector = "";
      propId = "subwidgets-start";
      element = new SubWidgetsByProperty(widgetClass, tagName, styleClass, elementQuerySelector, propId);
    });

    it("should initialize with correct properties for SubWidgetsByProperty worker", function () {
      expect(element.widgetClass).to.equal(widgetClass);
      expect(element.tagName).to.equal(tagName);
      expect(element.styleClass).to.equal(styleClass);
      expect(element.elementQuerySelector).to.equal(elementQuerySelector);
      expect(element.propId).to.equal(propId);
    });

    it("getLayout() method should generate and return layout for this setter for SubWidgetsByProperty worker", function () {
      // eslint-disable-next-line no-undef
      let returnedLayoutElement = element.getLayout(_uf.createUxDefinitions(dataObjReturnLayout, true));
      expect(returnedLayoutElement[0].getAttribute("class")).to.equal("u-sw-select u-controlbar-item");
      expect(returnedLayoutElement[0].getAttribute("sub-widget-id")).to.equal("select");
    });

    it("getLayout() method should generate correct warning for incorrect property/not defined for object in the browser's console for SubWidgetsByProperty worker", function () {
      const warnSpy = sinon.spy(console, "warn");
      // eslint-disable-next-line no-undef
      element.getLayout(_uf.createUxDefinitions(dataObjIncorrectProperty, true));
      expect(warnSpy.calledWith("SubWidgetsByProperty.getLayout: Property 'subwidgets-start' not defined for object. - Creation of sub-widgets skipped.")).to.be.true;
      warnSpy.restore(); // Restore the original console.warn.
    });

    it("getLayout() method should generate correct warning for Widget definition with name '${subWidgetClassName}' not found in UNIFACE.classRegistry with incorrect widget definition in the browser's console for SubWidgetsByProperty worker", function () {
      const warnSpy = sinon.spy(console, "warn");
      // eslint-disable-next-line no-undef
      element.getLayout(_uf.createUxDefinitions(dataObjSubwidgetNotFoundInClassRegistry, true));
      expect(warnSpy.calledWith("SubWidgetsByProperty.getLayout: Widget definition with name 'UX.Select123' is not registered. - Creation of sub-widget 'select'skipped.")).to.be.true;
      warnSpy.restore(); // Restore the original console.warn.
    });

    it("getLayout() method should generate correct warning for property name not defined for object creation of sub-widget '${subWidgetId}' skipped in the browser console for SubWidgetsByProperty worker", function () {
      let data = Object.assign({}, dataObjPropertyNameNotDefined);
      const warnSpy = sinon.spy(console, "warn");
      // eslint-disable-next-line no-undef
      element.getLayout(_uf.createUxDefinitions(data, true));
      expect(warnSpy.calledWith("SubWidgetsByProperty.getLayout: Property 'select1_widget-class' not defined for object. - Creation of sub-widget 'select1' skipped.")).to.be.true;
      warnSpy.restore(); // Restore the original console.warn.
    });

    it("getSubWidgetDefinitions() method should collects the subWidget definitions based on the properties and returns them correctly for SubWidgetsByProperty worker", function () {
      let subWidgetDefinitionToCompare = {
        "select": {
          "styleClass": "u-sw-select",
          "propPrefix": "select",
          "delegatedProperties": ["html:disabled"]
        }
      };
      // eslint-disable-next-line no-undef
      let returnedElementSubWidgetDefinition = element.getSubWidgetDefinitions(_uf.createUxDefinitions(dataObjReturnLayout, true));
      expect(JSON.stringify(returnedElementSubWidgetDefinition)).to.equal(JSON.stringify(subWidgetDefinitionToCompare));
    });

    it("getSubWidgetDefinitions() method should return styleClass,propPrefix,delegatedProperties,usefield as subWidgetDefinitions, if objectDefinition do not have correct propid for SubWidgetsByProperty worker", function () {
      let subWidgetDefinitionToCompare = {
      };
      // eslint-disable-next-line no-undef
      let returnedElementSubWidgetDefinition = element.getSubWidgetDefinitions(_uf.createUxDefinitions(dataObjPropertyNameNotDefined, true));
      expect(JSON.stringify(returnedElementSubWidgetDefinition)).to.equal(JSON.stringify(subWidgetDefinitionToCompare));
    });

    it("getSubWidgetDefinitions() method should return array of object with all subWidget definition,if it have more than 1 subwidgets for SubWidgetsByProperty worker", function () {
      let subWidgetDefinitionToCompare = {
        "select": {
          "styleClass": "u-sw-select",
          "propPrefix": "select",
          "delegatedProperties": ["html:disabled"]
        },
        "button": {
          "styleClass": "u-sw-button",
          "propPrefix": "button",
          "delegatedProperties": ["html:readonly"]
        }
      };
      // eslint-disable-next-line no-undef
      let returnedElementSubWidgetDefinition = element.getSubWidgetDefinitions(_uf.createUxDefinitions(dataObjWithTwoSubWidgets, true));
      expect(JSON.stringify(returnedElementSubWidgetDefinition)).to.equal(JSON.stringify(subWidgetDefinitionToCompare));
    });
  });

  // == Testing UIBlock class ==========================================================================
  // ===================================================================================================================
  describe("Test UIBlock class", function () {
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
      element = new UIBlock(widgetClass, "readonly");
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

  describe("Test UIBlock class for invalid uiblocking", function () {
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
      element = new UIBlock(widgetClass, "invalid");
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
      expect(widgetInstance.error.calledWith("UIBlock", "Invalid block type", "invalid")).to.be.true;
    });
  });
})();
