/**
 * Recharts implementation — client-only (`.client`) so `es-toolkit` stays out of the SSR graph.
 * Use `LazyBarChart` from `./lazy-bar-chart` so recharts is code-split via React.lazy().
 */
// react-doctor-disable-next-line react-doctor/prefer-dynamic-import
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Data, DataArray } from "~/features/host/types";

const BarChartComponent = <T extends Data<DataArray>>({ data }: T) => (
  <div className="h-full w-full text-orange-400">
    <BarChart data={data} height="100%" responsive width="100%">
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="amount" fill="currentColor" />
    </BarChart>
  </div>
);

export default BarChartComponent;
