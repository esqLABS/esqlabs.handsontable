export function splitSimulationTimeToArray(inputString, chunkSize) {
    if (!inputString) {
        return [[null, null, null]];
    }

    const numbersArray = inputString.split(';').map(chunk => {
        return chunk.trim().split(',').map(Number);
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
    return array.map(subarray => subarray.join(', ')).join('; ');
}
