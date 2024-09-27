/**
 * Test ux-widget
 */
(function () {
    'use strict';

    /**
     * Default timeout for waiting for DOM rendering (in milliseconds)
     */
    const defaultAsyncTimeout = 100; //ms

    const assert = chai.assert;
    const expect = chai.expect;

    /* TODO: Not necessary for test, maybe for demo?
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

        /**
         * Only for template. Remove this test case from your widget unit test.
         */
        it("unit test script check", function () {
            assert(false, `The template file 'test_ux_template.js' is using.                 
                Hint: if you do not have the unit test script '${umockup.getTestJsName()}', 
                      create it by copying 'test_ux_template.js,
                      and remove this test case.'.
            \n`);
        });

        it("get class " + widgetName, function () {
            const widgetClass = tester.getWidgetClass();
            assert(widgetClass, `Widget class '${widgetName}' is not defined!
                Hint: Check if the JavaScript file defined class '${widgetName}' is loaded.
                      If not, add <script> element in the header of this html page to load it.
            \n`);
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
                const widgetClass = tester.getWidgetClass();
                //assert(widgetClass.defaultProperties, "widgetClass.defaultProperties is not defined!");
            } catch (e) {
                assert(false, "Failed to construct new widget, exception " + e);
            }
        });

        it("onConnect", function () {
            const element = tester.processLayout();
            const widget = tester.onConnect();
            assert(element, "Target element is not defined!");
            assert(widget.elements.widget === element, "widget is not connected");
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
                if ( classes[clazz] ) {
                    expect(element).to.have.class(clazz, "widget element has class " + clazz);
                } else {
                    expect(element).not.to.have.class(clazz, "widget element has no class " + clazz);
                }
            });
        }
    

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
        let widget;

        beforeEach(function () {
            widget = tester.createWidget();
        });

        const texts = ["Button Text 1", "Button Text 2", "Button Text 3"];
        for (let i = 0; i < texts.length; i++) {
            it("Set value to '" + texts[i] + "'", function (done) {
                widget.dataUpdate({
                    value: texts[i]
                });

                setTimeout(function () {
                    let buttonText = widget.elements.widget.querySelector("span.u-text").innerText;
                    assert.equal(buttonText, texts[i]);
                    done();
                }, defaultAsyncTimeout); // Wait for DOM rendering

            });
        }

        it("Set HTML property", function (done) {
            //html: {appearance: "accent"}  // but: it stays as neutral not accent, but class accent is well set
            widget.dataUpdate({
                html: { appearance: "accent" }
            });

            setTimeout(function () {
                let appearanceValue = widget.elements.widget.getAttribute('appearance');
                assert.equal(appearanceValue, 'accent');
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering

        });

        it("Set STYLE property", function (done) {
            widget.dataUpdate({
                style: { "background-color": "green" }
            });

            setTimeout(function () {
                let buttonStyle = window.getComputedStyle(widget.elements.widget, null);
                let bgColor = buttonStyle.getPropertyValue("background-color");
                assert.equal(bgColor, 'rgb(0, 128, 0)');
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering

        });

        it("Set CLASS property", function (done) {
            widget.dataUpdate({
                classes: { "ClassA": true }
            });

            setTimeout(function () {
                let classAttributeValue = widget.elements.widget.getAttribute('class');
                let classExist = classAttributeValue.includes('ClassA');
                expect(classExist).to.be.true;
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering

        });

        it("Set icon and icon-position", function (done) {
            widget.dataUpdate({
                value: widgetName,  // not empty value, required by icon-position=start
                uniface: { icon: "IncomingCall", 'icon-position': "start" }
            });

            setTimeout(function () {
                let buttonIcon = widget.elements.widget.querySelector("span.u-icon.ms-Icon.ms-Icon--IncomingCall[slot='start'");
                assert.notEqual(buttonIcon, null);
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering

        });

        // Multiple properties update
        it("Change multiple properties", function (done) {
            widget.dataUpdate({
                value: "Button Text",
                html: { appearance: "accent" },
                style: { "background-color": "green" },
                classes: { "ClassA": true },
                uniface: { icon: "IncomingCall", 'icon-position': "start" }
            });

            setTimeout(function () {
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

                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering

        });

    });

    describe("Samples of async test cases", function () {
		const asyncRun = umockup.asyncRun;
        let widget;

        beforeEach(function () {
            widget = tester.createWidget();
        });

        it("Set STYLE property 1 (setTimeout)", function (done) {
            widget.dataUpdate({
                style: { "background-color": "green" }
            });

            setTimeout(function () {
                let buttonStyle = window.getComputedStyle(widget.elements.widget, null);
                let bgColor = buttonStyle.getPropertyValue("background-color");
                assert.equal(bgColor, 'rgb(0, 128, 0)');
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering

        });

        it("Set STYLE property 2 (promise 1)", function () { 
            const p = asyncRun(function() {
                widget.dataUpdate({
                    style: { "background-color": "green" }
                });
            });
            return p.then(function () { // check result
                let buttonStyle = window.getComputedStyle(widget.elements.widget, null);
                let bgColor = buttonStyle.getPropertyValue("background-color");
                assert.equal(bgColor, 'rgb(0, 128, 0)');
            });
        });

        it("Set STYLE property 3 (promise 2)", function () { 
            return asyncRun(function() {
                widget.dataUpdate({
                    style: { "background-color": "green" }
                });
            }).then(function () { // check result
                let buttonStyle = window.getComputedStyle(widget.elements.widget, null);
                let bgColor = buttonStyle.getPropertyValue("background-color");
                assert.equal(bgColor, 'rgb(0, 128, 0)');
            });
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
