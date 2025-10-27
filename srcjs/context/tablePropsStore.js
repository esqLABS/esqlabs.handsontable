let state = {}; // { [tableKey]: { ...props } }
const listeners = new Set();

export function setTableProps(tableKey, nextProps) {
  state = { ...state, [tableKey]: { ...(state[tableKey] || {}), ...nextProps } };
  listeners.forEach(l => l());
}

export function getTableProps() {
  return state;
}

export function subscribeTableProps(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
