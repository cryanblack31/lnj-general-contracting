const express = require("express");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 3000;

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // use TLS
  auth: {
    user: process.env.MAIL_USER,     // your Brevo SMTP login
    pass: process.env.MAIL_PASSWORD, // your Brevo SMTP key
  },
});

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
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  console.log("New contact form submission:");
  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Message:", message);
  console.log("-".repeat(40));

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: "lnjgeneralcontracting@gmail.com", // where you want to receive leads
    subject: `New contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    res.json({ status: "ok" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ status: "error", message: "Failed to send email" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
