import React, { useState } from "react";
import { useRef } from "react";
import { HotTable, HotColumn } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";

function PlotConfigurationTable(props) {
  // Data state
  const [dataR, updateDataR] = useState(props.data_scenarios);
  const col_names = Object.keys(dataR[0]);
  console.log(col_names);

  const onBeforeHotChange = (changes) => {
    if (changes === undefined) return;
    if (changes === null) return;
    if (!changes.length) return;
    if (dataR[changes[0][0]][changes[0][1]] === changes[0][3]) {
        // console.log("no change");
        return;
    } else {
        setTimeout(() => {
            // console.log(prepareShinyData(dataR));
            // Send data to Shiny with the edited data
            Shiny.setInputValue(`${props.shiny_el_id_name}_edited`, JSON.stringify(dataR), {priority: "event"});
        }, 500)
    }
  };

  return (
    <>
      <HotTable
        data={dataR}
        colHeaders={col_names}
        rowHeaders={true}
        autoWrapRow={true}
        width="100%"
        height="100%"
        autoWrapCol={true}
        licenseKey="non-commercial-and-evaluation"
        contextMenu={{
          items: {
            'cut': {
              name: 'Clear'
            },
            'row_below': {},
            'remove_row': {
              disabled() {
              // Disable option when first row was clicked
              return this.getSelectedLast()[0] === 0; // `this` === hot
              }
            }
          }
        }}
        beforeChange={onBeforeHotChange}
        afterRemoveRow={(index, amount, physicalRows) => {
          // Send data to Shiny with the edited data
          Shiny.setInputValue(`${props.shiny_el_id_name}_edited`, JSON.stringify(dataR), {priority: "event"});
        }}
        afterCreateRow={(index, amount) => {
          // Send data to Shiny with the edited data
          Shiny.setInputValue(`${props.shiny_el_id_name}_edited`, JSON.stringify(dataR), {priority: "event"});
        }}
      >

        {col_names && col_names.length > 0 && col_names.map((col, index) => {
          let columnSettings = { data: col, type: "text" };

          switch (col) {
            case "plotID":
            case "title":
            case "xUnit":
            case "yUnit":
              columnSettings.type = "text";
              break;
            case "DataCombinedName":
              columnSettings.type = "dropdown";
              columnSettings.source = props.datacombinedname_options;
              break;
            case "plotType":
              columnSettings.type = "dropdown";
              columnSettings.source = props.plottype_options;
              break;
            case "xAxisScale":
            case "yAxisScale":
              columnSettings.type = "dropdown";
              columnSettings.source = props.axisscale_options;
              break;
            case "aggregation":
              columnSettings.type = "dropdown";
              columnSettings.source = props.aggregation_options;
              break;
            case "xAxisLimits":
            case "yAxisLimits":
            case "quantiles":
            case "foldDistance":
              columnSettings.type = "numeric";
              break;
            default:
              columnSettings.type = "text";
          }

          return <HotColumn key={index} settings={columnSettings} />;
        })}

      </HotTable>
    </>
  );
}

export default PlotConfigurationTable;
