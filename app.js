const express = require("express"),
    app = express(),
    User = require("./models/user"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    flash = require("connect-flash"),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser");

// routes
const indexRoutes = require("./routes/index"),
    commentRoutes = require("./routes/comments"),
    recipeRoutes = require("./routes/recipes");

const port = process.env.PORT || 3000;
const databaseURL = process.env.DATABASEURL || "MONGODB_URI";

// local database
mongoose.connect(databaseURL, { useNewUrlParser: true,  useUnifiedTopology: true });

// ask express to listen for requests (start server)
app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Passport Configuration
app.use(require("express-session")({
    secret: "test",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// these methods are given by passport-local-mongoose
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// this function runs for every single route
// next() allows other things to happen afterwards
app.use(function(req,res,next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next(); 
});

app.use(indexRoutes);
app.use("/recipes/:id/comments", commentRoutes);
app.use("/recipes", recipeRoutes);


mongoose.set('useFindAndModify', false);


