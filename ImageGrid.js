// src/components/ImageGrid.js
import React from 'react';
import './ImageGrid.css';
import CyclingImage from './CyclingImage.js';

const ImageGrid = ({ images }) => {
    const totalComponents = 200;

    return (
        <div className="image-grid">
            {images && images.length > 0 && Array(totalComponents).fill(null).map((_, index) => (
                <CyclingImage 
                    key={index} 
                    images={images}
                    startDelay={index * 83} 
                />
            ))}
        </div>
    );
}

export default ImageGrid;
