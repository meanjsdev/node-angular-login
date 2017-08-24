var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var nodemailer = require('nodemailer');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('users');

var service = {};

service.authenticate = authenticate;
service.socialAuthenticate = socialAuthenticate;
service.getAll = getAll;
service.getById = getById;
service.create = create;
service.forgotPassword = forgotPassword;
service.resetPassword = resetPassword;

module.exports = service;

function authenticate(email, password) {
    var deferred = Q.defer();

    db.users.findOne({ email: email }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            deferred.resolve({
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                token: jwt.sign({ sub: user._id }, config.secret)
            });
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}


function socialAuthenticate(userParam) {
    var deferred = Q.defer();

    db.users.findOne({ email: userParam.email }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user && user.facebook.id == userParam.facebook.id) {
            // authentication successful
            deferred.resolve({
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                token: jwt.sign({ sub: user._id }, config.secret)
            });
        } else if(!user) {
            db.users.insert(
            userParam,
            function (err, result) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve({
                    _id: result._id,
                    email: result.email,
                    firstName: result.firstName,
                    lastName: result.lastName,
                    token: jwt.sign({ sub: result._id }, config.secret)
                });
            });            
        }
        else {
            // authentication failed
            deferred.resolve();
        }

    });

    return deferred.promise;
}


function getAll() {
    var deferred = Q.defer();

    db.users.find().toArray(function (err, users) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        // return users (without hashed passwords)
        users = _.map(users, function (user) {
            return _.omit(user, 'hash');
        });

        deferred.resolve(users);
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findOne(
        { email: userParam.email },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                // email already exists
                deferred.reject('Email "' + userParam.email + '" is already taken');
            } else {
                createUser();
            }
        });

    function createUser() {
        
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password');

        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password, 10);
        // add hased token to user obejct, will be used to reset password
        user.resetPasswordToken = bcrypt.hashSync(userParam.email, 10);
        
        db.users.insert(
            user,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

/**
 * Rest password will be used when updating a password or in case of forgot password
 * @param  {[type]} userParam can contain oldPassword, newPassword, token or email
 * @return {[type]}
 * Required Param - email, ((newPassword && oldPassword) || token)
 */
function resetPassword(userParam) {
    var deferred = Q.defer();

    var conditions = { email: userParam.email };

    if(userParam.token) {
        conditions.resetPasswordToken = userParam.token;
    }

    if(userParam.oldPassword) {
        conditions.hash = userParam.oldPassword;
    }

    // validation
    db.users.findOne(
        conditions,
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (!user || user.facebook) {
                // invalid user
                deferred.reject('Invalid User');
            } else {
                updatePassword();
            }
        });

    function updatePassword() {
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'oldPassword');
        var user = _.omit(userParam, 'newPassword');
        var user = _.omit(userParam, 'token');

        var set = {};

        // add hashed password to user object
        set.hash = bcrypt.hashSync(userParam.newPassword, 10);

        db.users.update(
            { email: userParam.email },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve({'message': 'Your password has been changed'});
            });
    }

    return deferred.promise;    
}

/**
 * Forgot password - Validate user and send email
 * @param  {[type]} userParam 
 * @return {[type]} 
 * Required Param - email
 */
function forgotPassword(userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findOne(
        { email: userParam.email },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (!user) {
                // user does not exists
                deferred.reject('Email "' + userParam.email + '" does not exists');
            } else if(user && user.facebook) {
                deferred.reject('You need to login via Facebook');
            } else{
                sendEmail(user);
            }
        });

    function sendEmail(user) {
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            // port: 465,
            // secure: true, // secure:true for port 465, secure:false for port 587
            auth: {
                user: config.gmail.user,
                pass: config.gmail.password
            }
        });
        var mailOptions = {
            to: user.email,
            from: 'passwordreset@demo.com',
            subject: 'Node.js Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://localhost:3000/resetpassword?token=' + user.resetPasswordToken + '&email=' + user.email + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        transporter.sendMail(mailOptions, function(err, info) {
            if(!err)
                deferred.resolve({'message': 'An e-mail has been sent to ' + user.email + ' with further instructions.'});
        });
                
    }

    return deferred.promise;  
}