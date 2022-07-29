const Sequelize = require('sequelize');

const connection = new Sequelize('press', 'root', 'teste', {
  host: 'localhost',
  dialect: 'mysql',
  timezone: '-03:00'
});

module.exports = connection;

