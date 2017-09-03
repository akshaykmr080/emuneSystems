var Patient = require('../db_schema_modules/patients');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../../config.js');

exports.getToken = function(patient){
	return jwt.sign(patient, config.secretKey, {
		expiresIn : 3600
	});
    
};

exports.verifyDoctor = function(req, res, next){
	var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.header('authorization') || req.header('Authorization')||req.body.headers.headerData.authorization;
	if(token){
	    token = token.split(' ')[1];
		var payload = jwt.decode(token, config.secretKey);
		if(!payload){
			return res.status(401).send({message: 'Unauthorized requested. Authentication header invalid'});
		}

		req.doctor = payload;
		next();
	} else {
        console.log("no token provided")
		var err = new Error('No token provided');
				return next(err);
	}
};