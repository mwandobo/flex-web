import React from 'react';

interface Segment {
    percentage: number;
    color: string;
    label: string;
}

interface MultiColorCircularProgressProps {
    segments: Segment[];
    totalBudget: number; // Total budget prop
}

const MultiColorCircularProgress: React.FC<MultiColorCircularProgressProps> = ({ segments, totalBudget }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;

    // Calculate the dash array segments dynamically based on the passed data
    const dashArraySegments = segments.map(segment => (segment.percentage / 100) * circumference);

    return (
        <div style={{ width: '200px', height: '200px', position: 'relative', textAlign: 'center' }}>
            <svg width="150" height="150" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)", margin: '0 auto' }}>
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke="#e6e6e6"
                    strokeWidth="15"
                />
                {dashArraySegments.map((dash, index) => {
                    const offset = dashArraySegments.slice(0, index).reduce((a, b) => a + b, 0);
                    return (
                        <circle
                            key={index}
                            cx="60"
                            cy="60"
                            r={radius}
                            fill="none"
                            stroke={segments[index].color}
                            strokeWidth="15"
                            strokeDasharray={`${dash} ${circumference - dash}`}
                            strokeDashoffset={-offset}
                        />
                    );
                })}
            </svg>

            {/* Total Budget Display */}
            <div
                style={{
                    position: 'absolute',
                    top: '40%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '10px',  // Adjust font size for readability
                    fontWeight: 'medium',
                    color: '#333',
                }}
            >
                Tzs. {totalBudget?.toFixed(2)} {/* Show the total budget */}
            </div>
        </div>
    );
};

export default MultiColorCircularProgress;
