import React, { useState } from "react";
import { useRef } from "react";
import { HotTable, HotColumn } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";
// Utils
import { forceCutRowContent } from "../utils/handsOnTableUtils";

function PlotConfigurationTable(props) {
  // Data state
  const [dataR, updateDataR] = useState(props.data_scenarios);
  const col_names = Object.keys(dataR[0]);
  // Constants
  const DROPDOWN_TYPE_COLUMNS = ["DataCombinedName", "plotType", "xAxisScale", "yAxisScale", "aggregation"];
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
    <>
      <HotTable
        data={dataR}
        colHeaders={col_names}
        rowHeaders={true}
        autoWrapRow={true}
        width="100%"
        height="100%"
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
        afterRemoveRow={(index, amount, physicalRows) => {
          // Send data to Shiny with the edited data
          Shiny.setInputValue(`${props.shiny_el_id_name}_edited`, JSON.stringify(dataR), {priority: "event"});
        }}
        afterCreateRow={(index, amount) => {
          // Send data to Shiny with the edited data
          Shiny.setInputValue(`${props.shiny_el_id_name}_edited`, JSON.stringify(dataR), {priority: "event"});
        }}
      >

        {col_names && col_names.length > 0 && col_names.map((col, index) => {
          let columnSettings = { data: col, type: "text" };

          switch (col) {
            case "plotID":
            case "title":
            case "xUnit":
            case "yUnit":
              columnSettings.type = "text";
              break;
            case "DataCombinedName":
              columnSettings.type = "dropdown";
              columnSettings.source = ["--NONE--", ...props.datacombinedname_options];
              break;
            case "plotType":
              columnSettings.type = "dropdown";
              columnSettings.source = ["--NONE--", ...props.plottype_options];
              break;
            case "xAxisScale":
            case "yAxisScale":
              columnSettings.type = "dropdown";
              columnSettings.source = ["--NONE--", ...props.axisscale_options];
              break;
            case "aggregation":
              columnSettings.type = "dropdown";
              columnSettings.source = ["--NONE--", ...props.aggregation_options];
              break;
            case "xAxisLimits":
            case "yAxisLimits":
            case "quantiles":
            case "foldDistance":
              columnSettings.type = "numeric";
              break;
            default:
              columnSettings.type = "text";
          }

          return <HotColumn key={index} settings={columnSettings} />;
        })}

      </HotTable>
    </>
  );
}

export default PlotConfigurationTable;
