import { Button } from "../../src/ux/button.js";
import { Widget } from "../../src/ux/widget.js";
import {
  StyleClass, Element, SlottedElement, Trigger, SlottedError, SlottedSubWidget,
  SubWidgetsByProperty, BaseHtmlAttribute, HtmlAttribute, HtmlAttributeChoice, HtmlAttributeNumber, HtmlAttributeBoolean,
  HtmlValueAttributeBoolean, HtmlAttributeMinMaxLength, StyleProperty, Worker, IgnoreProperty, SlottedElementsByValRep
} from "../../src/ux/workers.js";


(function () {
  "use strict";

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
        "getTraceDescription": () => {
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
      Widget.uiBlocking = "";

      widgetClass = Widget;
      defaultClassList = ["class1", "class2"];
      instance = new StyleClass(widgetClass, defaultClassList);
    });

    it("should initialize with the correct properties", function () {
      expect(instance.widgetClass).to.equal(widgetClass);
    });

    it("should register default class values", function () {
      defaultClassList.forEach((className) => {
        expect(instance.widgetClass.defaultValues[`class:${className}`]).to.be.true;
      });
    });

    it("should refresh correctly and modify the element classes", function () {
      const widgetInstance = {
        "data": {
          "class1": true,
          "class2": false
        },
        "getTraceDescription": sinon.stub().returns("description")
      };
      const element = document.createElement("div");
      sinon.stub(instance, "getElement").returns(element);

      instance.refresh(widgetInstance);

      expect(element.classList.contains("class1")).to.be.true;
      expect(element.classList.contains("class2")).to.be.false;
    });
  });

  // ===================================================================================================================
  // == Testing Elements class =========================================================================================
  // ===================================================================================================================
  describe("Test Element class", function () {

    let widgetClass;
    let tagname;
    let styleclass;
    let elementQuerySelector;
    let attributeDefines;
    let elementDefines;
    let triggerDefines;
    let element;
    let definitions;

    beforeEach(function () {
      Widget.structure = {};
      Widget.subWidgets = {};
      Widget.subWidgetWorkers = [];
      Widget.defaultValues = {};
      Widget.setters = {};
      Widget.getters = {};
      Widget.triggers = {};
      Widget.uiBlocking = "";

      widgetClass = Widget;
      tagname = "DIV";
      elementQuerySelector = "div";
      styleclass = "styleClass";
      attributeDefines = [new StyleClass(widgetClass, ["u-switch"]), new HtmlAttribute(widgetClass, "html:role", "role", "switch")];
      elementDefines = [new SlottedElement(widgetClass, "span", "u-label-text", ".u-label-text", "", "label-text"),
        new SlottedElement(widgetClass, "span", "u-checked-message", ".u-checked-message", "checked-message", "checked-message")];
      triggerDefines = [new Trigger(widgetClass, "onchange", "change", true)];
      element = new Element(widgetClass, tagname, styleclass, elementQuerySelector, attributeDefines, elementDefines, triggerDefines);
    });

    it("should initialize with correct properties", function () {
      expect(element.widgetClass).to.equal(widgetClass);
      expect(element.tagName).to.equal(tagname);
      expect(element.styleClass).to.equal(styleclass);
      expect(element.elementQuerySelector).to.equal(elementQuerySelector);
      expect(element.attributeDefines).to.equal(attributeDefines);
      expect(element.elementDefines).to.equal(elementDefines);
      expect(element.triggerDefines).to.equal(triggerDefines);
    });

    it("check elementQuerySelector changed for all elements", function () {
      attributeDefines.forEach((attributeDefine) => {
        expect(attributeDefine.elementQuerySelector).to.equal("div");
      });
      triggerDefines.forEach((triggerDefine) => {
        expect(triggerDefine.elementQuerySelector).to.equal("div");
      });
    });

    // Definitions doesn't do anything.
    it("check generate layout", function () {
      let layoutElement = element.getLayout(definitions);

      expect(layoutElement).to.have.tagName("DIV");
      expect(layoutElement).to.have.class("styleClass");
      expect(layoutElement.querySelector("u-label-text"));
      expect(layoutElement.querySelector("u-checked-message"));
    });
  });

  // ===================================================================================================================
  // == Testing SlottedElements class =================================================================================
  // ===================================================================================================================
  describe("Test SlottedElements class", function () {

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
      "getTraceDescription": () => {
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
      Widget.uiBlocking = "";

      widgetClass = Widget;
      propText = "text";
      propIcon = "icon";
      defaultText = "defaultText";
      defaultIcon = "default.png";
      slottedElement = new SlottedElement(widgetClass, "", "", "", "", propText, defaultText, propIcon, defaultIcon);
    });

    it("should initialize with correct properties", function () {
      expect(slottedElement.widgetClass).to.equal(widgetClass);
      expect(slottedElement.textPropId).to.equal(propText);
      expect(slottedElement.textDefaultValue).to.equal(defaultText);
      expect(slottedElement.iconPropId).to.equal(propIcon);
      expect(slottedElement.iconDefaultValue).to.equal(defaultIcon);
    });

    it("check getters/setters changed for propIcon, propText", function () {
      expect(slottedElement.widgetClass.defaultValues.icon).to.equal(defaultIcon);
      expect(slottedElement.widgetClass.defaultValues.text).to.equal(defaultText);
    });

    it("should refresh correctly", function () {
      slottedElement.refresh(widgetInstance);
      expect(widgetInstance.elements.widget.hidden).to.equal(false);
      expect(widgetInstance.elements.widget.classList[0]).to.equal("ms-Icon");
      expect(widgetInstance.elements.widget.classList[1]).to.equal("ms-Icon--testicon.png");

      widgetInstance.data["icon"] = "";
      slottedElement.refresh(widgetInstance);
      expect(widgetInstance.elements.widget.innerText).to.equal("defaultText");
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
      Widget.uiBlocking = "";

      widgetClass = Widget;
      slottedError = new SlottedError(widgetClass, "", "", "", "");
    });

    it("should initialize with correct properties", function () {
      expect(slottedError.widgetClass).to.equal(widgetClass);
    });

    it("check setters were added", function () {
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

    it("should refresh correctly", function () {
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
        "getTraceDescription": () => {
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
      Widget.uiBlocking = "";

      widgetClass = Widget;
      subWidgetName = "UX.Button";
      tagName = "DIV";
      subWidgetId = "undefined";
      slottedWidget = new SlottedSubWidget(widgetClass, tagName, "styleClass", "", "", subWidgetId, subWidgetName, {}, "");
    });

    it("should initialize with correct properties", function () {
      expect(slottedWidget.widgetClass).to.equal(widgetClass);
    });

    it("check getters/setters changed and subWidget added", function () {
      expect(slottedWidget.subWidgetClass.name).to.equal("Button");
      expect(slottedWidget.propId).to.equal("undefined");
    });

    it("check generate layout", function () {
      let layoutElement = slottedWidget.getLayout();

      expect(layoutElement).to.have.class("u-sw-undefined");
      expect(layoutElement.hidden).to.equal(true);
      expect(layoutElement).to.have.tagName("FLUENT-BUTTON");
    });

    it("should refresh correctly", function () {
      const widgetInstance = {
        "data": {
          "undefined": true
        },
        "elements": {
          "widget": document.createElement("div")
        },
        "getTraceDescription": () => {
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
      Widget.uiBlocking = "";

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

    // it("Check Generate Layout", function () {
    //     definitions = {
    //         "widget_class": "Button",
    //         "properties": {
    //             "controls-center": "four\u001bfive\u001bsix",
    //             "controls-end": "seven",
    //             "controls-start": "one\u001btwo\u001bthree",
    //             "five:widget-class": "UX.Button",
    //             "four:widget-class": "UX.Button",
    //             "html:readonly": "true",
    //             "one:widget-class": "UX.Button",
    //             "seven:widget-class": "UX.Button",
    //             "six:widget-class": "UX.Button",
    //             "three:widget-class": "UX.Button",
    //             "two:widget-class": "UX.Button"
    //         } ,
    //     }
    //     let layoutElement = element.getLayout(definitions)
    //  });
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
      Widget.uiBlocking = "";

      widgetClass = Widget;
      propId = "value";
      attrName = "contentEditable";
      defaultValue = "1";
      worker = new BaseHtmlAttribute(widgetClass, propId, attrName, defaultValue);
    });

    it("should initialize with correct properties", function () {
      expect(worker.widgetClass).to.equal(widgetClass);
      expect(worker.propId).to.equal(propId);
      expect(worker.attrName).to.equal(attrName);
      expect(worker.defaultValue).to.equal(defaultValue);

    });

    it("check getters/setters", function () {
      let length = worker.widgetClass.setters.value.length;

      expect(worker.widgetClass.getters.value.propId).to.equal(propId);
      expect(worker.widgetClass.setters.value[length - 1].propId).to.equal(propId);
    });

    it("check setHtmlAttribute", function () {
      element = {
        "elements": {
          "widget": document.createElement("div")
        }
      };
      worker.setHtmlAttribute(element, "new Value");
      expect(element[attrName]).to.equal("new Value");
    });

    // Refresh doesn't do anything.
    it("check refresh()", function () {
      worker.refresh({});
    });

    it("check getValue()" , function () {
      const widgetInstance = {
        "elements": {
          "widget": document.createElement("div")
        },
        "getTraceDescription": () => {
          return "description";
        }
      };
      value = worker.getValue(widgetInstance);
      expect(value).to.equal("inherit");
    });

    // getValueUpdaters() doesn't do anything.
    it("check getValueUpdaters()" , function () {
      const widgetInstance = {
        "elements": {
          "widget": [document.createElement("div"), document.createElement("span")]
        },
        "getTraceDescription": () => {
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
      Widget.uiBlocking = "";

      widgetClass = Widget;
      propId = "icon-position";
      attrName = "button";
      defaultValue = "1";
      element = new HtmlAttribute(widgetClass, propId, attrName, defaultValue);
    });

    it("should initialize with correct properties", function () {
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
        "getTraceDescription": () => {
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
      Widget.uiBlocking = "";

      widgetClass = Widget;
      propId = "icon-position";
      attrName = "button";
      defaultValue = "1";
      choices = ["all", "start-end", "none"];
      element = new HtmlAttributeChoice(widgetClass, propId, attrName, choices, defaultValue);
    });

    it("should initialize with correct properties", function () {
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
        "getTraceDescription": () => {
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
      Widget.uiBlocking = "";

      widgetClass = Widget;
      propId = "numberValue";
      attrName = "newReturnNumber";
      defaultValue = "1";
      min = 1;
      max = 500;
      element = new HtmlAttributeNumber(widgetClass, propId, attrName, min, max, defaultValue);
    });

    it("should initialize with correct properties", function () {
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
        "getTraceDescription": () => {
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
      Widget.uiBlocking = "";

      widgetClass = Widget;
      propId = "icon-position";
      attrName = "button";
      defaultValue = "1";
      element = new HtmlAttributeBoolean(widgetClass, propId, attrName, defaultValue);
    });

    it("should initialize with correct properties", function () {
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
        "getTraceDescription": () => {
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
      Widget.uiBlocking = "";

      widgetClass = Widget;
      propId = "icon-position";
      attrName = "ariaValueMax";
      defaultValue = "1";
      element = new HtmlValueAttributeBoolean(widgetClass, propId, attrName, defaultValue);
      buttonWidget = new Button;
      returnedProcess = Button.processLayout(buttonWidget, "");
    });

    it("should initialize with correct properties", function () {
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
        "getTraceDescription": () => {
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
      Widget.uiBlocking = "";

      widgetClass = Widget;
      propMin = "min";
      propMax = "max";
      defaultMin = 0;
      defaultMax = 10;
      element = new HtmlAttributeMinMaxLength(widgetClass, propMin, propMax, defaultMin, defaultMax);
    });

    it("should initialize with correct properties", function () {
      expect(element.widgetClass).to.equal(widgetClass);
      expect(element.propMin).to.equal(propMin);
      expect(element.propMax).to.equal(propMax);
      expect(element.defaultMin).to.equal(defaultMin);
      expect(element.defaultMax).to.equal(defaultMax);
    });

    it("check setters", function () {
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
        "getTraceDescription": () => {
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
  // == Testing StyleProperty class ====================================================================================
  // ===================================================================================================================
  describe("Test StyleProperty class", function () {

    let widgetClass;
    let property;
    let element;

    beforeEach(function () {
      Widget.structure = {};
      Widget.subWidgets = {};
      Widget.subWidgetWorkers = [];
      Widget.defaultValues = {};
      Widget.setters = {};
      Widget.getters = {};
      Widget.triggers = {};
      Widget.uiBlocking = "";

      widgetClass = Widget;
      property = {
        "id": "propertyClass",
        "value": 26
      };
      element = new StyleProperty(widgetClass, property);
    });

    it("should initialize with correct properties", function () {
      expect(element.widgetClass).to.equal(widgetClass);
    });

    it("check setters and default values", function () {
      let setterKeys = Object.keys(element.widgetClass.setters);
      let defaultKeys = Object.keys(element.widgetClass.defaultValues);
      let lengthKeys = setterKeys.length;
      let lengthDefaultKeys = defaultKeys.length;

      expect(setterKeys[lengthKeys - 1]).to.equal("style");
      expect(defaultKeys[lengthDefaultKeys - 1]).to.equal("style:id");
      expect(element.defaultStyleProperty.value).to.equal(property.value);
      expect(element.defaultStyleProperty.id).to.equal(property.id);
    });


    it("should refresh correctly", function () {
      const widgetInstance = {
        "data": {
          "style:color": "red"
        },
        "elements": {
          "widget": document.createElement("div")
        },
        "getTraceDescription": () => {
          return "description";
        }
      };
      element.refresh(widgetInstance);
      expect(widgetInstance.elements.widget.outerHTML).to.equal('<div style="color: red;"></div>');
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
      Widget.uiBlocking = "";

      widgetClass = Widget;
      triggerName = "NameofTrigger";
      eventName = "EventName";
      validate = "Validated";
      element = new Trigger(widgetClass, triggerName, eventName, validate);
    });

    it("should initialize with correct properties", function () {
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
        "getTraceDescription": () => {
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
      Widget.uiBlocking = "";

      widgetClass = Widget;
      propId = "tri-state";
      defaultValue = false;
      element = new IgnoreProperty(widgetClass, propId, defaultValue);
    });

    it("should initialize with correct properties", function () {
      expect(element.widgetClass).to.equal(widgetClass);
      expect(element.propId).to.equal(propId);
    });

    it("check setters and default values", function () {
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
      Widget.uiBlocking = "";

      widgetClass = Widget;
      tagName = "fluent-option";
      styleClass = "";
      elementQuerySelector = "";
      element = new SlottedElementsByValRep(widgetClass, tagName, styleClass, elementQuerySelector);
    });

    it("should initialize with correct properties", function () {
      expect(element.widgetClass).to.equal(widgetClass);
      expect(element.tagName).to.equal(tagName);
      expect(element.styleClass).to.equal(styleClass);
      expect(element.elementQuerySelector).to.equal(elementQuerySelector);
    });

    it("check setters and default values", function () {
      let setterKeys = Object.keys(element.widgetClass.setters);
      let defaultValues = element.widgetClass.defaultValues;
      let setterKeysForUniface = Object.keys(element.widgetClass.setters);
      let defaultValuesForUniface = element.widgetClass.defaultValues;

      expect(setterKeysForUniface[1]).to.equal("display-format");
      expect(defaultValuesForUniface["display-format"]).to.equal("rep");
      expect(setterKeys[0]).to.equal("valrep");
      expect(defaultValues["valrep"].length).to.equal(0);
    });

    it("should refresh correctly", function () {
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
        "getTraceDescription": () => {
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

})();