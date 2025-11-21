const express = require("express");

router = express.Router();

router.get("/home", (req,res) => {
    console.log("Home page");
});

module.exports = router;