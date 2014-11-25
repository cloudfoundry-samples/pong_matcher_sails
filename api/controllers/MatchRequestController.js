var uuid = require('node-uuid');

module.exports = {
  create: function(req, res) {
    var attributes = {
      uuid: req.param('id'),
      requesterId: req.body.player,
      matchId: req.body.match_id
    };

    MatchRequest.create(attributes)
      .exec(function(err, matchRequest) {
        var firstOpenMatchRequest = matchRequest.firstOpen();
        var matchId = uuid.v4();

        if (firstOpenMatchRequest) {
          Participant.create({
            matchId: matchId,
            matchRequestUuid: firstOpenMatchRequest.uuid,
            playerId: firstOpenMatchRequest.requesterId,
            opponentId: matchRequest.requesterId
          })
          .exec(function(err, participant) {
            Participant.create({
              matchId: matchId,
              matchRequestUuid: matchRequest.uuid,
              playerId: matchRequest.requesterId,
              opponentId: firstOpenMatchRequest.requesterId
            })
            .exec(function(err, participant) {
              res.end(JSON.stringify(matchRequest));
            });
          });
        } else {
          res.end(JSON.stringify(matchRequest));
        }
      });
  },

  findOne: function(req, res) {
    MatchRequest.findOne({ uuid: req.param('id') })
      .exec(function(err, matchRequest) {
        Participant.findOne()
          .where({ matchRequestUuid: req.param('id') })
          .exec(function(err, participant) {
            res.end(JSON.stringify({
              uuid: matchRequest.uuid,
              player: matchRequest.requesterId,
              match_id: participant.matchId
            }));
          });
      });
  }
};

