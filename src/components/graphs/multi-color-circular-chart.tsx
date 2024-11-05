import React from 'react';

interface MultiColorCircularProgressProps {
    percentage: number;
}

const MultiColorCircularProgress: React.FC<MultiColorCircularProgressProps> = ({ percentage }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;

    // Define segment lengths as percentages
    const segmentLengths = [25, 35, 20, 20]; // Adjust these values to represent different sections

    // Convert percentages to dash array segments
    const dashArraySegments = segmentLengths.map(length => (length / 100) * circumference);

    // Colors for each segment
    const colors = ["#4CAF50", "#FFA500", "#FF6347", "#1E90FF"];

    return (
        <div style={{ width: '150px', height: '150px', position: 'relative' }}>
            <svg width="150" height="150" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke="#e6e6e6"
                    strokeWidth="15"
                />
                {dashArraySegments.map((dash, index) => {
                    // Calculate the offset for each segment
                    const offset = dashArraySegments.slice(0, index).reduce((a, b) => a + b, 0);
                    return (
                        <circle
                            key={index}
                            cx="60"
                            cy="60"
                            r={radius}
                            fill="none"
                            stroke={colors[index]}
                            strokeWidth="15"
                            strokeDasharray={`${dash} ${circumference - dash}`}
                            strokeDashoffset={-offset}
                        />
                    );
                })}
            </svg>
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#333',
                }}
            >
                {percentage}%
            </div>
        </div>
    );
};

export default MultiColorCircularProgress;
