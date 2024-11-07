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
    sales: string;
    purchase: string;
}

const datan: Props[] = [
    {name: 'Jan', sales: '1200', purchase: '24000'},
    {name: 'Feb', sales: '1000', purchase: '1398'},
    {name: 'Mar', sales: '7000', purchase: '9800'},
    {name: 'Apr', sales: '6800', purchase: '9800'},
    {name: 'May', sales: '8000', purchase: '9800'},
    {name: 'Jun', sales: "2000", purchase: '3908'},
    {name: 'Jul', sales: '3500', purchase: '4800'},
    {name: 'Aug', sales: '3200', purchase: '3800'},
    {name: 'Sep', sales: '2500', purchase: '3800'},
    {name: 'Oct', sales: '1500', purchase: '3800'},
    {name: 'Nov', sales: '2000', purchase: '3800'},
    {name: 'Dec', sales: '17000', purchase: '3800'},
];

interface AreaChartProps {
    data: Props[]
}

const AreaChartComponent = ({
                                data = datan
                            }: AreaChartProps) => (
    <AreaChart width={730} height={250} data={data}
               margin={{top: 10, right: 30, left: 0, bottom: 0}}>
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
        <XAxis dataKey="name"/>
        <YAxis/>
        <CartesianGrid strokeDasharray="3 3"/>
        <Tooltip/>
        <Area type="monotone" dataKey="sales" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)"/>
        <Area type="monotone" dataKey="purchase" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)"/>
    </AreaChart>);

export default AreaChartComponent;
