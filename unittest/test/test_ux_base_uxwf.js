import { Button_UXWF } from "../../sources/ux/button_UXWF.js";
import {Base_UXWF} from "../../sources/ux/base_UXWF.js"
import { Worker } from "../../sources/ux/workers_UXWF.js";

(function () {
    'use strict';
    // Keep this!
    if (umockup.testLoaded()) {
        return;
    }
    const expect = chai.expect;
    const sandbox = sinon.createSandbox();

    describe("Base_UXWF constructor properly defined", function () {

        it('constructor', function () {
            let base = new Base_UXWF();
            expect(base.constructor.name).to.equal("Base_UXWF")
        });
    });

    describe(" test Base_UXWF Class methods", function () {

        let base, widgetClass, propId, setterClass, subWidgetId, subWidgetClass, subWidgetStyleClass, subWidgetTriggers, defaultValue, triggerName,
        url, functionName, message, consequence, data, consoleLogSpy, worker

        beforeEach(function () {
            base = new Base_UXWF();
        });

        it("registerSetter", function () {
            widgetClass = Button_UXWF
            worker = new Worker(widgetClass);
            propId = "html:disabled"

            base.registerSetter(widgetClass, propId, worker)

            expect(String(Object.keys(widgetClass.setters))).to.include("html")
            expect(String(Object.keys(widgetClass.setters.html))).to.include("disabled")
            expect(widgetClass.setters.html.disabled).to.have.lengthOf(2)
            expect(widgetClass.setters.html.disabled[1].constructor.name).to.equal("Worker")
        });

        it("registerGetter", function () {
            widgetClass = Button_UXWF
            propId = "html:disabled"
            worker = new Worker(widgetClass);
            base.registerGetter(widgetClass, propId, worker)

            expect(String(Object.keys(widgetClass.getters))).to.include("html")
            expect(String(Object.keys(widgetClass.getters.html))).to.equal("disabled")
            expect(widgetClass.getters.html.disabled.constructor.name).to.equal("Worker")
        });

        it("registerSubWidget", function () {
            widgetClass = {}
            subWidgetId = "change-button"
            subWidgetStyleClass = "u-change-button"
            subWidgetClass = new Button_UXWF()
            subWidgetTriggers = {}
            base.registerSubWidget(widgetClass, subWidgetId, subWidgetClass, subWidgetStyleClass, subWidgetTriggers)
            expect(String(Object.keys(widgetClass.subWidgets))).to.equal(subWidgetId)
            expect((Object.keys(widgetClass.subWidgets[subWidgetId]))).to.have.lengthOf(3)
            expect(widgetClass.subWidgets[subWidgetId].styleClass).to.equal(subWidgetStyleClass)
        });

        it("registerDefaultValue", function () {
            widgetClass = {}
            propId = "html:disabled"
            defaultValue = "56"
            base.registerDefaultValue(widgetClass, propId, defaultValue)
            expect(String(Object.keys(widgetClass.defaultValues))).to.equal("html")
            expect(String(Object.keys(widgetClass.defaultValues.html))).to.equal("disabled")
            expect(widgetClass.defaultValues.html.disabled).to.equal(defaultValue)
        });

        it("registerTrigger", function () {
            widgetClass = {}
            triggerName = "nameOfTrigger"
            setterClass = {}
            base.registerTrigger(widgetClass, triggerName, setterClass)
            expect(String(Object.keys(widgetClass.triggers))).to.equal(triggerName)
        });

        it("getNode", function () {
            const widgetInstance = {
                ...widgetClass,
                data: {
                    properties: {
                        uniface: {
                            "uniface": "",
                            "icon-position": "start"
                        },
                        value: ""
                    }
                },
            }
            url = "uniface:icon-position"
            let returnedNode = base.getNode(widgetInstance.data.properties, url)
            expect(String(returnedNode)).to.equal("start")
        });

        it("toBoolean", function () {
            expect(base.toBoolean(true)).to.equal(true)
            expect(base.toBoolean(false)).to.equal(false)
            expect(base.toBoolean("1258395")).to.equal(true)
            expect(base.toBoolean("999999")).to.equal(false)
            expect(base.toBoolean(56743)).to.equal(true)
        });

        it("fieldValueToBoolean", function () {
            expect(base.fieldValueToBoolean(true)).to.equal(true)
            expect(base.fieldValueToBoolean(false)).to.equal(false)
            expect(base.fieldValueToBoolean("1")).to.equal(true)
            expect(base.fieldValueToBoolean("f")).to.equal(false)
            expect(base.fieldValueToBoolean(1)).to.equal(true)
            expect(base.fieldValueToBoolean(0)).to.equal(false)
        });

        it("fixData", function () {
            let UData = {
                value: 56,
                uniface: {
                    "icon:this-is-bad-data:baddata": "bad",
                    "icon-position": "start"
                },
            }

            let correctedData = {
                value: 56,
                uniface: {
                    "icon-position": "start"
                },
                "icon": {
                    "this-is-bad-data": {
                        "uniface": {
                            "baddata": "bad"
                        }
                    }
                }
            }

            expect(base.fixData("TESTBASIC")).to.eql({0: 'T', 1: 'E', 2: 'S', 3: 'T', 4: 'B', 5: 'A', 6: 'S', 7: 'I', 8: 'C'})
            let returnData = base.fixData(UData)
            expect(returnData).to.eql(correctedData)

        });

        it("fixTriggerName", function () {
            triggerName = "trigger_Name__disabled"
            let fixTriggerName = base.fixTriggerName(triggerName)
            expect(fixTriggerName).to.equal("trigger-Name:disabled")
        });

        it("warn", function () {
            functionName = "tooBoolean"
            message = "Function does not return that value"
            consequence = "Aborting"
            consoleLogSpy = sandbox.spy(console, 'warn');
            base.warn(functionName, message, consequence)
            expect(consoleLogSpy.called).to.equal(true)
            sandbox.restore();
        });

        it("error", function () {
            functionName = "tooBoolean"
            message = "Function does not return that value"
            consequence = "Aborting"
            consoleLogSpy = sandbox.spy(console, 'error');
            base.error(functionName, message, consequence)
            expect(consoleLogSpy.called).to.equal(true)
            sandbox.restore();
        });
    });
})();