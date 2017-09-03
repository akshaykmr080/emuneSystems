'use strict';

var http = require('http');
var express = require('express');
var doctorRouter = express.Router();
var requestify = require('requestify');
let registry = null;

    doctorRouter.post('/register', (req,res,next) =>{
        const service = registry.get('doctor');
            requestify.post("http://"+service.ip+":"+service.port+"/doctor/register",req.body).then(function(response) {
          // Get the response body
          return res.status(200).json(response.getBody());
        }).catch(function(err){
            return res.status(500).json(err);
        })
    });

   doctorRouter.post('/login', (req,res,next) =>{
           const service = registry.get('doctor');
            requestify.post("http://"+service.ip+":"+service.port+"/doctor/login",req.body).then(function(response) {
          // Get the response body
          return res.status(200).json(response.getBody());
        }).catch(function(err){
            console.log(err);
            return res.status(401).json(err);
        })
    }); 

    doctorRouter.post('/patientSearch', (req,res,next) =>{
           const service = registry.get('doctor');
           var body = req.body;
           var headerData = req.headers;
           var options = {
               body:body,
               headers: {headerData}
           }
            requestify.post("http://"+service.ip+":"+service.port+"/doctor/patientSearch",
                     options
                ).then(function(response) {
          // Get the response body
          return res.status(200).json(response.getBody());
        }).catch(function(err){
            console.log(err);
            return res.status(401).json(err);
        })
    })

     doctorRouter.get('/me', (req,res,next) =>{
           const service = registry.get('doctor');
           
           var headerData = req.headers;
           var options = {
               headers: headerData
           }
            requestify.get("http://"+service.ip+":"+service.port+"/doctor/me", options).then(function(response) {
          // Get the response body
          return res.status(200).json(response.getBody());
        }).catch(function(err){
            console.log(err);
            return res.status(401).json(err);
        })
    });

    doctorRouter.post('/me', (req,res,next) =>{
           const service = registry.get('doctor');
           var body = req.body;
           var headerData = req.headers;
           var options = {
               body:body,
               headers: {headerData}
           }
            requestify.post("http://"+service.ip+":"+service.port+"/doctor/me",
                     options
                ).then(function(response) {
          // Get the response body
          return res.status(200).json(response.getBody());
        }).catch(function(err){
            console.log(err);
            return res.status(401).json(err);
        })
    });
    doctorRouter.get('/getPrescriptions/:patientId' , (req,res,next) => {
        const service = registry.get('doctor');
        var patientData = req.params.patientId;
        console.log(req.headers);
        var headerData = req.headers;
           var options = {
               headers: headerData
           }
        requestify.get("http://"+service.ip+":"+service.port+"/doctor/getPrescription/"+patientData, options).then(function(response) {
          // Get the response body
          console.log(response.getBody());
          return res.status(200).json(response.getBody());
        }).catch(function(err){
            console.log(err);
            return res.status(401).json(err);
        })
    });

    doctorRouter.post('/postPrescription' , (req,res,next) => {
        const service = registry.get('doctor');
         var body = req.body;
           var headerData = req.headers;
           var options = {
               body:body,
               headers: {headerData}
           }
           console.log("in post prescription")
           console.log(options);
            requestify.post("http://"+service.ip+":"+service.port+"/doctor/postPrescription",
                     options
                ).then(function(response) {
          // Get the response body
          return res.status(200).json(response.getBody());
        }).catch(function(err){
            console.log(err);
            return res.status(401).json(err);
        })
    })
module.exports.init = (serviceRegistry) =>{
    registry = serviceRegistry;
}

module.exports.router = doctorRouter;