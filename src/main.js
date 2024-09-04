const express = require("express");
const { create } = require("express-handlebars");
const path = require("path");

const app = express();

const hbs = create({
  extname: ".hbs",
  defaultLayout: "main",
  partialsDir: path.join(__dirname, "views", "partial-custom"),
});

// set view engine to HANDLEBARS
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

// set static serve
app.use("/public", express.static(path.join(__dirname, "views", "public")));

app.get("/", (req, res) => {
  const query = req.query;

  if (query.tabName == "students") {
    return res.render("student", { title: "Student page", layout: "error" });
  }

  res.render("home", { title: "Home page" });
});

app.listen(4000, "localhost", console.log("listening 4000"));
