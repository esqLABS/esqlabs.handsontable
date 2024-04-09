import React, { useState } from "react";
import { useRef } from "react";
import { HotTable, HotColumn } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";

function DemographicsTable(props) {
  // Data state
  const [dataR, updateDataR] = useState(props.data_scenarios);
  const col_names = Object.keys(dataR[0]);

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
      width="100%"
      height="100%"
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
      <HotColumn settings={{ data: col_names[1], type: "dropdown", source: props.species_options }} />
      <HotColumn settings={{ data: col_names[2], type: "dropdown", source: props.population_options }} />
      <HotColumn settings={{ data: col_names[3], type: "numeric" }} />
      <HotColumn settings={{ data: col_names[4], type: "numeric" }} />
      <HotColumn settings={{ data: col_names[5], type: "numeric" }} />
      <HotColumn settings={{ data: col_names[6], type: "numeric" }} />
      <HotColumn settings={{ data: col_names[7], type: "dropdown", source: props.weight_unit_options }} />
      <HotColumn settings={{ data: col_names[8], type: "numeric" }} />
      <HotColumn settings={{ data: col_names[9], type: "numeric" }} />
      <HotColumn settings={{ data: col_names[10], type: "dropdown", source: props.height_unit_options }} />
      <HotColumn settings={{ data: col_names[11], type: "numeric" }} />
      <HotColumn settings={{ data: col_names[12], type: "numeric" }} />
      <HotColumn settings={{ data: col_names[13], type: "numeric" }} />
      <HotColumn settings={{ data: col_names[14], type: "numeric" }} />
      <HotColumn settings={{ data: col_names[15], type: "dropdown", source: props.bmi_unit_options }} />
    </HotTable>
  );
}

export default DemographicsTable;
