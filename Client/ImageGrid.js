// src/components/ImageGrid.js
import React from 'react';
import { useLocation } from 'react-router-dom';

const ImageGrid = ({id}) => {
    let searchParams = new URLSearchParams(window.location.search);
    let big = searchParams.get("big");
    let custom = searchParams.get("custom");
    let customId = custom=='true' ? `custom/${id}` : id
    let url
    let videourl = localStorage.getItem('videoUrl')
    let isFromFile = searchParams.get("fromfile")

    if (id && id.length > 0) {
        url = `https://ridevisualizer.s3.us-east-2.amazonaws.com/${customId}/video.mp4`
    } else if (big) {
        url = "https://ridevisualizer.s3.us-east-2.amazonaws.com/mapboxLargeComposite.mp4"
    } else if (videourl && isFromFile == 'true') {
        url = videourl
    }

    else {
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
