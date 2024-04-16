/**
 * Test ux-widget
 */
(function () {

    // test configuration
    const widgetId = "ux-widget";
    const widgetName = "UX.Button";

    /**
     * Default timeout for waiting for DOM rendering (in milliseconds)
     */
    const defaultAsyncTimeout = 100; //ms

    const assert = chai.assert;
    const expect = chai.expect;

    // update test page
    document.title = "Unit test - " + widgetName;
    let el = document.getElementById("widget-name");
    el.textContent = widgetName;

    var showTodoOk = true;
    //var showTodoOk = false;
    function assertTodo(message) {
        assert(showTodoOk, message);
    }

    // for unit test
    var widgetClass, widget, control, element, uxTagName;

    /* TODO: Not necessary for test, maybe for demo?
    // Set wait time between each test case
    beforeEach(function (done) {
        this.timeout(3000); // environment setup time 3 seconds
        setTimeout(done, 500);  // 500 ms
    });
    */

    function doProcessLayout() {
        if (!uxTagName) {
            const node = document.getElementById(widgetId);
            element = _uf.DOMNodeManager.parseCustomWidgetNode(node, widgetName);
            uxTagName = element.tagName;
        }
    }

    function constructWidget() {
        if (!widget) {
            if (!widgetClass) {
                widgetClass = UNIFACE.ClassRegistry.get(widgetName);
            }
            widget = new widgetClass();
        }
    }

    function connectWidget() {
        if (!element) {
            element = document.getElementById(widgetId);
        }
        if (!widget.elements) {
            widget.onConnect(element);
        }
    }

    function createWidget() {
        doProcessLayout();
        constructWidget();
        connectWidget();
        widget.dataInit();
    }

    describe("Uniface Mockup tests", function () {

        it("Get class " + widgetName, function () {
            widgetClass = UNIFACE.ClassRegistry.get(widgetName);
            assert(widgetClass, "widgetClass is not defined!");
        });

    });

    describe(widgetName + ".processLayout", function () {

        before(function () {
            widgetClass = UNIFACE.ClassRegistry.get(widgetName);
        });

        it("processLayout", doProcessLayout);

        describe("Checks", function () {

            beforeEach(doProcessLayout);

            it("check instance of HTMLElement", function () {
                expect(element).instanceOf(HTMLElement, "Function processLayout of " + widgetName + " does not return an HTMLElement.");
            });

            it("check tagName", function () {
                expect(element).to.have.tagName(uxTagName);
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
            constructWidget();
        });
        
        it("constructor", function () {
            try {
                constructWidget();
                assert(widget, "widget is not defined!");
            } catch (e) {
                assert(false, "Failed to construct new widget, exception " + e);
            }
        });

        it("onConnect", function () {
            connectWidget();
            assert(element, "Target element is not defined!");
            assert(widget.elements.widget === element, "widget is not connected");
        });

        it("dataInit", function () {
            connectWidget();
            widget.dataInit();
            expect(element).to.have.class("u-button", "widget element has class");
        });

    });

    describe("TODO: Event tests", function () {
        const texts = [
            "click",
            "etc ..."
        ];

        it("TODO: mapTrigger", function () {
            assertTodo("TODO: implement it!");
        });


        for (let i = 0; i < texts.length; i++) {
            it("TODO: " + texts[i], function () {
                assertTodo("TODO: implement it!");
            });
        }

    });

    describe("dataUpdate", function () {

        beforeEach(createWidget);

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
                value : widgetName,  // not empty value, required by icon-position=start
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

    describe("TODO: API methods", function () {
        const texts = [
            "getValue",
            "validate",
            "showError",
            "etc ..."
        ];

        for (let i = 0; i < texts.length; i++) {
            it("TODO: " + texts[i], function () {
                assertTodo("TODO: implement it!");
            });
        }

    });

    describe("dataCleanup", function () {

        beforeEach(createWidget);

        it("value", function () {
            try {
                widget.dataCleanup({ value: [], html: [], uniface: [] });
            } catch (e) {
                console.error(e);
                assert(false, "Failed to call dataCleanup(), exception " + e);
            }
        });

        it("style:color", function () {
            try {
                widget.dataCleanup({ html: [], style: ["color"], uniface: [] });
            } catch (e) {
                console.error(e);
                assert(false, "Failed to call dataCleanup(), exception " + e);
            }
        });

    });

    describe("End", function () {

        it("Set back to default", function () {
            widget.dataUpdate({
                value: widgetName
            });
        });

    });

})();
