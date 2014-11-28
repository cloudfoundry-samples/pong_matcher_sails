module.exports = {
  create: function(req, res) {
    Result.create({
      matchId: req.body.match_id,
      winner: req.body.winner,
      loser: req.body.loser
    })
    .then(function(result) {
      res.status(201).end();
    });
  }
};
