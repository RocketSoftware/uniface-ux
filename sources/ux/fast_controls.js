/* global UNIFACE, UX */

(function () {
  "use strict";

  // This widget provides controls allowing development and testing of your custom web widgets.
  // Instructions:
  // 1. Create a DSP with an entity and a field.
  // 2. Assign your custom web widget to one of these objects, depending on the object type your widget
  //    is suited, either component, entity, or field.
  // 3. Create one more non-dbms entity and a field where the field is of datatype String and interface C*.
  //    Assign uxFastControls widget to the field.
  class FastControls {
    constructor() { }

    static processLayout(skeleton_element) {
      const element = document.createElement("div");
      element.id = skeleton_element.id;
      element.classList.add("u-fast-controls");
      return element;
    }

    onConnect(element) {
      this.elements = {};
      this.elements.widget = element;
      return [
        {
          "element": this.elements.widget,
          "event_name": "change",
        },
      ];
    }

    onDisconnect() { }

    mapTrigger(trigger_name) {
      if (trigger_name.startsWith("button_")) {
        const element = this.createButton(trigger_name);
        this.elements.widget.appendChild(element);
        return {
          "element": element,
          "event_name": "click",
          "validate": true,
        };
      } else if (trigger_name.startsWith("check_")) {
        const element = this.createCheckbox(trigger_name);
        this.elements.widget.appendChild(element);
        return {
          "element": element,
          "event_name": "change",
          "validate": true,
        };
      } else if (trigger_name.startsWith("radio_")) {
        const element = this.createRadioGroup(trigger_name);
        this.elements.widget.appendChild(element);
        return {
          "element": element,
          "event_name": "change",
          "validate": true,
        };
      }
    }

    dataInit() {
      this.data = {};
      this.data.entname = null;
      this.data.fldname = null;
    }

    dataUpdate(data) {
      if (data.uniface) {
        if (data.uniface.fldname) {
          this.data.fldname = data.uniface.fldname;
        }
        if (data.uniface.entname) {
          this.data.entname = data.uniface.entname;
        }
      }
    }

    getValue() {
      let value = {};
      const controls = this.elements.widget.querySelectorAll("[u-fast-control]");
      controls.forEach(function (control) {
        switch (control.getAttribute("u-fast-control")) {
          case "checkbox":
            value[control.getAttribute("u-trigger_name")] = control.querySelector("input[type=checkbox]").checked;
            break;
          case "radiogroup":
            let checkedElement = control.querySelector("input[type=radio]:checked");
            if (checkedElement) {
              value[control.getAttribute("u-trigger_name")] = checkedElement.value;
            } else {
              value[control.getAttribute("u-trigger_name")] = "none";
            }
            break;
        }
      });
      return JSON.stringify(value);
    }

    validate() {}

    hideError() {}

    blockUI() {
      // This implementation mimics the behavior of classic built-in widgets.
      this.elements.widget.style.cursor = "progress";
      this.elements.widget.readOnly = true;
    }

    unblockUI() {
      // This implementation mimics the behavior of classic built-in widgets.
      this.elements.widget.style.cursor = "auto";
      this.elements.widget.readOnly = false;
    }

    createCheckbox(triggerName) {
      const element = document.createElement("label");
      element.setAttribute("u-fast-control", "checkbox");
      element.setAttribute("u-trigger_name", triggerName);
      const input = document.createElement("input");
      input.type = "checkbox";
      element.appendChild(input);
      const label = document.createElement("div");
      label.innerText = triggerName.substring(6).replaceAll("_", " ");
      element.appendChild(label);
      return element;
    }

    createButton(triggerName) {
      const element = document.createElement("button");
      element.setAttribute("u-fast-control", "button");
      element.setAttribute("u-trigger_name", triggerName);
      element.innerText = triggerName.substring(7).replaceAll("_", " ");
      return element;
    }

    createRadioGroup(triggerName) {
      let radioButtons = triggerName.substring(6).split("_");
      let labelText = radioButtons[0];
      radioButtons = radioButtons.slice(1);
      const element = document.createElement("span");
      element.setAttribute("u-fast-control", "radiogroup");
      element.setAttribute("u-trigger_name", triggerName);
      element.style = "display: grid; grid-template-columns: 1fr; align-content: start;";
      const label = document.createElement("span");
      label.innerText = labelText;
      element.appendChild(label);
      radioButtons.forEach((value) => {
        const radio = document.createElement("label");
        radio.style.whiteSpace = "nowrap";
        const input = document.createElement("input");
        input.type = "radio";
        input.value = value;
        input.name = labelText;
        input.setAttribute("trigger_name", triggerName);
        radio.appendChild(input);
        const text = document.createElement("span");
        text.innerText = value;
        radio.appendChild(text);
        element.appendChild(radio);
      });
      return element;
    }
  }

  // Add the widget class to the UX namespace.
  if (typeof window.UX == "undefined" || window.UX == null) {
    window.UX = {};
  }
  UX.FastControls = FastControls;
  // Make the widget class known to the UNIFACE framework.
  UNIFACE.ClassRegistry.add("UX.FastControls", FastControls);
})();
