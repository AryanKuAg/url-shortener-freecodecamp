require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dns = require("dns");
const app = express();
const validator = require("validator");

const shortUrl = {
  0: "https://www.google.com",
  1: "https://freeCodeCamp.org",
};

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(express.urlencoded());
app.use(express.json())

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", function (req, res) {
  let formData = req.body.url;
  formData = formData.trim();
  // console.log(validator.isURL(formData));

 
  let isCorrect = validator.isURL(formData);
 
 
  if (!isCorrect) {
    res.json({ error: "invalid url" });
  } else {
    formData = formData.toLowerCase();
    let isThere = false;
    for (let i in shortUrl) {
      if (shortUrl[i] === formData) {
        isThere = true;
      }
    }
    if (!isThere) {
      // url does not exist
      shortUrl[Object.keys(shortUrl).length] = formData;
    }}

  //   myUrl = 0;
  //   for (let i in shortUrl) {
  //     if (shortUrl[i] === formData) {
  //       myUrl = i;
  //     }
  //   }
  //   res.json({ original_url: formData, shortUrl: myUrl });

 res.json({pupu:'papa'})
});

app.get("/api/shorturl/:index", (req, res) => {
  let index = req.params.index;

  isMatch = false;
  url = "";
  for (let i in shortUrl) {
    
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