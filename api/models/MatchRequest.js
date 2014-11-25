module.exports = {
  attributes: {
    uuid: 'string',
    requesterId: 'string',

    firstOpen: function() {
      return MatchRequest.findOne().where({ requesterId: { '!': this.requesterId }});
    }
  }
};

