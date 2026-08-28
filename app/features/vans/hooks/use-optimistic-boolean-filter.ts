import { useOptimistic } from "react";
import { booleanFilterReducer } from "./boolean-filter-reducer";

const useOptimisticBooleanFilter = (initialValue: boolean) => {
  const [optimisticValue, addOptimistic] = useOptimistic(
    initialValue,
    booleanFilterReducer
  );

  const toggleOptimistic = () => {
    addOptimistic({ type: "toggle" });
  };

  const resetOptimistic = () => {
    addOptimistic({ type: "reset" });
  };

  return [optimisticValue, toggleOptimistic, resetOptimistic] as const;
};

export { useOptimisticBooleanFilter };
