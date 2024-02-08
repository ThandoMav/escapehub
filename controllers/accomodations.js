const Accomodation = require('../models/accomodation');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
  // Get all campgrounds from DB
  var search = '';

  if (req.query.search) {
    search = req.query.search;
  }

  var page = 1;

  if (req.query.page) {
    page = req.query.page;
  }

  const limit = 2;

  const accomodations = await Accomodation.find({
    $or: [{ title: { $regex: '.*' + search + '.*', $options: 'i' } }],
  })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const count = await Accomodation.find({
    $or: [{ title: { $regex: '.*' + search + '.*', $options: 'i' } }],
  }).countDocuments();
  const popularAccomodations = await Accomodation.find({}).limit(3);

  res.render('accomodations/index', {
    accomodations: accomodations,
    current: page,
    popularAccomodations: popularAccomodations,
    pages: Math.ceil(count / limit),
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render('accomodations/new');
};

module.exports.createAccomodation = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.accomodation.location,
      limit: 1,
    })
    .send();
  const accomodation = new Accomodation(req.body.accomodation);
  accomodation.geometry = geoData.body.features[0].geometry;
  accomodation.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  accomodation.author = req.user._id;
  await accomodation.save();
  console.log(accomodation);
  req.flash('success', 'Successfully made a new Accomodation!');
  res.redirect(`/accomodations/${accomodation.slug}`);
};

module.exports.showAccomodationId = async (req, res) => {
  const accomodation = await Accomodation.findOne({ _id: req.params.id })
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    })
    .populate('author');
  if (!accomodation) {
    req.flash('error', 'Cannot find that accomodation!');
    return res.redirect('/accomodations');
  }
  const popularAccomodations = await Accomodation.find({}).limit(3);

  res.render('accomodations/show', {
    accomodation: accomodation,
    popularAccomodations: popularAccomodations,
  });
};

module.exports.showAccomodation = async (req, res) => {
  const accomodation = await Accomodation.findOne({ slug: req.params.slug })
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    })
    .populate('author');
  if (!accomodation) {
    req.flash('error', 'Cannot find that accomodation!');
    return res.redirect('/accomodations');
  }
  const popularAccomodations = await Accomodation.find({}).limit(3);

  res.render('accomodations/show', {
    accomodation: accomodation,
    popularAccomodations: popularAccomodations,
  });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const accomodation = await Accomodation.findById(id);
  if (!accomodation) {
    req.flash('error', 'Cannot find that accomodation!');
    return res.redirect('/accomodations');
  }
  res.render('accomodations/edit', { accomodation });
};

module.exports.updateAccomodation = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const accomodation = await Accomodation.findByIdAndUpdate(id, {
    ...req.body.accomodation,
  });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  accomodation.images.push(...imgs);
  await accomodation.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await accomodation.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash('success', 'Successfully updated accomodation!');
  res.redirect(`/accomodations/${accomodation.slug}`);
};

module.exports.deleteAccomodation = async (req, res) => {
  const { id } = req.params;
  await Accomodation.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted accomodation');
  res.redirect('/accomodations');
};
