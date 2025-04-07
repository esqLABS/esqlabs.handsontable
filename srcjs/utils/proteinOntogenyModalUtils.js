/**
 * Converts a semicolon- and comma-separated string into a nested array of [protein, ontogeny] pairs.
 *
 * Usage examples:
 *
 * splitProteinOntogenyToArray('UGT1A1,ontogeny1;CYP3A4,ontogeny2');
 * // → [['UGT1A1', 'ontogeny1'], ['CYP3A4', 'ontogeny2']]
 *
 * splitProteinOntogenyToArray('UGT1A1,ontogeny1');
 * // → [['UGT1A1', 'ontogeny1']]
 *
 * splitProteinOntogenyToArray('UGT1A1');
 * // → [['UGT1A1', null]]
 *
 * splitProteinOntogenyToArray('');
 * // → [[null, null]]
 */
export function splitProteinOntogenyToArray(inputString) {
  // Check if inputString is missing or empty:
  // - !inputString checks for null, undefined, empty string, false, 0, NaN
  // - inputString.length === 0 checks for empty string "" or empty array []

  console.log('inputString:', inputString);

  if (!inputString || inputString.length === 0) {
    return [[null, null]];
  }

  // Split by semicolon to get top-level groups
  const protein_ontogeny_Array = inputString.split(';').map(group => {
    const parts = group.split(',');

    // Ensure exactly two elements per group
    if (parts.length === 1) {
      // Only one element, add null to complete the pair
      return [parts[0], null];
    } else if (parts.length >= 2) {
      // More than two? Only take first two
      return [parts[0], parts[1]];
    } else {
      // Unexpected case, return [null, null]
      return [null, null];
    }
  });

  return protein_ontogeny_Array;
}


/**
 * Converts a nested array of [protein, ontogeny] pairs into a strict semicolon-separated string.
 *
 * Usage examples:
 *
 * joinProteinOntogenyFromArray([
 *   ['UGT1A1', 'ontogeny1'],
 *   ['CYP3A4', 'ontogeny2']
 * ]);
 * // → "UGT1A1,ontogeny1;CYP3A4,ontogeny2"
 *
 * joinProteinOntogenyFromArray([['UGT1A1', '']]);
 * // → null  (empty ontogeny)
 *
 * joinProteinOntogenyFromArray([['onlyOneElement']]);
 * // → null  (incomplete pair)
 *
 * joinProteinOntogenyFromArray([]);
 * // → null  (empty input)
 */
export function joinProteinOntogenyFromArray(nestedArray) {
  // Validate input: must be a non-empty array
  if (!Array.isArray(nestedArray) || nestedArray.length === 0) {
    return null;
  }

  // Map each [protein, ontogeny] pair to "protein,ontogeny" string
  const joined = nestedArray.map(pair => {
    // Check that pair is a valid [protein, ontogeny]
    if (
      !Array.isArray(pair) ||              // Must be an array
      pair.length !== 2 ||                 // Must contain exactly two elements
      typeof pair[0] !== 'string' ||       // First element (protein) must be a string
      typeof pair[1] !== 'string' ||       // Second element (ontogeny) must be a string
      pair[0].trim() === '' ||             // protein must not be an empty string
      pair[1].trim() === ''                // ontogeny must not be an empty string
    ) {
      // If any pair is invalid, return null for the entire expression
      return null;
    }

    // Return combined "protein,ontogeny" string
    return `${pair[0]},${pair[1]}`;
  });

  // If any invalid [protein, ontogeny] pair was found
  if (joined.includes(null)) {
    return null;
  }

  // Join all "protein,ontogeny" strings with semicolon
  return joined.join(';');
}

