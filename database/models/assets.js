const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
   name: String,
   image: String,
   id: String
});

const Asset = mongoose.model('asset', assetSchema);

module.exports = Asset;