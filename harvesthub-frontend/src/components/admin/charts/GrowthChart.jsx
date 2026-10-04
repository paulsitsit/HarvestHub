import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const monthLabel = (year, month) => {
  if (!year || !month) {
    return 'Unknown';
  }

  return new Intl.DateTimeFormat(
    'en-PH',
    {
      month: 'short',
      year: 'numeric'
    }
  ).format(new Date(year, month - 1, 1));
};

const GrowthChart = ({
  data = []
}) => {
  const chartData = data.map((item) => ({
    period: monthLabel(
      item._id?.year,
      item._id?.month
    ),
    farmers: item.farmers || 0
  }));

  return (
    <div>
      <div
        className="h-72 w-full"
        aria-label="Monthly farmer growth chart"
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={chartData}
            margin={{
              top: 12,
              right: 12,
              left: -20,
              bottom: 4
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#dbeee0"
            />

            <XAxis
              dataKey="period"
              tick={{
                fill: '#5d7065',
                fontSize: 12
              }}
            />

            <YAxis
              allowDecimals={false}
              tick={{
                fill: '#5d7065',
                fontSize: 12
              }}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="farmers"
              stroke="#B8860B"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: '#B8860B'
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <table className="sr-only">
        <caption>
          Monthly farmer registrations
        </caption>

        <thead>
          <tr>
            <th scope="col">Period</th>
            <th scope="col">Farmers</th>
          </tr>
        </thead>

        <tbody>
          {chartData.map((item) => (
            <tr key={item.period}>
              <td>{item.period}</td>
              <td>{item.farmers}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GrowthChart;