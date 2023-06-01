const express = require("express");
const router = express.Router();
const { addUser, checkUserExists } = require("./userUtils");
const path = require("path");
const fs = require("fs");
const userData = require(path.join(__dirname, "../data/users.json"));

/* GET home/login page. */
router.get("/", function (req, res) {
    
    if (req.session.user) {
        res.redirect("/home");
        // res.render("home", { books, admin: true });
    } else {
        // res.redirect('/');
        res.render("login", { layout: "layout", title: "Login-Page" });
    }
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    // Find the user with the matching email in the JSON data
    const user = userData.find((user) => user.email === email);

    if (user) {
        if (user && user.password === password) {
            // Credentials are valid, store user details in the session
            req.session.user = user;
            // Credentials are valid, redirect to the dashboard page
            res.redirect("/home");
        } else {
            // Credentials are invalid, render the login page with an error message
            res.render("login", { layout: "layout", message: "Invalid credentials" });
        }
    } else {
        res.render("login", { layout: "layout", message: "Your email and password do not match" });
    }
});
/* GET signUp page. */
router.get("/signup", function (req, res) {
    if (req.session.user) {
        res.redirect("/");
    } else {
        res.render("signUp", { layout: "layout", title: "Sign-Up" });
    }
});

router.post("/signup", function (req, res) {
    const { email, password } = req.body;
    const newUser = { email, password };
    // Check if the user already exists
    const userExists = checkUserExists(newUser);
    if (userExists) {
        return res.status(409).render("signUp", {
            layout: "layout",
            success: false,
            message: "User already exists please login or use another email!",
        });
    } else {
        // Add user details to JSON file
        addUser(newUser);
        return res.status(200).render("signUp", {
            layout: "layout",
            success: true,
            message: "User registered successfully Please login!",
        });
    }
});
router.get("/home", (req, res) => {
    let books = [
        {
            name: "The Vines",
            category: "Books",
            description: "A novel by Shelly Nolden",
            image: "https://img.buzzfeed.com/buzzfeed-static/static/2021-03/19/22/asset/507aca16de1d/sub-buzz-4112-1616191267-40.jpg?downsize=700%3A%2A&output-quality=auto&output-format=auto",
        },
        {
            name: "Incredible Doom",
            category: "Books",
            description: "A novel by Mathew Bogart",
            image: "https://img.buzzfeed.com/buzzfeed-static/static/2021-03/22/18/asset/56aa04974c49/sub-buzz-8251-1616439599-10.jpg?crop=1609:2411;404,0&downsize=600:*&output-format=auto&output-quality=auto",
        },
        {
            name: "Mary Jane",
            category: "Books",
            description: "A novel by Jessica Anya",
            image: "https://img.buzzfeed.com/buzzfeed-static/static/2021-03/22/18/asset/8d6a3e9542d2/sub-buzz-8183-1616437731-15.jpg?downsize=600:*&output-format=auto&output-quality=auto",
        },
        {
            name: "Libertie",
            category: "Books",
            description: "A novel by Kaitlyn Greenidge",
            image: "https://img.buzzfeed.com/buzzfeed-static/static/2021-03/22/18/asset/c468f137d1f6/sub-buzz-8156-1616438254-19.jpg?downsize=600:*&output-format=auto&output-quality=auto",
        },
    ];
    if (req.session.user) {
        res.render("home", { layout: "homeLayout", books , admin:false});
    } else {
        res.redirect("/");
    }
});

router.get("/logout", function (req, res, next) {
    // Destroy the session and redirect to the login page
    req.session.destroy();
    res.redirect("/");
});

router.get("*", function (req, res) {
    res.redirect("/");
});

module.exports = router;
