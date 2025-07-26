#' Convert Data Frame to JSON
#'
#' <Add Description>
#'
#' @importFrom jsonlite toJSON
#' @importFrom base64enc base64encode
#' @export
prepare_js_data <- function(data) {
  res_ <- jsonlite::toJSON(x = data, pretty = TRUE, na = 'null')
  encoded <- base64enc::base64encode(charToRaw(res_))
  return(encoded)
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
