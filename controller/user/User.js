const Sequelize = require('sequelize');
const connection = require('../../database/connection');

const User = connection.define('user', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  }, 
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});

// User.sync({force: true});

module.exports = User;