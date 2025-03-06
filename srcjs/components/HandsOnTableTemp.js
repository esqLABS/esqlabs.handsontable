import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { HotTable, HotColumn } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";
// Utils
import { forceCutRowContent } from "../utils/handsOnTableUtils";


function HandsOnTableTemp(props) {
  // console.log(props.data_scenarios);
  // console.log("col_names Temp Table", props.column_headers);

  // Data state
  // const [dataR, updateDataR] = useState(props.data_scenarios);
  const [dataR, updateDataR] = useState(!props.data_scenarios.length ? [Object.fromEntries(props.column_headers.map(key => [key, null]))] : props.data_scenarios);
  // const col_names = Object.keys(dataR[0]);
  const col_names = props.column_headers;

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
      columns={!dataR.length ? col_names : false}
      rowHeaders={true}
      autoWrapRow={true}
      autoWrapCol={true}
      width="100%"
      height="100%"
      licenseKey="non-commercial-and-evaluation"
      contextMenu={{
        items: {
          'cut': {
            name: 'Clear'
          },
          'row_below': {
            disabled: false
          },
          'row_above': {},
          'remove_row': {
                name() {
                  // If only one row exists and the first one selected
                  if (this.countRows() === 1 && this.getSelectedLast()[0] === 0) {
                    return "Clear row content"
                  } else {
                    return "Remove row";
                  }
                },
                callback(key, selection, clickEvent) {
                  const selectedRow = this.getSelectedLast()[0];

                  if(this.countRows() === 1 && selectedRow === 0) {
                    // Cut all elements of the first row
                      forceCutRowContent(this, selectedRow);
                  } else {
                    // Perform remove row operation
                    // Use Handsontable's built-in remove_row functionality for multiple selections
                    const startRow = selection[0].start.row;
                    const endRow = selection[0].end.row;
                    let numberOfRowsToRemove = endRow - startRow + 1;

                    if(this.countRows() === numberOfRowsToRemove) {
                      numberOfRowsToRemove = numberOfRowsToRemove - 1
                    }

                    this.alter("remove_row", startRow, numberOfRowsToRemove);

                    }
                }
            }
        }
      }}
      beforeChange={onBeforeHotChange}
      afterCreateRow={(index, amount) => {
        // Send data to Shiny with the edited data
        if(!Object.keys(dataR[0]).length) {
          let empty_obj_with_keys = [Object.fromEntries(col_names.map(key => [key, null]))];
          // updateDataR(empty_obj_with_keys);
          // props.updateGlobalDataR(empty_obj_with_keys);
          // console.log("dataR", empty_obj_with_keys);
          Shiny.setInputValue(`${props.shiny_el_id_name}_edited`, JSON.stringify(empty_obj_with_keys), {priority: "event"});
          // props.updateGlobalDataR(empty_obj_with_keys);
          updateDataR(empty_obj_with_keys);
        } else {
          // console.log("dataR", dataR);
          Shiny.setInputValue(`${props.shiny_el_id_name}_edited`, JSON.stringify(dataR), {priority: "event"});
        }
      }}
      afterRemoveRow={(index, amount, physicalRows) => {
        // Send data to Shiny with the edited data
        Shiny.setInputValue(`${props.shiny_el_id_name}_edited`, JSON.stringify(dataR), {priority: "event"});
      }}
    />
  );
}

export default HandsOnTableTemp;
