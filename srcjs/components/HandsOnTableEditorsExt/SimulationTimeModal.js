import React, { useState, useRef, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
// Form Control to
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
// Table
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";
// Utils
import {
  splitSimulationTimeToArray,
  jsonSimulationTimeGenerate,
  convertSimulationTimeToString,
} from "../../utils/simulationTimeModal";
import {
  simulationTime__start_end__default_value,
  simulationTime__points__default_value,
  simulationTime__unitToConvert__default_value,
} from "../../utils/config.js";
// Hooks
import useSimulationTimeCellValidate from "../../hooks/useSimulationTimeCellValidate.js";

// register Handsontable's modules
registerAllModules();

function SimulationTimeModal(props) {
  const hotRef = useRef(null);

  // Apply cell validation
  // useSimulationTimeCellValidate(hotRef);

  return (
    <React.Fragment>
      <Dialog
        // fullWidth={true}
        maxWidth={"lg"}
        open={props.showModal}
        onClose={props.onCloseModal}
      >
        <DialogTitle>Enter Simulation Time</DialogTitle>
        <DialogContent style={{ height: "50vh" }}>
          <div style={{ height: "30vh" }}>
            <HotTable
              id="hot2"
              ref={hotRef}
              data={[null]}
              rowHeaders={true}
              colHeaders={[
                "Start",
                "Time Unit",
                "End",
                "Time Unit",
                "Resolution",
                "",
              ]}
              autoWrapRow={true}
              autoWrapCol={true}
              columns={[
                { type: "numeric" },
                {
                  type: "dropdown",
                  source: simulationTime__start_end__default_value,
                },
                { type: "numeric" },
                {
                  type: "dropdown",
                  source: simulationTime__start_end__default_value,
                },
                { type: "numeric" },
                {
                  type: "dropdown",
                  source: simulationTime__points__default_value,
                },
              ]}
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
              licenseKey="non-commercial-and-evaluation"
              afterChange={(changes) => {
                console.log("Changes:", changes);
                // Update table data after any changes
                if (!changes) return;
                const newData = [...tableData];
                changes.forEach(([row, prop, oldValue, newValue]) => {
                  newData[row][prop] = newValue;
                });
                setTableData(newData);
              }}
            />
          </div>

          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Select Time Unit Convert To
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={null}
              onChange={() => console.log("Change")}
              style={{ zIndex: 9999999999 }}
            >
              {simulationTime__unitToConvert__default_value.map((unit) => {
                return (
                  <FormControlLabel
                    key={unit}
                    value={unit}
                    control={<Radio />}
                    label={unit}
                  />
                );
              })}
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => console.log('Submit')} disabled={true}>Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default SimulationTimeModal;
