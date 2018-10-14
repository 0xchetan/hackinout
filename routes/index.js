var express = require('express');
var router = express.Router();
var crypto = require('./controllers/crypto.js');


// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	try {
		var transactionStatus = req.user.createdRequests.transactionStatus

		function isFalse(){
			if (transactionStatus == false){
				return true
			}
			else{
				return false
			}
		}

		res.render('index',{
			isFalse: isFalse()
		})
	}
	catch(err) {
		res.render('index')
	}
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