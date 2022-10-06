require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dns = require("dns");
const app = express();
const validator = require("validator");
const mongoose = require("mongoose");
const internal = require("stream");
mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.l3ja2io.mongodb.net/?retryWrites=true&w=majority"
);

const Url = mongoose.model("Url", { original_url: String, short_url: Number });

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(express.urlencoded());
app.use(express.json());

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", async function (req, res) {
  let formData = req.body.url;
  formData = formData.trim();

  let isCorrect = validator.isURL(formData);

  if (!isCorrect) {
    res.json({ error: "invalid url" });
  } else {
    // steps
    // 1) Store exact data in mongodb
    // 2) Send saved response
    formData = formData.toLowerCase();
    const totalDocsInUrlCollection = await Url.countDocuments();
    const webUrl = new Url({
      original_url: formData,
      short_url: totalDocsInUrlCollection,
    });
    const savedData = await webUrl.save();

    res.json({
      original_url: savedData["original_url"],
      short_url: savedData["short_url"],
    });
  }
});

app.get("/api/shorturl/:index", async (req, res) => {
  try {
    let index = req.params.index;
    const data = await Url.findOne({ short_url: parseInt(index) });

    if (data) {
      res.redirect(data["original_url"]);
    } else {
      res.json({ error: "No short URL found for the given input" });
    }
  } catch (e) {
    res.json({ error: "No short URL found for the given input" });
  }
});

app.get("*", (req, res) => {
  res.send("Not Found");
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
