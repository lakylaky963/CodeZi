const SCORE_PREFIX = "SCORE:";
const DATE_PREFIX = "DATE:";
const SEPARATOR = "|";

/**
 * Encodes score + date into the lastName field
 * Format: "SCORE:1234|DATE:2026-06-14T10:00:00.000Z"
 */
export function encodeScoreToLastName(score) {
  return `${SCORE_PREFIX}${Math.floor(score)}${SEPARATOR}${DATE_PREFIX}${new Date().toISOString()}`;
}

/**
 * Decodes lastName back into { score, date }
 * Falls back gracefully if the field doesn't match the expected format
 * (e.g. legacy real last names already in the DB)
 */
export function decodeLastNameToScore(lastName = "") {
  const scoreMatch = lastName.match(/SCORE:(\d+)/);
  const dateMatch = lastName.match(/DATE:([^|]+)/);

  return {
    score: scoreMatch ? parseInt(scoreMatch[1], 10) : 0,
    date: dateMatch ? dateMatch[1] : null,
    isGameScore: Boolean(scoreMatch),
  };
}