import express from "express";
import { create } from "express-handlebars"
import path from "path"
import { routes } from "./routes/index.routes.js";

const app = express();

const hbs = create({
  extname: ".hbs",
  // defaultLayout: "main",
  layoutsDir: path.join(process.cwd(), "src", "views", "layout"),
  partialsDir: path.join(process.cwd(), "src", "views", "partial-custom")
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");


app.use("/public", express.static(path.join(process.cwd(), "src", "views", "public")));
app.use("/uploads", express.static("uploads"));

app.set("views", path.join(process.cwd(), "src", "views"))

app.use('/api/v1', routes)

app.listen(4000, "localhost", console.log("listening 4000"));
