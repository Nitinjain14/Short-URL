const express = require("express");
const urlRoute = require("./router/url")
const {connectToMongoDB} = require("./connect")
const cookieParser = require("cookie-parser");
const path = require("path");
const {restrictToLoginUserOnly,checkAuth} = require("./middleware/auth");


const URL = require("./models/url");

const staticRoute = require("./router/staticRouter");
const userRoute = require("./router/user");

const app = express();
const PORT = 8001;

//connecting MongoDB
connectToMongoDB("mongodb://localhost:27017/short-url")
.then(()=>console.log("mongo connected"));

//Setting UI using Ejs and runnning it
app.set("view engine", "ejs");
app.set("views",path.resolve("./views"));

app.use(express.json()); //support json data
app.use(express.urlencoded({extended:false})); //support form data
app.use(cookieParser());


//POST and GET url link and the analytics
app.use("/url",restrictToLoginUserOnly,urlRoute);
app.use("/user",userRoute);
app.use("/",checkAuth, staticRoute);

//TGET request to /url/analytics/:shortId to retrieve analytics for a specific shortened URL.
app.get("/url/:shortId" ,async(req,res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    },{$push : {
        visitHistory: {
            timestamp : Date.now()
        },
    },
});
res.redirect(entry.redirectURL);
});

app.listen(PORT,() => console.log(`Port running on ${PORT}`));
