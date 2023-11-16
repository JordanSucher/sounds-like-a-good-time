import React, { useEffect, useRef, useState } from 'react';
import {computeLuminance} from './synthHelper.js';
import SynthComponent from './SynthComponent.js';

const DraggableCircle = ({startPosition, circleProp, index}) => {
    const circleRef = useRef(null);
    let [currColor, setCurrColor] = useState("0,0,0");
    const currColorRef = useRef(currColor);
    let [currPosition, setCurrPosition] = useState({ x: startPosition.x, y: startPosition.y });
    const currPositionRef = useRef(currPosition);
    const isDragging = useRef(false);
    const [luminance, setLuminance] = useState(0);
    const [synthX, setSynthX] = useState(0);
    const [synthY, setSynthY] = useState(0);

    const captureColorAtCirclePosition = async (circleElement) => {
        const circleBounds = circleElement.getBoundingClientRect();
        
        // Define a small bounding box around the circle.
        const captureSize = 2;  // Change size as needed. This is a 4x4 box.
        const x = Math.max(1, circleBounds.left - 1);
        const y = Math.max(1,circleBounds.top - 60);

        try {
            let vid = document.querySelector('video')
            const canvas = document.createElement('canvas');
            canvas.width = vid.videoWidth
            canvas.height = vid.videoHeight

            const ctx = canvas.getContext("2d");
            ctx.drawImage(vid, 0, 0, vid.videoWidth, vid.videoHeight);
            const pixel = ctx.getImageData(x, y, 1, 1).data;
            // destroy the canvas
            
            canvas.width = 0;
            canvas.height = 0;
    
            return `${pixel[0]},${pixel[1]},${pixel[2]},${pixel[3] / 255}`;

        } catch (error) {
            console.log(error)
        }
        
    }

      let isMonitoring = false;

      const startMonitoring = (circle) => {
        console.log("speed: ", circleProp.speed)
          isMonitoring = true;
          
          const monitorInterval = setInterval(() => {
              if (!isMonitoring) {
                  clearInterval(monitorInterval);
                  return;
              }
              
              const circleBounds = circle.getBoundingClientRect();
              const x = circleBounds.left + circleBounds.width / 2;
              const y = circleBounds.top + circleBounds.height / 2;
              
              captureColorAtCirclePosition(circle).then((color) => {
                  setCurrColor(color);
                //   console.log("color: ", color);
                //   let luminance = computeLuminance(color)
                //   move({
                //     l: luminance, 
                //     y: y / document.querySelector('body').getBoundingClientRect().height,
                //     x: x / document.querySelector('body').getBoundingClientRect().width
                // });
                setLuminance(computeLuminance(color));
                setSynthX(x / document.querySelector('body').getBoundingClientRect().width);
                setSynthY(y / document.querySelector('body').getBoundingClientRect().height);

              }).catch((error) => {
                  console.log(error);
              });
      
          }, circleProp.speed);  // Checks every 500ms
      }
      
      const stopMonitoring = () => {
          isMonitoring = false;
      }

    useEffect(() => {
        currColorRef.current = currColor;
    }, [currColor]);

    useEffect(() => {
        currPositionRef.current = currPosition;
    }, [currPosition]);

    useEffect(() => {
        const circle = circleRef.current;
        let offsetX, offsetY = false;

        if (!isMonitoring) {
            startMonitoring(circle);
        }

        
        const onMouseDown = (e) => {
            e.preventDefault();
            isDragging.current = true;

            const circleBounds = document.querySelector(`.dc${index}`).getBoundingClientRect();
            
            // Use `e.touches[0]` for touch events and `e` for mouse events
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            
            const x2 = circleBounds.left + circleBounds.width / 2;
            const y2 = circleBounds.top + circleBounds.height / 2;

            // trigger synth note
            // triggerAttack({ 
            //     l: computeLuminance(currColorRef.current), 
            //     y: y2 / document.querySelector('body').getBoundingClientRect().height,
            //     x: x2 / document.querySelector('body').getBoundingClientRect().width
            // });

            // console.log("curr x and y ", circleBounds.left, circleBounds.top);

            offsetX = clientX - circleBounds.left;
            offsetY = clientY - circleBounds.top;
        
            // Add both mouse and touch event listeners for move and end actions
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('touchmove', onMouseMove, { passive: false });
            document.addEventListener('mouseup', onMouseUp);
            document.addEventListener('touchend', onMouseUp, { passive: false });

        };

        const onMouseMove = (e) => {
            e.preventDefault();
            if(!isDragging.current) {
                return;
            }

            // Use `e.touches[0]` for touch events and `e` for mouse events
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        
            let x = clientX - offsetX;
            let y = clientY - offsetY - document.querySelector('.navbar').getBoundingClientRect().height;

            // console.log("new x and y", x, y);
            x = Math.min(document.querySelector('video').videoWidth, x);
            y = Math.min(document.querySelector('video').videoHeight, y);

            setCurrPosition({ x: Math.max(0,x), y: Math.max(0,y) });

            let circleX = circle.getBoundingClientRect().left;
            let circleY = circle.getBoundingClientRect().top;

            let parentX = document.querySelector('body').getBoundingClientRect().width;
            let parentY = document.querySelector('body').getBoundingClientRect().height;

            let xPercent = circleX / parentX;
            let yPercent = circleY / parentY;

            setLuminance(computeLuminance(currColorRef.current));
            setSynthX(xPercent);
            setSynthY(yPercent); 
        };

        const onMouseUp = (e) => {
            e.preventDefault();
            isDragging.current = false;
            // Remove both mouse and touch event listeners
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('touchmove', onMouseMove, { passive: false });
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('touchend', onMouseUp, { passive: false });

        };

        // Add both mousedown and touchstart event listeners
        circleRef.current.addEventListener('mousedown', onMouseDown);
        circleRef.current.addEventListener('touchstart', onMouseDown, { passive: false });

        return () => {
            circle.removeEventListener('mousedown', onMouseDown);
            circle.removeEventListener('touchstart', onMouseDown);
            stopMonitoring();
        };


    }, [circleProp.speed]);

    return (
    <>
        <div ref={circleRef} className={`draggable-circle dc${index}`} style={{
            backgroundColor: `rgba(${currColor})`, 
            color: currColor, 
            left: currPosition.x+"px", 
            top: currPosition.y+"px"}}>
        </div>
        <SynthComponent 
            l={luminance} 
            y={synthY} 
            x={synthX} 
            circleProp = {circleProp}
       />
    </>
)};

export default DraggableCircle;