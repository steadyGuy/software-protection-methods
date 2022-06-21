import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import ejs from "ejs";

import router from "./routes";
import "./config/db";

const app = express();

// https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// TODO: Change asterisc for something more particular
app.use(cors({ credentials: true, origin: "*" }));
app.engine("html", ejs.renderFile);
app.use(express.static('public'));

// routes middleware
router.get("/", (_, res: express.Response) => {
  res.render(__dirname + "/views/index.html", {
    publicKey: process.env.GOOGLE_RECAPTCHA_PUBLIC_KEY,
  });
});
app.use("/api", router);

// turn on the server
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
