const mongoose = require("mongoose");
const comment = require("../models/comment_model");
const timestamp = require("mongoose-timestamp");

const blogSchema = new mongoose.Schema({
   title: String,
   content: String,
   name: String,
   image: String,
   category: String,
   user_id: String,
   comment: [comment.commentSchema]
});
blogSchema.plugin(timestamp);

const Blog = mongoose.model("blog", blogSchema);

module.exports = {
    Blog: Blog,
    blogSchema: blogSchema
}