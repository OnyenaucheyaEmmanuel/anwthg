document
  .getElementById("fileInput")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const overlayImage = document.getElementById("overlayImage");
        overlayImage.src = e.target.result;

        overlayImage.onload = function () {
          // Ensure the overlay image is displayed
          overlayImage.style.display = "block";
        };
      };
      reader.readAsDataURL(file);
    }
  });

function removeBackground(image, callback) {
  const tempCanvas = document.createElement("canvas");
  const tempContext = tempCanvas.getContext("2d");

  tempCanvas.width = image.naturalWidth;
  tempCanvas.height = image.naturalHeight;

  tempContext.drawImage(image, 0, 0);

  const imageData = tempContext.getImageData(
    0,
    0,
    tempCanvas.width,
    tempCanvas.height
  );
  const data = imageData.data;

  // Loop through each pixel and set alpha to 0 for background pixels
  for (let i = 0; i < data.length; i += 4) {
    // Assume the background is similar in color, using a simple threshold
    if (isBackground(data[i], data[i + 1], data[i + 2])) {
      data[i + 3] = 0; // Set alpha to 0 (transparent)
    }
  }

  tempContext.putImageData(imageData, 0, 0);

  const resultImage = new Image();
  resultImage.src = tempCanvas.toDataURL();
  resultImage.onload = function () {
    callback(resultImage);
  };
}

function isBackground(r, g, b) {
  // Define a basic background detection logic
  // Adjust these values based on your background color
  const threshold = 50; // Adjust threshold as needed
  return r > 200 && g > 200 && b > 200; // Assuming a light background
}

document
  .getElementById("downloadButton")
  .addEventListener("click", function () {
    const templateImage = document.getElementById("templateImage");
    const overlayImage = document.getElementById("overlayImage");

    removeBackground(overlayImage, function (processedOverlayImage) {
      // Create a canvas to combine the images
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // Set canvas dimensions to match the maximum width and height of both images
      const canvasWidth = Math.max(
        templateImage.naturalWidth,
        processedOverlayImage.naturalWidth + overlayImage.offsetLeft
      );
      const canvasHeight = Math.max(
        templateImage.naturalHeight,
        processedOverlayImage.naturalHeight + overlayImage.offsetTop
      );

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Draw the template image onto the canvas
      context.drawImage(
        templateImage,
        0,
        0,
        templateImage.naturalWidth,
        templateImage.naturalHeight
      );

      // Draw the processed overlay image onto the canvas at the specified position
      context.drawImage(
        processedOverlayImage,
        overlayImage.offsetLeft,
        overlayImage.offsetTop,
        overlayImage.width,
        overlayImage.height
      );

      // Create a link to download the image
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png", 1.0); // Set quality to 1.0 for maximum quality
      link.download = "result.png";
      link.click();
    });
  });
