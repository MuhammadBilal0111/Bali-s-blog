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
const __dirname = path.resolve(); // __dirname get the directory name where the project is available
console.log(__dirname);

app.listen(PORT, () => {
  console.log("Server has been started on http://localhost:3000");
});
