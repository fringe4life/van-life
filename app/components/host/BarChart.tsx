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
		<ResponsiveContainer width="100%" height={350}>
			<BarChart data={mappedData}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Bar dataKey="amount" fill="oklch(75.27% 0.167 52.58)" />
			</BarChart>
		</ResponsiveContainer>
	);
}
