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

  const handleSimulationTimeModalDataSubmit = (data, columName, rowNumber, oldCellValue) => {
    // Do something with the submitted data
    dataR[rowNumber][columName] = data;
    // In no change in the cell value stop function
    if (oldCellValue === data) return;
    console.log(prepareShinyData(dataR));
    // Send data to Shiny with the edited data
    Shiny.setInputValue('scenario_table_edit', JSON.stringify(prepareShinyData(dataR)), {priority: "event"});
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
            Shiny.setInputValue('scenario_table_edit', JSON.stringify(prepareShinyData(dataR)), {priority: "event"});
        }, 500)
    }
  };

  return (
    <>
      <HotTable
        data={dataR}
        colHeaders={col_names}
        ref={hotTableComponentRef}
        //   columns={[
        //     { data: "Scenario_name", type: 'text' },
        //     { data: "IndividualId" },
        //     { data: "PopulationId", type: 'dropdown', source: ['pop1', 'pop2', 'pop3'] },
        //     { data: "ReadPopulationFromCSV", type: 'text' },
        //     { data: "ModelParameterSheets", type: 'text' },
        //     { data: "ApplicationProtocol", type: 'text' },
        //     { data: "SimulationTime", type: 'text' },
        //     { data: "SimulationTimeUnit", type: 'dropdown', source: ['h', 'm', 's'] },
        //     { data: "SteadyState", type: 'checkbox' },
        //     { data: "SteadyStateTime", type: 'text' },
        //     { data: "SteadyStateTimeUnit", type: 'text' },
        //     { data: "ModelFile", type: 'text' },
        //     { data: "OutputPathsIds", type: 'text' }
        //   ]}
        fixedColumnsStart={1}
        rowHeaders={true}
        autoWrapRow={true}
        autoWrapCol={true}
        licenseKey="non-commercial-and-evaluation"
        beforeChange={onBeforeHotChange}
        afterRemoveRow={(index, amount, physicalRows) => {
            //console.log(prepareShinyData(dataR));
            // Send data to Shiny with the edited data
            Shiny.setInputValue('scenario_table_edit', JSON.stringify(prepareShinyData(dataR)), {priority: "event"});
        }}
        afterCreateRow={(index, amount) => {
            //console.log(prepareShinyData(dataR));
            // Send data to Shiny with the edited data
            Shiny.setInputValue('scenario_table_edit', JSON.stringify(prepareShinyData(dataR)), {priority: "event"});
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
          // width={75}
          settings={{
            data: "IndividualId"
          }}
        >
          <DropDownEditor
            hot-editor
            titleName="Select value"
            dropdownOptions={props.individual_ids_options}
          />
        </HotColumn>
        <HotColumn
          settings={{
            data: "PopulationId",
            type: "dropdown",
            source: props.population_ids_options,
            //source: ["pop1", "pop2", "pop3"],
          }}
        />
        <HotColumn settings={{ data: "ReadPopulationFromCSV", type: "text" }} />
        <HotColumn settings={{ data: "ModelParameterSheets", type: "text" }} />
        <HotColumn settings={{ data: "ApplicationProtocol", type: "text" }} />
        <HotColumn settings={{ data: "SimulationTime", type: "text" }} />
        <HotColumn
          settings={{
            data: "SimulationTimeUnit",
            type: "text"
            // source: ["h", "m", "s"],
          }}
        />
        <HotColumn settings={{ data: "SteadyState", type: "checkbox" }} />
        <HotColumn settings={{ data: "SteadyStateTime", type: "text" }} />
        <HotColumn settings={{ data: "SteadyStateTimeUnit", type: "text" }} />
        <HotColumn settings={{ data: "ModelFile", type: "text" }} />
        <HotColumn settings={{ data: "OutputPathsIds", type: "text" }} />
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
