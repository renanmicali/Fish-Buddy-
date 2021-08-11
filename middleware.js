const { fishingspotSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const FishSpot = require('./models/fishspot.js');
const Review = require('./models/review')


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //store the url requested
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in')
        return res.redirect('/login');
    }
    next();
}

module.exports.validateFishingspot = (req, res, next) => {
    const { error } = fishingspotSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    };
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const fishingspot = await FishSpot.findById(id);
    if (!fishingspot.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission.');
        return res.redirect(`/fishingspots/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission.');
        return res.redirect(`/fishingspots/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    };
}