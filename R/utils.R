#' Convert Data Frame to JSON
#'
#' <Add Description>
#'
#' @importFrom jsonlite toJSON
#'
#' @export
prepare_js_data <- function(data) {
  res_ <- jsonlite::toJSON(x = data, pretty = TRUE, na = 'null')
  return(res_)
}

#' Get JSON from Handsontable Input
#'
#' <Add Description>
#'
#' @export
parse_js_data <- function(json) {
  res_ <- jsonlite::fromJSON(json)
  return(res_)
}
