// React Dependancies
import React from "react";
// HandsOnTable
import { BaseEditorComponent } from "@handsontable/react";
// Components
import ModalProteinOntogeny from "./ModalProteinOntogeny.js";

class ProteinOntogenyEditor extends BaseEditorComponent {
  constructor(props) {
    super(props);

    this.editorRef = React.createRef(null);

    this.state = {
      renderResult: null,
      value: null,
      modalVisible: false
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


  prepare(row, col, prop, td, originalValue, cellProperties) {
    super.prepare(row, col, prop, td, originalValue, cellProperties);

  }

  convertIntoArrType(value) {
    return typeof value === "string" && value.length !== 0
      ? value.split(",")
      : value;
  }

  saveChanges(value) {
    this.setValue(typeof value === "string" ? value.split(",") : value, () => {
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
            showModal={this.state.modalVisible}
            onCloseModal={this.close.bind(this)}
            activeColumnName={this.props.activeColumnName}
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
