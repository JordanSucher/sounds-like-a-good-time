// src/App.js

import React, { useEffect, useState } from 'react';
// import './App.css';
import ImageGrid from './ImageGrid.js';

// Create a context for all .jpg files inside the 'accident-ride-frames-lofi' directory

function App() {

    const [images, setImages] = useState([]);
    useEffect(() => {
        const getImages = async () => {
            try {
                let response = await fetch ('/api/images')
                let data = await response.json()
                setImages(data)
                console.log(data)
            }
            catch (error) {
                console.log(error)
            }
        }

        getImages()
        
    }, [])

  return (
    <div className="App">
      <ImageGrid images={images} />
    </div>
  );
}

export default App;
