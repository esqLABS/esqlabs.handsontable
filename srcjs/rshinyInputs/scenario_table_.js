import { reactShinyInput } from "reactR";
import { useState } from "react";
import ScenarioTable from "../components/ScenarioTable.js";
import HandsOnTableTemp from "../components/HandsOnTableTemp.js";
import ExportConfigurationTable from "../components/ExportConfigurationTable.js";
import PlotGridsTable from "../components/PlotGridsTable.js";
import OutputPathsTable from "../components/OutputPathsTable.js";
import IndividualBiometricsTable from "../components/IndividualBiometricsTable.js";
import DemographicsTable from "../components/DemographicsTable.js";
import DataCombinedTable from "../components/DataCombinedTable.js";
import PlotConfigurationTable from "../components/PlotConfigurationTable.js";
// Utils
import { base64ToUtf8Json, validateVectorInputR } from '../utils/utils.js';

const TableInput = ({ configuration, value, setValue }) => {
  let componentToRender;
  console.log(configuration);
  console.log(value);
  // console.log(JSON.parse(atob(value)));
  // console.log(JSON.parse(value));
  console.log(base64ToUtf8Json(value));
  console.log((configuration.column_headers));

  switch (true) {
    case configuration.sheet.toLowerCase() === "Scenarios".toLowerCase():
      componentToRender = (
        <ScenarioTable
          data_scenarios={base64ToUtf8Json(value)}
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
          application_protocol_options={
            validateVectorInputR(configuration.application_protocol_dropdown)
          }
          model_parameters_options={
            validateVectorInputR(configuration.model_parameters_dropdown)
          }
          column_headers={(configuration.column_headers)}
          shiny_el_id_name={configuration.shiny_el_id_name}
        />
      );
      break;
    case configuration.sheet.toLowerCase() === "OutputPaths".toLowerCase():
      componentToRender = (
        <OutputPathsTable
          data_scenarios={base64ToUtf8Json(value)}
          column_headers={(configuration.column_headers)}
          shiny_el_id_name={configuration.shiny_el_id_name}
        />
      );
      break;
    case configuration.sheet.toLowerCase() === "IndividualBiometrics".toLowerCase():
      componentToRender = (
        <IndividualBiometricsTable
          data_scenarios={base64ToUtf8Json(value)}
          species_options={
            validateVectorInputR(configuration.species_option_dropdown)
          }
          population_options={
            validateVectorInputR(configuration.population_option_dropdown)
          }
          gender_options={
            validateVectorInputR(configuration.gender_option_dropdown)
          }
          column_headers={(configuration.column_headers)}
          shiny_el_id_name={configuration.shiny_el_id_name}
        />
      );
      break;
    case configuration.sheet.toLowerCase() === "Demographics".toLowerCase():
      componentToRender = (
        <DemographicsTable
          data_scenarios={base64ToUtf8Json(value)}
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
          column_headers={(configuration.column_headers)}
          shiny_el_id_name={configuration.shiny_el_id_name}
        />
      );
      break;
    case configuration.sheet.toLowerCase() === "DataCombined".toLowerCase():
      componentToRender = (
        <DataCombinedTable
          data_scenarios={base64ToUtf8Json(value)}
          datatype_options={
            validateVectorInputR(configuration.datatype_option_dropdown)
          }
          scenario_options={
            validateVectorInputR(configuration.scenario_option_dropdown)
          }
          path_options={
            validateVectorInputR(configuration.path_option_dropdown)
          }
          column_headers={(configuration.column_headers)}
          shiny_el_id_name={configuration.shiny_el_id_name}
        />
      );
      break;
    case configuration.sheet.toLowerCase() === "plotConfiguration".toLowerCase():
      componentToRender = (
        <PlotConfigurationTable
          data_scenarios={base64ToUtf8Json(value)}
          datacombinedname_options={
            validateVectorInputR(configuration.datacombinedname_option_dropdown)
          }
          plottype_options={
            validateVectorInputR(configuration.plottype_option_dropdown)
          }
          axisscale_options={
            validateVectorInputR(configuration.axisscale_option_dropdown)
          }
          aggregation_options={
            validateVectorInputR(configuration.aggregation_option_dropdown)
          }
          column_headers={(configuration.column_headers)}
          shiny_el_id_name={configuration.shiny_el_id_name}
        />
      );
      break;
    case configuration.sheet.toLowerCase() === "plotGrids".toLowerCase():
      componentToRender = (
        <PlotGridsTable
          data_scenarios={base64ToUtf8Json(value)}
          column_headers={(configuration.column_headers)}
          shiny_el_id_name={configuration.shiny_el_id_name}
        />
      );
      break;
    case configuration.sheet.toLowerCase() === "exportConfiguration".toLowerCase():
      componentToRender = (
        <ExportConfigurationTable
          data_scenarios={base64ToUtf8Json(value)}
          plotgridnames_options={
            validateVectorInputR(configuration.plotgridnames_option_dropdown)
          }
          column_headers={(configuration.column_headers)}
          shiny_el_id_name={configuration.shiny_el_id_name}
        />
      );
      break;
    default:
      componentToRender = (
        <HandsOnTableTemp
          data_scenarios={base64ToUtf8Json(value)}
          shiny_el_id_name={configuration.shiny_el_id_name}
          column_headers={(configuration.column_headers)}
        />
      );
  }

  return (
    <div>
      <div>
        <div className="esqlabs-handsontable-container">
          {componentToRender}
        </div>
      </div>
    </div>
  );
};

export default function initScenarioTable() {
  return reactShinyInput(
    ".scenario_table_",
    "esqlabs.handsontable.scenario_table_",
    TableInput
  );
}
