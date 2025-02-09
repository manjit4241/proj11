let highestZ = 1;

class Paper {
  constructor() {
    this.holdingPaper = false;
    this.currentX = 0;
    this.currentY = 0;
    this.rotation = Math.random() * 30 - 15;
    this.currentPaperX = 0;
    this.currentPaperY = 0;
    this.rotating = false;
    this.initialDistance = 0;
    this.initialRotation = 0;
  }

  init(paper) {
    // Mouse Event Handlers
    const mouseDownHandler = (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      
      paper.style.zIndex = highestZ++;
      
      if (e.button === 0) {
        this.currentX = e.clientX;
        this.currentY = e.clientY;
        this.prevX = e.clientX;
        this.prevY = e.clientY;
      }
      if (e.button === 2) {
        this.rotating = true;
      }
    };

    const mouseMoveHandler = (e) => {
      if (!this.holdingPaper) return;
      
      if (!this.rotating) {
        const deltaX = e.clientX - this.prevX;
        const deltaY = e.clientY - this.prevY;
        
        this.currentPaperX += deltaX;
        this.currentPaperY += deltaY;
        
        this.prevX = e.clientX;
        this.prevY = e.clientY;
      } else {
        const dirX = e.clientX - this.currentX;
        const dirY = e.clientY - this.currentY;
        const angle = Math.atan2(dirY, dirX);
        this.rotation = (angle * 180 / Math.PI + 360) % 360;
      }
      
      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    };

    // Touch Event Handlers
    const touchStartHandler = (e) => {
      e.preventDefault();
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ++;

      const touch = e.touches[0];
      this.currentX = touch.clientX;
      this.currentY = touch.clientY;
      this.prevX = touch.clientX;
      this.prevY = touch.clientY;

      if (e.touches.length === 2) {
        this.initialDistance = 0;
        this.initialRotation = this.rotation;
      }
    };

    const touchMoveHandler = (e) => {
      if (!this.holdingPaper) return;
      e.preventDefault();

      if (e.touches.length === 2) {
        // Two-finger rotation
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        const angle = Math.atan2(
          touch2.clientY - touch1.clientY,
          touch2.clientX - touch1.clientX
        );

        if (this.initialDistance === 0) {
          this.initialDistance = currentDistance;
          this.initialRotation = angle;
        }

        const rotationDelta = ((angle - this.initialRotation) * 180) / Math.PI;
        this.rotation = this.initialRotation + rotationDelta;
      } else {
        // Single finger drag
        const touch = e.touches[0];
        const deltaX = touch.clientX - this.prevX;
        const deltaY = touch.clientY - this.prevY;
        
        this.currentPaperX += deltaX;
        this.currentPaperY += deltaY;
        
        this.prevX = touch.clientX;
        this.prevY = touch.clientY;
      }

      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    };

    const endHandler = () => {
      this.holdingPaper = false;
      this.rotating = false;
      this.initialDistance = 0;
    };

    // Add Mouse Event Listeners
    paper.addEventListener('mousedown', mouseDownHandler);
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', endHandler);

    // Add Touch Event Listeners
    paper.addEventListener('touchstart', touchStartHandler, { passive: false });
    paper.addEventListener('touchmove', touchMoveHandler, { passive: false });
    paper.addEventListener('touchend', endHandler);
    paper.addEventListener('touchcancel', endHandler);

    // Prevent context menu
    paper.addEventListener('contextmenu', (e) => e.preventDefault());
  }
}

// Initialize all papers when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.paper').forEach(paper => {
    new Paper().init(paper);
  });
});