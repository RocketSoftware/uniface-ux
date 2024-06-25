/**
 * Test ux-widget
 */
(function () {
    'use strict';

    // Keep this!
    if (umockup.testLoaded()) {
        return;
    }

    const assert = chai.assert;
    const expect = chai.expect;

    /* To be moved to template
    // Not necessary for test, maybe for demo? : 
    // Set wait time between each test case
    beforeEach(function (done) {
        this.timeout(3000); // environment setup time 3 seconds
        setTimeout(done, 500);  // 500 ms
    });
    */

    // for unit test
    const tester = new umockup.WidgetTester();
    const widgetId = tester.widgetId;
    const widgetName = tester.widgetName;

    describe("Uniface Mockup tests", function () {

        it("Get class " + widgetName, function () {
            const widgetClass = tester.getWidgetClass();
            assert(widgetClass, "widgetClass is not defined! \n    Check if the JavaScript file for " + widgetName + " is loaded.");
        });

    });

    describe(widgetName + ".processLayout", function () {
        let element;

        it("processLayout", function () {
            element = tester.processLayout();
            expect(element).to.have.tagName(tester.uxTagName);
        });

        describe("Checks", function () {

            beforeEach(function () {
                element = tester.processLayout();
            });

            it("check instance of HTMLElement", function () {
                expect(element).instanceOf(HTMLElement, "Function processLayout of " + widgetName + " does not return an HTMLElement.");
            });

            it("check tagName", function () {
                expect(element).to.have.tagName(tester.uxTagName);
            });

            it("check id", function () {
                expect(element).to.have.id(widgetId);
            });

            it("check u-icon", function () {
                assert(element.querySelector("span.u-icon"), "Widget misses or has incorrect u-icon element");
            });

            it("check u-text", function () {
                assert(element.querySelector("span.u-text"), "Widget misses or has incorrect u-text element");
            });

        });

    });

    describe("Create widget", function () {

        beforeEach(function () {
            tester.construct();
        });

        it("constructor", function () {
            try {
                const widget = tester.construct();
                assert(widget, "widget is not defined!");
                assert.strictEqual(widget.widget.id.toString().length > 0, true);
            } catch (e) {
                assert(false, "Failed to construct new widget, exception " + e);
            }

        });

        describe("onConnect", function () {
            const element = tester.processLayout();
            const widget = tester.onConnect();

            it("check element created and connected", function () {
                assert(element, "Target element is not defined!");
                assert(widget.elements.widget === element, "widget is not connected");
            });

            it("check span elements 'u-icon' and 'u-text'", function () {
                expect(widget.elements.buttonIconElement).to.have.class("u-icon", 'widget element has class "u-icon"');
                expect(widget.elements.buttonTextElement).to.have.class("u-text", 'widget element has class "u-text"');
            });

            it("check 'hidden' attributes", function () {
                assert.notEqual(widget.elements.buttonIconElement.getAttribute('hidden'), null);
                assert.notEqual(widget.elements.buttonTextElement.getAttribute('hidden'), null);
            });

        });

    });

    describe("dataInit", function () {
        const defaultProperties = tester.getDefaultProperties();
        const classes = defaultProperties.classes;
        var element;

        beforeEach(function () {
            tester.dataInit();
            element = tester.element;
            assert(element, "Widget top element is not defined!");
        });

        for (const clazz in classes) {
            it("check class '" + clazz + "'", function () {
                if (classes[clazz]) {
                    expect(element).to.have.class(clazz, "widget element has class " + clazz);
                } else {
                    expect(element).not.to.have.class(clazz, "widget element has no class " + clazz);
                }
            });
        }

        it("check span elements 'u-icon' and 'u-text'", function () {
            expect(tester.widget.elements.buttonIconElement).to.have.class("u-icon", 'widget element has class "u-icon"');
            expect(tester.widget.elements.buttonTextElement).to.have.class("u-text", 'widget element has class "u-text"');
        });

        it("check 'hidden' attributes", function () {
            assert.notEqual(tester.widget.elements.buttonIconElement.getAttribute('hidden'), null);
            assert.notEqual(tester.widget.elements.buttonTextElement.getAttribute('hidden'), null);
        });

        it("check widget id", function () {
            assert.strictEqual(tester.widget.widget.id.toString().length > 0, true);
        });

        it("check 'icon' and 'icon-position'", function () {
            assert.equal(tester.widget.data.iconName, '');
            assert.equal(tester.widget.data.iconPosition, 'start');
        });

        it("check value", function () {
            assert.equal(tester.widget.data.value, '');
        });

    });

    describe("Event tests (not supported yet)", function () {
        const texts = [
            "click",
            "etc ..."
        ];

        it("mapTrigger");

        for (let i = 0; i < texts.length; i++) {
            it(texts[i]);
        }

    });

    describe("dataUpdate", function () {
        const asyncRun = umockup.asyncRun;
        let widget;

        beforeEach(function () {
            widget = tester.createWidget();
        });

        const texts = ["Button Text 1", "Button Text 2", "Button Text 3"];
        for (let i = 0; i < texts.length; i++) {
            it("Set value to '" + texts[i] + "'", async function () {
                await asyncRun(function () {
                    widget.dataUpdate({
                        value: texts[i]
                    });

                });

                let buttonText = widget.elements.widget.querySelector("span.u-text").innerText;
                assert.equal(buttonText, texts[i]);

            });
        }

        it("Set HTML property", async function () {
            await asyncRun(function () {
                widget.dataUpdate({
                    html: { appearance: "accent" }
                });

            });

            let appearanceValue = widget.elements.widget.getAttribute('appearance');
            assert.equal(appearanceValue, 'accent');

        });

        it("Set STYLE property", async function () {
            await asyncRun(function () {
                widget.dataUpdate({
                    style: { "background-color": "green" }
                });

            });

            let buttonStyle = window.getComputedStyle(widget.elements.widget, null);
            let bgColor = buttonStyle.getPropertyValue("background-color");
            assert.equal(bgColor, 'rgb(0, 128, 0)');

        });

        it("Set CLASS property", async function () {
            await asyncRun(function () {
                widget.dataUpdate({
                    classes: { "ClassA": true }
                });

            });

            let classAttributeValue = widget.elements.widget.getAttribute('class');
            let classExist = classAttributeValue.includes('ClassA');
            expect(classExist).to.be.true;

        });

        it("Set icon and icon-position", async function () {
            await asyncRun(function () {
                widget.dataUpdate({
                    value: widgetName,  // not empty value, required by icon-position=start
                    uniface: { icon: "IncomingCall", 'icon-position': "start" }
                });

            });

            let buttonIcon = widget.elements.widget.querySelector("span.u-icon.ms-Icon.ms-Icon--IncomingCall[slot='start'");
            assert.notEqual(buttonIcon, null);

        });

        // Multiple properties update
        it("Change multiple properties", async function () {
            await asyncRun(function () {
                widget.dataUpdate({
                    value: "Button Text",
                    html: { appearance: "accent" },
                    style: { "background-color": "green" },
                    classes: { "ClassA": true },
                    uniface: { icon: "IncomingCall", 'icon-position': "start" }
                });

            });

            let buttonText = widget.elements.widget.querySelector("span.u-text").innerText;
            assert.equal(buttonText, "Button Text");

            let appearanceValue = widget.elements.widget.getAttribute('appearance');
            assert.equal(appearanceValue, 'accent');

            let buttonStyle = window.getComputedStyle(widget.elements.widget, null);
            let bgColor = buttonStyle.getPropertyValue("background-color");
            assert.equal(bgColor, 'rgb(0, 128, 0)');

            let classAttributeValue = widget.elements.widget.getAttribute('class');
            let classExist = classAttributeValue.includes('ClassA');
            expect(classExist).to.be.true;

            let buttonIcon = widget.elements.widget.querySelector("span.u-icon.ms-Icon.ms-Icon--IncomingCall[slot='start'");
            assert.notEqual(buttonIcon, null);

        });

        // set icon-position="" empty string
        it("Set icon-position=''", async function () {
            await asyncRun(function () {
                // test preparation: first set icon-position="end"
                widget.dataUpdate({
                    value: widgetName,  // not empty value, required by icon-position=start
                    uniface: { icon: "IncomingCall", 'icon-position': "end" }
                });

                // now try to restore icon-property back to "start"
                widget.dataUpdate({
                    value: widgetName,  // not empty value, required by icon-position=start
                    uniface: { icon: "IncomingCall", 'icon-position': "" }
                });

            });

            // expected icon-position restored to "start"
            let buttonIcon = widget.elements.widget.querySelector("span.u-icon.ms-Icon.ms-Icon--IncomingCall[slot='start'");
            assert.notEqual(buttonIcon, null);

        });

        // set icon-position=uniface.RESET
        it("Set icon-position=uniface.RESET", async function () {
            await asyncRun(function () {
                // test preparation: first set icon-position="end"
                widget.dataUpdate({
                    value: widgetName,  // not empty value, required by icon-position=start
                    uniface: { icon: "IncomingCall", 'icon-position': "end" }
                });

                // now try to restore icon-position property back to "start"
                widget.dataUpdate({
                    value: widgetName,  // not empty value, required by icon-position=start
                    uniface: { icon: "IncomingCall", 'icon-position': uniface.RESET }
                });

            });

            let buttonIcon = widget.elements.widget.querySelector("span.u-icon.ms-Icon.ms-Icon--IncomingCall[slot='start'");
            assert.notEqual(buttonIcon, null);

        });

        // set fake Uniface property "XYZ"="xyz", both icon and icon-position will become "undefined"
        it("Set fake Uniface property 'XYZ'='xyz'", async function () {
            await asyncRun(function () {
                // test preparation: first set icon-position="end"
                widget.dataUpdate({
                    value: widgetName,  // not empty value, required by icon-position=start
                    uniface: { icon: "IncomingCall", 'icon-position': "end" }
                });

                // now set fake Uniface property XYZ="xyz"
                // note: do not supply argument: value : widgetName
                widget.dataUpdate({
                    uniface: { XYZ: "xyz" }
                });

            });

            let buttonIcon = widget.elements.widget.querySelector("span.u-icon.ms-Icon.ms-Icon--IncomingCall[slot='end'");
            assert.notEqual(buttonIcon, null);

        });

    });

    describe("Samples of async test cases", function () {
        const asyncRun = umockup.asyncRun;
        let widget;

        beforeEach(function () {
            widget = tester.createWidget();
        });

        // sample of old code: TO BE REMOVED
        // it("Set STYLE property (old way, setTimeout, done)", function (done) {
        //     widget.dataUpdate({
        //         style: { "background-color": "red" }
        //     });
        //
        //     setTimeout(function () {
        //         let buttonStyle = window.getComputedStyle(widget.elements.widget, null);
        //         let bgColor = buttonStyle.getPropertyValue("background-color");
        //         assert.equal(bgColor, 'rgb(255, 0, 0)');
        //         done();
        //     }, 100); // Wait for DOM rendering
        //
        // });

        // sample of hybrid code: : To be moved to template
        // it("Set STYLE property 2 (new API asyncRun(), setTimeout)", async function () {
        //     await asyncRun(function() {
        //         widget.dataUpdate({
        //             style: { "background-color": "green" }
        //         });
        //     }, 100);
        //
        //     let buttonStyle = window.getComputedStyle(widget.elements.widget, null);
        //     let bgColor = buttonStyle.getPropertyValue("background-color");
        //     assert.equal(bgColor, 'rgb(0, 128, 0)');
        // });

        // async code to be used
        it("Set STYLE property (new API asyncRun(), MutationObserver)", async function () {
            await asyncRun(function () {
                widget.dataUpdate({
                    style: { "background-color": "red" }
                });

            });

            let buttonStyle = window.getComputedStyle(widget.elements.widget, null);
            let bgColor = buttonStyle.getPropertyValue("background-color");
            assert.equal(bgColor, 'rgb(255, 0, 0)');

        });

    });

    describe("Other API methods (not supported yet)", function () {
        const texts = [
            "getValue",
            "validate",
            "showError",
            "etc ..."
        ];

        for (let i = 0; i < texts.length; i++) {
            it(texts[i]);
        }

    });

    describe("dataCleanup", function () {
        let widget;

        beforeEach(function () {
            widget = tester.createWidget();
        });

        it("value", function () {
            try {
                widget.dataCleanup({ value: new Set(), html: new Set(), uniface: new Set() });
            } catch (e) {
                console.error(e);
                assert(false, "Failed to call dataCleanup(), exception " + e);
            }

        });

        it("style:color", function () {
            try {
                widget.dataCleanup({ html: new Set(), style: new Set(["color"]), uniface: new Set() });
            } catch (e) {
                console.error(e);
                assert(false, "Failed to call dataCleanup(), exception " + e);
            }

        });

    });

    describe("End", function () {
        let widget;

        beforeEach(function () {
            widget = tester.createWidget();
        });

        it("Set back to default", function () {
            widget.dataUpdate({
                value: widgetName
            });

        });

    });

})();
