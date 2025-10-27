import React from "react";
import { useTableProps } from "./useTableProps";

// Usage: withTableProps("scenarios", { individual_ids_options: [] })(ScenarioTable)
export const withTableProps = (tableKey, defaults = {}) => (Component) => (props) => {
  const injected = useTableProps(tableKey) || {};
  // defaults first, then injected store values, then explicit props from parent (parent wins)
  return <Component {...defaults} {...injected} {...props} />;
};
