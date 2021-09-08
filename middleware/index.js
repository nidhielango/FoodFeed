var Recipe = require("../models/recipes");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
}

// adding functions to the middleware object
middlewareObj.checkRecipeOwnership = function (req, res, next) {
    // check if user is logged in
    if (req.isAuthenticated()) {
        // check if it's the user's recipe
        Recipe.findById(req.params.id, function (err, foundRecipe) {
            // if there is an error or if foundRecipe is null
            if (err || !foundRecipe) {
                req.flash("error", "not found")
                res.redirect("back");
            } else {
                if (foundRecipe.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that :(")
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash("error", "You need to be logged in to do that!")
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    // check if user is logged in
    if (req.isAuthenticated()) {
        // check is it's the user's recipe
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("You don't have permission to do that")
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}

module.exports = middlewareObj;