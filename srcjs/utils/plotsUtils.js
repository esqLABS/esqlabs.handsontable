// clean data received from shiny
export function processShinyData(data) {
  if (data === undefined) return;
  if (data === null) return;

  return data.map(item => {
    if (typeof item.plotIDs === "string") {
      const trimmed = item.plotIDs.trim();
      if (trimmed !== "") {
        // Match quoted strings OR unquoted chunks split by comma
        const matches = trimmed.match(/"[^"]*"|[^,]+/g);

        item.plotIDs = matches
          ? matches
              .map(s => s.trim())
              .filter(s => s !== "")
          : [trimmed]; // fallback

      } else {
        item.plotIDs = null;
      }
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
                if (key === "plotIDs") {
                    if ((Array.isArray(entry[key]) && entry[key].length === 0)) {
                        cleanedEntry[key] = null;
                    } else if (entry[key] === null) {
                        cleanedEntry[key] = null;
                    } else {
                        if(typeof entry[key] === "string" && entry[key].includes(",")) {
                          cleanedEntry[key] = entry[key]
                        } else {
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
