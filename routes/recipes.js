var express = require("express");
var router = express.Router();
var Recipe = require("../models/recipes");
var middleware = require("../middleware")

//INDEX - show all recipes
router.get("/", function(req,res){
    // Get all recipes from DB
    Recipe.find({}, function(err,allRecipes){
        if(err){
            console.log(err);
        } else {
            res.render("recipes/index", {recipes:allRecipes});
        }
    });
});

// CREATE- add new recipe to database
// This route is used by the form in new.ejs
router.post("/" , middleware.isLoggedIn, function(req,res){
    // get data from form and add to recipes array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var ingredients = req.body.ingredients;
    var directions = req.body.directions;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newRecipe = {name: name, image: image, description: description, ingredients: ingredients, directions: directions, author: author};
    // Create a new recipe and save in database
    Recipe.create(newRecipe, function(err, newlyCreated){
        if (err){
            console.log(err);
        } else {
            // redirect back to recipes page 
            console.log(newlyCreated);
            res.redirect("/recipes");
        }
    });

});

//NEW- show form to create new recipe
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("recipes/new");
})

//SHOW- shows more info about one recipe
router.get("/:id",function(req,res){
    // find the recipe with provided ID
    Recipe.findById(req.params.id).populate("comments").exec(function(err, foundRecipe){
        if(err){
            console.log(err);
        } else {
            //pass in the recipe we found using the database query
            res.render("recipes/show", {recipe:foundRecipe}); 
        }
    });
});

// EDIT RECIPE ROUTE
router.get("/:id/edit", middleware.checkRecipeOwnership ,function(req, res){
    Recipe.findById(req.params.id, function(err, foundRecipe){
        res.render("recipes/edit", {recipe: foundRecipe});
    });
});

// UPDATE RECIPE ROUTE- form submits here from edit
router.put("/:id", middleware.checkRecipeOwnership, function(req,res){
    // find and update correct recipe
    Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, function(err,updatedRecipe){
        if(err){
            res.redirect("/recipes");
        } else {
            // redirect to show recipes page
            res.redirect("/recipes/" + req.params.id);
        }
    });
});

// REMOVE RECIPE ROUTE
router.delete("/:id",middleware.checkRecipeOwnership,function(req,res){
    Recipe.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/recipes");
        } else {
            res.redirect("/recipes");
        }
    });
});

module.exports = router;