const express = require("express");
var cors = require("cors");
const mysql = require("mysql8");
const app = express();

//Create connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "whoopy55",
  database: "watson_cms",
});

// Connect
db.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected");
});

// Middleware utilities
app.use(express.json());
app.use(cors());

app.get("/api/faqs", (req, res) => {
  const sql = `SELECT * FROM faqs f JOIN faq_types ft USING (faq_type_id)
  ORDER BY faq_type_id, updated_at ASC;`;
  db.query(sql, function (err, result) {
    if (result) {
      const faqs = new Promise((resolve, reject) => {
        if (err) {
          reject("Failed with the message: ", err);
        } else {
          resolve(res.status(200).send(result));
        }
      });
    }
  });
});

app.get("/api/works/:type", (req, res) => {
  const type_id = req.params.type;
  const sql = `SELECT * FROM works w JOIN work_types wt 
  USING (work_type_id)
  WHERE work_type_id=${type_id} ORDER BY order_id;`;
  db.query(sql, function (err, result) {
    if (result) {
      const works = new Promise((resolve, reject) => {
        if (err) {
          reject("Failed with the message: ", err);
        } else {
          resolve(res.status(200).send(result));
        }
      });
    }
  });
});

app.get("/api/works/:typeId/:name", (req, res) => {
  const typeId = req.params.typeId;
  let name = req.params.name;
  let sql = "";
  if (name === "intro") {
    sql = `SELECT * FROM works 
    WHERE work_type_id=${typeId} ORDER BY order_id ASC LIMIT 1`;
  } else {
    name = getTitleFromSlug(name);
    sql = `SELECT * FROM works 
    WHERE work_type_id=${typeId} AND title LIKE '${name}%'`;
  }

  db.query(sql, function (err, result) {
    if (result) {
      const work = new Promise((resolve, reject) => {
        if (err) {
          reject("Failed with the message: ", err);
        } else {
          resolve(res.status(200).send(result));
        }
      });
    }
  });
});

function getTitleFromSlug(str) {
  return str.split("-")[0].toUpperCase();
}

const port = process.env.PORT || 3001;
app.listen(3001, () => console.log(`listening on port ${port}...`));
