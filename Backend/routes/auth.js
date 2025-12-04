const express = require("express");
const {handleMemberRegistration,} = require("../controllers/register");
const {handleUserLogin,} = require("../controllers/login");
router = express.Router();

//router.post("/register",handleMemberRegistration);
//router.post("/login",handleUserLogin);

module.exports = router;