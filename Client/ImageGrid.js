// src/components/ImageGrid.js
import React from 'react';
import CyclingImage from './CyclingImage.js';

const ImageGrid = ({id}) => {
    let searchParams = new URLSearchParams(window.location.search);
    let big = searchParams.get("big");
    
    let url
    if (id && id.length > 0) {
        url = `https://ridevisualizer.s3.us-east-2.amazonaws.com/${id}/video.mp4`
    } else if (big) {
        url = "https://ridevisualizer.s3.us-east-2.amazonaws.com/mapboxLargeComposite.mp4"
    } else {
        url = "https://ridevisualizer.s3.us-east-2.amazonaws.com/testOutput.mp4"
    }


    return (
        <div className="image-vid">
                <video autoPlay loop muted playsInline crossOrigin='anonymous'>
                    <source src={url} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
        </div>
    );
}

// onClick={(e)=> e.target.paused ? e.target.play() : e.target.pause()}


export default ImageGrid;
