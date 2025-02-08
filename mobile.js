let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  currentPaperX = 0;
  currentPaperY = 0;
  rotation = Math.random() * 30 - 15;

  init(paper) {
    // Touch Start Handler (Start Dragging)
    const touchStartHandler = (e) => {
      if (this.holdingPaper) return;

      // Prevent default behavior (scrolling, refreshing, etc.)
      e.preventDefault();

      this.holdingPaper = true;

      // Bring the paper to the front
      paper.style.zIndex = highestZ;
      highestZ += 1;

      // Get the initial touch position
      const touch = e.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;

      // Store the current paper position
      const transform = paper.style.transform;
      if (transform) {
        const match = transform.match(/translateX\(([-\d.]+)px\) translateY\(([-\d.]+)px\)/);
        if (match) {
          this.currentPaperX = parseFloat(match[1]);
          this.currentPaperY = parseFloat(match[2]);
        }
      }
    };

    // Touch Move Handler (Dragging)
    const touchMoveHandler = (e) => {
      if (!this.holdingPaper) return;

      // Prevent default behavior (scrolling, refreshing, etc.)
      e.preventDefault();

      const touch = e.touches[0];

      // Calculate the distance moved
      const deltaX = touch.clientX - this.touchStartX;
      const deltaY = touch.clientY - this.touchStartY;

      // Update the paper's position
      const newX = this.currentPaperX + deltaX;
      const newY = this.currentPaperY + deltaY;

      paper.style.transform = `translateX(${newX}px) translateY(${newY}px) rotateZ(${this.rotation}deg)`;
    };

    // Touch End Handler (Stop Dragging)
    const touchEndHandler = () => {
      this.holdingPaper = false;

      // Update the current paper position for the next drag
      const transform = paper.style.transform;
      if (transform) {
        const match = transform.match(/translateX\(([-\d.]+)px\) translateY\(([-\d.]+)px\)/);
        if (match) {
          this.currentPaperX = parseFloat(match[1]);
          this.currentPaperY = parseFloat(match[2]);
        }
      }
    };

    // Add event listeners
    paper.addEventListener("touchstart", touchStartHandler, { passive: false });
    paper.addEventListener("touchmove", touchMoveHandler, { passive: false });
    paper.addEventListener("touchend", touchEndHandler);
  }
}

// Initialize all paper elements
document.querySelectorAll(".paper").forEach((paper) => {
  new Paper().init(paper);
});