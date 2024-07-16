/* global UNIFACE uniface UX */
(function () {
  ("use strict");

  // Keep the track of static properties.
  const staticProperties = new Set(["controls-start", "controls-center", "controls-end", "widget-class", "overflow-behavior", "overflow-index"]);
  // Define controlIds;
  let controlIds;

  // Widget class for uxToolbar widget - wrapper class for Fluent Toolbar web component.
  class Toolbar extends UX.Base {
    static processLayout(skeletonWidgetElement, definition) {
      UX.Base.staticLog("processLayout", skeletonWidgetElement);

      let widgetElement;
      controlIds = new Set();
      if (skeletonWidgetElement.tagName.toLowerCase() === "fluent-toolbar") {
        // The layout already provides a "fluent-toolbar" element.
        // Simply return that as the element to be used as widgetElement.
        widgetElement = skeletonWidgetElement;
      } else {
        // The widgetElement will be a copy of the skeletonWidgetElement,
        // excluding its child elements and its attributes,
        // and with tagName set to "fluent-toolbar".
        widgetElement = UX.Base.cloneElement(skeletonWidgetElement, "fluent-toolbar", false, false);
      }

      // Add placeholder for the label.
      widgetElement.innerHTML += `
        <span class="u-label-text" hidden slot="label"></span>
      `;

      // Process and store all the id of the controls. This will be used in the construction of toolbar based on
      // the order of the ids defined. This will also be used in onConnect(), dataInit(), dataUpdate(),
      // dataCleanup(), blockUI() and unblockUI().
      UX.Toolbar.processControlIds(definition.properties);

      if (controlIds.size) {
        // Get all the controls.
        const controls = UX.Toolbar.getControlsWithGroupedProps(definition.properties);
        // Add the controls to the widgetElement.
        UX.Toolbar.addControlsToWidgetElement(controls, widgetElement, definition.properties);
      }

      return widgetElement;
    }

    constructor() {
      super();
      this.widget = {};
      this.widget.id = Math.random();
      this.log("constructor", this.widget);

      // Define default properties for fluent-toolbar.
      // This widget uses those:
      //  * In dataInit() to put the widget in a defined initial state.
      //  * In dataUpdate() when resetting any of these properties.
      if (Toolbar.defaultProperties === undefined) {
        Toolbar.defaultProperties = {
          "html": {
            "aria-orientation": "horizontal",
            "orientation": "horizontal",
            "role": "toolbar",
          },
          "classes": {
            "u-toolbar": true, // Default uniface class for widget element.
          },
          "uniface": {
            "label-text": "",
          },
        };
      }
    }

    onConnect(widgetElement) {
      this.log("onConnect", widgetElement.id);
      this.elements = {};
      this.elements.widget = widgetElement;

      // Reference to internal element label.
      this.elements.labelText = this.elements.widget.querySelector(".u-label-text");

      let startContainer = this.elements.widget.shadowRoot.querySelector("[part='start']");
      let defaultSlot = this.elements.widget.shadowRoot.querySelector(".positioning-region > :not([part='start']):not([part='end'])");
      let endContainer = this.elements.widget.shadowRoot.querySelector("[part='end']");

      // Add a span container to the default slot, so that proper CSS styling can be done.
      let defaultContainer = document.createElement("span");
      defaultContainer.append(defaultSlot);
      startContainer.insertAdjacentElement("afterend", defaultContainer);

      // Add references to control elements.
      [startContainer, defaultContainer, endContainer].forEach((container) => {
        this.addControlReference(container.querySelector("slot"));
      });

      // Iterate through the controlIds,
      // create an object and invoke onConnect() of control's widget class.
      controlIds.forEach((controlId) => {
        if (this[controlId]) {
          const controlEl = this[controlId]["element"];
          let widgetClass = UNIFACE.ClassRegistry.get(controlEl.getAttribute("widget-class"));
          this[controlId]["widget"] = new widgetClass();
          this[controlId]["widget"].onConnect(controlEl);
        }
      });

      // Adding toolbar styles as constructed stylesheet.
      this.stylingToolbar();
    }

    mapTrigger(triggerName) {
      this.log("mapTrigger", triggerName);
    }

    dataInit() {
      this.data = {};
      this.data.id = Math.random();
      this.log("dataInit", this.data);

      // Put this widget in a defined initial state.
      this.setHtmlProperties(Toolbar.defaultProperties.html, this.elements.widget);
      this.setClassProperties(Toolbar.defaultProperties.classes, this.elements.widget);

      // Call invokeControlFunction() to invoke dataInit() of control's widget class.
      this.invokeControlFunction("dataInit");
    }

    dataUpdate(data) {
      this.log("dataUpdate", data);

      // Set html properties.
      if (data.html) {
        this.setHtmlProperties(data.html, this.elements.widget, Toolbar.defaultProperties.html);
      }

      // Set style properties.
      if (data.style) {
        this.setStyleProperties(data.style, this.elements.widget);
      }

      // Add or remove class names.
      if (data.classes) {
        this.setClassProperties(data.classes, this.elements.widget, Toolbar.defaultProperties.classes);
      }

      // Add uniface properties.
      if (data.uniface) {
        // Set label-text if it is defined.
        if (data.uniface["label-text"]) {
          const uPropertyValue = data.uniface["label-text"] === uniface.RESET ? Toolbar.defaultProperties.uniface["label-text"] : data.uniface["label-text"];
          UX.Base.setSlotContent(this.elements.labelText, uPropertyValue, undefined, "label");
        }

        if (controlIds.size) {
          // Get all the controls.
          const controls = UX.Toolbar.getControlsWithGroupedProps(data.uniface);

          // Call invokeControlFunction() to invoke dataUpdate() of control's widget class.
          this.invokeControlFunction("dataUpdate", controls);
        }
      }

      // "value" and "valrep" are not applicable for the Toolbar widget.
      // Therefore, this widget class will not react to "value" and "valrep" changes.
    }

    dataCleanup(dataNames) {
      this.log("dataCleanup", dataNames);

      if (dataNames && Object.keys(dataNames).length > 0) {
        // Reset html properties.
        if (dataNames.hasOwnProperty("html") && dataNames.html.size > 0) {
          this.resetHtmlProperties(dataNames.html, this.elements.widget, Toolbar.defaultProperties.html);
        }

        // Reset style properties.
        if (dataNames.hasOwnProperty("style") && dataNames.style.size > 0) {
          this.resetStyleProperties(dataNames.style, this.elements.widget);
        }

        // Reset all Uniface property-related items.
        if (dataNames.hasOwnProperty("uniface")) {
          if (controlIds.size) {
            // Get all the controls.
            const controls = UX.Toolbar.getControlsWithGroupedProps(dataNames.uniface);

            // Call invokeControlFunction() to invoke dataCleanup() of control's widget class.
            this.invokeControlFunction("dataCleanup", controls);
          }

          // Reset label-text.
          if (dataNames.uniface.has("label-text")) {
            UX.Base.setSlotContent(this.elements.labelText);
          }
        }

        // Reset classes properties.
        this.resetClassProperties(this.elements.widget);
      }
    }

    getValue() {
      this.log("getValue");
    }

    validate() {
      this.log("validate");
    }

    showError(errorMessage) {
      this.log("showError", errorMessage);
    }

    hideError() {
      this.log("hideError");
    }

    blockUI() {
      this.log("blockUI");
      // Call invokeControlFunction() to invoke blockUI() of control's widget class.
      this.invokeControlFunction("blockUI");
    }

    unblockUI() {
      this.log("unblockUI");
      // Call invokeControlFunction() to invoke unblockUI() of control's widget class.
      this.invokeControlFunction("unblockUI");
    }

    stylingToolbar() {
      this.CSSStyleSheet = new CSSStyleSheet();
      this.CSSStyleSheet.replaceSync(`
        :host {
          font-family: var(--body-font);
          font-size: var(--type-ramp-base-font-size);
          line-height: var(--type-ramp-base-line-height);
          font-weight: initial;
          font-variation-settings: var(--type-ramp-base-font-variations);
        }

        ::slotted(:not([slot])) {
          margin: unset;
        }

        .positioning-region > span:not(.start):not(.end) {
          display: flex;
          align-items: center;
          column-gap: calc(var(--toolbar-item-gap) * 2);
        }
      `);
      this.elements.widget.shadowRoot.adoptedStyleSheets = [...this.elements.widget.shadowRoot.adoptedStyleSheets, this.CSSStyleSheet];
    }

    addControlReference(slotEl) {
      for (let child of slotEl.assignedElements()) {
        // Add reference to the children of the slot element based on the id.
        this[`${child.id}`] = {};
        this[`${child.id}`]["element"] = child;
      }
    }

    invokeControlFunction(functionName, controls) {
      if (controls) {
        // If the controls object is defined (in the case when the functionName is dataUpdate or dataCleanup), 
        // iterate through each control in the controls object(instead of controlIds).
        // This optimization ensures that we only iterate through controls for which the properties have been changed.
        for (const key in controls) {
          // Extract widget properties and cleanup properties for the current control.
          const widgetProperties = controls[key]["widget-properties"];
          const widgetCleanupProperties = controls[key]["widget-cleanup-properties"];

          // Check if either widget properties or cleanup properties exist for the control.
          if (Object.keys(widgetProperties).length || Object.keys(widgetCleanupProperties).length) {
            const control = this[key]["widget"];
            // Determine which properties to use based on which one has properties.
            const properties = Object.keys(widgetProperties).length ? widgetProperties : widgetCleanupProperties;
            // Call the specified function on the control with the selected properties.
            control[functionName].call(control, properties);
          }
        }
      } else {
        // If controls object is undefined (in the case when the functionName is dataInit, blockUI or unblockUI), iterate through controlIds.
        controlIds.forEach((controlId) => {
          if (this[controlId]) {
            let control = this[controlId]["widget"];
            // Call the specified function on the control without any properties.
            control[functionName].call(control);
          }
        });
      }
    }

    static processControlIds(props) {
      ["controls-start", "controls-center", "controls-end"].forEach((prop) => {
        // Check if the property exists and is non-empty.
        if (props[prop]) {
          // Split the property value by "" and filter out empty strings.
          props[prop]
            .split("")
            .filter((controlId) => controlId !== "")
            .forEach((controlId) => {
              // Add each controlID to the controlIds set.
              controlIds.add(controlId);
            });
        }
      });
    }

    static getControlsWithGroupedProps(props) {
      // Initialize an empty object to store the controls.
      const controls = {};
      // Check if props is an instance of Set.
      if (props instanceof Set) {
        // If props is a Set, iterate through each key in props.
        for (const key of props) {
          // Call processControlProps() to process each key and update the controls object.
          UX.Toolbar.processControlProps(controls, key, props[key], true);
        }
      } else {
        // If props is not a Set, iterate through each key-value pair in props.
        for (const key in props) {
          // Call processControlProps() to process each key-value pair and update the controls object.
          UX.Toolbar.processControlProps(controls, key, props[key]);
        }
      }
      // Return the final controls object.
      return controls;
    }

    static processControlProps(controls, propKey, propValue, isInstanceOfSet = false) {
      // Split the propKey into main key and subkeys.
      let [mainKey, ...subKeys] = propKey.split(":");

      if (controlIds.has(mainKey)) {
        // If the main key is present in the list of controlIds:
        // - Ensure that the controls object has a property with the main key.
        // - If it doesn't exist, initialize it as an empty object.
        controls[mainKey] = controls[mainKey] || {};

        if (subKeys.length) {
          // Ensure the widget-properties and widget-cleanup-properties objects exist.
          controls[mainKey]["widget-properties"] = controls[mainKey]["widget-properties"] || {};
          controls[mainKey]["widget-cleanup-properties"] = controls[mainKey]["widget-cleanup-properties"] || {};

          if (subKeys.length > 1) {
            // If there are multiple subkeys:
            // Normalize the class key if necessary.
            subKeys[0] = subKeys[0] === "class" ? "classes" : subKeys[0];

            if (isInstanceOfSet) {
              // If the collection is a Set (in case of dataCleanup):
              // - Ensure that the property exists in "widget-cleanup-properties".
              // - If it doesn't exist, create a new Set.
              // - Add the value (subKeys[1]) to the Set.
              controls[mainKey]["widget-cleanup-properties"][subKeys[0]] = controls[mainKey]["widget-cleanup-properties"][subKeys[0]] || new Set();
              controls[mainKey]["widget-cleanup-properties"][subKeys[0]].add(subKeys[1]);
            } else {
              // If the collection is not a Set:
              // - Ensure that the property exists in "widget-properties".
              // - If it doesn't exist, create a new object.
              // - Assign the value (propValue) to the property.
              controls[mainKey]["widget-properties"][subKeys[0]] = controls[mainKey]["widget-properties"][subKeys[0]] || {};
              controls[mainKey]["widget-properties"][subKeys[0]][subKeys[1]] = propValue;
            }
          } else if (isInstanceOfSet) {
            // If the collection is a Set:
            // - Ensure that the subkey is not a static property.
            // - If it's not a static property:
            //   - If it's a "value" property, assign an empty string.
            //   - If it's a "valrep" property, assign an empty string.
            //   - For other cases, add the subkey to the "uniface" set in "widget-cleanup-properties".
            if (!staticProperties.has(subKeys[0])) {
              if (subKeys[0] === "value") {
                controls[mainKey]["widget-cleanup-properties"][subKeys[0]] = "";
              } else if (subKeys[0] === "valrep") {
                controls[mainKey]["widget-cleanup-properties"][subKeys[0]] = "";
              } else {
                controls[mainKey]["widget-cleanup-properties"]["uniface"] = controls[mainKey]["widget-cleanup-properties"]["uniface"] || new Set();
                controls[mainKey]["widget-cleanup-properties"]["uniface"].add(subKeys[0]);
              }
            }
          } else if (staticProperties.has(subKeys[0])) {
            // If the subkey is a static property, assign its value directly to the controls object.
            controls[mainKey][subKeys[0]] = propValue;
          } else if (subKeys[0] === "value") {
            // If it's a "value" property, assign value directly under "widget-properties".
            controls[mainKey]["widget-properties"][subKeys[0]] = propValue;
          } else if (subKeys[0] === "valrep") {
            // If it's a "valrep" property, invoke getFormattedValrep() to format the value correctly.
            controls[mainKey]["widget-properties"][subKeys[0]] = UX.Toolbar.getFormattedValrep(propValue);
          } else {
            // For other cases, assign values under the "uniface" key in "widget-properties".
            controls[mainKey]["widget-properties"]["uniface"] = controls[mainKey]["widget-properties"]["uniface"] || {};
            controls[mainKey]["widget-properties"]["uniface"][subKeys[0]] = propValue;
          }
        }
      }
    }

    static addControlsToWidgetElement(controls, widgetElement, properties) {
      controlIds.forEach((controlId) => {
        // Get the control.
        const control = controls[controlId];
        if (control) {
          // If the control is defined, get the slot of the control, create a placeholder and
          // invoke addControlToWidgetElement() of UX.Toolbar with appropriate parameters.
          let slot =
            properties["controls-start"] && properties["controls-start"].includes(controlId)
              ? "start"
              : properties["controls-center"] && properties["controls-center"].includes(controlId)
              ? ""
              : "end";
          let placeholder = document.createElement("span");
          UX.Toolbar.addControlToWidgetElement({ ...control, slot: slot, id: controlId }, widgetElement, placeholder);
        }
      });
    }

    static addControlToWidgetElement(control, widgetElement, placeholder) {
      // Get the widget class of the control from uniface class registry.
      let controlWidgetClass = UNIFACE.ClassRegistry.get(control["widget-class"]);
      // Invoke the processLayout() of control's widget class to get the control widget element.
      let controlWidgetElement = UX[controlWidgetClass.name].processLayout(placeholder);
      // Iterate through properties of control and set those properties(excluding widget-properties & widget-cleanup-properties) as html attributes/properties
      // on the control widget element.
      for (const key in control) {
        if (key !== "widget-properties" && key !== "widget-cleanup-properties") {
          controlWidgetElement.setAttribute(key, control[key]);
        }
      }
      // Add the control widget element to the toolbar widget element.
      widgetElement.append(controlWidgetElement);
    }
  }

  // Add the widget class to the UX namespace.
  if (typeof window.UX === "undefined" || window.UX === null) {
    window.UX = {};
  }
  UX.Toolbar = Toolbar;

  // Make the widget class known to the UNIFACE framework.
  UNIFACE.ClassRegistry.add("UX.Toolbar", UX.Toolbar);
})();
