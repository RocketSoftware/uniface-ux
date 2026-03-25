// @ts-check

// registerWidgetClass is used to register UX Widgets to Uniface.
// The same name needs to be used in the web.ini configuration.
import {registerWidgetClass} from "./framework/common/dsp_connector.js";

// Import web components
import "../web_components/index.js";


// The UX field level widgets to include
import {Button} from "./button/button.js";
registerWidgetClass("UX.Button", Button);

import {Checkbox} from "./checkbox/checkbox.js";
registerWidgetClass("UX.Checkbox", Checkbox);

import {Listbox} from "./listbox/listbox.js";
registerWidgetClass("UX.Listbox", Listbox);

import {NumberField} from "./number_field/number_field.js";
registerWidgetClass("UX.NumberField", NumberField);

import {PlainText} from "./plain_text/plain_text.js";
registerWidgetClass("UX.PlainText", PlainText);

import {RadioGroup} from "./radio_group/radio_group.js";
registerWidgetClass("UX.RadioGroup", RadioGroup);

import {Select} from "./select/select.js";
registerWidgetClass("UX.Select", Select);

import {Switch} from "./switch/switch.js";
registerWidgetClass("UX.Switch", Switch);

import {TextArea} from "./text_area/text_area.js";
registerWidgetClass("UX.TextArea", TextArea);

import {TextField} from "./text_field/text_field.js";
registerWidgetClass("UX.TextField", TextField);


// The UX entity level widgets to include
import {DataGridCollection, DataGridOccurrence} from "./data_grid/data_grid.js";
registerWidgetClass("UX.DataGridCollection", DataGridCollection);
registerWidgetClass("UX.DataGridOccurrence", DataGridOccurrence);

import {CollectionLayout, OccurrenceLayout} from "./ent_layout/ent_layout.js";
registerWidgetClass("UX.CollectionLayout", CollectionLayout);
registerWidgetClass("UX.OccurrenceLayout", OccurrenceLayout);

// The UX component level widgets to include
import {CompLayout} from "./comp_layout/comp_layout.js";
registerWidgetClass("UX.CompLayout", CompLayout);
import {HeaderFooter} from "./header_footer/header_footer.js";
registerWidgetClass("UX.HeaderFooter", HeaderFooter);

