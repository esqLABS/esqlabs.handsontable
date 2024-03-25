export function validateVectorInputR(input) {
  // Check if input is a string
  if (typeof input === 'string') {
    // Convert string to array
    return input.split('');
  } else if (Array.isArray(input)) {
    // Leave array unchanged
    return input;
  } else {
    // Return empty array for other types or empty string
    return [];
  }
}
