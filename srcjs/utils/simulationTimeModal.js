export function splitSimulationTimeToArray(inputString, timeUnit, chunkSize) {
  if (!inputString) {
    return [[null, null, null]];
  }

  // !dev - write logic if next cell with the Time Unit is empty (null)

  const numbersArray = inputString.split(";").map((chunk) => {
    let start_end_resolution_number = chunk.trim().split(",").map(Number);
    // Add time unit (next column value) between each number
    for (let i = 1; start_end_resolution_number.length < 6; i += 2) {
      start_end_resolution_number.splice(i, 0, timeUnit);
    }

    return start_end_resolution_number;
  });

  return numbersArray;
  // Check if any conversion resulted in NaN
  // if (numbersArray.some(chunk => chunk.some(isNaN))) {
  //    return [[NaN, NaN, NaN]];
  // }

  // const resultArray = [];
  // for (let i = 0; i < numbersArray.length; i += chunkSize) {
  //     const chunk = numbersArray.slice(i, i + chunkSize);
  //     resultArray.push(chunk);
  // }

  // return resultArray;
}

export function simulationTimeToString(array) {
  /*
    1. Iterate over each subarray: 
      [
        [10, 'unit', 50, 'unit', 100, 'unit'], 
        [10, 'unit', 50, 'unit', 100, 'unit'], 
        [10, 'unit', 50, 'unit', 100, 'unit']
      ]
    2. Filter out the time unit values
    3. Join the numbers with a comma and a space
  */
  return array
    .map((subarray) =>
      subarray.filter((element, index) => index % 2 === 0).join(", ")
    )
    .join("; ");
}

export function jsonSimulationTimeGenerate(array) {
  let json = [];

  // Iterate over each inner array representing an interval
  for (let i = 0; i < array.length; i++) {
    let interval = array[i];
    let parameters = [];

    // Create parameters for each interval
    parameters.push({
      Name: "Start time",
      Value: interval[0],
      Unit: interval[1],
    });

    parameters.push({
      Name: "End time",
      Value: interval[2],
      Unit: interval[3],
    });

    parameters.push({
      Name: "Resolution",
      Value: interval[4],
      Unit: interval[5],
    });

    // Push parameters to the JSON array
    json.push({ Parameters: parameters });
  }

  return json;
}

// Function to send data to Shiny and wait for response
export function sendSimulationTimeModalDataToShinyAndAwaitResponse(dataToSend) {
  return new Promise(function(resolve, reject) {
      // Add custom message handler to listen for response from Shiny
      Shiny.addCustomMessageHandler("shinyResponse", function(response) {
          console.log('response: ', response);
          // Once response is received, resolve the Promise with the response
          resolve(response);
      });

      // Send data to Shiny
      Shiny.setInputValue("simulationtime_logic-process_simulation_time_conversion", dataToSend, {priority: "event"});
  });
}


export async function convertSimulationTimeToString(jsonSchema) {
  try {
      // Send data to Shiny and wait for response
      const response = await sendSimulationTimeModalDataToShinyAndAwaitResponse(jsonSchema);
      
      // Process the response from Shiny
      return(response);
      
      // Continue with your logic here
  } catch (error) {
      // Handle any errors that occur during the process
      console.log(jsonSchema);
      console.error(error);
      return null;
      // throw new Error("Handling error in the sending data to Shiny and waiting for response process.");
  }
}