import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { HotTable, HotColumn } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";
// Import Custom Renderer
import { proteinOntogenyAlwaysDoubleClickRenderer, actionButtonsCellRenderer, dropdownTooltipRenderer } from "./TableRenderer/TableRenderer";

// Utils
import { forceCutRowContent } from "../utils/handsOnTableUtils";


function ExportConfigurationTable(props) {
  // Data state
  // const [dataR, updateDataR] = useState(props.data_scenarios);
  const [dataR, updateDataR] = useState(!props.data_scenarios.length ? [Object.fromEntries(props.column_headers.map(key => [key, null]))] : props.data_scenarios);
  const [colNames, setColNames] = useState(props.column_headers);

  // const col_names = Object.keys(dataR[0]);
  const col_names = props.column_headers;
  // Constants
  const DROPDOWN_TYPE_COLUMNS = ["plotGridName"];

  const longestLabel = ["--NONE--", ...(props.plotgridnames_options || [])]
                          .filter(v => typeof v === "string")            // remove null/undefined
                          .reduce((a, b) => (a.length > b.length ? a : b), "");
  const approxWidth = Math.min(1000, Math.max(400, longestLabel.length * 8)); // rough estimate


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
      colHeaders={[
          ...col_names,
          "Actions"
        ]}
      columns={colNames.map(col => ({ data: col }))}
      rowHeaders={true}
      autoWrapRow={true}
      autoWrapCol={true}
      autoColumnSize={true}
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
            },
            'custom_add_col': {
              name: 'Add Column',
              callback: function () {
                const newCol = prompt("Enter new column name:");
                if (!newCol || colNames.includes(newCol)) return;

                const newColNames = [...colNames, newCol];
                setColNames(newColNames);

                const newData = dataR.map(row => ({ ...row, [newCol]: null }));
                updateDataR(newData);

                setTimeout(() => {
                  Shiny.setInputValue(`${props.shiny_el_id_name}_edited`, JSON.stringify(newData), { priority: "event" });
                }, 300);
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
    >

        {col_names && col_names.length > 0 && col_names.map((col, index) => {
          let columnSettings = { data: col, type: "text" };


          switch (col) {
            case "outputName":
            case "width":
              columnSettings.type = "text";
              break;
            case "plotGridName":
              columnSettings.type = "dropdown";
              columnSettings.width = approxWidth;
              columnSettings.className = "min-width-plotgrid-column";
              columnSettings.source = ["--NONE--", ...props.plotgridnames_options];
              columnSettings.renderer = dropdownTooltipRenderer;
              break;
            default:
              columnSettings.type = "text";
          }

          return <HotColumn key={index} settings={columnSettings} />;
        })}

      {/* Action buttons column */}
      <HotColumn
        width={90}
        readOnly={true}
        renderer={(instance, td, row, col, prop, value, cellProps) =>
          actionButtonsCellRenderer(instance, td, row, col, prop, value, cellProps, forceCutRowContent)
        }
      />

    </HotTable>
  );
}

export default ExportConfigurationTable;
