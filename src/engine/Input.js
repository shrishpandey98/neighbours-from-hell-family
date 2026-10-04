// Touch, Joystick, Tap-to-move, and Keyboard Input Controller

export class InputManager {
  constructor(canvasElement, joystickElement, joystickKnob) {
    this.canvas = canvasElement;
    this.joystickZone = joystickElement;
    this.joystickKnob = joystickKnob;

    // Movement vector: -1 to +1
    this.moveX = 0;
    this.moveY = 0;

    // Tap-to-move destination in world coords
    this.targetMoveX = null;
    this.targetMoveY = null;

    // Keyboard state
    this.keys = {};

    // Joystick touch tracking
    this.touchId = null;
    this.joystickActive = false;
    this.joystickCenter = { x: 0, y: 0 };
    this.maxRadius = 45; // pixel travel

    this.onTapWorld = null; // callback (worldX, worldY)
    this.onActionCallback = null;

    this.bindEvents();
  }

  bindEvents() {
    // Keyboard handlers
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      this.updateMovement();
      if (e.code === 'KeyE' || e.code === 'Space') {
        if (this.onActionCallback) this.onActionCallback('interact');
      }
      if (e.code === 'KeyH') {
        if (this.onActionCallback) this.onActionCallback('hide');
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      this.updateMovement();
    });

    // Canvas click / tap-to-move
    this.canvas.addEventListener('pointerdown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = 1280 / rect.width;
      const scaleY = 720 / rect.height;
      const canvasX = (e.clientX - rect.left) * scaleX;
      const canvasY = (e.clientY - rect.top) * scaleY;

      if (this.onTapWorld) {
        this.onTapWorld(canvasX, canvasY);
      }
    });

    // Virtual Joystick Touch Events
    if (this.joystickZone && this.joystickKnob) {
      const startTouch = (clientX, clientY) => {
        const rect = this.joystickZone.getBoundingClientRect();
        this.joystickCenter = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
        this.joystickActive = true;
        this.updateJoystick(clientX, clientY);
      };

      this.joystickZone.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.touchId = e.pointerId;
        this.joystickZone.setPointerCapture(e.pointerId);
        startTouch(e.clientX, e.clientY);
      });

      this.joystickZone.addEventListener('pointermove', (e) => {
        if (this.joystickActive && e.pointerId === this.touchId) {
          e.preventDefault();
          this.updateJoystick(e.clientX, e.clientY);
        }
      });

      const endTouch = (e) => {
        if (e.pointerId === this.touchId) {
          this.joystickActive = false;
          this.touchId = null;
          this.moveX = 0;
          this.moveY = 0;
          if (this.joystickKnob) {
            this.joystickKnob.style.transform = 'translate(0px, 0px)';
          }
        }
      };

      this.joystickZone.addEventListener('pointerup', endTouch);
      this.joystickZone.addEventListener('pointercancel', endTouch);
    }
  }

  updateJoystick(clientX, clientY) {
    const dx = clientX - this.joystickCenter.x;
    const dy = clientY - this.joystickCenter.y;
    const dist = Math.hypot(dx, dy);

    if (dist === 0) {
      this.moveX = 0;
      this.moveY = 0;
      return;
    }

    const clampedDist = Math.min(dist, this.maxRadius);
    const angle = Math.atan2(dy, dx);
    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;

    if (this.joystickKnob) {
      this.joystickKnob.style.transform = `translate(${knobX}px, ${knobY}px)`;
    }

    // Normalized speed
    this.moveX = knobX / this.maxRadius;
    this.moveY = knobY / this.maxRadius;

    // Reset tap-to-move if using joystick
    this.targetMoveX = null;
    this.targetMoveY = null;
  }

  updateMovement() {
    if (this.joystickActive) return;

    let x = 0;
    let y = 0;
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) x -= 1;
    if (this.keys['ArrowRight'] || this.keys['KeyD']) x += 1;
    if (this.keys['ArrowUp'] || this.keys['KeyW']) y -= 1;
    if (this.keys['ArrowDown'] || this.keys['KeyS']) y += 1;

    if (x !== 0 && y !== 0) {
      const mag = Math.hypot(x, y);
      x /= mag;
      y /= mag;
    }

    this.moveX = x;
    this.moveY = y;

    if (x !== 0 || y !== 0) {
      this.targetMoveX = null;
      this.targetMoveY = null;
    }
  }

  setTargetPosition(x, y) {
    this.targetMoveX = x;
    this.targetMoveY = y;
  }

  clearTargetPosition() {
    this.targetMoveX = null;
    this.targetMoveY = null;
  }
}
