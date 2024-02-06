const path = require("path");
const { uploadByBuffer } = require("telegraph-uploader");
const express = require("express");
const multer = require("multer");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { prisma } = require("./utils/prisma");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array("dokumen", 3);
const randoms = (length = 25) => Math.random().toString().substr(2, length);

app.get("/", async (req, res) => {
  const list_data = await prisma.pendaftar.findMany({});
  res.render("home", { list_data });
});

app.post("/insert", upload, async (req, res) => {
  let docs = [];
  for (let i = 0; i < req.files.length; i++) {
    let x = req.files[i];
    let hosting = await uploadByBuffer(x.buffer).then((x) => {
      docs.push(x.link);
    });
  }

  if (docs.length > 0) {
    const insert = await prisma.pendaftar.create({
      data: {
        id: randoms(),
        ...req.body,
        dokumen: docs,
      },
    });
    res.redirect("/");
  }
});

app.post("/delete", async (req, res) => {
  try {
    const deletes = await prisma.pendaftar.delete({
      where: {
        id: req.body.id,
      },
    });
    res.redirect("/");
  } catch (e) {
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
