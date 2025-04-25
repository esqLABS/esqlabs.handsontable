import { textRenderer } from 'handsontable/renderers';

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
