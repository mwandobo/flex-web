import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ReferenceLine,
    ResponsiveContainer,
    Cell,
} from 'recharts';

interface Props {
    name: string;
    budget: string;
    expenses: string;
}

const data: Props[] = [
    { name: 'Jan', budget: '1200', expenses: '24000' },
    { name: 'Feb', budget: '1000', expenses: '1398' },
    { name: 'Mar', budget: '7000', expenses: '9800' },
    { name: 'Apr', budget: '6800', expenses: '9800' },
    { name: 'May', budget: '8000', expenses: '9800' },
    { name: 'Jun', budget: "2000", expenses: '3908' },
    { name: 'Jul', budget: '3500', expenses: '4800' },
    { name: 'Aug', budget: '3200', expenses: '3800' },
    { name: 'Sep', budget: '2500', expenses: '3800' },
    { name: 'Oct', budget: '1500', expenses: '3800' },
    { name: 'Nov', budget: '2000', expenses: '3800' },
    { name: 'Dec', budget: '17000', expenses: '3800' },
];

const BarChartComponent = () => (
    <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
            <BarChart
                data={data}
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
                <ReferenceLine y={0} stroke="#000" />
                <Bar dataKey="budget" fill="#82ca9d" />
                <Bar dataKey="expenses">
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={parseFloat(entry.expenses) > 10000 ? '#FF6347' : '#8884d8'}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
);

export default BarChartComponent;
