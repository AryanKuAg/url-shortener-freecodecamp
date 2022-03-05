require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dns = require("dns");
const app = express();
var bodyParser = require("body-parser");

const shortUrl = {};

// Basic Configuration
const port = process.env.PORT || 3000;

var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", urlencodedParser, function (req, res) {
  let formData = req.body.url;
  formData = formData.toLowerCase();
  isThere = false;
  for (let i in shortUrl) {
    if (shortUrl[i] === formData) {
      isThere = true;
    }
  }
  if (!isThere) {
    // url does not exist
    shortUrl[Object.keys(shortUrl).length] = formData;
  }

  myUrl = 0;
  for (let i in shortUrl) {
    if (shortUrl[i] === formData) {
      myUrl = i;
    }
  }
  res.json({ original_url: formData, shortUrl: myUrl });
  // res.redirect("api/shorturl/?formdata=" + formData);
  // console.log("post", req.body.url);
});

// app.get("/api/shorturl", function (req, res) {
//   mydata = req.query.formdata;
//   original_url = "";
//   su = "";
//   isFound = false;
//   for (let i in shortUrl) {
//     if (shortUrl[i] === mydata) {
//       original_url = shortUrl[i];
//       su = i;
//       isFound = true;
//     }
//   }
//   if (isFound) {
//     res.json({ original_url: original_url, shortUrl: su });
//   } else {
//     res.send("Nothing found");
//   }
// });

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

// what to do
