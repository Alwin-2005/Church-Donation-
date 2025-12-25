async function handleAdminRole(req,res,next){
    const role = req.user.role;
    if(role != "admin"){
        return res.status(403).json({ message: "Forbidden" });
    }
     next();
    
}

async function handleMemberRole(req,res,next){
    const role = req.user.role;
    if(role != "churchMember"){
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
}


module.exports = {
    handleAdminRole,
    handleMemberRole,
}