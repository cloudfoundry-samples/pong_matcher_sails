/**
 * Connections
 * (sails.config.connections)
 *
 * `Connections` are like "saved settings" for your adapters.  What's the difference between
 * a connection and an adapter, you might ask?  An adapter (e.g. `sails-mysql`) is generic--
 * it needs some additional information to work (e.g. your database host, password, user, etc.)
 * A `connection` is that additional information.
 *
 * Each model must have a `connection` property (a string) which is references the name of one
 * of these connections.  If it doesn't, the default `connection` configured in `config/models.js`
 * will be applied.  Of course, a connection can (and usually is) shared by multiple models.
 * .
 * Note: If you're using version control, you should put your passwords/api keys
 * in `config/local.js`, environment variables, or use another strategy.
 * (this is to prevent you inadvertently sensitive credentials up to your repository.)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.connections.html
 */

/* See https://github.com/balderdashy/sails-mysql/issues/154 for why we're
   parsing URLs here */
var urlParse = require('url').parse;
var databaseUrl = (process.env.DATABASE_URL ||
    "mysql2://sailspong:sailspong@127.0.0.1:3306/pong_matcher_sails_development")
var options = urlParse(databaseUrl);

module.exports.connections = {

  mysql: {
    adapter: 'sails-mysql',
    host: options.hostname,
    port: options.port,
    user: options.auth.split(':')[0],
    password: options.auth.split(':')[1],
    database: options.pathname.split('/')[1]
  }

};
