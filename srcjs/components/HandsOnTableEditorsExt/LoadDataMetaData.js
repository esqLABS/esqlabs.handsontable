// LoadDataMetaData.jsx
import React, { useRef, useMemo } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import { HotTable } from "@handsontable/react";
// If you already registered modules elsewhere, you can remove this:
// import { registerAllModules } from "handsontable/registry";
// registerAllModules();
import "handsontable/dist/handsontable.full.min.css";

function LoadDataMetaData(props) {
  // Expect an array of rows (objects preferred)
  const rows = Array.isArray(props.selectedValue) ? props.selectedValue : [];

  // Derive column headers safely
  const colNames = useMemo(() => {
    if (rows.length && rows[0] && typeof rows[0] === "object" && !Array.isArray(rows[0])) {
      return Object.keys(rows[0]);
    }
    // Fallback: no explicit headers (Handsontable will show A, B, C…)
    return [];
  }, [rows]);

  const hotRef = useRef(null);

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      aria-labelledby="customized-dialog-title"
      open={props.showModal}
      onClose={props.onCloseModal}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {"Metadata"}
      </DialogTitle>

      <IconButton
        aria-label="close"
        onClick={props.onCloseModal}
        sx={{ position: "absolute", right: 8, top: 8, color: (t) => t.palette.grey[500] }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <HotTable
          id="hot3"
          ref={hotRef}

          data={props.selectedValue || []}
          columns={[
            { data: "field", readOnly: true },
            { data: "value", readOnly: true }
          ]}
          colHeaders={["Metadata", "Value"]}
          colWidths={[150, 250]}
          rowHeaders={true}
          readOnly={true}
          autoWrapRow={true}
          autoWrapCol={true}
          licenseKey="non-commercial-and-evaluation"
        />
      </DialogContent>

      <Divider />

      <DialogActions>
        <Button autoFocus onClick={props.onCloseModal}>OK</Button>
      </DialogActions>
    </Dialog>
  );
}

export default LoadDataMetaData;
