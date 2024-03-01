require(reactR)

create_input <- function(name, dep_list) {
  reactR::scaffoldReactShinyInput(
    name,
    dep_list
  )
}
# E.g.
# create_input("scenario_table_", list("@handsontable/react" = "^14.1.0"))

