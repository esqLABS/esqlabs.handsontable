export function validateVectorInputR(input) {
  // Check if input is a string
  if (typeof input === 'string' && input.length === 0) {
    // Convert empty string to array
    return input.split('');
  } else if (typeof input === 'string') {
    return [input];
  } else if (Array.isArray(input)) {
    // Leave array unchanged
    return input;
  } else {
    // Return empty array for other types or empty string
    return [];
  }
}

export function wrapIntoQuotes(input) {
  return input
    .filter(item => item != null && String(item).trim() !== "") // filter null, undefined, and empty strings
    .map(item => {
      const str = String(item).trim();
      return /^".*"$/.test(str) ? str : `"${str}"`; // wrap if not quoted
    });
}



export function base64ToUtf8Json(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const utf8Decoder = new TextDecoder("utf-8");
  const jsonString = utf8Decoder.decode(bytes);
  return JSON.parse(jsonString);
}
