import { Router } from "express";

const Routes = Router();

Routes.get("/health", (_, res) => {
  res.status(200).json({ message: "Everything's good!" });
});

export default Routes;
