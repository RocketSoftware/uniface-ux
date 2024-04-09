/**
 * Test ux-widget
 */
(function(){

  // Test configuration
  const widgetId = "ux-widget";
  const widgetName = "UX.Button";

  //var assert = require('assert');
  //import { assert } from 'chai';
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
  var widgetClass, widget, control, element;

  describe("Uniface Mockup tests", function() {

    it("Get class " + widgetName, function () {
      widgetClass = UNIFACE.ClassRegistry.get(widgetName);
      assert(widgetClass, "widgetClass is not defined!");
    });

  });

  describe(widgetName + ".processLayout", function() {

    function doProcessLayout() {
      const node = document.getElementById(widgetId);
      element = _uf.DOMNodeManager.parseCustomWidgetNode(node, widgetName);
    }
    
    before(function() {
      widgetClass = UNIFACE.ClassRegistry.get(widgetName);
    });

    it("processLayout", doProcessLayout);

    describe("Checks", function() {

      beforeEach(doProcessLayout);

      it("check instance of HTMLElement", function() {
        expect(element).instanceOf(HTMLElement, "Function processLayout of " + widgetName + " does not return an HTMLElement.");
      });
  
      it("check tagName", function() {
        expect(element).to.have.tagName("fluent-button");
      });
  
      it("check id", function() {
        expect(element).to.have.id(widgetId);
      });
  
      it("check u-icon", function() {
        assert(element.querySelector("span.u-icon"), "Widget misses or has incorrect u-icon element");
      });
  
      it("check u-text", function() {
        assert(element.querySelector("span.u-text"), "Widget misses or has incorrect u-text element");
      });
  
    });

  });

  describe("Create widget", function() {
    
    it("constructor", function () {
      try {
        widget = new widgetClass();
        assert(widget, "widget is not defined!");
      } catch (e) {
        assert(false, "Failed to construct new widget, exception " + e);
      }
    });
  
    it("onConnect", function () {
      element = document.getElementById(widgetId);
      assert(element, "Target element is not defined!");
      widget.onConnect(element);
    });
    
    it("dataInit", function () {
      widget.dataInit();
      expect(element).to.have.class("u-button", "widget element has class");
    });
      
  });

  describe("TODO: Event tests", function() {
    const texts = [
      "click", 
      "etc ..."
    ];

    it("TODO: mapTrigger", function() {
      assertTodo("TODO: implement it!");
    });


    for (let i=0; i<texts.length; i++) {
      it("TODO: " + texts[i], function () {
        assertTodo("TODO: implement it!");
      });
    }

  });

  describe("dataUpdate", function() {
    const texts = ["Unit Test", "", "UX.Button"];

    for (let i=0; i<texts.length; i++) {
      it("Set value to '" + texts[i] + "'", function () {
        widget.dataUpdate({
          value: texts[i]
        });
        //TODO: Assert value here;
      });
    }

    it("TODO: Assert value of the widget", function() {
      assertTodo("TODO: implement it!");
      //throw new Error("TODO: impl");
    });

    it("TODO: set properties, html, style, uniface, etc", function() {
      assertTodo("TODO: implement it!");
    });

  });

  describe("TODO: API methods", function() {
    const texts = [
      "getValue", 
      "validate", 
      "showError",
      "etc ..."
    ];

    for (let i=0; i<texts.length; i++) {
      it("TODO: " + texts[i], function () {
        assertTodo("TODO: implement it!");
      });
    }

  });

  describe("dataCleanup", function() {

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

  describe("Disconnect and etc", function() {

    it("Set back to default", function() {
      widget.dataUpdate({
        value: widgetName
      });
    });

    it("onDisconnect", function () {
      try {
        widget.onDisconnect();
        assert(!(widget.element instanceof Element), "widget is still connected with the element " + widget.element);
      } catch (e) {
        assert(false, "Failed to disconnect with target element, exception " + e);
      }
    });
    
  });

})();

