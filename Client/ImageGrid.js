// src/components/ImageGrid.js
import React from 'react';
import CyclingImage from './CyclingImage.js';

const ImageGrid = () => {
    let searchParams = new URLSearchParams(window.location.search);
    let big = searchParams.get("big");
    

    return (
        <div className="image-vid">
                <video autoPlay loop muted playsInline crossOrigin='anonymous'>
                    <source src={big ? "https://ridevisualizer.s3.us-east-2.amazonaws.com/mapboxLargeComposite.mp4" : "https://ridevisualizer.s3.us-east-2.amazonaws.com/testOutput.mp4"} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
        </div>
    );
}

// onClick={(e)=> e.target.paused ? e.target.play() : e.target.pause()}


export default ImageGrid;
