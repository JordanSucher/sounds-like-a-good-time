// src/App.js

import React, { useEffect, useState } from 'react';
import ImageGrid from './ImageGrid.js';
import DraggableCircle from './Circle.js';

// Create a context for all .jpg files inside the 'accident-ride-frames-lofi' directory

function RideViewer() {

    const [images, setImages] = useState([]);

    // get image paths
    useEffect(() => {
        const getImages = async () => {
            try {
                let response = await fetch ('/api/images')
                let data = await response.json()
                setImages(data)
                // console.log(data)
            }
            catch (error) {
                console.log(error)
            }
        }

        getImages()
        
    }, [])


  return (
    <div className="RideViewer">
      <DraggableCircle startPosition={{ x: 100, y: 100 }}/>
      <ImageGrid images={images} />
    </div>
  );
}

export default RideViewer;
