import { getColumnDescription } from '../config/columnDescriptions';

/**
 * Generate afterGetColHeader hook for Handsontable
 * This hook adds tooltips to column headers using title attribute
 * @returns {Function} Hook function for Handsontable
 */
export function createColumnHeaderHook() {
  return function(col, TH) {
    // Get the header text
    const headerText = TH.querySelector('.colHeader')?.textContent || TH.textContent;

    // Skip if no header text or if it's the Actions column
    if (!headerText || headerText === 'Actions') {
      return;
    }

    // Get description for this column
    const description = getColumnDescription(headerText);

    if (description) {
      // Add tooltip using title attribute (browser native tooltip)
      TH.setAttribute('title', description);
      TH.style.cursor = 'help';
    }
  };
}
