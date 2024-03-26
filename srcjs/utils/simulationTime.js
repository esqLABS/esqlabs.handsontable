// retrieve simulation time vlue
export function getSimulationTimeValue(dataSet, cellCoordinates, colNames) {
    const col_name = colNames[cellCoordinates[0].start.col];
    const row_num = cellCoordinates[0].start.row;
    const cell_value = dataSet[row_num][col_name];

    const result = {
        col_name: col_name,
        row_num: row_num,
        cell_value: cell_value
    };

    return result;
}

// clean data received from shiny
export function processShinyData(data) {
    if (data === undefined) return;
    if (data === null) return;

    return data.map(item => {
      if (typeof item.OutputPathsIds === "string") {
        item.OutputPathsIds = item.OutputPathsIds.trim() !== "" ? item.OutputPathsIds.split(", ") : null;
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
export function prepareShinyData(data) {
    if (data === undefined) return;
    if (data === null) return;

    return data.map(entry => {
        const cleanedEntry = {};
        for (const key in entry) {
            if (Object.prototype.hasOwnProperty.call(entry, key)) {
                if (key === "OutputPathsIds") {
                    if ((Array.isArray(entry[key]) && entry[key].length === 0)) {
                        cleanedEntry[key] = null;
                    } else if (entry[key] === null) {
                        cleanedEntry[key] = null;
                    } else {
                        cleanedEntry[key] = entry[key] === "" ? null : entry[key].join(", ");;
                    }
                } else {
                    cleanedEntry[key] = entry[key] === "" ? null : entry[key];
                }
            }
        }
        return cleanedEntry;
    });
}
