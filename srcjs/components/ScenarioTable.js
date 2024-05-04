import React, { useState } from "react";
import { useRef } from "react";
import { HotTable, HotColumn } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";
import SimulationTimeModal from "./SimulationTimeModal";
import { getSimulationTimeValue, processShinyData, prepareShinyData } from "../utils/simulationTime";
// Import Custom HandsOntableEditor
import DropDownEditor from "./HandsOnTableEditorsExt/DropDownEditor";

// register Handsontable's modules
registerAllModules();

const ScenarioTable = (props) => {
  // props: data_scenarios, individual_ids_options
  // Data state
  const [dataR, updateDataR] = useState(processShinyData(props.data_scenarios));
  const col_names = Object.keys(dataR[0]);
  // SimulationTime Modal state
  const [simulationTimeModalVisible, setSimulationTimeModalVisible] = useState(false);
  const [simulationTimeModalData, setSimulationTimeModalData] = useState([]);

  // SimulationTime Modal functions
  const handleSimulationTimeModalOpen = (cellData) => {
    setSimulationTimeModalData(cellData);
    setSimulationTimeModalVisible(true);
  };

  const handleSimulationTimeModalClose = () => {
    setSimulationTimeModalVisible(false);
  };

  const handleSimulationTimeModalDataSubmit = (data, columName, rowNumber, oldCellValue, timeUnitValue, timeUnitColName) => {
    // Do something with the submitted data
    dataR[rowNumber][columName] = data;
    // Change value in the time unit column (next column)
    dataR[rowNumber][timeUnitColName] = timeUnitValue;
    // In no change in the cell value stop function
    if (oldCellValue === data) return;
    console.log(prepareShinyData(dataR));
    // Send data to Shiny with the edited data
    Shiny.setInputValue(`${props.shiny_el_id_name}_edited`, JSON.stringify(prepareShinyData(dataR)), {priority: "event"});
  };

  const hotTableComponentRef = useRef(null);

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
            Shiny.setInputValue(`${props.shiny_el_id_name}_edited`, JSON.stringify(prepareShinyData(dataR)), {priority: "event"});
        }, 500)
    }
  };

  return (
    <>
      <HotTable
        data={dataR}
        colHeaders={col_names}
        ref={hotTableComponentRef}
        fixedColumnsStart={1}
        width="100%"
        height="100%"
        rowHeaders={true}
        autoWrapRow={true}
        autoWrapCol={true}
        licenseKey="non-commercial-and-evaluation"
        beforeChange={onBeforeHotChange}
        afterRemoveRow={(index, amount, physicalRows) => {
            //console.log(prepareShinyData(dataR));
            // Send data to Shiny with the edited data
            Shiny.setInputValue(`${props.shiny_el_id_name}_edited`, JSON.stringify(prepareShinyData(dataR)), {priority: "event"});
        }}
        afterCreateRow={(index, amount) => {
            //console.log(prepareShinyData(dataR));
            // Send data to Shiny with the edited data
            Shiny.setInputValue(`${props.shiny_el_id_name}_edited`, JSON.stringify(prepareShinyData(dataR)), {priority: "event"});
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
                disabled() {
                    // Disable option when first row was clicked
                    return this.getSelectedLast()[0] === 0; // `this` === hot
                }
            },
            sp2: "---------",
            enter_simulation_modal: {
              // Own custom option
              name() {
                // `name` can be a string or a function
                return "<b>Enter Simulation Time</b>"; // Name can contain HTML
              },
              hidden() {
                // Hide all columns except the SimulationTime Column
                return (
                  this.getSelectedLast()[1] !== col_names.indexOf("SimulationTime")
                );
                //   return this.getSelectedLast()[1] == 0; // `this` === hot
              },
              callback(key, selection, clickEvent) {
                /*
                  `selection` is an array of selected cell coordinates.
                  [{
                    end: {row: 2, col: 6},
                    start: {row: 2, col: 6}
                  }]
                */
                // Callback the function to open the modal
                handleSimulationTimeModalOpen(
                  getSimulationTimeValue(dataR, selection, col_names)
                );
              },
            },
          },
        }}
      >
        <HotColumn
          width={450}
          settings={{
            data: "Scenario_name",
            type: "text"
          }}
        />
        <HotColumn
          settings={{
            data: "IndividualId",
            type: "dropdown",
            source: props.individual_ids_options,
            //source: ["pop1", "pop2", "pop3"],
          }}
        />
        <HotColumn
          settings={{
            data: "PopulationId",
            type: "dropdown",
            source: props.population_ids_options,
            //source: ["pop1", "pop2", "pop3"],
          }}
        />
        <HotColumn settings={{ data: "ReadPopulationFromCSV", type: "checkbox" }} />
        <HotColumn settings={{ data: "ModelParameterSheets", type: "text" }} />
        <HotColumn settings={{ data: "ApplicationProtocol", type: "text" }} />
        <HotColumn settings={{ data: "SimulationTime", type: "text" }} />
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
            source: props.steatystatetime_unit_options
          }} />
        <HotColumn settings={{ data: "ModelFile", type: "text" }} />
        <HotColumn
          // width={75}
          settings={{
            data: "OutputPathsIds"
          }}
        >
          <DropDownEditor
            hot-editor
            titleName="Select path"
            dropdownOptions={props.outputpath_ids_options}
          />
        </HotColumn>
      </HotTable>
      <SimulationTimeModal
        showModal={simulationTimeModalVisible}
        onCloseModal={handleSimulationTimeModalClose}
        onDataSubmit={handleSimulationTimeModalDataSubmit}
        cellData={simulationTimeModalData}
      />
    </>
  );
};

export default ScenarioTable;
