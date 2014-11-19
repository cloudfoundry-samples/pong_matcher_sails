
module.exports = {
  findOne: function (req, res) {
    res.end(JSON.stringify({id: "lonesome", player: "some-player", match_id: null}))
  }
};

