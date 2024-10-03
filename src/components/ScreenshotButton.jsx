import React, { useCallback } from 'react';
import domtoimage from 'dom-to-image';

const ScreenshotButton = ({ targetRefs = [], delay = 0 }) => {
  const handleScreenshot = useCallback(() => {
    // Check if ref1 is available
    if (!targetRefs[0]?.current) {
      alert('Error: Mechanic name is not available!');
      return; // Exit the function if ref1 is not present
    }

    if (targetRefs.every(ref => ref.current)) {
      setTimeout(() => {
        requestAnimationFrame(() => {
          Promise.all(targetRefs.map(ref => domtoimage.toPng(ref.current)))
            .then((images) => {
              // Preload images to ensure they are fully loaded before drawing
              const loadedImages = images.map(src => {
                return new Promise((resolve) => {
                  const img = new Image();
                  img.onload = () => resolve(img);
                  img.src = src;
                });
              });

              Promise.all(loadedImages).then((imageElements) => {
                // Calculate the necessary canvas dimensions
                const totalHeight = imageElements.reduce((sum, img) => sum + img.height, 0);
                const totalWidth = Math.max(
                  ...imageElements.map(img => img.width) // max width of all images
                );

                // Create a canvas to combine all images
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = totalWidth;
                canvas.height = totalHeight;

                let currentHeight = 0;

                // Calculate widths for ref1 and ref2
                const ref1Image = imageElements[0];
                const ref2Image = imageElements[1];
                const spaceBetween = 10; // Adjust spacing between ref1 and ref2

                // Centering ref1 and ref2
                const totalWidthOfRefs = ref1Image.width + ref2Image.width + spaceBetween;
                const startX = (canvas.width - totalWidthOfRefs) / 2; // Centering calculation

                ctx.drawImage(ref1Image, startX, currentHeight);
                ctx.drawImage(ref2Image, startX + ref1Image.width + spaceBetween, currentHeight);
                currentHeight += Math.max(ref1Image.height, ref2Image.height); // Update height

                // Draw ref3 normally
                ctx.drawImage(imageElements[2], 0, currentHeight);
                currentHeight += imageElements[2].height; // Update height for ref3

                // Calculate position for ref4
                const ref4Index = 3; // Index of ref4
                const ref4Image = imageElements[ref4Index];
                const ref4X = (canvas.width - ref4Image.width) / 2; // Centering ref4
                const ref4Y = currentHeight; // Position ref4 below the other images

                // Draw ref4 at the bottom center
                ctx.drawImage(ref4Image, ref4X, ref4Y);

                // Trigger download of the combined image
                const finalImage = canvas.toDataURL('image/png');

                // Log the final image data URL for debugging
                console.log("Triggering download", finalImage);

                const link = document.createElement('a');
                link.href = finalImage;
                link.download = 'screenshot.png';
                link.click();
                console.log("Screenshot downloaded:");
              });
            })
            .catch((error) => {
              console.error('Error taking screenshot:', error);
            });
        });
      }, delay);
    }
  }, [targetRefs, delay]);

  return (
    <button onClick={handleScreenshot} className={styles.screenshotButton}>Take Screenshot</button>
  );
};

export default ScreenshotButton;
