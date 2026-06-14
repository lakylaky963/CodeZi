import { useState, useCallback } from "react";
import { decodeLastNameToScore } from "../utils/scoreEncoding";
import { getAllUsers, createUser } from "../api/user";

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const users = await getAllUsers();
      const list = (users?.data || users || [])
        .map((u) => {
          const { score, isGameScore } = decodeLastNameToScore(u.lastName);
          return {
            id: u._id,
            name: u.firstName,
            score,
            isGameScore,
          };
        })
        .filter((entry) => entry.isGameScore)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      setLeaderboard(list);
    } catch (err) {
      setError(err.message || "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  }, []);

  const submitScore = useCallback(
    async (name, encodedLastName) => {
      try {
        await createUser({ firstName: name, lastName: encodedLastName });
        await fetchLeaderboard();
        return true;
      } catch (err) {
        setError(err.message || "Failed to submit score");
        return false;
      }
    },
    [fetchLeaderboard]
  );

  return { leaderboard, loading, error, fetchLeaderboard, submitScore };
}