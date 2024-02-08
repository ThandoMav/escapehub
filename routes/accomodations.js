const express = require('express');
const router = express.Router();
const accomodations = require('../controllers/accomodations');
const catchAsync = require('../utils/catchAsync');
const {
  isLoggedIn,
  isAccomodationAuthor,
  validateAccomodation,
} = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Accomodation = require('../models/accomodation');

router
  .route('/')
  .get(catchAsync(accomodations.index))
  .post(
    isLoggedIn,
    upload.array('image'),
    validateAccomodation,
    catchAsync(accomodations.createAccomodation)
  );

router.get('/new', isLoggedIn, accomodations.renderNewForm);

router.get('/:id', accomodations.showAccomodationId);
router.get('/:slug', accomodations.showAccomodation);

router
  .route('/:id')
  .put(
    isLoggedIn,
    isAccomodationAuthor,
    upload.array('image'),
    validateAccomodation,
    catchAsync(accomodations.updateAccomodation)
  )
  .delete(
    isLoggedIn,
    isAccomodationAuthor,
    catchAsync(accomodations.deleteAccomodation)
  );

router.get(
  '/:id/edit',
  isLoggedIn,
  isAccomodationAuthor,
  catchAsync(accomodations.renderEditForm)
);

module.exports = router;
