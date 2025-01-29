// @ts-check

/**
 * Load fluentUI web components centrally in this JS file.
 *
 * Uncomment one of the following locations to import FluentUI from.
 * During the bundling process a local JS file needs to be used.
 */

// next line for local or bundling process
import "../fluentui/js/web-components.min.js";
// next line when using CDN location (latest version)
// import "https://unpkg.com/@fluentui/web-components";
// next line when using CDN location (fixed to version 2.6.1)
// import "https://unpkg.com/@fluentui/web-components@2.6.1/dist/web-components.min.js";

import { registerWidgetClass } from "./dsp_connector.js";


// The UX field level widgets to include
import {Button} from "./button.js";
registerWidgetClass("UX.Button", Button);

import {Checkbox} from "./checkbox.js";
registerWidgetClass("UX.Checkbox", Checkbox);

import {NumberField} from "./number_field.js";
registerWidgetClass("UX.NumberField", NumberField);

import {PlainText} from "./plain_text.js";
registerWidgetClass("UX.PlainText", PlainText);

import {RadioGroup} from "./radio_group.js";
registerWidgetClass("UX.RadioGroup", RadioGroup);

import {Select} from "./select.js";
registerWidgetClass("UX.Select", Select);

import {Switch} from "./switch.js";
registerWidgetClass("UX.Switch", Switch);

import {TextArea} from "./text_area.js";
registerWidgetClass("UX.TextArea", TextArea);

import {TextField} from "./text_field.js";
registerWidgetClass("UX.TextField", TextField);


// The UX entity level widgets to include
import {DataGridCollection, DataGridOccurrence} from "./data_grid.js";
registerWidgetClass("UX.DataGridCollection", DataGridCollection);
registerWidgetClass("UX.DataGridOccurrence", DataGridOccurrence);



/**
 * Uncomment the following code and/or add your own variable to
 * a specific widget-class definition.
 * This allows you to check:
 * - the registered default values
 * - the registered setters
 * - the registered getters
 * - the registered trigger mappings
 * - the registered sub-widgets
 * - the registered sub-widget-workers
 */
// UX.MyDataGrid = getClassRegistry().get("UX.DataGridCollection");
// UX.MyButton = getClassRegistry().get("UX.Button");
