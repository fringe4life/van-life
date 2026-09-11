import { cva } from "styled-system/css";

const vanCard = cva({
  base: {},
  variants: {
    state: {
      AVAILABLE: {},
      IN_REPAIR: {
        backgroundColor: "status.repair/10",
        borderColor: "status.repair",
        borderStyle: "solid",
        borderWidth: "2",
      },
      NEW: {
        backgroundColor: "status.new/10",
        borderColor: "status.new",
        borderStyle: "solid",
        borderWidth: "2",
      },
      ON_SALE: {
        backgroundColor: "status.sale/10",
        borderColor: "status.sale",
        borderStyle: "solid",
        borderWidth: "2",
      },
    },
  },
});

export { vanCard };
