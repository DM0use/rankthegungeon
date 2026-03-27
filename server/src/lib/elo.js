/**
 * Variable K-factor: new items move fast, settled items move slowly.
 */
function kFactor(voteCount) {
  if (voteCount < 10) return 64
  if (voteCount < 30) return 32
  return 16
}

/**
 * Compute new ELO ratings after a matchup.
 * @returns {{ newWinnerElo: number, newLoserElo: number }}
 */
function computeElo(winnerElo, loserElo, winnerVotes, loserVotes) {
  const expectedWinner = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400))
  const expectedLoser  = 1 - expectedWinner

  const kW = kFactor(winnerVotes)
  const kL = kFactor(loserVotes)

  return {
    newWinnerElo: winnerElo + kW * (1 - expectedWinner),
    newLoserElo:  loserElo  + kL * (0 - expectedLoser),
  }
}

module.exports = { computeElo }
