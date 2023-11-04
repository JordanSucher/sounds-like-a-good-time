// src/App.js

import React, { useEffect, useState } from 'react';
import ImageGrid from './ImageGrid.js';
import DraggableCircle from './Circle.js';
import { preloadImages } from '../preloadImages.js';

// Create a context for all .jpg files inside the 'accident-ride-frames-lofi' directory

function RideViewer() {

    const [images, setImages] = useState([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    // get image paths
    useEffect(() => {
        const getImages = async () => {
            try {
                let response = await fetch ('/api/images')
                let data = await response.json()
                setImages(data)
                return data
                // console.log(data)
            }
            catch (error) {
                console.log(error)
            }
        }

        getImages().then((images) => {
            preloadImages(images, () => {
                setImagesLoaded(true)
            })
        })
        
    }, [])

  if (!imagesLoaded) {
      return <div className='Loading'>Loading images. This will take a minute...</div>
  } else {
    return (
      <div className="RideViewer">
        <DraggableCircle startPosition={{ x: 100, y: 100 }}/>
        <ImageGrid images={images} />
      </div>
    );
  }
}

export default RideViewer;
