const mongoose = require("mongoose");
const config = require("../config/config");

const db = mongoose.createConnection(config.mongodb);

db.on("error", err => {
  console.error(err);
});

exports.db = db;
exports.Schema = mongoose.Schema;
