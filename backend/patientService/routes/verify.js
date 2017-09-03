var Patient = require('../db_schema_modules/patients');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config.js');

exports.getToken = function(patient){
	return jwt.sign(patient, config.secretKey, {
		expiresIn : 3600
	});
    
};

exports.verifyPatient = function(req, res, next){
	//console.log(req.headers);
	//console.log(req.body)
	var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.header('Authorization')||req.body.headers.headerData.authorization;

	if(token){
	    token = token.split(' ')[1];
		var payload = jwt.decode(token, config.secretKey);
		if(!payload){
			return res.status(401).send({message: 'Unauthorized requested. Authentication header invalid'});
		}

		req.patient = payload;
		next();
	} else {
		var err = new Error('No token provided');
				return next(err);
	}
};