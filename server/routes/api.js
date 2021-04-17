const express = require("express");
const path = require("path");
const validUrl = require("valid-url");
const shortid = require("shortid");
const router = express.Router();
const fs = require("fs");

const baseUrl = "http://localhost:5000";
const fileUrl = "../data/data.json";
const filePath = path.resolve(__dirname, fileUrl);

router.get("/all", (req, res) => {
  fs.readFile(filePath, (err, rawdata) => {
    if (err) {
      return res.status(500).json("Server error");
    }
    const data = JSON.parse(rawdata);
    res.status(200).json(data);
  });
});

router.post("/createUrl", (req, res) => {
  const { longUrl } = req.body;
  fs.readFile(filePath, (err, rawdata) => {
    if (err) {
      return res.status(500).json("Server error");
    }
    const data = JSON.parse(rawdata);
    const found = data.find((url) => {
      return url.longUrl === longUrl;
    });
    if (!found) {
      const urlCode = shortid.generate();
      const newUrl = `${baseUrl}/${urlCode}`;
      const urlObj = {
        code: urlCode,
        longUrl,
        shortenUrl: newUrl,
        date: new Date().getTime(),
      };
      data.push(urlObj);
      fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
          return res.status(500).json("Server error");
        }
        res.status(200).json(urlObj);
      });
    } else {
      res.status(200).json(found);
    }
  });
});

module.exports = router;
