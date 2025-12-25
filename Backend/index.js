const express = require("express");
const {restrictToLoggedinUserOnly} = require("./middlewares/auth");
const PORT = 4000;

const adminRoute = require("./routes/admin");
const homeRoute = require("./routes/home");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/userRoute");

const {handleMemberRegistration,} = require("./controllers/register");
const {handleUserLogin,} = require("./controllers/login");
const {handleAdminRole,handleMemberRole} = require("./middlewares/roleCheck");

const app = express();
const mongoose = require("mongoose");
const {connectMongoDB} = require("./connection");

app.use(express.json());

connectMongoDB("mongodb://localhost:27017/ChurchDonation")
.then(console.log("Database connected"))
.catch((err) => console.log("Error occured", err));

app.use("/login",handleUserLogin);
app.use("/register",handleMemberRegistration);
app.use("/admin",restrictToLoggedinUserOnly,handleAdminRole,adminRoute);
app.use("/users",restrictToLoggedinUserOnly,userRoute);
app.use("/home",homeRoute);


app.listen(PORT, () => {
    console.log("Server started at port ", PORT);
});