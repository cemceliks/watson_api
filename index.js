const express = require("express");
var cors = require("cors");
const { Client } = require("pg");
const app = express();

//Create connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "whoopy55",
  database: "watson_cms",
});

/* const Pool = require("pg").Pool;
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
}); */
/*   user: "cemcelik",
  host: "localhost",
  database: "watson",
  password: "whoopy55",
  port: 5432,
}); */
/* const Pool = require("pg").Pool;
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
}); */

// Connect
db.connect((err) => {
  if (err) throw err;
  console.log("Postgres connected");
});

// Middleware utilities
app.use(express.json());
app.use(cors());

app.get("/api/faqs", (req, res) => {
  const sql = `SELECT * FROM faqs
  ORDER BY faq_type_id, faq_id ASC;`;
  console.log("Running: " + sql);
  db.query(sql, function (err, result) {
    if (result) {
      console.log("Got result: " + result);
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
  const sql = `SELECT * FROM works 
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
