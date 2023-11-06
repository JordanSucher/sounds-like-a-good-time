// src/App.js

import React, { useEffect, useState } from 'react';
import ImageGrid from './ImageGrid.js';
import DraggableCircle from './Circle.js';
import { preloadImages } from '../preloadImages.js';

// Create a context for all .jpg files inside the 'accident-ride-frames-lofi' directory

function RideViewer() {
    return (
      <>
      <div className="mobile-warning" style={{display: "none"}}>
        <p>sorry, site only works on wider screens.</p>
        </div>
        <div className="RideViewer">
          <DraggableCircle startPosition={{ x: 100, y: 100 }}/>
          <ImageGrid />
        </div>
      </>
    );
  }


export default RideViewer;
