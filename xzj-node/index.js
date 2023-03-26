const express = require("express");
const axios = require("axios");
const fs = require("fs");

const getFileName = require("./getFileName");

const app = express();
const port = 3000;

app.get("/download", (req, res) => {
  const imageUrl = req.query.imageUrl;
  if (!imageUrl) {
    res.status(400).send("No image URL provided!");
    return;
  }

  axios
    .get(imageUrl, { responseType: "arraybuffer" })
    .then((response) => {
      const imageBuffer = Buffer.from(response.data, "binary");

      const filename = getFileName(imageBuffer, imageUrl);

      fs.writeFileSync(filename, imageBuffer);

      res.send(`Image saved as ${filename}.`);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("应用实例，访问地址为 http://%s:%s", host, port);
});
