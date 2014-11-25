module.exports = {
  findOne: function(req, res) {
    Participant.find()
      .where({ matchId: req.param('id') })
      .exec(function(err, participants) {
        res.end(JSON.stringify({
          id: participants[0].matchId,
          match_request_1_id: participants[0].matchRequestUuid,
          match_request_2_id: participants[1].matchRequestUuid
        }));
      });
  }
};
