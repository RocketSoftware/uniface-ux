/* global UNIFACE uniface UX */
(function () {
  "use strict";

  // Widget class for uxCheckbox widget - wrapper class for Fluent Checkbox web component.
  class Checkbox extends UX.Base {

    static processLayout(skeletonWidgetElement) {
      UX.Base.staticLog("processLayout", skeletonWidgetElement);

      let widgetElement;
      if (skeletonWidgetElement.tagName.toLowerCase() === "fluent-checkbox") {
        // The layout already provides a "fluent-checkbox" element.
        // Simply return that as the element to be used as widgetElement.
        widgetElement = skeletonWidgetElement;
      } else {
        // The widgetElement will be a copy of the skeletonWidgetElement,
        // excluding its child elements and its attributes,
        // and with tagName set to "fluent-checkbox".
        widgetElement = UX.Base.cloneElement(skeletonWidgetElement, "fluent-checkbox", false, false);
      }

      // Add placeholder for the label and error icon.
      widgetElement.innerHTML += `
        <span class="u-label-text" hidden></span>
        <span class="u-error-icon" hidden></span>
      `;

      return widgetElement;
    }

    constructor() {
      super();
      this.widget = {};
      this.widget.id = Math.random();
      this.log("constructor", this.widget);

      // Define default properties for fluent-button.
      // This widget uses those:
      //  * In dataInit() to put the widget in a defined initial state.
      //  * In dataUpdate() when resetting any of these properties.
      if (Checkbox.defaultProperties === undefined) {
        Checkbox.defaultProperties = {
          "html": {
            "role": "checkbox",
            "aria-checked": "false",
            "aria-required": "false",
            "aria-disabled": "false",
            "tabindex": "0",
            "current-value": "on",
            "current-checked": "false"
          },
          "classes": {
            "u-checkbox": true  // Default uniface class for widget element.
          },
          "uniface": {
            "tri-state": "false",
            "label-text": ""
          }
        };
      }
    }

    onConnect(widgetElement) {
      this.log("onConnect", widgetElement.id);
      this.elements = {};
      this.elements.widget = widgetElement;

      // Handle the change and setting the correct state of checkbox.
      widgetElement.addEventListener("change", this.handleChange.bind(this));

      // References to internal elements - label and error icon.
      this.elements.labelText = this.elements.widget.querySelector(".u-label-text");
      this.elements.errorIcon = this.elements.widget.querySelector(".u-error-icon");

      // Return one updater, for the "valuechange" custom event.
      // Make sure that the widget data is passed to Uniface
      // even when no triggers have been mapped.
      let updaters = [];
      updaters.push({
        element: this.elements.widget,
        event_name: "valuechange",
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
            event_name: "valuechange",
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
      this.setHtmlProperties(Checkbox.defaultProperties.html, this.elements.widget);
      this.setClassProperties(Checkbox.defaultProperties.classes, this.elements.widget);
    }

    dataUpdate(data) {
      this.log("dataUpdate", data);

      // Add html properties.
      if (data.html) {
        // We ignore the value of the HTML 'checked' attribute,
        // as we update the checked attribute based on the field value.
        delete data.html.checked;
        this.setHtmlProperties(data.html, this.elements.widget, Checkbox.defaultProperties.html);

        // Keep track of whether the widget is set to read-only.
        // This will be used in unblockUI().
        if (data.html.readonly !== undefined) {
          this.data.readonly = data.html.readonly;
        }
      }

      // Add style properties.
      if (data.style) {
        this.setStyleProperties(data.style, this.elements.widget);
      }

      // Add or remove class names.
      if (data.classes) {
        this.setClassProperties(data.classes, this.elements.widget, Checkbox.defaultProperties.classes);
      }

      // Add uniface properties.
      if (data.uniface) {
        for (const key in data.uniface) {
          let uPropertyValue = data.uniface[key];
          if (uPropertyValue === uniface.RESET) {
            uPropertyValue = Checkbox.defaultProperties.uniface[key];
          }

          switch (key) {
            case "label-text":
              UX.Base.setSlotContent(this.elements.labelText, uPropertyValue);
              break;
            case "tri-state":
              this.data.isTriState = this.toBoolean(uPropertyValue);
              break;
          }
        }
      }

      // Add value to widget.
      if (data.hasOwnProperty("value")) {

        // Get the new value and apply it to this widget.
        let newValue;
        try {
          if (data.value === undefined || data.value === null || data.value === "") {
            newValue = null;
          } else {
            newValue = this.fieldValueToBoolean(data.value);
          }
          this.hideFormatError();
        } catch (e) {
          // Value is unchecked for the formatting error.
          newValue = false;
          this.showFormatError(e);
        }
        if (this.data.currentValue === undefined || this.data.currentValue !== newValue) {
          this.changeValue(newValue);
        }
      }
    }

    dataCleanup(dataNames) {
      this.log("dataCleanup", dataNames);

      if (dataNames && Object.keys(dataNames).length > 0) {
        // Reset html properties.
        if (dataNames.hasOwnProperty("html") && dataNames.html.size > 0) {
          this.resetHtmlProperties(dataNames.html, this.elements.widget, Checkbox.defaultProperties.html);
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
            }
          });
        }
      }
      // Reset classes properties.
      this.resetClassProperties(this.elements.widget);

      // Reset value.
      this.elements.widget.checked = "";

      // Reset local data.
      this.data = {};
    }

    getValue() {
      let val = this.elements.widget.indeterminate ? "" : this.elements.widget.checked;
      this.log("getValue", val);
      return val;
    }

    validate() {
      this.log("validate");
    }

    showError(errorMessage) {
      this.log("showError", errorMessage);
      // Format error has priority, hence when we have format error set, we don't have to show the validate error icon.
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
      // Move errorIcon element in the end slot.
      UX.Base.setElementContent(this.elements.errorIcon, undefined, "AlertSolid");
    }

    hideErrorIcon() {
      // Removes the format error tooltip text.
      this.elements.errorIcon.title = "";
      // Hide Alert Icon.
      UX.Base.resetElementContent(this.elements.errorIcon);
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
      // Remove and Hide uniface invalid format state.
      this.elements.widget.classList.remove("u-format-invalid");
      UX.Base.resetElementContent(this.elements.errorIcon);
      this.data.isFormatErrorActive = false;
    }

    /**
     * Makes value change but ensures that cascading "change" events are not fired (see handleChange).
     */
    changeValue(newValue) {
      // 'this.elements.widget.checked = newValue;' will fire the handleChange API,
      // and we do not want to execute changeEvent again,
      // hence the ignoreChangeEvent is flagged true, to omit recursion.
      this.data.ignoreChangeEvent = true;

      this.elements.widget.indeterminate = (newValue === null);
      this.elements.widget.checked = newValue;

      this.data.ignoreChangeEvent = false;

      this.data.currentValue = newValue;

      this.elements.widget.dispatchEvent(new CustomEvent("valuechange", {
        detail: { value: newValue },
        cancelable: true
      }));
    }

    /**
     * Fluent widget onchange event handler. Hijacks "change" event and handle it ourselves.
     */
    handleChange(event) {
      if (!this.data.ignoreChangeEvent) {
        event.preventDefault();

        // Determine the new value, starting from the current value.
        let newValue;
        switch (this.data.currentValue) {
          case true:
            newValue = false;
            break;
          case false:
            if (this.data.isTriState) {
              newValue = null;
            } else {
              newValue = true;
            }
            break;
          case null:
          default:
            newValue = true;
            break;
        }

        this.changeValue(newValue);
      }
    }
  }

  // Add the widget class to the UX namespace.
  if (typeof window.UX === "undefined" || window.UX === null) {
    window.UX = {};
  }
  UX.Checkbox = Checkbox;

  // Make the widget class known to the UNIFACE framework.
  UNIFACE.ClassRegistry.add("UX.Checkbox", UX.Checkbox);

}());
