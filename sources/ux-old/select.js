/* global UNIFACE uniface UX */
(function () {
  "use strict";

  // Widget class for uxSelect widget - wrapper class for Fluent Select web component.
  class Select extends UX.Base {

    static processLayout(skeletonWidgetElement) {
      UX.Base.staticLog("processLayout", skeletonWidgetElement);

      let widgetElement;
      if (skeletonWidgetElement.tagName.toLowerCase() === "fluent-select") {
        // The layout already provides a "fluent-select" element.
        // Simply return that as the element to be used as widgetElement.
        widgetElement = skeletonWidgetElement;
      } else {
        // The widgetElement will be a copy of the skeletonWidgetElement,
        // excluding its child elements and its attributes,
        // and with tagName set to "fluent-select".
        widgetElement = UX.Base.cloneElement(skeletonWidgetElement, "fluent-select", false, false);
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

      // Define a 'static' class member for displayFormat constants.
      // Ideally this should have been a proper static class member.
      // As ES6 does not support that, we use this workaround.
      if (Select.displayFormat === undefined) {
        Select.displayFormat = {
          REP: "rep",
          VAL: "val",
          VALREP: "valrep"
        };
      }

      // Define default properties for fluent-select.
      // This widget uses those:
      //  * In dataInit() to put the widget in a defined initial state.
      //  * In dataUpdate() when resetting any of these properties.
      if (Select.defaultProperties === undefined) {
        Select.defaultProperties = {
          "html": {
            "aria-activedescendant": "",
            "aria-controls": "",
            "aria-disabled": "false",
            "aria-expanded": "false",
            "aria-haspopup": "listbox",
            "role": "combobox",
            "tabindex": "0",
            "current-value": ""
          },
          "classes": {
            "u-select": true,  // Default uniface class for widget element.
            "collapsible": true,
            "outline": true
          },
          "uniface": {
            "label-text": "",
            "show-placeholder": "false",
            "placeholder-text": "Selected item",
            "display-format": "REP"
          }
        };
      }
    }

    onConnect(widgetElement) {
      this.log("onConnect", widgetElement.id);
      this.elements = {};
      this.elements.widget = widgetElement;
      this.elements.label = widgetElement.shadowRoot.querySelector(".label");
      this.elements.control = widgetElement.shadowRoot.querySelector(".control");
      this.elements.popup = widgetElement.shadowRoot.querySelector(".listbox");
      this.elements.errorIcon = this.elements.widget.querySelector(".u-error-icon");
      this.elements.labelText = this.elements.widget.querySelector(".u-label-text");

      // Put label inside the shadow root since the fluent library doesn't provide them.
      if (!this.elements.label) {
        this.elements.label = document.createElement("label");
        this.elements.label.setAttribute("class", "label");
        this.elements.label.setAttribute("for", "control");
        this.elements.label.part = "label";

        // Adding id to control element to bind with the label element,
        // hence clicking on the label gives focus to the control.
        this.elements.control.setAttribute("id", "control");

        // Creating named label slot element to hold label, since we can't use default slot.
        let slot = document.createElement("slot");
        slot.setAttribute("name", "label");
        this.elements.label.appendChild(slot);
        this.elements.widget.shadowRoot.prepend(this.elements.label);

        // Adding label styles as constructed stylesheet.
        this.stylingLabel();
      }

      // Because of a major flaw in Fluent popup designs, we need to do the popup position calculation ourselves.
      this.popupInitialize(".listbox", this.elements.widget);

      // Event listener checks whether clicked element is a label if so it prevents opening of the select control,
      // else it proceeds to compute the position of listbox and opens it.
      this.elements.widget.addEventListener("click", (event) => {
        const eventPropagationPath = event.composedPath();
        if (eventPropagationPath.includes(this.elements.label)) {
          this.elements.widget.open = false;
        } else {
          this.popupPreCalc(".listbox", this.elements.widget);
          const rect = this.popupGetRect(this.elements.control, this.elements.popup, this.data.popup.position);
          this.popupPostCalc(".listbox", rect);
        }
      });

      this.elements.widget.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          this.popupPreCalc(".listbox", this.elements.widget);
          const rect = this.popupGetRect(this.elements.control, this.elements.popup, this.data.popup.position);
          this.popupPostCalc(".listbox", rect);
        }
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          this.updateValueElement();
        }
      });

      // Event listener is used to update the selected value element on change event.
      // We are changing the format of the selected value slot, we don't want fluent to change it.
      this.elements.widget.addEventListener("change", () => {
        this.updateValueElement();
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
      this.setHtmlProperties(Select.defaultProperties.html, this.elements.widget);
      this.setClassProperties(Select.defaultProperties.classes, this.elements.widget);

      this.data.popup = {
        position: "below"
      };
      this.data.value = "";
      this.data.selectedOptionConf = {
        placeholderText: Select.defaultProperties.uniface["placeholder-text"],
        displayFormat: Select.displayFormat.REP
      };
    }

    dataUpdate(data) {
      this.log("dataUpdate", data);

      let widgetData = {
        html: {},
        classes: {}
      };

      // Set xxxPropChange flags to indicate specific property changes.
      let placeholderPropChange = false;
      let displayFormatPropChange = false;
      let valrepPropChange = false;
      let valuePropChange = false;

      // Based on the detected property changes, determine what refresh functionality should be applied.
      let refreshValrepElements = false;
      let refreshValue = false;

      // Set html properties.
      if (data.html) {
        // Exclude the size and multiselect attributes for for now,
        // as the current implementation with Fluent is not matured enough.
        delete data.html.size;
        delete data.html.multiple;

        // The filteredData holds all html properties except readonly and disabled since those will be handled seperately using widgetData.
        let filteredData = { ...data.html };
        delete filteredData.readonly;
        delete filteredData.disabled;
        this.setHtmlProperties(filteredData, this.elements.widget, Select.defaultProperties.html);

        // Keep track of whether the widget is set to readonly.
        // This will be used in unblockUI().
        if (data.html.readonly !== undefined) {
          this.data.readonly = data.html.readonly;
        }

        // Keep track of whether the widget is set to disabled.
        // This will be used in unblockUI().
        if (data.html.disabled !== undefined) {
          this.data.disabled = data.html.disabled;
        }

        // When both readonly and disabled property is true then set the widget in disabled state.
        // When readonly property is only true then set disabled property and assign u-readonly class.
        // When disabled property is only true then handle disabled property as it is by removing unwanted u-readonly class.
        // Else set the widget in default state.
        if (this.data.readonly || this.data.disabled) {
          widgetData.html.disabled = this.toBoolean(this.data.readonly) || this.toBoolean(this.data.disabled);
          widgetData.classes["u-readonly"] = this.toBoolean(this.data.readonly) && !this.toBoolean(this.data.disabled);
        }

        // Handles only disabled and readonly properties using widgetData.
        this.setHtmlProperties(widgetData.html, this.elements.widget, Select.defaultProperties.html);
        this.setClassProperties(widgetData.classes, this.elements.widget, Select.defaultProperties.classes);
      }

      // Set style properties.
      if (data.style) {
        this.setStyleProperties(data.style, this.elements.widget);
      }

      // Add or remove class names.
      if (data.classes) {
        this.setClassProperties(data.classes, this.elements.widget, Select.defaultProperties.classes);
      }

      // Add uniface properties.
      if (data.uniface) {
        for (const key in data.uniface) {
          let uPropertyValue = data.uniface[key];
          if (uPropertyValue === uniface.RESET) {
            uPropertyValue = Select.defaultProperties.uniface[key];
          }

          switch (key) {
            case "label-text":
              UX.Base.setSlotContent(this.elements.labelText, uPropertyValue, undefined, "label");
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
            case "popup:position":
              this.data.popup.position = uPropertyValue;
              break;
            case "show-placeholder":
              this.data.selectedOptionConf.showPlaceholder = this.toBoolean(uPropertyValue);
              placeholderPropChange = true;
              break;
            case "placeholder-text":
              this.data.selectedOptionConf.placeholderText = uPropertyValue;
              placeholderPropChange = true;
              break;
            case "display-format":
              var displayFormat = Select.displayFormat[uPropertyValue.toUpperCase()];
              // Default format is REP.
              this.data.selectedOptionConf.displayFormat = displayFormat ? displayFormat : Select.displayFormat.REP;
              displayFormatPropChange = true;
              break;
          }
        }
      }

      if (data.valrep) {
        this.data.valrep = data.valrep;
        valrepPropChange = true;
      }

      if (data.value !== undefined) {
        this.data.value = data.value;
        valuePropChange = true;
      }

      if (displayFormatPropChange) {
        refreshValrepElements = true;
        refreshValue = true;
      }

      if (valrepPropChange) {
        refreshValrepElements = true;
      }

      if (valuePropChange) {
        refreshValue = true;
      }

      if (this.data.value === "" && placeholderPropChange) {
        refreshValue = true;
      }

      if (this.data.value !== "" && refreshValrepElements) {
        refreshValue = true;
      }

      // Based on the refreshXXX flags, call the refreshValrepElements() and refreshValue() functions.
      // These functions refresh the options list and the selected value element.
      if (refreshValrepElements && this.data.valrep) {
        this.refreshValrepElements();
      }

      if (refreshValue) {
        this.refreshValue();
      }
    }

    dataCleanup(dataNames) {
      this.log("dataCleanup", dataNames);

      if (dataNames && Object.keys(dataNames).length > 0) {
        if (dataNames.hasOwnProperty("html") && dataNames.html.size > 0) {
          // Reset html properties.
          // Exclude the size and multiselect attributes for now,
          // as the current implementation with Fluent is not matured enough.
          dataNames.html.delete("size");
          dataNames.html.delete("multiselect");
          this.resetHtmlProperties(dataNames.html, this.elements.widget, Select.defaultProperties.html);
        }

        // Reset style properties.
        if (dataNames.hasOwnProperty("style") && dataNames.style.size > 0) {
          this.resetStyleProperties(dataNames.style, this.elements.widget);
        }

        // Reset all Uniface property-related items.
        if (dataNames.uniface) {
          for (const key in dataNames.uniface) {
            const uPropertyValue = dataNames.uniface[key];

            switch (uPropertyValue) {
              case "label-text":
                UX.Base.resetSlotContent(this.elements.labelText);
                break;
              case "label-position":
                this.elements.widget.removeAttribute("u-label-position");
                break;
            }
          }
        }
      }
      // Reset classes properties.
      this.resetClassProperties(this.elements.widget);

      this.removeValrepElements();

      // Reset value.
      this.elements.widget.value = "";

      // Reset local data.
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
      // Format error has a priority, hence when we have format error set, we don't have to show validate error icon.
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
      // Set widget in disabled or uniface readonly mode.
      this.setHtmlProperties({ disabled: true }, this.elements.widget, Select.defaultProperties.html);
      this.setClassProperties({ "u-readonly": !this.toBoolean(this.data.disabled) }, this.elements.widget, Select.defaultProperties.classes);
    }

    unblockUI() {
      this.log("unblockUI");
      // Unset widget from uniface readonly mode only if widget is not in disabled or readonly state.
      this.setHtmlProperties({ disabled: this.toBoolean(this.data.disabled) || this.toBoolean(this.data.readonly) }, this.elements.widget, Select.defaultProperties.html);
      this.setClassProperties({ "u-readonly": !this.toBoolean(this.data.disabled) && this.toBoolean(this.data.readonly) }, this.elements.widget, Select.defaultProperties.classes);
    }

    removeValrepElements() {
      const valrepElements = this.elements.widget.querySelectorAll("fluent-option");
      // Iterate through the elements and remove them.
      valrepElements.forEach(element => {
        element.remove();
      });
    }

    reformatElement(newNode, rep, val) {
      const displayFormat = this.data.selectedOptionConf.displayFormat;
      switch (displayFormat) {
        case Select.displayFormat.VALREP:
          newNode.innerHTML = '<span class="u-valrep-representation">' + rep + '</span> <span class="u-valrep-value">' + (val ? val : "null") + '</span>';
          break;
        case Select.displayFormat.VAL:
          newNode.innerHTML = '<span class="u-valrep-value">' + (val ? val : "null") + '</span>';
          break;
        case Select.displayFormat.REP:
        default:
          newNode.innerHTML = '<span class="u-valrep-representation">' + rep + '</span>';
      }
    }

    createValrepElement(tagName, val, rep) {
      const newNode = document.createElement(tagName);
      newNode.setAttribute("value", val);
      this.reformatElement(newNode, rep, val);
      return newNode;
    }

    createValrepElements(valrepArray) {
      valrepArray.forEach(valrepObj => {
        const newNode = this.createValrepElement("fluent-option", valrepObj.value, valrepObj.representation);
        this.elements.widget.appendChild(newNode);
      });
    }

    refreshValrepElements() {
      this.removeValrepElements();
      this.createValrepElements(this.data.valrep);
    }

    createPlaceholderElement() {
      const newNode = document.createElement('div');
      newNode.setAttribute("value", this.data.value);
      newNode.innerHTML = '<span class="u-placeholder">' + this.data.selectedOptionConf.placeholderText + '</span>';
      return newNode;
    }

    showErrorIcon(errorMessage) {
      // Show the error as a tooltip text.
      this.elements.errorIcon.title = errorMessage;
      // Move errorIcon element in the end slot.
      UX.Base.setSlotContent(this.elements.errorIcon, undefined, "AlertSolid", "end");
    }

    hideErrorIcon() {
      // Removes the format error tooltip text.
      this.elements.errorIcon.title = "";
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
      // Remove and Hide uniface invalid format state.
      this.elements.widget.classList.remove("u-format-invalid");
      this.data.isFormatErrorActive = false;
    }

    reformatErrorText() {
      const displayFormat = this.data.selectedOptionConf.displayFormat;
      let text = "";
      switch (displayFormat) {
        case Select.displayFormat.VALREP:
          text = "ERROR: Unable to show representation of value " + (this.data.value ? this.data.value : "null");
          break;
        case Select.displayFormat.VAL:
          text = "ERROR: Invalid value " + (this.data.value ? this.data.value : "null");
          break;
        case Select.displayFormat.REP:
        default:
          text = "ERROR: Unable to show representation of value";
      }
      return text;
    }

    refreshValueElement() {
      let rep;
      let isPlaceholderUsed = false;

      let selectedValueElement = this.elements.widget.querySelector('[slot="selected-value"]');
      if (selectedValueElement) {
        selectedValueElement.remove();
      }
      if ((this.data.value === "" || this.data.value === null) && this.data.selectedOptionConf.showPlaceholder) {
        selectedValueElement = this.createPlaceholderElement();
        isPlaceholderUsed = true;
      } else {
        rep = this.getRepresentation(this.data.value, this.data.valrep);
        if (rep === null) {
          rep = "";
        }
        selectedValueElement = this.createValrepElement("div", this.data.value, rep);
      }
      selectedValueElement.setAttribute('slot', 'selected-value');
      this.elements.widget.appendChild(selectedValueElement);

      if (!isPlaceholderUsed && !rep) {
        const errorText = this.reformatErrorText();
        // If there is no representation for the non-empty value then show a format error.
        this.showFormatError(errorText);
      } else {
        this.hideFormatError();
      }
    }

    refreshValue() {
      this.refreshValueElement();
      // When the value doesn't match any of the options in the option list
      // then Fluent sets the first option as selected.
      // We override this behavior asynchronously (with the help of
      // queueMicrotask) by setting the widget's value to this.data.value.
      // So after fluent has selected the default (first) option,
      // it is overridden so that the value of select widget is equal to
      // this.data.value even if there is no option corresponding to it.
      // queueMicrotask() schedules a microtask to be executed in the next
      // available microtask queue, which is typically more immediate and
      // precise than setTimeout().
      queueMicrotask(() => {
        this.elements.widget.value = this.data.value;
      });
    }

    reformatValueElement(selectedValueSlot, rep, val) {
      const selectedRepSpan = selectedValueSlot.querySelector(".u-valrep-representation");
      const selectedValSpan = selectedValueSlot.querySelector(".u-valrep-value");
      // If the previous selected option was placeholder, it will not have rep and value span,
      // hence create it. Also, down below remove the placeholder element.
      if (!selectedRepSpan) {
        this.reformatElement(selectedValueSlot, rep, val);
      } else {
        selectedRepSpan ? selectedRepSpan.innerHTML = rep : "";
        selectedValSpan ? selectedValSpan.innerHTML = val : "null";
      }

      let selectedPlaceholderSpan = selectedValueSlot.querySelector(".u-placeholder");
      if (selectedPlaceholderSpan) {
        selectedPlaceholderSpan.remove();
      }
    }

    updateValueElement() {
      const selectedValueSlot = this.elements.widget.querySelector('[slot="selected-value"]');
      const selectedOptionElement = this.elements.widget.options[this.elements.widget.selectedIndex];
      if (selectedOptionElement.style && selectedOptionElement.style.display === "none") {
        return;
      }
      selectedValueSlot.setAttribute("value", this.elements.widget.value);
      this.data.value = selectedValueSlot.getAttribute("value");
      const selectedRepSpan = selectedOptionElement.querySelector(".u-valrep-representation");
      const selectedValSpan = selectedOptionElement.querySelector(".u-valrep-value");
      this.reformatValueElement(selectedValueSlot, selectedRepSpan ? selectedRepSpan.innerHTML : "", selectedValSpan ? selectedValSpan.innerHTML : "");
      // Always call hideFormatError as we cannot select an invalid option.
      this.hideFormatError();
    }


    /**
     * Get representation from valrep.
     */
    getRepresentation(value, valrep) {
      if (valrep) {
        let obj = valrep.find(item => (item.value === value));
        if (obj) {
          return obj.representation;
        }
        return "";
      }
      return null;
    }

    /**
     * Custom shadow-root adoptedStyleSheet rules helpers.
     */
    stylingLabel() {
      this.CSSStyleSheet = new CSSStyleSheet();
      this.CSSStyleSheet.replaceSync(`
        .label {
          display: block;
          color: var(--neutral-foreground-rest);
          cursor: pointer;
          font-family: var(--body-font);
          font-size: var(--type-ramp-base-font-size);
          line-height: var(--type-ramp-base-line-height);
          font-weight: initial;
          font-variation-settings: var(--type-ramp-base-font-variations);
          margin-bottom: 4px;
        }

        :host([disabled]) .label {
          cursor: not-allowed;
          opacity: var(--disabled-opacity);
        }

        :host([readonly]) .label {
          cursor: not-allowed;
        }
      `);
      this.elements.widget.shadowRoot.adoptedStyleSheets = [...this.elements.widget.shadowRoot.adoptedStyleSheets, this.CSSStyleSheet];
    }

    stylingInitialize(element) {
      this.CSSStyleSheet = new CSSStyleSheet();
      this.CSSStyleSheet["u-component"] = "Listbox";
      element.shadowRoot.adoptedStyleSheets = [...element.shadowRoot.adoptedStyleSheets, this.CSSStyleSheet];
    }

    stylingSetRule(index, selector, id, value) {
      try {
        this.CSSStyleSheet.deleteRule(index);
      } catch (err) {
        // Explicitly ignoring all exceptions.
      }
      if (selector && id && value) {
        // Set rule to !important, so it will overrule any other (adopted) style sheets
        this.CSSStyleSheet.insertRule(`${selector} { ${id}: ${value} !important ; }`, index);
      }
    }


    /*
     Custom position of popup helpers

     Fluent defines the popup DOM as part of the shadow DOM of their web components.
     The popup is defined as position absolute to make it step out of the normal document flow.
     The intentions are good, however there is a limitation with this in HTML/CSS, being:
     An absolute positioned child element behaves like static when onf of its parent
     elements has overflow set to scroll.

     This is major flaw is Fluent popup designs and hopefully thy will fix it some day.
     However, fixed does not allow positioning related to a non-absolute position parent element.
     So these calculations have to be made using JS.
     The following code calculates the position of the popup element.

     How to use:
     In the onConnect, execute: this.popupInitialize();  // This initialize the popup style sheets
     In the onConnect, create event listener for all events that start the popup:
     Execute: this.popupPreCalc(".popup");  // This will render the popup without showing it just CSSStyleSheet
     Calculate the position and sizes of the popup
     Execute: this.popupPostCalc(".popup");  // This will apply the position and size definitions and unhide the popup.

     !Note that this mechanism works with style sheets and not directly on the popup element itself.
     This allows external style sheets to still influent behavior.
     */

    popupInitialize(popupElementSelector, element) {
      // Initialize shadow root style sheet for popup element.
      this.stylingInitialize(element);
      this.stylingSetRule(0, popupElementSelector, "position", "fixed");
      this.stylingSetRule(1, popupElementSelector, "visibility", "hidden");
      this.stylingSetRule(2, popupElementSelector, "display", "unset");
      this.stylingSetRule(3, popupElementSelector, "top", "unset");
      this.stylingSetRule(4, popupElementSelector, "bottom", "unset");
      this.stylingSetRule(5, popupElementSelector, "height", "unset");
      this.stylingSetRule(6, popupElementSelector, "left", "unset");
      this.stylingSetRule(7, popupElementSelector, "right", "unset");
      this.stylingSetRule(8, popupElementSelector, "width", "unset");
    }

    popupPreCalc(popupElementSelector, element) {
      // Find the index of our stylesheet which has custom "component" property Listbox.
      element.shadowRoot.adoptedStyleSheets.forEach((styleSheet, index) => {
        if (styleSheet["u-component"] === "Listbox") {
          // When there is a change in certain prop ex:appearance  the adoptedStyleSheets is newly created.
          // At this time when we try to access the style sheet created by us, its not accessible.
          // We need to reinitialize the style sheet at that index to make it accessible.
          element.shadowRoot.adoptedStyleSheets[index] = styleSheet;
          return;
        }
      });
      // Set display but keep hidden
      this.stylingSetRule(1, popupElementSelector, "visibility", "hidden");
      this.stylingSetRule(2, popupElementSelector, "display", "flex");
      // Reset the top and bottom position to calculate position properly.
      this.stylingSetRule(3, popupElementSelector, "top", "unset");
      this.stylingSetRule(4, popupElementSelector, "bottom", "unset");
    }

    popupPostCalc(popupElementSelector, popupElementRect) {

      // Apply popup position and size styles and unhide popup
      this.stylingSetRule(1, popupElementSelector, "visibility", "unset");
      this.stylingSetRule(2, ".ignore", "display", "unset");
      this.stylingSetRule(3, popupElementSelector, "top", (popupElementRect.top ? `${popupElementRect.top}px` : `unset`));
      this.stylingSetRule(4, popupElementSelector, "bottom", (popupElementRect.bottom ? `${popupElementRect.bottom}px` : `unset`));
      this.stylingSetRule(5, popupElementSelector, "height", (popupElementRect.height ? `${popupElementRect.height}px` : `unset`));
      this.stylingSetRule(6, popupElementSelector, "left", (popupElementRect.left ? `${popupElementRect.left}px` : `unset`));
      this.stylingSetRule(7, popupElementSelector, "right", (popupElementRect.right ? `${popupElementRect.right}px` : `unset`));
      this.stylingSetRule(8, popupElementSelector, "width", (popupElementRect.width ? `${popupElementRect.width}px` : `unset`));
    }

    popupGetRect(anchorElement, popupElement, position) {
      const EXTRA_MARGIN = 20;
      let anchor = anchorElement.getBoundingClientRect();
      let popup = popupElement.getBoundingClientRect();
      // console.log(popup);
      let rect = {};
      // Calculate vertical location
      if (position === "below" && popup.height < (window.innerHeight - anchor.bottom)) {
        // Requested below anchor and it fits
        rect.top = Math.round(anchor.bottom);
        rect.bottom = null;
        rect.height = null;
        // styles = styles + `top: calc(( ${popupTop} + ((var(--base-height-multiplier) + var(--density)) * var(--design-unit) + var(--design-unit) * 2)) * 1px) !important;`;
      } else if (position === "above" && popup.height < anchor.top) {
        // Requested above anchor and it fits
        rect.top = null;
        rect.bottom = Math.round(window.innerHeight - anchor.top);
        rect.height = null;
      } else if (popup.height < (window.innerHeight - anchor.bottom)) {
        // Fits below anchor regardless of what is requested
        rect.top = Math.round(anchor.bottom);
        rect.bottom = null;
        rect.height = null;
      } else if (popup.height < anchor.top) {
        // Fits above anchor regardless of what is requested
        rect.top = null;
        rect.bottom = Math.round(window.innerHeight - anchor.top);
        rect.height = null;
      } else if (popup.height < (window.innerHeight - EXTRA_MARGIN)) {
        // Fits the window
        rect.top = Math.round(popup.height / 2);
        rect.bottom = null;
        rect.height = null;
      } else {
        // Shrink to fit window
        rect.top = .5 * EXTRA_MARGIN;
        rect.bottom = .5 * EXTRA_MARGIN;
        rect.height = null;
      }
      if (anchor.width < window.innerWidth - EXTRA_MARGIN) {
        // popup fits
        rect.width = anchor.width;
      } else {
        rect.width = window.innerWidth - EXTRA_MARGIN;
      }
      if (anchor.left < 1) {
        rect.left = 1;
        rect.right = null;
      } else if (window.innerWidth < anchor.right) {
        rect.right = 1;
        rect.left = null;
      } else {
        rect.left = anchor.left;
        rect.right = null;
      }
      return rect;
    }
  }

  // Add the widget class to the UX namespace.
  if (typeof window.UX === "undefined" || window.UX === null) {
    window.UX = {};
  }
  UX.Select = Select;

  // Make the widget class known to the UNIFACE framework.
  UNIFACE.ClassRegistry.add("UX.Select", UX.Select);

}());
