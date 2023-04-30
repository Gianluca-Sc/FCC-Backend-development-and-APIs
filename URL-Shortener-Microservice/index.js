require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const dns = require("dns");

// Basic Configuration

const port = process.env.PORT || 3000;

app.use(cors());
app.use("/public", express.static(`${process.cwd()}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Moongoose Schema
const urlSchema = new mongoose.Schema({
  original_url: { type: String, required: true, unique: true },
  short_url: { type: Number, required: true, unique: true },
});
const Url = mongoose.model("Url", urlSchema);

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/shorturl", async function (req, res) {
  try {
    const { url } = req.body;

    const urlObj = new URL(url);

    // check if is valid url or not
    dns.lookup(urlObj.hostname, async (err) => {
      if (err) return res.json({ error: "invalid url" });

      const count = await Url.find().count();
      const foundUrl = await Url.findOne({ original_url: url }).exec();

      // check if already exists in db
      if (foundUrl) {
        const { original_url, short_url } = foundUrl;
        return res.json({ original_url, short_url });
      } else {
        // create new collection in db
        const newUrl = await Url.create({
          original_url: url,
          short_url: count + 1,
        });
        return res.status(201).json({
          original_url: newUrl.original_url,
          short_url: newUrl.short_url,
        });
      }
    });
  } catch (error) {
    console.log(error);
    if (error.code === "ERR_INVALID_URL")
      return res.json({ error: "invalid url" });
  }
});

app.get("/api/shorturl/:short_url", async (req, res) => {
  try {
    const { short_url } = req.params;

    const result = await Url.findOne({ short_url: parseInt(short_url) }).exec();
    if (result) return res.redirect(result.original_url);
    else return res.status(404).json({ error: "not found" });
  } catch (error) {
    console.log(error);
  }
});

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(port, function () {
      console.log(`Listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
