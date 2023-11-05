// src/components/ImageGrid.js
import React from 'react';
import './ImageGrid.css';
import CyclingImage from './CyclingImage.js';

const ImageGrid = () => {
    let videoSrc = "/accidentRideLofiCompressed.mp4";

    return (
        <div className="image-vid">
            {videoSrc && (
                <video autoPlay loop muted playsInline>
                    <source src={videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )}
        </div>
    );
}


export default ImageGrid;
