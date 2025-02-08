let highestZ = 1;

class Paper {
  constructor() {
    this.holdingPaper = false;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.prevTouchX = 0;
    this.prevTouchY = 0;
    this.velX = 0;
    this.velY = 0;
    this.rotation = Math.random() * 30 - 15;
    this.currentPaperX = 0;
    this.currentPaperY = 0;
    this.rotating = false;
    this.initialTouchDistance = 0;
    this.initialRotation = 0;
  }

  init(paper) {
    // Prevent default touch behaviors
    paper.addEventListener('touchstart', (e) => {
      e.preventDefault();
    }, { passive: false });

    // Handle touch move events
    const handleTouchMove = (e) => {
      if (!this.holdingPaper) return;
      e.preventDefault();

      const touch = e.touches[0];

      if (e.touches.length === 2) {
        // Handle rotation with two fingers
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch2.clientX - touch.clientX,
          touch2.clientY - touch.clientY
        );
        const angle = Math.atan2(
          touch2.clientY - touch.clientY,
          touch2.clientX - touch.clientX
        );
        
        if (this.initialTouchDistance === 0) {
          this.initialTouchDistance = currentDistance;
          this.initialRotation = angle;
        }

        const rotationDelta = ((angle - this.initialRotation) * 180) / Math.PI;
        this.rotation = this.initialRotation + rotationDelta;
      } else {
        // Handle single finger drag
        this.velX = touch.clientX - this.prevTouchX;
        this.velY = touch.clientY - this.prevTouchY;
        
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
        
        this.prevTouchX = touch.clientX;
        this.prevTouchY = touch.clientY;
      }

      // Apply transforms
      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    };

    // Handle touch start
    paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ++;

      const touch = e.touches[0];
      this.prevTouchX = touch.clientX;
      this.prevTouchY = touch.clientY;
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;

      // Reset rotation tracking
      this.initialTouchDistance = 0;
      this.initialRotation = this.rotation;
    }, { passive: false });

    // Handle touch move
    paper.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Handle touch end
    paper.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;
      this.initialTouchDistance = 0;
    });

    // Prevent context menu on long press
    paper.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }
}

// Initialize papers
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.paper').forEach(paper => {
    new Paper().init(paper);
  });
});