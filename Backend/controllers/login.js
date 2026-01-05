const User = require("../models/user");
const {setUser} = require("../services/auth");
const bcrypt = require("bcrypt");

async function handleUserLogin(req,res){

    if(!req.body){
        return res.status(401).json({msg: "Please provide email and password"});
    }
    const {email, password} = req.body;
    const user = await User.findOne({email});
    
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if(!user || !isMatch){
        return res.status(401).json({msg: "Incorrect email or password"});
    }

    const token = setUser(user);
    //res.cookie("uuid", token);
    return res.json({token});

}

module.exports = {
    handleUserLogin,
};