const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const Post = require('../models/post');
const users = require('../controllers/users');
const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');

router.get('/', async (req, res) => {

    var search = '';

    if (req.query.search) {
        search = req.query.search;
    }

    var page = 1;

    if (req.query.page) {
        page = req.query.page;
    }

    const limit = 2;

    const posts = await Post.find({
            $or: [{ title: { $regex: '.*' + search + '.*', $options: 'i' } }],
        })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

    const count = await Post.find({
        $or: [{ title: { $regex: '.*' + search + '.*', $options: 'i' } }],
    }).countDocuments();


    res.render('posts/index', {
        posts: posts,
        current: page,
        pages: Math.ceil(count / limit),
    });

});

router
  .route('/register')
  .get(users.renderRegister)
  .post(catchAsync(users.register));

router
  .route('/login')
  .get(users.renderLogin)
  .post(
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login',
    }),
    users.login
  );

router.get('/logout', users.logout);


module.exports = router;
