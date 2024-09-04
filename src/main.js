import express from "express";
import { create } from "express-handlebars"
import path from "path"

const app = express();

const hbs = create({
  extname: ".hbs",
  defaultLayout: "main",
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");


app.use("/public", express.static(path.join(process.cwd(), "views", "public")));

app.set("views",path.join(process.cwd(),"src","views"))


app.get("/", (req, res) => {
  const query = req.query;
const products = [{
  id: 1,
  title: "Otkan kunlar",
  description: "Otkan kunlar kitobi ",
  price: 55000,
  rating: 10,
  brend: "Shifo nashr"
}]
const  categories = [
  {
    id:1,
    name: "kitoblar",
    img_url: "/url"
  }

]
  if (query.tabName == "category") {
    return res.render("category", {categories});
  }
  res.render("home", { title: "Home page",categories });
});

app.listen(4000, "localhost", console.log("listening 4000"));
