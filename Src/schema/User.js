const mongoose = require("mongoose");

const User = mongoose.Schema(
  {
    GuildId: String,
    Member: String,
    Role: String,
    Executor: String,
    Name: String,
  },
  { minimize: false, collection: "User" }
);

module.exports = mongoose.model("User", User);