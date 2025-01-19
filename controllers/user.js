const User = require("../models/user");
const {v4: uuidv4} = require("uuid");
const {setUser} = require("../service/auth");

async function handleUserSignup(req , res) {
    // Handle user signup
    const { name, email, password } = req.body;
    await User.create({ name, email, password });
    return res.redirect("/");   
}

async function handleUserLogin(req , res) {
    // Handle user signup
    const {email, password } = req.body;
    const user = await User.findOne({email, password });
    if(!user) return res.render("login", {
        error: "Invalid email or password"
    }); 

    const token = setUser(user);
    res.cookie("uid", token);
    return res.redirect("/");
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
}; 