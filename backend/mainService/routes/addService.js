var express = require('express');
var Promise = require('promise');
var expressPromiseRouter = require("express-promise-router");
var router = expressPromiseRouter();
let registry = null;
let serviceName = null;
let servicePort = null;
/* GET users listing. */
router.get('/:serviceName/:port', (req, res, next) => {
    

    serviceName = req.params.serviceName;
    servicePort = req.params.port;
    //const serviceIp = req.connection.remoteAddress.includes('::')
    //? `[${req.connection.remoteAddress}]` : req.connection.remoteAddress;
    var serviceIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (serviceIp.substr(0, 7) == "::ffff:") {
        serviceIp = serviceIp.substr(7);
    }
    registry.add(serviceName, serviceIp, servicePort);
    
         res.json({result: `${serviceName} at ${serviceIp}:${servicePort}`});

   
});

module.exports.router = router;

module.exports.init = (serviceRegistry) => {
    registry = serviceRegistry;
}