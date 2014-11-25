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
        matchRequest.firstOpen()
          .exec(function(err, firstOpenMatchRequest) {
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
      });
  },

  findOne: function(req, res) {
    MatchRequest.findOne({ uuid: req.param('id') })
      .exec(function(err, matchRequest) {
        if (matchRequest) {
          Participant.findOne()
            .where({ matchRequestUuid: req.param('id') })
            .exec(function(err, participant) {
              res.end(JSON.stringify({
                id: matchRequest.uuid,
                player: matchRequest.requesterId,
                match_id: participant ? participant.matchId : null
              }));
            });
        } else {
          res.status(404)
            .send('Not found');
        }
      });
  }
};

