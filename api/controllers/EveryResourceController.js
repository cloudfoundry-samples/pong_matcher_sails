module.exports = {
  destroy: function(req, res) {
    MatchRequest.destroy({}).exec(function() {
      Participant.destroy({}).exec(function() {
        res.end();
      });
    });
  }
};
