var Promise = require('bluebird');

module.exports = {
  create: function(req, res) {
    MatchRequest
      .createWithMatch(req.param('id'), req.body.player, req.body.match_id)
      .then(function() { res.end() });
  },

  findOne: function(req, res) {
    return MatchRequest
      .findWithMatch(req.param('id'))
      .then(function(matchRequest) {
        if (matchRequest) {
          res.end(JSON.stringify(matchRequest));
        } else {
          res.status(404).send('Not found');
        }
      })
      .catch(function(err) {
        res.status(500).send(err.message);
      });
  }
};

