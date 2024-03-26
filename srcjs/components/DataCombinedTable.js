import React, { useState } from "react";
import { useRef } from "react";
import { HotTable, HotColumn } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";

function DataCombinedTable(props) {
  // Data state
  const [dataR, updateDataR] = useState(props.data_scenarios);
  const col_names = Object.keys(dataR[0]);
  console.log(col_names);

  const onBeforeHotChange = (changes) => {
    if (changes === undefined) return;
    if (changes === null) return;
    if (!changes.length) return;
    if (dataR[changes[0][0]][changes[0][1]] === changes[0][3]) {
        // console.log("no change");
        return;
    } else {
        setTimeout(() => {
            // console.log(prepareShinyData(dataR));
            // Send data to Shiny with the edited data
            Shiny.setInputValue(`${props.shiny_el_id_name}_edited`, JSON.stringify(dataR), {priority: "event"});
        }, 500)
    }
  };

  return (
    <HotTable
      data={dataR}
      colHeaders={col_names}
      rowHeaders={true}
      autoWrapRow={true}
      autoWrapCol={true}
      licenseKey="non-commercial-and-evaluation"
      contextMenu={{
        items: {
          'row_below': {},
          'remove_row': {
            disabled() {
            // Disable option when first row was clicked
            return this.getSelectedLast()[0] === 0; // `this` === hot
            }
          }
        }
      }}
      beforeChange={onBeforeHotChange}
      afterRemoveRow={(index, amount, physicalRows) => {
        // Send data to Shiny with the edited data
        Shiny.setInputValue(`${props.shiny_el_id_name}_edited`, JSON.stringify(dataR), {priority: "event"});
      }}
      afterCreateRow={(index, amount) => {
        // Send data to Shiny with the edited data
        Shiny.setInputValue(`${props.shiny_el_id_name}_edited`, JSON.stringify(dataR), {priority: "event"});
      }}
    >
      <HotColumn settings={{ data: col_names[0], type: "text" }} />
      <HotColumn settings={{ data: col_names[1], type: "dropdown", source: props.datatype_options }} />
      <HotColumn settings={{ data: col_names[2], type: "text" }} />
      <HotColumn settings={{ data: col_names[3], type: "dropdown", source: props.scenario_options }} />
      <HotColumn settings={{ data: col_names[4], type: "dropdown", source: props.path_options }} />
      <HotColumn settings={{ data: col_names[5], type: "text" }} />
      <HotColumn settings={{ data: col_names[6], type: "text" }} />
      <HotColumn settings={{ data: col_names[7], type: "numeric" }} />
      <HotColumn settings={{ data: col_names[8], type: "text" }} />
      <HotColumn settings={{ data: col_names[9], type: "numeric" }} />
      <HotColumn settings={{ data: col_names[10], type: "text" }} />
      <HotColumn settings={{ data: col_names[11], type: "numeric" }} />
      <HotColumn settings={{ data: col_names[12], type: "numeric" }} />
    </HotTable>
  );
}

export default DataCombinedTable;
