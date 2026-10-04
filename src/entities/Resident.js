// Resident AI: Finite State Machine, Schedule Execution, Line of Sight Detection, and Prank Reactions

import { soundManager } from '../audio/SoundManager.js';

export const RESIDENT_STATE = {
  IDLE: 'IDLE',
  WALKING: 'WALKING',
  INTERACTING: 'INTERACTING',
  SUSPICIOUS: 'SUSPICIOUS',
  SEARCHING: 'SEARCHING',
  ANGRY: 'ANGRY',
  PRANK_REACTION: 'PRANK_REACTION',
  SLEEPING: 'SLEEPING'
};

export class Resident {
  constructor(config, houseConfig, routine = []) {
    this.config = config;
    this.houseConfig = houseConfig;
    this.routine = routine;

    this.x = 600;
    this.y = 590;
    this.width = 46;
    this.height = 80;
    this.facing = -1; // 1 = right, -1 = left

    this.state = RESIDENT_STATE.IDLE;
    this.currentRoom = null;
    this.routineIndex = 0;
    this.stateTimer = 0;

    // Movement physics
    this.speed = config.walkSpeed || 110;
    this.targetX = this.x;
    this.targetY = this.y;
    this.targetRoomId = null;
    this.walkCycle = 0;

    // Detection & Suspicion
    this.detectionRadius = config.detectionRadius || 280;
    this.visionAngle = config.visionAngle || 1.1; // radians
    this.suspicion = 0; // 0 to 100
    this.suspicionRate = config.suspicionRate || 1.0;
    this.isAlerted = false;

    // Prank reaction variables
    this.activePrank = null;
    this.prankAnimTimer = 0;
    this.prankType = null;

    // Speech bubble
    this.speechText = null;
    this.speechTimer = 0;

    // Callbacks to notify Game Engine
    this.onCaughtCallback = null;
    this.onPrankTriggeredCallback = null;
  }

  reset(routine) {
    this.routine = routine || this.routine;
    this.routineIndex = 0;
    this.state = RESIDENT_STATE.IDLE;
    this.suspicion = 0;
    this.isAlerted = false;
    this.activePrank = null;
    this.prankAnimTimer = 0;
    this.speechText = null;
    this.speechTimer = 0;

    if (this.routine.length > 0) {
      const firstStep = this.routine[0];
      const room = this.houseConfig.rooms.find(r => r.id === firstStep.roomId) || this.houseConfig.rooms[0];
      this.currentRoom = room;
      this.x = firstStep.x;
      this.y = room.y + room.height - 20;
      this.targetX = this.x;
      this.targetY = this.y;
      this.stateTimer = firstStep.duration || 5;
      if (firstStep.speech) {
        this.say(firstStep.speech, 3);
      }
    }
  }

  say(text, duration = 3) {
    this.speechText = text;
    this.speechTimer = duration;
  }

  update(dt, player, rooms, doors, interactiveObjects) {
    // Update speech bubble
    if (this.speechTimer > 0) {
      this.speechTimer -= dt;
      if (this.speechTimer <= 0) {
        this.speechText = null;
      }
    }

    // Determine current room from position
    const room = rooms.find(r => 
      this.x >= r.x && this.x <= r.x + r.width &&
      this.y >= r.y && this.y <= r.y + r.height + 40
    );
    if (room) this.currentRoom = room;

    // Check Detection Cone with Player
    this.updateDetection(dt, player);

    // If caught, trigger caught event
    if (this.suspicion >= 100 && this.state !== RESIDENT_STATE.ANGRY) {
      this.state = RESIDENT_STATE.ANGRY;
      this.say(this.config.gender === 'male' ? "AYE! PAKDE GAYE! KYA KAR RAHE HO YAHAAN?! 😡" : "HAYE RAM! CHOR CHOR! PAKDO ISE! 😱💥", 4);
      soundManager.playCaught();
      if (this.onCaughtCallback) {
        this.onCaughtCallback();
      }
      return;
    }

    // Execute state logic
    switch (this.state) {
      case RESIDENT_STATE.PRANK_REACTION:
        this.updatePrankReaction(dt);
        break;

      case RESIDENT_STATE.WALKING:
        this.updateWalking(dt, rooms, doors, interactiveObjects);
        break;

      case RESIDENT_STATE.INTERACTING:
      case RESIDENT_STATE.IDLE:
      case RESIDENT_STATE.SLEEPING:
        this.updateRoutineWait(dt, interactiveObjects);
        break;

      case RESIDENT_STATE.SUSPICIOUS:
        this.updateSuspicious(dt);
        break;
    }
  }

  updateDetection(dt, player) {
    // If player is hidden, resident CANNOT detect player
    if (player.isHidden) {
      if (this.suspicion > 0) {
        this.suspicion = Math.max(0, this.suspicion - dt * 25);
      }
      return;
    }

    // Check if player and resident are in the same room
    const sameRoom = (this.currentRoom && player.currentRoom && this.currentRoom.id === player.currentRoom.id);
    if (!sameRoom) {
      if (this.suspicion > 0) {
        this.suspicion = Math.max(0, this.suspicion - dt * 25);
      }
      return;
    }

    // Distance calculation
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.hypot(dx, dy);

    // Facing check: resident faces player?
    const isFacingPlayer = (this.facing === 1 && dx > -20) || (this.facing === -1 && dx < 20);

    if (dist < this.detectionRadius && isFacingPlayer) {
      // Build suspicion quickly
      const rate = 55 * this.suspicionRate;
      this.suspicion = Math.min(100, this.suspicion + dt * rate);

      if (this.suspicion > 40 && !this.isAlerted) {
        this.isAlerted = true;
        soundManager.playDetectionWarning();
        this.say("Kaun hai wahaan?! 👀", 1.8);
      }
    } else {
      // Cooldown
      if (this.suspicion > 0) {
        this.suspicion = Math.max(0, this.suspicion - dt * 20);
        if (this.suspicion < 30) {
          this.isAlerted = false;
        }
      }
    }
  }

  updateRoutineWait(dt, interactiveObjects) {
    this.stateTimer -= dt;
    if (this.stateTimer <= 0) {
      // Advance to next routine step
      this.advanceRoutine(interactiveObjects);
    }
  }

  advanceRoutine(interactiveObjects) {
    if (this.routine.length === 0) return;

    this.routineIndex = (this.routineIndex + 1) % this.routine.length;
    const nextStep = this.routine[this.routineIndex];

    const targetRoom = this.houseConfig.rooms.find(r => r.id === nextStep.roomId);
    if (targetRoom) {
      this.targetRoomId = nextStep.roomId;
      this.targetX = nextStep.x;
      this.targetY = targetRoom.y + targetRoom.height - 20;

      // Check if moving to another room or another floor
      if (this.currentRoom && this.currentRoom.id !== targetRoom.id) {
        this.state = RESIDENT_STATE.WALKING;
        this.say(nextStep.speech || "Hmm...", 2.5);
      } else {
        // Same room, just walk over
        this.state = RESIDENT_STATE.WALKING;
      }
    }
  }

  updateWalking(dt, rooms, doors, interactiveObjects) {
    const dist = Math.hypot(this.targetX - this.x, this.targetY - this.y);

    if (dist > 10) {
      const angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);

      if (dx > 0.1) this.facing = 1;
      else if (dx < -0.1) this.facing = -1;

      this.x += dx * this.speed * dt;
      this.y += dy * (this.speed * 0.4) * dt;

      this.walkCycle += dt * 8;

      // Handle stairs/doors teleport when changing floor
      const currentStep = this.routine[this.routineIndex];
      if (currentStep && this.currentRoom && this.currentRoom.id !== currentStep.roomId) {
        // If close to door or stairs connecting current room to target room
        const connDoor = doors.find(d => 
          (d.from === this.currentRoom.id && d.to === currentStep.roomId) ||
          (d.to === this.currentRoom.id && d.from === currentStep.roomId)
        );
        if (connDoor && Math.hypot(connDoor.x - this.x, connDoor.y - this.y) < 45) {
          if (connDoor.toX !== undefined && connDoor.toY !== undefined) {
            this.x = connDoor.toX;
            this.y = connDoor.toY;
          }
        }
      }
    } else {
      // Reached destination!
      this.walkCycle = 0;
      const currentStep = this.routine[this.routineIndex];

      // Check if this routine step interacts with a tampered prank object!
      if (currentStep && currentStep.checkPrankId) {
        if (this.onPrankTriggeredCallback) {
          const triggered = this.onPrankTriggeredCallback(currentStep.checkPrankId);
          if (triggered) {
            return; // Prank reaction triggered!
          }
        }
      }

      // Normal interaction or idle wait
      this.state = RESIDENT_STATE.INTERACTING;
      this.stateTimer = (currentStep && currentStep.duration) ? currentStep.duration : 6;
      if (currentStep && currentStep.speech) {
        this.say(currentStep.speech, 3);
      }
    }
  }

  triggerPrankReaction(prank) {
    this.activePrank = prank;
    this.state = RESIDENT_STATE.PRANK_REACTION;
    this.prankAnimTimer = 4.0; // 4 seconds of hilarious slapstick
    this.prankType = prank.prankAnimation || 'spit_tea';
    this.say(prank.successDialogue, 4.0);
    soundManager.playPrankSuccess();
  }

  updatePrankReaction(dt) {
    this.prankAnimTimer -= dt;
    if (this.prankAnimTimer <= 0) {
      this.state = RESIDENT_STATE.IDLE;
      this.activePrank = null;
      this.stateTimer = 2.0; // recover brief pause
      this.say("Ufff! Yeh kya badtameezi hai!", 2.5);
    }
  }

  updateSuspicious(dt) {
    this.stateTimer -= dt;
    if (this.stateTimer <= 0) {
      this.state = RESIDENT_STATE.IDLE;
      this.stateTimer = 3;
    }
  }
}
