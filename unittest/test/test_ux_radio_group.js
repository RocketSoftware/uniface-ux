/**
 * Test ux-widget
 */
(function () {
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

    // for unit test
    const tester = new umockup.WidgetTester();
    const widgetId = tester.widgetId;
    const widgetName = tester.widgetName;

    // custom test variables 
    const valRepArray = [
        {
            value: "1",
            representation: "option 1"
        },
        {
            value: "2",

            representation: "option 2"
        },
        {
            value: "3",
            representation: "option 3"
        },
    ];

    const widgetLabelText = "Test Label";

    const selectedValue = "2";


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

            it("check u-error-icon", function () {
                assert(element.querySelector("span.u-error-icon"), "Widget misses or has incorrect u-error-icon element");
            });

            it("check u-label-text", function () {
                assert(element.querySelector("span.u-label-text"), "Widget misses or has incorrect u-label-text element");
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
                assert(widgetClass.defaultProperties, "widgetClass.defaultProperties is not defined!");
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
                if (classes[clazz]) {
                    expect(element).to.have.class(clazz, "widget element has class " + clazz);
                } else {
                    expect(element).not.to.have.class(clazz, "widget element has no class " + clazz);
                }
            });
        }

        it("check initial orientation is vertical", function () {
            expect(element).to.have.property("orientation", "vertical");
        });
    });

    describe("dataUpdate", function () {
        let widget;

        beforeEach(function () {
            widget = tester.createWidget();
        });

        it("Set HTML property", function (done) {
            widget.dataUpdate({
                html: { "readonly": true }
            });

            setTimeout(function () {
                let readOnlyBoolean = widget.elements.widget.getAttribute("aria-readonly");
                assert.equal(readOnlyBoolean, 'true');
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering

        });

        it("Set CLASS property", function (done) {
            widget.dataUpdate({
                classes: { "ClassA": true }
            });

            setTimeout(function () {
                let classAttributeValue = widget.elements.widget.getAttribute("class");
                let classExist = classAttributeValue.includes("ClassA");
                expect(classExist).to.be.true;
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering

        });

        it("Set Uniface property", function (done) {
            widget.dataUpdate({
                uniface: { "label-text": widgetLabelText }
            });

            setTimeout(function () {
                let labelTextValue = widget.elements.widget.querySelector(".u-label-text");
                assert.equal(labelTextValue.textContent, widgetLabelText);
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering
        });

        it("Set VALREP property", function (done) {
            widget.dataUpdate({
                valrep: valRepArray
            });

            setTimeout(function () {
                let radioButtonArray = widget.elements.widget.querySelectorAll("fluent-radio");
                radioButtonArray.forEach(function (node, index) {
                    assert.equal(node.value, valRepArray[index].value);
                    assert.equal(node.textContent, valRepArray[index].representation);
                });

                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering
        });

        it("Change multiple properties", function (done) {
            widget.dataUpdate({
                value: selectedValue,
                html: {"readonly": true},
                classes: { "ClassA": true },
                uniface: { "label-text": widgetLabelText },
                valrep: valRepArray

            });

            setTimeout(function () {

                let radioButtonArray = widget.elements.widget.querySelectorAll("fluent-radio");
                radioButtonArray.forEach(function (node, index) {
                    assert.equal(node.value, valRepArray[index].value);
                    assert.equal(node.textContent, valRepArray[index].representation);
                    if (selectedValue === valRepArray[index].value) {
                        assert(node.checked, "Selected radio button is not checked");
                    }
                });

                let classAttributeValue = widget.elements.widget.getAttribute("class");
                let classExist = classAttributeValue.includes("ClassA");
                expect(classExist).to.be.true;

                let readOnlyBoolean = widget.elements.widget.getAttribute("aria-readonly");
                assert.equal(readOnlyBoolean, 'true');

                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering

        });

    });

    // describe("Other API methods (not supported yet)", function () {
    //     const texts = [
    //         "getValue",
    //         "validate",
    //         "showError",
    //         "etc ..."
    //     ];

    //     for (let i = 0; i < texts.length; i++) {
    //         it(texts[i]);
    //     }

    // });

    describe("dataCleanup", function () {
        let widget;

        beforeEach(function () {
            widget = tester.createWidget();
        });

        it("value", function () {
            try {
                widget.dataCleanup({ value: new Set(), html: new Set(), uniface: new Set(), valrep: new Set() });
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
                value: widgetName,
                valrep: valRepArray,
            });
        });

    });

})();
