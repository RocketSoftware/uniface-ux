import {Widget_UXWF} from "../../../ux/widget_UXWF.js"
import { Button_UXWF } from "../../../ux/button_UXWF.js";
import { Worker } from "../../../ux/workers_UXWF.js";
import {TextField_UXWF} from "../../../ux/text_field_UXWF.js"


(function () {
    'use strict';
    // Keep this!
    if (umockup.testLoaded()) {
        return;
    }
    const defaultAsyncTimeout = 100; //ms

    const assert = chai.assert;
    const expect = chai.expect;
    const tester = new umockup.WidgetTester();
    const widgetId = tester.widgetId;
    const widgetName = tester.widgetName;
    describe("Uniface Mockup tests", function () {

        it("Get class " + widgetName, function () {
            const widgetClass = tester.getWidgetClass();
            assert(widgetClass, `Widget class '${widgetName}' is not defined!
            Hint: Check if the JavaScript file defined class '${widgetName}' is loaded.`);
        });
    });

    describe(widgetName + " constructor properly defined", function () {        
        it('constructor default', function () {
            let widget = tester.construct();

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
            let widget = tester.construct();
            
            widget.registerSubWidget(widget, subWidgetId, subWidgetClass, subWidgetStyleClass, subWidgetTriggers)

            expect(Object.keys(widget.subWidgets)).to.eql([subWidgetId])
            expect(widget.subWidgets[subWidgetId].styleClass).to.equal(subWidgetStyleClass)
        });

    });

    describe(widgetName + " test Widget_UXWF Class methods", function () {

        globalThis.UX_DEFINITIONS = {}
        globalThis.UX_DEFINITIONS["ufld:FIELD.ENTITY.MODEL"] = "test"
        
        let widgetClass, propId, setterClass, subWidgetId, subWidgetClass, subWidgetStyleClass, subWidgetTriggers, defaultValue, triggerName,
        node, url, sourceElement, tagName, copyChildren, copyAttributes, functionName, message, consequence, data , definitions, element
        let widget;

        beforeEach(function () {
            widget = new Widget_UXWF;
        });

        it("processLayout", function () {
            
            definitions = {
                "widget_class": tester.getWidgetClass(),
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

            // console.log("widget " , widget)
            // console.log("definitions " , definitions)

            const elementBase = Widget_UXWF.processLayout(widget, definitions)
            console.log(widget)

        });

        it("onConnect", function () {
            element = document.createElement("h2")
            element.id = "ufld:FIELD.ENTITY.MODEL:INSTANCE.1"
            element["data-test-attribute"] = "test"
            widgetClass = {}

            propId = "html:disabled"
            setterClass = {}
            widget.registerGetter(widgetClass, propId, setterClass)
            console.log("registeredSub after Getter" , widgetClass)

            
            widgetClass = {}
            subWidgetId = "change-button"
            subWidgetStyleClass = "u-change-button"
            subWidgetClass = new Button_UXWF()
            subWidgetTriggers = {}
            widget.registerSubWidget(widgetClass, subWidgetId, subWidgetClass, subWidgetStyleClass, subWidgetTriggers)            
            widget.subWidgets = widgetClass.subWidgets
            widget.getters = widgetClass.getters
            console.log("SHOULD HAVE SUBWIDGETS " , widgetClass)
            widget.onConnect(element)
        });

        it("mapTrigger", function () {
            console.log("map " , widget)
            widgetClass = TextField_UXWF
            triggerName = "change-button__disabled"
            setterClass = {}
            widget.registerTrigger(widgetClass, triggerName, setterClass)
            //widget.triggers = widgetClass.triggers
            // subWidgetId = "change-button"
            // subWidgetStyleClass = "u-change-button"
            // subWidgetClass = TextField_UXWF
            // new Trigger(subWidgetClass, triggerName, "click" , true)
            // new Trigger(subWidgetClass, "trigger2" , "click" , true)
            //subWidgetTriggers = ["change-button__disabled", "trigger2"]
            //widget.registerSubWidget(widgetClass, subWidgetId, subWidgetClass, subWidgetStyleClass, subWidgetTriggers) 
            console.log("NEW subwidget " , widget)
            //Change when subwigets work
            //widget.subWidgets = widgetClass.subWidgets 
            let widget1 = new widgetClass()
            console.log("NEW NEW WIDGET " , widget1)
            widget1.mapTrigger(triggerName)
        });

        it("dataInit", function () {
            widgetClass = {}
            subWidgetId = "change-button"
            subWidgetStyleClass = "u-change-button"
            subWidgetClass = new Button_UXWF()
            subWidgetTriggers = {}
            widget.registerSubWidget(widgetClass, subWidgetId, subWidgetClass, subWidgetStyleClass, subWidgetTriggers) 
            //Change when subwigets work
            //widget.subWidgets = widgetClass.subWidgets 
            console.log("map " , widget)
            console.log("elements " , element)
            widget.elements.widget = element
            widget.dataInit()
            
        });

        //TELL ME DATA
        it("dataUpdate", function () {
            data = {}
            widget.dataUpdate(data)
            
        });

        //TELL ME DATA
        it("dataCleanup", function () {
            widgetClass = {}
            subWidgetId = "change-button"
            subWidgetStyleClass = "u-change-button"
            subWidgetClass = new Button_UXWF()
            subWidgetTriggers = {}
            widget.registerSubWidget(widgetClass, subWidgetId, subWidgetClass, subWidgetStyleClass, subWidgetTriggers) 
            widget.registerSubWidget(widgetClass, "tehe", subWidgetClass, subWidgetStyleClass, subWidgetTriggers) 
            //Fix when subwidgets
            //widget.subWidgets = widgetClass.subWidgets 
            console.log("map " , widget)

            widget.dataCleanup()
        });

         //TELL ME DATA
         it("getValue", function () {
            console.log("map " , widget)
            let test = new Worker(tester.getWidgetClass())
            widgetClass = {}
            subWidgetId = "change-button"
            subWidgetStyleClass = "u-change-button"
            subWidgetClass = new Button_UXWF()
            subWidgetTriggers = {}
            test.registerSubWidget(widgetClass, subWidgetId, subWidgetClass, subWidgetStyleClass, subWidgetTriggers) 
            test.registerGetter(widgetClass, "value", this);
            console.log("getters " , widgetClass)
            test.widgetClass.subWidgets = widgetClass.subWidgets
            //Fix
            //test.widgetClass.getters = widgetClass.getters
            console.log(test)
            console.log(widget.getValue())
        });

        
    });
})();
