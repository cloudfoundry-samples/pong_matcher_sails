module.exports = {
  create: function(req, res) {
    Participant.findOne()
      .where({  matchId: req.param('id'),
                playerId: req.param('winner') })
      .exec(function(err, winningParticipant) {
        Participant.findOne()
          .where({  matchId: req.param('id'),
                    playerId: req.param('loser') })
          .exec(function(err, losingParticipant) {
            Result.create({
              matchId: req.body.match_id,
              winner: req.body.winner,
              loser: req.body.loser,
              winningParticipant: winningParticipant,
              losingParticipant: losingParticipant
            })
            .exec(function(err, result) {
              res.status(201)
                .end();
            });
          });
      });
  }
};
