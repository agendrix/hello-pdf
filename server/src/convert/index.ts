import { Router } from "express";
import Multer from "multer";

import Post from "./Post";
import Get from "./Get";

const Upload = Multer();
const Routes = Router();

Routes.post("", Upload.none(), Post);
Routes.get("/:jobId", Get);

export default Routes;
