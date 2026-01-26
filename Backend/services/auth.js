const jwt = require("jsonwebtoken");
const key = process.env.JWT_SECRET;

function setUser(User){
    const payload = {
        _id: User._id,
        email: User.email,
        role: User.role,
    };
    return jwt.sign(payload, key,{expiresIn: "1d"});
}

function getUser(token){
    if(!token) return null;
    try{
        return jwt.verify(token, key);
    }
    catch(error){return null;}
}

module.exports = {
    setUser,
    getUser,
};