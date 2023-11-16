// src/App.js

import React, {useEffect} from 'react';
import ImageGrid from './ImageGrid.js';
import DraggableCircle from './Circle.js';
import { useParams, useSearchParams } from 'react-router-dom';
import * as Tone from 'tone';


// Create a context for all .jpg files inside the 'accident-ride-frames-lofi' directory

function RideViewer({circle1, circle2, numCircles}) {
  const { id } = useParams();

  useEffect(() => {
    // show the settings footer!
    document.querySelector(".RideFooter").style.display = "flex";
  }, [circle1, circle2])

    return (
      <>
      <div className="mobile-warning" style={{display: "none"}}>
        <p>sorry, site only works on wider screens.</p>
        </div>
        <div className="RideViewer">
          <DraggableCircle 
            circleProp={circle1}
            startPosition={{ x: 100, y: 100 }}
            index={1} />
          <ImageGrid id={id}/>

          {numCircles > 1 &&
            <DraggableCircle
              circleProp={circle2}
              startPosition={{ x: 200, y: 200 }}
              index={2} />}
        </div>
      </>
    );
  }


export default RideViewer;
