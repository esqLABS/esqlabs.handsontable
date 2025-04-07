// React Dependancies
import React from "react";
// HandsOnTable
import { BaseEditorComponent } from "@handsontable/react";
// Components
import ModalProteinOntogeny from "./ModalProteinOntogeny.js";
// Utils
import { splitProteinOntogenyToArray, joinProteinOntogenyFromArray } from "../../utils/proteinOntogenyModalUtils.js";

class ProteinOntogenyEditor extends BaseEditorComponent {
  constructor(props) {
    super(props);

    this.editorRef = React.createRef(null);

    this.state = {
      renderResult: null,
      value: null,
      modalVisible: false,
      cellData: null
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
    // Open modal window
    this.setState({ modalVisible: true });
  }

  close() {
    // Close modal window
    this.setState({ modalVisible: false });
  }

  // Override `finishEditing` to no-op until explicitly called
  finishEditing(restoreOriginalValue, ctrlPressed, callback) {
    if (!this.state.modalVisible) {
      // Only call parent finishEditing if modal is already closed
      super.finishEditing(restoreOriginalValue, ctrlPressed, callback);
    }
    // Otherwise do nothing (wait for user to press Save)
  }


  prepare(row, col, prop, td, originalValue, cellProperties) {
    super.prepare(row, col, prop, td, originalValue, cellProperties);

    const parsed = splitProteinOntogenyToArray(originalValue);

    this.setState({
      cellData: parsed,
      value: originalValue
    }, () => {
      console.log("Original value:", originalValue);
      console.log("Parsed cellData:", this.state.cellData);
      console.log("Raw value stored:", this.state.value);
    });

  }

  convertIntoArrType(value) {
    return typeof value === "string" && value.length !== 0
      ? value.split(",")
      : value;
  }

  saveChanges(value) {
    this.setValue({
      value: joinProteinOntogenyFromArray(value),
    }, () => {
      console.log("State updated in saveChanges:", this.state.value);
      console.log("State updated param `value`:", value);
      this.finishEditing();
    });
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

          <ModalProteinOntogeny
            cellData={this.state.cellData} // Ensure it's always an array
            showModal={this.state.modalVisible}
            onCloseModal={this.close.bind(this)}
            saveChanges={this.saveChanges.bind(this)}
            activeColumnName={this.props.activeColumnName}
            windowTitle={this.props.windowTitle}
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

export default ProteinOntogenyEditor;
