// src/components/CyclingImage.js

import React, { useState, useEffect, useRef } from 'react';

const CyclingImage = ({ images, startDelay }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [initialTimeoutDone, setInitialTimeoutDone] = useState(false);
    // const [imgBlob, setImgBlob] = useState(null);
    const canvasRef = useRef(null);
    const intervalRef = useRef(null);


    const drawImageOnCanvas = async (imageIndex) => {
        try {
            console.log("getting img blob")
            const blob = await getBlobFromDB(images[imageIndex]);
            console.log("blob: ", blob);
            let bitmap = await createImageBitmap(blob);
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas for the new frame
            ctx.drawImage(bitmap, 0, 0);
            bitmap.close(); // Close the bitmap to release memory
        } catch (error) {
            console.error('Error drawing image on canvas', error);
        }
    };

      useEffect(() => {
        // Initial delay
        const initialTimeoutId = setTimeout(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
            // Start the regular cycling after the delay
            intervalRef.current = setInterval(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
            }, 500); // set this to your frame rate, 80ms for your case
        }, startDelay);

        return () => {
            clearTimeout(initialTimeoutId);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [startDelay, images.length]);


    useEffect(() => {
        if (images.length > 0) {
            drawImageOnCanvas(currentImageIndex);
        }
    }, [currentImageIndex, images]);


    return (
        <>
        {
        // initialTimeoutDone &&
        // <img 
        //     src={imgBlob} 
        //     alt={`frame-${currentImageIndex}`}
        // />
        <canvas 
            ref={canvasRef} 
            alt={`frame-${currentImageIndex}`}
        />
        }
        </>
    );
}
export default CyclingImage;