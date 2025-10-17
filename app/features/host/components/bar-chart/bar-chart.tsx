import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

type BarChartComponentProps = {
	mappedData: {
		name: string;
		amount: number;
	}[];
};

export default function BarChartComponent({
	mappedData,
}: BarChartComponentProps) {
	return (
		<div className="h-[var(--chart-height)] w-full">
			<BarChart data={mappedData} height="100%" responsive width="100%">
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Bar dataKey="amount" fill="oklch(75.27% 0.167 52.58)" />
			</BarChart>
		</div>
	);
}
