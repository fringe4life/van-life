import React from "react";

interface GenericComponentProps<T, P> {
  Component: React.ComponentType<P>;
  items: T[];
  renderProps: (item: T) => P;
  renderKey: (item: T) => React.Key;
}

const GenericComponent = <T, P>({
  Component,
  items,
  renderProps,
  renderKey,
}: GenericComponentProps<T, P>) => {
  return (
    <div>
      {items.map((item) => (
        <Component key={renderKey(item)} {...renderProps(item)} />
      ))}
    </div>
  );
};

export default GenericComponent