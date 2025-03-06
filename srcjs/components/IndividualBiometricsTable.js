import React, { useState, useEffect, useRef } from "react";
import { HotTable, HotColumn } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import { dropdownRenderer } from "handsontable/renderers";
import "handsontable/dist/handsontable.full.min.css";
// Import Custom Renderer
import { readOnlyStyleRenderer } from "./TableRenderer/TableRenderer";
// Utils
import { forceCutRowContent } from "../utils/handsOnTableUtils";

function IndividualBiometricsTable(props) {
  // Data state
  const [dataR, updateDataR] = useState(props.data_scenarios);
  const col_names = Object.keys(dataR[0]);
  const hotTableComponentRef = useRef(null);

  useEffect(() => {
    const hot = hotTableComponentRef.current.hotInstance;

    hot.updateSettings({
      cells(row, col) {
        const cellProperties = {};

        // Check if the column is "population"
        if (col === col_names.indexOf("Population")) {
          if (
            hot.getData()[row][col - 1] &&
            hot.getData()[row][col - 1].toLowerCase() !== "Human".toLowerCase()
          ) {
            cellProperties.readOnly = true;
            cellProperties.type = "text";
            cellProperties.renderer = readOnlyStyleRenderer;
          } else {
            cellProperties.readOnly = false;
            cellProperties.type = "dropdown";
            cellProperties.source = props.population_options;
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
      changes[0][1] === "Species" &&
      changes[0][3] &&
      changes[0][3].toLowerCase() !== "Human".toLowerCase()
    ) {
      dataR[changes[0][0]]["Population"] = null;
    }
  };

  const trackIndividualId = (changes) => {
    // changes: [[<row_number>, <column_name>, <previous_value>, <new_value>]]
    if (changes[0][1] === "IndividualId") {
      if (changes[0][2] === null && changes[0][3] !== null) {
        let actionCompleted = {
          eventType: "individualId_added",
          individualIdName: changes[0][3],
        };
        // Send data to Shiny with the action data
        Shiny.setInputValue(`${props.shiny_el_id_name}_individual_event`, JSON.stringify(actionCompleted), { priority: "event" });
        // console.log(actionCompleted)
      }

      if (changes[0][3] === null && changes[0][2] !== null) {
        let actionCompleted = {
          eventType: "individualId_removed",
          individualIdName: [changes[0][2]],
        };

        // Send data to Shiny with the action data
        Shiny.setInputValue(`${props.shiny_el_id_name}_individual_event`, JSON.stringify(actionCompleted), { priority: "event" });
        // console.log(actionCompleted)
      }

      if (changes[0][3] !== null && changes[0][2] !== null) {
        let actionCompleted = {
          eventType: "individualId_renamed",
          individualIdNewName: changes[0][3],
          individualIdOldName: changes[0][2],
        };

        // Send data to Shiny with the action data
        Shiny.setInputValue(`${props.shiny_el_id_name}_individual_event`, JSON.stringify(actionCompleted), { priority: "event" });
        // console.log(actionCompleted)
      }
    }
  };

  const onBeforeHotChange = (changes) => {
    if (changes === undefined) return;
    if (changes === null) return;
    if (!changes.length) return;
    if (dataR[changes[0][0]][changes[0][1]] === changes[0][3]) {
      // console.log("no change");
      return;
    } else {
      updateNeighbourReadOnly(changes, dataR);
      trackIndividualId(changes);
      setTimeout(() => {
        // console.log(prepareShinyData(dataR));
        // Send data to Shiny with the edited data
        Shiny.setInputValue(
          `${props.shiny_el_id_name}_edited`,
          JSON.stringify(dataR),
          { priority: "event" }
        );
      }, 500);
    }
  };

  return (
    <HotTable
      data={dataR}
      ref={hotTableComponentRef}
      colHeaders={col_names}
      rowHeaders={true}
      autoWrapRow={true}
      autoWrapCol={true}
      height="100%"
      width="100%"
      licenseKey="non-commercial-and-evaluation"
      contextMenu={{
        items: {
          cut: {
            name: "Clear",
          },
          row_below: {},
          remove_row: {
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
        },
      }}
      beforeChange={onBeforeHotChange}
      beforeRemoveRow={(index, amount, physicalRows) => {
        let individualIDs_removed = physicalRows
          // Get individual_id values
          .map((rowIndex) => dataR[rowIndex][col_names[0]])
          // Remove null values
          .filter((element) => element !== null);

        // If array is empty return nothing
        if (individualIDs_removed.length > 0) {
          let actionCompleted = {
            eventType: "individualId_removed",
            individualIdName: individualIDs_removed,
          };
          Shiny.setInputValue(
            `${props.shiny_el_id_name}_individual_event`,
            JSON.stringify(actionCompleted),
            { priority: "event" }
          );
          // console.log(actionCompleted)
        }
      }}
      afterRemoveRow={(index, amount, physicalRows) => {
        // Send data to Shiny with the edited data
        Shiny.setInputValue(
          `${props.shiny_el_id_name}_edited`,
          JSON.stringify(dataR),
          { priority: "event" }
        );
      }}
      afterCreateRow={(index, amount) => {
        // Send data to Shiny with the edited data
        Shiny.setInputValue(
          `${props.shiny_el_id_name}_edited`,
          JSON.stringify(dataR),
          { priority: "event" }
        );
      }}
    >
      <HotColumn settings={{ data: col_names[0], type: "text" }} />
      <HotColumn
        settings={{
          data: col_names[1],
          type: "dropdown",
          source: props.species_options,
        }}
      />
      <HotColumn
        settings={{
          data: col_names[2],
          type: "dropdown",
          source: props.population_options,
        }}
      />
      <HotColumn
        settings={{
          data: col_names[3],
          type: "dropdown",
          source: props.gender_options,
        }}
      />
      <HotColumn settings={{ data: col_names[4], type: "numeric" }} />
      <HotColumn settings={{ data: col_names[5], type: "numeric" }} />
      <HotColumn settings={{ data: col_names[6], type: "numeric" }} />
    </HotTable>
  );
}

export default IndividualBiometricsTable;
