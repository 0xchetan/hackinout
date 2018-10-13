var express = require('express');
var router = express.Router();
var crypto = require('./controllers/crypto.js');


// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	var balance = crypto.daiBalance('0xaeec6f5aca72f3a005af1b3420ab8c8c7009bac8')
	res.render('index',{balance: balance})
});

router.get('/account', ensureAuthenticated, function(req, res){
	res.render('account');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/login');
	}
}

module.exports = router;