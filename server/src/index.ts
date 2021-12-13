import express from "express";
import dotenv from "dotenv";
// import path from "path";

import convert from "./convert";

const defaultPort = 4000;

dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", (_, res) => {
  res.status(200).json({ message: "Everything's good!" });
});

app.use("/convert", convert);

const port = process.env.PORT || defaultPort;
app.listen(port);
console.log(`Running an API server at localhost:${port}`);

// Uncomment to print routes
// const filepath = path.join(__dirname, "./../routes.generated.txt");
// require("express-print-routes")(app, filepath);
