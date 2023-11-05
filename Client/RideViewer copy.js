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
      const chunkSize = 500; // Define the size of each chunk
      let currentChunkStart = 0;
  
      const fetchAndLoadImages = async (start) => {
          try {
              // Modify the API call to support fetching a specific chunk
              console.log("trying to get images");
              let response = await fetch(`/api/images?start=${start}&end=${start + chunkSize}`);
              let data = await response.json();
              // console.log("response: ", data);
  
              // Set images for the current chunk only
              setImages(prevImages => [...prevImages, ...data]);
  
              // Preload the current chunk and then load the next chunk
              preloadImages(data, () => {
                  // Check if there are more images to load
                  if (data.length === chunkSize) {
                      fetchAndLoadImages(start + chunkSize);
                  } else {
                      // All images are loaded
                      setImagesLoaded(true);
                  }
              });
          } catch (error) {
              console.log(error);
          }
      };
  
      // Start the initial fetch with the first chunk
      fetchAndLoadImages(currentChunkStart);
  
  }, []);

  if (!imagesLoaded) {
      return <div className='Loading'>Loading images: {images.length} of ~22,000. This will take a minute...</div>
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
