import { reactShinyInput } from "reactR";
import { useState, useEffect  } from "react";
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
// Store
import { setTableProps } from "../context/tablePropsStore";
import { withTableProps } from "../context/withTableProps";


// Scenarios
const ScenarioTableWithProps = withTableProps("scenarios", {
  individual_ids_options: [],
  population_ids_options: [],
  outputpath_ids_options: [],
  outputpath_id_alias_options: [],
  steatystatetime_unit_options: [],
  application_protocol_options: [],
  model_parameters_options: [],
  model_files_options: [],
})(ScenarioTable);

// OutputPaths
const OutputPathsWithProps = withTableProps("outputpaths", {})(OutputPathsTable);

// IndividualBiometrics
const IndividualBiometricsWithProps = withTableProps("individualbiometrics", {
  species_options: [],
  population_options: [],
  gender_options: [],
})(IndividualBiometricsTable);

// Demographics
const DemographicsWithProps = withTableProps("demographics", {
  species_options: [],
  population_options: [],
  weight_unit_options: [],
  height_unit_options: [],
  bmi_unit_options: [],
})(DemographicsTable);

// DataCombined
const DataCombinedWithProps = withTableProps("datacombined", {
  datatype_options: [],
  scenario_options: [],
  path_options: [],
  datasets_options: [],
  loaddata_metadata: {}, // safe object default
})(DataCombinedTable);

// PlotConfiguration
const PlotConfigurationWithProps = withTableProps("plotconfiguration", {
  datacombinedname_options: [],
  plottype_options: [],
  axisscale_options: [],
  aggregation_options: [],
})(PlotConfigurationTable);

// PlotGrids
const PlotGridsWithProps = withTableProps("plotgrids", {
  plotids_options: [],
})(PlotGridsTable);

// ExportConfiguration
const ExportConfigurationWithProps = withTableProps("exportconfiguration", {
  plotgridnames_options: [],
})(ExportConfigurationTable);

// HandsOnTableTemp (wrap with empty defaults so it stays uniform)
const HandsOnTableWithProps = withTableProps("handson", {})(HandsOnTableTemp);


const TableInput = ({ configuration, value, setValue }) => {
  let componentToRender;
  console.log(configuration);
  // console.log(value);
  // console.log(JSON.parse(atob(value)));
  // console.log(JSON.parse(value));
  console.log(base64ToUtf8Json(value));
  // console.log((configuration.column_headers));

  // console.log(configuration.sheet)
  // console.log(configuration.individual_id_dropdown)

  useEffect(() => {
    // Scenarios
    setTableProps("scenarios", {
      individual_ids_options:       validateVectorInputR(configuration.individual_id_dropdown),
      population_ids_options:       validateVectorInputR(configuration.population_id_dropdown),
      outputpath_ids_options:       validateVectorInputR(configuration.outputpath_id_dropdown),
      outputpath_id_alias_options:  configuration.outputpath_id_alias_dropdown,
      steatystatetime_unit_options: validateVectorInputR(configuration.steatystatetime_unit_dropdown),
      application_protocol_options: validateVectorInputR(configuration.application_protocol_dropdown),
      model_parameters_options:     validateVectorInputR(configuration.model_parameters_dropdown),
      model_files_options:          validateVectorInputR(configuration.model_files_dropdown),
    });

    // OutputPaths (nothing yet, keep hook for symmetry)
    setTableProps("outputpaths", {});

    // IndividualBiometrics
    setTableProps("individualbiometrics", {
      species_options:    validateVectorInputR(configuration.species_option_dropdown),
      population_options: validateVectorInputR(configuration.population_option_dropdown),
      gender_options:     validateVectorInputR(configuration.gender_option_dropdown),
    });

    // Demographics
    setTableProps("demographics", {
      species_options:     validateVectorInputR(configuration.species_option_dropdown),
      population_options:  validateVectorInputR(configuration.population_option_dropdown),
      weight_unit_options: validateVectorInputR(configuration.weight_unit_dropdown),
      height_unit_options: validateVectorInputR(configuration.height_unit_dropdown),
      bmi_unit_options:    validateVectorInputR(configuration.bmi_unit_dropdown),
    });

    // DataCombined
    setTableProps("datacombined", {
      datatype_options:  validateVectorInputR(configuration.datatype_option_dropdown),
      scenario_options:  validateVectorInputR(configuration.scenario_option_dropdown),
      path_options:      validateVectorInputR(configuration.path_option_dropdown),
      datasets_options:  validateVectorInputR(configuration.datasets_option_dropdown),
      loaddata_metadata: configuration.loaddata_metadata,
    });

    // PlotConfiguration
    setTableProps("plotconfiguration", {
      datacombinedname_options: validateVectorInputR(configuration.datacombinedname_option_dropdown),
      plottype_options:         validateVectorInputR(configuration.plottype_option_dropdown),
      axisscale_options:        validateVectorInputR(configuration.axisscale_option_dropdown),
      aggregation_options:      validateVectorInputR(configuration.aggregation_option_dropdown),
    });

    // PlotGrids
    setTableProps("plotgrids", {
      plotids_options: validateVectorInputR(configuration.plotids_option_dropdown),
    });

    // ExportConfiguration
    setTableProps("exportconfiguration", {
      plotgridnames_options: validateVectorInputR(configuration.plotgridnames_option_dropdown),
    });

    // HandsOn (none)
    setTableProps("handson", {});
  }, [configuration]);



  switch (true) {
    case configuration.sheet.toLowerCase() === "Scenarios".toLowerCase():
      componentToRender = (
        <ScenarioTableWithProps
          data_scenarios={base64ToUtf8Json(value)}
          column_headers={configuration.column_headers}
          shiny_el_id_name={configuration.shiny_el_id_name}
        />
      );
      break;
    case configuration.sheet.toLowerCase() === "OutputPaths".toLowerCase():
      componentToRender = (
        <OutputPathsTable
          data_scenarios={base64ToUtf8Json(value)}
          column_headers={configuration.column_headers}
          shiny_el_id_name={configuration.shiny_el_id_name}
        />
      );
      break;
    case configuration.sheet.toLowerCase() === "IndividualBiometrics".toLowerCase():
      componentToRender = (
        <IndividualBiometricsWithProps
          data_scenarios={base64ToUtf8Json(value)}
          column_headers={configuration.column_headers}
          shiny_el_id_name={configuration.shiny_el_id_name}
        />
      );
      break;
    case configuration.sheet.toLowerCase() === "Demographics".toLowerCase():
      componentToRender = (
        <DemographicsWithProps
          data_scenarios={base64ToUtf8Json(value)}
          column_headers={configuration.column_headers}
          shiny_el_id_name={configuration.shiny_el_id_name}
        />
      );
      break;
    case configuration.sheet.toLowerCase() === "DataCombined".toLowerCase():
      componentToRender = (
        <DataCombinedWithProps
          data_scenarios={base64ToUtf8Json(value)}
          column_headers={configuration.column_headers}
          shiny_el_id_name={configuration.shiny_el_id_name}
        />
      );
      break;
    case configuration.sheet.toLowerCase() === "plotConfiguration".toLowerCase():
      componentToRender = (
        <PlotConfigurationWithProps
          data_scenarios={base64ToUtf8Json(value)}
          column_headers={configuration.column_headers}
          shiny_el_id_name={configuration.shiny_el_id_name}
        />
      );
      break;
    case configuration.sheet.toLowerCase() === "plotGrids".toLowerCase():
      componentToRender = (
        <PlotGridsWithProps
          data_scenarios={base64ToUtf8Json(value)}
          column_headers={configuration.column_headers}
          shiny_el_id_name={configuration.shiny_el_id_name}
        />
      );
      break;
    case configuration.sheet.toLowerCase() === "exportConfiguration".toLowerCase():
      componentToRender = (
        <ExportConfigurationWithProps
          data_scenarios={base64ToUtf8Json(value)}
          column_headers={configuration.column_headers}
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
