const express = require("express");
const urlRoute = require("./router/url")
const {connectToMongoDB} = require("./connect")
const cookieParser = require("cookie-parser");
const path = require("path");
const {restrictTo, checkForAuthentication} = require("./middleware/auth");


const URL = require("./models/url");
const staticRoute = require("./router/staticRouter");
const userRoute = require("./router/user");

const app = express();
// Replace this with your actual MongoDB Atlas connection string
const MONGODB_URI = "mongodb+srv://admin:your_secure_password@cluster0.mongodb.net/short-url?retryWrites=true&w=majority";

// Replace this with your preferred port, but allow dynamic assignment for deployment
const PORT = process.env.PORT || 8001;

//connecting MongoDB
 
connectToMongoDB(MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));


//Setting UI using Ejs and runnning it
app.set("view engine", "ejs");
app.set("views",path.resolve("./views"));

app.use(express.json()); //support json data
app.use(express.urlencoded({extended:false})); //support form data
app.use(cookieParser());
app.use(checkForAuthentication);


//POST and GET url link and the analytics
app.use("/url",restrictTo(["NORMAL"]),urlRoute);
app.use("/user",userRoute);
app.use("/", staticRoute);

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
