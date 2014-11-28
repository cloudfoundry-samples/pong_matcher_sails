var Promise = require('bluebird');

module.exports = {
  attributes: {
    uuid: 'string',
    requesterId: 'string',

    firstOpen: function() {
      var requesterId = this.requesterId;
      var getOpponentIds = Participant.find()
        .where({ playerId: requesterId })
        .then(function(participants) { return participants; })
        .map(function(participant) { return participant.opponentId; });
      var getPlayedMatchRequestUuids = Participant.find()
        .then(function(participants) { return participants; })
        .map(function(participant) { return participant.matchRequestUuid; });

      return Promise.join(getOpponentIds, getPlayedMatchRequestUuids)
        .spread(function(opponentIds, playedMatchRequestUuids) {
          var whereClause = function(playedMatchRequestUuids) {
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
          return MatchRequest.findOne()
            .where(whereClause(playedMatchRequestUuids));
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

