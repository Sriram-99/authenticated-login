const express = require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const encrypt=require("mongoose-encryption");
const mongoose=require("mongoose");
mongoose.connect("mongodb://0.0.0.0:27017/userDB",{useNewUrlParser:true}); 
    const userSchema= new mongoose.Schema({
        email:String,
        password:String
    });
    const chinna="thisisfuntolearn";
    userSchema.plugin(encrypt,{secret:chinna,
       encryptedFields:["password"] });
    const User= new mongoose.model("User",userSchema);

const app=express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.render("home")
});
app.get("/login",(req,res)=>{
    res.render("login")
});
app.get("/register",(req,res)=>{
    res.render("register")
});
app.post("/register",(req,res)=>{
    const newuser=new User({
        email:req.body.username,
        password:req.body.password
    });
    newuser.save((err)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("secrets")
        }
    })
})

app.post("/login",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    User.findOne({email:username},(err,foundlist)=>{
        if(!foundlist){
                res.send("user not found");
        }
        else{
            if(foundlist.password===password){
                res.render("secrets");
            }
            else{
                res.send("user not found")
            }
        }
    })
   
})

app.listen(3000);