require('dotenv').config();
const express = require('express');
const routes = require('./routes')
const cors = require('cors')
const app = express();
// PATH.JOIN porque sino el build de vercel(deploy) no entiende
const path = require('path')

app.use(cors())
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.use(routes)

app.listen(8000, () => {
  console.log("listening on 8000");
});
