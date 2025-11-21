const express = require("express");
const PORT = 4000;
const User = require("./models/user");
const Donation = require("./models/donation");
const dCampaign = require("./models/donationCampaign");
const merch = require("./models/merchandise");
const content = require("./models/content");
const cart = require("./models/cart");
const order = require("./models/order");
const payment = require("./models/payment");
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

app.listen(PORT, () => {
    console.log("Server started at port ", PORT);
});