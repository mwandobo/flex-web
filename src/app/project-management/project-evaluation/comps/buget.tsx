"use client"


import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';
import { useCostCalculator } from './costCalculator.helper';
import FormattedMoney from '@/components/moneyFormater';

interface LeadsChartProps {
    title?: string
    directCost?: any[]
    resourceCost?: any[]
}

const LeadsChart = ({
    title,
    directCost,
    resourceCost
}: LeadsChartProps) => {
    const {
        calculateCostByMonth,
        totalDirectCost,
        totalResourceCost,
        totalCost,
    } = useCostCalculator({ directCost, resourceCost })


    const calculateResourceCost = () => {

    }

    const options: ApexCharts.ApexOptions = {
        colors: ["#1A56DB"],
        series: [
            {
                name: "Direct Costs",
                color: "#d0dfe2",
                data: [
                    { x: "Jan", y: calculateCostByMonth('1', 'direct_cost') },
                    { x: "Feb", y: calculateCostByMonth('2', 'direct_cost') },
                    { x: "Mar", y: calculateCostByMonth('3', 'direct_cost') },
                    { x: "Apr", y: calculateCostByMonth('4', 'direct_cost') },
                    { x: "May", y: calculateCostByMonth('5', 'direct_cost') },
                    { x: "Jun", y: calculateCostByMonth('6', 'direct_cost') },
                    { x: "Jul", y: calculateCostByMonth('7', 'direct_cost') },
                    { x: "Aug", y: calculateCostByMonth('8', 'direct_cost') },
                    { x: "Sep", y: calculateCostByMonth('9', 'direct_cost') },
                    { x: "Oct", y: calculateCostByMonth('10', 'direct_cost') },
                    { x: "Nov", y: calculateCostByMonth('11', 'direct_cost') },
                    { x: "Dec", y: calculateCostByMonth('12', 'direct_cost') },
                ],
            },
            {
                name: "Resource Costs",
                color: "#70888e",
                data: [
                    { x: "Jan", y: calculateCostByMonth('1', 'resource_cost') },
                    { x: "Feb", y: calculateCostByMonth('2', 'resource_cost') },
                    { x: "Mar", y: calculateCostByMonth('3', 'resource_cost') },
                    { x: "Apr", y: calculateCostByMonth('4', 'resource_cost') },
                    { x: "May", y: calculateCostByMonth('5', 'resource_cost') },
                    { x: "Jun", y: calculateCostByMonth('6', 'resource_cost') },
                    { x: "Jul", y: calculateCostByMonth('7', 'resource_cost') },
                    { x: "Aug", y: calculateCostByMonth('8', 'resource_cost') },
                    { x: "Sep", y: calculateCostByMonth('9', 'resource_cost') },
                    { x: "Oct", y: calculateCostByMonth('10', 'resource_cost') },
                    { x: "Nov", y: calculateCostByMonth('11', 'resource_cost') },
                    { x: "Dec", y: calculateCostByMonth('12', 'resource_cost') },
                ],
            },
        ],
        chart: {
            type: "bar",
            height: "250px",
            fontFamily: "Inter, sans-serif",
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "70%",
                borderRadiusApplication: "end",
                borderRadius: 8,
            },
        },
        tooltip: {
            shared: true,
            intersect: false,
            style: {
                fontFamily: "Inter, sans-serif",
            },
        },
        states: {
            hover: {
                filter: {
                    type: "darken",
                    value: 1,
                },
            },
        },
        stroke: {
            show: true,
            width: 0,
            colors: ["transparent"],
        },
        grid: {
            show: false,
            strokeDashArray: 4,
            padding: {
                left: 2,
                right: 2,
                top: -14
            },
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        xaxis: {
            floating: false,
            labels: {
                show: true,
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
                }
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            show: false,
            tickAmount: 10, // specify the number of ticks on the y-axis
            labels: {
                show: true,
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
                },
                formatter: function (value: any) {
                    // Add the currency symbol to the y-axis labels
                    return `${value} Tzs`;
                },
            },
        },
        fill: {
            opacity: 1,
        },
    };

    useEffect(() => {
        if (document.getElementById("column-chart")) {
            const chart = new ApexCharts(document.getElementById("column-chart"), options);
            if (chart) {
                chart.render();
            } else {
                console.error("Failed to initialize chart");
            }
            // Cleanup function to destroy the chart on component unmount
            return () => {
                chart.destroy();
            };
        }
    }, [directCost, resourceCost]);

    return (
        <div className="w-full bg-white rounded-lg shadow p-4">
            <div className="flex justify-between pb-4 mb-4 border-b border-gray-200">
                <div className="flex items-center">

                    <div>
                        <h5 className="leading-none text-2xl font-bold text-gray-900 dark:text-white pb-1">3.4k</h5>
                        <p className="text-sm font-normal text-gray-500 ">{title}</p>
                    </div>
                </div>

            </div>

            <div className="flex flex-col text-xs">
                <div className="flex items-center">
                    <p className="text-gray-600 font-normal me-1">Direct Costs:</p>
                    <p className="text-gray-700 font-semibold"> <FormattedMoney amount={totalDirectCost} />  </p>
                </div>
                <div className="flex items-center">
                    <p className="text-gray-600 font-normal me-1">Resource Costs:</p>
                    <p className="text-gray-700  font-semibold"><FormattedMoney amount={totalResourceCost} /> </p>
                </div>
                <div className="flex items-center">
                    <p className="text-gray-600 font-normal me-1">Total Costs:</p>
                    <p className="text-gray-700 font-semibold"> <FormattedMoney amount={totalCost} /></p>
                </div>
            </div>

            <div id="column-chart"></div>

        </div>
    );
};

export default LeadsChart;
