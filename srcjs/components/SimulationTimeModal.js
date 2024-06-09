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
} from "../utils/simulationTimeModal";
import {
  simulationTime__start_end__default_value,
  simulationTime__points__default_value,
  simulationTime__unitToConvert__default_value,
} from "../utils/config.js";
// Hooks
import useSimulationTimeCellValidate from "../hooks/useSimulationTimeCellValidate.js";

// register Handsontable's modules
registerAllModules();

function SimulationTimeModal({
  showModal,
  onCloseModal,
  onDataSubmit,
  cellData,
}) {
  const [formData, setFormData] = useState("");
  const [selectedConversionUnit, setSelectedConversionUnit] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);

  const hotRef = useRef(null);

  // Apply cell validation
  useSimulationTimeCellValidate(hotRef);

  useEffect(() => {
    // Initialize table data when cellData changes
    if (cellData) {
      const initialTableData = splitSimulationTimeToArray(
        cellData.cell_value,
        cellData.simulation_time_unit,
        3
      );
      setTableData(initialTableData);
    }
  }, [cellData]);

  const handleUnitConversionChange = (event) => {
    setSelectedConversionUnit(event.target.value);
  };

  const handleSubmit = () => {
    // Assuming tableData is validated
    console.log({
      jsonSchema: jsonSimulationTimeGenerate(tableData),
      timeUnit: selectedConversionUnit,
    });

    convertSimulationTimeToString(
      JSON.stringify({
        jsonSchema: jsonSimulationTimeGenerate(tableData),
        timeUnit: selectedConversionUnit,
      })
    )
      .then((result) => {
        console.log("Result:", result);

        onDataSubmit(
          result,
          cellData.col_name,
          cellData.row_num,
          cellData.cell_value,
          selectedConversionUnit,
          cellData.simulation_time_unit_col_name
        );

        onCloseModal(); // close modal window
      })
      .catch((error) => {
        console.error("Error caught outside:", error);
        onCloseModal(); // close modal window
      });
  };

  // Validate table data
  useEffect(() => {
    if (!tableData) return;

    let inValidItems = [];

    tableData.forEach((arr) => {
      arr.forEach((el, index) => {
        if (index % 2 === 0) {
          if (
            (typeof el !== "number" && el !== null) ||
            (typeof el === "number" && el < 0)
          ) {
            inValidItems.push(el);
          } else {
            return;
          }
        } else {
          if (
            (el !== null && !simulationTime__start_end__default_value.includes(el) && (index === 1 || index === 3)) ||
            (el !== null && !simulationTime__points__default_value.includes(el) && index === 5)
          ) {
            inValidItems.push(el);
          } else {
            return;
          }
        }
      });
    }); // end of forEach

    if (inValidItems.length > 0 || !selectedConversionUnit) {
      setDisableSubmitBtn(true);
    } else {
      setDisableSubmitBtn(false);
    }
  }, [tableData, selectedConversionUnit]);

  return (
    <React.Fragment>
      <Dialog
        // fullWidth={true}
        maxWidth={"lg"}
        open={showModal}
        onClose={onCloseModal}
      >
        <DialogTitle>Enter Simulation Time</DialogTitle>
        <DialogContent style={{ height: "50vh" }}>
          <div style={{ height: "30vh" }}>
            <HotTable
              id="hot2"
              ref={hotRef}
              data={tableData}
              rowHeaders={true}
              colHeaders={[
                "Start",
                "Time Unit",
                "End",
                "Time Unit",
                "Points",
                "Resolution",
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
              value={selectedConversionUnit}
              onChange={handleUnitConversionChange}
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
          <Button onClick={handleSubmit} disabled={disableSubmitBtn}>Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default SimulationTimeModal;
