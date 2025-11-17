/**
 * Column Descriptions Configuration
 *
 * This file contains descriptions for all columns used in the Handsontable components.
 * Descriptions are extracted from the official esqlabsR documentation:
 * - https://esqlabs.github.io/esqlabsR/articles/design-scenarios.html
 * - https://esqlabs.github.io/esqlabsR/articles/plot-results.html
 *
 */

export const COLUMN_DESCRIPTIONS_BY_SHEET = {
  // ============================================================================
  // SCENARIOS SHEET (from Scenarios.xlsx)
  // Official documentation: https://esqlabs.github.io/esqlabsR/articles/design-scenarios.html
  // ============================================================================
  "Scenarios": {
    "Scenario_name": "Unique name of the scenario. The name must be a valid R variables name. This name retrieves simulation results later (e.g., in figure definitions).",
    "IndividualId": "References individual biometric properties and individual-specific model parameters from Individuals.xlsx. May be empty (uses default simulation individual). Enables cross-species scaling to: Beagle, Dog, Minipig, Mouse, Rat, Rabbit, or Monkey. Creates individual-specific sheets with the same structure as ModelParameters.xlsx.",
    "PopulationId": "References population demographics from PopulationParameters.xlsx Demographics sheet. If empty, individual simulation runs. Same population usable across multiple scenarios. Can combine with IndividualId (individual parameters apply first, then population parameters override matching physiological parameters).",
    "ReadPopulationFromCSV": "Additional information required",
    "Parameter sets": "A list of sheet names from the ModelParameter.xlsx file, separated by a comma. Each sheet contains: Container Path, Parameter Name, Value, Units. Application order matters.",
    "ApplicationProtocol": "Name of application protocol defined in ApplicationParameters.xlsx. Sheet name from ApplicationParameters.xlsx containing application parameters with same structure as ModelParameters.xlsx. Requires simulations with all possible applications (dose, start time) as toggleable parameters.",
    "SimulationTime": "Time intervals as triplets: <StartTime, EndTime, Resolution>; separated by semicolons. Resolution = simulated points per time unit. Example: 0, 10, 1 for 10 minutes at 1 point/minute. Complex example: 0, 20, 60; 20, 504, 1; 504, 552, 10 simulates 20 hours (60 points/hour), then 484 hours (1 point/hour), then 48 hours (10 points/hour).",
    "SimulationTimeUnit": "Unit for SimulationTime values (supported units: see ospsuite::ospUnits documentation).",
    "SteadyState": "Boolean flag for steady-state simulation. If TRUE, simulates for sufficiently long (1000 minutes default).",
    "SteadyStateTime": "Duration for steady-state simulation.",
    "SteadyStateTimeUnit": "Unit for SteadyStateTime.",
    "ModelFile": "Name of the pkml file with the simulation. .pkml file name located in ProjectConfiguration$modelFolder (in the Models/Simulations folder).",
    "OutputPathsIds": "IDs of all paths the outputs should be generated for, separated by a comma. Comma-separated acronyms defined in the OutputPaths sheet.",
  },

  // ============================================================================
  // OUTPUTPATHS SHEET (from Scenarios.xlsx)
  // Official documentation: https://esqlabs.github.io/esqlabsR/articles/design-scenarios.html
  // ============================================================================
  "OutputPaths": {
    "OutputPathId": "Unique identifier for output path. Acronym used in the OutputPathsIds column of the Scenarios sheet.",
    "OutputPath": "Full path to the molecules/parameters for which outputs will be simulated. Example: Organism|PeripheralVenousBlood|Aciclovir|Plasma (Peripheral Venous Blood) or Organism|Fat|Intracellular|Aciclovir|Concentration in container.",
  },

  // ============================================================================
  // INDIVIDUALBIOMETRICS SHEET (from Individuals.xlsx)
  // Official documentation: https://esqlabs.github.io/esqlabsR/articles/design-scenarios.html
  // ============================================================================
  "IndividualBiometrics": {
    "IndividualId": "Unique identifier for the individual. Referenced in the Scenarios sheet IndividualId column.",
    "Species": "Species of the individual. Supports: Human, Beagle, Dog, Minipig, Mouse, Rat, Rabbit, or Monkey.",
    "Population": "Population group (only applicable for Human species). Must match PK-Sim database populations.",
    "Gender": "Gender of the individual. Affects physiological parameters.",
    "Age [year(s)]": "Age value of the individual.",
    "Height [cm]": "Height value of the individual.",
    "Weight [kg]": "Weight/body mass value of the individual.",
    "Protein Ontogenies": "Column containing a list (separated by a comma) of <Protein>:<Ontogeny> values. Ontogeny values must match standard PK-Sim database ontogenies. Example: CYP3A4_alternative:CYP3A4, CYP2D6_alternative:CYP2D6.",
  },

  // ============================================================================
  // DEMOGRAPHICS SHEET (from PopulationParameters.xlsx)
  // Official documentation: https://esqlabs.github.io/esqlabsR/articles/design-scenarios.html
  // ============================================================================
  "Demographics": {
    "PopulationName": "Unique identifier for the population. Referenced in the Scenarios sheet PopulationId column.",
    "species": "Species for the population (e.g., Human, Mouse, Rat).",
    "population": "Population group (only for Human species). Must match PK-Sim database populations.",
    "numberOfIndividuals": "Total number of individuals to generate in the population simulation.",
    "proportionOfFemales": "Proportion of females in the population, as a decimal between 0 and 1.",
    "ageMin": "Minimum age in the population distribution.",
    "ageMax": "Maximum age in the population distribution.",
    "weightMin": "Minimum weight in the population distribution.",
    "weightMax": "Maximum weight in the population distribution.",
    "weightUnit": "Unit for weight values.",
    "heightMin": "Minimum height in the population distribution.",
    "heightMax": "Maximum height in the population distribution.",
    "heightUnit": "Unit for height values.",
    "BMIMin": "Minimum Body Mass Index in the population distribution.",
    "BMIMax": "Maximum Body Mass Index in the population distribution.",
    "BMIUnit": "Unit for BMI values.",
    "Protein Ontogenies": "Column containing a list (separated by a comma) of <Protein>:<Ontogeny> values. Ontogeny values must match standard PK-Sim database ontogenies.",
  },

  // ============================================================================
  // DATACOMBINED SHEET (from Plots.xlsx)
  // Official documentation: https://esqlabs.github.io/esqlabsR/articles/plot-results.html
  // ============================================================================
  "DataCombined": {
    "DataCombinedName": "Plot storage unique name.",
    "dataType": "Either simulated or observed. Specifies whether this row represents simulated or observed data.",
    "label": "A descriptor for the data source within the combined set.",
    "scenario": "The name of the scenario to retrieve results from (for simulated data).",
    "path": "The simulation output location (for simulated data).",
    "dataSet": "The name of the dataset to include (for observed data).",
    "group": "Links both datasets (simulated and observed) together those share the same value.",
    "xOffsets": "Numerical offset to apply to x-axis values. Part of data transformation properties (refer to ospsuite documentation for details).",
    "xOffsetsUnits": "Unit for the x-axis offset value.",
    "yOffsets": "Numerical offset to apply to y-axis values. Part of data transformation properties (refer to ospsuite documentation for details).",
    "yOffsetsUnits": "Unit for the y-axis offset value.",
    "xScaleFactors": "Additional information required",
    "yScaleFactors": "Additional information required",
  },

  // ============================================================================
  // PLOTCONFIGURATION SHEET (from Plots.xlsx)
  // Official documentation: https://esqlabs.github.io/esqlabsR/articles/plot-results.html
  // ============================================================================
  "plotConfiguration": {
    "plotID": "Unique identifier for the plot configuration. Referenced in plotGrids sheet.",
    "DataCombinedName": "References which DataCombined set to use for this plot.",
    "plotType": "Type of plot to generate (e.g., individual, population, observedVsSimulated, residualVsSimulated, residualsVsTime).",
    "title": "Main title text displayed at the top of the plot.",
    "xUnit": "Unit label for x-axis.",
    "yUnit": "Unit label for y-axis.",
    "xAxisScale": "Scale for x-axis (e.g., linear, log).",
    "yAxisScale": "Scale for y-axis (e.g., linear, log).",
    "xValuesLimits": "Axis limits specified as comma-separated values; use parentheses if values contain commas.",
    "yValuesLimits": "Axis limits specified as comma-separated values; use parentheses if values contain commas.",
    "aggregation": "Aggregation method for data (e.g., mean, median).",
    "quantiles": "Quantile values for ribbons or confidence intervals.",
    "nsd": "Additional information required",
    "foldDistance": "Fold distance for reference lines.",
    "subtitle": "Custom subtitle for the plot.",
  },

  // ============================================================================
  // PLOTGRIDS SHEET (from Plots.xlsx)
  // Official documentation: https://esqlabs.github.io/esqlabsR/articles/plot-results.html
  // ============================================================================
  "plotGrids": {
    "name": "Unique identifier for the plot grid.",
    "plotIDs": "Single plot ID or comma-separated multiple IDs for multi-panel figures. Lists which plots to include in the grid.",
    "title": "Main title for the multi-panel figure.",
    "subtitle": "Custom subtitle for the plot.",
  },

  // ============================================================================
  // EXPORTCONFIGURATION SHEET (from Plots.xlsx)
  // Official documentation: https://esqlabs.github.io/esqlabsR/articles/plot-results.html
  // ============================================================================
  "exportConfiguration": {
    "plotGridName": "Reference to plotGrid sheet. Name of the plot grid to export (must match a name from the plotGrids sheet).",
    "outputName": "Output filename. The filename for the exported plot file.",
    "width": "Width for the exported plot. Alternative to heightPerRow; set heightPerRow to NULL when using this.",
  },
  
  // ============================================================================
  // HANDSONTEMP (Generic table used for ModelParameters, ApplicationParameters, etc.)
  // ============================================================================
  "HandsOnTableTemp": {
    "Container Path": "Path to the container in the model structure.",
    "Parameter Name": "Name of the parameter to be modified.",
    "Value": "The value to set for the parameter.",
    "Units": "The unit of measurement for the parameter value.",
  }
};

/**
 * Get the description for a given column name
 * Searches across all sheets to find the column description
 * @param {string} columnName - The name of the column
 * @returns {string|null} The description or null if not found
 */
export function getColumnDescription(columnName) {
  // Search through all sheets for the column name
  for (const sheet in COLUMN_DESCRIPTIONS_BY_SHEET) {
    if (COLUMN_DESCRIPTIONS_BY_SHEET[sheet][columnName]) {
      return COLUMN_DESCRIPTIONS_BY_SHEET[sheet][columnName];
    }
  }
  return null;
}

/**
 * Get the description for a column in a specific sheet
 * @param {string} sheetName - The name of the sheet
 * @param {string} columnName - The name of the column
 * @returns {string|null} The description or null if not found
 */
export function getColumnDescriptionBySheet(sheetName, columnName) {
  return COLUMN_DESCRIPTIONS_BY_SHEET[sheetName]?.[columnName] || null;
}

/**
 * Check if a column has a description
 * @param {string} columnName - The name of the column
 * @returns {boolean} True if description exists
 */
export function hasColumnDescription(columnName) {
  for (const sheet in COLUMN_DESCRIPTIONS_BY_SHEET) {
    if (COLUMN_DESCRIPTIONS_BY_SHEET[sheet][columnName]) {
      return true;
    }
  }
  return false;
}

/**
 * Get all column descriptions for a specific sheet
 * @param {string} sheetName - The name of the sheet
 * @returns {Object|null} Object with column descriptions or null if sheet not found
 */
export function getSheetColumnDescriptions(sheetName) {
  return COLUMN_DESCRIPTIONS_BY_SHEET[sheetName] || null;
}

/**
 * Get list of all available sheet names
 * @returns {string[]} Array of sheet names
 */
export function getAvailableSheets() {
  return Object.keys(COLUMN_DESCRIPTIONS_BY_SHEET);
}
