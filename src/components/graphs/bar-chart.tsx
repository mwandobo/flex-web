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

interface BarChartProps{
    data: Props[]
}

const BarChartComponent = ( {data}: BarChartProps ) => (
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
