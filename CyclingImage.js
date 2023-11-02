// src/components/CyclingImage.js

import React, { useState, useEffect } from 'react';

const CyclingImage = ({ images, startDelay }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [initialTimeoutDone, setInitialTimeoutDone] = useState(false);

    useEffect(() => {
        // Initial delay
        const initialTimeoutId = setTimeout(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
            
            setInitialTimeoutDone(true);

            // Start the regular cycling after the delay
            const regularTimeoutId = setInterval(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
            }, 50);
    
            // Clear the interval when the component is unmounted
            return () => clearInterval(regularTimeoutId);
        }, startDelay);
    
        // Clear the timeout if the component is unmounted before delay ends
        return () => clearTimeout(initialTimeoutId);
    }, [startDelay, images]);

    return (
        <>
        {
        initialTimeoutDone &&
        <img 
            src={images[currentImageIndex]} 
            alt={`frame-${currentImageIndex}`}
        />
        }
        </>
    );
}
export default CyclingImage;