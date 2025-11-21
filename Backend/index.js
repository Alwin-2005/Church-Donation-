const express = require("express");
const PORT = 4000;

const adminRoute = require("./routes/admin");
const homeRoute = require("./routes/home");
const authRoute = require("./routes/auth");

const app = express();
const mongoose = require("mongoose");
const {connectMongoDB} = require("./connection");

app.use(express.json());

connectMongoDB("mongodb://localhost:27017/ChurchDonation")
.then(console.log("Database connected"))
.catch((err) => console.log("Error occured", err));;

app.use("/",homeRoute);
app.use("/users",authRoute);
app.use("/admin",adminRoute);

app.listen(PORT, () => {
    console.log("Server started at port ", PORT);
});