export const GAME_CONFIG = {
  width: 900,
  height: 300,
  groundY: 230,
  gravity: 1800,
  jumpVelocity: -700,
  baseSpeed: 380,
  speedIncrease: 8, // px/sec gained per second
  spawnIntervalMin: 0.8,
  spawnIntervalMax: 1.8,
};

export function createPlayer() {
  return {
    x: 60,
    y: GAME_CONFIG.groundY - 40,
    width: 36,
    height: 40,
    vy: 0,
    grounded: true,
  };
}

export function createObstacle(speed) {
  const variants = [
    { width: 20, height: 40 },
    { width: 30, height: 55 },
    { width: 18, height: 30 },
  ];
  const v = variants[Math.floor(Math.random() * variants.length)];
  return {
    x: GAME_CONFIG.width + 20,
    y: GAME_CONFIG.groundY - v.height,
    width: v.width,
    height: v.height,
    speed,
  };
}

export function checkCollision(player, obstacle) {
  const padding = 6; // forgiving hitbox
  return (
    player.x + padding < obstacle.x + obstacle.width &&
    player.x + player.width - padding > obstacle.x &&
    player.y + padding < obstacle.y + obstacle.height &&
    player.y + player.height - padding > obstacle.y
  );
}

export function updatePlayer(player, dt) {
  player.vy += GAME_CONFIG.gravity * dt;
  player.y += player.vy * dt;

  const floorY = GAME_CONFIG.groundY - player.height;
  if (player.y >= floorY) {
    player.y = floorY;
    player.vy = 0;
    player.grounded = true;
  } else {
    player.grounded = false;
  }
}

export function jump(player) {
  if (player.grounded) {
    player.vy = GAME_CONFIG.jumpVelocity;
    player.grounded = false;
  }
}