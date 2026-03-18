import { BarChart, Bar } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';

// #region Sample data
const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

// #endregion
const TinyBarChart = () => {
  return (
    <div role="figure" aria-label="Sample Page Activity Chart">
      <BarChart
        style={{ width: '100%', maxWidth: '300px', maxHeight: '100px', aspectRatio: 1.618 }}
        responsive
        data={data}
        aria-hidden="true"
      >
        <Bar dataKey="uv" fill="#8884d8" />
        <RechartsDevtools />
      </BarChart>

      <table className="sr-only">
        <caption>Page Activity Data</caption>
        <thead>
          <tr>
            <th scope="col">Page</th>
            <th scope="col">UV</th>
            <th scope="col">PV</th>
            <th scope="col">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx}>
              <td>{item.name}</td>
              <td>{item.uv}</td>
              <td>{item.pv}</td>
              <td>{item.amt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TinyBarChart;