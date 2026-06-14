const SCORE_PREFIX = 'Score'

export function formatScoreProfile(score) {
  return `${SCORE_PREFIX} ${score} | Memory Match | ${new Date().toISOString()}`
}

export function parseScoreProfile(user) {
  const match = user?.lastName?.match(/Score\s+(\d+)/i)
  const dateMatch = user?.lastName?.match(/\|\s*([^|]+)$/)

  return {
    id: user?._id,
    name: user?.firstName || 'Player',
    score: match ? Number(match[1]) : 0,
    playedAt: dateMatch ? dateMatch[1] : '',
  }
}

export function getScoreUsers(users) {
  return users
    .map(parseScoreProfile)
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
}
