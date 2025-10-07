import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
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
			<ResponsiveContainer height="100%" width="100%">
				<BarChart data={mappedData}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Bar dataKey="amount" fill="oklch(75.27% 0.167 52.58)" />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
