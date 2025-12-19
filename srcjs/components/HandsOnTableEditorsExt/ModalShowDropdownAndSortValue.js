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
import DeleteIcon from "@mui/icons-material/Delete";
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
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// Sortable List
import SortableList, { SortableItem } from 'react-easy-sort'
import { arrayMoveImmutable } from 'array-move'

function UnavailableItemsWarning({ unavailableItems, onRemoveItem, onRemoveAll }) {
  if (!unavailableItems || unavailableItems.length === 0) {
    return null;
  }

  return (
    <Alert
      severity="warning"
      sx={{ mb: 2 }}
      action={
        <Button
          color="inherit"
          size="small"
          onClick={onRemoveAll}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Remove All
        </Button>
      }
    >
      <AlertTitle>Unavailable Items</AlertTitle>
      <Typography variant="body2" sx={{ mb: 1 }}>
        The following items no longer exist and must be removed before you can continue:
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
        {unavailableItems.map((item) => (
          <Chip
            key={item}
            label={item}
            onDelete={() => onRemoveItem(item)}
            deleteIcon={<DeleteIcon />}
            color="warning"
            variant="outlined"
            sx={{
              textDecoration: 'line-through',
              '& .MuiChip-label': { color: 'error.main' }
            }}
          />
        ))}
      </Box>
    </Alert>
  );
}

function SelectValueGroup(props) {
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
    <FormControl sx={{ width: '100%' }} disabled={props.disabled}>
    <InputLabel id="demo-multiple-checkbox-label">{props.placeHolderTitle}</InputLabel>
    <Select
      labelId="demo-multiple-checkbox-label"
      id="demo-multiple-checkbox"
      multiple
      value={item || []}
      onChange={handleChange}
      input={<OutlinedInput label="Tag" />}
      renderValue={(selected) => selected.join(', ')}
      disabled={props.disabled}
    >
      {props.options.map((element) => (
        <MenuItem key={element} value={element}>
          <Checkbox checked={item ? item.indexOf(element) > -1 : false} />
          <ListItemText
            primary={element}
            {...(props.enableListSecondaryText && {
                secondary: props.listSecondaryDictionary[(element)],
            })}
          />
        </MenuItem>
      ))}
    </Select>
  </FormControl>

  )
}


function OrderItems(props){
  const [items, setItems] = React.useState(props.selectedOptions);

  const onSortEnd = (oldIndex, newIndex) => {
    if (props.disabled) return;
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
        opacity: props.disabled ? 0.5 : 1,
        pointerEvents: props.disabled ? 'none' : 'auto',
      }}
    >
      {items.map((item) => (
        <SortableItem key={item} disabled={props.disabled}>
          <div className="item"
            style={{
              backgroundColor: '#ebebeb',
              padding: '10px',
              margin: '5px 0',
              zIndex: 999999,
              display: 'flex',
              alignItems: 'center',
              cursor: props.disabled ? 'not-allowed' : 'grab',
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


function ModalShowDropdownAndSortValue(props) {
  /* props: {showModal, onCloseModal, dropdownOptions, selectedValue, saveChanges, enableSelectOrder} */

  const [valueSelected, setValueSelected] = useState(props.selectedValue);
  const [itemsToSort, setItemsToSort] = useState([]);
  const [finalOrder, setFinalOrder] = useState([]);
  const [disableSave, setDisableSave] = useState(true);
  const [unavailableItems, setUnavailableItems] = useState([]);

  // Calculate unavailable items (selected but not in dropdown options)
  useEffect(() => {
    if (props.selectedValue && props.dropdownOptions) {
      const unavailable = props.selectedValue.filter(
        (item) => !props.dropdownOptions.includes(item)
      );
      setUnavailableItems(unavailable);
    } else {
      setUnavailableItems([]);
    }
  }, [props.selectedValue, props.dropdownOptions]);

  // Check if controls should be disabled (when unavailable items exist)
  const hasUnavailableItems = unavailableItems.length > 0;

  // Handler to remove a single unavailable item
  const handleRemoveUnavailableItem = (itemToRemove) => {
    setUnavailableItems((prev) => prev.filter((item) => item !== itemToRemove));
    setValueSelected((prev) => prev ? prev.filter((item) => item !== itemToRemove) : []);
  };

  // Handler to remove all unavailable items
  const handleRemoveAllUnavailable = () => {
    const availableOnly = valueSelected ? valueSelected.filter(
      (item) => props.dropdownOptions.includes(item)
    ) : [];
    setUnavailableItems([]);
    setValueSelected(availableOnly);
  };

  useEffect(() => {
    if (props.selectedValue) {
      setValueSelected(props.selectedValue);
    }
    // Update local value when identity someProp changes (identity).
  }, [props.selectedValue]);

  // Check if dropdown options are empty
  const hasNoDropdownOptions = !props.dropdownOptions || props.dropdownOptions.length === 0;

  // Enable / disable save button - original logic plus unavailable items check
  // Also enable save when no options available (to clear cell)
  useEffect(() => {
    if (!hasUnavailableItems && (finalOrder.length > 0 || hasNoDropdownOptions)) {
      setDisableSave(false);
    } else {
      setDisableSave(true);
    }
  }, [finalOrder, hasUnavailableItems, hasNoDropdownOptions]);

  return (
      <Dialog
        fullWidth
        maxWidth="sm"
        aria-labelledby="customized-dialog-title"
        open={props.showModal}
        onClose={props.onCloseModal}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {props.modalWindowTitle || `Select ${props.activeColumnName}`}
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
          {/* Warning for unavailable items - must be resolved before editing */}
          <UnavailableItemsWarning
            unavailableItems={unavailableItems}
            onRemoveItem={handleRemoveUnavailableItem}
            onRemoveAll={handleRemoveAllUnavailable}
          />

          <Divider style={{marginTop: '5px', marginBottom: '25px'}} >Select <Chip label={props.activeColumnName} size="small" /></Divider>

          {/* Show message when no dropdown options available */}
          {hasNoDropdownOptions && !hasUnavailableItems && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                No options available. Click "Save changes" to clear the cell.
              </Typography>
            </Alert>
          )}

          {props.enableSelectOrder ? (
            <>
              <SelectValueGroup
                options={props.dropdownOptions}
                selectedOptions={valueSelected}
                setSelectedOptions={setItemsToSort}
                placeHolderTitle={props.placeHolderTitle}
                enableListSecondaryText={props.enableListSecondaryText}
                disabled={hasUnavailableItems}
                {...(props.enableListSecondaryText && {
                  listSecondaryDictionary: props.listSecondaryDictionary,
                })}
              />

              <Divider style={{marginTop: '35px', marginBottom: '15px'}}>Order List</Divider>
              <OrderItems
                selectedOptions={itemsToSort}
                setSelectedOptions={setFinalOrder}
                disabled={hasUnavailableItems}
              />
            </>
          ) : (
            <>
              <SelectValueGroup
                options={props.dropdownOptions}
                selectedOptions={valueSelected}
                setSelectedOptions={setFinalOrder}
                placeHolderTitle={props.placeHolderTitle}
                enableListSecondaryText={props.enableListSecondaryText}
                disabled={hasUnavailableItems}
                {...(props.enableListSecondaryText && {
                  listSecondaryDictionary: props.listSecondaryDictionary,
                })}
              />
            </>
          )}

        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            autoFocus
            disabled={disableSave}
            onClick={() => {
              // Pass empty array to clear cell when no options available, otherwise pass finalOrder
              // Empty array will be converted to null in prepareShinyData
              props.saveChanges(hasNoDropdownOptions && finalOrder.length === 0 ? [] : finalOrder);
            }}>
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
  );

}

export default ModalShowDropdownAndSortValue;
