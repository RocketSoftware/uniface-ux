/* global UNIFACE uniface UX */
(function () {
  "use strict";

  // Widget class for uxTextField widget - wrapper class for Fluent TextField web component.
  class TextField extends UX.Base {

    static processLayout(skeletonWidgetElement) {
      UX.Base.staticLog("processLayout", skeletonWidgetElement);

      let widgetElement;
      if (skeletonWidgetElement.tagName.toLowerCase() === "fluent-text-field") {
        // The layout already provides a "fluent-text-field" element.
        // Simply return that as the element to be used as widgetElement.
        widgetElement = skeletonWidgetElement;
      } else {
        // The widgetElement will be a copy of the skeletonWidgetElement,
        // excluding its child elements and its attributes,
        // and with tagName set to "fluent-text-field".
        widgetElement = UX.Base.cloneElement(skeletonWidgetElement, "fluent-text-field", false, false);
      }

      // Add placeholder for the label, prefix, error icon and suffix.
      widgetElement.innerHTML += `
        <span class="u-label-text" hidden></span>
        <span class="u-prefix" hidden></span>
        <span class="u-error-icon" hidden></span>
        <span class="u-suffix" hidden></span>
      `;

      // Invoke uxButton processLayout.
      const changeButton = UX.Base.createSlot(widgetElement, "fluent-button", "u-change-button");
      UX.Button.processLayout(changeButton);

      return widgetElement;
    }

    constructor() {
      super();
      this.widget = {};
      this.widget.id = Math.random();
      this.log("constructor", this.widget);

      // Define default properties for fluent-text-field.
      // This widget uses those:
      //  * In dataInit() to put the widget in a defined initial state.
      //  * In dataUpdate() when resetting any of these properties.
      if (TextField.defaultProperties === undefined) {
        TextField.defaultProperties = {
          "html": {
            "appearance": "outline",
            "type": "text",
            "current-value": "",
            "size": "20"
          },
          "classes": {
            "u-text-field": true, // Default uniface class for widget element.
            "outline": true
          },
          "uniface": {
            "label-text": "",
            "prefix-text": "",
            "suffix-text": "",
            "change-button": "false",
            "change-button-text": "",
            "change-button-icon": ""
          }
        };
      }

      // Create an object of the UX.Button class,
      // for use as this widget's change button.
      this.changeButton = new UX.Button();
    }

    onConnect(widgetElement) {
      this.log("onConnect", widgetElement.id);
      this.elements = {};
      this.elements.widget = widgetElement;

      // References to internal elements - label, prefix, error icon, suffix and change button.
      this.elements.labelText = this.elements.widget.querySelector(".u-label-text");
      this.elements.prefix = this.elements.widget.querySelector(".u-prefix");
      this.elements.errorIcon = this.elements.widget.querySelector(".u-error-icon");
      this.elements.suffix = this.elements.widget.querySelector(".u-suffix");
      this.elements.changeButton = this.elements.widget.querySelector(".u-change-button");

      // Connect the change button to its DOM element.
      this.changeButton.onConnect(this.elements.changeButton);

      // Stop propagating event to parent nodes on pressing enter key if change button is enabled.
      this.elements.widget.addEventListener("keypress", (event) => {
        if (!this.elements.changeButton.hidden && event.key === "Enter") {
          event.stopPropagation();
        }
      });

      // Dispatch change event when clicked on change button.
      this.elements.changeButton.addEventListener("click", () => {
        this.elements.widget.dispatchEvent(new Event("change", { bubbles: false }));
      });

      // Return one updater, for the "change" event.
      // Make sure that the widget data is passed to uniface
      // even when no triggers have been mapped.
      let updaters = [];
      updaters.push({
        element: this.elements.widget,
        event_name: "change"
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
      this.setHtmlProperties(TextField.defaultProperties.html, this.elements.widget);
      this.setClassProperties(TextField.defaultProperties.classes, this.elements.widget);

      // Invoke change button dataInit.
      this.changeButton.dataInit();
      // Invoke change button dataUpdate with default attributes for change button.
      // Change button won't have a focus state through tabbing.
      this.changeButton.dataUpdate({
        html: {
          "appearance": "stealth",
          "tabindex": "-1"
        }
      });
    }

    dataUpdate(data) {
      this.log("dataUpdate", data);

      let changeButtonData = {
        html: {},
        uniface: {}
      };
      // Set xxxPropChange flags to indicate specific property changes.
      let prefixPropChange = false;
      let suffixPropChange = false;
      let changeButtonHtmlPropChange = false;
      let changeButtonTextPropChange = false;
      let changeButtonPropChange = false;
      let changeButtonIconPropChange = false;

      // Based on the detected property changes, determine what refresh functionality should be applied.
      let refreshPrefix = false;
      let refreshSuffix = false;
      let refreshChangeButton = false;

      // Set html properties.
      if (data.html) {
        this.setHtmlProperties(data.html, this.elements.widget, TextField.defaultProperties.html);

        // Keep track of whether the widget is set to readonly.
        // This will be used in unblockUI().
        if (data.html.readonly !== undefined) {
          this.data.readonly = data.html.readonly;
        }

        if (data.html.disabled !== undefined) {
          // Set the change button's disabled attribute.
          changeButtonData.html.disabled = data.html.disabled;
          changeButtonHtmlPropChange = true;
        }
      }

      // Set style properties.
      if (data.style) {
        this.setStyleProperties(data.style, this.elements.widget);
      }

      // Add or remove class names.
      if (data.classes) {
        this.setClassProperties(data.classes, this.elements.widget, TextField.defaultProperties.classes);
      }

      // Add uniface properties.
      if (data.uniface) {
        for (const key in data.uniface) {
          let uPropertyValue = data.uniface[key];
          if (uPropertyValue === uniface.RESET) {
            uPropertyValue = TextField.defaultProperties.uniface[key];
          }

          switch (key) {
            case "label-text":
              UX.Base.setSlotContent(this.elements.labelText, uPropertyValue);
              break;
            case "label-position":
              switch (uPropertyValue) {
                case "before":
                  this.elements.widget.setAttribute("u-label-position", "before");
                  break;
                case "below":
                  this.elements.widget.setAttribute("u-label-position", "below");
                  break;
                case "after":
                  this.elements.widget.setAttribute("u-label-position", "after");
                  break;
                default:
                  this.elements.widget.setAttribute("u-label-position", "above");
                  break;
              }
              break;
            case "prefix-text":
              this.data.prefixTextData = uPropertyValue;
              prefixPropChange = true;
              break;
            case "prefix-icon":
              this.data.prefixIconData = uPropertyValue;
              prefixPropChange = true;
              break;
            case "suffix-text":
              this.data.suffixTextData = uPropertyValue;
              suffixPropChange = true;
              break;
            case "suffix-icon":
              this.data.suffixIconData = uPropertyValue;
              suffixPropChange = true;
              break;
            case "change-button":
              this.changeButton.isShown = this.toBoolean(uPropertyValue);
              if (this.changeButton.isShown) {
                changeButtonData.html.hidden = false;
                this.elements.widget.classList.add("u-change-button-shown");
                this.elements.changeButton.setAttribute("slot", "end");
              } else {
                changeButtonData.html.hidden = true;
                this.elements.widget.classList.remove("u-change-button-shown");
                this.elements.changeButton.setAttribute("slot", "");
              }
              changeButtonPropChange = true;
              break;
            case "change-button-text":
              changeButtonData.value = uPropertyValue;
              changeButtonTextPropChange = true;
              break;
            case "change-button-icon":
              changeButtonData.uniface["icon"] = uPropertyValue;
              changeButtonData.uniface["icon-position"] = "end";
              changeButtonIconPropChange = true;
              break;
          }
        }
      }

      if (prefixPropChange) {
        refreshPrefix = true;
      }

      if (suffixPropChange) {
        refreshSuffix = true;
      }

      if (
        changeButtonHtmlPropChange ||
        changeButtonTextPropChange ||
        changeButtonIconPropChange ||
        changeButtonPropChange
      ) {
        refreshChangeButton = true;
      }

      if (refreshPrefix) {
        // We always give priority to the icon.
        if (this.data.prefixIconData !== undefined) {
          UX.Base.setSlotContent(this.elements.prefix, undefined, this.data.prefixIconData, "start");
        } else {
          UX.Base.setSlotContent(this.elements.prefix, this.data.prefixTextData, undefined, "start");
        }
      }

      if (refreshSuffix) {
        if (this.data.suffixIconData !== undefined) {
          UX.Base.setSlotContent(this.elements.suffix, undefined, this.data.suffixIconData, "end");
        } else {
          UX.Base.setSlotContent(this.elements.suffix, this.data.suffixTextData, undefined, "end");
        }
      }

      if (refreshChangeButton) {
        this.changeButton.dataUpdate(changeButtonData);
      }

      // Add value to widget.
      if (data.value !== undefined) {
        this.elements.widget.value = data.value;
      }
    }

    dataCleanup(dataNames) {
      this.log("dataCleanup", dataNames);

      if (dataNames && Object.keys(dataNames).length > 0) {
        // Collect all dataNames of change button.
        let changeButtonDataNames = {
          html: new Set(),
          uniface: new Set(),
        };

        // Reset html properties.
        if (dataNames.hasOwnProperty("html") && dataNames.html.size > 0) {
          // Resetting the size attribute would cause the Fluent text field
          // to throw an exception.
          // We avoid this by explicitly setting size to 20 instead,
          // which is the default according to W3C specs.
          this.resetHtmlProperties(dataNames.html, this.elements.widget, TextField.defaultProperties.html);
        }

        // Reset html disabled property of change button.
        if (dataNames.hasOwnProperty("html") && dataNames.html.has("disabled")) {
          changeButtonDataNames.html.add("disabled");
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
              case "label-position":
                this.elements.widget.removeAttribute("u-label-position");
                break;
              case "prefix-text":
              case "prefix-icon":
                // To make sure to reset the slot only once, we remove all property names
                // related to prefix from dataNames.uniface after the slot is reset.
                UX.Base.resetSlotContent(this.elements.prefix);
                dataNames.uniface.delete("prefix-text");
                dataNames.uniface.delete("prefix-icon");
                break;
              case "suffix-text":
              case "suffix-icon":
                UX.Base.resetSlotContent(this.elements.suffix);
                // To make sure to reset the slot only once, we remove all property names
                // related to suffix from dataNames.uniface after the slot is reset.
                dataNames.uniface.delete("suffix-text");
                dataNames.uniface.delete("suffix-icon");
                break;
              case "change-button":
                this.elements.widget.classList.remove("u-change-button-shown");
                this.changeButton.isShown = false;
                break;
              case "change-button-icon":
                changeButtonDataNames.uniface.add("icon");
                changeButtonDataNames.uniface.add("icon-position");
                break;
            }
          });
        }

        // Reset all collected properties of the change button.
        if (
          changeButtonDataNames.html.size > 0 ||
          changeButtonDataNames.uniface.size > 0 ||
          (dataNames.hasOwnProperty("uniface") && dataNames.uniface.has("change-button-text"))
        ) {
          this.changeButton.dataCleanup(changeButtonDataNames);
        }
      }

      // Reset classes properties.
      this.resetClassProperties(this.elements.widget);

      // Hide the change button.
      this.elements.changeButton.hidden = true;

      // Reset value.
      this.elements.widget.value = "";

      // Reset local data.
      this.data = {};
    }

    getValue() {
      let val = this.elements.widget.value;
      this.log("getValue", val);
      return val;
    }

    validate() {
      this.log("validate");
      // Add HTML5 validation.
      let html5ValidationMessage;
      if (!this.elements.widget.control.checkValidity()) {
        // HTML5 validation.
        html5ValidationMessage = this.elements.widget.control.validationMessage;
      }
      return html5ValidationMessage;
    }

    showError(errorMessage) {
      this.log("showError", errorMessage);
      this.data.isInError = true;
      // Show the error as a tooltip text.
      this.elements.errorIcon.title = errorMessage;
      // Add and show uniface invalid state.
      this.elements.widget.classList.add("u-invalid");
      // Add alert icon.
      UX.Base.setSlotContent(this.elements.errorIcon, undefined, "AlertSolid", "end");
    }

    hideError() {
      this.log("hideError");
      this.data.isInError = false;
      // Remove the error tooltip text.
      this.elements.errorIcon.title = "";
      // Remove and hide uniface invalid state.
      this.elements.widget.classList.remove("u-invalid");
      // Hide alert icon.
      UX.Base.resetSlotContent(this.elements.errorIcon);
    }

    blockUI() {
      this.log("blockUI");
      // When the widget is set to 'readOnly',  all events associated with the change button are removed, and
      // a 'not-allowed' cursor is applied using CSS, making the change button non-interactive.
      this.setWidgetReadOnly(true);
    }

    unblockUI() {
      this.log("unblockUI");
      // Reset readOnly to its previous value.
      this.setWidgetReadOnly(this.data.readonly || false);
    }

    /**
     * Sets this widget as readonly.
     */
    setWidgetReadOnly(isReadOnly) {
      try {
        this.elements.widget.readOnly = isReadOnly;
      } catch (e) {
        // The Fluent TextField web component may throw an exception when setting the
        // web component to readonly while it is in error.
        // See https://github.com/microsoft/fluentui/issues/28724.
        // We work around that bug by ignoring exceptions in that specific situation.
        if (!this.data.isInError) {
          throw e;
        }
      }
    }
  }

  // Add the widget class to the UX namespace.
  if (typeof window.UX === "undefined" || window.UX === null) {
    window.UX = {};
  }
  UX.TextField = TextField;

  // Make the widget class known to the UNIFACE framework.
  UNIFACE.ClassRegistry.add("UX.TextField", UX.TextField);

}());
