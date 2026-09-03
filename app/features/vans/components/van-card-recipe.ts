import { cva } from "../../../../styled-system/css";

const vanCard = cva({
  base: {},
  variants: {
    state: {
      available: {},
      new: {
        backgroundColor: "status.new/10",
        borderColor: "status.new",
        borderStyle: "solid",
        borderWidth: "2",
      },
      repair: {
        backgroundColor: "status.repair/10",
        borderColor: "status.repair",
        borderStyle: "solid",
        borderWidth: "2",
      },
      sale: {
        backgroundColor: "status.sale/10",
        borderColor: "status.sale",
        borderStyle: "solid",
        borderWidth: "2",
      },
    },
  },
});

export { vanCard };
