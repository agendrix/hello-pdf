import { Router } from "express";
import post from "./post";
import get from "./get";

const routes = Router();
routes.post("", post);
routes.get("/:jobId", get);

export default routes;
