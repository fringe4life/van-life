import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

export type DataArray = {
	name: string;
	amount: number;
}[];

const BarChartComponent = <T extends { data: DataArray }>({ data }: T) => (
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
