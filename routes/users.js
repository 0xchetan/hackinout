var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var wallet = require('ethereumjs-wallet');

var User = require('../models/user');

var generate = wallet.generate()
console.log(generate.getAddress().toString('hex'))


// Account Settings
router.get('/', function (req, res) {
	res.render('account');
});

// Register
router.get('/register', function (req, res) {
	res.render('register');
});

// Login
router.get('/login', function (req, res) {
	res.render('login');
});

// Forget Password
router.get('/forgot', function (req, res) {
	res.render('forgot');
});


// Account Settings
router.get('/account', function (req, res) {
	res.render('account');
});

// Register User
router.post('/register', function (req, res) {
	generateWallet = wallet.generate()
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var privateKey = generateWallet.getPrivateKey().toString('hex');
	var daiAddr = wallet.fromPrivateKey(privateKey)

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors: errors
		});
	}
	else {
		//checking for email and username are already taken
		User.findOne({ username: { 
			"$regex": "^" + username + "\\b", "$options": "i"
	}}, function (err, user) {
			User.findOne({ email: { 
				"$regex": "^" + email + "\\b", "$options": "i"
		}}, function (err, mail) {
				if (user || mail) {
					res.render('register', {
						user: user,
						mail: mail
					});
				}
				else {
					var newUser = new User({
						name: name,
						email: email,
						username: username,
						password: password,
						daiAddr : daiAddr,
						privateKey: privateKey
					});
					User.createUser(newUser, function (err, user) {
						if (err) throw err;
						console.log(user);
					});
         	req.flash('success_msg', 'You are registered and can now login');
					res.redirect('/login');
				}
			});																																																																																																																					
		});
	}
});

passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByEmail(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/login',
	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }),
	function (req, res) {
		res.redirect('/');
	});

router.get('/logout', function (req, res) {
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/login');
});

router.get('/:username', function (req, res) {
	var username = req.params.username;

	User.findOne({ username: { "$regex": "^" + username + "\\b", "$options": "i"}}, function (err, user){
		if (user) {
			res.render('pay', {
				user: user,
			});
		}

		else {
			res.send("Sorry, It does not exists")
		}
	});
	
  });


  router.post('/addAddress', function (req, res) {
	var address = req.body.address;

	// Validation
	req.checkBody('address', 'Address is added').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		res.render('index');
		console.log('Error')
	}
	else {
		 //checking for email and username are already taken
		var username = req.user.username;
		console.log(username);
		var query = { username: username };
		User.findOneAndUpdate(query, { address: address }, {upsert: true, new: true}, function(err, doc){
		if (err) return res.send(500, { error: err });});
		req.flash('success_msg', 'Address Successfully Added.');
        res.redirect('/');
		
	}
});


router.post('/test', function (req, res) {
	console.log('Accessing /test');
	var address = req.body.address;
	var coin = req.body.cointype;

	// Validation
	req.checkBody('address', 'Address is added').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		res.render('index');
		console.log('Error')
	}
	else {
		 //checking for email and username are already taken
		var username = req.user.username;
		var query = { username: username };
		var getcoin= coin.toLowerCase(); 

		User.findOneAndUpdate(query, {
			['userAddress.' + getcoin]: address
		} , {upsert: true, new:true}, function(err, doc){
		if (err) return res.status(500).send(err);});
		req.flash('success_msg', 'Address Successfully Added.');
		res.redirect('/');
		
	}
});


router.post('/delete', function (req, res) {
	console.log(req.query.method)
	console.log(User.schema.path)

	var username = req.user.username;
	var getcoin = req.query.method

	User.update({_id: req.user._id}, {$unset: {
		['userAddress.' + getcoin]: ""
	}}, function(err, doc){
	if (err) return res.status(500).send(err);});
	req.flash('success_msg', 'Removed');
	res.redirect('/');	
});


router.post('/passwordreset', function (req, res) {
	var password = req.body.password;


});


module.exports = router;