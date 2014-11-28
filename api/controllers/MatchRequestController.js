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
    var addAttribute = function(attr, val, obj) {
      var mergeObj = {};
      mergeObj[attr] = { value: val };
      return Object.create(obj, mergeObj);
    };

    Promise.join(getMatchRequest, getResults)
      .spread(function(matchRequest, results) {
        this.matchRequest = matchRequest;
        if (this.matchRequest) {
          return (results || []).map(function(r) { return r.matchId });
        } else {
          res.status(404).send('Not found');
          return [];
        }
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
        if (participant) {
          res.end(JSON.stringify(addAttribute('matchId', participant.matchId, this.matchRequest)));
        } else {
          res.end(JSON.stringify(this.matchRequest));
        }
      })
      .catch(function(err) {
        res.status(500).send(err.message);
      });
  }
};

