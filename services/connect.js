const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/documentations", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("К базе подключился.");
  })
  .catch((err) => {
    throw new Error(`Не могу подключиться к базе ${err}`);
  });

module.exports = {
  db: mongoose,
};
