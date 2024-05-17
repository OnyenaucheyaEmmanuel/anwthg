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

document
  .getElementById("downloadButton")
  .addEventListener("click", function () {
    const templateImage = document.getElementById("templateImage");
    const overlayImage = document.getElementById("overlayImage");

    // Create a canvas to combine the images
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Set canvas dimensions to match the maximum width and height of both images
    const canvasWidth = Math.max(
      templateImage.width,
      overlayImage.width + overlayImage.offsetLeft
    );
    const canvasHeight = Math.max(
      templateImage.height,
      overlayImage.height + overlayImage.offsetTop
    );

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Draw the template image onto the canvas
    context.drawImage(
      templateImage,
      0,
      0,
      templateImage.width,
      templateImage.height
    );

    // Draw the overlay image onto the canvas at the specified position
    context.drawImage(
      overlayImage,
      overlayImage.offsetLeft,
      overlayImage.offsetTop,
      overlayImage.width,
      overlayImage.height
    );

    // Create a link to download the image
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "result.png";
    link.click();
  });
