const express= require('express')

const crypto = require("./crypto")
const jwt = require('jsonwebtoken');

const validatePayload = ({rule})=>{
    return async (req, res, next)=>{
        try{
            const {perfectPayloadV1} = await import("perfect-payload");
            const{statusCode, ...response}= perfectPayloadV1(req?.body, rule);

            if(+statusCode >= 200 && +statusCode <=299){
                next ();
            }else{
                res.status(statusCode).json(response);
            }
        }catch(error){
            console.error("Error validating payload", error);
            res.status(500).json({error:"Internal server error"})
        }
    }
}

async function verifyUserToken(req, res, next){
    try{
        const token = req.headers.authorization;
        if(!token){
            return res.status(401).json({message:"Token is missing"})
        }
        const decoded = crypto.verifyToken(token)
        req.user= decoded;
        next();
        }catch(error){
            console.log(error);
            return res.status(401).json({message:"Invalid token"})
        }
    }


    module.exports = {validatePayload, verifyUserToken}