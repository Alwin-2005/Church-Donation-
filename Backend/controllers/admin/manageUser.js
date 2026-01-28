const User = require("../../models/user");
const validator = require("validator");
async function handleGetAllUsersInfo(req,res){
    const Result = await User.find({});
    return res.status(201).json({Result});
}

async function handleAddNewUsers(req,res){
const phoneRegex = /^[6-9]\d{9}$/;
const status = "enabled";
    const {fullname, email, phoneNo, gender, dob, address, passwordHash, role} = req.body;
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }
    if (!phoneRegex.test(phoneNo)) {
        return res.status(400).json({ message: "Invalid phone number" });
    }
    
    try {
            await User.create({
            fullname,
            email,
            phoneNo,
            gender,
            dob,
            address,
            role,
            passwordHash,
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
    handleGetAllUsersInfo,
    handleAddNewUsers,
};