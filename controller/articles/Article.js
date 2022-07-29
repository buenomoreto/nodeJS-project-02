const Sequelize = require('sequelize');
const connection = require('../../database/connection');
const Category = require('../categories/Category');

const Article = connection.define('article', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  body: {
    type: Sequelize.TEXT,
    allowNull: false,
  }
});

Category.hasMany(Article); // TEM N (muitos)
Article.belongsTo(Category); // Uma tabela pertence a outra tabela

module.exports = Article;