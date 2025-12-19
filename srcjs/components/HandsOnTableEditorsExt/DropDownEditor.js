// React Dependancies
import React from "react";
// HandsOnTable
import { BaseEditorComponent } from "@handsontable/react";
// Components
import ModalShowDropdownAndSortValue from "./ModalShowDropdownAndSortValue.js";
// Utils
import { splitOutsideQuotes } from "../../utils/utils.js";
// Store - for subscribing to latest dropdown options
import { getTableProps, subscribeTableProps } from "../../context/tablePropsStore";

class DropDownEditor extends BaseEditorComponent {
  constructor(props) {
    super(props);

    this.editorRef = React.createRef(null);

    this.state = {
      renderResult: null,
      value: null,
      modalVisible: false,
      cellData: null,
      // Capture dropdown options when modal opens to ensure latest data
      currentDropdownOptions: null
    };

    // Preserve original finishEditing
    this._originalFinishEditing = super.finishEditing.bind(this);

  }

  stopMousedownPropagation(e) {
    e.stopPropagation();
  }

  setValue(value, callback) {
    this.setState((state, props) => {
      return { value: value };
    }, callback);
  }

  setCellData(value, callback) {
    this.setState((state, props) => {
      return { cellData: value };
    }, callback);
  }

  getValue() {
    return this.state.value;
  }

  open() {
    // Open modal window and capture current dropdown options at open time
    // This ensures we always have the latest options even if props were stale
    // If storeKey and optionsKey are provided, fetch from store for latest data
    let latestOptions = this.props.dropdownOptions;

    if (this.props.storeKey && this.props.optionsKey) {
      const storeState = getTableProps();
      const tableState = storeState[this.props.storeKey];

      // Debug logging
      console.log(`[DropDownEditor] open() called for ${this.props.optionsKey}`);
      console.log(`[DropDownEditor] storeKey: ${this.props.storeKey}`);
      console.log(`[DropDownEditor] Full store state:`, storeState);
      console.log(`[DropDownEditor] Table state:`, tableState);
      console.log(`[DropDownEditor] Raw options from store:`, tableState?.[this.props.optionsKey]);
      console.log(`[DropDownEditor] Props dropdownOptions:`, this.props.dropdownOptions);

      if (tableState && tableState[this.props.optionsKey]) {
        // Apply transformation if provided (e.g., wrapIntoQuotes)
        const rawOptions = tableState[this.props.optionsKey];
        latestOptions = this.props.transformOptions
          ? this.props.transformOptions(rawOptions)
          : rawOptions;
        console.log(`[DropDownEditor] Using store options (transformed):`, latestOptions);
      } else {
        console.log(`[DropDownEditor] Store options not found, using props`);
      }
    }

    this.setState({
      modalVisible: true,
      currentDropdownOptions: latestOptions
    });
  }

  close() {
    // Close modal window and clear captured options
    this.setState({
      modalVisible: false,
      currentDropdownOptions: null
    });
  }

      // Override `finishEditing` to no-op until explicitly called
  finishEditing() {
    if (!this.state.modalVisible) {
      // finishEditing expects (restoreOriginalValue = false, ctrlDown = false)
      this._originalFinishEditing(false, false);
    }
    // If modal is open, do nothing (user is still editing)
  }


  prepare(row, col, prop, td, originalValue, cellProperties) {
    super.prepare(row, col, prop, td, originalValue, cellProperties);
    this.setState({
      cellData: {
        originalValue,
        row,
        col
      }
    }, () => {
      console.log("State updated in prepare:", this.state.value);
    });

  }

  convertIntoArrType(value, smart = false) {
    if (typeof value === "string" && value.length !== 0) {
      if (smart) {

        const matches = splitOutsideQuotes(value);
        return matches.length > 0
          ? matches.map(s => {
              const trimmed = s.trim();
              return /^".*"$/.test(trimmed) ? trimmed : `"${trimmed}"`;
            })
          : [`"${value.trim()}"`]; // fallback: quote the whole trimmed string

      } else {

        return value
          .split(",")
          .map(s => s.trim())
          .filter(s => s !== "");

      }
    }
    return value;
  }

  saveChanges(value) {
    this.props.handleDropdownModalDataSubmit(
      value,
      this.state.cellData.col,
      this.state.cellData.row,
      this.state.cellData.originalValue

    )
    // this.setValue(typeof value === "string" ? value.split(",") : value, () => {
    //  this.finishEditing();
    // });
    this.finishEditing();
    this.close();
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
          <ModalShowDropdownAndSortValue
            showModal={this.state.modalVisible}
            onCloseModal={this.close.bind(this)}
            dropdownOptions={this.state.currentDropdownOptions || this.props.dropdownOptions}
            selectedValue={
              this.convertIntoArrType(this.state.value, this.props.splitBySentence) ||
              []
            }
            saveChanges={this.saveChanges.bind(this)}
            enableSelectOrder={this.props.enableSelectOrder}
            activeColumnName={this.props.activeColumnName}
            placeHolderTitle={this.props.placeHolderTitle}
            enableListSecondaryText={this.props.enableListSecondaryText}
            {...(this.props.enableListSecondaryText && {
              listSecondaryDictionary: (this.props.listSecondaryDictionary),
            })}
            {...(this.props.modalWindowTitle && {
              modalWindowTitle: (this.props.modalWindowTitle)
            })}
          />

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

    }

    return renderResult;
  }
}

export default DropDownEditor;
