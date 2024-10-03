require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const admin = require("./Routes/Admin/authRoute");
const user = require("./Routes/User/authUser");
const instructor = require("./Routes/User/Instructor/profileRoute");
const student = require("./Routes/User/User/studentProfile");

const db = require("./Models");

db.sequelize
  .sync()
  .then(() => {
    // console.log('Database is synced');
  })
  .catch((err) => {
    // console.log(err);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/files", express.static("./Resource"));

app.use("/admin", admin);
app.use("/user", user);
app.use("/instructor", instructor);
app.use("/student", student);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/cors", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.send("Hello Cors World!");
});

PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
