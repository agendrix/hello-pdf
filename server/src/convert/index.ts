import { Router } from "express";
import Multer from "multer";

import Get from "./Get";
import Post from "./Post";

const Upload = Multer();
const Routes = Router();

Routes.post("", Upload.any(), Post);
Routes.get("/:jobId", Get);

export default Routes;
