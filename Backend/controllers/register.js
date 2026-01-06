const User = require("../models/user");
const validator = require("validator");
const bcrypt = require("bcrypt")
const phoneRegex = /^[6-9]\d{9}$/;
const role = "externalMember";
const status = "enabled";

async function handleMemberRegistration(req,res){
    const {fullName, email, phoneNo, gender, dob, password} = req.body;
    //console.log("variables",fullName, email, phoneNo, gender, dob, password);
    if (!validator.isEmail(email)) {
        return res.status(409).json({ message: "Invalid email format" });
    }
    if (!phoneRegex.test(phoneNo)) {
        return res.status(409).json({ message: "Invalid phone number" });
    }

    const result = await User.find({email});
    if(result.length > 0){
        return res.status(409).json({message: "Email already exists, do you want to login?"});
    }
    

    const salt = await bcrypt.genSalt(10); 
    const hashed = await bcrypt.hash(password, salt);
    
    try {
            await User.create({
            fullname: fullName,
            email,
            phoneNo,
            gender,
            dob,
            role,
            passwordHash: hashed,
            status,
        });
        return res.status(201).json("msg: Account created successfully");
    } 

    catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
    }  

}


module.exports = {
    handleMemberRegistration,
};