#' Scenario Table Input
#'
#' <Add Description>
#'
#' @importFrom reactR createReactShinyInput
#' @importFrom htmltools htmlDependency tags
#'
#' @export
scenario_table_Input <- function(
    inputId,
    data_,
    individual_id_options,
    population_id_options,
    outputpath_id_options,
    steatystatetime_unit_options,
    species_options,
    population_options,
    gender_options,
    sheet_name
  ) {
  reactR::createReactShinyInput(
    inputId,
    "scenario_table_",
    htmltools::htmlDependency(
      name = "scenario_table-input",
      version = "1.0.0",
      src = "www/esqlabs.handsontable/main_bundle",
      package = "esqlabs.handsontable",
      script = "bundle.js"
    ),
    default = data_,
    list(
      individual_id_dropdown        = individual_id_options,
      population_id_dropdown        = population_id_options,
      outputpath_id_dropdown        = outputpath_id_options,
      steatystatetime_unit_dropdown = steatystatetime_unit_options,
      species_option_dropdown       = species_options,
      population_option_dropdown    = population_options,
      gender_option_dropdown        = gender_options,
      sheet                         = sheet_name,
      shiny_el_id_name              = inputId
    ),
    htmltools::tags$div
  )
}

#' Update Scenario Table Input
#'
#' <Add Description>
#'
#' @export
updateScenario_table_Input <- function(session, inputId, value, configuration = NULL) {
  message <- list(value = value)
  if (!is.null(configuration)) message$configuration <- configuration
  session$sendInputMessage(inputId, message);
}
