// React Dependancies
import React from "react";
// Material Design
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
// HandsOnTable
import { BaseEditorComponent } from "@handsontable/react";

class DropDownEditor extends BaseEditorComponent {
  constructor(props) {
    super(props);

    this.editorRef = React.createRef(null);

    this.editorContainerStyle = {
      display: "none",
      position: "absolute",
      left: 0,
      top: 0,
      zIndex: 999,
      background: "#fff",
      padding: "15px",
      border: "1px solid #cecece",
    };

    this.state = {
      renderResult: null,
      value: null,
    };
  }

  stopMousedownPropagation(e) {
    e.stopPropagation();
  }

  setValue(value, callback) {
    this.setState((state, props) => {
      return { value: value };
    }, callback);
  }

  getValue() {
    return this.state.value;
  }

  open() {
    this.editorRef.current.style.display = "block";
  }

  close() {
    this.editorRef.current.style.display = "none";

    this.setState({
      pickedColor: null,
    });
  }

  prepare(row, col, prop, td, originalValue, cellProperties) {
    super.prepare(row, col, prop, td, originalValue, cellProperties);

    const tdPosition = td.getBoundingClientRect();

    this.editorRef.current.style.left =
      tdPosition.left + window.pageXOffset + "px";
      tdPosition.left + "px";
    this.editorRef.current.style.top =
      tdPosition.top + window.pageYOffset + "px";
  }

  applyColor() {
    this.finishEditing();
  }

  onPickedValue(selected) {
    const {
      target: { value },
    } = selected;
    this.setValue(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
      // value.join(', ')
    );
    // console.log(selected.target.value)
    // this.setValue(selected.target.value);
  }

  convertIntoArrType(value) {
    return typeof value === "string" && value.length !== 0
      ? value.split(",")
      : value;
  }

  render() {
    let renderResult = [];

    if (this.props.isEditor) {
      renderResult = (
        <div
          style={this.editorContainerStyle}
          ref={this.editorRef}
          onMouseDown={this.stopMousedownPropagation}
        >
          <Stack direction="column" style={{ width: 250 }} spacing={2}>
            <FormControl size="small">
              <InputLabel id="demo-multiple-checkbox-label">
                {this.props.titleName}
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={
                  this.convertIntoArrType(this.state.value) ||
                  this.convertIntoArrType(this.state.pickedColor) ||
                  []
                }
                onChange={this.onPickedValue.bind(this)}
                input={<OutlinedInput label={this.props.titleName} />}
                renderValue={(selected) => selected.join(", ")}
                //   MenuProps={MenuProps}
              >
                {this.props.dropdownOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    <Checkbox
                      checked={
                        this.state.value !== null
                          ? this.state.value.indexOf(option) > -1
                          : null
                      }
                    />
                    <ListItemText primary={option} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button color="primary" onClick={this.applyColor.bind(this)}>
              Apply
            </Button>
          </Stack>
          {/*
          <button
            style={{ width: "100%", height: "33px", marginTop: "10px" }}
            onClick={this.applyColor.bind(this)}
          >
            Apply
          </button> */}
        </div>
      );
    } else if (this.props.isRenderer) {
      const colorboxStyle = {
        //   background: this.props.value,
        width: "21px",
        height: "21px",
        float: "left",
        marginRight: "5px",
      };

      renderResult = Array.isArray(this.props.value)
        ? this.props.value.join(", ")
        : this.props.value;

      //   renderResult = (
      //       <div style={colorboxStyle} >
      //         {Array.isArray(this.props.value)
      //           ? this.props.value.join(", ")
      //           : this.props.value}
      //       </div>
      //   );
    }

    return renderResult;
  }
}

export default DropDownEditor;
