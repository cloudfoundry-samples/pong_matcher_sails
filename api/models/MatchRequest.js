var Promise = require('bluebird');
var uuid = require('node-uuid');

module.exports = {
  findWithMatch: function(id) {
    var getMatchRequest = MatchRequest.findOne({ uuid: id });
    var getResults = Result.find();
    var addAttribute = function(attr, src, dest) {
      var properties = {};

      if (src) {
        properties[attr] = { value: src[attr] };
        return Object.create(dest, properties);
      } else {
        return dest;
      }
    };

    return Promise.join(getMatchRequest, getResults)
      .spread(function(matchRequest, foundResults) {
        this.matchRequest = matchRequest;
        return []
          .concat(foundResults)
          .map(function(r) { return r.matchId });
      })
      .then(function(finishedMatchIds) {
        if (finishedMatchIds.length) {
          return Participant.findOne({
            matchRequestUuid: id,
            matchId: { '!': finishedMatchIds }
          });
        } else if (this.matchRequest) {
          return Participant.findOne({
            matchRequestUuid: id
          });
        }
      })
      .then(function(participant) {
        return addAttribute('matchId', participant, this.matchRequest);
      });
  },

  createWithMatch: function(newUuid, requesterId, matchId) {
    return MatchRequest.create({
      uuid: newUuid,
      requesterId: requesterId,
      matchId: matchId
    })
    .then(function(matchRequest) {
      this.matchRequest = matchRequest;
      return this.matchRequest.findOpponentMatchRequest();
    })
    .then(function(opponentRequest) {
      matchId = uuid.v4();

      if (opponentRequest) {
        return Promise.join(
            Participant.create({
              matchId: matchId,
              matchRequestUuid: opponentRequest.uuid,
              playerId: opponentRequest.requesterId,
              opponentId: this.matchRequest.requesterId
            }),
            Participant.create({
              matchId: matchId,
              matchRequestUuid: this.matchRequest.uuid,
              playerId: this.matchRequest.requesterId,
              opponentId: opponentRequest.requesterId
            }));
      } else {
        return Promise.resolve();
      }
    });
  },

  attributes: {
    uuid: 'string',
    requesterId: 'string',

    findOpponentMatchRequest: function() {
      var requesterId = this.requesterId;

      var getOpponentIds = Participant.find()
        .where({ playerId: requesterId })
        .then(function(participants) {
          return participants.map(function(p) { return p.opponentId; })
        });

      var getPlayedMatchRequestUuids = Participant.find()
        .then(function(participants) {
          return participants.map(function(p) { return p.matchRequestUuid; })
        });

      var whereClause = function(opponentIds, playedMatchRequestUuids) {
        if (playedMatchRequestUuids.length) {
          return {
            requesterId: { '!': opponentIds.concat(requesterId) },
            uuid: { '!': playedMatchRequestUuids }
          };
        } else {
          return {
            requesterId: { '!': opponentIds.concat(requesterId) }
          };
        }
      };

      return Promise.join(getOpponentIds, getPlayedMatchRequestUuids)
        .spread(function(opponentIds, playedMatchRequestUuids) {
          return MatchRequest.findOne()
            .where(whereClause(opponentIds, playedMatchRequestUuids));
        });
    },

    toJSON: function() {
      return {
        id: this.uuid,
        player: this.requesterId,
        match_id: typeof(this.matchId) === 'undefined' ? null : this.matchId
      };
    }
  }
};

