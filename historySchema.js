const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    input: String,
    output: String,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("history", historySchema);
