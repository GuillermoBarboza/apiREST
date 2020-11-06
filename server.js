require("dotenv").config();
const express = require("express");
const routes = require("./routes");

const app = express();
// PATH.JOIN porque sino el build de vercel(deploy) no entiende
const path = require("path");
const cors = require("cors");


app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(8000, () => {
  console.log("listening on 8000");
});
