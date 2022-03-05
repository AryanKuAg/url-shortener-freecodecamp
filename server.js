require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dns = require("dns");
const app = express();
var bodyParser = require("body-parser");
const Validator = require("validator");

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
  formData = formData.trim();
  // let isCorrect = Validator.isURL(formData);
  let isCorrect =
    formData.includes("http") &&
    formData.includes(".") &&
    formData.includes("/");
  // console.log(formData.toString());
  // dns.lookup(formData.toString(), (err, value) => {
  //   if (!err) {
  //     console.log(value);
  //   } else {
  //     console.log("error");
  //   }
  // });
  // console.log("df", formData);
  // console.log("iscorrect", isCorrect.callback());

  // dns.lookup(formData, function (err, address, family) {
  //   console.log("err", err);
  //   console.log("address", address);
  //   console.log("family", family);
  // });
  if (!isCorrect) {
    res.json({ error: "invalid url" });
  } else {
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
  }
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

app.get("/api/shorturl/:index", (req, res) => {
  let index = req.params.index;

  isMatch = false;
  url = "";
  for (let i in shortUrl) {
    // console.log("key", typeof i);
    // console.log("value", shortUrl[i]);
    // console.log("index", typeof index);
    // console.log("--------------------");
    if (index === i) {
      // console.log("match");
      isMatch = true;
      url = shortUrl[i];
    }
  }
  if (isMatch) {
    res.redirect(url);
  } else {
    res.json({ error: "No short URL found for the given input" });
  }
});

app.get("*", (req, res) => {
  res.send("Not Found");
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

// what to do
