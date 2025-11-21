const jwt = require("jsonwebtoken");
const key = "ChurchDonation123";

function setUser(User){
    const payload = {
        _id: User._id,
        email: User.email,
        role: User.role,
    };
    return jwt.sign(payload, key);
}

function getUser(token){
    if(!token) return null;
    return jwt.verify(token, key);
}

module.exports = {
    setUser,
    getUser,
};