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

    // Set canvas dimensions to match the template image
    canvas.width = templateImage.width;
    canvas.height = templateImage.height;

    // Draw the template image onto the canvas
    context.drawImage(templateImage, 0, 0);

    // Get the CSS defined position of the overlay image
    const overlayLeft = parseFloat(window.getComputedStyle(overlayImage).left);
    const overlayTop = parseFloat(window.getComputedStyle(overlayImage).top);

    // Draw the overlay image onto the canvas at the specified position
    context.drawImage(
      overlayImage,
      overlayLeft,
      overlayTop,
      overlayImage.width,
      overlayImage.height
    );

    // Create a link to download the image
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "result.png";
    link.click();
  });
