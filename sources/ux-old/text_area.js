/* global UNIFACE uniface UX */
(function () {
  "use strict";

  // Widget class for uxTextArea widget - wrapper class for Fluent Text Area web component.
  class TextArea extends UX.Base {

    static processLayout(skeletonWidgetElement) {
      UX.Base.staticLog("processLayout", skeletonWidgetElement);

      let widgetElement;
      if (skeletonWidgetElement.tagName.toLowerCase() === "fluent-text-area") {
        // The layout already provides a "fluent-text-area" element.
        // Simply return that as the element to be used as widgetElement.
        widgetElement = skeletonWidgetElement;
      } else {
        // The widgetElement will be a copy of the skeletonWidgetElement,
        // excluding its child elements and its attributes,
        // and with tagName set to "fluent-text-area".
        widgetElement = UX.Base.cloneElement(skeletonWidgetElement, "fluent-text-area", false, false);
      }

      // Add placeholder for the label and error icon.
      widgetElement.innerHTML += `
        <span class="u-label-text hidden"></span>
        <span class="u-error-icon hidden"></span>
      `;

      return widgetElement;
    }

    constructor() {
      super();
      this.widget = {};
      this.widget.id = Math.random();
      this.log("constructor", this.widget);

      // Define default properties for fluent-text-area.
      // This widget uses those:
      //  * In dataInit() to put the widget in a defined initial state.
      //  * In dataUpdate() when resetting any of these properties.
      if (TextArea.defaultProperties === undefined) {
        TextArea.defaultProperties = {
          "html": {
            "appearance": "outline",
            "resize": "none",
            "current-value": ""
          },
          "classes": {
            "u-text-area": true,  // Default uniface class for widget element.
            "outline": true
          },
          "uniface": {
            "label-text": ""
          }
        };
      }
    }

    onConnect(widgetElement) {
      this.log("onConnect", widgetElement.id);
      this.elements = {};
      this.elements.widget = widgetElement;

      let shadowRoot = this.elements.widget.shadowRoot;
      // Put root div and an error span inside the shadow root since the fluent library doesn't provide them.
      let root = shadowRoot.querySelector(".root");
      if (!root) {
        root = document.createElement("div");
        root.setAttribute("class", "root");
        root.part = "root";
        shadowRoot.appendChild(root);
      }
      let control = shadowRoot.querySelector(".control");
      root.appendChild(control);
      let errorSpan = shadowRoot.querySelector(".error");
      if (!errorSpan) {
        errorSpan = document.createElement("span");
        errorSpan.part = "end";
        errorSpan.setAttribute("class", "error");
        let errorSlot = document.createElement("slot");
        errorSlot.name = "end";
        errorSpan.appendChild(errorSlot);
        root.appendChild(errorSpan);
      }

      // References to internal elements - label and error icon.
      this.elements.labelText = this.elements.widget.querySelector(".u-label-text");
      this.elements.errorIcon = this.elements.widget.querySelector(".u-error-icon");

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
      this.setHtmlProperties(TextArea.defaultProperties.html, this.elements.widget);
      this.setClassProperties(TextArea.defaultProperties.classes, this.elements.widget);
    }

    dataUpdate(data) {
      this.log("dataUpdate", data);

      // Set html properties.
      if (data.html) {
        this.setHtmlProperties(data.html, this.elements.widget, TextArea.defaultProperties.html);

        // Keep track of whether the widget is set to readonly.
        // This will be used in unblockUI().
        if (data.html.readonly !== undefined) {
          this.data.readonly = data.html.readonly;
        }

        // Rows are treated as a special case because
        // setting element.rows = <rows> doesn't seem to work.
        if (data.html.rows !== undefined) {
          this.elements.widget.setAttribute("rows", data.html.rows);
        }
      }

      // Set style properties.
      if (data.style) {
        this.setStyleProperties(data.style, this.elements.widget);
      }

      // Add or remove class names.
      if (data.classes) {
        this.setClassProperties(data.classes, this.elements.widget, TextArea.defaultProperties.classes);
      }

      // Add uniface properties.
      if (data.uniface) {
        for (const key in data.uniface) {
          let uPropertyValue = data.uniface[key];
          if (uPropertyValue === uniface.RESET) {
            uPropertyValue = TextArea.defaultProperties.uniface[key];
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
          }
        }
      }

      // Add value to widget.
      if (data.value !== undefined) {
        this.elements.widget.value = data.value;
      }
    }

    dataCleanup(dataNames) {
      this.log("dataCleanup", dataNames);

      if (dataNames && Object.keys(dataNames).length > 0) {
        // Reset html properties.
        if (dataNames.hasOwnProperty("html") && dataNames.html.size > 0) {
          this.resetHtmlProperties(dataNames.html, this.elements.widget, TextArea.defaultProperties.html);
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
            }
          });
        }
      }
      // Reset classes properties.
      this.resetClassProperties(this.elements.widget);

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
    }

    showError(errorMessage) {
      this.log("showError", errorMessage);
      // Show the error as a tooltip text.
      this.elements.errorIcon.title = errorMessage;
      // Add and show uniface invalid state.
      this.elements.widget.classList.add("u-invalid");
      // Add Alert icon.
      UX.Base.setSlotContent(this.elements.errorIcon, undefined, "AlertSolid", "end");
    }

    hideError() {
      this.log("hideError");
      // Remove the error tooltip text.
      this.elements.errorIcon.title = "";
      // Remove and hide uniface invalid state.
      this.elements.widget.classList.remove("u-invalid");
      // Hide Alert icon.
      UX.Base.resetSlotContent(this.elements.errorIcon);
    }

    blockUI() {
      this.log("blockUI");
      this.elements.widget.readonly = true;
    }

    unblockUI() {
      this.log("unblockUI");
      // Reset readOnly to its previous value.
      this.elements.widget.readOnly = this.data.readonly || false;
    }
  }

  // Add the widget to the UX namespace.
  if (typeof window.UX === "undefined" || window.UX === null) {
    window.UX = {};
  }
  UX.TextArea = TextArea;

  // Make the widget class known to the UNIFACE framework.
  UNIFACE.ClassRegistry.add("UX.TextArea", UX.TextArea);

}());
