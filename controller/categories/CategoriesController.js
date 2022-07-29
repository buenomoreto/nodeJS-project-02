const express = require('express');
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');
const adminAuth = require('../../middlewares/adminAuth');

router.get('/admin/categories/new', (req, res) => {
  res.render('admin/categories/new');
});

router.post('/categories/save', (req, res) => {

  const title = req.body.title;

  if(title) {
    Category.create({
      title,
      slug: slugify(title)
    }).then(() => {
      res.redirect('/admin/categories');
    })
  }else {
    res.redirect('/admin/categories/new');
  }

});

router.get('/admin/categories', adminAuth, (req, res) => {
  Category.findAll().then(categories => {
    res.render('admin/categories', {categories});
  })
});

router.post('/categories/delete/', (req, res) => {

  const id = req.body.id

  if(id) {
    if(!isNaN(id)) {
      Category.destroy({
        where: {
          id: id
        }
      }).then(() => {
        res.redirect('/admin/categories');
      });
    }else {
      res.redirect('/admin/categories');
    }
  }else {
    res.redirect('/admin/categories');
  }

});

router.get('/admin/categories/edit/:id', (req, res) => {
  const id = req.params.id;
  if(isNaN(id)){
    res.redirect('/admin/categories');
  }
  Category.findByPk(id).then(category => {
    if(category) {
      
      res.render('admin/categories/edit', {category: category});

    }else {
      res.redirect('/admin/categories');
    }
  }).catch(error => {
      res.redirect('/admin/categories');
  })
});

router.post('/categories/update', (req, res) => {
  const id = req.body.id;
  const title = req.body.title;

  Category.update({title: title, slug: slugify(title)}, {
    where: {
      id: id
    }
  }).then(() => {
    res.redirect('/admin/categories');
  })

});

module.exports = router;