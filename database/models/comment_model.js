const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");

const commentSchema = new mongoose.Schema({
   content: String,
   name: String,
   image: String,
   time: String
});
commentSchema.plugin(timestamp);

const Comment = mongoose.model('comment', commentSchema);

module.exports = {
   Comment: Comment,
   commentSchema: commentSchema
}