const catchAsync = require("../utils/catchAsync");

const nodes = require('../controllers/nodes');

const express = require('express');
const router = express.Router();
const { validateNode } = require('../utils/middleware');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(nodes.renderIndex))
    // .post(validateNode, catchAsync(nodes.createNode))
    .post(upload.single('image'), (req, res) => { res.send(console.log(req.body, req.file)) })

router.route('/new')
    .get(nodes.renderNewForm)


router.route('/:id')
    .get(catchAsync(nodes.showNode))
    .put(validateNode, catchAsync(nodes.updateNode))
    .delete(catchAsync(nodes.deleteNode))


router.get('/:id/edit', catchAsync(nodes.renderEditForm))

module.exports = router;
