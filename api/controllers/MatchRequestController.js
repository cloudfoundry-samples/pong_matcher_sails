/**
 * MatchRequestController
 *
 * @description :: Server-side logic for managing Matchrequests
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  findOne: function (req, res) {
    res.end(JSON.stringify({id: "lonesome", player: "some-player", match_id: null}))
  }
};

