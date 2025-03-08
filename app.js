require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookiePaser = require("cookie-parser");

const Blog = require('./models/blog');

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express();
const PORT = process.env.PORT || 7306;

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to MongoDB!"))
    .catch((err) => {
        console.error("Failed to connect to MongoDB:", err.message);
        process.exit(1); // Exit the application if DB connection fails
    });

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: false }));
app.use(cookiePaser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

// Home Route
app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });
});

// This route should render the signup form (GET request)
app.get("/user/signup", (req, res) => {
    res.render("signup");
});

// Routes for user-related functionalities
app.use("/user", userRoute);
app.use("/blog", blogRoute);

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on PORT: ${PORT}`);
});
