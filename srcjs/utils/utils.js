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

/**
 * Split a CSV-like string(sentence) on commas **outside** double quotes.
 * Preserves quoted sentences intact and trims outer whitespace of each token.
 * Used by the multi-select dropdown (sortable) and Handsontable editors.
 *
 * Examples:
 *  splitOutsideQuotes('Global, Joe')                     // ['Global', 'Joe']
 *  splitOutsideQuotes('Global, "Hi, I am Joe"')          // ['Global', '"Hi, I am Joe"']
 *
 * @param {string} str - Comma-separated string, may include quoted parts.
 * @returns {string[]} Tokens split on top-level commas; quoted tokens stay quoted.
 */
export function splitOutsideQuotes(str) {
  const out = [];
  let cur = '';
  let inside = false;

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === '"') {
      inside = !inside;
      cur += ch;               // keep the quote
    } else if (ch === ',' && !inside) {
      const t = cur.trim();    // trim ONLY outside whitespace
      if (t) out.push(t);
      cur = '';
    } else {
      cur += ch;
    }
  }
  const last = cur.trim();
  if (last) out.push(last);
  return out;
}


export function wrapIntoQuotes(input) {
  return input
    .filter(item => item != null && String(item).trim() !== "") // filter null, undefined, and empty strings
    .map(item => {
      const str = String(item).trim();
      return /^".*"$/.test(str) ? str : `"${str}"`; // wrap if not quoted
    });
}

export function wrapObjectKeysIntoQuotes(obj) {
  if (obj == null || typeof obj !== "object") {
    throw new TypeError("Input must be a non-null object");
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      const trimmedKey = key.trim();
      const newKey = /^".*"$/.test(trimmedKey) ? trimmedKey : `"${trimmedKey}"`;
      return [newKey, value];
    })
  );
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


export function decodeHtmlEntities(str) {
  if (typeof str !== "string") return str;
  const el = document.createElement("textarea");
  el.innerHTML = str;
  return el.value;
};
