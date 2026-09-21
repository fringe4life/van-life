/**
 * TanStack Charts bar chart. Use `LazyBarChart` from `./lazy-bar-chart` so
 * `@tanstack/charts` is code-split via React.lazy().
 */
// react-doctor-disable-next-line react-doctor/prefer-dynamic-import
import {
  barY,
  colorLegend,
  colorLegendItems,
  defineChart,
} from "@tanstack/charts";
import { Chart } from "@tanstack/charts/react";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scaleOrdinal } from "@tanstack/charts/scales/ordinal";
import { tooltip } from "@tanstack/charts/tooltip";
import { ViewTransition } from "react";
import { css } from "styled-system/css";
import { chromeViewTransitionName } from "~/components/view-transition-names";
import { viewTransitionPage } from "~/components/view-transition-share";
import type { Data, DataArray } from "~/features/host/types";
import type { ChartHeightBandKey } from "~/features/host/utils/chart-height-bands";
import {
  CHART_HEIGHT_BAND_COLORS,
  getChartBarPoints,
  getChartHeightBands,
  getChartMagnitudeMax,
} from "~/features/host/utils/chart-height-bands";

/** Matches `--chart-height` in `app.css`. Scene size is a number, not CSS %. */
const CHART_HEIGHT_PX = 350;
const BAR_RADIUS_PX = 6;

const createBandDefinition = (data: DataArray) => {
  const bandData = getChartBarPoints(data);
  const bands = getChartHeightBands(getChartMagnitudeMax(data));
  const bandKeys = bands.map(({ key }) => key);
  const bandLabels = new Map(bands.map(({ key, label }) => [key, label]));
  const colorScale = scaleOrdinal(bandKeys, CHART_HEIGHT_BAND_COLORS);

  return defineChart({
    color: {
      legend: colorLegend<ChartHeightBandKey>({
        items: colorLegendItems<ChartHeightBandKey>({
          label: {
            format: (key) => bandLabels.get(key) ?? key,
          },
        }),
        label: "Amount bands",
      }),
      scale: colorScale,
    },
    marks: [
      barY(bandData, {
        color: "bandKey",
        key: "id",
        radius: { end: BAR_RADIUS_PX },
        stroke: "var(--colors-surface)",
        strokeWidth: 1,
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
    tooltip: {
      items: [
        { channel: "x", label: "Period" },
        { field: "sourceAmount", label: "Amount" },
        { field: "bandLabel", label: "Relative band" },
      ],
      use: tooltip,
    },
  });
};

const BarChartComponent = ({ data }: Data<DataArray>) => (
  <ViewTransition
    {...viewTransitionPage}
    name={chromeViewTransitionName.hostChart}
  >
    <div
      className={css({
        blockSize: "full",
        color: "chart.1",
        inlineSize: "full",
      })}
    >
      <Chart
        ariaLabel="Amount bands by period"
        definition={createBandDefinition(data)}
        height={CHART_HEIGHT_PX}
      />
    </div>
  </ViewTransition>
);

export default BarChartComponent;
