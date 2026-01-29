const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const { restrictToLoggedinUserOnly } = require("./middlewares/auth");
const PORT = process.env.PORT;
const MongoDB = process.env.MONGODB_URI;
const cors = require("cors");
const cookieParser = require("cookie-parser");


const adminRoute = require("./routes/admin");
const homeRoute = require("./routes/home");
const userRoute = require("./routes/userRoute");
const uploadRoute = require("./routes/upload");
const paymentRoutes = require("./routes/paymentRoutes");

const { handleMemberRegistration, } = require("./controllers/register");
const { handleUserLogin, } = require("./controllers/login");
const { handleForgotPassword, handleResetPassword } = require("./controllers/passwordReset");
const { handleAdminRole } = require("./middlewares/roleCheck");

const app = express();
const mongoose = require("mongoose");
const { connectMongoDB } = require("./connection");

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());


connectMongoDB(MongoDB)
  .then(console.log("Database connected"))
  .catch((err) => console.log("Error occured", err));

app.use("/api/login", handleUserLogin);
app.use("/api/register", handleMemberRegistration);
app.post("/api/forgot-password", handleForgotPassword);
app.post("/api/reset-password/:token", handleResetPassword);
app.use("/api/admin", restrictToLoggedinUserOnly, handleAdminRole, adminRoute);
//app.use("/api/users",restrictToLoggedinUserOnly,userRoute);
//app.use("/api/admin",adminRoute);
app.use("/api/users", userRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/payment", paymentRoutes);
app.use("/api/home", homeRoute);


app.listen(PORT, () => {
  console.log("Server started at port ", PORT);
});