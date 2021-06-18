const Schema = require("mongoose").Schema;

const apiDocSchema = new Schema({
  docName: String,
  elems: [
    {
      type: { type: String },
      value: String,
    },
  ],
});

module.exports = { apiDocSchema };
