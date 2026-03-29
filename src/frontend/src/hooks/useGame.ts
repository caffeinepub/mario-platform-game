import { useCallback, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Player {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  onGround: boolean;
  facingRight: boolean;
  jumpPressed: boolean;
  dead: boolean;
}

export interface Platform {
  x: number;
  y: number;
  w: number;
  h: number;
  moving?: boolean;
  moveDir?: 1 | -1;
  moveMin?: number;
  moveMax?: number;
  moveSpeed?: number;
  color: string;
}

export interface Enemy {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  patrolMin: number;
  patrolMax: number;
  alive: boolean;
}

export interface Coin {
  x: number;
  y: number;
  r: number;
  collected: boolean;
}

export interface LevelData {
  worldWidth: number;
  worldHeight: number;
  platforms: Platform[];
  enemies: Enemy[];
  coins: Coin[];
  playerStart: { x: number; y: number };
  bgTop: string;
  bgBottom: string;
  name: string;
  hasGaps: boolean;
}

export interface GameState {
  player: Player;
  platforms: Platform[];
  enemies: Enemy[];
  coins: Coin[];
  cameraX: number;
  score: number;
  level: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GRAVITY = 1800;
const JUMP_FORCE = -900;
const MOVE_SPEED = 240;
const CANVAS_W = 800;
const CANVAS_H = 500;
const PLAYER_W = 32;
const PLAYER_H = 36;
const ENEMY_W = 32;
const ENEMY_H = 32;
const COIN_R = 9;

// ─── Level Definitions ────────────────────────────────────────────────────────

export function buildLevel(levelIndex: number): LevelData {
  if (levelIndex === 0) {
    // Level 1 - Grassland
    const worldWidth = 1400;
    const groundY = 450;
    const platforms: Platform[] = [
      // Ground (full width)
      { x: 0, y: groundY, w: worldWidth, h: 50, color: "#4a7c3f" },
      // Elevated platforms
      { x: 180, y: 350, w: 130, h: 20, color: "#5d9e4e" },
      { x: 380, y: 290, w: 110, h: 20, color: "#5d9e4e" },
      { x: 550, y: 360, w: 150, h: 20, color: "#5d9e4e" },
      { x: 720, y: 290, w: 120, h: 20, color: "#5d9e4e" },
      { x: 900, y: 350, w: 140, h: 20, color: "#5d9e4e" },
      { x: 1080, y: 280, w: 120, h: 20, color: "#5d9e4e" },
      { x: 1250, y: 360, w: 100, h: 20, color: "#5d9e4e" },
    ];

    const enemies: Enemy[] = [
      {
        x: 400,
        y: groundY - ENEMY_H,
        w: ENEMY_W,
        h: ENEMY_H,
        vx: -80,
        patrolMin: 360,
        patrolMax: 560,
        alive: true,
      },
      {
        x: 900,
        y: groundY - ENEMY_H,
        w: ENEMY_W,
        h: ENEMY_H,
        vx: 80,
        patrolMin: 800,
        patrolMax: 1060,
        alive: true,
      },
    ];

    const coins: Coin[] = [
      { x: 230, y: 315, r: COIN_R, collected: false },
      { x: 265, y: 315, r: COIN_R, collected: false },
      { x: 420, y: 255, r: COIN_R, collected: false },
      { x: 460, y: 255, r: COIN_R, collected: false },
      { x: 610, y: 325, r: COIN_R, collected: false },
      { x: 760, y: 255, r: COIN_R, collected: false },
      { x: 950, y: 315, r: COIN_R, collected: false },
      { x: 1120, y: 245, r: COIN_R, collected: false },
    ];

    return {
      worldWidth,
      worldHeight: CANVAS_H,
      platforms,
      enemies,
      coins,
      playerStart: { x: 60, y: groundY - PLAYER_H },
      bgTop: "#1a6ba0",
      bgBottom: "#87ceeb",
      name: "Grassland",
      hasGaps: false,
    };
  }

  if (levelIndex === 1) {
    // Level 2 - Sky World (gaps in ground)
    const worldWidth = 1500;
    const groundY = 450;
    const platforms: Platform[] = [
      // Ground sections with gaps
      { x: 0, y: groundY, w: 220, h: 50, color: "#6ab0d4" },
      { x: 310, y: groundY, w: 180, h: 50, color: "#6ab0d4" },
      { x: 580, y: groundY, w: 150, h: 50, color: "#6ab0d4" },
      { x: 820, y: groundY, w: 200, h: 50, color: "#6ab0d4" },
      { x: 1110, y: groundY, w: 180, h: 50, color: "#6ab0d4" },
      { x: 1380, y: groundY, w: 120, h: 50, color: "#6ab0d4" },
      // Elevated
      { x: 150, y: 360, w: 120, h: 20, color: "#82c8e8" },
      { x: 340, y: 300, w: 110, h: 20, color: "#82c8e8" },
      { x: 490, y: 380, w: 100, h: 20, color: "#82c8e8" },
      { x: 640, y: 310, w: 120, h: 20, color: "#82c8e8" },
      { x: 780, y: 250, w: 100, h: 20, color: "#82c8e8" },
      { x: 940, y: 320, w: 130, h: 20, color: "#82c8e8" },
      { x: 1060, y: 260, w: 110, h: 20, color: "#82c8e8" },
      { x: 1200, y: 320, w: 120, h: 20, color: "#82c8e8" },
      { x: 1310, y: 380, w: 100, h: 20, color: "#82c8e8" },
    ];

    const enemies: Enemy[] = [
      {
        x: 330,
        y: groundY - ENEMY_H,
        w: ENEMY_W,
        h: ENEMY_H,
        vx: -90,
        patrolMin: 310,
        patrolMax: 490,
        alive: true,
      },
      {
        x: 590,
        y: groundY - ENEMY_H,
        w: ENEMY_W,
        h: ENEMY_H,
        vx: 90,
        patrolMin: 580,
        patrolMax: 730,
        alive: true,
      },
      {
        x: 1115,
        y: groundY - ENEMY_H,
        w: ENEMY_W,
        h: ENEMY_H,
        vx: -80,
        patrolMin: 1110,
        patrolMax: 1290,
        alive: true,
      },
    ];

    const coins: Coin[] = [
      { x: 180, y: 325, r: COIN_R, collected: false },
      { x: 375, y: 265, r: COIN_R, collected: false },
      { x: 410, y: 265, r: COIN_R, collected: false },
      { x: 520, y: 345, r: COIN_R, collected: false },
      { x: 670, y: 275, r: COIN_R, collected: false },
      { x: 810, y: 215, r: COIN_R, collected: false },
      { x: 840, y: 215, r: COIN_R, collected: false },
      { x: 970, y: 285, r: COIN_R, collected: false },
      { x: 1000, y: 285, r: COIN_R, collected: false },
      { x: 1090, y: 225, r: COIN_R, collected: false },
      { x: 1230, y: 285, r: COIN_R, collected: false },
      { x: 1350, y: 345, r: COIN_R, collected: false },
    ];

    return {
      worldWidth,
      worldHeight: CANVAS_H,
      platforms,
      enemies,
      coins,
      playerStart: { x: 60, y: groundY - PLAYER_H },
      bgTop: "#1a2a5e",
      bgBottom: "#4a6fa5",
      name: "Sky World",
      hasGaps: true,
    };
  }

  // Level 3 - Castle
  const worldWidth = 1600;
  const groundY = 450;
  const platforms: Platform[] = [
    // Ground with gaps
    { x: 0, y: groundY, w: 200, h: 50, color: "#5a5a6e" },
    { x: 300, y: groundY, w: 160, h: 50, color: "#5a5a6e" },
    { x: 560, y: groundY, w: 140, h: 50, color: "#5a5a6e" },
    { x: 790, y: groundY, w: 170, h: 50, color: "#5a5a6e" },
    { x: 1060, y: groundY, w: 150, h: 50, color: "#5a5a6e" },
    { x: 1310, y: groundY, w: 180, h: 50, color: "#5a5a6e" },
    // Platforms
    { x: 120, y: 370, w: 110, h: 20, color: "#7a7a8e" },
    { x: 280, y: 300, w: 100, h: 20, color: "#7a7a8e" },
    { x: 430, y: 360, w: 110, h: 20, color: "#7a7a8e" },
    { x: 600, y: 280, w: 100, h: 20, color: "#7a7a8e" },
    { x: 720, y: 360, w: 110, h: 20, color: "#7a7a8e" },
    { x: 870, y: 300, w: 100, h: 20, color: "#7a7a8e" },
    { x: 1000, y: 380, w: 110, h: 20, color: "#7a7a8e" },
    { x: 1120, y: 300, w: 100, h: 20, color: "#7a7a8e" },
    { x: 1250, y: 360, w: 110, h: 20, color: "#7a7a8e" },
    // Moving platforms
    {
      x: 350,
      y: 380,
      w: 100,
      h: 20,
      color: "#c97a2e",
      moving: true,
      moveDir: 1,
      moveMin: 350,
      moveMax: 520,
      moveSpeed: 100,
    },
    {
      x: 780,
      y: 240,
      w: 100,
      h: 20,
      color: "#c97a2e",
      moving: true,
      moveDir: -1,
      moveMin: 700,
      moveMax: 900,
      moveSpeed: 120,
    },
    {
      x: 1150,
      y: 230,
      w: 100,
      h: 20,
      color: "#c97a2e",
      moving: true,
      moveDir: 1,
      moveMin: 1100,
      moveMax: 1300,
      moveSpeed: 110,
    },
  ];

  const enemies: Enemy[] = [
    {
      x: 310,
      y: groundY - ENEMY_H,
      w: ENEMY_W,
      h: ENEMY_H,
      vx: -90,
      patrolMin: 300,
      patrolMax: 460,
      alive: true,
    },
    {
      x: 570,
      y: groundY - ENEMY_H,
      w: ENEMY_W,
      h: ENEMY_H,
      vx: 90,
      patrolMin: 560,
      patrolMax: 700,
      alive: true,
    },
    {
      x: 800,
      y: groundY - ENEMY_H,
      w: ENEMY_W,
      h: ENEMY_H,
      vx: -80,
      patrolMin: 790,
      patrolMax: 960,
      alive: true,
    },
    {
      x: 1320,
      y: groundY - ENEMY_H,
      w: ENEMY_W,
      h: ENEMY_H,
      vx: 80,
      patrolMin: 1310,
      patrolMax: 1490,
      alive: true,
    },
  ];

  const coins: Coin[] = [
    { x: 160, y: 335, r: COIN_R, collected: false },
    { x: 310, y: 265, r: COIN_R, collected: false },
    { x: 340, y: 265, r: COIN_R, collected: false },
    { x: 465, y: 325, r: COIN_R, collected: false },
    { x: 495, y: 325, r: COIN_R, collected: false },
    { x: 630, y: 245, r: COIN_R, collected: false },
    { x: 660, y: 245, r: COIN_R, collected: false },
    { x: 750, y: 325, r: COIN_R, collected: false },
    { x: 900, y: 265, r: COIN_R, collected: false },
    { x: 930, y: 265, r: COIN_R, collected: false },
    { x: 820, y: 205, r: COIN_R, collected: false },
    { x: 1155, y: 265, r: COIN_R, collected: false },
    { x: 1185, y: 195, r: COIN_R, collected: false },
    { x: 1280, y: 325, r: COIN_R, collected: false },
    { x: 1400, y: 315, r: COIN_R, collected: false },
  ];

  return {
    worldWidth,
    worldHeight: CANVAS_H,
    platforms,
    enemies,
    coins,
    playerStart: { x: 60, y: groundY - PLAYER_H },
    bgTop: "#1a0a0a",
    bgBottom: "#4a2020",
    name: "Castle",
    hasGaps: true,
  };
}

// ─── AABB Collision ────────────────────────────────────────────────────────────

function overlaps(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number,
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

// ─── Rendering ────────────────────────────────────────────────────────────────

function drawPlayer(
  ctx: CanvasRenderingContext2D,
  p: Player,
  camX: number,
): void {
  const sx = p.x - camX;
  const sy = p.y;

  ctx.save();
  if (!p.facingRight) {
    ctx.scale(-1, 1);
    ctx.translate(-sx * 2 - p.w, 0);
  }

  // Body (blue overalls)
  ctx.fillStyle = "#2255cc";
  ctx.fillRect(sx, sy + 14, p.w, p.h - 14);

  // Shirt (red)
  ctx.fillStyle = "#cc2222";
  ctx.fillRect(sx + 2, sy + 10, p.w - 4, 14);

  // Arms
  ctx.fillStyle = "#cc2222";
  ctx.fillRect(sx - 4, sy + 12, 6, 10);
  ctx.fillRect(sx + p.w - 2, sy + 12, 6, 10);

  // Hands (skin)
  ctx.fillStyle = "#f5c89a";
  ctx.fillRect(sx - 4, sy + 20, 6, 6);
  ctx.fillRect(sx + p.w - 2, sy + 20, 6, 6);

  // Head (skin)
  ctx.fillStyle = "#f5c89a";
  ctx.beginPath();
  ctx.arc(sx + p.w / 2, sy + 7, 10, 0, Math.PI * 2);
  ctx.fill();

  // Hat
  ctx.fillStyle = "#cc2222";
  ctx.fillRect(sx + 2, sy, p.w - 4, 8);
  ctx.fillRect(sx - 2, sy + 6, p.w + 4, 4);

  // Eyes
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(sx + 18, sy + 5, 4, 4);

  // Mustache
  ctx.fillStyle = "#4a2200";
  ctx.fillRect(sx + 14, sy + 11, 14, 3);

  ctx.restore();
}

function drawEnemy(
  ctx: CanvasRenderingContext2D,
  e: Enemy,
  camX: number,
): void {
  const sx = e.x - camX;
  const sy = e.y;

  // Body
  ctx.fillStyle = "#cc1111";
  ctx.fillRect(sx, sy + 6, e.w, e.h - 6);

  // Head (rounder, darker)
  ctx.fillStyle = "#dd2222";
  ctx.beginPath();
  ctx.arc(sx + e.w / 2, sy + 8, 13, 0, Math.PI * 2);
  ctx.fill();

  // Eyes (angry)
  ctx.fillStyle = "#fff";
  ctx.fillRect(sx + 6, sy + 3, 7, 7);
  ctx.fillRect(sx + 19, sy + 3, 7, 7);

  ctx.fillStyle = "#111";
  ctx.fillRect(sx + 8, sy + 5, 4, 4);
  ctx.fillRect(sx + 21, sy + 5, 4, 4);

  // Angry brows
  ctx.strokeStyle = "#111";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(sx + 6, sy + 3);
  ctx.lineTo(sx + 13, sy + 5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(sx + 26, sy + 3);
  ctx.lineTo(sx + 19, sy + 5);
  ctx.stroke();

  // Feet
  ctx.fillStyle = "#882200";
  ctx.fillRect(sx + 2, sy + e.h - 8, 10, 8);
  ctx.fillRect(sx + e.w - 12, sy + e.h - 8, 10, 8);
}

function drawCoin(
  ctx: CanvasRenderingContext2D,
  c: Coin,
  camX: number,
  time: number,
): void {
  const sx = c.x - camX;
  const sy = c.y;
  const scale = Math.abs(Math.sin(time * 3 + c.x * 0.01));
  const displayW = Math.max(3, c.r * 2 * scale);

  ctx.save();
  ctx.translate(sx, sy);

  // Outer coin
  ctx.fillStyle = "#ffd700";
  ctx.beginPath();
  ctx.ellipse(0, 0, displayW / 2, c.r, 0, 0, Math.PI * 2);
  ctx.fill();

  // Shine
  ctx.fillStyle = "#ffe44d";
  ctx.beginPath();
  ctx.ellipse(
    -displayW * 0.15,
    -c.r * 0.25,
    displayW * 0.2,
    c.r * 0.35,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  ctx.restore();
}

function drawPlatform(
  ctx: CanvasRenderingContext2D,
  plat: Platform,
  camX: number,
): void {
  const sx = plat.x - camX;

  if (plat.moving) {
    // Moving platform - orange with gear-like top
    ctx.fillStyle = plat.color;
    ctx.fillRect(sx, plat.y, plat.w, plat.h);
    // Top highlight
    ctx.fillStyle = "#e8943a";
    ctx.fillRect(sx, plat.y, plat.w, 4);
    // Bottom shadow
    ctx.fillStyle = "#a85e1e";
    ctx.fillRect(sx, plat.y + plat.h - 4, plat.w, 4);

    // Arrow indicators
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("◄►", sx + plat.w / 2, plat.y + 13);
  } else {
    ctx.fillStyle = plat.color;
    ctx.fillRect(sx, plat.y, plat.w, plat.h);

    // Top edge highlight
    const lighter =
      plat.color === "#4a7c3f"
        ? "#72b058"
        : plat.color === "#5d9e4e"
          ? "#72b058"
          : plat.color === "#6ab0d4"
            ? "#94cce8"
            : plat.color === "#82c8e8"
              ? "#a8daf0"
              : plat.color === "#5a5a6e"
                ? "#7a7a8e"
                : "#9a9aae";
    ctx.fillStyle = lighter;
    ctx.fillRect(sx, plat.y, plat.w, 4);

    // Bottom shadow
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(sx, plat.y + plat.h - 6, plat.w, 6);

    // Texture stripes for ground
    if (plat.h > 25) {
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      for (let tx = sx; tx < sx + plat.w; tx += 32) {
        ctx.fillRect(tx, plat.y + 4, 16, plat.h - 4);
      }
    }
  }
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  bgTop: string,
  bgBottom: string,
  camX: number,
  worldWidth: number,
): void {
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  grad.addColorStop(0, bgTop);
  grad.addColorStop(1, bgBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Parallax clouds / stars
  if (bgTop === "#1a6ba0") {
    // Day clouds
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    const cloudPositions = [100, 300, 520, 740, 960, 1180, 1380];
    for (const cx of cloudPositions) {
      const px =
        ((((cx - camX * 0.3) % (worldWidth + 200)) + CANVAS_W + 200) %
          (CANVAS_W + 200)) -
        100;
      ctx.beginPath();
      ctx.arc(px, 80, 28, 0, Math.PI * 2);
      ctx.arc(px + 30, 70, 35, 0, Math.PI * 2);
      ctx.arc(px + 65, 80, 25, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (bgTop === "#1a2a5e") {
    // Stars
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    const stars = [
      { x: 50, y: 30 },
      { x: 150, y: 60 },
      { x: 280, y: 20 },
      { x: 400, y: 50 },
      { x: 530, y: 35 },
      { x: 650, y: 15 },
      { x: 720, y: 55 },
      { x: 200, y: 100 },
      { x: 470, y: 90 },
      { x: 600, y: 75 },
    ];
    for (const s of stars) {
      const px =
        (((s.x - camX * 0.1) % (CANVAS_W + 60)) + CANVAS_W + 60) %
        (CANVAS_W + 60);
      ctx.fillRect(px, s.y, 2, 2);
    }
  } else if (bgTop === "#1a0a0a") {
    // Castle torches / fire
    ctx.fillStyle = "rgba(255, 120, 20, 0.15)";
    for (let tx = 0; tx < CANVAS_W; tx += 180) {
      ctx.beginPath();
      ctx.arc(tx, 250, 60, 0, Math.PI * 2);
      ctx.fill();
    }
    // Brick pattern
    ctx.fillStyle = "rgba(80,30,30,0.2)";
    for (let by = 0; by < CANVAS_H; by += 24) {
      const offset = (Math.floor(by / 24) % 2) * 40;
      for (let bx = -offset; bx < CANVAS_W + 80; bx += 80) {
        ctx.fillRect(bx, by, 76, 20);
      }
    }
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseGameReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  startGame: (level: number, score: number) => void;
  stopGame: () => void;
  onLevelComplete: (handler: (level: number, score: number) => void) => void;
  onGameOver: (handler: (score: number) => void) => void;
}

export function useGame(): UseGameReturn {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const keysRef = useRef<Set<string>>(new Set());

  const gameStateRef = useRef<GameState | null>(null);
  const levelDataRef = useRef<LevelData | null>(null);
  const onLevelCompleteRef = useRef<
    ((level: number, score: number) => void) | null
  >(null);
  const onGameOverRef = useRef<((score: number) => void) | null>(null);

  const stopGame = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    keysRef.current.clear();
  }, []);

  const onLevelComplete = useCallback(
    (handler: (level: number, score: number) => void) => {
      onLevelCompleteRef.current = handler;
    },
    [],
  );

  const onGameOver = useCallback((handler: (score: number) => void) => {
    onGameOverRef.current = handler;
  }, []);

  const startGame = useCallback(
    (levelIndex: number, startScore: number) => {
      stopGame();

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      if (!ctx) return;

      const levelData = buildLevel(levelIndex);
      levelDataRef.current = levelData;

      const player: Player = {
        x: levelData.playerStart.x,
        y: levelData.playerStart.y,
        w: PLAYER_W,
        h: PLAYER_H,
        vx: 0,
        vy: 0,
        onGround: false,
        facingRight: true,
        jumpPressed: false,
        dead: false,
      };

      gameStateRef.current = {
        player,
        platforms: levelData.platforms.map((p) => ({ ...p })),
        enemies: levelData.enemies.map((e) => ({ ...e })),
        coins: levelData.coins.map((c) => ({ ...c })),
        cameraX: 0,
        score: startScore,
        level: levelIndex,
      };

      lastTimeRef.current = 0;
      timeRef.current = 0;

      const handleKeyDown = (e: KeyboardEvent) => {
        keysRef.current.add(e.code);
        if (
          [
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "ArrowDown",
            "Space",
            "KeyA",
            "KeyD",
            "KeyW",
            "KeyS",
          ].includes(e.code)
        ) {
          e.preventDefault();
        }
      };
      const handleKeyUp = (e: KeyboardEvent) => {
        keysRef.current.delete(e.code);
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      function gameLoop(timestamp: number) {
        if (!gameStateRef.current || !levelDataRef.current) return;

        if (lastTimeRef.current === 0) lastTimeRef.current = timestamp;
        const rawDt = (timestamp - lastTimeRef.current) / 1000;
        const dt = Math.min(rawDt, 0.05); // cap delta time
        lastTimeRef.current = timestamp;
        timeRef.current += dt;

        const gs = gameStateRef.current;
        const ld = levelDataRef.current;
        const p = gs.player;
        const keys = keysRef.current;

        if (p.dead) {
          rafRef.current = requestAnimationFrame(gameLoop);
          return;
        }

        // ── Input ──
        const movingLeft = keys.has("ArrowLeft") || keys.has("KeyA");
        const movingRight = keys.has("ArrowRight") || keys.has("KeyD");
        const jumpKey =
          keys.has("ArrowUp") || keys.has("KeyW") || keys.has("Space");

        if (movingLeft) {
          p.vx = -MOVE_SPEED;
          p.facingRight = false;
        } else if (movingRight) {
          p.vx = MOVE_SPEED;
          p.facingRight = true;
        } else p.vx = 0;

        if (jumpKey && p.onGround && !p.jumpPressed) {
          p.vy = JUMP_FORCE;
          p.onGround = false;
          p.jumpPressed = true;
        }
        if (!jumpKey) p.jumpPressed = false;

        // ── Physics ──
        p.vy += GRAVITY * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Clamp horizontal
        p.x = Math.max(0, Math.min(ld.worldWidth - p.w, p.x));

        // ── Platform collision ──
        p.onGround = false;

        // Update moving platforms
        for (const plat of gs.platforms) {
          if (
            plat.moving &&
            plat.moveMin !== undefined &&
            plat.moveMax !== undefined &&
            plat.moveSpeed !== undefined
          ) {
            plat.x += (plat.moveDir ?? 1) * plat.moveSpeed * dt;
            if (plat.x >= plat.moveMax) {
              plat.x = plat.moveMax;
              plat.moveDir = -1;
            }
            if (plat.x <= plat.moveMin) {
              plat.x = plat.moveMin;
              plat.moveDir = 1;
            }
          }
        }

        for (const plat of gs.platforms) {
          if (!overlaps(p.x, p.y, p.w, p.h, plat.x, plat.y, plat.w, plat.h))
            continue;

          const overlapLeft = plat.x + plat.w - p.x;
          const overlapRight = p.x + p.w - plat.x;
          const overlapTop = plat.y + plat.h - p.y;
          const overlapBottom = p.y + p.h - plat.y;

          const minOverlap = Math.min(
            overlapLeft,
            overlapRight,
            overlapTop,
            overlapBottom,
          );

          if (minOverlap === overlapBottom && p.vy >= 0) {
            p.y = plat.y - p.h;
            p.vy = 0;
            p.onGround = true;
          } else if (minOverlap === overlapTop && p.vy < 0) {
            p.y = plat.y + plat.h;
            p.vy = 0;
          } else if (minOverlap === overlapLeft) {
            p.x = plat.x + plat.w;
            p.vx = 0;
          } else if (minOverlap === overlapRight) {
            p.x = plat.x - p.w;
            p.vx = 0;
          }
        }

        // ── Fall detection ──
        if (p.y > ld.worldHeight + 100) {
          p.dead = true;
          window.removeEventListener("keydown", handleKeyDown);
          window.removeEventListener("keyup", handleKeyUp);
          setTimeout(() => {
            onGameOverRef.current?.(gs.score);
          }, 400);
          rafRef.current = requestAnimationFrame(gameLoop);
          return;
        }

        // ── Enemy collisions ──
        for (const enemy of gs.enemies) {
          if (!enemy.alive) continue;

          // Enemy patrol movement
          enemy.x += enemy.vx * dt;
          if (enemy.x <= enemy.patrolMin) {
            enemy.x = enemy.patrolMin;
            enemy.vx = Math.abs(enemy.vx);
          }
          if (enemy.x >= enemy.patrolMax - enemy.w) {
            enemy.x = enemy.patrolMax - enemy.w;
            enemy.vx = -Math.abs(enemy.vx);
          }

          if (!overlaps(p.x, p.y, p.w, p.h, enemy.x, enemy.y, enemy.w, enemy.h))
            continue;

          // Stomp: player falls onto enemy head
          const playerBottom = p.y + p.h;
          const enemyTop = enemy.y;
          const stomping =
            p.vy > 0 && playerBottom - enemyTop < 16 && playerBottom > enemyTop;

          if (stomping) {
            enemy.alive = false;
            p.vy = JUMP_FORCE * 0.6; // bounce up
            gs.score += 50;
          } else {
            // Touch = game over
            p.dead = true;
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            setTimeout(() => {
              onGameOverRef.current?.(gs.score);
            }, 400);
          }
        }

        // ── Coin collection ──
        for (const coin of gs.coins) {
          if (coin.collected) continue;
          if (
            overlaps(
              p.x,
              p.y,
              p.w,
              p.h,
              coin.x - coin.r,
              coin.y - coin.r,
              coin.r * 2,
              coin.r * 2,
            )
          ) {
            coin.collected = true;
            gs.score += 10;
          }
        }

        // ── Level complete: reach world right edge ──
        if (p.x + p.w >= ld.worldWidth - 10) {
          window.removeEventListener("keydown", handleKeyDown);
          window.removeEventListener("keyup", handleKeyUp);
          onLevelCompleteRef.current?.(gs.level, gs.score);
          rafRef.current = requestAnimationFrame(gameLoop);
          return;
        }

        // ── Camera ──
        const targetCamX = p.x - CANVAS_W / 3;
        gs.cameraX = Math.max(
          0,
          Math.min(ld.worldWidth - CANVAS_W, targetCamX),
        );

        // ── Render ──
        drawBackground(ctx, ld.bgTop, ld.bgBottom, gs.cameraX, ld.worldWidth);

        for (const plat of gs.platforms) drawPlatform(ctx, plat, gs.cameraX);
        for (const coin of gs.coins) {
          if (!coin.collected) drawCoin(ctx, coin, gs.cameraX, timeRef.current);
        }
        for (const enemy of gs.enemies) {
          if (enemy.alive) drawEnemy(ctx, enemy, gs.cameraX);
        }

        // Goal marker at world end
        const goalX = ld.worldWidth - 60 - gs.cameraX;
        if (goalX < CANVAS_W + 50) {
          ctx.fillStyle = "#22dd55";
          ctx.fillRect(goalX, 0, 10, CANVAS_H);
          ctx.fillStyle = "rgba(34,221,85,0.15)";
          ctx.fillRect(goalX - 20, 0, 50, CANVAS_H);
          ctx.fillStyle = "#22dd55";
          ctx.font = "bold 14px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("GOAL", goalX + 5, 40);
        }

        // Death flash
        if (p.dead) {
          ctx.fillStyle = "rgba(255,0,0,0.4)";
          ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        } else {
          drawPlayer(ctx, p, gs.cameraX);
        }

        // ── HUD ──
        // Score
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(8, 8, 180, 38);
        ctx.fillStyle = "#ffd700";
        ctx.font = "bold 18px 'Mona Sans', monospace";
        ctx.textAlign = "left";
        ctx.fillText(`🪙 ${gs.score}`, 18, 32);

        // Level
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(CANVAS_W - 148, 8, 140, 38);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 16px 'Mona Sans', monospace";
        ctx.textAlign = "right";
        ctx.fillText(`Level ${gs.level + 1}: ${ld.name}`, CANVAS_W - 18, 32);

        // Coin count
        const collectedCoins = gs.coins.filter((c) => c.collected).length;
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(8, 52, 130, 28);
        ctx.fillStyle = "#ffd700";
        ctx.font = "13px 'Mona Sans', monospace";
        ctx.textAlign = "left";
        ctx.fillText(`Coins: ${collectedCoins}/${gs.coins.length}`, 18, 70);

        rafRef.current = requestAnimationFrame(gameLoop);
      }

      rafRef.current = requestAnimationFrame(gameLoop);

      // Return cleanup
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      };
    },
    [stopGame],
  );

  return { canvasRef, startGame, stopGame, onLevelComplete, onGameOver };
}
