let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Disable all scrolling while dragging
    const disableScroll = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Touch Move Handler (Dragging)
    const touchMoveHandler = (e) => {
      if (!this.holdingPaper) return;
      e.preventDefault();

      const touch = e.touches[0];

      if (!this.rotating) {
        this.velX = touch.clientX - this.prevTouchX;
        this.velY = touch.clientY - this.prevTouchY;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevTouchX = touch.clientX;
        this.prevTouchY = touch.clientY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    // Touch Start Handler (Start Dragging)
    const touchStartHandler = (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      // Fully disable scrolling
      document.addEventListener("touchmove", disableScroll, { passive: false });
      document.addEventListener("wheel", disableScroll, { passive: false });

      paper.style.zIndex = highestZ;
      highestZ += 1;

      const touch = e.touches[0];
      this.prevTouchX = touch.clientX;
      this.prevTouchY = touch.clientY;

      // Two-finger rotation check
      if (e.touches.length === 2) {
        this.rotating = true;
      }
    };

    // Touch End Handler (Stop Dragging)
    const touchEndHandler = () => {
      this.holdingPaper = false;
      this.rotating = false;

      // Restore scrolling
      document.removeEventListener("touchmove", disableScroll);
      document.removeEventListener("wheel", disableScroll);
    };

    // Add event listeners
    paper.addEventListener("touchmove", touchMoveHandler, { passive: false });
    paper.addEventListener("touchstart", touchStartHandler, { passive: false });
    paper.addEventListener("touchend", touchEndHandler);
  }
}

// Initialize all paper elements
document.querySelectorAll(".paper").forEach((paper) => {
  new Paper().init(paper);
});
