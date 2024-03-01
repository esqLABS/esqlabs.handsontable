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
    population_id_options
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
      individual_id_dropdown = individual_id_options,
      population_id_dropdown = population_id_options
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
