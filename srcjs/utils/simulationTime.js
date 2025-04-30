// retrieve simulation time value (2.0)
export function getSimulationTimeValue(dataSet, rowNum, colNum, colNames) {

    const col_name = colNames[colNum];
    const right_col_name = colNames[colNum + 1];
    const row_num = rowNum;
    const cell_value = dataSet[row_num][col_name];
    const right_cell_value = dataSet[row_num][right_col_name]

    const result = {
        col_name: col_name,
        row_num: row_num,
        cell_value: cell_value,
        simulation_time_unit: right_cell_value,
        simulation_time_unit_col_name: right_col_name
    };

    return result;
}

// retrieve simulation time value (1.0)
// export function getSimulationTimeValue(dataSet, cellCoordinates, colNames) {
//    const col_name = colNames[cellCoordinates[0].start.col];
//    const right_col_name = colNames[cellCoordinates[0].start.col + 1];
//    const row_num = cellCoordinates[0].start.row;
//    const cell_value = dataSet[row_num][col_name];
//    const right_cell_value = dataSet[row_num][right_col_name]
//
//    const result = {
//        col_name: col_name,
//        row_num: row_num,
//        cell_value: cell_value,
//        simulation_time_unit: right_cell_value,
//        simulation_time_unit_col_name: right_col_name
//    };
//    return result;
// }


// clean data received from shiny
export function processShinyData(data) {
    if (data === undefined) return;
    if (data === null) return;

    return data.map(item => {
      if (typeof item.OutputPathsIds === "string") {
        item.OutputPathsIds = item.OutputPathsIds.trim() !== "" ? item.OutputPathsIds.split(", ") : null;
      }
      if (typeof item.ModelParameterSheets === "string") {
        item.ModelParameterSheets = item.ModelParameterSheets.trim() !== "" ? item.ModelParameterSheets.split(", ") : null;
      }
      // Convert "TRUE" and "FALSE" strings to boolean values
      if (item.SteadyState === "TRUE") {
        item.SteadyState = true;
      } else if (item.SteadyState === "FALSE") {
        item.SteadyState = false;
      }
      return item;
    });
  }

// clean data before sending to shiny
export function prepareShinyData(data, noneTypeColumns = []) {
    if (data === undefined) return;
    if (data === null) return;

    return data.map(entry => {
        const cleanedEntry = {};
        for (const key in entry) {
            if (Object.prototype.hasOwnProperty.call(entry, key)) {
                if (key === "OutputPathsIds" || key === "ModelParameterSheets") {
                    if ((Array.isArray(entry[key]) && entry[key].length === 0)) {
                        cleanedEntry[key] = null;
                    } else if (entry[key] === null) {
                        cleanedEntry[key] = null;
                    } else {
                        if(typeof entry[key] === "string" && entry[key].includes(",")) {
                          cleanedEntry[key] = entry[key]
                        } else {
                            cleanedEntry[key] = entry[key] === "" ? null : entry[key].join(", ");
                          try {
                            cleanedEntry[key] = entry[key] === "" ? null : entry[key].join(", ");
                          } catch (error) {
                            // Fallback in case entry[key] is not an array and `.join()` fails
                            cleanedEntry[key] = String(entry[key]);
                          }
                        }
                    }
                } else {
                    // Convert "--NONE--" string to null values
                    if(noneTypeColumns.includes(key)) {
                      if(entry[key] === "--NONE--" || entry[key] === null) {
                        cleanedEntry[key] = null;
                      } else {
                        cleanedEntry[key] = entry[key] === "" ? null : entry[key];
                      }
                    } else {
                      cleanedEntry[key] = entry[key] === "" ? null : entry[key];
                    }
                }
            }
        }
        return cleanedEntry;
    });
}
