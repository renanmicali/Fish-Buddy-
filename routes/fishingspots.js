const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const fishingspots = require('../controllers/fishingspots');
const { isLoggedIn, isAuthor, validateFishingspot } = require('../middleware')
const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage });

const FishSpot = require('../models/fishspot.js');
const { populate } = require('../models/fishspot.js');


router.route('/')
    .get(catchAsync(fishingspots.index))
    .post(isLoggedIn, upload.array('image'), validateFishingspot, catchAsync(fishingspots.createFishingspot))


router.get('/new', isLoggedIn, fishingspots.renderNewForm);

router.route('/:id')
    .get(catchAsync(fishingspots.showFishingspot))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateFishingspot, catchAsync(fishingspots.updateFishingspot))
    .delete(isLoggedIn, isAuthor, catchAsync(fishingspots.deleteFishingspot))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(fishingspots.renderEditForm))


module.exports = router;