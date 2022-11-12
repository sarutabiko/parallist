const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login', { 'title': 'Log in' });
})

router.get('/register', (req, res) => {
    res.render('register', { 'title': 'Register' });
})

router.get('/logout', (req, res) => {
    res.send('YOOOOO why you wanna log out bro');
})

module.exports = router;
