/* global UNIFACE uniface UX _uf */
// Source code for refactored textarea in git lab repo
// Branch Name: UNI-39226_automated_mocha_tests_uxTextArea
// https://gitlab.com/Uniface/sources/harness-project/-/tree/UNI-39226_automated_mocha_tests_uxTextArea?ref_type=heads

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
    const widgetClass = tester.getWidgetClass();
    
    /**  
     * Function to determine whether the widget class has been loaded.
    */
    function verifyWidgetClass(widgetClass) {
        assert(widgetClass, `Widget class '${widgetName}' is not defined!
              Hint: Check if the JavaScript file defined class '${widgetName}' is loaded.`);
      }
    
    describe("Uniface Mockup tests", function () {

        it("Get class " + widgetName, function () {
            verifyWidgetClass(widgetClass);
        });

    });

    describe("Uniface static structure constructor definition", function () {

        it('should have a static property structure of type Element', function () {
            verifyWidgetClass(widgetClass);
            const structure = widgetClass.structure;
            expect(structure.constructor).to.be.an.instanceof(Element.constructor);
            expect(structure.tagName).to.equal('fluent-text-area');
            expect(structure.styleClass).to.equal('');
            expect(structure.isSetter).to.equal(true);
            expect(structure.hidden).to.equal(false);
            expect(structure.elementQuerySelector).to.equal('');
            expect(structure.attributeDefines).to.be.an('array');
            expect(structure.elementDefines).to.be.an('array');
            expect(structure.triggerDefines).to.be.an('array');
        });

    });

    describe(widgetName + ".processLayout", function () {
        let element;

        it("processLayout", function () {
            verifyWidgetClass(widgetClass);
            element = tester.processLayout();
            expect(element).to.have.tagName(tester.uxTagName);
        });
        describe("Checks", function () {

            before(function () {
                verifyWidgetClass(widgetClass);
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
        })
    });  
    
    describe("Create widget", function () {

        before(function () {
            verifyWidgetClass(widgetClass);
            tester.construct();
        });

        it("constructor", function () {
            try {
                const widget = tester.construct();
                assert(widget, "Widget is not defined!");
                verifyWidgetClass(widgetClass);
                assert(widgetClass.defaultValues.classes['u-text-area'], "Class is not defined");
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
        const element = tester.processLayout();
        const widget = tester.onConnect();
        widget.mapTrigger("onchange");
        const event = new window.Event('onchange');
        element.dispatchEvent(event);
        assert(widget.elements.widget === element, "widget is not connected");
    })

    describe('Text Area onchange event', function () {
        let textAreaElement, onChangeSpy;
    
        beforeEach(function () {
    
          tester.createWidget();
          textAreaElement = tester.element;
    
          // Create a spy for the onchange event
          onChangeSpy = sinon.spy();
    
          // Add the onchange event listener to the text area Element 
          textAreaElement.addEventListener('onchange', onChangeSpy);
        });
    
        // Clean up after each test
        afterEach(function () {
          // Restore the spy to its original state
          sinon.restore();
        });
    
        // Test case for the on change event
        it('should call the onchange event handler when the text area is changed', function () {
          // Simulate a onchange event
          const event = new window.Event('onchange');
          textAreaElement.dispatchEvent(event);
    
          // Assert that the onchange event handler was called once
          expect(onChangeSpy.calledOnce).to.be.true;
        });
      });

      // Data Init
      describe("Data Init", function () {
        const defaultValues = tester.getDefaultValues();
        const classes = defaultValues.classes;
        var element;
    
        beforeEach(function () {
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
    
        it("check 'hidden' attributes", function () {
          assert(element.querySelector('span.u-label-text').hasAttribute('hidden'), "Label Text span element should be hidden by default");
          assert(element.querySelector('span.u-error-icon').hasAttribute('hidden'), "Icon span element should be hidden by default");
        });
    
        it("check widget id", function () {
          assert.strictEqual(tester.widget.widget.id.toString().length > 0, true);
        });
    
        it("check value", function () {
          assert.equal(tester.defaultValues.value, '', "Default value of attribute value should be ''");
        });
      });

    describe("dataUpdate", function () {
        let widget;
        before(function () {
            widget = tester.createWidget();
        });

        it("show label", function (done) {
            let textAreaLabel = 'Label';
            // Calling mock dataUpdate to have widgetProperties and then call widget dataUpdate()
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
                assert.equal(labelPosition, 'before',"Label position before is not before");
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
            assert.equal(alignPropertyValue, "center", "Label position below is not center")
        });

        it("Set label position below", function (done) {
            tester.dataUpdate({
                uniface: {
                    "label-position": "below"
                }

            });

            setTimeout(function () {
                let labelPosition = widget.elements.widget.getAttribute('u-label-position');
                assert.equal(labelPosition, 'below',"Label position below is not below");
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
            assert.equal(orderPropertyValue, 2, "Labelposition below is not in order")
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
                assert.equal(widget.elements.widget.querySelector("span.u-label-text").innerText, "", "Text is not empty");
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering

        });

        it("check reset label position styles", function () {
            //if u-label-position attribute is added element display is changed
            let numberFieldStyle = window.getComputedStyle(widget.elements.widget, null);
            let flexPropertyValue = numberFieldStyle.getPropertyValue("flex-direction");
            assert.equal(flexPropertyValue, "column");
        });
        
        it("html resize property when set to none", function (done) {
            let resizeProp = 'none';
            // Calling mock dataUpdate to have widgetProperties and then call widget dataUpdate()
            tester.dataUpdate({
                "html": {
                    "resize": "none"
                }
            });


            setTimeout(function () {
                let resizePropText = widget.elements.widget.getAttribute("resize");
                assert.equal(resizePropText, resizeProp);//Check for visibility
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering

        });

        it("html resize property when set to both", function (done) {
            let resizeProp = 'both';
            // Calling mock dataUpdate to have widgetProperties and then call widget dataUpdate()
            tester.dataUpdate({
                "html": {
                    "resize": resizeProp
                }
            });


            setTimeout(function () {
                let resizePropText = widget.elements.widget.getAttribute("resize");
                assert.equal(resizePropText, resizeProp);//Check for visibility
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering

        });

        it("html resize property when set to horizontal", function (done) {
            let resizeProp = 'horizontal';
            // Calling mock dataUpdate to have widgetProperties and then call widget dataUpdate()
            tester.dataUpdate({
                "html": {
                    "resize": resizeProp
                }
            });


            setTimeout(function () {
                let resizePropText = widget.elements.widget.getAttribute("resize");
                assert.equal(resizePropText, resizeProp);//Check for visibility
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering

        });

        it("html resize property when set to vertical", function (done) {
            let resizeProp = 'vertical';
            // Calling mock dataUpdate to have widgetProperties and then call widget dataUpdate()
            tester.dataUpdate({
                "html": {
                    "resize": resizeProp
                }
            });


            setTimeout(function () {
                let resizePropText = widget.elements.widget.getAttribute("resize");
                assert.equal(resizePropText, resizeProp);//Check for visibility
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering

        });


        it("html hidden property when set to true", function (done) {
            let hiddenProp = true;
            // Calling mock dataUpdate to have widgetProperties and then call widget dataUpdate()
            tester.dataUpdate({
                "html": {
                    "hidden": hiddenProp
                }
            });


            setTimeout(function () {
                let hiddenPropPresent = widget.elements.widget.hasAttribute("hidden");
                assert.equal(hiddenPropPresent, hiddenProp);//Check for visibility
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering

        });

        it("html hidden property when set to false", function (done) {
            let hiddenProp = false;
            // Calling mock dataUpdate to have widgetProperties and then call widget dataUpdate()
            tester.dataUpdate({
                "html": {
                    "hidden": hiddenProp
                }
            });


            setTimeout(function () {
                let hiddenPropPresent = widget.elements.widget.hasAttribute("hidden");
                assert.equal(hiddenPropPresent, hiddenProp);//Check for visibility
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering

        });

        it("check default html cols value", function (done) {
            let defaultColsProp = 20;
            // Calling mock dataUpdate to have widgetProperties and then call widget dataUpdate()  
            setTimeout(function () {
                let colsText = widget.elements.widget.shadowRoot.querySelector("textarea").getAttribute("cols");
                assert.equal(colsText, defaultColsProp);//Check for visibility
                let rowsText = widget.elements.widget.shadowRoot.querySelector("textarea").getAttribute("rows");
                assert.equal(rowsText, 0);
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering
        });

        it("html cols property negative integer", function (done) {
            let colsProp = -1;
            // Calling mock dataUpdate to have widgetProperties and then call widget dataUpdate()
            tester.dataUpdate({
                "html": {
                    "cols": colsProp
                }
            });

            setTimeout(function () {
                let colsText = widget.elements.widget.shadowRoot.querySelector("textarea").getAttribute("cols");
                assert.equal(colsText, colsProp);//Check for visibility
                let rowsText = widget.elements.widget.shadowRoot.querySelector("textarea").getAttribute("rows");
                assert.equal(rowsText, 0);
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering
        });

        it("html cols property positive integer", function (done) {
            let colsProp = 25;
            // Calling mock dataUpdate to have widgetProperties and then call widget dataUpdate()
            tester.dataUpdate({
                "html": {
                    "cols": colsProp
                }
            });


            setTimeout(function () {
                let colsText = widget.elements.widget.shadowRoot.querySelector("textarea").getAttribute("cols");
                assert.equal(colsText, colsProp);//Check for visibility
                let rowsText = widget.elements.widget.shadowRoot.querySelector("textarea").getAttribute("rows");
                assert.equal(rowsText, 0);
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering
        });

        //html:placeholder property
        it("Set html:placeholder property for textarea", function (done) {
            let placeHolderText = "Input the Number"
            tester.dataUpdate({
                "html": {
                    "placeholder": placeHolderText
                }

            });

            setTimeout(function () {
                let placeHolderTextDOM = widget.elements.widget.getAttribute('placeholder');
                assert.equal(placeHolderTextDOM, placeHolderText,"Failed to show placeholder text" + placeHolderText);
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering
        });

        //html:readonly property
        it("Set html:readonly property true for textarea", function (done) {
            let readOnly = "readOnly"
            tester.dataUpdate({
                "html": {
                    "readonly": true
                }
            });

            setTimeout(function () {
                let readOnlyProperty = window.getComputedStyle(widget.elements.widget, null);
                assert(widget.elements.widget.hasAttribute(readOnly), "Failed to show the readonly attribute");                    
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering
        });

        //html:readonly property false
        it("Set html:readonly property false for textarea", function (done) {
            let readOnly = "readOnly"
            tester.dataUpdate({
                "html": {
                    "readonly": false
                }
            });

            setTimeout(function () {
                let readOnlyProperty = window.getComputedStyle(widget.elements.widget, null);
                assert(!widget.elements.widget.hasAttribute(readOnly), "Failed to hide the readonly attribute");                    
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering
        });


         //html:disabled property
        it("Set html:disabled property true for textarea", function (done) {
        let disabled = "disabled"
        tester.dataUpdate({
                "html":{"disabled": true}
            });

            setTimeout(function () {
                let disabledProperty = window.getComputedStyle(widget.elements.widget, null);
                assert(widget.elements.widget.hasAttribute(disabled), "Failed to show the disabled attribute");                    
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering
        });

        //html:disabled property false
        it("Set html:disabled property false for textarea", function (done) {
            let disabled = "disabled"
            tester.dataUpdate({
                html: {
                    "disabled": false
                }
            });

            setTimeout(function () {
                let readOnlyProperty = window.getComputedStyle(widget.elements.widget, null);
                assert(!widget.elements.widget.hasAttribute(disabled), "Failed to hide the disabled attribute");                    
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering
        });

        //html:appearance outfill property
        it("Set html:appearance outline property true for textarea", function (done) {
            let appearanceStyle = "outline"
            tester.dataUpdate({
                html: {
                    "appearance": appearanceStyle
                }

            });

            setTimeout(function () {
                let appearanceStyleProperty = window.getComputedStyle(widget.elements.widget, null);
                assert(widget.elements.widget.hasAttribute('appearance'), "Failed to show the appearance outfill attribute");                    
                let appearanceStylePropertyText = widget.elements.widget.getAttribute('appearance');
                assert.equal(appearanceStyle, appearanceStylePropertyText, "Failed to show appearance outfill style" + appearanceStylePropertyText);
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering
        });

        //html:appearance filled property
        it("Set html:appearance filled property true for textarea", function (done) {
            let appearanceStyle = "filled"
            tester.dataUpdate({
                html: {
                    "appearance": appearanceStyle
                }

            });

            setTimeout(function () {
                let appearanceStyleProperty = window.getComputedStyle(widget.elements.widget, null);
                assert(widget.elements.widget.hasAttribute('appearance'), "Failed to show the appearance filled attribute");                    
                let appearanceStylePropertyText = widget.elements.widget.getAttribute('appearance');
                assert.equal(appearanceStyle, appearanceStylePropertyText, "Failed to show appearance filled style" + appearanceStylePropertyText);
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering

        });

       
    });

    describe("showError", function () {
        let widget, element;
        let minlength = 2;
        let maxlength = 5;
        before(function () {
            widget = tester.createWidget();
            element = tester.createWidget().element;
            verifyWidgetClass(widgetClass)
        });

        it("setting minlength and maxlength", function(done){
            
            tester.dataUpdate({
                "html": {
                    "minlength": minlength,
                    "maxlength": maxlength
                }
            });
            setTimeout(function () {
                expect(widget.elements.widget.hasAttribute("maxlength"), "Failed to show the maxlength attribute");
                expect(widget.elements.widget.hasAttribute("minlength"), "Failed to show the minlength attribute");
                assert.equal(widget.elements.widget.getAttribute("minlength"), minlength ,"Min is not same" + minlength);
                assert.equal(widget.elements.widget.getAttribute("maxlength"), maxlength ,"Max is not same" + maxlength);
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering
        });
        
        it("Set invalid value in text area", function (done) {   
            tester.dataUpdate({
                uniface: {
                    error: true,
                    "error-message": "Field Value length mismatch."
                }
            });

            setTimeout(function () {
                
                expect(widget.elements.widget).to.have.class("u-invalid");
                assert(!widget.elements.widget.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the hidden attribute");
                assert.equal(widget.elements.widget.childNodes[1].className, "u-error-icon ms-Icon ms-Icon--AlertSolid","widget element doesn't has class u-error-icon ms-Icon ms-Icon--AlertSolid");
                assert.equal(widget.elements.widget.querySelector("span.u-error-icon").getAttribute("slot"),"end","Slot end  does not match");
                assert.equal(widget.elements.widget.querySelector("span.u-error-icon").getAttribute("title"), "Field Value length mismatch.","Error title doesnot match")
                done();
            }, defaultAsyncTimeout);
        });

        it("html rows property positive integer", function (done) {
            let rowsProp = 25;
            // Calling mock dataUpdate to have widgetProperties and then call widget dataUpdate()
            tester.dataUpdate({
                "html": {
                    "rows": rowsProp
                }
            });


            setTimeout(function () {
                let colsText = widget.elements.widget.shadowRoot.querySelector("textarea").getAttribute("cols");
                assert.equal(colsText, 20);//Check for visibility
                let rowsText = widget.elements.widget.shadowRoot.querySelector("textarea").getAttribute("rows");
                assert.equal(rowsText, rowsProp);
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering

        });
        it("html rows property negative integer", function (done) {
            let rowsProp = -1;
            // Calling mock dataUpdate to have widgetProperties and then call widget dataUpdate()
            tester.dataUpdate({
                "html": {
                    "rows": rowsProp
                }
            });

            setTimeout(function () {
                let colsText = widget.elements.widget.shadowRoot.querySelector("textarea").getAttribute("cols");
                assert.equal(colsText, 20);//Check for visibility
                let rowsText = widget.elements.widget.shadowRoot.querySelector("textarea").getAttribute("rows");
                assert.equal(rowsText, rowsProp);
                done();
            }, defaultAsyncTimeout); // Wait for DOM rendering
        });
    });
    describe("hideError", function () {
        let widget, element;
        let minlength = 2;
        let maxlength = 5;
        before(function () {
            widget = tester.createWidget();
            element = tester.createWidget().element;
            verifyWidgetClass(widgetClass)
        });
        it("Hide Error Set invalid value in text Area", function (done) {   
            tester.dataUpdate({
                uniface: {
                    error: false,
                    "error-message": "Field Value length mismatch."
                }
            });
            widget.hideError("Field Value length mismatch.");

            setTimeout(function () {
                
                expect(widget.elements.widget).to.not.have.class("u-invalid");
                assert(widget.elements.widget.querySelector("span.u-error-icon").hasAttribute("hidden"), "Failed to show the hidden attribute");
                assert(widget.elements.widget.childNodes[1].className, "u-error-icon ms-Icon ms-Icon--AlertSolid","widget element doesn't has class u-error-icon ms-Icon ms-Icon--AlertSolid");
                assert(widget.elements.widget.querySelector("span.u-error-icon").hasAttribute("slot"),  "slot attribute is not present");
                assert(widget.elements.widget.querySelector("span.u-error-icon").hasAttribute("title"), "title attribute is not present")
                done();
            }, defaultAsyncTimeout);
        });
    });   
})();
