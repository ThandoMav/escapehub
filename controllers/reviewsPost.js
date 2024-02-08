const Post = require('../models/post');
const Review = require('../models/review');

module.exports.createReview = async(req, res) => {
    const post = await  Post.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    post.reviews.push(review);
    await review.save();
    await post.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/posts/${post.slug}`);
};


module.exports.createPostReview = async(req, res) => {
    const post = await Post.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    post.reviews.push(review);
    await review.save();
    await post.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/posts/${post.slug}`);
};


module.exports.deleteJobReview = async(req, res) => {
    const { id, reviewId } = req.params;
    await Job.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/jobs/${job.slug}`);
};