library(shiny)
library(esqlabs.handsontable)

ui <- fluidPage(
  titlePanel("reactR Input Example"),
  # scenario_table_Input("textInput"),
  shiny::fileInput("file1", "Choose CSV File",
                   accept = c(
                     "text/csv",
                     "text/comma-separated-values,text/plain",
                     ".csv")
  ),
  uiOutput("scenario_table")
)

server <- function(input, output, session) {

  observeEvent(input$table_info_edited, {
    # browser()
    print(
      jsonlite::fromJSON(input$table_info_edited)
    )
  })

  output$scenario_table <- renderUI({
    req(input$file1)

    data_df <- jsonlite::toJSON(x = read.csv(input$file1$datapath), pretty = TRUE, na = 'null')
    scenario_table_Input(
      inputId = "table_info",
      data = data_df,
      individual_id_options = c("a", "b", "c"),
      population_id_options = c("x", "y", "z"),
      sheet_name = "Scenarios"
    )
  })

  output$textOutput <- renderText({
    sprintf("You entered: %s", input$textInput)
  })
}

shinyApp(ui, server)
