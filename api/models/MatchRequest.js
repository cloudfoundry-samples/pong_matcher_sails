var Promise = require('bluebird');

module.exports = {
  attributes: {
    uuid: 'string',
    requesterId: 'string',

    firstOpen: function() {
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

