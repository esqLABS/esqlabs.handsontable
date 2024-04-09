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
  selectInput(
    inputId = 'options',
    multiple = TRUE,
    label = 'Options',
    choices = c('a', 'b', 'c'),
    # selected = c('a', 'b')
  ),
  selectInput(
    inputId = 'options2',
    multiple = TRUE,
    label = 'Options 2',
    choices = c('x', 'y', 'z'),
    # selected = c('x', 'y')
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

  individuals <- reactive({input$options})
  pops <- reactive({input$options2})

  output$scenario_table <- renderUI({
    req(input$file1)

    data_df <- jsonlite::toJSON(x = read.csv(input$file1$datapath), pretty = TRUE, na = 'null')
    scenario_table_Input(
      inputId = "table_info",
      data = data_df,
      individual_id_options = c(),
      population_id_options = 'TestInd',
      outputpath_id_options = 'TestInd',
      steatystatetime_unit_options = 'Test',
      species_options = 'Test',
      population_options = 'Test',
      gender_options = c('MALE', 'FEMALE', 'UNKNOWN'),
      weight_unit_options = 'Test',
      height_unit_options = 'Test',
      bmi_unit_options = 'Test',
      datatype_options = c('MALE', 'FEMALE', 'UNKNOWN'),
      scenario_options = c('MALE', 'FEMALE', 'UNKNOWN'),
      path_options = c('MALE', 'FEMALE', 'UNKNOWN'),
      datacombinedname_options= c('MALE', 'FEMALE', 'UNKNOWN'),
      plottype_options = c('MALE', 'FEMALE', 'UNKNOWN'),
      axisscale_options = c('MALE', 'FEMALE', 'UNKNOWN'),
      aggregation_options = c('MALE', 'FEMALE', 'UNKNOWN'),
      sheet_name = "plotConfiguration"
    )
  })

  output$textOutput <- renderText({
    sprintf("You entered: %s", input$textInput)
  })
}

shinyApp(ui, server)
