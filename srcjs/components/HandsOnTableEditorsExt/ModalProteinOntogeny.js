// General
import React, { useState, useRef, useEffect } from "react";
// Modal
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
// Checkbox group
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
// Table
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";
// Utils
import { ospsuite_standard_ontogeny } from "../../utils/config.js";
import { forceCutRowContent } from "../../utils/handsOnTableUtils.js";
// Hooks
import useProteinOntogenyValidate from "../../hooks/useProteinOntogenyValidate.js";

// register Handsontable's modules
registerAllModules();

function ModalProteinOntogeny(props) {
  /* props: {showModal, onCloseModal, dropdownOptions, selectedValue, saveChanges, enableSelectOrder} */

  // const [valueSelected, setValueSelected] = useState(props.selectedValue);
  const [disableSave, setDisableSave] = useState(true);
  const [tableData, setTableData] = useState(props.cellData);
  const hotRef = useRef(null);
  // Apply cell validation
  useProteinOntogenyValidate(hotRef);

  useEffect(() => {
    setTableData(props.cellData);
  }, [props.cellData]);

  // Validate table data
  useEffect(() => {
    if (!tableData) return;


    // --- Special case: exactly 1 row and both cells empty -> enable Save
    if (
      Array.isArray(tableData) &&
      tableData.length === 1 &&
      (tableData[0]?.[0] == null || tableData[0][0] === "") &&
      (tableData[0]?.[1] == null || tableData[0][1] === "")
    ) {
      setDisableSave(false);
      return; // don't run the rest
    }

    let inValidItems = [];

    tableData.forEach((arr) => {
      arr.forEach((el, index) => {
        if (index === 0) {
          if (!el) {
            inValidItems.push(el);
          } else {
            return;
          }
        } else {
          if ((el == null || !(ospsuite_standard_ontogeny || []).includes(el)) && index === 1) {
            inValidItems.push(el);
          } else {
            return;
          }
        }
      });
    }); // end of forEach


    // rule: no invalids
    if (inValidItems.length === 0) {
      setDisableSave(false);
    } else {
      setDisableSave(true);
    }
  }, [tableData]);



  return (
    <Dialog
      fulWidth
      maxWidth="md"
      aria-labelledby="customized-dialog-title"
      open={props.showModal}
      onClose={props.onCloseModal}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {`${props.windowTitle}`}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={props.onCloseModal}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Divider style={{ marginTop: '5px', marginBottom: '25px' }} >
          <span>New</span>
          <Chip label="Protein" size="small" />
          <span>to</span>
          <Chip label="Ontogeny" size="small" />
          <span>Relationship</span>
        </Divider>

            <HotTable
              id="hot3"
              ref={hotRef}
              // data={tableData}
              data={tableData}

              afterCreateRow={(index, amount) => {
                const hot = hotRef.current?.hotInstance;
                if (!hot) return;
                // pull the live grid back into React state
                setTableData(hot.getData());
              }}

              afterRemoveRow={(index, amount, physicalRows) => {
                const hot = hotRef.current?.hotInstance;
                if (!hot) return;
                setTableData(hot.getData());
              }}

              // validation also fires on undo/redo that affects rows
              afterUndo={() => {
                const hot = hotRef.current?.hotInstance;
                if (!hot) return;
                setTableData(hot.getData());
              }}
              afterRedo={() => {
                const hot = hotRef.current?.hotInstance;
                if (!hot) return;
                setTableData(hot.getData());
              }}

              rowHeaders={true}
              colHeaders={[
                "Protein",
                "Ontogeny"
              ]}

              colWidths={[250, 150]} // widths for each column
              autoWrapRow={true}
              autoWrapCol={true}
              columns={[
                { type: "text" },
                {
                  type: "dropdown",
                  source: ospsuite_standard_ontogeny
                }
              ]}
              contextMenu={{
                items: {
                  cut: {
                    name: "Clear",
                  },
                  row_below: {},
                  remove_row: {
                    name() {
                      // If only one row exists and the first one selected
                      if (this.countRows() === 1 && this.getSelectedLast()[0] === 0) {
                        return "Clear row content"
                      } else {
                        return "Remove row";
                      }
                    },
                    callback(key, selection, clickEvent) {
                      const selectedRow = this.getSelectedLast()[0];

                      if(this.countRows() === 1 && selectedRow === 0) {
                        // Cut all elements of the first row
                          forceCutRowContent(this, selectedRow);
                      } else {
                        // Perform remove row operation
                        // Use Handsontable's built-in remove_row functionality for multiple selections
                        const startRow = selection[0].start.row;
                        const endRow = selection[0].end.row;
                        let numberOfRowsToRemove = endRow - startRow + 1;

                        if(this.countRows() === numberOfRowsToRemove) {
                          numberOfRowsToRemove = numberOfRowsToRemove - 1
                        }

                        this.alter("remove_row", startRow, numberOfRowsToRemove);

                        }
                    }
                  }
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


      </DialogContent>
      <Divider />
      <DialogActions>
        <Button
          autoFocus
          disabled={disableSave}
          onClick={() => {
            console.log('Save changes');
            console.log(tableData);
            props.saveChanges(tableData);
          }}>
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  );

}

export default ModalProteinOntogeny;
