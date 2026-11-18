const express = require("express");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

// FormData is sent as URL-encoded data by contact.html.
app.use(express.urlencoded({ extended: false, limit: "10kb" }));
app.use(express.json({ limit: "10kb" }));
app.use(express.static(__dirname));

app.get("/api/images", (req, res) => {
  const imgDir = path.join(__dirname, "images");

  fs.readdir(imgDir, (err, files) => {
    if (err) {
      console.error("Unable to read images folder:", err);
      return res.status(500).json({ error: "Unable to load images." });
    }

    const images = files.filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
    res.json(images);
  });
});

app.post("/contact", async (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";

  if (!name || !email || !message) {
    return res.status(400).json({ status: "error", message: "Please complete every field." });
  }

  if (name.length > 100 || email.length > 254 || message.length > 5000) {
    return res.status(400).json({ status: "error", message: "One or more fields are too long." });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ status: "error", message: "Please enter a valid email address." });
  }

  const { MAIL_USER, MAIL_PASSWORD, MAIL_FROM } = process.env;
  if (!MAIL_USER || !MAIL_PASSWORD || !MAIL_FROM) {
    console.error("Email configuration is incomplete. Set MAIL_USER, MAIL_PASSWORD, and MAIL_FROM.");
    return res.status(503).json({ status: "error", message: "Email is not configured yet." });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: { user: MAIL_USER, pass: MAIL_PASSWORD },
  });

  try {
    await transporter.sendMail({
      from: MAIL_FROM, // Must be a sender address verified in Brevo.
      to: "lnjgeneralcontracting@gmail.com",
      replyTo: email,
      subject: "New website contact form message",
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    return res.json({ status: "ok" });
  } catch (error) {
    console.error("Error sending contact email:", error.message);
    return res.status(500).json({ status: "error", message: "Failed to send email. Please try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
