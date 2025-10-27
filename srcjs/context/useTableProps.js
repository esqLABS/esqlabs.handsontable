import { useSyncExternalStore } from "react";
import { getTableProps, subscribeTableProps } from "./tablePropsStore";

export function useTableProps(tableKey) {
  const snapshot = useSyncExternalStore(
    subscribeTableProps,
    getTableProps,
    getTableProps
  );
  return (snapshot && snapshot[tableKey]) || {}; // never undefined
}
