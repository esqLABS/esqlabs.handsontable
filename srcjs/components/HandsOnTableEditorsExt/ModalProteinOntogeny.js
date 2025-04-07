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
// Icons
import { MdDragIndicator } from "react-icons/md";
// Checkbox group
import Box from '@mui/material/Box';
import FormControl from "@mui/material/FormControl";
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
// Table
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";
// Sortable List
import SortableList, { SortableItem } from 'react-easy-sort'
import { arrayMoveImmutable } from 'array-move'

// register Handsontable's modules
registerAllModules();

function ModalProteinOntogeny(props) {
  /* props: {showModal, onCloseModal, dropdownOptions, selectedValue, saveChanges, enableSelectOrder} */

  // const [valueSelected, setValueSelected] = useState(props.selectedValue);
  const [disableSave, setDisableSave] = useState(true);
  const [tableData, setTableData] = useState(props.cellData);
  const hotRef = useRef(null);

  useEffect(() => {
    setTableData(props.cellData);
  }, [props.cellData]);

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
                  source: ["CYP1A2","CYP2C18","CYP2C19","CYP2C8","CYP2C9","CYP2D6","CYP2E1","CYP3A4","CYP3A5","CYP3A7","UGT1A1","UGT1A4","UGT1A6","UGT1A9","UGT2B4","UGT2B7"]
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
          // disabled={disableSave}
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
