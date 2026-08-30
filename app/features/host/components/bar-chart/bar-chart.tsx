/**
 * TanStack Charts bar chart. Use `LazyBarChart` from `./lazy-bar-chart` so
 * `@tanstack/charts` is code-split via React.lazy().
 */
// react-doctor-disable-next-line react-doctor/prefer-dynamic-import
import { barY, defineChart } from "@tanstack/charts";
import { Chart } from "@tanstack/charts/react";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";
import type { Data, DataArray } from "~/features/host/types";

/** Matches `--chart-height` in `app.css`. Scene size is a number, not CSS %. */
const CHART_HEIGHT_PX = 350;

const BarChartComponent = <T extends Data<DataArray>>({ data }: T) => {
  const definition = defineChart({
    marks: [
      barY(data, {
        fill: "var(--color-chart-1)",
        key: "id",
        x: "name",
        y: "amount",
      }),
    ],
    scales: {
      x: {
        scale: () => scaleBand<string>().padding(0.18),
      },
      y: {
        grid: true,
        nice: true,
        scale: scaleLinear,
      },
    },
    tooltip,
  });

  return (
    <div className="v-host-chart h-full w-full">
      <Chart
        ariaLabel="Amount by period"
        definition={definition}
        height={CHART_HEIGHT_PX}
      />
    </div>
  );
};

export default BarChartComponent;
