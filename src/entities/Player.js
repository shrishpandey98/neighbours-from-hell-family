// Player Entity: Position, Movement, Hiding, and Inventory

import { AVATARS } from '../config/avatars.js';
import { soundManager } from '../audio/SoundManager.js';

export class Player {
  constructor(name = 'Chintu', avatarId = 'chintu') {
    this.name = name;
    this.avatarId = avatarId;
    this.avatarConfig = AVATARS.find(a => a.id === avatarId) || AVATARS[0];

    this.x = 200;
    this.y = 590; // baseline floor
    this.width = 44;
    this.height = 76;
    this.speed = 175; // px per second

    this.facing = 1; // 1 = right, -1 = left
    this.isMoving = false;
    this.walkCycle = 0;
    this.stepTimer = 0;

    this.currentRoom = null;
    this.isHidden = false;
    this.hidingSpot = null;

    this.inventory = []; // max 4 items
    this.selectedItemIndex = -1;

    // Nearby interaction highlights
    this.nearbyObject = null;
    this.nearbyHidingSpot = null;
    this.nearbyDoor = null;

    // Visual speech bubble
    this.speechText = null;
    this.speechTimer = 0;
  }

  setAvatar(avatarId) {
    this.avatarId = avatarId;
    this.avatarConfig = AVATARS.find(a => a.id === avatarId) || AVATARS[0];
  }

  resetPosition(x, y, room) {
    this.x = x;
    this.y = y;
    this.currentRoom = room;
    this.isHidden = false;
    this.hidingSpot = null;
    this.isMoving = false;
    this.walkCycle = 0;
    this.inventory = [];
    this.selectedItemIndex = -1;
    this.speechText = null;
  }

  say(text, duration = 3) {
    this.speechText = text;
    this.speechTimer = duration;
  }

  addItem(item) {
    if (this.inventory.length < 4) {
      this.inventory.push(item);
      soundManager.playPickup();
      this.say(`Picked up ${item.name}! 🎒`, 2.5);
      return true;
    }
    this.say("Pockets are full! Can't carry more items.", 2);
    return false;
  }

  hasItem(itemId) {
    return this.inventory.some(i => i.id === itemId);
  }

  removeItem(itemId) {
    const idx = this.inventory.findIndex(i => i.id === itemId);
    if (idx !== -1) {
      const item = this.inventory.splice(idx, 1)[0];
      if (this.selectedItemIndex >= this.inventory.length) {
        this.selectedItemIndex = this.inventory.length - 1;
      }
      return item;
    }
    return null;
  }

  getSelectedItem() {
    if (this.selectedItemIndex >= 0 && this.selectedItemIndex < this.inventory.length) {
      return this.inventory[this.selectedItemIndex];
    }
    return null;
  }

  enterHiding(hidingSpot) {
    this.isHidden = true;
    this.hidingSpot = hidingSpot;
    this.x = hidingSpot.x + hidingSpot.width / 2;
    this.y = hidingSpot.y + hidingSpot.height;
    soundManager.playClick();
    this.say(`Hidden inside ${hidingSpot.name}! 🤫`, 2);
  }

  exitHiding() {
    this.isHidden = false;
    this.hidingSpot = null;
    soundManager.playClick();
    this.say("Stepped out...", 1.5);
  }

  update(dt, input, rooms, doors, objects, hidingSpots) {
    // Update speech bubble timer
    if (this.speechTimer > 0) {
      this.speechTimer -= dt;
      if (this.speechTimer <= 0) {
        this.speechText = null;
      }
    }

    // If hidden, no manual movement unless input given to break hiding
    if (this.isHidden) {
      if (Math.hypot(input.moveX, input.moveY) > 0.3 || input.targetMoveX !== null) {
        this.exitHiding();
      } else {
        return;
      }
    }

    let dx = 0;
    let dy = 0;

    // Tap-to-move handling
    if (input.targetMoveX !== null && input.targetMoveY !== null) {
      const toX = input.targetMoveX;
      const toY = input.targetMoveY;
      const dist = Math.hypot(toX - this.x, toY - this.y);

      if (dist > 8) {
        const angle = Math.atan2(toY - this.y, toX - this.x);
        dx = Math.cos(angle);
        dy = Math.sin(angle);
      } else {
        input.clearTargetPosition();
      }
    } else {
      dx = input.moveX;
      dy = input.moveY;
    }

    const moveMag = Math.hypot(dx, dy);
    this.isMoving = moveMag > 0.1;

    if (this.isMoving) {
      if (dx > 0.1) this.facing = 1;
      else if (dx < -0.1) this.facing = -1;

      // Animate walk cycle
      this.walkCycle += dt * 10 * moveMag;
      this.stepTimer += dt;
      if (this.stepTimer >= 0.28) {
        soundManager.playFootstep();
        this.stepTimer = 0;
      }

      // Move player horizontally & slightly vertically within room boundaries
      const targetX = this.x + dx * this.speed * dt;
      const targetY = this.y + dy * (this.speed * 0.5) * dt;

      // Determine current room
      const currentRoom = rooms.find(r => 
        targetX >= r.x && targetX <= r.x + r.width &&
        targetY >= r.y + 40 && targetY <= r.y + r.height
      );

      if (currentRoom) {
        this.currentRoom = currentRoom;
        // Clamp to room bounds
        this.x = Math.max(currentRoom.x + 24, Math.min(currentRoom.x + currentRoom.width - 24, targetX));
        // Vertical floor line clamping
        const floorBase = currentRoom.y + currentRoom.height - 20;
        this.y = Math.max(floorBase - 40, Math.min(floorBase, targetY));
      } else {
        // Check if passing through door or stairs
        const door = doors.find(d => Math.hypot(d.x - this.x, d.y - this.y) < 50);
        if (door) {
          if (door.toX !== undefined && door.toY !== undefined) {
            this.x = door.toX;
            this.y = door.toY;
            input.clearTargetPosition();
            soundManager.playFootstep();
          }
        }
      }
    } else {
      this.walkCycle = 0;
      this.stepTimer = 0;
    }

    // Proximity checks for nearby interactive elements
    this.updateNearbyInteractions(objects, hidingSpots, doors);
  }

  updateNearbyInteractions(objects, hidingSpots, doors) {
    // Interactive Objects
    let closestObj = null;
    let closestDist = 70;
    for (const obj of objects) {
      const d = Math.hypot(obj.x - this.x, obj.y - this.y);
      if (d < closestDist) {
        closestDist = d;
        closestObj = obj;
      }
    }
    this.nearbyObject = closestObj;

    // Hiding Spots
    let closestHide = null;
    let closestHideDist = 65;
    for (const spot of hidingSpots) {
      const spotCenterX = spot.x + spot.width / 2;
      const spotCenterY = spot.y + spot.height / 2;
      const d = Math.hypot(spotCenterX - this.x, spotCenterY - this.y);
      if (d < closestHideDist) {
        closestHideDist = d;
        closestHide = spot;
      }
    }
    this.nearbyHidingSpot = closestHide;

    // Doors / Stairs
    let closestDoor = null;
    let closestDoorDist = 60;
    for (const door of doors) {
      const d = Math.hypot(door.x - this.x, door.y - this.y);
      if (d < closestDoorDist) {
        closestDoorDist = d;
        closestDoor = door;
      }
    }
    this.nearbyDoor = closestDoor;
  }
}
