// src/App.js

import React, {useEffect} from 'react';
import ImageGrid from './ImageGrid.js';
import DraggableCircle from './Circle.js';
import { useParams, useSearchParams } from 'react-router-dom';
import { synth } from './synthHelper.js';

// Create a context for all .jpg files inside the 'accident-ride-frames-lofi' directory

function RideViewer({speed}) {
  const { id } = useParams();
  

  useEffect(() => {
    // on unmount, stop synth
    return () => {
      if (synth) {
        synth.triggerRelease();
      }
    };
  })

  useEffect(() => {
    document.querySelector(".RideFooter").style.display = "flex";
  }, [])

    return (
      <>
      <div className="mobile-warning" style={{display: "none"}}>
        <p>sorry, site only works on wider screens.</p>
        </div>
        <div className="RideViewer">
          <DraggableCircle speed={speed} startPosition={{ x: 100, y: 100 }}/>
          <ImageGrid id={id}/>
        </div>
      </>
    );
  }


export default RideViewer;
