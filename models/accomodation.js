const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const domPurifier = require('dompurify');
const { JSDOM } = require('jsdom');
const htmlPurify = domPurifier(new JSDOM().window);

const stripHtml = require('string-strip-html');

// https://res.cloudinary.com/douqbebwk/image/upload/w_300/v1600113904/YelpCamp/gxgle1ovzd2f3dgcpass.png

//initialize slug
mongoose.plugin(slug);
const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const AccomodationSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    snippet: {
      type: String,
    },
    price: Number,
    creationDate: {
      type: Date,
      default: Date.now(),
    },
    institution: String,
    creationDate: {
      type: Date,
      default: Date.now(),
    },
    province: String,
    description: String,
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    slug: { type: String, slug: 'title', unique: true, slug_padding_size: 2 },
  },
  opts
);

AccomodationSchema.virtual('properties.popUpMarkup').get(function () {
  return `
    <strong><a href="/accomodations/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`;
});

AccomodationSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});
AccomodationSchema.pre('validate', function (next) {
  //check if there is a description
  if (this.description) {
    this.description = htmlPurify.sanitize(this.description);
    this.snippet = stripHtml(this.description.substring(0, 200)).result;
  }

  next();
});

module.exports = mongoose.model('Accomodation', AccomodationSchema);
