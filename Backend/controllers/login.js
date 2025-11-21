const User = require("../models/user");
const {setUser} = require("../services/auth");

async function handleUserLogin(req,res){
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if(!user || password != user.passwordHash){
        return res.json({msg: "Incorrect email or password"});
    }

    const token = setUser(user);
    res.cookie("uuid", token);
    return res.status(200).json({msg: "logged in"});

}

module.exports = {
    handleUserLogin,
};