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
import { splitSimulationTimeToArray, simulationTimeToString, jsonSimulationTimeGenerate } from '../utils/simulationTimeModal';
import { height } from "@mui/system";

// register Handsontable's modules
registerAllModules();

function SimulationTimeModal({showModal, onCloseModal, onDataSubmit, cellData}) {
    const [formData, setFormData] = useState("");
    const [selectedConversionUnit, setSelectedConversionUnit] = useState(null);
    const [tableData, setTableData] = useState([]);
    const hotRef = useRef(null);

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
        timeUnit: selectedConversionUnit
      });

      Shiny.setInputValue('simulationtime_logic-simulationtime_module_server-process_simulation_time_conversion', 
        JSON.stringify({
          jsonSchema: jsonSimulationTimeGenerate(tableData),
          timeUnit: selectedConversionUnit
        }), {priority: "event"}
      );
  
      const hot = hotRef.current.props.data;
      // setFormData(simulationTimeToString(hot));
      const simulationVal = simulationTimeToString(tableData);
  
      onDataSubmit(
        simulationVal,
        cellData.col_name,
        cellData.row_num,
        cellData.cell_value,
        selectedConversionUnit,
        cellData.simulation_time_unit_col_name
      );
      onCloseModal();
    };

  return (
    <React.Fragment>
      <Dialog
        // fullWidth={true}
        maxWidth={"lg"}
        open={showModal}
        onClose={onCloseModal}
      >
        <DialogTitle>Enter Simulation Time</DialogTitle>
        <DialogContent style={{height: '50vh'}}>

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
                  "Time Unit",
                ]}
                autoWrapRow={true}
                autoWrapCol={true}
                columns={[
                  { type: "numeric" },
                  {
                    type: "dropdown",
                    source: [
                      "s",
                      "min",
                      "h",
                      "day(s)",
                      "week(s)",
                      "month(s)",
                      "year(s)",
                      "ks",
                    ],
                  },
                  { type: "numeric" },
                  {
                    type: "dropdown",
                    source: [
                      "s",
                      "min",
                      "h",
                      "day(s)",
                      "week(s)",
                      "month(s)",
                      "year(s)",
                      "ks",
                    ],
                  },
                  { type: "numeric" },
                  {
                    type: "dropdown",
                    source: [
                      "s",
                      "min",
                      "h",
                      "day(s)",
                      "week(s)",
                      "month(s)",
                      "year(s)",
                      "ks",
                    ],
                  },
                ]}
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
            >
              {[
                "s",
                "min",
                "h",
                "day(s)",
                "week(s)",
                "month(s)",
                "year(s)",
                "ks",
              ].map((unit) => {
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
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default SimulationTimeModal;
