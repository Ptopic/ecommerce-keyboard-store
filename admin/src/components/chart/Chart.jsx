import './chart.css';
import {
	LineChart,
	Line,
	XAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	YAxis,
} from 'recharts';

export default function Chart({ title, data, dataKey, grid, maxValue }) {
	return (
		<div className="chart">
			<h3 className="chartTitle">{title}</h3>
			<ResponsiveContainer width="100%" aspect={4 / 1}>
				<LineChart data={data}>
					<XAxis dataKey="dateFormated" interval="preserveStartEnd" />
					<YAxis
						type="number"
						domain={[0, maxValue]}
						stroke="#ef5865"
						tickFormatter={(value) =>
							new Intl.NumberFormat('en-US', {
								notation: 'compact',
								compactDisplay: 'short',
							}).format(value)
						}
						tickCount={10}
						padding={{ top: 30 }}
						interval={1}
						allowDecimals={false}
					/>
					<Line type="monotone" dataKey={dataKey} stroke="#ef5865" />
					<Tooltip />
					{grid && <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />}
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
