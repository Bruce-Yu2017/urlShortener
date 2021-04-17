const express = require("express");
const path = require('path');
const router = express.Router();
const fs = require("fs");

const fileUrl = '../data/data.json';

router.get("/:code", (req, res) => {
  const code = req.params.code;
  fs.readFile(path.resolve(__dirname, fileUrl), (err, rawdata) => {
    if (err) {
      res.status(500).json(err);
    }
    const data = JSON.parse(rawdata);
    const found = data.find((url) => {
      return url.code === code;
    })
    if(data.length === 0 || !found) {
      res.status(404).json('Url not found')
    } else {
      return res.redirect(found.longUrl);
    }
  });
});

module.exports = router;
