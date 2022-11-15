const express = require('express');
const router = express.Router();
const User = require("../models/user");
const passport = require('passport');

router.route('/login')
    .get((req, res) => { res.render('login', { 'title': 'Log in' }); })
    .post(passport.authenticate('local', { failureFlash: false, failureRedirect: '/login' }), async (req, res) => {
        if (req.user) {
            // req.flash('success', "Successfully logged in.");
            return res.redirect('/all');
        }
    });

router.route('/register')
    .get((req, res) => { res.render('register', { 'title': 'Register' }); })
    .post(async (req, res) => {
        try {
            const { email, username, password } = req.body;
            const user = new User({ email, username });
            const registeredUser = await User.register(user, password);
            req.login(registeredUser, err => {
                if (err)
                    return next(e);
                // req.flash('success', 'Registered successfully. Welcome to 単語！');
                console.log("registerUser returned: ", registeredUser);
                res.status(200);
                res.send("Registered successfully. Welcome to 単語！");
            })
        } catch (err) {
            // req.flash('error', err.message);
            console.log("Caught error reads: ", err.message)
            res.status(409);
            res.send(err.message);
            // throw new ExpressError(404, 'Page Not Found');
            // res.redirect('/auth');
        }
    })

router.get('/logout', (req, res) => {
    req.logOut(function (err) {
        if (err) { return next(err); }
        console.log('alert', "Logged out");
        res.redirect('back');
    });
})

module.exports = router;
