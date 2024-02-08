const Post = require('../models/post');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');


module.exports.index = async(req, res) => {
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

    const posts = await Post.find({
            $or: [{ title: { $regex: '.*' + search + '.*', $options: 'i' } }],
        })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

    const count = await Post.find({
        $or: [{ title: { $regex: '.*' + search + '.*', $options: 'i' } }],
    }).countDocuments();

    const popularPosts = await Post.find({}).limit(3);

    res.render('posts/posts', {
        posts: posts,
        popularPosts: popularPosts,
        current: page,
        pages: Math.ceil(count / limit),
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render('posts/new');
};

module.exports.createPost = async(req, res, next) => {

    const geoData = await geocoder
    .forwardGeocode({
      query: req.body.post.location,
      limit: 1,
    })
    .send();

    const post = new Post(req.body.post);

    post.geometry = geoData.body.features[0].geometry;
  
    post.images = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
    }));
    post.author = req.user._id;
    await post.save();
    console.log(post);
    req.flash('success', 'Successfully made a new post!');
    res.redirect(`/posts/${post.slug}`);
};

module.exports.showPost = async(req, res) => {
    // const post = await Post.findById(req.params.id)
    const popularPosts = await Post.find({}).limit(3);

    const post = await Post.findOne({ slug: req.params.slug })
        .populate([{
            path: 'reviews',
            populate: {
                path: 'author',
            },
        }, ])
        .populate('author');
    if (!post) {
        req.flash('error', 'Cannot find that post!');
        return res.redirect('/posts');
    }
    res.render('posts/show', {
        post: post,
        popularPosts: popularPosts,
    });
};

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
        req.flash('error', 'Cannot find that post!');
        return res.redirect('/posts');
    }
    res.render('posts/edit', { post });
};

module.exports.updatePost = async(req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const post = await Post.findByIdAndUpdate(id, {
        ...req.body.post,
    });
    const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    post.images.push(...imgs);
    await post.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await post.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImages } } },
        });
    }
    req.flash('success', 'Successfully updated Post!');
    res.redirect(`/posts/${post.slug}`);
};

module.exports.deletePost = async(req, res) => {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Post');
    res.redirect('/posts');
};