// React Dependancies
import React from "react";
// HandsOnTable
import { BaseEditorComponent } from "@handsontable/react";
// Components
import ModalShowDropdownAndSortValue from "./ModalShowDropdownAndSortValue.js";

class DropDownEditor extends BaseEditorComponent {
  constructor(props) {
    super(props);

    this.editorRef = React.createRef(null);

    this.state = {
      renderResult: null,
      value: null,
      modalVisible: false,
      cellData: null
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
    // Open modal window
    this.setState({ modalVisible: true });
  }

  close() {
    // Close modal window
    this.setState({ modalVisible: false });
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

  convertIntoArrType(value) {
    return typeof value === "string" && value.length !== 0
      ? value.split(",")
      : value;
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
            dropdownOptions={this.props.dropdownOptions}
            selectedValue={
              this.convertIntoArrType(this.state.value) ||
              []
            }
            saveChanges={this.saveChanges.bind(this)}
            enableSelectOrder={this.props.enableSelectOrder}
            activeColumnName={this.props.activeColumnName}
            placeHolderTitle={this.props.placeHolderTitle}
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
