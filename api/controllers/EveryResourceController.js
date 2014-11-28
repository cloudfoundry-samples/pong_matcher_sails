var Promise = require('bluebird');

module.exports = {
  destroy: function(req, res) {
    Promise.join(MatchRequest.destroy({}), Participant.destroy({}), Result.destroy({}))
      .then(function() {
        res.end();
      });
  }
};
