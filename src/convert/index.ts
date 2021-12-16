import { Router } from "express";

import Get from "./Get";
import Post from "./Post";

const Routes = Router();

Routes.post("/", Post);
Routes.get("/:jobId", Get);

export default Routes;
