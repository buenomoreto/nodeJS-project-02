const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Articles = require('./Article');
const slugify = require('slugify');
const adminAuth = require('../../middlewares/adminAuth');
const Article = require('./Article');

router.get('/admin/articles', adminAuth, (req, res) => {
  Articles.findAll({include: [{model: Category}]}).then(articles => {
    res.render('admin/articles/index', {articles: articles});
  }); 
});

router.get('/admin/articles/new', (req, res) => {
  Category.findAll().then(categories => {
    res.render('admin/articles/new', {categories: categories});
  });
});

router.post('/articles/save', (req, res) => {
  const title = req.body.title;
  const body = req.body.body
  const category = req.body.category;

  Articles.create({
    title: title,
    slug: slugify(title),
    body: body,
    categoryId: category
  }).then(() => {
    res.redirect('/admin/articles');
  });
})

router.post('/articles/delete/', (req, res) => {

  const id = req.body.id

  if(id) {
    if(!isNaN(id)) {
      Articles.destroy({
        where: {
          id: id
        }
      }).then(() => {
        res.redirect('/admin/articles');
      });
    }else {
      res.redirect('/admin/articles');
    }
  }else {
    res.redirect('/admin/articles');
  }

});

router.get('/admin/articles/edit/:id', (req, res) => {
  const id = req.params.id;

  if(isNaN(id)){
    res.redirect('/admin/articles');
  }
  Articles.findByPk(id).then(article => {
    if(article) {
      Category.findAll().then(categories => {
        res.render('admin/articles/edit', {article: article, categories: categories});
      });
    }else {
      res.redirect('/admin/articles');
    }
  }).catch(error => {
      res.redirect('/admin/articles');
  })
});

router.post('/articles/update', (req, res) => {
  const id = req.body.id;
  const title = req.body.title;
  const body = req.body.body;
  const categoryID = req.body.category;

  Articles.update({title: title, slug: slugify(title), body: body, categoryId: categoryID}, {
    where: {
      id: id
    }
  }).then(() => {
    res.redirect('/admin/articles');
  })

});

router.get('/articles/page/:num', (req, res) => {
  const pg = req.params.num;
  let offset = 0;

  if(isNaN(pg) || pg == 1){
    offset = 0;
  }else {
    offset = (parseInt(pg) - 1)* 4;
  }
  
  Article.findAndCountAll({
    limit: 4,
    offset: offset,
    order: [['id', 'DESC']]
  }).then(articles => {

    let next;

    if(offset + 4 >= articles.count){
      next = false;
    }else {
      next = true;
    }

    const result = {
      page: parseInt(pg),
      next,
      articles
    }

    Category.findAll().then(categories => {
      res.render('admin/articles/page', {result: result, categories: categories});
    })

  });

});

module.exports = router;