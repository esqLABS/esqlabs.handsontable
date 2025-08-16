import React, { useState } from "react";
import { useRef } from "react";
import { HotTable, HotColumn } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";
import SimulationTimeModal from "./SimulationTimeModal";
import { getSimulationTimeValue, processShinyData, prepareShinyData } from "../utils/scenarioUtils";
import { forceCutRowContent } from "../utils/handsOnTableUtils";
// Import Custom HandsOntableEditor
import DropDownEditor from "./HandsOnTableEditorsExt/DropDownEditor";
import SimulationTimeEditor from "./HandsOnTableEditorsExt/SimulationTimeEditor";
// Custom renderer
import { scenarioNameCellRenderer, dropdownValidationRenderer, simulationTimeCellRenderer } from "./TableRenderer/TableRenderer";
// Utils
import { wrapIntoQuotes } from "../utils/utils";


// register Handsontable's modules
registerAllModules();

const ScenarioTable = (props) => {
  // props: data_scenarios, individual_ids_options
  // Constants
  const DROPDOWN_TYPE_COLUMNS = ["IndividualId", "PopulationId", "ApplicationProtocol", "SteadyStateTimeUnit"];
  // Data state
  // const [dataR, updateDataR] = useState(processShinyData(props.data_scenarios));
  const [dataR, updateDataR] = useState(!props.data_scenarios.length ? [Object.fromEntries(props.column_headers.map(key => [key, null]))] : processShinyData(props.data_scenarios));

  const col_names = Object.keys(dataR[0]);
  // SimulationTime Modal state
  const [simulationTimeModalVisible, setSimulationTimeModalVisible] = useState(false);
  const [simulationTimeModalData, setSimulationTimeModalData] = useState([]);


  // ADD: Get duplicate Scenario_name values
  const getDuplicateScenarioNames = () => {
    const nameCounts = {};
    dataR.forEach(row => {
      const name = row.Scenario_name;
      if (name) {
        nameCounts[name] = (nameCounts[name] || 0) + 1;
      }
    });
    return new Set(Object.keys(nameCounts).filter(name => nameCounts[name] > 1));
  };


  const handleSimulationTimeModalDataSubmit = (data, columName, rowNumber, oldCellValue, timeUnitValue, timeUnitColName) => {
    // Do something with the submitted data
    dataR[rowNumber][columName] = data;
    // Change value in the time unit column (next column)
    dataR[rowNumber][timeUnitColName] = timeUnitValue;
    // In no change in the cell value stop function
    if (oldCellValue === data) return;
    // console.log(prepareShinyData(dataR, DROPDOWN_TYPE_COLUMNS));
    // Send data to Shiny with the edited data
    Shiny.setInputValue(`${props.shiny_el_id_name}_edited`, JSON.stringify(prepareShinyData(dataR, DROPDOWN_TYPE_COLUMNS)), {priority: "event"});
  };

  const handleDropdownModalDataSubmit = (data, columNumber, rowNumber, oldCellValue) => {
    // console.log("handleDropdownModalDataSubmit called with data:", data, "columName:", col_names[columNumber], "rowNumber:", rowNumber, "oldCellValue:", oldCellValue);
    // Do something with the submitted data
    dataR[rowNumber][col_names[columNumber]] = data;
    // In no change in the cell value stop function
    if (oldCellValue === data) return;
    // Send data to Shiny with the edited data
    Shiny.setInputValue(`${props.shiny_el_id_name}_edited`, JSON.stringify(prepareShinyData(dataR, DROPDOWN_TYPE_COLUMNS)), {priority: "event"});
  };

  const hotTableComponentRef = useRef(null);

  const onBeforeHotChange = (changes, source) => {
    if (changes === undefined) return;
    if (changes === null) return;
    if (!changes.length) return;
    if (dataR[changes[0][0]][changes[0][1]] === changes[0][3]) {
        // console.log("no change");
        return;
    } else {

        if (source === "edit") {
          changes.forEach(([row, col, oldVal, newVal]) => {
            if (col === "SimulationTime" && (newVal === null || newVal === "")) {
              dataR[row]["SimulationTimeUnit"] = null;
              // console.log(`Cleared SimulationTimeUnit at row ${row}`);
            }
          });
        }

        setTimeout(() => {
            // console.log(prepareShinyData(dataR));
            // Send data to Shiny with the edited data
            Shiny.setInputValue(`${props.shiny_el_id_name}_edited`, JSON.stringify(prepareShinyData(dataR, DROPDOWN_TYPE_COLUMNS)), {priority: "event"});
        }, 500);
    }
  };

  return (
    <>
      <HotTable
        data={dataR}
        // colHeaders={col_names}
        colHeaders={col_names.map(col => col === "ModelParameterSheets" ? "Parameter sets" : col)}
        ref={hotTableComponentRef}
        fixedColumnsStart={1}
        width="100%"
        height="100%"
        rowHeaders={true}
        autoWrapRow={true}
        autoWrapCol={true}
        licenseKey="non-commercial-and-evaluation"
        beforePaste={(data, coords) => {
          const startRow = coords[0].startRow;
          const startCol = coords[0].startCol;

          data.forEach((rowData, i) => {
            const rowIndex = startRow + i;

            rowData.forEach((value, j) => {
              const colIndex = startCol + j;
              const colName = col_names[colIndex];

              if (["SimulationTimeUnit", "ModelParameterSheets", "OutputPathsIds"].includes(colName)) {
                console.log(`Force-pasting OutputPathsIds at row ${rowIndex}:`, value);
                dataR[rowIndex][colName] = value; // apply copied value manually
              }
            });
          });

          // Send data to Shiny
          setTimeout(() => {
            Shiny.setInputValue(
              `${props.shiny_el_id_name}_edited`,
              JSON.stringify(prepareShinyData(dataR, DROPDOWN_TYPE_COLUMNS)),
              { priority: "event" }
            );
          }, 200);
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
            //console.log(prepareShinyData(dataR));
            // Send data to Shiny with the edited data
            Shiny.setInputValue(`${props.shiny_el_id_name}_edited`, JSON.stringify(prepareShinyData(dataR, DROPDOWN_TYPE_COLUMNS)), {priority: "event"});
        }}
        afterCreateRow={(index, amount) => {
            //console.log(prepareShinyData(dataR));
            // Send data to Shiny with the edited data
            Shiny.setInputValue(`${props.shiny_el_id_name}_edited`, JSON.stringify(prepareShinyData(dataR, DROPDOWN_TYPE_COLUMNS)), {priority: "event"});
        }}

        // ADD: Highlight duplicate Scenario_name rows
        cells={(row, col) => {
          const cellProperties = {};
          const duplicates = getDuplicateScenarioNames();
          const currentRow = dataR[row];

          // Apply class to all cells in the row if Scenario_name is duplicated
          if (duplicates.has(currentRow?.Scenario_name)) {
            cellProperties.className = 'duplicate-row';
          }

          return cellProperties;
        }}

        contextMenu={{
          callback(key, selection, clickEvent) {},
          items: {
            row_above: {
                disabled() {
                  // Disable option when first row was clicked
                  return this.getSelectedLast()[0] === 0; // `this` === hot
                },
            },
            row_below: {},
            cut: {name: 'Clear'},
            sp1: "---------",
            remove_row: {
                name() {
                  // If only one row exists and the first one selected
                  if (this.countRows() === 1 && this.getSelectedLast()[0] === 0) {
                    return "Clear row content";
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
                      numberOfRowsToRemove = numberOfRowsToRemove - 1;
                    }

                    this.alter("remove_row", startRow, numberOfRowsToRemove);
                  }
                }
            }
          },
        }}
      >
        <HotColumn
          width={450}
          settings={{
            data: "Scenario_name",
            type: "text",
            renderer: scenarioNameCellRenderer  // custom cell renderer
          }}
        />
        <HotColumn
          settings={{
            data: "IndividualId",
            type: "dropdown",
            source: ["--NONE--", ...props.individual_ids_options],
            renderer: dropdownValidationRenderer
            //source: ["pop1", "pop2", "pop3"],
          }}
        />
        <HotColumn
          settings={{
            data: "PopulationId",
            type: "dropdown",
            strict: true,
            source: ["--NONE--", ...props.population_ids_options],
            renderer: dropdownValidationRenderer
            //source: ["pop1", "pop2", "pop3"],
          }}
        />
        <HotColumn settings={{ data: "ReadPopulationFromCSV", type: "checkbox" }} />
        <HotColumn
          settings={{
            data: "ModelParameterSheets",
            type: "text"
          }} >
          <DropDownEditor
            hot-editor
            titleName="Select path"
            dropdownOptions={wrapIntoQuotes(props.model_parameters_options)}
            enableSelectOrder={true}
            activeColumnName="Parameter set(s)"
            placeHolderTitle="Paremeter"
            splitBySentence={true}
            handleDropdownModalDataSubmit={handleDropdownModalDataSubmit}
          />
        </HotColumn>
        <HotColumn
          settings={{
            data: "ApplicationProtocol",
            type: "dropdown",
            source: ["--NONE--", ...props.application_protocol_options]

          }} />
        <HotColumn
          // width={75}
          settings={{
            data: "SimulationTime",
            renderer: simulationTimeCellRenderer
          }}
        >
          <SimulationTimeEditor
            hot-editor
            titleName="Enter Simulation Time"
            parentData={dataR}
            columnNames={col_names}
            handleSimulationTimeModalDataSubmit={handleSimulationTimeModalDataSubmit}
          />
        </HotColumn>
        <HotColumn
          settings={{
            data: "SimulationTimeUnit",
            type: "text",
            readOnly: true
            // source: ["h", "m", "s"],
          }}
        />
        <HotColumn settings={{ data: "SteadyState", type: "checkbox" }} />
        <HotColumn settings={{ data: "SteadyStateTime", type: "numeric" }} />
        <HotColumn
          settings={{
            data: "SteadyStateTimeUnit",
            type: "dropdown",
            source: ["--NONE--", ...props.steatystatetime_unit_options]
          }} />
        <HotColumn settings={{ data: "ModelFile", type: "text" }} />
        <HotColumn
          // width={75}
          settings={{
            data: "OutputPathsIds",
            type: "text"
          }}
        >
          <DropDownEditor
            hot-editor
            titleName="Select path"
            dropdownOptions={wrapIntoQuotes(props.outputpath_ids_options)}
            enableSelectOrder={false}
            activeColumnName="OutputPathsIds"
            placeHolderTitle="PathId"
            splitBySentence={true}
            handleDropdownModalDataSubmit={handleDropdownModalDataSubmit}
          />
        </HotColumn>
      </HotTable>

    </>
  );
};


export default ScenarioTable;
