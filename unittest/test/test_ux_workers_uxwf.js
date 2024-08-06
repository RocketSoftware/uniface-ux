import { Button_UXWF } from "../../../ux/button_UXWF.js";
import { StyleClass, Element, SlottedElement, Trigger, SlottedError, SlottedWidget, SlottedWidgetsByProperty, 
    WidgetsByProperty , BaseHtmlAttribute, HtmlAttribute, HtmlAttributeChoice, HtmlAttributeNumber, HtmlAttributeBoolean ,
    HtmlValueAttributeBoolean , HtmlAttributeMinMaxLength , StyleProperty
 } from "../../../ux/workers_UXWF.js"


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

    // ===================================================================================================================
    // == Testing ClassStyle class =========================================================================================
    // ===================================================================================================================
    describe(widgetName +  " class Style Property", function () {
        let widgetClass;
        let defaultClassList;
        let instance;

        beforeEach(function () {
            widgetClass = {};
            defaultClassList = ['class1', 'class2'];
            instance = new StyleClass(widgetClass, defaultClassList);
        });

        it('should initialize with the correct properties', function () {
            expect(instance.widgetClass).to.equal(widgetClass);
        });

        it('should register default class values', function () {
            defaultClassList.forEach((className) => {
                expect(instance.widgetClass.defaultValues.classes[className]).to.be.true;
            });
        });

        it('should refresh correctly and modify the element classes', function () {
            const widgetInstance = {
                data: {
                    properties: {
                        classes: {
                            class1: true,
                            class2: false
                        }
                    }
                },
                getTraceDescription: sinon.stub().returns('description')
            };
            const element = document.createElement('div');
            sinon.stub(instance, 'getElement').returns(element);

            instance.refresh(widgetInstance);

            expect(element.classList.contains('class1')).to.be.true;
            expect(element.classList.contains('class2')).to.be.false;
        });
    })

    // ===================================================================================================================
    // == Testing Elements class =========================================================================================
    // ===================================================================================================================
    describe(widgetName + " Test Element Class", function () {

        let widgetClass;
        let tagname;
        let styleclass;
        let elementQuerySelector;
        let attributeDefines;
        let elementDefines;
        let triggerDefines;
        let element;
        let definitions;

        beforeEach(function () {
            widgetClass = {};
            tagname = "DIV";
            elementQuerySelector = "div"
            styleclass = "styleClass"
            attributeDefines = [new StyleClass(this, ["u-switch"]) , new HtmlAttribute(this, "html:role", "role", "switch"),]
            elementDefines = [new SlottedElement(this, "span", "u-label-text", ".u-label-text", "", "uniface:label-text"), 
                new SlottedElement(this, "span", "u-checked-message", ".u-checked-message", "checked-message", "uniface:checked-message")]
            triggerDefines = [new Trigger(this, "onchange", "change", true)]
            element = new Element(widgetClass, tagname, styleclass, elementQuerySelector, attributeDefines, elementDefines, triggerDefines );
            console.log("THIS IS AN ELEMENT " , element)
        });

        it("should initialize with correct properties", function () {
            expect(element.widgetClass).to.equal(widgetClass);
            expect(element.tagName).to.equal(tagname);
            expect(element.styleClass).to.equal(styleclass);
            expect(element.elementQuerySelector).to.equal(elementQuerySelector);
            expect(element.attributeDefines).to.equal(attributeDefines);
            expect(element.elementDefines).to.equal(elementDefines);
            expect(element.triggerDefines).to.equal(triggerDefines);
        });

        it("Check elementQuerySelector changed for all elements", function () {
            attributeDefines.forEach((attributeDefine) => {
                expect(attributeDefine.elementQuerySelector).to.equal("div")
            });
            triggerDefines.forEach((triggerDefine) => {
                expect(triggerDefine.elementQuerySelector).to.equal("div")
            });
         });
        
        // Definitions doesn't do anything
         it("Check Generate layout", function () {
            let layoutElement = element.getLayout(definitions)
            expect(layoutElement).to.not.be.null;
        });
    });

    // ===================================================================================================================
    // == Testing Slotted Elements class =========================================================================================
    // ===================================================================================================================
    describe(widgetName + " Test Sorted Elements Class", function () {

        let widgetClass;
        let propText;
        let defaultText;
        let propIcon;
        let defaultIcon;
        let slottedElement;

        beforeEach(function () {
            widgetClass = {};
            propText = "propText"
            propIcon = "icon.png"
            defaultText = "defaultText"
            defaultIcon = "default.png"
            slottedElement = new SlottedElement(widgetClass, "", "", "", "", propText, defaultText, propIcon, defaultIcon );
        });

        it("should initialize with correct properties", function () {
            expect(slottedElement.widgetClass).to.equal(widgetClass);
            expect(slottedElement.propText).to.equal(propText);
            expect(slottedElement.defaultText).to.equal(defaultText);
            expect(slottedElement.propIcon).to.equal(propIcon);
            expect(slottedElement.defaultIcon).to.equal(defaultIcon);
        });

        it("Check getters/setters changed for propIcon, propText", function () {
            expect(slottedElement.widgetClass.defaultValues["icon.png"]).to.equal(defaultIcon);
            expect(slottedElement.widgetClass.defaultValues["propText"]).to.equal(defaultText);
         });

         it('should refresh correctly', function () {
            const widgetInstance = {
                data: {
                    properties: {
                        classes: {
                            class1: true,
                            class2: false
                        }
                    }
                },
                getTraceDescription: sinon.stub().returns('description')
            };
            slottedElement.refresh(widgetInstance)
            // expect(element.classList.contains('class1')).to.be.true;
            // expect(element.classList.contains('class2')).to.be.false;
        });
    });

    // ===================================================================================================================
    // == Testing SlottedError class =========================================================================================
    // ===================================================================================================================
    describe(widgetName + " Test SlottedError Class", function () {

        let widgetClass;
        let slottedError;

        beforeEach(function () {
            widgetClass = {};
            slottedError = new SlottedError(widgetClass, "", "", "", "");
        });

        it("should initialize with correct properties", function () {
            expect(slottedError.widgetClass).to.equal(widgetClass);
        });

        it("Check setters were added", function () {
            let setters = Object.keys(slottedError.widgetClass.setters.uniface)
            expect(setters).to.have.lengthOf(4);
         });

         it('should refresh correctly', function () {
            const widgetInstance = {
                data: {
                    properties: {
                        classes: {
                            class1: true,
                            class2: false
                        }
                    }
                },
                getTraceDescription: sinon.stub().returns('description')
            };
            slottedError.refresh(widgetInstance)
        });
    });

     // ===================================================================================================================
    // == Testing SlottedWidget class =========================================================================================
    // ===================================================================================================================
    describe(widgetName + " test SlottedWidget Class", function () {
        let widgetClass;
        let subWidgetId;
        let subWidgetName;
        let tagName;
        let element;


        beforeEach(function () {
            widgetClass = {};
            subWidgetName = "UX.Button";
            tagName = "DIV"
            element = new SlottedWidget(widgetClass, tagName, "", "", "", subWidgetId, subWidgetName, {}, "");
        });

        it("should initialize with correct properties", function () {
            expect(element.widgetClass).to.equal(widgetClass);
        });

        it("Check getters/setters changed and subWidget added", function () {
            expect(element.subWidget.name).to.equal("Button")
            expect(element.propId).to.equal("uniface:undefined")
         });

         it("Check Generate Layout", function () {
            let layoutElement = element.getLayout()
            expect(layoutElement).to.not.be.undefined;
         });

         it('should refresh correctly', function () {
            const widgetInstance = {
                data: {
                    properties: {
                        classes: {
                            class1: true,
                            class2: false
                        }
                    }
                },
                getTraceDescription: sinon.stub().returns('description')
            };
            slottedError.refresh(widgetInstance)
        });
    });


    // ===================================================================================================================
    // == Testing SlottedWidgetsByProperty class ==========================================================================
    // ===================================================================================================================
    describe(widgetName + " Test SlottedWidgetsByProperty Class", function () {

        let widgetClass;
        let tagName;
        let styleClass;
        let elementQuerySelector;
        let slot;
        let propId;
        let subWidgetDefaultValues;
        let definitions;
        let element;
        let worker;

        beforeEach(function () {
            widgetClass = {};
            //let propId = "value"
            element = new SlottedWidgetsByProperty(widgetClass, "span", "u-start", ".u-start", "", "uniface:start", []);
        });

        it("should initialize with correct properties", function () {
            // expect(element.widgetClass).to.equal(widgetClass);
            // expect(element.tagName).to.equal(tagName);
            // expect(element.styleClass).to.equal(styleClass);
            // expect(element.elementQuerySelector).to.equal(elementQuerySelector);
            // expect(element.slot).to.equal(slot);
            // expect(element.propId).to.equal(propId);
            // expect(element.subWidgetDefaultValues).to.equal(subWidgetDefaultValues);

        });

        it("Check Generate Layout", function () {
            
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
            //worker.propId = "value"
            let layoutElement = element.getLayout(definitions)
         });

         it('should refresh correctly', function () {
            const widgetInstance = {
                data: {
                    properties: {
                        classes: {
                            class1: true,
                            class2: false
                        }
                    }
                },
                getTraceDescription: sinon.stub().returns('description')
            };
            slottedError.refresh(widgetInstance)
        });
    });

    // ===================================================================================================================
    // == Testing WidgetsByProperty class ==========================================================================
    // ===================================================================================================================
    describe(widgetName + " Test WidgetsByProperty Class", function () {
  
        let widgetClass;
        let tagName;
        let styleClass;
        let elementQuerySelector;
        let propId;
        let element;

        beforeEach(function () {
            widgetClass = {};
            element = new WidgetsByProperty(widgetClass, tagName, styleClass, elementQuerySelector, propId);
        });

        it("should initialize with correct properties", function () {
            expect(element.widgetClass).to.equal(widgetClass);
            expect(element.tagName).to.equal(tagName);
            expect(element.styleClass).to.equal(styleClass);
            expect(element.elementQuerySelector).to.equal(elementQuerySelector);
            expect(element.propId).to.equal(propId);
        });

        it("Check Generate Layout", function () {
            let layoutElement = element.getLayout(definitions)
            expect(layoutElement).to.not.be.null;
         });
    });

    // ===================================================================================================================
    // == Testing BaseHtmlAttribute class REMINDER FIX ================================================================================
    // ===================================================================================================================
    describe(widgetName + " Test BaseHtmlAttribute Class", function () {
  
        let widgetClass;
        let propId;
        let attrName;
        let defaultValue;
        let worker;
        let element;

        globalThis.UX_DEFINITIONS = {}
        globalThis.UX_DEFINITIONS["ufld:FIELD.ENTITY.MODEL"] = "test"

        beforeEach(function () {
            widgetClass = {};
            propId = "value"
            attrName = "data-test-attribute"
            defaultValue = "1"
            worker = new BaseHtmlAttribute(widgetClass, propId, attrName, defaultValue);
            element = document.createElement("DIV")
            element.id = "ufld:FIELD.ENTITY.MODEL:INSTANCE.1"
            element[attrName] = "test"
            // globalThis.UX_DEFINITIONS = {}
            // globalThis.UX_DEFINITIONS["ufld:FIELD.ENTITY.MODEL"] = "test"
        });

        it("should initialize with correct properties", function () {
            expect(worker.widgetClass).to.equal(widgetClass);
            expect(worker.propId).to.equal(propId)
        });

        it("Check Getters/Setters", function () {
            console.log("MAIN GETTER " , worker.widgetClass.getters)
            expect(worker.widgetClass.getters.value.propId).to.equal(propId)
            expect(worker.widgetClass.setters.value[0].propId).to.equal(propId)
         });

        it("Check Generate Layout", function () {
            let newWidgetInstance = new Button_UXWF();
            newWidgetInstance.onConnect(element)
            let test = worker.getLayout()
            console.log("test " , test)

         });
         
         it("Check setHtmlAttribute", function () {
            let newElement = {}
            element.setHtmlAttribute(newElement , [1,2,3])
            expect(newElement.button).to.have.lengthOf(3)
         });

         it("check refresh" , function () {
            slottedError.refresh(widgetInstance)
         })

         it("check getValue" , function () {
            let newWidgetInstance = new Button_UXWF();
            newWidgetInstance.onConnect(element)
            console.log("newWidgetTest " , newWidgetInstance)
            //console.log("worker " , worker)
            let test = worker.getValue(newWidgetInstance)
            expect(test).to.equal("test")
            //console.log("TEST " , test)

         })

         it("check getValueUpdaters" , function () {
            const widgetInstance = {
                data: {
                    properties: {
                        classes: {
                            class1: true,
                            class2: false
                        }
                    }
                }
            }
            element.getValueUpdaters(widgetInstance)
         })
    });

    // ===================================================================================================================
    // == Testing HtmlAttribute class ==========================================================================
    // ===================================================================================================================
    describe(widgetName + " Test HtmlAttribute Class", function () {

        let widgetClass;
        let propId;
        let attrName;
        let defaultValue;
        let element;

        beforeEach(function () {
            widgetClass = {};
            propId = "value"
            attrName = "button"
            defaultValue = "1"
            element = new HtmlAttribute(widgetClass, propId, attrName, defaultValue);
        });

        it("should initialize with correct properties", function () {
            expect(element.widgetClass).to.equal(widgetClass);
        });


         it('should refresh correctly', function () {
            const widgetInstance = {
                data: {
                    properties: {
                        classes: {
                            class1: true,
                            class2: false
                        }
                    }
                },
                getTraceDescription: sinon.stub().returns('description')
            };
            slottedError.refresh(widgetInstance)
        });
    });

    // ===================================================================================================================
    // == Testing HtmlAttribute class ==========================================================================
    // ===================================================================================================================
    describe(widgetName + " Test HtmlAttributeChoice Class", function () {

        let widgetClass;
        let propId;
        let attrName;
        let choices;
        let defaultValue;
        let element;

        beforeEach(function () {
            widgetClass = {};
            propId = "value"
            attrName = "button"
            defaultValue = "1"
            choices = "all"
            element = new HtmlAttributeChoice(widgetClass, propId, attrName, choices, defaultValue);
        });

        it("should initialize with correct properties", function () {
            expect(element.widgetClass).to.equal(widgetClass);
            expect(element.choices).to.equal(choices)
        });


         it('should refresh correctly', function () {
            const widgetInstance = {
                data: {
                    properties: {
                        classes: {
                            class1: true,
                            class2: false
                        }
                    }
                },
                getTraceDescription: sinon.stub().returns('description')
            };
            slottedError.refresh(widgetInstance)
        });
    });

    // ===================================================================================================================
    // == Testing HtmlAttributeNumber class ==========================================================================
    // ===================================================================================================================
    describe(widgetName + " Test HtmlAttributeNumber Class", function () {

        let widgetClass;
        let propId;
        let attrName;
        let min;
        let max;
        let defaultValue;
        let element;

        beforeEach(function () {
            widgetClass = {};
            propId = "value"
            attrName = "button"
            defaultValue = "1"
            min = 1
            max = 500
            element = new HtmlAttributeNumber(widgetClass, propId, attrName, min, max, defaultValue);
        });

        it("should initialize with correct properties", function () {
            expect(element.widgetClass).to.equal(widgetClass);
            expect(element.min).to.equal(min);
            expect(element.max).to.equal(max);
        });


         it('should refresh correctly', function () {
            const widgetInstance = {
                data: {
                    properties: {
                        classes: {
                            class1: true,
                            class2: false
                        }
                    }
                },
                getTraceDescription: sinon.stub().returns('description')
            };
            slottedError.refresh(widgetInstance)
        });
    });

    // ===================================================================================================================
    // == Testing HtmlAttributeBoolean class ==========================================================================
    // ===================================================================================================================
    describe(widgetName + " Test HtmlAttributeBoolean Class", function () {

        let widgetClass;
        let propId;
        let attrName;
        let defaultValue;
        let element;

        beforeEach(function () {
            widgetClass = {};
            propId = "value"
            attrName = "button"
            defaultValue = "1"
            element = new HtmlAttributeBoolean(widgetClass, propId, attrName, defaultValue);
        });

        it("should initialize with correct properties", function () {
            expect(element.widgetClass).to.equal(widgetClass);
        });


         it('should refresh correctly', function () {
            const widgetInstance = {
                data: {
                    properties: {
                        classes: {
                            class1: true,
                            class2: false
                        }
                    }
                },
                getTraceDescription: sinon.stub().returns('description')
            };
            slottedError.refresh(widgetInstance)
        });
    });

    // ===================================================================================================================
    // == Testing HtmlValueAttributeBoolean class ==========================================================================
    // ===================================================================================================================
    describe(widgetName + " Test HtmlValueAttributeBoolean Class", function () {

        let widgetClass;
        let propId;
        let attrName;
        let defaultValue;
        let element;

        beforeEach(function () {
            widgetClass = {};
            propId = "value"
            attrName = "button"
            defaultValue = "1"
            element = new HtmlValueAttributeBoolean(widgetClass, propId, attrName, defaultValue);
        });

        it("should initialize with correct properties", function () {
            expect(element.widgetClass).to.equal(widgetClass);
        });


         it('should refresh correctly', function () {
            const widgetInstance = {
                data: {
                    properties: {
                        classes: {
                            class1: true,
                            class2: false
                        }
                    }
                },
                getTraceDescription: sinon.stub().returns('description')
            };
            slottedError.refresh(widgetInstance)
        });
    });

    // ===================================================================================================================
    // == Testing HtmlAttributeMinMaxLength class ==========================================================================
    // ===================================================================================================================
    describe(widgetName + " Test HtmlAttributeMinMaxLength Class", function () {

        let widgetClass;
        let propMin;
        let propMax;
        let defaultMin;
        let defaultMax;
        let element;

        beforeEach(function () {
            widgetClass = {};
            propMin = "5"
            propMax = "100"
            defaultMin = 0
            defaultMax = 10
            element = new HtmlAttributeMinMaxLength(widgetClass, propMin, propMax, defaultMin, defaultMax);
        });

        it("should initialize with correct properties", function () {
            expect(element.widgetClass).to.equal(widgetClass);
            expect(element.propMin).to.equal(propMin);
            expect(element.propMax).to.equal(propMax);
            expect(element.defaultMin).to.equal(defaultMin);
            expect(element.defaultMax).to.equal(defaultMax);  
        });

        it("Check Setters", function () {
            let setterKeys = Object.keys(element.widgetClass.setters)
            expect(setterKeys[0]).to.equal(propMin)
            expect(setterKeys[1]).to.equal(propMax)
         });


         it('should refresh correctly', function () {
            const widgetInstance = {
                data: {
                    properties: {
                        classes: {
                            class1: true,
                            class2: false
                        }
                    }
                },
                getTraceDescription: sinon.stub().returns('description')
            };
            slottedError.refresh(widgetInstance)
        });
    });

    // ===================================================================================================================
    // == Testing StyleProperty class ==========================================================================
    // ===================================================================================================================
    describe(widgetName + " Test StyleProperty Class", function () {

        let widgetClass;
        let property;
        let element;

        beforeEach(function () {
            widgetClass = {};
            property = {}
            element = new StyleProperty(widgetClass,property);
        });

        it("should initialize with correct properties", function () {
            expect(element.widgetClass).to.equal(widgetClass);
        });

        it("Check Setters and Default values", function () {
            let setterKeys = Object.keys(element.widgetClass.setters)
            let defaultKeys = Object.keys(element.widgetClass.setters)
            expect(setterKeys[0]).to.equal("style")
            expect(defaultKeys[0]).to.equal("style")
         });


         it('should refresh correctly', function () {
            const widgetInstance = {
                data: {
                    properties: {
                        classes: {
                            class1: true,
                            class2: false
                        }
                    }
                },
                getTraceDescription: sinon.stub().returns('description')
            };
            slottedError.refresh(widgetInstance)
        });
    });

    // ===================================================================================================================
    // == Testing Trigger class ==========================================================================
    // ===================================================================================================================
    describe(widgetName + " Test Trigger Class", function () {

        let widgetClass;
        let triggerName;
        let eventName;
        let validate;
        let element;

        beforeEach(function () {
            widgetClass = {};
            triggerName = "NameofTrigger"
            element = new Trigger(widgetClass, triggerName, eventName, validate);
            console.log("eleemnt is " , element)
        });

        it("should initialize with correct properties", function () {
            expect(element.widgetClass).to.equal(widgetClass);
            expect(element.triggerName).to.equal(triggerName);
        });

        it("Check registerTrigger functionality", function () {
            let registerTriggerKey = Object.keys(element.widgetClass.triggers)
            expect(registerTriggerKey[0]).to.equal(triggerName)
         });

         it("Check getTriggerMapping functionality", function () {
            element.getTriggerMapping({})
         });


         it('should refresh correctly', function () {
            const widgetInstance = {
                data: {
                    properties: {
                        classes: {
                            class1: true,
                            class2: false
                        }
                    }
                },
                getTraceDescription: sinon.stub().returns('description')
            };
            slottedError.refresh(widgetInstance)
        });
    });


    
})();