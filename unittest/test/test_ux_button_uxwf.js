// Source code for refactored switch in git lab repo
// Branch Name: UNI-37232-refactor-uxbutton
// https://gitlab.com/Uniface/sources/harness-project/-/tree/UNI-37232-refactor-uxbutton?ref_type=heads

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
            expect(structure.tagName).to.equal('fluent-button');
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

            it("check u-text", function () {
                assert(element.querySelector("span.u-text"), "Widget misses or has incorrect u-text element");
            });
            it("check u-icon", function () {
                assert(element.querySelector("span.u-icon"), "Widget misses or has incorrect u-icon element");
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
                assert(widgetClass.defaultValues.classes['u-button'], "Class is not defined");
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
        });

    });

    describe("mapTrigger", function () {
        const widget = tester.onConnect();
        widget.mapTrigger("click");
    })

    describe("dataInit", function () {
        const defaultValues = tester.getDefaultValues();
        const classes = defaultValues.classes
        var element;

        beforeEach(function () {
            tester.dataInit();
            element = tester.element;
            const widget = tester.onConnect();
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

        it("check 'hidden' attributes", function () {
            assert.notEqual(element.querySelector('span.u-text').getAttribute('hidden'), null);
            assert.notEqual(element.querySelector('span.u-icon').getAttribute('hidden'), null);
        });

        it("check widget id", function () {
            assert.strictEqual(tester.widget.widget.id.toString().length > 0, true);
        });

        it("check 'icon' and 'icon-position'", function () {
            let unifaceProperties = tester.defaultValues.uniface;
            assert.equal(unifaceProperties["icon"], '');
            assert.equal(unifaceProperties["icon-position"], 'start');
        });

        it("check value", function () {
            assert.equal(tester.defaultValues.value, '');
        });
    });

    describe("dataUpdate", function () {
        let widget, element;
        before(function () {
            widget = tester.createWidget();
            element = tester.element;
            assert(element, "Widget top element is not defined!");
        });

        it("update only button text", function (done) {
            let buttonText = 'Button';
            tester.dataUpdate({
                value: buttonText
            });
            setTimeout(function () {
                expect(element.querySelector('span.u-text').innerText).equal(buttonText);
                assert(!element.querySelector("span.u-text").hasAttribute("hidden"), "Failed to show the button text");
                assert(element.querySelector('span.u-icon').hasAttribute("hidden"));
                done();
            }, defaultAsyncTimeout);
        });
        it("update  button text , icon and  icon-position to default", function (done) {
            let buttonText = 'Button';
            tester.dataUpdate({
                value: buttonText,
                uniface: {
                    icon: "home"
                }
            });
            setTimeout(function () {
                expect(element.querySelector('span.u-text').innerText).equal(buttonText);
                assert(!element.querySelector("span.u-text").hasAttribute("hidden"), "Failed to show the button text");
                assert(!element.querySelector("span.u-icon").hasAttribute("hidden"), "Failed to show the icon");
                expect(element.querySelector('span.u-icon').getAttribute("slot")).equal(tester.defaultValues.uniface["icon-position"]);
                done();
            }, defaultAsyncTimeout);
        });

        it("update icon-position to end", function (done) {
            let buttonText = 'Button';
            let iconPosition = "end";
            tester.dataUpdate({
                uniface: {
                    "icon-position": iconPosition
                },
                value: buttonText,
            });
            setTimeout(function () {
                expect(element.querySelector('span.u-text').innerText).equal(buttonText);
                assert(!element.querySelector("span.u-text").hasAttribute("hidden"), "Failed to show the button text");
                assert(!element.querySelector("span.u-icon").hasAttribute("hidden"), "Failed to show the icon");
                expect(element.querySelector('span.u-icon').getAttribute("slot")).equal(iconPosition);
                done();
            }, defaultAsyncTimeout);
        });

        it("update icon only button", function (done) {
            let buttonText = '';
            tester.dataUpdate({
                value: buttonText
            });
            setTimeout(function () {
                expect(element.querySelector('span.u-text').innerText).equal(buttonText);
                assert(element.querySelector("span.u-text").hasAttribute("hidden"), "Failed to hide the button text");
                assert(!element.querySelector("span.u-icon").hasAttribute("hidden"), "Failed to show the icon");
                expect(element.querySelector('span.u-icon').getAttribute("slot")).equal("");
                done();
            }, defaultAsyncTimeout);
        });

        it("update button text and icon will move to last selected slot", function (done) {
            let buttonText = 'Button';
            tester.dataUpdate({
                value: buttonText
            });
            setTimeout(function () {
                expect(element.querySelector('span.u-text').innerText).equal(buttonText);
                assert(!element.querySelector("span.u-text").hasAttribute("hidden"), "Failed to hide the button text");
                assert(!element.querySelector("span.u-icon").hasAttribute("hidden"), "Failed to show the icon");
                expect(element.querySelector('span.u-icon').getAttribute("slot")).equal(tester.widget.data.properties.uniface["icon-position"]);
                done();
            }, defaultAsyncTimeout);
        });

        it("if icon-position is other than start and end then it should allot default slot to icon", function (done) {
            let buttonText = 'Button';
            tester.dataUpdate({
                uniface: {
                    "icon-position": "stat"
                },
            });
            setTimeout(function () {
                expect(element.querySelector('span.u-text').innerText).equal(buttonText);
                assert(!element.querySelector("span.u-text").hasAttribute("hidden"), "Failed to show the button text");
                assert(!element.querySelector("span.u-icon").hasAttribute("hidden"), "Failed to show the icon");
                expect(element.querySelector('span.u-icon').getAttribute("slot")).equal(tester.defaultValues.uniface["icon-position"]);
                done();
            }, defaultAsyncTimeout);
        });

    });

    describe('Button click event', function () {
        let buttonElement, onClickSpy, widget;
        beforeEach(function () {

            widget = tester.createWidget();
            buttonElement = tester.element;

            // Create a spy for the click event
            onClickSpy = sinon.spy();

            // Add the click event listener to the button element
            buttonElement.addEventListener('click', onClickSpy);
        });

        // Clean up after each test
        afterEach(function () {
            // Restore the spy to its original state
            sinon.restore();
        });

        // Test case for the click event
        it('should call the click event handler when the button is clicked', function () {
            // Simulate a click event
            const event = new window.Event('click');
            buttonElement.dispatchEvent(event);

            // Assert that the click event handler was called once
            expect(onClickSpy.calledOnce).to.be.true;
        });
    });

    describe("showError", function () {
        it("Not required", function () { });
    });

    describe("hideError", function () {
        it("Not required", function () { });

    })

    describe("Test SlottedButtonText class", function () {
        const widgetClass = tester.getWidgetClass();
        let styleClass = "u-text"
        let elementQuerySelector = ".u-text"
        let instance;
        beforeEach(function () {
            instance = new widgetClass.SlottedButtonText(widgetClass, styleClass, elementQuerySelector);
        });

        it('should initialize with the correct properties', function () {
            expect(instance.widgetClass).to.equal(widgetClass);
        });

        it('should register default value', function () {
            expect(instance.widgetClass.defaultValues.value).equal("");

        });

        it('should generate and return layout correctly', function () {
            const layout = instance.getLayout();
            expect(layout).to.be.an.instanceof(HTMLElement);
            expect(layout.tagName.toLowerCase()).to.equal("span");
            expect(layout.classList.contains(styleClass)).to.be.true;
        });

        it('should refresh correctly and modify the element text and may be icon if we add icon in button', function () {
            const widgetInstance = {
                ...widgetClass,
                data: {
                    properties: {
                        uniface: {
                            "icon": "",
                            "icon-position": "start"
                        },
                        value: ""
                    }
                },
                elements: tester.construct().elements,
                getTraceDescription: () => { return "description" }
            }

            instance.refresh(widgetInstance);
            const element = widgetInstance.elements.widget;
            expect(element.querySelector('span.u-text').hasAttribute("hidden")).to.be.true;
            expect(element.querySelector('span.u-text').innerText).equal("");
        });
    });

    describe("Test SlottedButtonIcon class", function () {
        const widgetClass = tester.getWidgetClass();
        let styleClass = "u-icon"
        let elementQuerySelector = ".u-icon"
        let instance;
        beforeEach(function () {
            instance = new widgetClass.SlottedButtonIcon(widgetClass, styleClass, elementQuerySelector);
        });

        it('should initialize with the correct properties', function () {
            expect(instance.widgetClass).to.equal(widgetClass);
        });

        it('should register default values for icon properties', function () {
            expect(instance.widgetClass.defaultValues.uniface.icon).equal("");
            expect(instance.widgetClass.defaultValues.uniface["icon-position"]).equal("start");
        });

        it('should generate and return layout correctly', function () {
            const layout = instance.getLayout();
            expect(layout).to.be.an.instanceof(HTMLElement);
            expect(layout.tagName.toLowerCase()).to.equal("span");
            expect(layout.classList.contains(styleClass)).to.be.true;
        });

        it('should refresh correctly and modify the element text and may be icon if we add icon in button', function () {
            const widgetInstance = {
                ...widgetClass,
                data: {
                    properties: {
                        uniface: {
                            "icon": "",
                            "icon-position": "start"
                        },
                        value: ""
                    }
                },
                elements: tester.construct().elements,
                getTraceDescription: () => { return "description" }
            }

            instance.refresh(widgetInstance);
            const element = widgetInstance.elements.widget;
            expect(element.querySelector('span.u-icon').hasAttribute("hidden")).to.be.true;
            expect(element.querySelector('span.u-icon').getAttribute("slot")).equal("");
        });

        it("add icon to test classes are added in the icon slot or not", function () {
            const widgetInstance = {
                ...widgetClass,
                data: {
                    properties: {
                        uniface: {
                            "icon": "home",
                        },
                        value: ""
                    }
                },
                elements: tester.construct().elements,
                getTraceDescription: () => { return "description" }
            }

            instance.refresh(widgetInstance);
            const element = widgetInstance.elements.widget;
            expect(element.querySelector('span.u-icon').hasAttribute("hidden")).to.be.false;
            expect(element.querySelector('span.u-icon').getAttribute("slot")).equal("");
            expect(element.querySelector('span.u-icon').classList.contains("ms-Icon")).to.be.true;
        });

        it("test delete icon class functionality in slotted icon element", function () {
            const widgetInstance = {
                ...widgetClass,
                data: {
                    properties: {
                        uniface: {
                            "icon": "",
                        },
                        value: ""
                    }
                },
                elements: tester.construct().elements,
                getTraceDescription: () => { return "description" }
            }

            instance.refresh(widgetInstance);
            const element = widgetInstance.elements.widget;
            expect(element.querySelector('span.u-icon').hasAttribute("hidden")).to.be.true;
            expect(element.querySelector('span.u-icon').getAttribute("slot")).equal("");
            expect(element.querySelector('span.u-icon').classList.contains("ms-Icon")).to.be.false;
        });
    });

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
