const dotenv = require("dotenv");
dotenv.config({ path: "./Config/config.env" });
const mongoose = require("mongoose");
const app = require("./app");
const PORT = process.env.PORT;
const path = require("path");

mongoose
  .connect(process.env.CONN_STR, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Database has been connected");
  })
  .catch(() => {
    console.log("Database has not been connected");
  });

app.listen(PORT, () => {
  console.log("Server has been started on http://localhost:3000");
});
