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

function SelectOutputPathIdGroup(props) {
  const [item, setItem] = React.useState(props.selectedOptions);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setItem(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  useEffect(() => {
    setItem(props.selectedOptions);
  }, [props.selectedOptions]);

  useEffect(() => {
      props.setSelectedOptions(item);
  }, [item]);
  
  return(
    <FormControl sx={{ width: '100%' }}>
    <InputLabel id="demo-multiple-checkbox-label">PathId</InputLabel>
    <Select
      labelId="demo-multiple-checkbox-label"
      id="demo-multiple-checkbox"
      multiple
      value={item || []}
      onChange={handleChange}
      input={<OutlinedInput label="Tag" />}
      renderValue={(selected) => selected.join(', ')}
    >
      {props.options.map((element) => (
        <MenuItem key={element} value={element}>
          <Checkbox checked={item ? item.indexOf(element) > -1 : false} />
          <ListItemText primary={element} />
        </MenuItem>
      ))}
    </Select>
  </FormControl>

  )
}


function OrderOutputPathID(props){
  const [items, setItems] = React.useState(props.selectedOptions);

  const onSortEnd = (oldIndex, newIndex) => {
    setItems((array) => arrayMoveImmutable(array, oldIndex, newIndex));
  };

  useEffect(() => {
    props.setSelectedOptions(items);
  }, [items]);  

  useEffect(() => {
      setItems(props.selectedOptions);
  }, [props.selectedOptions]);

  return (
    <SortableList 
      onSortEnd={onSortEnd} 
      className="list" 
      draggedItemClassName="dragged"
      style={{
        height: 300,
        overflowY: "scroll",
        overflowX: "hidden",
      }}
    >
      {items.map((item) => (
        <SortableItem key={item}>
          <div className="item"
            style={{
              backgroundColor: '#ebebeb',
              padding: '10px',
              // textAlign: 'center',
              margin: '5px 0',
              zIndex: 999999,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <MdDragIndicator style={{marginRight: '10px'}}/>
            {item}
          </div>
        </SortableItem>
      ))}
    </SortableList>
  );
};


function ModalOutputPathID(props) {
  /* props: {showModal, onCloseModal, dropdownOptions, selectedValue, saveChanges} */

  const [outputpathIdSelected, setOutputpathIdSelected] = useState(props.selectedValue);
  const [itemsToSort, setItemsToSort] = useState([]); 
  const [finalOrder, setFinalOrder] = useState([]);
  const [disableSave, setDisableSave] = useState(true);


  useEffect(() => {
    if (props.selectedValue) {
      // props.setOutputpathIdSelected(props.selectedValue);
      setOutputpathIdSelected(props.selectedValue);
    }
    // Update local value when identity someProp changes (identity).
  }, [props.selectedValue]);

  // Enable / disable save button
  useEffect(() => {
    if (finalOrder.length > 0) {
      setDisableSave(false);
    } else {
      setDisableSave(true);
    }
  }, [finalOrder]);
  
  return (
      <Dialog
        fullWidth
        maxWidth="sm"
        aria-labelledby="customized-dialog-title"
        open={props.showModal}
        onClose={props.onCloseModal}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Select OutputPathIds
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
          <Divider style={{marginTop: '5px', marginBottom: '25px'}} >Select <Chip label="OutputPathId" size="small" /></Divider>
          <SelectOutputPathIdGroup
            options={props.dropdownOptions}
            selectedOptions={outputpathIdSelected}
            setSelectedOptions={setItemsToSort}
          />
          <Divider style={{marginTop: '35px', marginBottom: '15px'}}>Order List</Divider>
          <OrderOutputPathID
            selectedOptions={itemsToSort}
            setSelectedOptions={setFinalOrder}
          />
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button 
            autoFocus 
            disabled={disableSave} 
            onClick={() => {
              props.saveChanges(finalOrder);
            }}>
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
  );

}

export default ModalOutputPathID;
