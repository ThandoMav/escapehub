const express = require('express');
const router = express.Router();
const posts = require('../controllers/posts');
const catchAsync = require('../utils/catchAsync');
const {
    isLoggedIn,
    isPostAuthor,
    isAdmin,
    validatePost,
} = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Post = require('../models/post');

//router.route('/:page').get(catchAsync(posts.index));

router
    .route('/')
    .get(catchAsync(posts.index))
    .post(isLoggedIn, upload.array('image'), catchAsync(posts.createPost));

router.get('/new', isLoggedIn, posts.renderNewForm);

router.route('/:slug').get(catchAsync(posts.showPost));

router
    .route('/:id')
    .put(
        isLoggedIn,
        upload.array('image'),
        validatePost,
        isPostAuthor,
        catchAsync(posts.updatePost)
    )
    .delete(isLoggedIn, isPostAuthor, catchAsync(posts.deletePost));

router.get(
    '/:id/edit',
    isLoggedIn,
    isPostAuthor,
    catchAsync(posts.renderEditForm)
);

module.exports = router;