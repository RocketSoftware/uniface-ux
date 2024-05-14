(function () {

    /**
     * Default timeout for waiting for DOM rendering (in milliseconds)
     */
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

    describe(widgetName + ".processLayout", function () {
        let element;

        it("processLayout", function () {
            element = tester.processLayout();
            expect(element).to.have.tagName(tester.uxTagName);
        });

        describe("Checks", function () {

            before(function () {
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

            it("check u-label-text", function () {
                assert(element.querySelector("span.u-label-text"), "Widget misses or has incorrect u-label-text element");
            });

            it("check u-error-icon", function () {
                assert(element.querySelector("span.u-error-icon"), "Widget misses or has incorrect u-error-icon element");
            });

        });

    });

    describe("Create widget", function () {
        before(function () {
            tester.construct();
        });

        it("constructor", function () {
            try {
                const widget = tester.construct();
                assert(widget, "widget is not defined!");
                const widgetClass = tester.getWidgetClass();
                assert(widgetClass.defaultProperties.classes['u-text-area'], "Class is not defined");
            } catch (e) {
                assert(false, "Failed to construct new widget, exception " + e);
            }
        });

        it("onConnect", function (done) {
            const element = tester.processLayout();
            const widget = tester.construct();
            setTimeout(function () {
                widget.onConnect(element);
                assert(element, "Target element is not defined!");
                assert(widget.elements.widget === element, "widget is not connected");
                done()
            }, defaultAsyncTimeout);
        });

    });



    describe("dataUpdate", function () {
        let widget;
        before(function () {
            widget = tester.createWidget();
        });

        it("show label", function (done) {
            let textAreaLabel = 'Label';
            // Calling mock dataUpdate to have updated widgetProperties and then call widget dataUpdate()
            tester.dataUpdate({
                uniface: {
                    "label-text": textAreaLabel
                }

            });

            setTimeout(function () {
                let labelText = widget.elements.widget.querySelector("span.u-label-text").innerText;
                assert.equal(labelText, textAreaLabel);//Check for visibility
                assert(!widget.elements.widget.querySelector("span.u-label-text").hasAttribute("hidden"), "Failed to show the label text");
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering

        });

        it("Set label position before", function (done) {
            tester.dataUpdate({
                uniface: {
                    "label-position": "before"
                }

            });

            setTimeout(function () {
                let labelPosition = widget.elements.widget.getAttribute('u-label-position');
                assert.equal(labelPosition, 'before');
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering

        });

        it("check label position before styles", function () {
            //if u-label-position attribute is added element display is changed
            let numberFieldStyle = window.getComputedStyle(widget.elements.widget, null);
            let displayPropertyValue = numberFieldStyle.getPropertyValue("display");
            assert.equal(displayPropertyValue, "inline-flex");
            let labelStyle = window.getComputedStyle(widget.elements.widget.shadowRoot.querySelector('.label'), null);
            let alignPropertyValue = labelStyle.getPropertyValue("align-content");
            assert.equal(alignPropertyValue, "center")
        });

        it("Set label position below", function (done) {
            tester.dataUpdate({
                uniface: {
                    "label-position": "below"
                }

            });

            setTimeout(function () {
                let labelPosition = widget.elements.widget.getAttribute('u-label-position');
                assert.equal(labelPosition, 'below');
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering

        });

        it("check label position below styles", function () {
            //if u-label-position attribute is added element display is changed
            let numberFieldStyle = window.getComputedStyle(widget.elements.widget, null);
            let flexPropertyValue = numberFieldStyle.getPropertyValue("flex-direction");
            assert.equal(flexPropertyValue, "column");
            let labelStyle = window.getComputedStyle(widget.elements.widget.shadowRoot.querySelector('.label'), null);
            let orderPropertyValue = labelStyle.getPropertyValue("order");
            assert.equal(orderPropertyValue, 2)
        });

        it("reset label and its position", function (done) {
            tester.dataUpdate({
                uniface: {
                    "label-position": uniface.RESET,
                    "label-text": uniface.RESET
                }

            });

            setTimeout(function () {
                let labelPosition = widget.elements.widget.getAttribute('u-label-position');
                assert.equal(labelPosition, 'above');
                assert(widget.elements.widget.querySelector("span.u-label-text").hasAttribute("hidden"), "Failed to hide the label text");
                assert.equal(widget.elements.widget.querySelector("span.u-label-text").innerText, "");
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering

        });

        it("check reset label position styles", function () {
            //if u-label-position attribute is added element display is changed
            let numberFieldStyle = window.getComputedStyle(widget.elements.widget, null);
            let flexPropertyValue = numberFieldStyle.getPropertyValue("flex-direction");
            assert.equal(flexPropertyValue, "column");
        });
    });

    describe("dataCleanup", function () {
        let widget;
        before(function () {
            widget = tester.createWidget();
        });
        it("reset all property", function () {
            try {
                widget.dataCleanup(tester.widgetProperties);
            } catch (e) {
                console.error(e);
                assert(false, "Failed to call dataCleanup(), exception " + e);
            }
        });
    });
})();
