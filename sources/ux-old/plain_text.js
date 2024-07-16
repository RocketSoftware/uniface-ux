/* global UNIFACE uniface UX */
(function () {
  "use strict";

  // Widget class for uxPlainText widget - this class does not wrap any web component.
  class PlainText extends UX.Base {

    static processLayout(skeletonWidgetElement) {
      UX.Base.staticLog("processLayout", skeletonWidgetElement);

      let widgetElement;
      if (skeletonWidgetElement.tagName.toLowerCase() === "span") {
        // The layout already provides a "span" element.
        // Simply return that as the element to be used as widgetElement.
        widgetElement = skeletonWidgetElement;
        // Remove placeholder from layout
        widgetElement.innerHTML = "";
      } else {
        // The widgetElement will be a copy of the skeletonWidgetElement,
        // excluding its child elements and its attributes,
        // and with tagName set to "span".
        widgetElement = UX.Base.cloneElement(skeletonWidgetElement, "span", false, false);
      }

      // Add placeholders for prefix, control, error icon and suffix.
      widgetElement.innerHTML += `
        <span class="u-prefix" hidden></span>
        <span class="u-control" hidden></span>
        <span class="u-error-icon" hidden></span>
        <span class="u-suffix" hidden></span>
      `;

      return widgetElement;
    }

    constructor() {
      super();
      this.widget = {};
      this.widget.id = Math.random();
      this.log("constructor", this.widget);

      // Define default properties for PlainText.
      // This widget uses those:
      //  * In dataInit() to put the widget in a defined initial state.
      //  * In dataUpdate() when resetting any of these properties.
      if (PlainText.defaultProperties === undefined) {
        PlainText.defaultProperties = {
          classes: {
            "u-plain-text": true // Default uniface class for widget element.
          },
          uniface: {
            "prefix-text": "",
            "suffix-text": "",
            "formatting": ""
          }
        };
      }
    }

    onConnect(widgetElement) {
      this.log("onConnect", widgetElement.id);
      this.elements = {};
      this.elements.widget = widgetElement;

      // References to internal elements - prefix, control, error icon, suffix.
      this.elements.prefix = this.elements.widget.querySelector(".u-prefix");
      this.elements.control = this.elements.widget.querySelector(".u-control");
      this.elements.errorIcon = this.elements.widget.querySelector(".u-error-icon");
      this.elements.suffix = this.elements.widget.querySelector(".u-suffix");
    }

    mapTrigger(triggerName) {
      this.log("mapTrigger", triggerName);
    }

    dataInit() {
      this.data = {};
      this.data.id = Math.random();
      this.log("dataInit", this.data);

      // Put this widget in a defined initial state.
      this.setClassProperties(PlainText.defaultProperties.classes, this.elements.widget);
    }

    dataUpdate(data) {
      this.log("dataUpdate", data);

      // Set xxxPropChange flags to indicate specific property changes.
      let prefixPropChange = false;
      let suffixPropChange = false;
      let formattingChange = false;

      // Based on the detected property changes, determine what refresh functionality should be applied.
      let refreshPrefix = false;
      let refreshSuffix = false;
      let refreshFormatting = false;

      // Set html properties.
      if (data.html) {
        // Excluding readonly and disabled attributes for plaintext as it is a non-editable field, so these attributes should have no effect.
        delete data.html.readonly;
        delete data.html.disabled;
        this.setHtmlProperties(data.html, this.elements.widget);
      }

      // Set style properties.
      if (data.style) {
        this.setStyleProperties(data.style, this.elements.widget);
      }

      // Add or remove class names.
      if (data.classes) {
        this.setClassProperties(data.classes, this.elements.widget, PlainText.defaultProperties.classes);
      }

      // Add uniface properties.
      if (data.uniface) {
        for (const key in data.uniface) {
          let uPropertyValue = data.uniface[key];
          if (uPropertyValue === uniface.RESET) {
            uPropertyValue = PlainText.defaultProperties.uniface[key];
          }
          switch (key) {
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
            case "formatting":
              this.data.formatting = uPropertyValue.toLowerCase();
              formattingChange = true;
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

      if (formattingChange) {
        refreshFormatting = true;
      }

      if (refreshPrefix) {
        // We always give priority to the icon.
        if (this.data.prefixIconData !== undefined) {
          UX.Base.setElementContent(this.elements.prefix, undefined, this.data.prefixIconData);
        } else {
          UX.Base.setElementContent(this.elements.prefix, this.data.prefixTextData);
        }
      }

      if (refreshSuffix) {
        // We always give priority to the icon.
        if (this.data.suffixIconData !== undefined) {
          UX.Base.setElementContent(this.elements.suffix, undefined, this.data.suffixIconData);
        } else {
          UX.Base.setElementContent(this.elements.suffix, this.data.suffixTextData);
        }
      }

      // Add valrep.
      if (data.valrep) {
        this.data.valrep = data.valrep;
        refreshFormatting = true;
      }

      // Add value to widget.
      if (data.value !== undefined && data.value !== null) {
        this.data.value = data.value;
        refreshFormatting = true;
      }

      // Set representation if either value, formatting property or valrep was updated.
      if (refreshFormatting) {
        this.setRepresentation();
      }
    }

    dataCleanup(dataNames) {
      this.log("dataCleanup", dataNames);

      if (dataNames && Object.keys(dataNames).length > 0) {
        // Reset html properties.
        if (dataNames.hasOwnProperty("html") && dataNames.html.size > 0) {
          this.resetHtmlProperties(dataNames.html, this.elements.widget);
        }

        // Reset style properties.
        if (dataNames.hasOwnProperty("style") && dataNames.style.size > 0) {
          this.resetStyleProperties(dataNames.style, this.elements.widget);
        }

        // Reset all Uniface property-related items.
        if (dataNames.hasOwnProperty("uniface")) {
          dataNames.uniface.forEach((uPropertyValue) => {
            switch (uPropertyValue) {
              case "prefix-text":
              case "prefix-icon":
                // To make sure to reset the slot only once, we remove all property names
                // related to prefix from dataNames.uniface after the slot is reset.
                UX.Base.resetElementContent(this.elements.prefix);
                dataNames.uniface.delete("prefix-text");
                dataNames.uniface.delete("prefix-icon");
                break;
              case "suffix-text":
              case "suffix-icon":
                UX.Base.resetElementContent(this.elements.suffix);
                // To make sure to reset the slot only once, we remove all property names
                // related to suffix from dataNames.uniface after the slot is reset.
                dataNames.uniface.delete("suffix-text");
                dataNames.uniface.delete("suffix-icon");
                break;
            }
          });
        }
      }
      // Reset classes properties.
      this.resetClassProperties(this.elements.widget);
      // Reset Local data.
      this.data = {};
    }

    getValue() {
      let val = this.data.value;
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
      // Add alert Icon.
      UX.Base.setElementContent(this.elements.errorIcon, undefined, "AlertSolid");
    }

    hideError() {
      this.log("hideError");
      // Remove the error tooltip text.
      this.elements.errorIcon.title = "";
      // Remove and hide uniface invalid state.
      this.elements.widget.classList.remove("u-invalid");
      // Hide alert icon.
      UX.Base.resetElementContent(this.elements.errorIcon);
    }

    blockUI() {
      this.log("blockUI");
    }

    unblockUI() {
      this.log("unblockUI");
    }

    getValueRepresentationAsText() {
      let val = this.data.value;
      if (val !== undefined && typeof val !== "string") {
        val = val.toString();
      }
      let obj = this.data.valrep ? this.data.valrep.find((el) => (el.value === val)) : undefined;
      switch (this.data.formatting) {
        case "valrep-html":
          if (obj) {
            val = `<span class="u-valrep-rep">${obj.representation}</span><span class="u-valrep-value">${val}</span>`;
          } else {
            val = `<span class="u-valrep-rep u-valrep-error"></span><span class="u-valrep-value">${val}</span>`;
          }
          this.elements.control.innerHTML = val;
          break;
        case "valrep-text":
          if (obj) {
            val = `${obj.representation} (${val})`;
          }
          break;
        case "representation-only":
          if (obj) {
            val = obj.representation;
          }
          break;
        case "multi-paragraphs":
          if (val && val.split) {
            let lines = val.split(/\n/);
            val = "";
            for (let i = 0; i < lines.length; i++) {
              let line = `<p class="u-paragraph">${lines[i]}</p>`;
              val += line;
            }
          }
          break;
        case "multi-line":
          break;
        case "single-line":
          if (val && val.replaceAll) {
            val = val.replaceAll(/\n/g, " ");
          }
          break;
        default: // "first-line".
          if (val && val.split) {
            var arr = val.split("\n", 2);
            if (arr.length > 1) {
              val = `${arr[0]}...`;
            }
          }
          break;
      }
      return val;
    }

    setRepresentation() {
      // Format html and multi-line formats locally.
      // Format single-line-text using getValueRepresentationAsText().

      let val = this.getValueRepresentationAsText();
      switch (this.data.formatting) {
        case "valrep-html":
        case "multi-paragraphs":
          this.elements.control.innerHTML = val;
          break;
        // Other formats are assigned as text.
        default:
          this.elements.control.innerText = val;
          break;
      }
      if (val) {
        this.elements.control.hidden = false;
      }
    }
  }

  // Add the widget class to the UX namespace.
  if (typeof window.UX === "undefined" || window.UX === null) {
    window.UX = {};
  }
  UX.PlainText = PlainText;

  // Make the widget class known to the UNIFACE framework.
  UNIFACE.ClassRegistry.add("UX.PlainText", UX.PlainText);

}());
