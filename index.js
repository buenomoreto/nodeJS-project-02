const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const app = express();
const port = 8080;
const connection = require('./database/connection');

// Sessions

// Redis

app.use(session({secret: 'qwertyuiopasdfghjklzxcvbnm', cookie: {maxAge: 30000000}}))

// import controllers
const categoriesController = require('./controller/categories/CategoriesController');
const articlesController = require('./controller/articles/ArticlesController');
const userController = require('./controller/user/UserController');

// import MODEL
const Article = require('./controller/articles/Article');
const Category = require('./controller/categories/Category');
const User = require('./controller/user/User');

// ENGINE && STATIC
app.set('view engine', 'ejs');
app.use(express.static('public'));


// BODY PARSER FORMS
app.use(bodyParser.urlencoded( {extended: false} ));
app.use(bodyParser.json());

// CONECTADO AO BANCO
connection.authenticate().then(() => {
    console.log('Connectado');
}).catch( (error)=> {
    console.log(error);
});

app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', userController);

app.get('/session', (req, res) => {

});

app.get('/read', (req, res) => {

});

app.get('/', (req, res) => {
  Article.findAll({order: [['id', 'DESC']], limit: 4}).then(articles => {
    Category.findAll().then(categories => {
      res.render("index", {articles: articles, categories: categories});
    });
  });
});

app.get('/:slug', (req, res) => {
  const slug = req.params.slug;

  Article.findOne({
    where: {
      slug: slug
    }
  }).then(article => {
    if(article) {
      Category.findAll().then(categories => {
        res.render("article", {article: article, categories: categories});
      });
    }else {
      res.redirect('/')
    }
  }).catch(error => {
    res.redirect('/');
  });

});

app.get('/category/:slug', (req, res) => {
 const slug = req.params.slug;
 Category.findOne({
  where: {
    slug: slug
  },
  include: [{model: Article}]
 }).then(category => {
  if(category) {
    Category.findAll().then(categories => {
      res.render('index', {articles: category.articles, categories: categories});
    })
  }else {
    res.render('/');
  }
 }).catch(error => {
    res.render('/');
 });
});


app.listen(port, () => {
  console.log('Server on');
})