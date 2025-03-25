import React, { useState } from "react";
import { useRef } from "react";
import { HotTable, HotColumn } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";
// Utils
import { forceCutRowContent } from "../utils/handsOnTableUtils";

function DataCombinedTable(props) {
  // Data state
  const [dataR, updateDataR] = useState(props.data_scenarios);
  const col_names = Object.keys(dataR[0]);
  // Constants
  const DROPDOWN_TYPE_COLUMNS = [col_names[1], col_names[3], col_names[4]];

  console.log(col_names);

  const updateNoneSelectionValue = (dataR, changes, source) => {
    if (source === 'edit') {
        // changes: Array [[<row_number>, <column_name>, <old_value>, <new_value>]]
        if(DROPDOWN_TYPE_COLUMNS.includes(changes[0][1]) && changes[0][3] === "--NONE--") {
          dataR[changes[0][0]][changes[0][1]] = null;
        }
    }
  }

  const onBeforeHotChange = (changes, source) => {
    if (changes === undefined) return;
    if (changes === null) return;
    if (!changes.length) return;
    if (dataR[changes[0][0]][changes[0][1]] === changes[0][3]) {
        // console.log("no change");
        return;
    } else {
        setTimeout(() => {
            updateNoneSelectionValue(dataR, changes, source);
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
      width="100%"
      height="100%"
      licenseKey="non-commercial-and-evaluation"
      contextMenu={{
        items: {
          'cut': {
            name: 'Clear'
          },
          'row_below': {},
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
      <HotColumn
        settings={{
          data: col_names[1],
          type: "dropdown",
          source: ["--NONE--", ...props.datatype_options]
        }}
      />
      <HotColumn settings={{ data: col_names[2], type: "text" }} />
      <HotColumn
        settings={{
          data: col_names[3],
          type: "dropdown",
          source: ["--NONE--", ...props.scenario_options]
        }}
      />
      <HotColumn
        settings={{
          data: col_names[4],
          type: "dropdown",
          source: ["--NONE--", ...props.path_options]
        }}
      />
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
