import { useCallback, useEffect, useRef, useState } from 'react'
import { createUser, getUser, getUsers, updateUser } from '../api/user'
import Icon from '../components/Icon.jsx'
import Toast from '../components/Toast.jsx'
import { useTheme } from '../context/ThemeContext'
import { formatScoreProfile, getScoreUsers } from '../utils/scoreboard.js'

const GAME = {
  width: 900,
  height: 280,
  groundY: 220,
  gravity: 2000,
  jumpVelocity: -760,
  baseSpeed: 380,
  speedRamp: 10,
  spawnMin: 0.75,
  spawnMax: 1.7,
}

function createPlayer() {
  return { x: 50, y: GAME.groundY - 38, width: 34, height: 38, vy: 0, grounded: true }
}

function createObstacle(speed) {
  const variants = [
    { width: 18, height: 36 },
    { width: 26, height: 50 },
    { width: 16, height: 28 },
  ]
  const v = variants[Math.floor(Math.random() * variants.length)]
  return { x: GAME.width + 20, y: GAME.groundY - v.height, width: v.width, height: v.height, speed }
}

function collides(player, obstacle) {
  const pad = 5
  return (
    player.x + pad < obstacle.x + obstacle.width &&
    player.x + player.width - pad > obstacle.x &&
    player.y + pad < obstacle.y + obstacle.height &&
    player.y + player.height - pad > obstacle.y
  )
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export default function Game() {
  const { theme } = useTheme()
  const canvasRef = useRef(null)
  const stateRef = useRef(null)
  const rafRef = useRef(null)
  const runningRef = useRef(false)

  const [isPlaying, setIsPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [resetKey, setResetKey] = useState(0)
  const [playerName, setPlayerName] = useState('StudioPlayer')
  const [scoreboard, setScoreboard] = useState([])
  const [toast, setToast] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const refreshScoreboard = useCallback(async () => {
    try {
      const { data } = await getUsers()
      setScoreboard(getScoreUsers(data.users || []).slice(0, 10))
    } catch {
      setToast({ type: 'error', message: 'Could not load live scoreboard.' })
    }
  }, [])

  useEffect(() => {
    refreshScoreboard()
  }, [refreshScoreboard])

  // Derived theme state for canvas colors
  const isDark = theme === 'dark'

  // Init / reset game state
  useEffect(() => {
    stateRef.current = {
      player: createPlayer(),
      obstacles: [],
      speed: GAME.baseSpeed,
      distance: 0,
      spawnTimer: 1.2,
      lastTime: performance.now(),
    }
    setGameOver(false)
    setScore(0)
  }, [resetKey])

  // Main loop
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    function colors() {
      return {
        bg: '#020617', // Slate 950
        grid: 'rgba(99, 102, 241, 0.08)',
        ground: '#6366f1', // Indigo 500
        player: '#818cf8',
        playerGlow: 'rgba(99, 102, 241, 0.4)',
        obstacle: '#f43f5e', // Rose 500
        obstacleGlow: 'rgba(244, 63, 94, 0.3)',
        text: '#f8fafc',
      }
    }

    function tick() {
      const s = stateRef.current
      const c = colors()
      const now = performance.now()
      let dt = (now - s.lastTime) / 1000
      dt = Math.min(dt, 0.033)
      s.lastTime = now

      if (runningRef.current && !s.gameOver) {
        s.speed += GAME.speedRamp * dt
        s.distance += s.speed * dt

        // physics
        s.player.vy += GAME.gravity * dt
        s.player.y += s.player.vy * dt
        const floorY = GAME.groundY - s.player.height
        if (s.player.y >= floorY) {
          s.player.y = floorY
          s.player.vy = 0
          s.player.grounded = true
        } else {
          s.player.grounded = false
        }

        // spawn obstacles
        s.spawnTimer -= dt
        if (s.spawnTimer <= 0) {
          s.obstacles.push(createObstacle(s.speed))
          s.spawnTimer =
            GAME.spawnMin + Math.random() * (GAME.spawnMax - GAME.spawnMin) * (GAME.baseSpeed / s.speed)
        }

        s.obstacles.forEach((o) => (o.x -= s.speed * dt))
        s.obstacles = s.obstacles.filter((o) => o.x + o.width > -10)

        for (const o of s.obstacles) {
          if (collides(s.player, o)) {
            s.gameOver = true
            const finalScore = Math.floor(s.distance / 10)
            setScore(finalScore)
            setGameOver(true)
            setIsPlaying(false)
            runningRef.current = false
            break
          }
        }

        setScore(Math.floor(s.distance / 10))
      }

      // --- draw ---
      ctx.fillStyle = c.bg
      ctx.fillRect(0, 0, GAME.width, GAME.height)

      ctx.strokeStyle = c.grid
      ctx.lineWidth = 1
      const gridOffset = (s.distance * 0.5) % 40
      for (let x = -gridOffset; x < GAME.width; x += 40) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, GAME.height)
        ctx.stroke()
      }

      ctx.strokeStyle = c.ground
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(0, GAME.groundY)
      ctx.lineTo(GAME.width, GAME.groundY)
      ctx.stroke()
      if (isDark) {
        ctx.shadowColor = c.ground
        ctx.shadowBlur = 12
        ctx.stroke()
        ctx.shadowBlur = 0
      }

      const p = s.player
      ctx.fillStyle = c.player
      if (isDark) {
        ctx.shadowColor = c.playerGlow
        ctx.shadowBlur = 18
      }
      roundRect(ctx, p.x, p.y, p.width, p.height, 6)
      ctx.fill()
      ctx.shadowBlur = 0

      ctx.fillStyle = c.obstacle
      for (const o of s.obstacles) {
        if (isDark) {
          ctx.shadowColor = c.obstacleGlow
          ctx.shadowBlur = 16
        }
        roundRect(ctx, o.x, o.y, o.width, o.height, 4)
        ctx.fill()
        ctx.shadowBlur = 0
      }

      ctx.fillStyle = c.text
      ctx.font = "bold 20px 'JetBrains Mono', monospace"
      ctx.textAlign = 'right'
      ctx.fillText(`${String(Math.floor(s.distance / 10)).padStart(5, '0')} m`, GAME.width - 16, 32)

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isDark]) // Re-run effect only when theme changes

  // Save score whenever the run ends
  useEffect(() => {
    if (!gameOver || isSaving) return
    saveScore()
    // saveScore intentionally reads latest score/playerName once at end of round
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver])

  const jump = useCallback(() => {
    const s = stateRef.current
    if (!s || s.gameOver) return
    if (s.player.grounded) {
      s.player.vy = GAME.jumpVelocity
      s.player.grounded = false
    }
  }, [])

  useEffect(() => {
    const handler = (event) => {
      if (event.code === 'Space' || event.code === 'ArrowUp') {
        event.preventDefault()
        if (!runningRef.current && !gameOver) startGame()
        jump()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jump, gameOver])

  const startGame = () => {
    setResetKey((value) => value + 1)
    runningRef.current = true
    setIsPlaying(true)
    setGameOver(false)
    setToast(null)
  }

  const handleCanvasInteract = () => {
    if (!isPlaying && !gameOver) {
      startGame()
      return
    }
    jump()
  }

  const saveScore = async () => {
    const name = playerName.trim() || 'StudioPlayer'
    setIsSaving(true)

    try {
      const payload = { firstName: name, lastName: formatScoreProfile(score) }
      const existing = await getUser({ id: name }).catch(() => null)

      if (existing?.data?.user?._id) {
        const current = getScoreUsers([existing.data.user])[0]
        if (!current || score >= current.score) {
          await updateUser({ id: existing.data.user._id, ...payload })
        }
      } else {
        await createUser(payload)
      }

      await refreshScoreboard()
      setToast({ type: 'success', message: `Score saved for ${name}.` })
    } catch {
      setToast({ type: 'error', message: 'Score could not be saved. Check the backend connection.' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="page game-page">
      <Toast toast={toast} />

      <div className="page-title">
        <span className="section-icon"><Icon name="game" /></span>
        <div>
          <h1>Runner</h1>
          <p>Jump the incoming obstacles and rack up distance. Finished runs save through the existing user API.</p>
        </div>
      </div>

      <div className="game-layout">
        <div className="game-board-panel">
          <div className="game-toolbar">
            <label>
              Player
              <input
                value={playerName}
                onChange={(event) => setPlayerName(event.target.value)}
                placeholder="Player name"
              />
            </label>
            <div className="game-stats">
              <span><strong>{score}</strong> Distance</span>
              <span><strong>{isPlaying ? 'Running' : gameOver ? 'Crashed' : 'Ready'}</strong> Status</span>
            </div>
            <button className="btn btn-primary" type="button" onClick={startGame}>
              {isPlaying ? 'Restart' : 'Start game'}
            </button>
          </div>

          <div className="runner-canvas-wrap">
            <canvas
              ref={canvasRef}
              width={GAME.width}
              height={GAME.height}
              onClick={handleCanvasInteract}
              onTouchStart={(event) => {
                event.preventDefault()
                handleCanvasInteract()
              }}
              className="runner-canvas"
              aria-label="T-Rex style runner game canvas"
            />
            {!isPlaying && !gameOver && (
              <div className="runner-overlay">
                <button className="btn btn-primary" type="button" onClick={startGame}>
                  Start game
                </button>
                <p>or press Space / tap the canvas</p>
              </div>
            )}
          </div>

          {gameEnded(gameOver) && (
            <div className="round-summary">
              <strong>You crashed.</strong>
              <span>{isSaving ? 'Saving score...' : `Final distance: ${score} m`}</span>
            </div>
          )}
        </div>

        <aside className="scoreboard-panel">
          <div className="panel-heading">
            <div>
              <h2>Live Scoreboard</h2>
              <p>Loaded from MongoDB user records.</p>
            </div>
            <button className="icon-button" type="button" onClick={refreshScoreboard} aria-label="Refresh scoreboard">
              <Icon name="refresh" />
            </button>
          </div>

          <div className="score-list">
            {scoreboard.length ? (
              scoreboard.map((entry, index) => (
                <div className="score-row" key={entry.id}>
                  <span className="rank">{index + 1}</span>
                  <span>
                    <strong>{entry.name}</strong>
                    <small>{entry.playedAt ? new Date(entry.playedAt).toLocaleDateString() : 'Recent run'}</small>
                  </span>
                  <b>{entry.score}</b>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <Icon name="database" />
                <p>No saved scores yet. Play a round to seed the board.</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  )
}

function gameEnded(gameOver) {
  return gameOver
}