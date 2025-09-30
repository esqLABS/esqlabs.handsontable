import { useEffect } from "react";
import { ospsuite_standard_ontogeny } from "../utils/config.js";
// Import Custom Renderer
import { invalidCellRenderer, invalidDropdownCellRenderer } from "../components/TableRenderer/TableRenderer.js";

const useProteinOntogenyValidate = (hotRef) => {
  useEffect(() => {
    if (!hotRef.current) return;
    const hot = hotRef.current.hotInstance;

    hot.updateSettings({
      cells(row, col) {
        const cellProperties = {};
        const data = hot.getData?.() || [];

        // Helpers
        const isEmpty = (v) => v == null || (typeof v === "string" && v.trim() === "");
        const singleRowBothEmpty =
          Array.isArray(data) &&
          data.length === 1 &&
          isEmpty(data[0]?.[0]) &&
          isEmpty(data[0]?.[1]);

        // Special case: exactly 1 row and both cells empty -> no invalid styling
        if (singleRowBothEmpty) return cellProperties;

        if (col === 0) {
          cellProperties.type = "text";
          // Protein invalid if empty (except special case handled above)
          if (isEmpty(data[row]?.[col])) {
            cellProperties.renderer = invalidCellRenderer;
          }
        }

        if (col === 1) {
          const cellValue = data[row]?.[col];
          cellProperties.type = "dropdown";
          // Ontogeny invalid if empty OR not in allowed list (except special case)
          if (isEmpty(cellValue) || !(ospsuite_standard_ontogeny || []).includes(cellValue)) {
            cellProperties.renderer = invalidDropdownCellRenderer;
          }
        }

        return cellProperties;
      },
    });
  });
};

export default useProteinOntogenyValidate;
