import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';

import {move, triggerAttack, computeLuminance} from './synthHelper.js';

const DraggableCircle = ({startPosition}) => {
    const circleRef = useRef(null);
    let [currColor, setCurrColor] = useState("0,0,0");
    const currColorRef = useRef(currColor);
    let [currPosition, setCurrPosition] = useState({ x: startPosition.x, y: startPosition.y });
    const currPositionRef = useRef(currPosition);

    const captureColorAtCirclePosition = async (circleElement) => {
        const circleBounds = circleElement.getBoundingClientRect();
        
        // Define a small bounding box around the circle.
        const captureSize = 2;  // Change size as needed. This is a 4x4 box.
        const x = circleBounds.left - 1;
        const y = circleBounds.top + 45;

        try {
            const canvas = await html2canvas(document.body, {
                x: x,
                y: y,
                width: captureSize,
                height: captureSize,
                logging: false, // Disable logging for performance.
                windowWidth: document.documentElement.clientWidth,
                windowHeight: document.documentElement.clientHeight,
                // useCORS: false,
                // allowTaint: false
            });
    
            const ctx = canvas.getContext("2d");
            const pixel = ctx.getImageData(captureSize / 2, captureSize / 2, 1, 1).data;
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
                  let luminance = computeLuminance(color)
                  move({
                    l: luminance, 
                    y: y / document.querySelector('body').getBoundingClientRect().height,
                    x: x / document.querySelector('body').getBoundingClientRect().width
                });

              });
      
          }, 500);  // Checks every 500ms
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
        let offsetX, offsetY, isDragging = false;
        let tempX, tempY;

        if (!isMonitoring) {
            startMonitoring(circle);
        }

        
        const onMouseDown = (e) => {
            e.preventDefault();
            isDragging = true;

            const circleBounds = document.querySelector('.draggable-circle').getBoundingClientRect();
            
            // Use `e.touches[0]` for touch events and `e` for mouse events
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            
            const x2 = circleBounds.left + circleBounds.width / 2;
            const y2 = circleBounds.top + circleBounds.height / 2;

            // trigger synth note
            triggerAttack({ 
                l: computeLuminance(currColorRef.current), 
                y: y2 / document.querySelector('body').getBoundingClientRect().height,
                x: x2 / document.querySelector('body').getBoundingClientRect().width
            });

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
            if(!isDragging) return;

            // Use `e.touches[0]` for touch events and `e` for mouse events
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        
            const x = clientX - offsetX;
            const y = clientY - offsetY - document.querySelector('.navbar').getBoundingClientRect().height;

            // console.log("new x and y", x, y);

            setCurrPosition({ x, y });

            let circleX = circle.getBoundingClientRect().left;
            let circleY = circle.getBoundingClientRect().top;

            let parentX = document.querySelector('body').getBoundingClientRect().width;
            let parentY = document.querySelector('body').getBoundingClientRect().height;

            let xPercent = circleX / parentX;
            let yPercent = circleY / parentY;

            move({ 
                l: computeLuminance(currColorRef.current), 
                y: yPercent,
                x: xPercent
            });
           
        };

        const onMouseUp = () => {
            e.preventDefault();
            isDragging = false;
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


    }, []);

    return <div ref={circleRef} className="draggable-circle" style={{backgroundColor: `rgba(${currColor})`, color: currColor, left: currPosition.x+"px", top: currPosition.y+"px"}}>
    </div>;
};

export default DraggableCircle;