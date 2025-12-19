const User = require("../models/user");
const validator = require("validator");
const bcrypt = require("bcrypt")
const phoneRegex = /^[6-9]\d{9}$/;
const role = "externalMember";
const status = "enabled";

async function handleMemberRegistration(req,res){
    const {fullname, email, phoneNo, gender, dob, address, password} = req.body;
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }
    if (!phoneRegex.test(phoneNo)) {
        return res.status(400).json({ message: "Invalid phone number" });
    }

    const salt = await bcrypt.genSalt(10); 
    const hashed = await bcrypt.hash(password, salt);
    
    try {
            await User.create({
            fullname,
            email,
            phoneNo,
            gender,
            dob,
            address,
            role,
            passwordHash: hashed,
            status,
        });
        return res.status(200).json("msg: success");
    } 

    catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
    }  

}


module.exports = {
    handleMemberRegistration,
};