// General
import React, { useState, useEffect } from "react";
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
import FormControl from "@mui/material/FormControl";
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
// Sortable List
import SortableList, { SortableItem } from 'react-easy-sort'
import { arrayMoveImmutable } from 'array-move'


function ModalProteinOntogeny(props) {
  /* props: {showModal, onCloseModal, dropdownOptions, selectedValue, saveChanges, enableSelectOrder} */

  // const [valueSelected, setValueSelected] = useState(props.selectedValue);
  const [disableSave, setDisableSave] = useState(true);

  return (
      <Dialog
        fullWidth
        maxWidth="sm"
        aria-labelledby="customized-dialog-title"
        open={props.showModal}
        onClose={props.onCloseModal}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {`Select ${props.activeColumnName}`}
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
          <Divider style={{marginTop: '5px', marginBottom: '25px'}} >Select <Chip label={props.activeColumnName} size="small" /></Divider>
          <h1>Protein ontogeny part!</h1>

        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            autoFocus
            disabled={disableSave}
            onClick={() => {
              console.log('Save changes');
              //props.saveChanges(finalOrder);
            }}>
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
  );

}

export default ModalProteinOntogeny;
