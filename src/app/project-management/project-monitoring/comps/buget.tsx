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
    directCost,
    resourceCost
}: LeadsChartProps) => {
    const {
        calculateTotalCostByMonth,
        totalCost,
    } = useCostCalculator({ directCost, resourceCost })

    const options: ApexCharts.ApexOptions = {
        colors: ["#1A56DB"],
        series: [
            {
                name: "Project Budget",
                color: "#70888e",
                data: [
                    { x: "Jan", y: calculateTotalCostByMonth('1') },
                    { x: "Feb", y: calculateTotalCostByMonth('2') },
                    { x: "Mar", y: calculateTotalCostByMonth('3') },
                    { x: "Apr", y: calculateTotalCostByMonth('4') },
                    { x: "May", y: calculateTotalCostByMonth('5') },
                    { x: "Jun", y: calculateTotalCostByMonth('6') },
                    { x: "Jul", y: calculateTotalCostByMonth('7') },
                    { x: "Aug", y: calculateTotalCostByMonth('8') },
                    { x: "Sep", y: calculateTotalCostByMonth('9') },
                    { x: "Oct", y: calculateTotalCostByMonth('10') },
                    { x: "Nov", y: calculateTotalCostByMonth('11') },
                    { x: "Dec", y: calculateTotalCostByMonth('12') },
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
            tickAmount: 10,
            labels: {
                show: true,
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
                },
                formatter: function (value: any) {
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
            return () => {
                chart.destroy();
            };
        }
    }, [directCost, resourceCost]);

    return (
        <div className="w-full bg-white rounded-lg shadow p-4">
            <div className="flex flex-col text-xs">
                <div className="flex items-center">
                    <p className="text-gray-600 font-normal me-1">Total Project Budget:</p>
                    <p className="text-gray-700 font-semibold"> <FormattedMoney amount={totalCost} /></p>
                </div>
            </div>
            <div id="column-chart"></div>
        </div>
    );
};

export default LeadsChart;
