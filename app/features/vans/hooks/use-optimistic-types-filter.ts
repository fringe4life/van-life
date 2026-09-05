import { useOptimistic } from "react";
import type { VanType } from "~/db/enums";
import { typesFilterReducer } from "./types-filter-reducer";

const useOptimisticTypesFilter = (initialTypes: VanType[]) => {
  const [optimisticTypes, addOptimisticType] = useOptimistic(
    initialTypes,
    typesFilterReducer
  );

  const toggleType = (type: VanType) => {
    addOptimisticType({ type });
  };

  const resetTypes = () => {
    addOptimisticType({ type: "reset" });
  };

  return [optimisticTypes, toggleType, resetTypes] as const;
};

export { useOptimisticTypesFilter };
