import React from 'react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    AreaChart,
    Area,
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

const AreaChartComponent = () => (
    <AreaChart width={730} height={250} data={data}
               margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
            </linearGradient>
        </defs>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area type="monotone" dataKey="budget" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
        <Area type="monotone" dataKey="expenses" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
    </AreaChart>);

export default AreaChartComponent;
