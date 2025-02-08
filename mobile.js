let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Disable scrolling when dragging
    const disableScroll = (e) => e.preventDefault();

    // Touch Move Handler (Dragging)
    const touchMoveHandler = (e) => {
      if (!this.holdingPaper) return;
      e.preventDefault(); // Stops page scrolling

      const touch = e.touches[0];

      if (!this.rotating) {
        this.touchMoveX = touch.clientX;
        this.touchMoveY = touch.clientY;
        
        this.velX = this.touchMoveX - this.prevTouchX;
        this.velY = this.touchMoveY - this.prevTouchY;
      }

      const dirX = touch.clientX - this.touchStartX;
      const dirY = touch.clientY - this.touchStartY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (360 + Math.round((180 * angle) / Math.PI)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevTouchX = this.touchMoveX;
        this.prevTouchY = this.touchMoveY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    // Touch Start Handler (Start Dragging)
    const touchStartHandler = (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      // Disable page scrolling
      document.body.style.overflow = "hidden";
      document.addEventListener("touchmove", disableScroll, { passive: false });

      paper.style.zIndex = highestZ;
      highestZ += 1;

      const touch = e.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
      this.prevTouchX = this.touchStartX;
      this.prevTouchY = this.touchStartY;

      // Check for two-finger touch (Rotation)
      if (e.touches.length === 2) {
        this.rotating = true;
      }
    };

    // Touch End Handler (Stop Dragging)
    const touchEndHandler = () => {
      this.holdingPaper = false;
      this.rotating = false;

      // Restore page scrolling
      document.body.style.overflow = "";
      document.removeEventListener("touchmove", disableScroll);
    };

    // Add event listeners
    paper.addEventListener("touchmove", touchMoveHandler, { passive: false });
    paper.addEventListener("touchstart", touchStartHandler, { passive: false });
    paper.addEventListener("touchend", touchEndHandler);
  }
}

// Initialize all paper elements
const papers = Array.from(document.querySelectorAll(".paper"));

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
