/* global UNIFACE uniface UX */
(function () {
  "use strict";

  // Widget class for uxSwitch widget - wrapper class for Fluent Switch web component.
  class Switch extends UX.Base {

    static processLayout(skeletonWidgetElement) {
      UX.Base.staticLog("processLayout", skeletonWidgetElement);

      let widgetElement;
      if (skeletonWidgetElement.tagName.toLowerCase() === "fluent-switch") {
        // The layout already provides a "fluent-switch" element.
        // Simply return that as the element to be used as widgetElement.
        widgetElement = skeletonWidgetElement;
      } else {
        // The widgetElement will be a copy of the skeletonWidgetElement,
        // excluding its child elements and its attributes,
        // and with tagName set to "fluent-switch".
        widgetElement = UX.Base.cloneElement(skeletonWidgetElement, "fluent-switch", false, false);
      }

      // Add placeholder for the label, checked-message, error-icon and unchecked-message.
      widgetElement.innerHTML += `
        <span class="u-label-text" hidden></span>
        <span class="u-checked-message" hidden></span>
        <span class="u-error-icon" hidden></span>
        <span class="u-unchecked-message" hidden></span>
      `;

      return widgetElement;
    }

    constructor() {
      super();
      this.widget = {};
      this.widget.id = Math.random();
      this.log("constructor", this.widget);

      // Define default properties for fluent-switch.
      // This widget uses those:
      //  * In dataInit() to put the widget in a defined initial state.
      //  * In dataUpdate() when resetting any of these properties.
      if (Switch.defaultProperties === undefined) {
        Switch.defaultProperties = {
          "html": {
            "role": "switch",
            "aria-checked": "false",
            "aria-disabled": "false",
            "tabindex": "0",
            "current-value": "on",
            "current-checked": "false"
          },
          "classes": {
            "u-switch": true  // Default uniface class for widget element.
          },
          "uniface": {
            "label-text": "",
            "checked-message": "",
            "unchecked-message": ""
          }
        };
      }
    }

    onConnect(widgetElement) {
      this.log("onConnect", widgetElement.id);
      this.elements = {};
      this.elements.widget = widgetElement;

      // References to internal elements - label, checked message, unchecked message and errorIcon.
      this.elements.labelText = this.elements.widget.querySelector(".u-label-text");
      this.elements.checkedMessage = this.elements.widget.querySelector(".u-checked-message");
      this.elements.errorIcon = this.elements.widget.querySelector(".u-error-icon");
      this.elements.uncheckedMessage = this.elements.widget.querySelector(".u-unchecked-message");

      // Set the 'part' attribute on the switch slot so that CSS styling can be done.
      this.elements.widget.shadowRoot.querySelector("slot[name='switch']").setAttribute("part", "switch-toggle");

      // Return an updater for the "change" event.
      // This will make sure that the widget data is passed to uniface.
      // even when no triggers have been mapped.
      let updaters = [];
      updaters.push({
        element: this.elements.widget,
        event_name: "change",
        handler: () => {
          this.hideFormatError();
        }
      });
      return updaters;
    }

    mapTrigger(triggerName) {
      this.log("mapTrigger", triggerName);
      let triggerMapping;
      switch (triggerName) {
        case "onchange":
          triggerMapping = {
            element: this.elements.widget,
            event_name: "change",
            validate: true
          };
          break;
      }
      return triggerMapping;
    }

    dataInit() {
      this.data = {};
      this.data.id = Math.random();
      this.log("dataInit", this.data);

      // Put this widget in a defined initial state.
      this.setHtmlProperties(Switch.defaultProperties.html, this.elements.widget);
      this.setClassProperties(Switch.defaultProperties.classes, this.elements.widget);
    }

    dataUpdate(data) {
      this.log("dataUpdate", data);

      // Set html properties.
      if (data.html) {
        this.setHtmlProperties(data.html, this.elements.widget, Switch.defaultProperties.html);

        // Keep track of whether the widget is set to readonly.
        // This will be used in unblockUI().
        if (data.html.readonly !== undefined) {
          this.data.readonly = data.html.readonly;
        }
      }

      // Set style properties.
      if (data.style) {
        this.setStyleProperties(data.style, this.elements.widget);
      }

      // Add or remove class names.
      if (data.classes) {
        this.setClassProperties(data.classes, this.elements.widget, Switch.defaultProperties.classes);
      }

      // Add uniface properties.
      if (data.uniface) {
        for (const key in data.uniface) {
          let uPropertyValue = data.uniface[key];
          if (uPropertyValue === uniface.RESET) {
            uPropertyValue = Switch.defaultProperties.uniface[key];
          }

          switch (key) {
            case "label-text":
              UX.Base.setSlotContent(this.elements.labelText, uPropertyValue);
              break;
            case "checked-message":
              this.data.checkedMessage = uPropertyValue;
              UX.Base.setSlotContent(this.elements.checkedMessage, uPropertyValue, undefined, "checked-message");
              break;
            case "unchecked-message":
              this.data.uncheckedMessage = uPropertyValue;
              UX.Base.setSlotContent(this.elements.uncheckedMessage, uPropertyValue, undefined, "unchecked-message");
              break;
          }
        }
      }

      if (data.value !== undefined) {
        try {
          // Format a value into a boolean or throw an exception if it cannot.
          let formattedValue = this.fieldValueToBoolean(data.value);
          this.elements.widget.checked = formattedValue;
          this.hideFormatError();
        } catch (e) {
          this.showFormatError(e);
        }
      }

    }

    dataCleanup(dataNames) {
      this.log("dataCleanup", dataNames);

      if (dataNames && Object.keys(dataNames).length > 0) {
        // Reset html properties.
        if (dataNames.hasOwnProperty("html") && dataNames.html.size > 0) {
          this.resetHtmlProperties(dataNames.html, this.elements.widget, Switch.defaultProperties.html);
        }

        // Reset style properties.
        if (dataNames.hasOwnProperty("style") && dataNames.style.size > 0) {
          this.resetStyleProperties(dataNames.style, this.elements.widget);
        }

        // Reset all Uniface property-related items.
        if (dataNames.hasOwnProperty("uniface")) {
          dataNames.uniface.forEach((uPropertyValue) => {
            switch (uPropertyValue) {
              case "label-text":
                UX.Base.resetSlotContent(this.elements.labelText);
                break;
              case "checked-message":
                UX.Base.resetSlotContent(this.elements.checkedMessage);
                break;
              case "unchecked-message":
                UX.Base.resetSlotContent(this.elements.uncheckedMessage);
                break;
            }
          });
        }
      }
      // Reset classes properties.
      this.resetClassProperties(this.elements.widget);

      // Reset checked attribute to the default state.
      this.elements.widget.checked = false;

      // Reset local data.
      this.data = {};
    }

    getValue() {
      let val = this.elements.widget.checked;
      this.log("getValue", val);
      return val;
    }

    validate() {
      this.log("validate");
    }

    showError(errorMessage) {
      this.log("showError", errorMessage);
      // Format error has a priority, hence when we have format error set, we dont have to show validate error icon.
      if (!this.data.isFormatErrorActive) {
        this.showErrorIcon(errorMessage);
        // Add and show uniface invalid state.
        this.elements.widget.classList.add("u-invalid");
      }
    }

    hideError() {
      this.log("hideError");
      if (!this.data.isFormatErrorActive) {
        this.hideErrorIcon();
        // Remove and hide uniface invalid state.
        this.elements.widget.classList.remove("u-invalid");
      }
    }

    blockUI() {
      this.log("blockUI");
      this.elements.widget.readOnly = true;
    }

    unblockUI() {
      this.log("unblockUI");
      // Reset readOnly to its previous value.
      this.elements.widget.readOnly = this.data.readonly || false;
    }

    showErrorIcon(errorMessage) {
      // Show the error as a tooltip text.
      this.elements.errorIcon.title = errorMessage;
      // Since we dont want to show message element in case of format error, move it to default slot and hide it.
      let messageElement = this.elements.widget.checked ? this.elements.checkedMessage : this.elements.uncheckedMessage;
      UX.Base.resetSlotContent(messageElement);
      // Set the active slotName.
      let slotName = this.elements.widget["checked"] ? "checked-message" : "unchecked-message";
      // Move errorIcon element in the active slot.
      UX.Base.setSlotContent(this.elements.errorIcon, undefined, "AlertSolid", slotName);
    }

    hideErrorIcon() {
      // Removes the format error tooltip text.
      this.elements.errorIcon.title = "";
      let slotName;
      let messageElement;
      let message;

      // Reset the invalid state message back to its valid state message.
      if (this.elements.widget.checked) {
        slotName = "checked-message";
        messageElement = this.elements.checkedMessage;
        message = this.data.checkedMessage;
      } else {
        slotName = "unchecked-message";
        messageElement = this.elements.uncheckedMessage;
        message = this.data.uncheckedMessage;
      }
      // When the error is resolved bring back the message element in its actual slot with its content.
      UX.Base.setSlotContent(messageElement, message, undefined, slotName);
      // Hide Alert Icon.
      UX.Base.resetSlotContent(this.elements.errorIcon);
    }


    showFormatError(errorMessage) {
      this.showErrorIcon(errorMessage);
      // Remove the uniface invalid state as we always give priority to format error.
      this.elements.widget.classList.remove("u-invalid");
      // Add and show uniface invalid format state.
      this.elements.widget.classList.add("u-format-invalid");
      this.data.isFormatErrorActive = true;
    }

    hideFormatError() {
      this.hideErrorIcon();
      // Remove uniface invalid format state.
      this.elements.widget.classList.remove("u-format-invalid");
      this.data.isFormatErrorActive = false;
    }
  }

  // Add the widget classes to the UX namespace.
  if (typeof window.UX === "undefined" || window.UX === null) {
    window.UX = {};
  }
  UX.Switch = Switch;

  // Make the widget class known to the UNIFACE framework.
  UNIFACE.ClassRegistry.add("UX.Switch", UX.Switch);

}());

