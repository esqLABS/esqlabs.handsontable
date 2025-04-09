import { useEffect } from "react";
import { ospsuite_standard_ontogeny } from "../utils/config.js";
// Import Custom Renderer
import { invalidCellRenderer } from "../components/TableRenderer/TableRenderer.js";

const useProteinOntogenyValidate = (hotRef) => {
  useEffect(() => {
    if (!hotRef.current) return;
    const hot = hotRef.current.hotInstance;

    hot.updateSettings({
      cells(row, col) {
        const cellProperties = {};

        if (col === 0) {
          cellProperties.type = "text";
          if (
            (!hot.getData()[row][col])
          ) {
            cellProperties.renderer = invalidCellRenderer;
          }
        }

        if (col === 1) {
          const cellValue = hot.getData()[row][col];
          if (
            cellValue != null && !ospsuite_standard_ontogeny.includes(cellValue)
          ) {
            cellProperties.renderer = invalidCellRenderer;
          }
        }

        return cellProperties;
      },
    });
  });
};

export default useProteinOntogenyValidate;
