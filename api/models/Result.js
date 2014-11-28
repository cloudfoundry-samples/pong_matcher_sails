module.exports = {
  attributes: {
    matchId: 'string',
    winner: 'string',
    loser: 'string',
    winningParticipant: {
      model: 'participant'
    },
    losingParticipant: {
      model: 'participant'
    }
  }
};

