var express = require('express');
var router = express.Router();
const { isLoggedIn } = require('../middleware');
// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// require sendgrid/mail
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// GET checkout
router.get('/checkout', isLoggedIn, (req, res) => {
    if (req.user.isPaid) {
        req.flash('success', 'Your account is already paid');
        return res.redirect('/campgrounds');
    }
    res.render('checkout', { amount: 20 });
});

// POST pay
router.post('/pay', isLoggedIn, async(req, res) => {
    const { paymentMethodId, items, currency } = req.body;

    const amount = 2000;

    try {
        // Create new PaymentIntent with a PaymentMethod ID from the client.
        const intent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method: paymentMethodId,
            error_on_requires_action: true,
            confirm: true,
        });

        console.log('💰 Payment received!');

        req.user.isPaid = true;
        await req.user.save();
        // The payment is complete and the money has been moved
        // You can add any post-payment code here (e.g. shipping, fulfillment, etc)

        // Send the client secret to the client to use in the demo
        res.send({ clientSecret: intent.client_secret });
    } catch (e) {
        // Handle "hard declines" e.g. insufficient funds, expired card, card authentication etc
        // See https://stripe.com/docs/declines/codes for more
        if (e.code === 'authentication_required') {
            res.send({
                error: 'This card requires authentication in order to proceeded. Please use a different card.',
            });
        } else {
            res.send({ error: e.message });
        }
    }
});

// GET /contact
router.get('/contact', isLoggedIn, (req, res) => {
    res.render('contact');
});

// POST /contact
router.post('/contact', async(req, res) => {
    let { name, email, message } = req.body;
    name = req.sanitize(name);
    email = req.sanitize(email);
    message = req.sanitize(message);
    const msg = {
        to: 'learntocodeinfo@gmail.com',
        from: email,
        subject: `YelpCamp Contact Form Submission from ${name}`,
        text: message,
        html: `
    <h1>Hi there, this email is from, ${name}</h1>
    <p>${message}</p>
    `,
    };
    try {
        await sgMail.send(msg);
        req.flash(
            'success',
            'Thank you for your email, we will get back to you shortly.'
        );
        res.redirect('/contact');
    } catch (error) {
        console.error(error);
        if (error.response) {
            console.error(error.response.body);
        }
        req.flash(
            'error',
            'Sorry, something went wrong, please contact admin@website.com'
        );
        res.redirect('back');
    }
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

//INDEX - show all campgrounds
router.get('/', function(req, res) {
    if (req.query.search && req.xhr) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        Post.find({ title: regex }, function(err, allPosts) {
            if (err) {
                console.log(err);
            } else {
                res.status(200).json(allPosts);
            }
        });
    } else {
        // Get all campgrounds from DB
        Post.find({}, function(err, allPosts) {
            if (err) {
                console.log(err);
            } else {
                if (req.xhr) {
                    res.json(allPosts);
                } else {
                    res.render('posts/index', { posts: allPosts, page: 'posts' });
                }
            }
        });
    }
});

router.get('/view-all-password/', function(req, res, next) {
    var perPage = 1;
    var page = req.params.page || 1;

    passModel
        .find({})
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(function(err, data) {
            if (err) throw err;
            passModel.countDocuments({}).exec((err, count) => {
                res.render('view-all-password', {
                    records: data,
                    current: page,
                    pages: Math.ceil(count / perPage),
                });
            });
        });
});

router.get('/view-all-password/:page', function(req, res, next) {
    var perPage = 1;
    var page = req.params.page || 1;

    passModel
        .find({})
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(function(err, data) {
            if (err) throw err;
            passModel.countDocuments({}).exec((err, count) => {
                res.render('view-all-password', {
                    records: data,
                    current: page,
                    pages: Math.ceil(count / perPage),
                });
            });
        });
});


router.get('/posts/:page', function(req, res, next) {
            var perPage = 9
            var page = req.params.page || 1

            if (req.query.search && req.xhr) {
                const regex = new RegExp(escapeRegex(req.query.search), 'gi');
                // Get all campgrounds from DB


                Post
                    .find({ title: regex })
                    .skip((perPage * page) - perPage)
                    .limit(perPage)
                    .exec(function(err, posts) {
                        Post.count().exec(function(err, count) {
                            if (err) return next(err)
                            if (req.xhr) {
                                res.json(allPosts);
                            } else {
                                res.render('posts/index', {
                                    posts: posts,
                                    current: page,
                                    pages: Math.ceil(count / perPage)
                                })
                            }
                        })
                    })
            })

        module.exports = router;