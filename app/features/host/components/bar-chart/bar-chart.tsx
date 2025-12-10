import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

export type BarChartComponentProps = {
	mappedData: {
		name: string;
		amount: number;
	}[];
};

export default function BarChartComponent({
	mappedData,
}: BarChartComponentProps) {
	return (
		<div className="h-full w-full text-orange-400">
			<BarChart data={mappedData} height="100%" responsive width="100%">
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Bar dataKey="amount" fill="currentColor" />
			</BarChart>
		</div>
	);
}
