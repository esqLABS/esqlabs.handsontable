export function forceCutRowContent(hot, rowIndex) {
  if (!hot) return;

  const colCount = hot.countCols(); // Get total number of columns
  let readOnlyColumns = []; // Store read-only column indexes to restore later

  // Temporarily disable read-only mode
  for (let col = 0; col < colCount; col++) {
    let cellMeta = hot.getCellMeta(rowIndex, col);

    if (cellMeta.readOnly) {
      readOnlyColumns.push(col); // Store read-only column indexes
      hot.setCellMeta(rowIndex, col, "readOnly", false); // Temporarily disable read-only
    }
  }

  // Select the entire row before performing the cut operation
  hot.selectCells([[rowIndex, 0, rowIndex, colCount - 1]]);

  // Perform the cut operation with a small delay to ensure the selection is applied
  setTimeout(() => {
    hot.getPlugin("CopyPaste").cut();

    // Restore read-only state after cutting
    setTimeout(() => {
      readOnlyColumns.forEach((col) => {
        hot.setCellMeta(rowIndex, col, "readOnly", true);
      });
      hot.render(); // Re-render to apply changes
    }, 50); // Small delay to allow the cut operation to complete
  }, 50);
}
