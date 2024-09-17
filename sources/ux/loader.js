// @ts-check

/**
 * Load fluentUI web components centrally in this JS file.
 * 
 * Uncomment one of the following locations to import FluentUI from.
 * During bundling process we need a local JS file.
 */

// next line for local or bundling process
// import "../fluentui/js/web-components.min.js";
// next line when using CDN location (latest version)
// import "https://unpkg.com/@fluentui/web-components";
// next line when using CDN location (fixed to version 2.6.1)
import "https://unpkg.com/@fluentui/web-components@2.6.1/dist/web-components.min.js";

// The UX field level widgets to include
import "./button.js";
import "./checkbox.js";
import "./number_field.js";
import "./plain_text.js";
import "./radio_group.js";
import "./select.js";
import "./switch.js";
import "./text_area.js";
import "./text_field.js";

// The UX entity level widgets to include
import "./data_grid.js";

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
// UX.MyDataGrid = UNIFACE.ClassRegistry.get("UX.DataGridCollection");
// UX.MyButton = UNIFACE.ClassRegistry.get("UX.Button");
