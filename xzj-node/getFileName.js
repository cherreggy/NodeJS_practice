const crypto = require("crypto");
const path = require("path");

const getFileName = (imageBuffer, imageUrl) => {
  const hash = crypto.createHash("md5");
  hash.update(imageBuffer);
  const filename = `${hash.digest("hex")}${path.extname(imageUrl)}`;

  return path.resolve(__dirname, "data", filename);
};

module.exports = getFileName;
