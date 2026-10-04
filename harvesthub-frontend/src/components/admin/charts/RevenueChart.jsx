import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const defaultData = [
  {
    month: 'Jan',
    revenue: 0
  },
  {
    month: 'Feb',
    revenue: 0
  },
  {
    month: 'Mar',
    revenue: 0
  },
  {
    month: 'Apr',
    revenue: 0
  },
  {
    month: 'May',
    revenue: 0
  },
  {
    month: 'Jun',
    revenue: 0
  }
];

const formatCurrency = (value) => {
  const numericValue = Number(value) || 0;

  return `PHP ${numericValue.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

const RevenueTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const revenue = payload[0]?.value ?? 0;

  return (
    <div className="rounded-xl border border-[var(--green-100)] bg-white px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold text-[var(--green-900)]">
        {label}
      </p>

      <p className="mt-1 text-sm text-[var(--green-700)]">
        Revenue: {formatCurrency(revenue)}
      </p>
    </div>
  );
};

const RevenueChart = ({ data = defaultData }) => {
  const chartData =
    Array.isArray(data) && data.length > 0
      ? data
      : defaultData;

  return (
    <section className="rounded-2xl border border-[var(--green-100)] bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-[var(--green-900)]">
          Revenue Overview
        </h2>

        <p className="mt-1 text-sm text-[var(--green-700)]">
          Listing-fee revenue over time
        </p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={chartData}
            margin={{
              top: 8,
              right: 8,
              left: 8,
              bottom: 8
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#dcefe1"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{
                fill: '#456b52',
                fontSize: 12
              }}
              axisLine={{
                stroke: '#b9d8c1'
              }}
              tickLine={false}
            />

            <YAxis
              tick={{
                fill: '#456b52',
                fontSize: 12
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `₱${value}`}
            />

            <Tooltip
              cursor={{
                fill: '#eef8f0'
              }}
              content={<RevenueTooltip />}
            />

            <Bar
              dataKey="revenue"
              name="Revenue"
              fill="#14753f"
              radius={[8, 8, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default RevenueChart;