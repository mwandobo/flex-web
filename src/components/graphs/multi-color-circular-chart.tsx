import React from 'react';

interface Segment {
    percentage: number;
    color: string;
    label: string;
}

interface MultiColorCircularProgressProps {
    segments: Segment[];
}

const MultiColorCircularProgress: React.FC<MultiColorCircularProgressProps> = ({ segments }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;

    // Calculate the dash array segments dynamically based on the passed data
    const dashArraySegments = segments.map(segment => (segment.percentage / 100) * circumference);

    return (
        <div style={{width: '200px', height: '160px', position: 'relative', textAlign: 'center'}}>
            <svg width="150" height="150" viewBox="0 0 120 120" style={{transform: "rotate(-90deg)", margin: '0 auto'}}>
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
            {/*<div*/}
            {/*    style={{*/}
            {/*        position: 'absolute',*/}
            {/*        top: '48%',*/}
            {/*        left: '50%',*/}
            {/*        transform: 'translate(-50%, -50%)',*/}
            {/*        fontSize: '12px',*/}
            {/*        fontWeight: '500',  // 'medium' is not valid in CSS, use 500 or other numeric values*/}
            {/*        color: '#333',*/}
            {/*        maxWidth: '100px',  // Set a maximum width (adjust as needed)*/}
            {/*        textAlign: 'center',  // Center-align text for a balanced look*/}
            {/*        overflowWrap: 'break-word',  // Break long words to fit the width*/}
            {/*        whiteSpace: 'normal',  // Allow text to wrap to new lines*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <p style={{margin: 0}}>Tzs. {totalBudget}</p>*/}
            {/*</div>*/}
        </div>
    );
};

export default MultiColorCircularProgress;
