import React, { useState, useEffect, useRef } from "react";
import { HotTable, HotColumn } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import { dropdownRenderer } from "handsontable/renderers";
import "handsontable/dist/handsontable.full.min.css";
// Import Custom Renderer
import { readOnlyStyleRenderer } from "./TableRenderer/TableRenderer";

function IndividualBiometricsTable(props) {
  // Data state
  const [dataR, updateDataR] = useState(props.data_scenarios);
  const col_names = Object.keys(dataR[0]);
  const hotTableComponentRef = useRef(null);

  useEffect(() => {
    const hot = hotTableComponentRef.current.hotInstance;

    hot.updateSettings({
      cells(row, col) {
        const cellProperties = {};

        // Check if the column is "population"
        if (col === col_names.indexOf('Population')) {
          if (
            hot.getData()[row][col - 1].toLowerCase() === "Human".toLowerCase()
          ) {
            cellProperties.readOnly = true;
            cellProperties.type = "text";
            cellProperties.renderer = readOnlyStyleRenderer;
          } else {
            cellProperties.readOnly = false;
            cellProperties.type = "dropdown";
            cellProperties.source = props.population_options;
            cellProperties.renderer = dropdownRenderer;
          }
        }

        return cellProperties;
      },
    });
  });

  const updateNeighbourReadOnly = (changes, dataR) => {
    // changes: [[<row_number>, <column_name>, <previous_value>, <new_value>]]
    if (
      changes[0][1] === 'Species' &&
      changes[0][3].toLowerCase() === "Human".toLowerCase()
    ) {
      dataR[changes[0][0]]['Population'] = null;
    }
  };

  const onBeforeHotChange = (changes) => {
    if (changes === undefined) return;
    if (changes === null) return;
    if (!changes.length) return;
    if (dataR[changes[0][0]][changes[0][1]] === changes[0][3]) {
      // console.log("no change");
      return;
    } else {
      updateNeighbourReadOnly(changes, dataR);
      setTimeout(() => {
        // console.log(prepareShinyData(dataR));
        // Send data to Shiny with the edited data
        Shiny.setInputValue(
          `${props.shiny_el_id_name}_edited`,
          JSON.stringify(dataR),
          { priority: "event" }
        );
      }, 500);
    }
  };

  return (
    <HotTable
      data={dataR}
      colHeaders={col_names}
      rowHeaders={true}
      autoWrapRow={true}
      autoWrapCol={true}
      height="100%"
      width="100%"
      licenseKey="non-commercial-and-evaluation"
      contextMenu={{
        items: {
          cut: {
            name: "Clear",
          },
          row_below: {},
          remove_row: {
            disabled() {
              // Disable option when first row was clicked
              return this.getSelectedLast()[0] === 0; // `this` === hot
            },
          },
        },
      }}
      beforeChange={onBeforeHotChange}
      afterRemoveRow={(index, amount, physicalRows) => {
        // Send data to Shiny with the edited data
        Shiny.setInputValue(
          `${props.shiny_el_id_name}_edited`,
          JSON.stringify(dataR),
          { priority: "event" }
        );
      }}
      afterCreateRow={(index, amount) => {
        // Send data to Shiny with the edited data
        Shiny.setInputValue(
          `${props.shiny_el_id_name}_edited`,
          JSON.stringify(dataR),
          { priority: "event" }
        );
      }}
    >
      <HotColumn settings={{ data: col_names[0], type: "text" }} />
      <HotColumn
        settings={{
          data: col_names[1],
          type: "dropdown",
          source: props.species_options,
        }}
      />
      <HotColumn
        settings={{
          data: col_names[2],
          type: "dropdown",
          source: props.population_options,
        }}
      />
      <HotColumn
        settings={{
          data: col_names[3],
          type: "dropdown",
          source: props.gender_options,
        }}
      />
      <HotColumn settings={{ data: col_names[4], type: "numeric" }} />
      <HotColumn settings={{ data: col_names[5], type: "numeric" }} />
      <HotColumn settings={{ data: col_names[6], type: "numeric" }} />
    </HotTable>
  );
}

export default IndividualBiometricsTable;
