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
    var getMatchRequest = MatchRequest.findOne({ uuid: req.param('id') });
    var getResults = Result.find();
    Promise.join(getMatchRequest, getResults)
      .spread(function(matchRequest, results) {
        this.matchRequest = matchRequest;
        if (this.matchRequest) {
          return results;
        } else {
          res.status(404).send('Not found');
        }
      })
      .then(function(results) {
        if (results && results.length) {
          return results;
        } else {
          return [];
        }
      })
      .map(function(result) {
        return result.matchId;
      })
      .then(function(finishedMatchIds) {
        if (finishedMatchIds.length) {
          return Participant.findOne({
            matchRequestUuid: req.param('id'),
            matchId: { '!': finishedMatchIds }
          });
        } else {
          return Participant.findOne({
            matchRequestUuid: req.param('id')
          });
        }
      })
      .then(function(participant) {
        var body;

        if (participant) {
          body = JSON.stringify(Object.create(this.matchRequest, {
            matchId: { value: participant.matchId }
          }));
          res.end(body);
        } else {
          res.end(JSON.stringify(this.matchRequest));
        }
      })
      .catch(function(err) {
        res.status(500).send(err.message);
      });
  }
};

