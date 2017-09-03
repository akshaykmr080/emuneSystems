'use strict';

var http = require('http');
var express = require('express');
var patientRouter = express.Router();
var requestify = require('requestify');
let registry = null;

    patientRouter.post('/register', (req,res,next) =>{
        const service = registry.get('patient');
            
            requestify.post("http://"+service.ip+":"+service.port+"/patient/register",req.body).then(function(response) {
          // Get the response body
          return res.status(200).json(response.getBody());
        }).catch(function(err){
            return res.status(500).json(err);
        })
    });

   patientRouter.post('/login', (req,res,next) =>{
           const service = registry.get('patient');
            requestify.post("http://"+service.ip+":"+service.port+"/patient/login",req.body).then(function(response) {
          // Get the response body
          return res.status(200).json(response.getBody());
        }).catch(function(err){
            console.log(err);
            return res.status(401).json(err);
        })
    }); 

     patientRouter.get('/me', (req,res,next) =>{
           const service = registry.get('patient');
           
           var headerData = req.headers;
           var options = {
               headers: headerData
           }
            requestify.get("http://"+service.ip+":"+service.port+"/patient/me", options).then(function(response) {
          // Get the response body
          console.log(response.getBody());
          return res.status(200).json(response.getBody());
        }).catch(function(err){
            console.log(err);
            return res.status(401).json(err);
        })
    });

    patientRouter.post('/me', (req,res,next) =>{
           const service = registry.get('patient');
           var body = req.body;
           var bodyOptions = {
               body
           }
           var headerData = req.headers;
           var options = {
               body:body,
               headers: {headerData}
           }
           //console.log(req.header('Authorization'));
            requestify.post("http://"+service.ip+":"+service.port+"/patient/me",
                     options
                ).then(function(response) {
          // Get the response body
          //console.log(response.getBody());
          return res.status(200).json(response.getBody());
        }).catch(function(err){
            console.log(err);
            return res.status(401).json(err);
        })
    });

    patientRouter.post('/medicalData',(req,res,next) => {
        const service = registry.get('patient');
           var body = req.body;
           var bodyOptions = {
               body
           }
           var headerData = req.headers;
           var options = {
               body:body,
               headers: {headerData}
           }
           //console.log(req.header('Authorization'));
            requestify.post("http://"+service.ip+":"+service.port+"/patient/medicalData",
                     options
                ).then(function(response) {
          // Get the response body
          //console.log(response.getBody());
          return res.status(200).json(response.getBody());
        }).catch(function(err){
            console.log(err);
            return res.status(401).json(err);
        })
    });

module.exports.init = (serviceRegistry) =>{
    registry = serviceRegistry;
}

module.exports.router = patientRouter;