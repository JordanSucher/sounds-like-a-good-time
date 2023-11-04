export function preloadImages(images, callback) {
    let loadedCounter = 0;
    let toBeLoadedNumber = images.length;
  
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => {
        loadedCounter++;
        if (loadedCounter == toBeLoadedNumber) {
          callback();
        }
      };
    });
  }


