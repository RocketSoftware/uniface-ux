import { Button } from "../../src/ux/button.js";
import { Base } from "../../src/ux/base.js";
import { Worker } from "../../src/ux/workers.js";
import { Widget } from "../../src/ux/widget.js";

(function () {
  'use strict';

  const expect = chai.expect;
  const sandbox = sinon.createSandbox();

  describe("Base constructor properly defined", function () {

    it('constructor', function () {
      let base = new Base();
      expect(base.constructor.name).to.equal("Base");
    });
  });

  describe("test Base Class methods", function () {

    let base, widgetClass, propId, subWidgetId, subWidgetClass, subWidgetStyleClass, subWidgetTriggers, defaultValue, triggerName,
      url, functionName, message, consequence, consoleLogSpy, worker;

    beforeEach(function () {
      base = new Base();
      widgetClass = Widget;
    });

    it("registerSetter", function () {
      worker = new Worker(widgetClass);
      propId = "html:disabled";

      base.registerSetter(widgetClass, propId, worker);

      expect(String(Object.keys(widgetClass.setters))).to.equal("html:disabled");
      expect(widgetClass.setters["html:disabled"][0].constructor.name).to.equal("Worker");

    });

    it("registerGetter", function () {
      propId = "html:disabled";
      worker = new Worker(widgetClass);

      base.registerGetter(widgetClass, propId, worker);

      expect(String(Object.keys(widgetClass.getters))).to.equal("html:disabled");
      expect(widgetClass.getters["html:disabled"].constructor.name).to.equal("Worker");
    });


    it("registerDefaultValue", function () {
      propId = "html:testDefault";
      defaultValue = "56";

      base.registerDefaultValue(widgetClass, propId, defaultValue);

      expect(String(Object.keys(widgetClass.defaultValues))).to.equal("html:testDefault");
      expect(widgetClass.defaultValues["html:testDefault"]).to.equal(defaultValue);

    });

    it("registerTrigger", function () {
      triggerName = "newTrigger";
      worker = new Worker(widgetClass);

      base.registerTrigger(widgetClass, triggerName, worker);

      expect(String(Object.keys(widgetClass.triggers))).to.equal(triggerName);
      expect(widgetClass.triggers.newTrigger.widgetClass.name).to.equal("Widget");

    });

    it("registerSubWidget", function () {
      subWidgetId = "change-button";
      subWidgetStyleClass = "u-change-button";
      subWidgetClass = new Button();
      subWidgetTriggers = ["trigger1", "trigger2"];

      base.registerSubWidget(widgetClass, subWidgetId, subWidgetClass, subWidgetStyleClass, subWidgetTriggers);

      expect(String(Object.keys(widgetClass.subWidgets))).to.equal(subWidgetId);
      expect((Object.keys(widgetClass.subWidgets[subWidgetId]))).to.have.lengthOf(3);
      expect(widgetClass.subWidgets[subWidgetId].styleClass).to.equal(subWidgetStyleClass);
      expect(widgetClass.subWidgets[subWidgetId].triggers).to.equal(subWidgetTriggers);
    });

    it("registerSubWidgetWorker", function () {
      worker = new Worker(widgetClass);

      base.registerSubWidgetWorker(widgetClass, worker);

      expect(widgetClass.subWidgetWorkers[0]).to.equal(worker);
    });

    it("getNode", function () {
      const widgetInstance = {
        ...widgetClass,
        data: {
          "uniface": "",
          "icon-position": "start",
          value: ""
        }
      };
      url = "icon-position";
      let returnedNode = base.getNode(widgetInstance.data, url);
      expect(String(returnedNode)).to.equal("start");
    });

    it("toBoolean", function () {
      expect(base.toBoolean(true)).to.equal(true);
      expect(base.toBoolean(false)).to.equal(false);
      expect(base.toBoolean("1258395")).to.equal(true);
      expect(base.toBoolean("999999")).to.equal(false);
      expect(base.toBoolean(56743)).to.equal(true);
    });

    it("fieldValueToBoolean", function () {
      expect(base.fieldValueToBoolean(true)).to.equal(true);
      expect(base.fieldValueToBoolean(false)).to.equal(false);
      expect(base.fieldValueToBoolean("1")).to.equal(true);
      expect(base.fieldValueToBoolean("f")).to.equal(false);
      expect(base.fieldValueToBoolean(1)).to.equal(true);
      expect(base.fieldValueToBoolean(0)).to.equal(false);
    });

    it("getFormattedValrep", function () {
      let valRepString = "valrep1=value1valrep2=value2";
      let formattedValReps = base.getFormattedValrep(valRepString);

      expect(formattedValReps).to.have.lengthOf(2);
      expect(Object.keys(formattedValReps[0])).to.eql(['value', 'representation']);

      expect(formattedValReps[0].value).to.eql("valrep1");
      expect(formattedValReps[0].representation).to.eql("value1");

      expect(formattedValReps[1].value).to.eql("valrep2");
      expect(formattedValReps[1].representation).to.eql("value2");
    });

    it("warn", function () {
      functionName = "tooBoolean";
      message = "Function does not return that value";
      consequence = "Aborting";
      consoleLogSpy = sandbox.spy(console, 'warn');
      base.warn(functionName, message, consequence);
      expect(consoleLogSpy.called).to.equal(true);
      sandbox.restore();
    });

    it("error", function () {
      functionName = "tooBoolean";
      message = "Function does not return that value";
      consequence = "Aborting";
      consoleLogSpy = sandbox.spy(console, 'error');
      base.error(functionName, message, consequence);
      expect(consoleLogSpy.called).to.equal(true);
      sandbox.restore();
    });

    it("getFormattedValrepItemAsHTML", function () {
      let displayFormat = "valrep";
      let valRepString = "<p>this is paragraph</p>";
      let representation = "<p>this is paragraph</p>";
      let formattedValReps = base.getFormattedValrepItemAsHTML(displayFormat, valRepString, representation);
      expect(formattedValReps.querySelector('.u-valrep-value').className).to.eql('u-valrep-value u-value');
      expect(formattedValReps.querySelector('.u-valrep-representation').textContent).to.eql('this is paragraph');
      expect(formattedValReps.querySelector('.u-valrep-representation').innerHTML).to.eql(representation);
      expect(formattedValReps.querySelector('.u-valrep-value').textContent).to.eql(valRepString);
      expect(formattedValReps.querySelector('.u-valrep-value').innerHTML).to.eql('&lt;p&gt;this is paragraph&lt;/p&gt;');
      expect(formattedValReps.querySelector('.u-valrep-representation').className).to.eql('u-valrep-representation');
    });
  });
})();