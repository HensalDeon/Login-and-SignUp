const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const logger = require("morgan");
var exphbs = require("express-handlebars");

const indexRouter = require("./routes/index");
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
    "hbs",
    exphbs.engine({
        extname: "hbs",
        defaultLayout: "layout",
        layoutsDir: __dirname + "/views/",
        partialsDir: __dirname + "/views/partials/",
    })
);
app.engine(
    "adminHbs",
    exphbs.engine({
      extname: "hbs",
      defaultLayout: "homeLayout",
      layoutsDir: __dirname + "/views/layout/",
      partialsDir: __dirname + "/views/partials/",
    })
  );
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
// Configure session middleware
app.use(
    session({
        secret: "your-secret-key-here", // Replace with a secret key of your own
        resave: false,
        saveUninitialized: false,
    })
);
app.use((req, res, next) => {
    res.header("Cache-Control", "no-cache,private,no-Store,must-revalidate,max-scale=0,post-check=0,pre-check=0");
    next();
});

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
