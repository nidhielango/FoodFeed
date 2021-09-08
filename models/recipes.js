var mongoose = require("mongoose");

//Schema Set Up
var recipeSchema = mongoose.Schema({
    name: String,
    description: String,
    image: String,
    ingredients: String,
    directions: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Recipe",recipeSchema);