var uuid = require('node-uuid');
var Promise = require('bluebird');

module.exports = {
  create: function(req, res) {
    var attributes = {
      uuid: req.param('id'),
      requesterId: req.body.player,
      matchId: req.body.match_id
    };

    MatchRequest.create(attributes)
      .then(function(matchRequest) {
        this.matchRequest = matchRequest;
        return this.matchRequest.firstOpen();
      })
      .then(function(firstOpenMatchRequest) {
        this.opponentRequest = firstOpenMatchRequest;
        this.matchId = uuid.v4();

        if (this.opponentRequest) {
          return Promise.join(
              Participant.create({
                matchId: this.matchId,
                matchRequestUuid: this.opponentRequest.uuid,
                playerId: this.opponentRequest.requesterId,
                opponentId: this.matchRequest.requesterId
              }),
              Participant.create({
                matchId: this.matchId,
                matchRequestUuid: this.matchRequest.uuid,
                playerId: this.matchRequest.requesterId,
                opponentId: this.opponentRequest.requesterId
              }));
        } else {
          return Promise.resolve();
        }
      })
      .then(function(firstParticipant, secondParticipant) {
        res.end(JSON.stringify(matchRequest));
      });
  },

  findOne: function(req, res) {
    MatchRequest.findOne({ uuid: req.param('id') })
      .then(function(matchRequest) {
        this.matchRequest = matchRequest;
        if (this.matchRequest) {
          return Participant.find({
            matchRequestUuid: req.param('id'),
            matchId: { '!': 'SELECT match_id FROM results' }
          });
        } else {
          res.status(404).send('Not found');
        }
      })
      .then(function(participants) {
        if (participants && participants.length) {
          res.end(JSON.stringify(Object.create(this.matchRequest, {
            matchId: { value: participants[0].matchId }
          })));
        } else {
          res.end(JSON.stringify(this.matchRequest));
        }
      });
  }
};

