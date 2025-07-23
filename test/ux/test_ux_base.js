import { Base } from "../../src/ux/framework/base.js";
import { Worker } from "../../src/ux/framework/workers/worker/worker.js";
import { Widget } from "../../src/ux/framework/widget.js";
import { getWidgetClass } from "../../src/ux/framework/dsp_connector.js";

(function () {
  "use strict";

  // This test depends on Button, so get it from registry
  const Button = getWidgetClass("UX.Button");

  const expect = chai.expect;
  const sandbox = sinon.createSandbox();

  describe("Base constructor() properly defined", function () {

    it("constructor()", function () {
      let base = new Base();
      expect(base.constructor.name).to.equal("Base");
    });
  });

  describe("Test Base class methods", function () {

    let base, widgetClass, propId, subWidgetId, subWidgetClass, subWidgetStyleClass, subWidgetTriggers, subWidgetDelegatedProperties, defaultValue, triggerName,
      url, functionName, message, consequence, consoleLogSpy, worker;

    beforeEach(function () {
      base = new Base();
      widgetClass = Widget;
    });

    it("registerSetter()", function () {
      worker = new Worker(widgetClass);
      propId = "html:disabled";

      base.registerSetter(widgetClass, propId, worker);

      expect(String(Object.keys(widgetClass.setters))).to.equal("html:disabled");
      expect(widgetClass.setters["html:disabled"][0].constructor.name).to.equal("Worker");

    });

    it("registerGetter()", function () {
      propId = "html:disabled";
      worker = new Worker(widgetClass);

      base.registerGetter(widgetClass, propId, worker);

      expect(String(Object.keys(widgetClass.getters))).to.equal("html:disabled");
      expect(widgetClass.getters["html:disabled"].constructor.name).to.equal("Worker");
    });


    it("registerDefaultValue()", function () {
      propId = "html:testDefault";
      defaultValue = "56";

      base.registerDefaultValue(widgetClass, propId, defaultValue);

      expect(String(Object.keys(widgetClass.defaultValues))).to.equal("html:testDefault");
      expect(widgetClass.defaultValues["html:testDefault"]).to.equal(defaultValue);

    });

    it("registerTrigger()", function () {
      triggerName = "newTrigger";
      worker = new Worker(widgetClass);

      base.registerTrigger(widgetClass, triggerName, worker);

      expect(String(Object.keys(widgetClass.triggers))).to.equal(triggerName);
      expect(widgetClass.triggers.newTrigger.widgetClass.name).to.equal("Widget");

    });

    it("registerSubWidget()", function () {
      subWidgetId = "change-button";
      subWidgetStyleClass = "u-change-button";
      subWidgetClass = new Button();
      subWidgetTriggers = ["trigger1", "trigger2"];
      subWidgetDelegatedProperties = ["html:disabled"];

      base.registerSubWidget(widgetClass, subWidgetId, subWidgetClass, subWidgetStyleClass, subWidgetTriggers, subWidgetDelegatedProperties);

      expect(String(Object.keys(widgetClass.subWidgets))).to.equal(subWidgetId);
      expect((Object.keys(widgetClass.subWidgets[subWidgetId]))).to.have.lengthOf(4);
      expect(widgetClass.subWidgets[subWidgetId].styleClass).to.equal(subWidgetStyleClass);
      expect(widgetClass.subWidgets[subWidgetId].triggers).to.equal(subWidgetTriggers);
      expect(widgetClass.subWidgets[subWidgetId].delegatedProperties).to.equal(subWidgetDelegatedProperties);
    });

    it("registerSubWidgetWorker()", function () {
      worker = new Worker(widgetClass);

      base.registerSubWidgetWorker(widgetClass, worker);

      expect(widgetClass.subWidgetWorkers[0]).to.equal(worker);
    });

    it("getNode()", function () {
      const widgetInstance = {
        ...widgetClass,
        "data": {
          "uniface": "",
          "icon-position": "start",
          "value": ""
        }
      };
      url = "icon-position";
      let returnedNode = base.getNode(widgetInstance.data, url);
      expect(String(returnedNode)).to.equal("start");
    });

    it("toBoolean()", function () {
      expect(base.toBoolean(true)).to.equal(true);
      expect(base.toBoolean(false)).to.equal(false);
      expect(base.toBoolean("1258395")).to.equal(true);
      expect(base.toBoolean("999999")).to.equal(false);
      expect(base.toBoolean(56743)).to.equal(true);
    });

    it("fieldValueToBoolean()", function () {
      expect(base.fieldValueToBoolean(true)).to.equal(true);
      expect(base.fieldValueToBoolean(false)).to.equal(false);
      expect(base.fieldValueToBoolean("1")).to.equal(true);
      expect(base.fieldValueToBoolean("f")).to.equal(false);
      expect(base.fieldValueToBoolean(1)).to.equal(true);
      expect(base.fieldValueToBoolean(0)).to.equal(false);
    });

    it("getFormattedValrep()", function () {
      let valRepString = "valrep1=value1valrep2=value2";
      let formattedValReps = base.getFormattedValrep(valRepString);

      expect(formattedValReps).to.have.lengthOf(2);
      expect(Object.keys(formattedValReps[0])).to.eql(["value", "representation"]);

      expect(formattedValReps[0].value).to.eql("valrep1");
      expect(formattedValReps[0].representation).to.eql("value1");

      expect(formattedValReps[1].value).to.eql("valrep2");
      expect(formattedValReps[1].representation).to.eql("value2");
    });

    it("warn()", function () {
      functionName = "tooBoolean";
      message = "Function does not return that value";
      consequence = "Aborting";
      consoleLogSpy = sandbox.spy(console, "warn");
      base.warn(functionName, message, consequence);
      expect(consoleLogSpy.called).to.equal(true);
      sandbox.restore();
    });

    it("error()", function () {
      functionName = "tooBoolean";
      message = "Function does not return that value";
      consequence = "Aborting";
      consoleLogSpy = sandbox.spy(console, "error");
      base.error(functionName, message, consequence);
      expect(consoleLogSpy.called).to.equal(true);
      sandbox.restore();
    });

    it("getFormattedValrepItemAsHTML()", function () {
      let displayFormat = "valrep";
      let valRepString = "<p>this is paragraph</p>";
      let representation = "<p>this is paragraph</p>";
      let formattedValReps = base.getFormattedValrepItemAsHTML(displayFormat, valRepString, representation);
      expect(formattedValReps.querySelector(".u-valrep-value").className).to.eql("u-valrep-value u-value");
      expect(formattedValReps.querySelector(".u-valrep-representation").textContent).to.eql("this is paragraph");
      expect(formattedValReps.querySelector(".u-valrep-representation").innerHTML).to.eql(representation);
      expect(formattedValReps.querySelector(".u-valrep-value").textContent).to.eql(valRepString);
      expect(formattedValReps.querySelector(".u-valrep-value").innerHTML).to.eql("&lt;p&gt;this is paragraph&lt;/p&gt;");
      expect(formattedValReps.querySelector(".u-valrep-representation").className).to.eql("u-valrep-representation");
    });

    describe("extractSubWidgetData()", function () {
      it("return the sub-widget data correctly and delete corresponding sub-widget properties from data source", function () {
        let data = {
          "subWidgetId_widget-class": "Some class",
          "subWidgetId:value": "Some value 1",
          "subWidgetId:html:readonly": "Something",
          "subWidgetId2_widget-class": "Something",
          "subWidgetId2:value": "Some value 2",
          "subWidgetId2:html:disabled": "Something",
          "subWidgetId:class:class-test": "Something",
          "subWidgetId:label-text": "Some Label"
        };
        let subWidgetPropPrefix = "subWidgetId";
        let mockSubWidgetData = {
          "value": "Some value 1",
          "html:readonly": "Something",
          "class:class-test": "Something",
          "label-text": "Some Label"
        };
        let subWidgetData = base.extractSubWidgetData(data, subWidgetPropPrefix);
        expect(subWidgetData).to.deep.equal(mockSubWidgetData);
        for (let prop in data) {
          expect(prop.startsWith(`${subWidgetPropPrefix}:`)).to.equal(false);
        }

        data = {
          "subWidgetId_widget-class": "Some class",
          "subWidgetId:value": "Some value 1",
          "subWidgetId:html:readonly": "Something",
          "subWidgetId2_widget-class": "Something",
          "subWidgetId2:value": "Some value 2",
          "subWidgetId2:html:disabled": "Something",
          "subWidgetId:class:class-test": "Something",
          "subWidgetId:label-text": "Some Label"
        };
        subWidgetPropPrefix = "subWidgetId2";
        mockSubWidgetData = {
          "value": "Some value 2",
          "html:disabled": "Something"
        };
        subWidgetData = base.extractSubWidgetData(data, subWidgetPropPrefix);
        expect(subWidgetData).to.deep.equal(mockSubWidgetData);
        for (let prop in data) {
          expect(prop.startsWith(`${subWidgetPropPrefix}:`)).to.equal(false);
        }
      });
    });

    describe("extractSubWidgetPropertyNames()", function () {
      it("return the sub-widget property names correctly and delete corresponding sub-widget property names from property names source", function () {
        let propertyNames = new Set([
          "subWidgetId:widget-class",
          "subWidgetId:value",
          "subWidgetId:html:readonly",
          "subWidgetId2:widget-class",
          "subWidgetId2:value",
          "subWidgetId2:html:disabled",
          "subWidgetId2:class:abcd",
          "subWidgetId:class:class-test",
          "subWidgetId:label-text"
        ]);
        let subWidgetPropPrefix = "subWidgetId";
        let mockSubWidgetPropertyNames = new Set(["widget-class", "value", "html:readonly", "class:class-test", "label-text"]);
        let subWidgetPropertyNames = base.extractSubWidgetPropertyNames(propertyNames, subWidgetPropPrefix);
        expect(subWidgetPropertyNames).to.deep.equal(mockSubWidgetPropertyNames);
        propertyNames.forEach((propertyName) => {
          expect(propertyName.startsWith(`${subWidgetPropPrefix}:`)).to.equal(false);
        });

        propertyNames = new Set([
          "subWidgetId:widget-class",
          "subWidgetId:value",
          "subWidgetId:html:readonly",
          "subWidgetId2:widget-class",
          "subWidgetId2:value",
          "subWidgetId2:html:disabled",
          "subWidgetId2:class:abcd",
          "subWidgetId:class:class-test",
          "subWidgetId:label-text"
        ]);
        subWidgetPropPrefix = "subWidgetId2";
        mockSubWidgetPropertyNames = new Set(["widget-class", "value", "html:disabled", "class:abcd"]);
        subWidgetPropertyNames = base.extractSubWidgetPropertyNames(propertyNames, subWidgetPropPrefix);
        expect(subWidgetPropertyNames).to.deep.equal(mockSubWidgetPropertyNames);
        propertyNames.forEach((propertyName) => {
          expect(propertyName.startsWith(`${subWidgetPropPrefix}:`)).to.equal(false);
        });
      });
    });

    describe("deleteIconClasses()", function () {
      it("delete the classes starting with 'ms-Icon' from the element", function () {
        let element = document.createElement("div");
        let mockClassList = ["ms-Icon", "Ms-icon", "Ms-icon--Home", "class-1", "ms-Icon--Home", "ms-icon", "ms-icon--Home"];
        let mockIconClasses = ["ms-Icon", "ms-Icon--Home"];
        let mockNonIconClasses = mockClassList.filter(className => !mockIconClasses.includes(className));
        element.classList.add(...mockClassList);
        expect([...element.classList].includes(...mockIconClasses)).to.equal(true);

        base.deleteIconClasses(element);
        expect([...element.classList].includes(...mockIconClasses)).to.equal(false);
        expect([...element.classList].includes(...mockNonIconClasses)).to.equal(true);
      });
    });

    describe("setErrorProperties()", function () {
      it("call setProperties() with correct format-error related properties", function () {
        let widgetInstance = new Widget();
        let spy = sinon.spy(widgetInstance, "setProperties");
        base.setErrorProperties(widgetInstance, "format-error", "Some format error message");
        expect(spy.called).to.be.true;
        expect(
          spy.calledWith({
            "format-error": true,
            "format-error-message": "Some format error message"
          })
        ).to.be.true;

        base.setErrorProperties(widgetInstance, "format-error", "");
        expect(spy.called).to.be.true;
        expect(
          spy.calledWith({
            "format-error": false,
            "format-error-message": ""
          })
        ).to.be.true;
      });

      it("call setProperties() with correct error related properties", function () {
        let widgetInstance = new Widget();
        let spy = sinon.spy(widgetInstance, "setProperties");
        base.setErrorProperties(widgetInstance, "error", "Some error message");
        expect(spy.called).to.be.true;
        expect(
          spy.calledWith({
            "error": true,
            "error-message": "Some error message"
          })
        ).to.be.true;

        base.setErrorProperties(widgetInstance, "error", "");
        expect(spy.called).to.be.true;
        expect(
          spy.calledWith({
            "error": false,
            "error-message": ""
          })
        ).to.be.true;
      });
    });
  });
})();