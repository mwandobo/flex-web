import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartComponent = ({ data }) => {
    const chartData = {
        labels: data.map(item => item.name),
        datasets: [{
            data: data.map(item => item.progress),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        }]
    };

    const options = {
        plugins: {
            legend: {
                position: 'right' as const, // Explicitly specify the position as a valid string
                labels: {
                    boxWidth: 20,
                    padding: 15,
                },
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '300px', height: '300px' }}>
                <Pie data={chartData} options={options} />
            </div>
        </div>
    );
};

export default PieChartComponent;
