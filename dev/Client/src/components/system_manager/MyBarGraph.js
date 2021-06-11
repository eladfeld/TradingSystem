import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const makeData = (name, value) => {return {name, value}};
//const stats = {guests:100, subscribers:200, owners:10, managers:30, system_managers:2}
const formatStats = (stats) => [
  makeData("Guest",stats.guests),
  makeData("Subscriber", stats.subscribers),
  makeData("Manager",stats.managers),
  makeData("Owner",stats.owners),
  makeData("System Manager", stats.system_managers)
];

const MyBarChart = ({getAppState}) => {
    const {stats} = getAppState();
    return (
      <ResponsiveContainer width="75%" aspect={3}>
        <BarChart
          width={300}
          height={200}
          data={formatStats(stats)}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
        <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {/* <Bar dataKey="pv" fill="#8884d8" /> */}
          <Bar dataKey="value" fill="#1e00ff" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  export default MyBarChart;
