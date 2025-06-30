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
