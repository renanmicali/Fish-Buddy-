const FishSpot = require('../models/fishspot.js');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');


module.exports.index = async (req, res) => {
    const fishingspots = await FishSpot.find({});
    res.render('fishingspots/index', { fishingspots })
}

module.exports.renderNewForm = (req, res) => {
    res.render('fishingspots/new');
}

module.exports.createFishingspot = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.fishingspot.location,
        limit: 1
    }).send()
    const fishingspot = new FishSpot(req.body.fishingspot);
    fishingspot.geometry = (geoData.body.features[0].geometry);
    fishingspot.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    fishingspot.author = req.user._id;
    await fishingspot.save();
    console.log(fishingspot);
    req.flash('success', 'Seccessfully made a new fishingspot!');
    res.redirect(`/fishingspots/${fishingspot._id}`);
}

module.exports.showFishingspot = async (req, res) => {
    const fishingspot = await FishSpot.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(fishingspot);
    if (!fishingspot) {
        req.flash('error', 'Cannot find fishingspot!');
        return res.redirect('/fishingspots');
    }
    res.render('fishingspots/show', { fishingspot });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const fishingspot = await FishSpot.findById(id);
    if (!fishingspot) {
        req.flash('error', 'Cannot find fishingspot!');
        return res.redirect('/fishingspots');
    }
    res.render('fishingspots/edit', { fishingspot });
}

module.exports.updateFishingspot = async (req, res) => {
    const { id } = req.params;
    const fishingspot = await FishSpot.findByIdAndUpdate(id, { ...req.body.fishingspot });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    fishingspot.images.push(...imgs);
    await fishingspot.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await fishingspot.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })

    }
    req.flash('success', 'Successfully updated fishingspot!');
    res.redirect(`/fishingspots/${fishingspot._id}`);
}

module.exports.deleteFishingspot = async (req, res) => {
    const { id } = req.params;
    await FishSpot.findByIdAndDelete(id);
    req.flash('success', 'Fishingspot deleted.');
    res.redirect('/fishingspots');
}