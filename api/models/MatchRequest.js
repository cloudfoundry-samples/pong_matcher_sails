module.exports = {
  attributes: {
    uuid: 'string',
    requesterId: 'string',

    firstOpen: function() {
      return MatchRequest.findOne().where({ requesterId: { '!': this.requesterId }});
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

