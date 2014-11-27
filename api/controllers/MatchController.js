module.exports = {
  findOne: function(req, res) {
    Participant.find()
      .where({ matchId: req.param('id') })
      .then(function(participants) {
        if (participants.length) {
          res.end(JSON.stringify({
            id: firstParticipant.matchId,
            match_request_1_id: firstParticipant.matchRequestUuid,
            match_request_2_id: secondParticipant.matchRequestUuid
          }));
        } else {
          res.status(404).end();
        }
      })
      .catch(function(err) {
        res.status(500).end();
      });
  }
};
