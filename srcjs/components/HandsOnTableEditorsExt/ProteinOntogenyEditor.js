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

  getValue() {
    return this.state.value; // Make sure it's a string
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

    const parsed = splitProteinOntogenyToArray(originalValue);

    this.setState({
      cellData: parsed,
      value: originalValue
    });

  }


  saveChanges(value) {
    const joined = joinProteinOntogenyFromArray(value);

    this.setValue(
      joined,
      () => {
        this.saveValue([[joined]], false);  // safe value and ctrlDown
        this._originalFinishEditing(false, false);  // manually finish after saving
      }
    );
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

      //renderResult = Array.isArray(this.props.value)
      //  ? this.props.value.join(", ")
      //  : this.props.value;

      renderResult = "UNKNOWN"

    }

    return renderResult;
  }
}

export default ProteinOntogenyEditor;
