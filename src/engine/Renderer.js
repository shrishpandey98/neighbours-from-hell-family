// High-Fidelity 2D Cartoon Cutaway House Engine Renderer
// Cross-section rooms, rich environment props, animated characters, detection cones, and PiP monitor

export class Renderer {
  constructor(canvas, pipCanvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.pipCanvas = pipCanvas;
    this.pipCtx = pipCanvas ? pipCanvas.getContext('2d') : null;

    this.width = 1280;
    this.height = 720;
    this.particles = [];
    this.fanAngle = 0;
    this.clockTick = 0;
  }

  addParticle(x, y, type = 'star') {
    this.particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 140,
      vy: -80 - Math.random() * 90,
      size: 16 + Math.random() * 12,
      alpha: 1.0,
      color: type === 'heart' ? '#ec4899' : (type === 'smoke' ? '#94a3b8' : '#facc15'),
      char: type === 'star' ? '⭐' : (type === 'laugh' ? '😂' : (type === 'smoke' ? '💨' : (type === 'drop' ? '💦' : '✨'))),
      life: 1.3
    });
  }

  updateParticles(dt) {
    this.fanAngle += dt * 5;
    this.clockTick += dt;

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      p.alpha = Math.max(0, p.life / 1.3);
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  render(houseConfig, levelConfig, player, resident, objects, hidingSpots, dt) {
    this.updateParticles(dt);

    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Exterior Sky & Foundation
    this.drawSkyAndFoundation(ctx, houseConfig);

    // 2. Room Walls, Wallpaper, Floorboards, Moldings
    this.drawRooms(ctx, houseConfig);

    // 3. Environmental Room Props & Furniture
    this.drawRoomProps(ctx, houseConfig);

    // 4. Doors and Stairs
    this.drawDoorsAndStairs(ctx, houseConfig);

    // 5. Hiding Spots
    this.drawHidingSpots(ctx, hidingSpots, player);

    // 6. Interactive Objects & Pickups
    this.drawInteractiveObjects(ctx, objects, levelConfig.items, player);

    // 7. Resident Detection Cone
    this.drawVisionCone(ctx, resident);

    // 8. Animated Characters
    this.drawPlayer(ctx, player);
    this.drawResident(ctx, resident);

    // 9. Comic Slapstick Particles
    this.drawParticles(ctx);

    // 10. Speech Bubbles
    if (player.speechText) {
      this.drawSpeechBubble(ctx, player.x, player.y - player.height - 12, player.speechText, '#38bdf8', '#0f172a');
    }
    if (resident.speechText) {
      this.drawSpeechBubble(ctx, resident.x, resident.y - resident.height - 18, resident.speechText, '#facc15', '#422006');
    }

    // 11. Render Live CRT PiP Resident Monitor
    this.renderPipCamera(houseConfig, resident);
  }

  drawSkyAndFoundation(ctx, house) {
    // Night sky gradient
    const grad = ctx.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, '#020617');
    grad.addColorStop(0.6, '#0f172a');
    grad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Little cartoon stars in sky background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    const starCoords = [[100, 20], [300, 30], [550, 15], [800, 25], [1050, 18], [1200, 35]];
    starCoords.forEach(([sx, sy]) => {
      ctx.beginPath();
      ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // House roof overhang & terracotta trim
    ctx.fillStyle = house.themeColor || '#ea580c';
    ctx.beginPath();
    ctx.moveTo(25, 45);
    ctx.lineTo(this.width / 2, 16);
    ctx.lineTo(this.width - 25, 45);
    ctx.lineTo(this.width - 20, 52);
    ctx.lineTo(20, 52);
    ctx.closePath();
    ctx.fill();

    // Outer masonry border
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 6;
    ctx.strokeRect(36, 46, this.width - 72, this.height - 60);
  }

  drawRooms(ctx, house) {
    for (const room of house.rooms) {
      // Room Wall Background
      ctx.fillStyle = house.wallColor1 || '#fff7ed';
      ctx.fillRect(room.x, room.y, room.width, room.height);

      // Wallpaper Patterns
      ctx.fillStyle = house.wallColor2 || '#fed7aa';
      ctx.globalAlpha = 0.22;
      if (room.bgPattern === 'stripes') {
        for (let sx = room.x; sx < room.x + room.width; sx += 26) {
          ctx.fillRect(sx, room.y, 13, room.height);
        }
      } else if (room.bgPattern === 'tiles' || room.bgPattern === 'checker') {
        for (let tx = room.x; tx < room.x + room.width; tx += 40) {
          for (let ty = room.y; ty < room.y + room.height; ty += 40) {
            if ((Math.floor(tx / 40) + Math.floor(ty / 40)) % 2 === 0) {
              ctx.fillRect(tx, ty, 40, 40);
            }
          }
        }
      } else if (room.bgPattern === 'brick') {
        for (let by = room.y; by < room.y + room.height; by += 22) {
          const shift = (Math.floor(by / 22) % 2) * 20;
          for (let bx = room.x - 20; bx < room.x + room.width; bx += 40) {
            ctx.strokeRect(bx + shift, by, 38, 20);
          }
        }
      } else {
        // Floral / wallpaper diamond motif
        for (let dx = room.x + 20; dx < room.x + room.width; dx += 45) {
          for (let dy = room.y + 20; dy < room.y + room.height; dy += 45) {
            ctx.beginPath();
            ctx.arc(dx, dy, 5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.globalAlpha = 1.0;

      // Baseboard / Floorboards
      ctx.fillStyle = house.floorColor || '#78350f';
      ctx.fillRect(room.x, room.y + room.height - 24, room.width, 24);

      // Wood plank lines
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 2;
      for (let px = room.x; px < room.x + room.width; px += 80) {
        ctx.beginPath();
        ctx.moveTo(px, room.y + room.height - 24);
        ctx.lineTo(px, room.y + room.height);
        ctx.stroke();
      }

      // Ceiling Molding
      ctx.fillStyle = '#475569';
      ctx.fillRect(room.x, room.y, room.width, 10);

      // Outer Room Dividers
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 4;
      ctx.strokeRect(room.x, room.y, room.width, room.height);

      // Room Name Sign
      ctx.font = 'bold 16px sans-serif';
      const nameTxt = room.name.toUpperCase();
      const txtMetrics = ctx.measureText(nameTxt);
      const signW = Math.max(170, txtMetrics.width + 32);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
      ctx.beginPath();
      ctx.roundRect(room.x + 14, room.y + 14, signW, 32, 8);
      ctx.fill();
      ctx.strokeStyle = house.accentColor || '#f97316';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.fillText(nameTxt, room.x + 22, room.y + 36);
    }
  }

  drawRoomProps(ctx, house) {
    for (const room of house.rooms) {
      const rx = room.x;
      const ry = room.y;
      const rw = room.width;
      const rh = room.height;
      const floorY = ry + rh - 24;

      if (room.roomType === 'kitchen') {
        // Kitchen Counter & Gas Stove
        ctx.fillStyle = '#64748b';
        ctx.fillRect(rx + 20, floorY - 50, 160, 50);
        // Marble top
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(rx + 16, floorY - 56, 168, 8);
        // Stove burners
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(rx + 35, floorY - 60, 36, 4);
        ctx.fillRect(rx + 110, floorY - 60, 36, 4);
        // Simmering kettle
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(rx + 53, floorY - 70, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(rx + 48, floorY - 86, 10, 8);
        // Steam puffs
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(rx + 55, floorY - 94, 5 + Math.sin(this.clockTick * 4) * 2, 0, Math.PI * 2);
        ctx.fill();

        // Spice shelves on wall
        ctx.fillStyle = '#78350f';
        ctx.fillRect(rx + 220, ry + 90, 140, 8);
        // Spice jars
        const jarColors = ['#f59e0b', '#ef4444', '#10b981', '#6366f1'];
        jarColors.forEach((jc, idx) => {
          ctx.fillStyle = jc;
          ctx.fillRect(rx + 230 + idx * 30, ry + 68, 16, 22);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(rx + 232 + idx * 30, ry + 64, 12, 4);
        });

      } else if (room.roomType === 'living') {
        // Persian Rug on floor
        ctx.fillStyle = '#991b1b';
        ctx.beginPath();
        ctx.roundRect(rx + rw / 2 - 120, floorY - 8, 240, 8, 3);
        ctx.fill();
        ctx.fillStyle = '#facc15';
        ctx.fillRect(rx + rw / 2 - 110, floorY - 7, 220, 2);

        // TV Stand & Flat Screen TV
        ctx.fillStyle = '#451a03';
        ctx.fillRect(rx + rw - 180, floorY - 55, 130, 55);
        // Flat Screen TV
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(rx + rw - 170, floorY - 130, 110, 75);
        // Screen displaying green cricket pitch
        ctx.fillStyle = '#15803d';
        ctx.fillRect(rx + rw - 164, floorY - 124, 98, 63);
        // Cricket wickets
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(rx + rw - 120, floorY - 95, 3, 22);
        ctx.fillRect(rx + rw - 114, floorY - 95, 3, 22);
        ctx.fillRect(rx + rw - 108, floorY - 95, 3, 22);
        ctx.fillRect(rx + rw - 122, floorY - 98, 18, 3);

        // Ceiling Fan
        const fanX = rx + rw / 2;
        const fanY = ry + 25;
        ctx.fillStyle = '#334155';
        ctx.fillRect(fanX - 3, ry, 6, 25);
        ctx.beginPath();
        ctx.arc(fanX, fanY, 10, 0, Math.PI * 2);
        ctx.fill();
        // Spinning fan blades
        ctx.save();
        ctx.translate(fanX, fanY);
        ctx.rotate(this.fanAngle);
        ctx.fillStyle = '#475569';
        for (let i = 0; i < 3; i++) {
          ctx.rotate((Math.PI * 2) / 3);
          ctx.fillRect(8, -5, 50, 10);
        }
        ctx.restore();

        // Framed Family Portrait on Wall
        ctx.fillStyle = '#b45309';
        ctx.fillRect(rx + 70, ry + 70, 70, 55);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(rx + 75, ry + 75, 60, 45);
        ctx.font = '24px sans-serif';
        ctx.fillText('👨‍👩‍👧', rx + 80, ry + 106);

      } else if (room.roomType === 'bedroom') {
        // Double Bed with colorful pillows
        ctx.fillStyle = '#78350f';
        ctx.fillRect(rx + 40, floorY - 45, 160, 45);
        // Mattress & Duvet
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.roundRect(rx + 36, floorY - 55, 150, 25, 6);
        ctx.fill();
        // Pillows
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(rx + 42, floorY - 65, 35, 15, 5);
        ctx.roundRect(rx + 82, floorY - 65, 35, 15, 5);
        ctx.fill();

        // Bedside Lamp
        ctx.fillStyle = '#d97706';
        ctx.fillRect(rx + 205, floorY - 60, 30, 60);
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.moveTo(rx + 205, floorY - 60);
        ctx.lineTo(rx + 235, floorY - 60);
        ctx.lineTo(rx + 245, floorY - 95);
        ctx.lineTo(rx + 195, floorY - 95);
        ctx.closePath();
        ctx.fill();

        // Wall Clock with moving pendulum
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(rx + 340, ry + 75, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(rx + 340, ry + 75, 18, 0, Math.PI * 2);
        ctx.fill();
        // Hands
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(rx + 340, ry + 75);
        const secAngle = this.clockTick * 2;
        ctx.lineTo(rx + 340 + Math.cos(secAngle) * 14, ry + 75 + Math.sin(secAngle) * 14);
        ctx.stroke();

      } else if (room.roomType === 'balcony') {
        // Balcony Railing
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(rx, floorY - 45, rw, 10);
        for (let bx = rx + 20; bx < rx + rw - 20; bx += 24) {
          ctx.fillRect(bx, floorY - 45, 6, 45);
        }

        // Potted Marigolds & Tulsi plant
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(rx + 60, floorY - 30, 28, 30);
        ctx.font = '24px sans-serif';
        ctx.fillText('🪴', rx + 62, floorY - 32);

        ctx.fillStyle = '#b45309';
        ctx.fillRect(rx + rw - 100, floorY - 30, 28, 30);
        ctx.font = '24px sans-serif';
        ctx.fillText('🌺', rx + rw - 98, floorY - 32);

        // Hanging string lights
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(rx, ry + 30);
        ctx.quadraticCurveTo(rx + rw / 2, ry + 65, rx + rw, ry + 30);
        ctx.stroke();

        const lightCount = 7;
        for (let li = 1; li <= lightCount; li++) {
          const lx = rx + (rw / (lightCount + 1)) * li;
          const ly = ry + 38 + Math.sin((li / (lightCount + 1)) * Math.PI) * 22;
          ctx.fillStyle = li % 2 === 0 ? '#facc15' : '#f43f5e';
          ctx.beginPath();
          ctx.arc(lx, ly, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (room.roomType === 'bathroom') {
        // Bathtub
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(rx + 40, floorY - 50, 140, 50, [0, 0, 16, 16]);
        ctx.fill();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Shower Head & Water stream
        ctx.fillStyle = '#64748b';
        ctx.fillRect(rx + 45, ry + 70, 8, 60);
        ctx.fillRect(rx + 45, ry + 70, 30, 8);
        ctx.beginPath();
        ctx.arc(rx + 75, ry + 74, 8, 0, Math.PI * 2);
        ctx.fill();

        // Wall Mirror
        ctx.fillStyle = '#bae6fd';
        ctx.beginPath();
        ctx.arc(rx + 240, ry + 95, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#e0f2fe';
        ctx.lineWidth = 4;
        ctx.stroke();
      }
    }
  }

  drawDoorsAndStairs(ctx, house) {
    for (const d of house.doors) {
      if (d.type === 'door') {
        // Wooden door frame
        ctx.fillStyle = '#451a03';
        ctx.fillRect(d.x - 24, d.y - 95, 48, 95);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(d.x - 20, d.y - 91, 40, 87);
        // Panels
        ctx.fillStyle = '#9a3412';
        ctx.fillRect(d.x - 16, d.y - 85, 32, 34);
        ctx.fillRect(d.x - 16, d.y - 45, 32, 36);
        // Brass knob
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(d.x + 10, d.y - 45, 4.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (d.type === 'stairs') {
        // Wooden staircase
        ctx.fillStyle = '#78350f';
        const numSteps = 6;
        const stepW = 34;
        const stepH = 14;
        for (let i = 0; i < numSteps; i++) {
          ctx.fillRect(d.x - 24 + i * 5, d.y - 80 + i * stepH, stepW, stepH);
        }
        // Handrail
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(d.x - 20, d.y - 85);
        ctx.lineTo(d.x + 25, d.y + 5);
        ctx.stroke();

        // Stairs Sign
        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.beginPath();
        ctx.roundRect(d.x - 40, d.y - 114, 80, 24, 7);
        ctx.fill();
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('STAIRS ↕', d.x, d.y - 97);
        ctx.textAlign = 'left';
      }
    }
  }

  drawHidingSpots(ctx, hidingSpots, player) {
    for (const spot of hidingSpots) {
      const isNearby = player.nearbyHidingSpot && player.nearbyHidingSpot.id === spot.id;
      const isPlayerInside = player.isHidden && player.hidingSpot && player.hidingSpot.id === spot.id;

      if (spot.type === 'cupboard') {
        // Steel / Wooden Wardrobe
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(spot.x, spot.y, spot.width, spot.height);
        ctx.fillStyle = '#334155';
        ctx.fillRect(spot.x + 4, spot.y + 4, spot.width / 2 - 6, spot.height - 8);
        ctx.fillRect(spot.x + spot.width / 2 + 2, spot.y + 4, spot.width / 2 - 6, spot.height - 8);
        // Brass handles
        ctx.fillStyle = '#facc15';
        ctx.fillRect(spot.x + spot.width / 2 - 5, spot.y + spot.height / 2 - 10, 3, 20);
        ctx.fillRect(spot.x + spot.width / 2 + 2, spot.y + spot.height / 2 - 10, 3, 20);
      } else if (spot.type === 'curtain') {
        // Rich drapery
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(spot.x, spot.y, spot.width, spot.height);
        ctx.fillStyle = '#0369a1';
        for (let fx = spot.x + 8; fx < spot.x + spot.width; fx += 14) {
          ctx.fillRect(fx, spot.y, 4, spot.height);
        }
      } else if (spot.type === 'sofa') {
        // Big cushioned sofa
        ctx.fillStyle = '#991b1b';
        ctx.beginPath();
        ctx.roundRect(spot.x, spot.y + spot.height - 50, spot.width, 50, 12);
        ctx.fill();
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(spot.x + 6, spot.y + spot.height - 40, spot.width / 2 - 8, 34);
        ctx.fillRect(spot.x + spot.width / 2 + 2, spot.y + spot.height - 40, spot.width / 2 - 8, 34);
      } else if (spot.type === 'table') {
        // Table with draping cloth
        ctx.fillStyle = '#78350f';
        ctx.fillRect(spot.x, spot.y + 24, spot.width, 16);
        ctx.fillRect(spot.x + 8, spot.y + 40, 12, spot.height - 40);
        ctx.fillRect(spot.x + spot.width - 20, spot.y + 40, 12, spot.height - 40);
        ctx.fillStyle = '#fb7185';
        ctx.fillRect(spot.x + 4, spot.y + 28, spot.width - 8, 20);
      }

      // Hiding prompt tag
      if (isNearby || isPlayerInside) {
        ctx.fillStyle = isPlayerInside ? '#16a34a' : '#9333ea';
        ctx.beginPath();
        ctx.roundRect(spot.x + spot.width / 2 - 58, spot.y - 36, 116, 30, 8);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(isPlayerInside ? 'HIDDEN 🤫' : 'HIDE [H]', spot.x + spot.width / 2, spot.y - 16);
        ctx.textAlign = 'left';
      }
    }
  }

  drawInteractiveObjects(ctx, objects, levelItems, player) {
    // 1. Level pickup items
    for (const item of levelItems) {
      if (item.pickedUp) continue;
      // Golden glow ring
      ctx.fillStyle = 'rgba(250, 204, 21, 0.45)';
      ctx.beginPath();
      ctx.arc(item.x, item.y - 16, 28, 0, Math.PI * 2);
      ctx.fill();

      // Emoji icon
      ctx.font = '32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.icon, item.x, item.y - 2);

      // Name label badge
      ctx.font = 'bold 14px sans-serif';
      const itmW = ctx.measureText(item.name).width;
      const badgeW = Math.max(96, itmW + 24);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
      ctx.beginPath();
      ctx.roundRect(item.x - badgeW / 2, item.y - 54, badgeW, 26, 7);
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#facc15';
      ctx.fillText(item.name, item.x, item.y - 36);
      ctx.textAlign = 'left';
    }

    // 2. Interactive Objects
    for (const obj of objects) {
      const isNearby = player.nearbyObject && player.nearbyObject.id === obj.id;

      // Glow halo
      ctx.fillStyle = obj.isTampered ? 'rgba(34, 197, 94, 0.45)' : (isNearby ? 'rgba(249, 115, 22, 0.5)' : 'rgba(255, 255, 255, 0.22)');
      ctx.beginPath();
      ctx.arc(obj.x, obj.y - 18, 34, 0, Math.PI * 2);
      ctx.fill();

      // Object Icon
      ctx.font = '36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(obj.icon, obj.x, obj.y + 2);

      // Status pill
      ctx.font = 'bold 15px sans-serif';
      const labelText = obj.isTampered ? 'TAMPERED! 😈' : obj.name;
      const txtW = ctx.measureText(labelText).width;
      const pillW = Math.max(106, txtW + 26);
      ctx.fillStyle = obj.isTampered ? '#15803d' : 'rgba(15, 23, 42, 0.94)';
      ctx.beginPath();
      ctx.roundRect(obj.x - pillW / 2, obj.y - 60, pillW, 28, 8);
      ctx.fill();
      ctx.strokeStyle = obj.isTampered ? '#4ade80' : (isNearby ? '#f97316' : '#64748b');
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = obj.isTampered ? '#ffffff' : (isNearby ? '#fb923c' : '#f8fafc');
      ctx.fillText(labelText, obj.x, obj.y - 41);
      ctx.textAlign = 'left';
    }
  }

  drawVisionCone(ctx, resident) {
    if (resident.state === 'PRANK_REACTION' || resident.state === 'SLEEPING') return;

    ctx.save();
    const coneDist = resident.detectionRadius;
    const eyeX = resident.x;
    const eyeY = resident.y - resident.height + 25;
    const dir = resident.facing;

    const startAngle = dir === 1 ? -0.35 : Math.PI - 0.35;
    const endAngle = dir === 1 ? 0.35 : Math.PI + 0.35;

    const grad = ctx.createRadialGradient(eyeX, eyeY, 10, eyeX, eyeY, coneDist);
    if (resident.suspicion > 70) {
      grad.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
      grad.addColorStop(1, 'rgba(239, 68, 68, 0.05)');
    } else if (resident.suspicion > 30) {
      grad.addColorStop(0, 'rgba(234, 179, 8, 0.35)');
      grad.addColorStop(1, 'rgba(234, 179, 8, 0.04)');
    } else {
      grad.addColorStop(0, 'rgba(34, 197, 94, 0.25)');
      grad.addColorStop(1, 'rgba(34, 197, 94, 0.03)');
    }

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(eyeX, eyeY);
    ctx.arc(eyeX, eyeY, coneDist, startAngle, endAngle, false);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawPlayer(ctx, player) {
    ctx.save();
    const x = player.x;
    const y = player.y;

    if (player.isHidden) {
      ctx.globalAlpha = 0.35;
    }

    const cfg = player.avatarConfig;
    const dir = player.facing;
    const walkOffset = Math.sin(player.walkCycle) * 7;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.beginPath();
    ctx.ellipse(x, y - 4, 18, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Walking Legs
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 6, y - 26);
    ctx.lineTo(x - 6 + walkOffset * 0.9, y - 6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 6, y - 26);
    ctx.lineTo(x + 6 - walkOffset * 0.9, y - 6);
    ctx.stroke();

    // Body / Torso
    ctx.fillStyle = cfg.primaryColor || '#f97316';
    ctx.beginPath();
    ctx.roundRect(x - 14, y - 56, 28, 32, 8);
    ctx.fill();

    // Head
    ctx.fillStyle = cfg.skinColor || '#fcd34d';
    ctx.beginPath();
    ctx.arc(x, y - 66, 15, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#1e293b';
    const eyeX = x + dir * 6;
    ctx.beginPath();
    ctx.arc(eyeX, y - 67, 3, 0, Math.PI * 2);
    ctx.fill();

    // Cap / Hair style
    ctx.fillStyle = cfg.hatColor || '#3b82f6';
    ctx.beginPath();
    ctx.arc(x, y - 70, 15, Math.PI, Math.PI * 2);
    ctx.lineTo(x + dir * 20, y - 70);
    ctx.closePath();
    ctx.fill();

    // Swinging Arm
    ctx.strokeStyle = cfg.skinColor || '#fcd34d';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x, y - 48);
    ctx.lineTo(x + dir * 8 - walkOffset, y - 36);
    ctx.stroke();

    ctx.restore();
  }

  drawResident(ctx, resident) {
    ctx.save();
    let rx = resident.x;
    let ry = resident.y;
    const cfg = resident.config;
    const dir = resident.facing;
    const walkOffset = Math.sin(resident.walkCycle) * 9;

    // Slapstick reaction shaking & comic FX
    if (resident.state === 'PRANK_REACTION') {
      rx += Math.sin(Date.now() * 0.06) * 8;
      // Head stars & comic shock
      ctx.font = '22px sans-serif';
      ctx.fillText('💫', rx - 18, ry - resident.height - 24);
      ctx.fillText('⭐', rx + 12, ry - resident.height - 28);
      ctx.fillText('🗯️', rx - 5, ry - resident.height - 35);
    }

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
    ctx.beginPath();
    ctx.ellipse(rx, ry - 4, 22, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.strokeStyle = cfg.trouserColor || '#475569';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(rx - 8, ry - 32);
    ctx.lineTo(rx - 8 + walkOffset, ry - 6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(rx + 8, ry - 32);
    ctx.lineTo(rx + 8 - walkOffset, ry - 6);
    ctx.stroke();

    // Body
    ctx.fillStyle = cfg.clothingColor || '#3b82f6';
    ctx.beginPath();
    ctx.roundRect(rx - 17, ry - 64, 34, 35, 10);
    ctx.fill();

    // Head
    ctx.fillStyle = (resident.state === 'PRANK_REACTION' && resident.prankType === 'green_face_shock') ? '#86efac' : (cfg.skinColor || '#fcd34d');
    ctx.beginPath();
    ctx.arc(rx, ry - 76, 17, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#0f172a';
    const eyeX = rx + dir * 6;
    ctx.beginPath();
    ctx.arc(eyeX, ry - 77, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Accessories
    if (cfg.hasMustache) {
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(rx + dir * 3 - 7, ry - 71, 15, 6, 2);
      ctx.fill();
    }
    if (cfg.hasBun) {
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(rx - dir * 16, ry - 82, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(rx - dir * 16, ry - 82, 11, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (cfg.hasSpectacles) {
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(eyeX - 4, ry - 81, 10, 9);
    }

    // Alert indicator above head (! or ?)
    if (resident.suspicion > 30) {
      ctx.fillStyle = resident.suspicion > 70 ? '#ef4444' : '#eab308';
      ctx.beginPath();
      ctx.arc(rx, ry - resident.height - 16, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(resident.suspicion > 70 ? '!' : '?', rx, ry - resident.height - 9);
      ctx.textAlign = 'left';
    }

    ctx.restore();
  }

  drawSpeechBubble(ctx, x, y, text, bgColor, textColor) {
    ctx.save();
    ctx.font = 'bold 18px sans-serif';
    const textWidth = ctx.measureText(text).width;
    const pad = 20;
    const bw = Math.min(420, textWidth + pad * 2);
    const bh = 50;

    let bx = Math.max(16, Math.min(this.width - bw - 16, x - bw / 2));
    let by = Math.max(14, y - bh);

    // Keep clear of the virtual joystick zone (bottom-left area)
    if (by > 480 && bx < 150) {
      bx = 150;
    }

    // Bubble
    ctx.fillStyle = bgColor;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, 14);
    ctx.fill();
    ctx.stroke();

    // Tail
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.moveTo(x - 10, by + bh);
    ctx.lineTo(x + 10, by + bh);
    ctx.lineTo(x, by + bh + 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Text
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, bx + bw / 2, by + bh / 2, bw - 24);
    ctx.restore();
  }

  drawParticles(ctx) {
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.font = `${p.size}px sans-serif`;
      ctx.fillText(p.char, p.x, p.y);
      ctx.restore();
    }
  }

  renderPipCamera(house, resident) {
    if (!this.pipCtx || !resident.currentRoom) return;

    const ctx = this.pipCtx;
    const w = this.pipCanvas.width;
    const h = this.pipCanvas.height;

    ctx.clearRect(0, 0, w, h);

    const room = resident.currentRoom;
    ctx.fillStyle = house.wallColor1 || '#fff7ed';
    ctx.fillRect(0, 0, w, h);

    // Mini Floor
    ctx.fillStyle = house.floorColor || '#78350f';
    ctx.fillRect(0, h - 16, w, 16);

    // Mini resident icon
    const relX = ((resident.x - room.x) / room.width) * (w - 24) + 12;
    const relY = h - 22;

    ctx.fillStyle = resident.config.clothingColor || '#3b82f6';
    ctx.beginPath();
    ctx.arc(relX, relY - 14, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(relX - 6, relY - 8, 12, 14);

    // Live Room header banner
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, w, 18);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(room.name.toUpperCase(), 6, 13);
  }
}
