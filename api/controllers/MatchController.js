module.exports = {
  findOne: function(req, res) {
    Participant.find()
      .where({ matchId: req.param('id') })
      .then(function(participants) {
        if (participants.length) {
          res.end(JSON.stringify({
            id: participants[0].matchId,
            match_request_1_id: participants[0].matchRequestUuid,
            match_request_2_id: participants[1].matchRequestUuid
          }));
        } else {
          res.status(404).end();
        }
      })
      .catch(function(err) {
        res.status(500).send(err.message);
      });
  }
};
