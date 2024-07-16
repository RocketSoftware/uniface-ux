/* global UNIFACE uniface UX */
(function () {
  "use strict";

  // Widget class for uxButton widget - wrapper class for Fluent Button web component.
  class Button extends UX.Base {

    static processLayout(skeletonWidgetElement) {
      UX.Base.staticLog("processLayout", skeletonWidgetElement);

      let widgetElement;
      if (skeletonWidgetElement.tagName.toLowerCase() === "fluent-button") {
        // The layout already provides a "fluent-button" element.
        // Simply return that as the element to be used as widgetElement.
        widgetElement = skeletonWidgetElement;
      } else {
        // The widgetElement will be a copy of the skeletonWidgetElement,
        // excluding its child elements and its attributes,
        // and with tagName set to "fluent-button"
        widgetElement = UX.Base.cloneElement(skeletonWidgetElement, "fluent-button", false, false);
      }

      // Add placeholder for the button-icon and button-text.
      widgetElement.innerHTML += `
        <span class="u-icon" hidden></span>
        <span class="u-text" hidden></span>
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
      if (Button.defaultProperties === undefined) {
        Button.defaultProperties = {
          "html": {
            "appearance": "neutral",
            "current-value": ""
          },
          "classes": {
            "u-button": true,  // Default uniface class for widget element.
            "neutral": true
          },
          "uniface": {
            "icon": "",
            "icon-position": "start"
          }
        };
      }
    }

    onConnect(widgetElement) {
      this.log("onConnect", widgetElement.id);
      this.elements = {};
      this.elements.widget = widgetElement;

      // References to internal elements - button-text and button-icon.
      this.elements.buttonIconElement = this.elements.widget.querySelector(".u-icon");
      this.elements.buttonTextElement = this.elements.widget.querySelector(".u-text");
    }

    mapTrigger(triggerName) {
      this.log("mapTrigger", triggerName);
      let triggerMapping;
      switch (triggerName) {
        case "detail":
          triggerMapping = {
            element: this.elements.widget,
            event_name: "click",
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
      this.setHtmlProperties(Button.defaultProperties.html, this.elements.widget);
      this.setClassProperties(Button.defaultProperties.classes, this.elements.widget);

      // Remember the value, iconName and iconPosition to be used in multiple occurrences.
      Object.assign(this.data, {
        iconName: Button.defaultProperties.uniface["icon"],
        iconPosition: Button.defaultProperties.uniface["icon-position"],
        value: ""
      });
    }

    dataUpdate(data) {
      this.log("dataUpdate", data);

      // Set xxxPropChange flags to indicate specific property changes.
      let valuePropChange = false;
      let iconPropChange = false;

      // Based on the detected property changes, determine what refresh functionality should be applied.
      let refreshText = false;
      let refreshIcon = false;

      // Set html properties.
      if (data.html) {
        this.setHtmlProperties(data.html, this.elements.widget, Button.defaultProperties.html);

        // Keep track of whether the widget is set to disabled.
        // This will be used in unblockUI().
        if (data.html.disabled !== undefined) {
          this.data.disabled = data.html.disabled;
        }
      }

      // Set style properties.
      if (data.style) {
        this.setStyleProperties(data.style, this.elements.widget);
      }

      // Add or remove class names.
      if (data.classes) {
        this.setClassProperties(data.classes, this.elements.widget, Button.defaultProperties.classes);
      }

      // Add uniface properties.
      if (data.uniface) {
        let icon = data.uniface.icon;
        let iconPosition = data.uniface["icon-position"];

        if (icon === uniface.RESET) {
          icon = Button.defaultProperties.uniface["icon"];
        }
        if (iconPosition === uniface.RESET) {
          iconPosition = Button.defaultProperties.uniface["icon-position"];
        }
        if (icon !== undefined) {
          this.data.iconName = icon;
          iconPropChange = true;
        }
        if (iconPosition !== undefined) {
          this.data.iconPosition = iconPosition;
          iconPropChange = true;
        }
      }

      // Add value to widget & set valuePropChange flag.
      if (data.value !== undefined) {
        this.data.value = data.value;
        valuePropChange = true;
      }

      if (iconPropChange) {
        refreshIcon = true;
      }

      if (valuePropChange) {
        refreshText = true;
        refreshIcon = true;
      }

      if (refreshIcon) {
        this.refreshIconSlot(this.data.iconName, this.data.iconPosition, this.data.value);
      }

      if (refreshText) {
        UX.Base.setSlotContent(this.elements.buttonTextElement, this.data.value);
      }
    }

    dataCleanup(dataNames) {
      this.log("dataCleanup", dataNames);

      if (dataNames && Object.keys(dataNames).length > 0) {
        // Reset html properties.
        if (dataNames.hasOwnProperty("html") && dataNames.html.size > 0) {
          this.resetHtmlProperties(dataNames.html, this.elements.widget, Button.defaultProperties.html);
        }

        // Reset style properties.
        if (dataNames.hasOwnProperty("style") && dataNames.style.size > 0) {
          this.resetStyleProperties(dataNames.style, this.elements.widget);
        }

        // Reset all Uniface property-related items.
        if (dataNames.hasOwnProperty("uniface")) {
          dataNames.uniface.forEach((uPropertyValue) => {
            switch (uPropertyValue) {
              case "icon-position":
              case "icon":
                UX.Base.resetSlotContent(this.elements.buttonIconElement);
                // To make sure to reset the slot only once, we remove all property names
                // related to icon from dataNames.uniface after the slot is reset.
                dataNames.uniface.delete("icon-position");
                dataNames.uniface.delete("icon");
                break;
            }
          });
        }

        // Reset value.
        if (dataNames.hasOwnProperty("value")) {
          UX.Base.resetSlotContent(this.elements.buttonTextElement);
        }
      }
      // Reset classes properties.
      this.resetClassProperties(this.elements.widget);

      // Reset local data.
      this.data = {};
    }

    getValue() {
      let val = this.elements.buttonTextElement.innerText;
      this.log("getValue", val);
      return val;
    }

    validate() {
      this.log("validate");
    }

    showError(errorMessage) {
      this.log("showError", errorMessage);
      // If error exist throw exception.
      throw new Error(errorMessage);
    }

    hideError() {
      this.log("hideError");
    }

    blockUI() {
      this.log("blockUI");
      this.elements.widget.disabled = true;
    }

    unblockUI() {
      this.log("unblockUI");
      // Reset disabled to its previous value.
      this.elements.widget.disabled = this.data.disabled || false;
    }

    /**
     * Helper - Refresh icon slot if icon properties changes.
     */
    refreshIconSlot(iconName, iconPosition, buttonText) {
      if (iconName) {
        // Fixing fluent issue of rendering button or icon slot element with no value or invalid slot attribute value.
        // By default we are setting iconPosition to start if user passes invalid values along with non-empty buttonText.
        if (buttonText.length > 0 && iconPosition !== "start" && iconPosition !== "end") {
          iconPosition = Button.defaultProperties.uniface["icon-position"];
        }
        // Fixing fluent issue of rendering icon slot element with no button text.
        // By default we are setting iconPosition to empty string in order to generate icon only button.
        if (!buttonText) {
          iconPosition = "";
        }
        UX.Base.setSlotContent(this.elements.buttonIconElement, undefined, iconName, iconPosition);
      } else {
        UX.Base.resetSlotContent(this.elements.buttonIconElement);
      }
    }
  }

  // Add the widget class to the UX namespace.
  if (typeof window.UX === "undefined" || window.UX === null) {
    window.UX = {};
  }
  UX.Button = Button;

  // Make the widget class known to the UNIFACE framework.
  UNIFACE.ClassRegistry.add("UX.Button", UX.Button);

}());
