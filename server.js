const express=require("express")
const mongoose=require("mongoose")
const app=express()
const cors=require("cors")
app.use(cors())
app.use(express.json())
mongoose.connect("mongodb://localhost:27017/authenticate")
.then(()=>{
    console.log("Connected to mongodb")
})
.catch(()=>{
    console.log("couldn`t connect")
})
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    contactnumber:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }, 
})
const User=mongoose.model("User", userSchema)
app.get("/", (req, res)=>{
    res.send("Homepage")
})
app.post("/signup", (req, res)=>{
    const {email, name, password, number}=req.body
    new User ({
        name:name,
        email:email,
        contactnumber:number,
        password:password
    }).save()
    .then(()=>res.status(201).json({message:'User created successfully'}))
    .catch(()=>res.status(400).json({error:"User already exists"})) 
})
app.post("/login", (req, res)=>{
    const {email, password}=req.body
    User.findOne({email, password})
    .then((user)=>{
        if(user){
            return res.status(200).json({message:"login successsful"})
        }
        else{
            return res.status(400).json({message:"Invalid email or password"})
        }
    })
    .catch((e)=>res.status(500).json({error:"Error during login"}))
})
app.listen(4000)
