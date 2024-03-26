import { reactShinyInput } from "reactR";
import { useState } from "react";
import ScenarioTable from "../components/ScenarioTable.js";
import HandsOnTableTemp from "../components/HandsOnTableTemp.js";
import OutputPathsTable from "../components/OutputPathsTable.js";
import IndividualBiometricsTable from "../components/IndividualBiometricsTable.js";
import DemographicsTable from "../components/DemographicsTable.js";
// Utils
import { validateVectorInputR } from '../utils/utils.js';

// const TextInput = ({ configuration, value, setValue }) => {
//   return <input type='text' value={value} onChange={e => setValue(e.target.value)}/>;
// };

const names = ["ind1", "ind2", "ind3", "ind4", "ind5"];
const data = [
  {
    Scenario_name:
      "Sindrup (1992) - paroxetine hydrochloride, 30 mg, po, md, n=8 (PM)",
    IndividualId: ["ind1", "ind2"],
    PopulationId: null,
    ReadPopulationFromCSV: null,
    ModelParameterSheets: null,
    ApplicationProtocol: null,
    SimulationTime: "0, 570, 20",
    SimulationTimeUnit: "h",
    SteadyState: "FALSE",
    SteadyStateTime: null,
    SteadyStateTimeUnit: null,
    ModelFile:
      "Paroxantine/Sindrup (1992) - paroxetine hydrochloride, 30 mg, po, md, n=8 (PM).pkml",
    OutputPathsIds: "Output_1",
  },
  {
    Scenario_name:
      "Sindrup (1992) - paroxetine hydrochloride, 30 mg, po, md, n=9 (EM)",
    IndividualId: null,
    PopulationId: null,
    ReadPopulationFromCSV: null,
    ModelParameterSheets: null,
    ApplicationProtocol: null,
    SimulationTime: "0, 570, 20",
    SimulationTimeUnit: "h",
    SteadyState: "FALSE",
    SteadyStateTime: null,
    SteadyStateTimeUnit: null,
    ModelFile:
      "Paroxantine/Sindrup (1992) - paroxetine hydrochloride, 30 mg, po, md, n=9 (EM).pkml",
    OutputPathsIds: "Output_1, Output_2",
  },
  {
    Scenario_name:
      "Massaroti (2005) - paroxetine hydrochloride, 20 mg, po, n=28 (EM)",
    IndividualId: null,
    PopulationId: null,
    ReadPopulationFromCSV: null,
    ModelParameterSheets: null,
    ApplicationProtocol: null,
    SimulationTime: "0, 124, 20",
    SimulationTimeUnit: "h",
    SteadyState: "FALSE",
    SteadyStateTime: null,
    SteadyStateTimeUnit: null,
    ModelFile:
      "Paroxantine/Massaroti (2005) - paroxetine hydrochloride, 20 mg, po, n=28 (EM).pkml",
    OutputPathsIds: "Output_1",
  },
];

const TableInput = ({ configuration, value, setValue }) => {
  let componentToRender;
  console.log(configuration);
  console.log(value);

  switch (true) {
    case configuration.sheet.toLowerCase() === "Scenarios".toLowerCase():
      componentToRender = (
        <ScenarioTable
          data_scenarios={JSON.parse(value)}
          individual_ids_options={
            validateVectorInputR(configuration.individual_id_dropdown)
          }
          population_ids_options={
            validateVectorInputR(configuration.population_id_dropdown)
          }
          outputpath_ids_options={
            validateVectorInputR(configuration.outputpath_id_dropdown)
          }
          steatystatetime_unit_options={
            validateVectorInputR(configuration.steatystatetime_unit_dropdown)
          }
          shiny_el_id_name={configuration.shiny_el_id_name}
        />
      );
      break;
    case configuration.sheet.toLowerCase() === "OutputPaths".toLowerCase():
      componentToRender = (
        <OutputPathsTable
          data_scenarios={JSON.parse(value)}
        />
      );
      break;
    case configuration.sheet.toLowerCase() === "IndividualBiometrics".toLowerCase():
      componentToRender = (
        <IndividualBiometricsTable
          data_scenarios={JSON.parse(value)}
          species_options={
            validateVectorInputR(configuration.species_option_dropdown)
          }
          population_options={
            validateVectorInputR(configuration.population_option_dropdown)
          }
          gender_options={
            validateVectorInputR(configuration.gender_option_dropdown)
          }
        />
      );
      break;
    case configuration.sheet.toLowerCase() === "Demographics".toLowerCase():
      componentToRender = (
        <DemographicsTable
          data_scenarios={JSON.parse(value)}
          species_options={
            validateVectorInputR(configuration.species_option_dropdown)
          }
          population_options={
            validateVectorInputR(configuration.population_option_dropdown)
          }
          weight_unit_options={
            validateVectorInputR(configuration.weight_unit_dropdown)
          }
          height_unit_options={
            validateVectorInputR(configuration.height_unit_dropdown)
          }
          bmi_unit_options={
            validateVectorInputR(configuration.bmi_unit_dropdown)
          }
        />
      );
      break;
    default:
      componentToRender = (
        <HandsOnTableTemp
          data_scenarios={JSON.parse(value)}
          shiny_el_id_name={configuration.shiny_el_id_name}
        />
      );
  }

  return <>{componentToRender}</>;
};

export default function initScenarioTable() {
  return reactShinyInput(
    ".scenario_table_",
    "esqlabs.handsontable.scenario_table_",
    TableInput
  );
}
