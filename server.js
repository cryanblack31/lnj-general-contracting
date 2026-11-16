const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// parse form data (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));
// parse JSON if you ever use it
app.use(express.json());

// serve static files (html, css, js, images)
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

// NEW: contact form endpoint
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;

  console.log("New contact form submission:");
  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Message:", message);
  console.log("-".repeat(40));

  // later: send email here
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

