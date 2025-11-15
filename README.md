# esqlabs.handsontable

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-0.0.5.9003-blue.svg)](https://github.com/esqLABS/esqlabs.handsontable)

> **Interactive Excel-like Tables for Shiny Applications**

`esqlabs.handsontable` is an R package that provides advanced table input capabilities for Shiny applications. Built specifically for the ESQapp Shiny application powered by esqLABS, it leverages the powerful [Handsontable.js](https://handsontable.com/) library and React to offer an intuitive, interactive, and feature-rich data editing experience within Shiny apps.

## Features

- **Excel-like Interface**: Familiar spreadsheet-style editing with keyboard navigation, copy/paste, and cell selection
- **Rich Cell Types**: Support for text, numeric, dropdown, and custom cell editors (e.g., simulation time)
- **Dynamic Dropdowns**: Automatically populate dropdowns based on related data across sheets
- **Multiple Table Types**: Pre-configured specialized tables for different data domains:
  - Scenarios configuration
  - Individual biometrics
  - Population demographics
  - Output paths
  - Data combined tables
  - Plot configuration and grids
  - Export configuration
- **Reactive Updates**: Seamless bidirectional data flow between R and JavaScript
- **Custom Editors**: Extensible architecture for adding custom cell editors
- **Event Handling**: Track row/column additions, deletions, and modifications
- **Validation**: Built-in cell validation and visual feedback

## Architecture

The package uses a three-layer architecture:

1. **R Layer**: Shiny input/output bindings via `reactR`
2. **React Layer**: Component-based UI with state management
3. **Handsontable Layer**: Core spreadsheet functionality

## Installation

### From GitHub

```r
# Install from GitHub
remotes::install_github("esqLABS/esqlabs.handsontable")
```

### System Requirements

- R >= 4.0.0
- Node.js and Yarn (for development only)

## Usage

### Basic Example

```r
library(shiny)
library(esqlabs.handsontable)

ui <- fluidPage(
  scenario_table_Input(
    inputId = "my_table",
    data_ = prepare_js_data(your_dataframe),
    individual_id_options = c("ID1", "ID2"),
    population_id_options = c("Pop1", "Pop2"),
    # ... other dropdown options
    sheet_name = "Scenarios",
    column_headers = colnames(your_dataframe)
  )
)

server <- function(input, output, session) {
  # Listen for table edits
  observeEvent(input$my_table_edited, {
    updated_data <- parse_js_data(input$my_table_edited)
    # Process updated data
    print(updated_data)
  })

  # Update table programmatically
  updateScenario_table_Input(
    session = session,
    inputId = "my_table",
    value = prepare_js_data(new_dataframe),
    configuration = list(
      individual_id_dropdown = updated_individual_ids,
      # ... other updated configurations
    )
  )
}

shinyApp(ui, server)
```

### Integration with ESQapp

This package was specifically designed to extend the [ESQapp](https://github.com/esqLABS/ESQapp) package:

```r
# In ESQapp's mod_edit_table.R
output$edit_df <- renderUI({
  data_init <- isolate(r$data[[tab_section]][[sheet]]$modified)

  esqlabs.handsontable::scenario_table_Input(
    inputId = ns("scenario_table_input"),
    data = esqlabs.handsontable::prepare_js_data(data_init),
    individual_id_options = isolate(DROPDOWNS$scenarios$individual_id),
    # ... all dropdown configurations
    sheet_name = sheet,
    column_headers = colnames(data_init)
  )
})
```

## Supported Table Types

The package automatically renders different table components based on the `sheet_name` parameter:

| Sheet Name | Component | Purpose |
|------------|-----------|---------|
| `Scenarios` | ScenarioTable | Simulation scenario configuration |
| `OutputPaths` | OutputPathsTable | Output path definitions |
| `IndividualBiometrics` | IndividualBiometricsTable | Individual subject data |
| `Demographics` | DemographicsTable | Population demographics |
| `DataCombined` | DataCombinedTable | Combined data sources |
| `plotConfiguration` | PlotConfigurationTable | Plot settings |
| `plotGrids` | PlotGridsTable | Plot grid layouts |
| `exportConfiguration` | ExportConfigurationTable | Export settings |
| Other | HandsOnTableTemp | Generic table fallback |

## API Reference

### Main Functions

#### `scenario_table_Input()`

Creates an interactive table input for Shiny.

**Parameters:**
- `inputId` (string): Unique input identifier
- `data_` (string): Base64-encoded JSON data (use `prepare_js_data()`)
- `individual_id_options` (vector): Individual ID dropdown options
- `population_id_options` (vector): Population ID dropdown options
- `outputpath_id_options` (vector): Output path dropdown options
- `outputpath_id_alias_options` (list): Named list of output path aliases
- `model_parameters_options` (vector): Model parameter options
- `model_files_options` (vector): Model file options
- `steatystatetime_unit_options` (vector): Time unit options
- `species_options` (vector): Species options
- `population_options` (vector): Population options
- `gender_options` (vector): Gender options
- `weight_unit_options` (vector): Weight unit options
- `height_unit_options` (vector): Height unit options
- `bmi_unit_options` (vector): BMI unit options
- `datatype_options` (vector): Data type options
- `scenario_options` (vector): Scenario options
- `path_options` (vector): Path options
- `datacombinedname_options` (vector): Data combined name options
- `plottype_options` (vector): Plot type options
- `axisscale_options` (vector): Axis scale options
- `aggregation_options` (vector): Aggregation method options
- `application_protocol_options` (vector): Application protocol options
- `plotgridnames_options` (vector): Plot grid name options
- `plotids_options` (vector): Plot ID options
- `datasets_options` (vector): Dataset options
- `sheet_name` (string): Name of the sheet (determines which table component to render)
- `loaddata_metadata` (list): Metadata for data loading
- `column_headers` (vector): Column header names

#### `updateScenario_table_Input()`

Updates an existing table input without full re-render.

**Parameters:**
- `session`: Shiny session object
- `inputId` (string): Input identifier to update
- `value` (string): New base64-encoded data
- `configuration` (list): Updated configuration options

#### `prepare_js_data()`

Converts R data.frame to base64-encoded JSON for JavaScript consumption.

**Parameters:**
- `data` (data.frame): R data frame to convert

**Returns:** Base64-encoded JSON string

#### `parse_js_data()`

Converts JSON data from JavaScript back to R data.frame.

**Parameters:**
- `json` (string): JSON string from JavaScript

**Returns:** R data frame

## Development

### Prerequisites

```bash
# Install Node.js and Yarn
# Windows: Download from https://nodejs.org/ and https://yarnpkg.com/
# macOS: brew install node yarn
# Linux: Use your package manager

# Install R package dependencies
R -e "devtools::install_deps()"
```

### Building the JavaScript Bundle

```bash
# Navigate to package directory
cd esqlabs.handsontable

# Install JavaScript dependencies
yarn install

# Build for development (with source maps)
yarn run webpack --mode=development

# Build for production (optimized)
yarn run webpack --mode=production
```

### Development Workflow

```r
# After modifying JavaScript files:
# 1. Rebuild the bundle
system("yarn run webpack --mode=development")

# 2. Document and reload the package
devtools::document()
devtools::load_all()

# 3. Test in your Shiny app or run the example
shiny::runApp("app.R")
```

### Package Structure

```
esqlabs.handsontable/
├── R/                          # R source files
│   ├── scenario_table_.R       # Main Shiny input/output functions
│   └── utils.R                 # Helper functions (prepare_js_data, parse_js_data)
├── srcjs/                      # JavaScript/React source files
│   ├── main.jsx               # Entry point
│   ├── rshinyInputs/          # Shiny input bindings
│   │   └── scenario_table_.js # Main input controller
│   ├── components/            # React table components
│   │   ├── ScenarioTable.js
│   │   ├── DataCombinedTable.js
│   │   └── ...
│   ├── context/               # React context for state management
│   ├── hooks/                 # Custom React hooks
│   └── utils/                 # JavaScript utilities
├── inst/
│   └── www/esqlabs.handsontable/
│       └── main_bundle/       # Compiled JavaScript bundle
│           └── bundle.js
├── man/                        # R documentation
├── DESCRIPTION                 # Package metadata
├── NAMESPACE                   # Package exports
├── package.json               # JavaScript dependencies
├── webpack.config.js          # Webpack build configuration
└── README.md                  # This file
```


## Data Flow

```
┌─────────────────┐
│  Shiny Server   │
│  (R)            │
└────────┬────────┘
         │ prepare_js_data()
         ▼
┌─────────────────┐
│  Base64 JSON    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  React          │
│  Components     │
│  (JavaScript)   │
└────────┬────────┘
         │ User edits table
         ▼
┌─────────────────┐
│  Shiny Input    │
│  Event          │
└────────┬────────┘
         │ parse_js_data()
         ▼
┌─────────────────┐
│  Shiny Server   │
│  Updated Data   │
└─────────────────┘
```

## Troubleshooting

### Table Not Rendering

- Ensure data is properly encoded with `prepare_js_data()`
- Check browser console for JavaScript errors
- Verify all required dropdown options are provided

### Dropdown Options Not Updating

- Use `updateScenario_table_Input()` to refresh configuration
- Ensure dropdown values match column data types
- Check that dropdown arrays are properly formatted vectors

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules
yarn install

# Clear webpack cache
rm -rf inst/www/esqlabs.handsontable/main_bundle/*
yarn run webpack --mode=development
```

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and build the package
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Authors

- **Anastasiia Kostiv** - *Initial work* - anastasiia.kostiv.ext@esqlabs.com

## Acknowledgments

- Built with [Handsontable](https://handsontable.com/)
- React integration via [reactR](https://github.com/react-R/reactR)
- Part of the [esqLABS](https://www.esqlabs.com/) ecosystem

## Related Projects

- [ESQapp](https://github.com/esqLABS/ESQapp) - Main application using this package

## Support

For issues, questions, or contributions:
- Open an issue on [GitHub Issues](https://github.com/esqLABS/esqlabs.handsontable/issues)
- Contact: anastasiia.kostiv.ext@esqlabs.com

