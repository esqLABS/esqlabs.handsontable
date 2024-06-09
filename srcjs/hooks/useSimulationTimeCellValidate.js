import { useEffect } from "react";
import { simulationTime__start_end__default_value, simulationTime__points__default_value } from "../utils/config.js";
// Import Custom Renderer
import { invalidCellRenderer } from "../components/TableRenderer/TableRenderer.js";

const useSimulationTimeCellValidate = (hotRef) => {
  useEffect(() => {
    if (!hotRef.current) return;
    const hot = hotRef.current.hotInstance;

    hot.updateSettings({
      cells(row, col) {
        const cellProperties = {};

        if (col === 0 || col === 2 || col === 4) {
          cellProperties.type = "numeric";
          if (
            (typeof hot.getData()[row][col] !== "number" &&
              hot.getData()[row][col] !== null) ||
            (typeof hot.getData()[row][col] === "number" &&
              hot.getData()[row][col] < 0)
          ) {
            cellProperties.renderer = invalidCellRenderer;
          }
        }

        if (col === 1 || col === 3) {
          if (
            hot.getData()[row][col] !== null &&
            !simulationTime__start_end__default_value.includes(hot.getData()[row][col])
          ) {
            cellProperties.renderer = invalidCellRenderer;
          }
        }

        if (col === 5) {
            if (
              hot.getData()[row][col] !== null &&
              !simulationTime__points__default_value.includes(hot.getData()[row][col])
            ) {
              cellProperties.renderer = invalidCellRenderer;
            }
          }

        return cellProperties;
      },
    });
  });
};

export default useSimulationTimeCellValidate;
