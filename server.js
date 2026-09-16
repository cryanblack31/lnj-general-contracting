const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));


app.get("/api/images", (req, res) => {
  const imgDir = path.join(__dirname, "images");

  fs.readdir(imgDir, (err, files) => {
    if (err) return res.status(500).json({ error: "Unable to scan folder" });

    const images = files.filter(file =>
      file.match(/\.(jpg|jpeg|png|gif|webp)$/i)
    );

    res.json(images);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

