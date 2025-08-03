import React from 'react';
import CenterCircle from './CenterCircle';

const ConcentricCircles: React.FC = () => {
  // Configuration for the rings, adjusted to match the image
  const strokeWidth = 75; // Increased from 50
  const centerCircleRadius = 150; // Increased from 100
  // The initial radius is calculated to create a black ring of `strokeWidth` between the center and first colored ring
  const initialRadius = centerCircleRadius + strokeWidth / 2 + strokeWidth;
  const radiusIncrement = strokeWidth * 2; // Creates alternating black space equal to strokeWidth

  // Colors inspired by the image, reduced to 4 rings
  const ringColors = [
    '#E1C16E', // Gold/Ochre
    '#C4B5FD', // Lavender
    '#B97E89', // Dusty Rose
    '#9AD1C5', // Teal/Mint
  ];

  // Dynamically calculate the SVG dimensions to fit all circles
  const maxRadius = initialRadius + (ringColors.length - 1) * radiusIncrement;
  const viewBoxSize = (maxRadius + strokeWidth / 2) * 2;
  const center = viewBoxSize / 2;

  return (
    <svg viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Center circle is now its own component, placed in the center */}
      <CenterCircle cx={center} cy={center} radius={centerCircleRadius} />

      {/* Map over the colors array to render each colored ring */}
      {ringColors.map((color, index) => (
        <circle
          key={index}
          cx={center}
          cy={center}
          r={initialRadius + index * radiusIncrement}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      ))}
    </svg>
  );
};

export default ConcentricCircles;
