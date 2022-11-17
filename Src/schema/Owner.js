const mongoose = require("mongoose");

const Owner = new mongoose.Schema(
  {
    GuildId: String,
    Member: String,
    TotalReg: Number,
    WomanReg: Number,
    ManReg: Number,
  },
  { minimize: false, collection: "Owner" }
);

module.exports = mongoose.model("Owner", Owner);