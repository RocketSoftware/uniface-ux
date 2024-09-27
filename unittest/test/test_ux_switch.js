// Source code for refactored switch in git lab repo
// Branch Name: UNI-36667-refactor-uxswitch-demo-workbench
// https://gitlab.com/Uniface/sources/harness-project/-/tree/UNI-36667-refactor-uxswitch-demo-workbench?ref_type=heads

(function () {
    'use strict';

    // Keep this!
    if (umockup.testLoaded()) {
        return;
    }

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

    describe("Uniface static structure constructor definition", function () {

        it('should have a static property structure of type Element', function () {
            const widgetClass = tester.getWidgetClass();
            const structure = widgetClass.structure;
            expect(structure.constructor).to.be.an.instanceof(Element.constructor);
            expect(structure.tagName).to.equal('fluent-switch');
            expect(structure.styleClass).to.equal('');
            expect(structure.elementQuerySelector).to.equal('');
            expect(structure.attributeDefines).to.be.an('array');
            expect(structure.elementDefines).to.be.an('array');
            expect(structure.triggerDefines).to.be.an('array');
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

            it("check u-checked-message", function () {
                assert(element.querySelector("span.u-checked-message"), "Widget misses or has incorrect u-checked-message element");
            });

            it("check u-unchecked-message", function () {
                assert(element.querySelector("span.u-unchecked-message"), "Widget misses or has incorrect u-unchecked-message element");
            });

            it("check u-error-icon-unchecked", function () {
                assert(element.querySelector("span.u-error-icon-unchecked"), "Widget misses or has incorrect u-error-icon-unchecked element");
            });
            it("check u-error-icon-checked", function () {
                assert(element.querySelector("span.u-error-icon-checked"), "Widget misses or has incorrect u-error-icon-checked element");
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
                assert(widgetClass.defaultValues.classes['u-switch'], "Class is not defined");
            } catch (e) {
                assert(false, "Failed to construct new widget, exception " + e);
            }
        });

        it("onConnect", function () {
            const element = tester.processLayout();
            const widget = tester.onConnect();
            assert(widget.elements.widget.shadowRoot.querySelector("slot[name='switch']").hasAttribute("part"), "Attribute is added to defined slot element");
            assert(widget.elements.widget.shadowRoot.querySelector("slot[name='switch']").getAttribute("part") === "switch-toggle", "Attribute value is not switch-toggle")
            assert(element, "Target element is not defined!");
            assert(widget.elements.widget === element, "widget is not connected");
        });

    });

    describe("mapTrigger", function () {
        const widget = tester.onConnect();
        widget.mapTrigger("onchange");
    })

    describe("dataInit", function () {
        const defaultValues = tester.getDefaultValues();
        const classes = defaultValues.classes
        var element;

        beforeEach(function () {
            tester.dataInit();
            element = tester.element;
            assert(element, "Widget top element is not defined!");
        });


        for (const defaultClass in classes) {
            it("check class '" + defaultClass + "'", function () {
                if (classes[defaultClass]) {
                    expect(element).to.have.class(defaultClass, "widget element has class " + defaultClass);
                } else {
                    expect(element).not.to.have.class(defaultClass, "widget element has no class " + defaultClass);
                }
            });
        }
    });

    describe("dataUpdate", function () {
        let widget, element;
        before(function () {
            widget = tester.createWidget();
            element = tester.element;
            assert(element, "Widget top element is not defined!");
        });

        it("set value to 1 and make the switch toggle", function (done) {
            tester.dataUpdate({
                value: 1
            });
            setTimeout(function () {
                expect(element).to.have.class("checked");
                expect(element.getAttribute("current-checked")).equal("true");
                done();
            }, defaultAsyncTimeout);
        });

        it("set value to false and make the switch toggle in unchecked state", function (done) {
            tester.dataUpdate({
                value: false
            });
            setTimeout(function () {
                expect(element).to.not.have.class("checked");
                expect(element.getAttribute("current-checked")).equal("false");
                done();
            }, defaultAsyncTimeout);
        });

        it("set label to switch", function (done) {
            let switchLabelText = "Label";
            tester.dataUpdate({
                uniface: {
                    "label-text": switchLabelText
                }
            });
            setTimeout(function () {
                let labelText = widget.elements.widget.querySelector("span.u-label-text").innerText;
                assert.equal(labelText, switchLabelText);//Check for visibility
                assert(!widget.elements.widget.querySelector("span.u-label-text").hasAttribute("hidden"), "Failed to show the label text");
                done();
            }, defaultAsyncTimeout);
        });

        it("set checked message", function (done) {
            let switchCheckedText = "On";
            tester.dataUpdate({
                uniface: {
                    "checked-message": switchCheckedText
                },
                value: 1
            });
            setTimeout(function () {
                let checkedText = widget.elements.widget.querySelector("span.u-checked-message").innerText;
                assert.equal(checkedText, switchCheckedText);//Check for visibility
                assert(!widget.elements.widget.querySelector("span.u-checked-message").hasAttribute("hidden"), "Failed to show the checked message text");
                expect(widget.elements.widget.querySelector("span.u-checked-message").getAttribute("slot")).equal("checked-message");
                expect(widget.elements.widget.querySelector("span.u-unchecked-message").hasAttribute("hidden"), "Failed to hide unchecked message")
                done();
            }, defaultAsyncTimeout);
        });

        it("set unchecked message", function (done) {
            let switchUnCheckedText = "Off"
            tester.dataUpdate({
                uniface: {
                    "unchecked-message": switchUnCheckedText
                },
                value: 0
            });
            setTimeout(function () {
                let uncheckedText = widget.elements.widget.querySelector("span.u-unchecked-message").innerText;
                assert.equal(uncheckedText, switchUnCheckedText);//Check for visibility
                assert(!widget.elements.widget.querySelector("span.u-unchecked-message").hasAttribute("hidden"), "Failed to show the checked message text");
                expect(widget.elements.widget.querySelector("span.u-unchecked-message").getAttribute("slot")).equal("unchecked-message");
                expect(widget.elements.widget.querySelector("span.u-checked-message").hasAttribute("hidden"), "Failed to hide unchecked message")
                done();
            }, defaultAsyncTimeout);
        });
    });

    describe('Switch onchange event', function () {
        let switchElement, onchangeSpy, widget;
        beforeEach(function () {

            widget = tester.createWidget();
            switchElement = tester.element;

            // Create a spy for the onchange event
            onchangeSpy = sinon.spy();

            // Add the onchange event listener to the switch element
            switchElement.addEventListener('onchange', onchangeSpy);
        });

        // Clean up after each test
        afterEach(function () {
            // Restore the spy to its original state
            sinon.restore();
        });

        // Test case for the onchange event
        it('should call the onchange event handler when the switch is toggled', function () {
            // Simulate a change event
            const event = new window.Event('onchange');
            switchElement.dispatchEvent(event);

            // Assert that the onchange event handler was called once
            expect(onchangeSpy.calledOnce).to.be.true;
        });
    });

    describe("showError", function () {
        let widget, element;
        before(function () {
            widget = tester.createWidget();
            element = tester.element;
            assert(element, "Widget top element is not defined!");
        });

        it("set invalid value when switch checked state is false", function (done) {
            tester.dataUpdate({
                value: ""
            });
            setTimeout(function () {
                expect(element).to.have.class("u-format-invalid");
                assert(widget.elements.widget.querySelector("span.u-unchecked-message").hasAttribute("hidden"), "Failed to show the checked message text");
                expect(widget.elements.widget.querySelector("span.u-unchecked-message").getAttribute("slot")).equal("");
                expect(widget.elements.widget.querySelector("span.u-checked-message").hasAttribute("hidden"), "Failed to hide unchecked message")
                done();
            }, defaultAsyncTimeout);
        })
    });

    describe("hideError", function () {
        let widget, element;
        before(function () {
            widget = tester.createWidget();
            element = tester.element;
            assert(element, "Widget top element is not defined!");
        });

        it("set error to false", function (done) {
            tester.dataUpdate({
                value: 1
            });
            setTimeout(function () {
                expect(element).to.not.have.class("u-format-invalid");
                assert(!widget.elements.widget.querySelector("span.u-unchecked-message").hasAttribute("hidden"), "Failed to show the checked message text");
                expect(widget.elements.widget.querySelector("span.u-unchecked-message").getAttribute("slot")).equal("unchecked-message");
                expect(widget.elements.widget.querySelector("span.u-checked-message").hasAttribute("hidden"), "Failed to hide unchecked message")
                done();
            }, defaultAsyncTimeout);
        })
    })

    describe("reset all properties", function () {
        it("reset all property", function () {
            try {
                tester.dataUpdate(tester.getDefaultValues());
            } catch (e) {
                console.error(e);
                assert(false, "Failed to call dataCleanup(), exception " + e);
            }
        });
    });

})();
