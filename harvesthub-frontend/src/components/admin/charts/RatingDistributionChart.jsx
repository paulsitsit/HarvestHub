import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const RatingDistributionChart = ({
  data = []
}) => {
  const chartData = [1, 2, 3, 4, 5].map(
    (rating) => {
      const item = data.find(
        (entry) => Number(entry._id) === rating
      );

      return {
        rating: `${rating} stars`,
        count: item?.count || 0
      };
    }
  );

  return (
    <div>
      <div
        className="h-72 w-full"
        aria-label="Review rating distribution chart"
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
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
              dataKey="rating"
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

            <Bar
              dataKey="count"
              fill="#D4AF37"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <table className="sr-only">
        <caption>
          Review rating distribution
        </caption>

        <thead>
          <tr>
            <th scope="col">Rating</th>
            <th scope="col">Reviews</th>
          </tr>
        </thead>

        <tbody>
          {chartData.map((item) => (
            <tr key={item.rating}>
              <td>{item.rating}</td>
              <td>{item.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RatingDistributionChart;