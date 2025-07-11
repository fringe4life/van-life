import type React from "react";
import { Fragment } from "react";

type ListItemProps<T> = {
  data: T[];
  getKey: (t: T) => React.Key;
  getRow: (t: T) => React.ReactNode;
};

export default function ListItems<T>({
  getKey,
  getRow,
  data,
}: ListItemProps<T>) {
  return data.map((d) => <Fragment key={getKey(d)}>{getRow(d)}</Fragment>);
}
