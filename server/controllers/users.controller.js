var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');

// routes
router.post('/authenticate', authenticate);
router.post('/social-authenticate', socialAuthenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.post('/forgot-password', forgetPassword);
router.post('/reset-password', resetPassword);

module.exports = router;

/**
 * Authenticate user while login
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]} 
 */
function authenticate(req, res) {
    userService.authenticate(req.body.email, req.body.password)
        .then(function (user) {
            if (user) {
                // authentication successful
                res.send(user);
            } else {
                // authentication failed
                res.status(400).send('Email or password is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

/**
 * Authenticate user while login
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]} 
 */
function socialAuthenticate(req, res) {
    userService.socialAuthenticate(req.body)
        .then(function (user) {
            if (user) {
                // authentication successful
                res.send(user);
            } else {
                // authentication failed
                res.status(400).send('Something went wrong');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

/**
 * Register user
 * @param  {[type]} req 
 * @param  {[type]} res 
 * @return {[type]} 
 */
function register(req, res) {
    userService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

/**
 * Get all user
 * @param  {[type]} req 
 * @param  {[type]} res 
 * @return {[type]} 
 */
function getAll(req, res) {
    userService.getAll()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

/**
 * Get current user
 * @param  {[type]} req 
 * @param  {[type]} res
 * @return {[type]} 
 */
function getCurrent(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

/**
 * Get current user
 * @param  {[type]} req 
 * @param  {[type]} res
 * @return {[type]} 
 */
function forgetPassword(req, res) {
    userService.forgotPassword(req.body)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


/**
 * Get current user
 * @param  {[type]} req 
 * @param  {[type]} res
 * @return {[type]} 
 */
function resetPassword(req, res) {
    userService.resetPassword(req.body)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}