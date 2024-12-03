// A rudimentary utility that can convert a data object (as a dataUpdate() parameter)
// to a wrapper object, similar to the parameter of processLayout, and vice versa.
export let dataConversionUtil = function () {

  function flatToNested(flat) {
    const result = {};
    for (const key in flat.properties) {
      const value = flat.properties[key];
      const key_parts = key.split(':');
      if (key_parts.length === 1) {
        // only if the property key does not have any colon,
        // we assume it is a "uniface:" property.
        if (!result.uniface) {
          result.uniface = {};
        }
        result.uniface[key] = value;
      } else if (key_parts.length == 2 && key_parts[0] === "class") {
        if (!result.classes) {
          result.classes = {};
        }
        result.classes[key_parts[1]] = value;
      } else {
        let sub_obj = result;
        for (let i = 0; i < key_parts.length; i++) {
          const part_key = key_parts[i];
          if (!sub_obj[part_key]) {
            sub_obj[part_key] = {};
          }
          if (i === key_parts.length - 1) {
            sub_obj[part_key] = value;
          } else {
            sub_obj = sub_obj[part_key];
          }
        }
      }
    }
    if (flat.value !== undefined) {
      result.value = flat.value;
    }
    if (flat.valrep !== undefined) {
      result.valrep = flat.valrep;
    }
    return result;
  }

  function flattenProps(obj, prefix) {
    let data = {};
    let separate = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const newKey = prefix ? `${prefix}:${key}` : key;

        if (key === "value" || key === "valrep") {
          if (prefix !== undefined) {
            throw new Error(`Inner level ${newKey} property not (or not yet) supported`);
          }
          separate[key] = value;
        } else if (key == "classes") {
          for (const cls in value) {
            data[`class:${cls}`] = value[cls];
          }
        } else if (typeof value === "object") {
          if (key === "uniface") {
            let props = flattenProps(value).data;
            data = { ...data,
                     ...props };
          } else {
            let props = {};
            let flattenedProps = flattenProps(value, newKey).data;
            for (const n in flattenedProps) {
              props[`${newKey}:${n}`] = flattenedProps[n];
            }
            data = { ...data,
                     ...props };
          }
        } else {
          data[key] = value;
        }
      }
    }
    let result = {};
    result.data = data;
    if (!prefix && Object.keys(separate).length > 0) {
      result.separate = separate;
    }
    return result;
  }

  function nestedToWrapper(obj) {
    let result = flattenProps(obj);
    // Return a wrapper around the flat object.
    // Add a toString() function as a debugging aid.
    return {
      "getPropertyNames": function () {
        return Object.keys(result.data);
      },
      "getProperty": function (propertyName) {
        return result.data[propertyName];
      },
      "getValue": function () {
        return result.separate?.value;
      },
      "getValRep": function () {
        return result.separate?.valrep;
      },
      "toString": function () {
        let s = "";
        if (this.getPropertyNames().length > 0) {
          let propsString = "";
          for (let i = 0; i < this.getPropertyNames().length; i++) {
            let prop = this.getPropertyNames()[i];
            propsString = `${propsString}    "${prop}": ${this.getProperty(prop)}\n`;
          }
          s = `  properties: {\n${propsString}  }\n`;
        }
        if (this.getValue()) {
          s = `${s}  value: ${this.getValue()}\n`;
        }
        if (this.getValRep()) {
          let valrepString = "";
          let valrep = this.getValRep();
          for (let i = 0; i < valrep.length; i++) {
            valrepString = `${valrepString}    ${valrep[i].value} = ${valrep[i].representation}\n`;
          }
          s = `${s}  valrep: {\n${valrepString}  }\n`;
        }
        return `{\n${s}\n}`;
      },
      "toObject": function () {
        let flat = {};
        if (this.getPropertyNames().length > 0) {
          flat.properties = {};
          for (let i = 0; i < this.getPropertyNames().length; i++) {
            let prop = this.getPropertyNames()[i];
            flat.properties[prop] = this.getProperty(prop);
          }
        }
        if (this.getValue()) {
          flat.value = this.getValue();
        }
        if (this.getValRep()) {
          flat.valrep = this.getValRep();
        }
        return flat;
      }

    };
  }

  function nestedToWrapperToFlat(obj) {
    let wrapper = nestedToWrapper(obj);
    let flatData = wrapper.toObject();
    return flatData;
  }

  // The actual utility functions:
  return {
    "toFlat": nestedToWrapperToFlat,
    "toNested": flatToNested
  };
}();

// Sample data object.
let data1 = {
  "html": {
    "minlength": "1",
    "maxlength": "100",
    "required": "true"
  },
  "uniface": {
    "autoindent": "true",
    "column-width": 28
  },
  "style": {
    "visibility": "hidden",
    "readonly": "false",
    "color": "red"
  },
  "value": "17",
  "valrep": [
    { "value": "1",
      "representation": "One" },
    { "value": "2",
      "representation": "Two" },
    { "value": "3",
      "representation": "Three" }
  ],
  "classes": {
    "class_ON": "true",
    "class_OFF": "false"
  }
};

let data2 = {
  "value": "10"
};

let data3 = {
  "value": 10,
  "uniface": {
    "plain": "abc",
    "sub:uniface:deep": "def",
    "sub2:deep2": "ghi",
    "sub3": {
      "deep3a": "jkl1",
      "deep3b": "jkl2",
      "uniface": {
        "deep3c": "jkl3",
        "deep3d": "jkl4"
      }
    },
    "sub4": {
      "uniface": {
        "deep4a": "nmo1",
        "deep4b": "nmo2"
      }
    }
  }
};

// Create a flattened object and log it to the console.
let flatData1 = dataConversionUtil.toFlat(data1);
console.log("Here the is flattened data1:");
console.log(JSON.stringify(flatData1, null, 2));
let flatData2 = dataConversionUtil.toFlat(data2);
console.log("Here the is flattened data2:");
console.log(JSON.stringify(flatData2, null, 2));
let flatData3 = dataConversionUtil.toFlat(data3);
console.log("Here the is flattened data3:");
console.log(JSON.stringify(flatData3, null, 2));

// Recreate the data object from the flattened and log it to the console.
let roundtrippedData3 = dataConversionUtil.toNested(flatData3);
console.log("Here is the sort-of recreated original data3:");
console.log(JSON.stringify(roundtrippedData3, null, 2));