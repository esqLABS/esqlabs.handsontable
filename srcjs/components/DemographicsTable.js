import React, { useState, useEffect, useRef } from "react";
import { HotTable, HotColumn } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import { dropdownRenderer } from "handsontable/renderers";
import "handsontable/dist/handsontable.full.min.css";
// Import Custom Renderer
import { readOnlyStyleRenderer } from "./TableRenderer/TableRenderer";
// Utils
import { forceCutRowContent } from "../utils/handsOnTableUtils";


function DemographicsTable(props) {
  // Data state
  const [dataR, updateDataR] = useState(props.data_scenarios);
  const col_names = Object.keys(dataR[0]);
    // Constants
  const DROPDOWN_TYPE_COLUMNS = [col_names[1], col_names[2], col_names[7], col_names[10], col_names[15]];
  const hotTableComponentRef = useRef(null);

  useEffect(() => {
    const hot = hotTableComponentRef.current.hotInstance;

    hot.updateSettings({
      cells(row, col) {
        const cellProperties = {};

        // Check if the column is "population"
        if (col === col_names.indexOf(col_names[2])) {
          if (
            hot.getData()[row][col - 1] && (hot.getData()[row][col - 1].toLowerCase() !== "Human".toLowerCase())
          ) {
            cellProperties.readOnly = true;
            cellProperties.type = "text";
            cellProperties.renderer = readOnlyStyleRenderer;
          } else {
            cellProperties.readOnly = false;
            cellProperties.type = "dropdown";
            cellProperties.source = ["--NONE--", ...props.population_options];
            cellProperties.renderer = dropdownRenderer;
          }
        }

        return cellProperties;
      },
    });
  });

  const updateNeighbourReadOnly = (changes, dataR) => {
    // changes: [[<row_number>, <column_name>, <previous_value>, <new_value>]]
    if (
      changes[0][1] === col_names[1] &&
      (changes[0][3] && (changes[0][3].toLowerCase() !== "Human".toLowerCase()))
    ) {
      dataR[changes[0][0]][col_names[2]] = null;
    }
  };

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
        updateNeighbourReadOnly(changes, dataR);
        updateNoneSelectionValue(dataR, changes, source);
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
      ref={hotTableComponentRef}
      colHeaders={col_names}
      rowHeaders={true}
      width="100%"
      height="100%"
      autoWrapRow={true}
      autoWrapCol={true}
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
      afterChange={(changes, source) => {
        if (source === 'edit') {
          // changes: Array [[<row_number>, <column_name>, <old_value>, <new_value>]]
          if(DROPDOWN_TYPE_COLUMNS.includes(changes[0][1]) && changes[0][3] === "--NONE--") {
            dataR[changes[0][0]][changes[0][1]] = null;
          }
        }
      }}
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
          source: ["--NONE--", ...props.species_options]
        }}
      />
      <HotColumn
        settings={{
          data: col_names[2],
          type: "dropdown",
          source: ["--NONE--", ...props.population_options]
        }}
      />
      <HotColumn settings={{ data: col_names[3], type: "numeric" }} />
      <HotColumn settings={{ data: col_names[4], type: "numeric" }} />
      <HotColumn settings={{ data: col_names[5], type: "numeric" }} />
      <HotColumn settings={{ data: col_names[6], type: "numeric" }} />
      <HotColumn
        settings={{
          data: col_names[7],
          type: "dropdown",
          source: ["--NONE--", ...props.weight_unit_options]
        }}
      />
      <HotColumn settings={{ data: col_names[8], type: "numeric" }} />
      <HotColumn settings={{ data: col_names[9], type: "numeric" }} />
      <HotColumn
        settings={{
          data: col_names[10],
          type: "dropdown",
          source: ["--NONE--", ...props.height_unit_options]
        }}
      />
      <HotColumn settings={{ data: col_names[11], type: "numeric" }} />
      <HotColumn settings={{ data: col_names[12], type: "numeric" }} />
      <HotColumn settings={{ data: col_names[13], type: "numeric" }} />
      <HotColumn settings={{ data: col_names[14], type: "numeric" }} />
      <HotColumn
        settings={{
          data: col_names[15],
          type: "dropdown",
          source: ["--NONE--", ...props.bmi_unit_options]
        }}
      />
    </HotTable>
  );
}

export default DemographicsTable;
