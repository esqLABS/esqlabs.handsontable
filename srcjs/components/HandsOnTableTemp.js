import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { HotTable, HotColumn } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";

function HandsOnTableTemp(props) {


    console.log("props.data_scenarios Temp Table", props.data_scenarios);
    console.log("col_names Temp Table", props.column_headers);


  // Data state
  const [dataR, updateDataR] = useState(props.data_scenarios);
  // const col_names = Object.keys(dataR[0]);
  const col_names = props.column_headers;

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
    <HotTable
      data={dataR}
      colHeaders={col_names.map(column => column.title)}
      columns={col_names}
      rowHeaders={true}
      autoWrapRow={true}
      autoWrapCol={true}
      width="100%"
      height="100%"
      licenseKey="non-commercial-and-evaluation"
      contextMenu={{
        items: {
          'cut': {
            name: 'Clear'
          },
          'row_below': {
            disabled: false
          },
          'row_above': {},
          'remove_row': {}
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
    />
  );
}

export default HandsOnTableTemp;
