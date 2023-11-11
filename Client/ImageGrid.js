// src/components/ImageGrid.js
import React from 'react';
import CyclingImage from './CyclingImage.js';

const ImageGrid = () => {
    let videoSrc = "/accidentRideLofiCompressed.mp4";

    return (
        <div className="image-vid">
            {videoSrc && (
                <video autoPlay loop muted playsInline crossOrigin='anonymous'>
                    <source src="https://ridevisualizer.s3.us-east-2.amazonaws.com/testOutput.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )}
        </div>
    );
}

// onClick={(e)=> e.target.paused ? e.target.play() : e.target.pause()}


export default ImageGrid;
