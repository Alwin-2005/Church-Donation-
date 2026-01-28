const {getUser} = require("../services/auth");
const key = "ChurchDonation123";
async function restrictToLoggedinUserOnly(req,res,next){
    
    const authHeader = req.header("Authorization");
    if (!authHeader)
        return res.status(401).json({ message: "Access denied. No token provided." });

    const token = authHeader.split("Bearer ")[1];
    try {
        const decoded = getUser(token);
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }

}

module.exports = {
    restrictToLoggedinUserOnly
};

