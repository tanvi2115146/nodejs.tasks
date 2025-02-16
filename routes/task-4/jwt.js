const dotenv=require('dotenv')

const express= require('express')
const jwt= require('jsonwebtoken')
const port= 3000;


const secretkey = process.env.JWTSECRET;


const app= express();


app.get('/',(req,res)=>{
    res.send('welcome to jwt')
  })


app.post('/login',(req,res)=>{
    const user={
        id:1,
        username:'admin',
        email:'admin@gmail.com'
    }
    jwt.sign({user},secretkey,{expiresIn:'300s'},(err,token)=>{
        res.json({
            token
        })
    })
})

app.post('/profile',verifyToken,(req,res)=>{
    jwt.verify(req.token,secretkey,(err,authData)=>{
        if(err){
            res.send('Invalid Token')
        }else{
            res.json({
                message:'profile accessed',
                authData
            })
        }
    })
})

function verifyToken(req,res,next){
    const bearerHeader= req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearer= bearerHeader.split(' ');
        const bearerToken= bearer[1];
        req.token= bearerToken;
        next();
    }else{
        res.send('Token is not valid');
    }
}


  app.listen(port,()=>{
    console.log(`server is running on ${port}`);  
  })