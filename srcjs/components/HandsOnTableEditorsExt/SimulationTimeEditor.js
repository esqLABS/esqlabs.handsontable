// React Dependancies
import React from "react";
// HandsOnTable
import { BaseEditorComponent } from "@handsontable/react";
// Components
import SimulationTimeModal from "./SimulationTimeModal.js";
// Utils
import { getSimulationTimeValue } from "../../utils/simulationTime";


class SimulationTimeEditor extends BaseEditorComponent {
  constructor(props) {
    super(props);

    this.editorRef = React.createRef(null);

    this.state = {
      renderResult: null,
      value: null,
      modalVisible: false,
      cellData: null,
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
    // To be removed: this.state.value;
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
      cellData: getSimulationTimeValue(
        this.props.parentData,
        row,
        col,
        this.props.columnNames
      )
    }, () => {
      console.log("State updated in prepare:", this.state.value);
    });

  }


  saveChanges(value) {
    // this.setValue(value, () => {
    //  console.log("Value saved: ", value);
    //  this.finishEditing();
    //});
    this.finishEditing();
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
            <SimulationTimeModal
             // key={this.state.modalVisible ? "open" : "closed"} // Force re-render
              showModal={this.state.modalVisible}
              onCloseModal={this.close.bind(this)}
              cellData={this.state.cellData || []} // Ensure it's always an array
              onDataSubmit={this.props.handleSimulationTimeModalDataSubmit.bind(this)}
              saveEditorValue={this.setValue.bind(this)}
            />

        </div>
      );
    } else if (this.props.isRenderer) {
      console.log("this.props.value", this.props.value);
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

export default SimulationTimeEditor;
