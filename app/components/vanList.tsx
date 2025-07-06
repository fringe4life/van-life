import React from "react";

interface GenericComponentProps<T, P> {
  Component: React.ComponentType<P>;
  items: T[];
  renderProps: (item: T) => P;
  renderKey: (item: T) => React.Key;
  className: string;
}

const GenericComponent = <T, P>({
  Component,
  items,
  renderProps,
  renderKey,
  className,
}: GenericComponentProps<T, P>) => {
  return (
    <div className={className}>
      {items.map((item) => (
        <Component key={renderKey(item)} {...renderProps(item)} />
      ))}
    </div>
  );
};

export default GenericComponent;
