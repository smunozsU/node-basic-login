const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('index', { user : req.user });
});

router.get('/profile',isLoggedIn, (req, res) => {
    res.render('profile', { user : req.user });
});

router.get('/unauthorized', (req, res) => {
    res.render('unauthorized');
});

router.get('/register', (req, res) => {
    res.render('register', { });
});

router.post('/register', (req, res, next) => {
    Account.register(new Account({ username : req.body.username }), req.body.password, (err, account) => {
        if (err) {
          return res.render('register', { error : err.message });
        }

        passport.authenticate('local')(req, res, () => {
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
});


router.get('/login', (req, res) => {
    res.render('login', { user : req.user, error : req.flash('error')});
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});


//logout
router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});


//  middleware para rutas
function isLoggedIn(req, res, next) {

	// si el user esta autenticado continua
	if (req.isAuthenticated())
		return next();

	// si no esta autenticado redirigir
	res.redirect('/unauthorized');
}

module.exports = router;
