import { textRenderer, autocompleteRenderer } from 'handsontable/renderers';

export function readOnlyStyleRenderer(
  instance,
  td,
  row,
  col,
  prop,
  value,
  cellProperties
) {
  textRenderer.apply(this, arguments);
  td.style.background = "#eeeeee";
}

export function invalidCellRenderer(
  instance,
  td,
  row,
  col,
  prop,
  value,
  cellProperties
) {
  textRenderer.apply(this, arguments);
  td.style.background = "#ffbeba";
}


export function invalidDropdownCellRenderer(
  instance,
  td,
  row,
  col,
  prop,
  value,
  cellProperties
) {
  autocompleteRenderer.apply(this, arguments);
  td.style.background = "#ffbeba";
}



export function proteinOntogenyAlwaysDoubleClickRenderer(instance, td, row, col, prop, value, cellProperties) {
  // Always render "DOUBLE CLICK" no matter the real value
  td.innerHTML = "DOUBLE CLICK";
  td.style.color = "#bbb";
  td.style.fontStyle = "italic";
  return td;
}


export function scenarioNameCellRenderer(instance, td, row, col, prop, value, cellProperties) {
  textRenderer.apply(this, arguments);

  const allValues = instance.getDataAtCol(col);

  // Find all rows with the same value
  const duplicateRows = allValues
    .map((v, i) => (v === value ? i + 1 : null)) // +1 for 1-based row numbers
    .filter(v => v !== null);

  const isDuplicate = duplicateRows.length > 1;

  if (isDuplicate) {
    td.style.background = "#ffbeba";
    td.title = `Scenario "${value}" is duplicated in rows: ${duplicateRows.join(", ")}`;
  } else {
    td.style.background = "#ffffff";
    td.title = ""; // Clear tooltip for non-duplicates
  }
}




export function dropdownValidationRenderer(instance, td, row, col, prop, value, cellProperties) {
  autocompleteRenderer.apply(this, arguments);

  const validSource = cellProperties.source || [];
  const scenarioName = instance.getDataAtRowProp(row, "Scenario_name");

  let tabName;
  switch (prop) {
    case "IndividualId":
      tabName = "Individuals";
      break;
    case "PopulationId":
      tabName = "Populations";
      break;
    default:
      tabName = "UNKNOWN";
  }

  if (value && !validSource.includes(value)) {
    td.style.background = "#ffbeba";
    td.title = `${prop} "${value}" is defined for scenario "${scenarioName}", but is not present in the '${tabName}' tab!`;
  } else {
    td.style.background = "#ffffff";
    td.title = "";
  }
}


export function simulationTimeCellRenderer(instance, td, row, col, prop, value, cellProperties) {
  textRenderer.apply(this, arguments);
  td.title = `Double click on cell to open Enter Simulation Time modal`;
  return td;
}

// Add/Delete buttons as the last column
export function actionButtonsCellRenderer(instance, td, row, col, prop, value, cellProps, forceCutRowContent) {
  td.innerHTML = "";
  td.className = (td.className || "") + " htCenter htMiddle";

  const wrap = document.createElement("div");
  wrap.style.display = "flex";
  wrap.style.gap = "6px";
  wrap.style.justifyContent = "center";

  // Add button
  const addBtn = document.createElement("button");
  addBtn.title = "Add row below";
  addBtn.style.border = "none";
  addBtn.style.background = "transparent";
  addBtn.style.cursor = "pointer";
  addBtn.style.display = "flex";
  addBtn.style.alignItems = "center";
  addBtn.style.justifyContent = "center";

  addBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
         viewBox="0 0 24 24" fill="none" stroke="#bbbbbb"
         stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  `;
  addBtn.addEventListener("mousedown", (e) => e.stopPropagation());
  addBtn.addEventListener("click", (e) => {
    e.preventDefault(); e.stopPropagation();
    instance.alter("insert_row_below", row + 1, 1);
  });

  // Delete button
  const delBtn = document.createElement("button");
  delBtn.title = "Delete row";
  delBtn.style.border = "none";
  delBtn.style.background = "transparent";
  delBtn.style.cursor = "pointer";
  delBtn.style.display = "flex";
  delBtn.style.alignItems = "center";
  delBtn.style.justifyContent = "center";

  // insert inline SVG icon
  delBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
         viewBox="0 0 24 24" fill="none" stroke="#c0392b"
         stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
      <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
    </svg>
  `;
  delBtn.addEventListener("mousedown", (e) => e.stopPropagation());
  delBtn.addEventListener("click", (e) => {
    e.preventDefault(); e.stopPropagation();
    const rowCount = instance.countRows();
    if (rowCount === 1) {
      try {
        forceCutRowContent(instance, 0);
      } catch {
        const rowData = instance.getSourceDataAtRow(0);
        if (rowData && typeof rowData === "object") {
          Object.keys(rowData).forEach((k) => (rowData[k] = null));
          instance.render();
        }
      }
    } else {
      instance.alter("remove_row", row, 1);
    }
  });

  wrap.appendChild(addBtn);
  wrap.appendChild(delBtn);
  td.appendChild(wrap);
  return td;
}

