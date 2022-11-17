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
    .post(upload.array('image'), catchAsync(nodes.createNode))
// .post(upload.single('image'), (req, res) => { console.log(req.body.topic); res.status(200).send("Got it") })

router.route('/new')
    .get(isLoggedIn, nodes.renderNewForm);


router.route('/:id')
    .get(catchAsync(nodes.showNode))
    .put(validateNode, catchAsync(nodes.updateNode))
    .delete(catchAsync(nodes.deleteNode))


router.get('/:id/edit', catchAsync(nodes.renderEditForm))

module.exports = router;
