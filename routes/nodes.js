const catchAsync = require("../utils/catchAsync");

const nodes = require('../controllers/nodes');

const express = require('express');
const router = express.Router();
const { validateNode } = require('../utils/middleware');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const { isLoggedIn } = require('../middleware');

router.route('/')
    .get(catchAsync(nodes.renderIndex))
    .post(upload.array('image'), isLoggedIn, catchAsync(nodes.createNode))

router.route('/new')
    .get(isLoggedIn, nodes.renderNewForm);


router.route('/:id')
    .get(catchAsync(nodes.showNode))
    .put(isLoggedIn, validateNode, catchAsync(nodes.updateNode))
    .delete(isLoggedIn, catchAsync(nodes.deleteNode))


router.get('/:id/edit', catchAsync(nodes.renderEditForm))

module.exports = router;
