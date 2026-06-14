import { useEffect, useRef } from "react";
import {
  GAME_CONFIG,
  createPlayer,
  createObstacle,
  checkCollision,
  updatePlayer,
  jump,
} from "./RunnerEngine";

export default function RunnerCanvas({ isDark, onGameOver, running, resetKey }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    stateRef.current = {
      player: createPlayer(),
      obstacles: [],
      speed: GAME_CONFIG.baseSpeed,
      distance: 0,
      spawnTimer: 1.2,
      lastTime: performance.now(),
      gameOver: false,
    };
  }, [resetKey]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const colors = isDark
      ? {
          bg: "#0f172a",
          grid: "rgba(99, 102, 241, 0.08)", // Indigo 500 with alpha
          ground: "#6366f1", // Indigo 500
          player: "#818cf8", // Indigo 400
          playerGlow: "rgba(99, 102, 241, 0.4)", // Indigo 500 with alpha
          obstacle: "#f43f5e", // Rose 500
          obstacleGlow: "rgba(244, 63, 94, 0.3)", // Rose 500 with alpha
          text: "#f8fafc", // Slate 50
        }
      : {
          bg: "#f8fafc",
          grid: "rgba(99,102,241,0.06)",
          ground: "#334155",
          player: "#1e293b",
          playerGlow: "rgba(30,41,59,0.15)",
          obstacle: "#dc2626",
          obstacleGlow: "rgba(220,38,38,0.15)",
          text: "#1e293b",
        };

    function draw() {
      const s = stateRef.current;
      const now = performance.now();
      let dt = (now - s.lastTime) / 1000;
      dt = Math.min(dt, 0.033);
      s.lastTime = now;

      if (running && !s.gameOver) {
        s.speed += GAME_CONFIG.speedIncrease * dt;
        s.distance += s.speed * dt;

        updatePlayer(s.player, dt);

        s.spawnTimer -= dt;
        if (s.spawnTimer <= 0) {
          s.obstacles.push(createObstacle(s.speed));
          s.spawnTimer =
            GAME_CONFIG.spawnIntervalMin +
            Math.random() *
              (GAME_CONFIG.spawnIntervalMax - GAME_CONFIG.spawnIntervalMin) *
              (GAME_CONFIG.baseSpeed / s.speed);
        }

        s.obstacles.forEach((o) => (o.x -= s.speed * dt));
        s.obstacles = s.obstacles.filter((o) => o.x + o.width > -10);

        for (const o of s.obstacles) {
          if (checkCollision(s.player, o)) {
            s.gameOver = true;
            onGameOver(Math.floor(s.distance / 10));
            break;
          }
        }
      }

      // --- DRAW ---
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);

      // grid (cyberpunk/clean vibe)
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1;
      const gridOffset = (s.distance * 0.5) % 40;
      for (let x = -gridOffset; x < GAME_CONFIG.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, GAME_CONFIG.height);
        ctx.stroke();
      }

      // ground line
      ctx.strokeStyle = colors.ground;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, GAME_CONFIG.groundY);
      ctx.lineTo(GAME_CONFIG.width, GAME_CONFIG.groundY);
      ctx.stroke();
      if (isDark) {
        ctx.shadowColor = colors.ground;
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // player
      const p = s.player;
      ctx.fillStyle = colors.player;
      if (isDark) {
        ctx.shadowColor = colors.playerGlow;
        ctx.shadowBlur = 18;
      }
      roundRect(ctx, p.x, p.y, p.width, p.height, 6);
      ctx.fill();
      ctx.shadowBlur = 0;

      // obstacles
      ctx.fillStyle = colors.obstacle;
      for (const o of s.obstacles) {
        if (isDark) {
          ctx.shadowColor = colors.obstacleGlow;
          ctx.shadowBlur = 16;
        }
        roundRect(ctx, o.x, o.y, o.width, o.height, 4);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // score
      ctx.fillStyle = colors.text;
      ctx.font = "bold 20px 'JetBrains Mono', monospace";
      ctx.textAlign = "right";
      ctx.fillText(
        `${String(Math.floor(s.distance / 10)).padStart(5, "0")} m`,
        GAME_CONFIG.width - 16,
        32
      );

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isDark, running, onGameOver]);

  const handleJump = () => {
    if (stateRef.current && !stateRef.current.gameOver) {
      jump(stateRef.current.player);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        handleJump();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={GAME_CONFIG.width}
      height={GAME_CONFIG.height}
      onClick={handleJump}
      onTouchStart={(e) => {
        e.preventDefault();
        handleJump();
      }}
      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer shadow-lg"
      style={{ touchAction: "none", aspectRatio: "3/1" }}
    />
  );
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}