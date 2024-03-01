import { reactShinyInput } from 'reactR';
import { useState } from "react";
import ScenarioTable from '../components/ScenarioTable.js';

// const TextInput = ({ configuration, value, setValue }) => {
//   return <input type='text' value={value} onChange={e => setValue(e.target.value)}/>;
// };

const names = ["ind1", "ind2", "ind3", "ind4", "ind5"];
const data = [
  {
    Scenario_name: "Sindrup (1992) - paroxetine hydrochloride, 30 mg, po, md, n=8 (PM)",
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
    ModelFile: "Paroxantine/Sindrup (1992) - paroxetine hydrochloride, 30 mg, po, md, n=8 (PM).pkml",
    OutputPathsIds: "Output_1",
  },
  {
    Scenario_name: "Sindrup (1992) - paroxetine hydrochloride, 30 mg, po, md, n=9 (EM)",
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
    ModelFile: "Paroxantine/Sindrup (1992) - paroxetine hydrochloride, 30 mg, po, md, n=9 (EM).pkml",
    OutputPathsIds: "Output_1, Output_2",
  },
  {
    Scenario_name: "Massaroti (2005) - paroxetine hydrochloride, 20 mg, po, n=28 (EM)",
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
    ModelFile: "Paroxantine/Massaroti (2005) - paroxetine hydrochloride, 20 mg, po, n=28 (EM).pkml",
    OutputPathsIds: "Output_1",
  },
];

const TextInput = ({ configuration, value, setValue }) => {
  console.log(configuration)
  console.log(value)
  return (
    <ScenarioTable
        data_scenarios={JSON.parse(value)}
        individual_ids_options={configuration.individual_id_dropdown}
        population_ids_options={configuration.population_id_dropdown}
    />
  );
};

export default function initScenarioTable(){
  return reactShinyInput(
    '.scenario_table_',
    'esqlabs.handsontable.scenario_table_',
    TextInput
  );
}
