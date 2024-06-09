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