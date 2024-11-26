import { Widget } from "../../src/ux/widget.js";
import { Trigger, HtmlAttribute, HtmlValueAttributeBoolean, StyleClass, SlottedSubWidget, Element } from "../../src/ux/workers.js";

//Simple widget that has both subwidget and triggers for easier testing and doens't mess with other widgets
export class TestWidget extends Widget {

  static subWidgets = {};
  static defaultValues = {};
  static setters = {};
  static getters = {};
  static triggers = {};
  static uiBlocking = "disabled";

  static structure = new Element(this, "fluent-text-field", "", "", [
    new StyleClass(this, ["u-test-field"]),
    new HtmlAttribute(this, "html:current-value", "current-value", ""),
    new HtmlValueAttributeBoolean(this, "value", "checked", false),
  ], [
    new SlottedSubWidget(this, "span", "u-change-button", ".u-change-button", "end", "change-button", "UX.Button", {
      "uniface:icon": "",
      "uniface:icon-position": "end",
      "value": "Change",
      "classes:u-change-button": true,
      "html:title": "",
      "html:appearance": ""
    }, false, ["detail"])
  ], [
    new Trigger(this, "onchange", "change", true),
    new Trigger(this, "detail", "click", true)
  ]);

}

(function () {
    'use strict';

    const expect = chai.expect;
    const sandbox = sinon.createSandbox();

    describe("Widget constructor properly defined with subwidgets", function () {        
        
        let widget, subWidgetId;
        
        it('constructor with subWidgets', function () {
            subWidgetId = "change-button";
            widget = new TestWidget;
            expect(Object.keys(widget.subWidgetDefinitions)).to.eql([subWidgetId]);
        });

    });

    describe("Widget Class methods", function () {
        
        let definitions, returnedProcess , widget, testwidget, consoleLogSpy;

        definitions = {
            "widget_class": "Widget",
            "properties": {
                "controls-center": "four\u001bfive\u001bsix",
                "controls-end": "seven",
                "controls-start": "one\u001btwo\u001bthree",
                "five:widget-class": "UX.Button",
                "four:widget-class": "UX.Button",
                "html:readonly": "true",
                "one:widget-class": "UX.Button",
                "seven:widget-class": "UX.Button",
                "six:widget-class": "UX.Button",
                "three:widget-class": "UX.Button",
                "two:widget-class": "UX.Button"
            } , 
        };

        beforeEach(function () {
            testwidget = new TestWidget;
            TestWidget.reportUnsupportedTriggerWarnings = true;
            returnedProcess = TestWidget.processLayout(testwidget, definitions);
            testwidget.onConnect(returnedProcess);
            testwidget.dataInit();
        });

        it("processLayout", function () {            
            expect(returnedProcess).to.have.tagName("FLUENT-TEXT-FIELD");
            expect(returnedProcess.querySelector("span.u-icon"), "Widget misses or has incorrect u-icon element");
            expect(returnedProcess.querySelector("span.u-text"), "Widget misses or has incorrect u-text element");
            expect(returnedProcess.querySelector("span.u-text").outerText).to.eql("Change");
        });

        it("onConnect", function () {
            let connectedWidget = testwidget.onConnect(returnedProcess);

            expect(connectedWidget[0].element).instanceOf(HTMLElement);
            expect(connectedWidget[0].event_name).to.eql("");
            expect(connectedWidget[0].element).to.have.tagName("FLUENT-TEXT-FIELD");
        });

        it("mapTrigger", function () {
            //Test with a wrong trigger, should return undefined and display a warning
            consoleLogSpy = sandbox.spy(console, 'warn');
            let badTrigger = testwidget.mapTrigger("click");
            expect(badTrigger).to.be.undefined;
            expect(consoleLogSpy.called).to.equal(true);
            sandbox.restore();

            let onchangeTrigger = testwidget.mapTrigger("onchange");
            expect(onchangeTrigger.element).instanceOf(HTMLElement);
            expect(onchangeTrigger.event_name).to.eql("change");
            expect(onchangeTrigger.element).to.have.tagName("FLUENT-TEXT-FIELD");

            let detailTrigger = testwidget.mapTrigger("detail");
            expect(detailTrigger.element).instanceOf(HTMLElement);
            expect(detailTrigger.event_name).to.eql("click");
            expect(onchangeTrigger.element).to.have.tagName("FLUENT-TEXT-FIELD");
        });

        it("dataInit", function () {
            expect(testwidget.element, "Widget top element is not defined!");
            expect(TestWidget.defaultValues.classes).to.eql(testwidget.data.properties.classes);
        });

        it("dataUpdate", function () {
            const data =  {
                uniface: {
                    "icon": "",
                    "icon-position": "start"
                },
                value: true
            };

            testwidget.dataUpdate(data);

            const defaultTestWidget = new TestWidget;
            defaultTestWidget.onConnect(returnedProcess);
            defaultTestWidget.dataInit();

            //Expect widget properties to differ from the initial Widget
            expect(defaultTestWidget.data.properties).to.not.eql(testwidget.data.properties); 
            
            expect(testwidget.data.properties.value).to.equal(true); 
            expect(testwidget.data.properties.uniface).to.have.any.keys(data.uniface); 
        });
        
        //button doesn't have a dateCleanup function
        it("dataCleanup", function () {
            testwidget.dataCleanup();
        });

         it("getValue", function () {
            const value = testwidget.getValue();
            expect(value).to.equal(false); 
        });

        //Validate only returns null for the time being
        it("validate", function () {
            const returnNull = testwidget.validate();
            expect(returnNull).to.equal(null);         
        });

        it("showError", function () {
            const errorString = '{ "change-button": "This is a testing error" }';
            const errorReturn = {
                "error": true,
                "error-message": errorString
            }; 
            
            testwidget.showError(errorString); 
            expect(testwidget.data.properties.uniface).to.have.any.keys(errorReturn); 
            expect(testwidget.data.properties.uniface["error-message"]).equal(errorString); 
            expect(testwidget.data.properties.uniface["error"]).equal(true); 
        });

        it("hideError", function () {
            const errorReturn = {
                "error": false,
                "error-message": ""
            }; 
            
            testwidget.hideError();
            expect(testwidget.data.properties.uniface).to.have.any.keys(errorReturn); 
            expect(testwidget.data.properties.uniface["error-message"]).equal(""); 
            expect(testwidget.data.properties.uniface["error"]).equal(false);              
        });

        it("blockUI", function () { 
            expect(testwidget.elements.widget.disabled).to.equal(false);     
            
            testwidget.blockUI() ;
            expect(testwidget.elements.widget.disabled).to.equal(true);     
        });

        it("unblockUI", function () {
            expect(testwidget.elements.widget.disabled).to.equal(false);     
            
            testwidget.blockUI(); 
            expect(testwidget.elements.widget.disabled).to.equal(true);
            
            testwidget.unblockUI();   
            expect(testwidget.elements.widget.disabled).to.equal(false);
        });
    });
})();
