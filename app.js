
const express = require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const session =require("express-session");
const passport=require("passport");
const passportlocalmongoose=require("passport-local-mongoose");
const app=express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    secret:"our little secret",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());


const mongoose=require("mongoose");
const { deserializeUser } = require("passport");
mongoose.connect("mongodb://0.0.0.0:27017/userDB",{useNewUrlParser:true}); 

    const userSchema= new mongoose.Schema({
        email:String,
        password:String
    });

    userSchema.plugin(passportlocalmongoose);
   
    const User= new mongoose.model("User",userSchema);

    passport.use(User.createStrategy());
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());


app.get("/",(req,res)=>{
    res.render("home")
});
app.get("/login",(req,res)=>{
    res.render("login")
});
app.get("/register",(req,res)=>{
    res.render("register")
});
app.get("/secrets",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("secrets");
    }
    else{
        res.redirect("/login");
    }
});
app.post("/register",(req,res)=>{
    User.register({username:req.body.username},req.body.password,(err,user)=>{
        if(err){
            // console.log(err);
            res.redirect("/register");
        }
        else{
          passport.authenticate("local")(req,res,()=>{
            res.redirect("/secrets");
          })
            }
           })
        
})

app.post("/login",(req,res)=>{
    const newuser= new User({
        username:req.body.username,
        password:req.body.password
    })
    req.login(newuser,(err)=>{
        if(err){
            consolo.log(err);
        }
        else{
            passport.authenticate("local");
            res.redirect("/secrets")
        };
    })
})

app.listen(3000);