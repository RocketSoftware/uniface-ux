import {Widget_UXWF} from "../../../ux/widget_UXWF.js"
import { Button_UXWF } from "../../../ux/button_UXWF.js";
import { Trigger, HtmlAttribute, HtmlValueAttributeBoolean, StyleClass, SlottedWidget, Element } from "../../../ux/workers_UXWF.js";

//Simple widget that has both subwidget and triggers for easier testing and doens't mess with other widgets
export class TestWidget extends Widget_UXWF {

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
    new SlottedWidget(this, "span", "u-change-button", ".u-change-button", "end", "change-button", "UX.Button_UXWF", {
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
    // Keep this!
    if (umockup.testLoaded()) {
        return;
    }

    const expect = chai.expect;

    describe("Widget_UXWF constructor properly defined", function () {        
        it('constructor default', function () {
            let widget = new Widget_UXWF()

            expect(widget.constructor.name).to.equal("Widget_UXWF")
            expect(widget.data).eql({})
            expect(widget.elements).eql({})
            expect(widget.subWidgets).eql({})
        });

        it('constructor with subWidgets', function () {
            let subWidgetId = "change-button"
            let subWidgetStyleClass = "u-change-button"
            let subWidgetClass = new Button_UXWF()
            let subWidgetTriggers = {}
            let widget =  new Widget_UXWF()
            
            widget.registerSubWidget(widget, subWidgetId, subWidgetClass, subWidgetStyleClass, subWidgetTriggers)

            expect(Object.keys(widget.subWidgets)).to.eql([subWidgetId])
            expect(widget.subWidgets[subWidgetId].styleClass).to.equal(subWidgetStyleClass)
        });

    });

    describe("Widget_UXWF Class methods", function () {

        globalThis.UX_DEFINITIONS = {}
        globalThis.UX_DEFINITIONS["ufld:FIELD.ENTITY.MODEL"] = "test"
        
        let definitions, returnedProcess , widget, testwidget;

        definitions = {
            "widget_class": "Widget_UXWF",
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
        }

        beforeEach(function () {
            widget = new Widget_UXWF;
            testwidget = new TestWidget;
            returnedProcess = TestWidget.processLayout(widget.widget, definitions)
            testwidget.onConnect(returnedProcess)
            testwidget.dataInit()
        });

        it("processLayout", function () {            
            expect(returnedProcess).instanceOf(HTMLElement, "Function processLayout of Widget_UXWF does not return an HTMLElement.");
            expect(returnedProcess).to.have.tagName("FLUENT-TEXT-FIELD");
            expect(returnedProcess.querySelector("span.u-icon"), "Widget misses or has incorrect u-icon element");
            expect(returnedProcess.querySelector("span.u-text"), "Widget misses or has incorrect u-text element");
            expect(returnedProcess).to.have.id( widget.widget.id);
        });

        //The getValueUpdaters function for button_UXWF widget returns null, it does log the correct updater
        it("onConnect", function () {
            let connectedWidget = testwidget.onConnect(returnedProcess)
        });

        //Button_UXWF widget currently doesn't have a mapTrigger functionality
        it("mapTrigger", function () {
            testwidget.mapTrigger("click")
        });

        it("dataInit", function () {
            expect(testwidget.element, "Widget top element is not defined!");
            expect(TestWidget.defaultValues.classes).to.eql(testwidget.data.properties.classes)
        });

        it("dataUpdate", function () {
            const data =  {
                uniface: {
                    "icon": "",
                    "icon-position": "start"
                },
                value: true
            }

            testwidget.dataUpdate(data)

            const defaultTestWidget = new TestWidget
            defaultTestWidget.onConnect(returnedProcess)
            defaultTestWidget.dataInit()

            //Expect widget properties to differ from the initial Widget
            expect(defaultTestWidget.data.properties).to.not.eql(testwidget.data.properties); 
            
            expect(testwidget.data.properties.value).to.equal(true); 
            expect(testwidget.data.properties.uniface).to.have.any.keys(data.uniface); 
        });

        //Data cleanup functionality for UXWF Widgets doesn't do anything
        it("dataCleanup", function () {
            testwidget.dataCleanup()
        });

         it("getValue", function () {
            const value = testwidget.getValue()
            
            expect(value).to.equal(false); 
        });

        //Validate only returns null for the time being
        it("validate", function () {
            const returnNull = testwidget.validate()

            expect(returnNull).to.equal(null);         
        });

        it("showError", function () {
            const errorString = "This is a testing error"
            
            testwidget.showError(errorString) 
            expect(testwidget.data.properties.uniface["error-message"]).to.equal(errorString); 
            expect(testwidget.data.properties.uniface["error"]).to.equal(true);       
        });

        it("hideError", function () {
            testwidget.hideError() 

            expect(testwidget.data.properties.uniface["error-message"]).to.equal(""); 
            expect(testwidget.data.properties.uniface["error"]).to.equal(false);     
        });

        it("blockUI", function () { 
            expect(testwidget.elements.widget.disabled).to.equal(false);     
            
            testwidget.blockUI() 
            expect(testwidget.elements.widget.disabled).to.equal(true);     
        });

        it("unblockUI", function () {
            expect(testwidget.elements.widget.disabled).to.equal(false);     
            
            testwidget.blockUI() 
            expect(testwidget.elements.widget.disabled).to.equal(true);
            
            testwidget.unblockUI()   
            expect(testwidget.elements.widget.disabled).to.equal(false);
        });
    });
})();
