const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const config = require("./config/config");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Mysql Connected!");
});

app.use(cors());

app.get("/api/tablelist/getdata", (req, res) => {
  connection.query("SHOW FULL TABLES;", (err, results, fields) => {
    if (err) throw err;
    res.send(results);
  });
});

app.get("/api/tablelist/gettabledata/:name", (req, res) => {
  connection.query("SELECT * FROM " + req.params.name + ";", (err, results, fields) => {
    if (err) throw err;
    res.send(results);
  });
});

app.post("/api/tablelist/querysql", (req, res) => {
  connection.query(req.body.querys, (err, results, fields) => {
    if (err) {
      res.status(404).json({ noquery: "no query" });
    } else {
      res.send(results);
    }
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
